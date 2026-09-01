const FOLDER_NAME = 'keeperpass';
const FILE_NAME = 'vault.json.enc';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const CHUNK_BYTES = 256 * 1024;

type DriveFile = { id: string; name?: string };

/** Every Drive-touching call site catches this specifically and force-disconnects the session. */
class GoogleAuthExpiredError extends Error {
  constructor() {
    super('Google access token expired or was revoked.');
    this.name = 'GoogleAuthExpiredError';
  }
}

async function assertOk(response: Response): Promise<void> {
  if (response.status === 401) {
    throw new GoogleAuthExpiredError();
  }
  if (!response.ok) {
    throw new Error(`Google Drive request failed: ${response.status} ${response.statusText}`);
  }
}

async function driveGet(accessToken: string, query: string): Promise<{ files: DriveFile[] }> {
  const url = `${FILES_URL}?q=${encodeURIComponent(query)}&fields=${encodeURIComponent('files(id,name)')}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await assertOk(response);
  return response.json();
}

async function findFolder(accessToken: string): Promise<string | null> {
  const query = `name='${FOLDER_NAME}' and mimeType='${FOLDER_MIME_TYPE}' and trashed=false`;
  const { files } = await driveGet(accessToken, query);
  return files[0]?.id ?? null;
}

async function findFile(accessToken: string, folderId: string): Promise<DriveFile | null> {
  const query = `name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`;
  const { files } = await driveGet(accessToken, query);
  return files[0] ?? null;
}

async function createFolder(accessToken: string): Promise<string> {
  const response = await fetch(FILES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: FOLDER_MIME_TYPE }),
  });
  await assertOk(response);
  const created: DriveFile = await response.json();
  return created.id;
}

async function findOrCreateFolder(accessToken: string): Promise<string> {
  const existing = await findFolder(accessToken);
  return existing ?? (await createFolder(accessToken));
}

/** Opens a resumable upload session, either creating a new file under `folderId` (no `fileId`) or replacing an existing file's content (`fileId` given). */
async function startResumableSession(
  accessToken: string,
  { fileId, folderId, fileName }: { fileId?: string; folderId?: string; fileName?: string }
): Promise<string> {
  const url = fileId
    ? `${UPLOAD_URL}/${fileId}?uploadType=resumable`
    : `${UPLOAD_URL}?uploadType=resumable`;
  const metadata = fileId
    ? {}
    : { name: fileName ?? FILE_NAME, parents: folderId ? [folderId] : undefined };

  const response = await fetch(url, {
    method: fileId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(metadata),
  });
  await assertOk(response);

  const location = response.headers.get('Location');
  if (!location) {
    throw new Error('Google Drive did not return a resumable upload session URI.');
  }
  return location;
}

async function uploadInChunks(
  sessionUrl: string,
  bytes: Uint8Array,
  onProgress?: (fraction: number) => void
): Promise<DriveFile> {
  const total = bytes.length;
  let uploaded = 0;

  while (uploaded < total) {
    const end = Math.min(uploaded + CHUNK_BYTES, total);
    const chunk = bytes.subarray(uploaded, end);

    const response = await fetch(sessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Length': String(chunk.length),
        'Content-Range': `bytes ${uploaded}-${end - 1}/${total}`,
      },
      // RN's fetch accepts a raw Uint8Array body at runtime; the bundled RN type defs just don't declare it.
      body: chunk as unknown as BodyInit,
    });

    if (response.status === 308) {
      const range = response.headers.get('Range');
      uploaded = range ? Number(range.split('-')[1]) + 1 : end;
      onProgress?.(uploaded / total);
      continue;
    }

    await assertOk(response);
    onProgress?.(1);
    return response.json();
  }

  throw new Error('Upload completed without a final response from Google Drive.');
}

async function vaultExists(accessToken: string): Promise<boolean> {
  const folderId = await findFolder(accessToken);
  if (!folderId) return false;
  return (await findFile(accessToken, folderId)) !== null;
}

async function loadVault(accessToken: string): Promise<string | null> {
  const folderId = await findFolder(accessToken);
  if (!folderId) return null;
  const file = await findFile(accessToken, folderId);
  if (!file) return null;

  const response = await fetch(`${FILES_URL}/${file.id}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await assertOk(response);
  return response.text();
}

async function saveVault(
  accessToken: string,
  content: string,
  onProgress?: (fraction: number) => void
): Promise<void> {
  const folderId = await findOrCreateFolder(accessToken);
  const existing = await findFile(accessToken, folderId);
  const bytes = new TextEncoder().encode(content);

  const sessionUrl = await startResumableSession(
    accessToken,
    existing ? { fileId: existing.id } : { folderId }
  );
  await uploadInChunks(sessionUrl, bytes, onProgress);
}

/** Renames the current vault file to a timestamped backup (kept, not deleted), then creates a fresh one under the canonical name. Used by /recover. */
async function resetVault(
  accessToken: string,
  content: string,
  onProgress?: (fraction: number) => void
): Promise<void> {
  const folderId = await findOrCreateFolder(accessToken);
  const existing = await findFile(accessToken, folderId);

  if (existing) {
    const response = await fetch(`${FILES_URL}/${existing.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `vault.backup-${Date.now()}.json.enc` }),
    });
    await assertOk(response);
  }

  const bytes = new TextEncoder().encode(content);
  const sessionUrl = await startResumableSession(accessToken, { folderId });
  await uploadInChunks(sessionUrl, bytes, onProgress);
}

/** Renames the vault file out of the way (kept, not deleted) without creating a replacement — for a future "remove this device"/detach flow. */
async function detachVault(accessToken: string): Promise<void> {
  const folderId = await findFolder(accessToken);
  if (!folderId) return;
  const existing = await findFile(accessToken, folderId);
  if (!existing) return;

  const response = await fetch(`${FILES_URL}/${existing.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: `vault.removed-${new Date().toISOString()}.json.enc` }),
  });
  await assertOk(response);
}

export {
  detachVault,
  FILE_NAME,
  FOLDER_NAME,
  GoogleAuthExpiredError,
  loadVault,
  resetVault,
  saveVault,
  vaultExists,
};
