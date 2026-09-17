import { inject, Injectable } from '@angular/core';
import { I18nService } from '../i18n';

const FOLDER_NAME = 'keeperpass';
const FILE_NAME = 'vault.json.enc';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * Drive's resumable-upload protocol requires chunk sizes to be a multiple of
 * 256 KiB (the final chunk excepted) — see
 * https://developers.google.com/workspace/drive/api/guides/manage-uploads.
 * The smallest legal value is used on purpose: it's the finest granularity
 * the API allows, so progress is as smooth as the protocol permits.
 */
const CHUNK_BYTES = 256 * 1024;

interface DriveFileRef {
  id: string;
}

/**
 * What a detached vault is called: readable in a Drive listing, and sortable
 * next to the file it used to be. Seconds are in there because two attempts on
 * the same day would otherwise produce two files with the same name — Drive
 * allows that, and it would leave the user guessing which is which.
 */
function detachedFileName(now: Date): string {
  const stamp = now.toISOString().slice(0, 19).replace(/[:]/g, '-');
  return `vault.removed-${stamp}.json.enc`;
}

/**
 * Thrown whenever a Drive call comes back `401` — the access token Google
 * issued at sign-in has expired or been revoked. There's no refresh-token
 * flow here (see `SessionStore`'s own doc comment), so the only recovery is
 * disconnecting and reconnecting for a fresh one; every call site that talks
 * to Drive catches this specifically and does exactly that — see
 * `disconnectExpiredSession()`.
 */
export class GoogleAuthExpiredError extends Error {
  constructor(message = 'Your Google session has expired. Please reconnect.') {
    super(message);
    this.name = 'GoogleAuthExpiredError';
  }
}

/** Called with how much of the upload has been sent, from `0` to `1`. */
export type UploadProgressHandler = (fraction: number) => void;

/**
 * Real Google Drive v3 REST calls, scoped around one invariant: there is
 * always exactly one `keeperpass` folder and, inside it, exactly one *active*
 * vault file (`vault.json.enc`). `loadVault`/`saveVault` find-or-create both,
 * rather than blindly creating a new file every time. `resetVault` is the one
 * exception to "exactly one file" — it renames the old active file out of the
 * way instead of deleting it, so a forgotten-secret reset leaves a recoverable
 * trail rather than destroying data outright.
 *
 * Takes an access token rather than requesting its own — it comes from
 * `AuthService.signInWithGoogle`, which already asked for `drive.file`
 * alongside sign-in, so there's no separate consent popup here.
 */
@Injectable({ providedIn: 'root' })
export class GoogleDriveService {
  private readonly i18n = inject(I18nService);

  /** The encrypted vault's contents, or `null` if this is the first time (no folder/file yet). */
  async loadVault(accessToken: string): Promise<string | null> {
    const folderId = await this.findFolder(accessToken);
    if (!folderId) {
      return null;
    }

    const file = await this.findFile(accessToken, folderId);
    if (!file) {
      return null;
    }

    return this.downloadFile(accessToken, file.id);
  }

  /**
   * Whether a vault file already exists, without downloading it.
   *
   * Two metadata queries and no payload — deliberately not `loadVault()`,
   * which would pull the whole (potentially large) file just to answer a
   * yes/no question, and then have it downloaded again on submit. Used to
   * decide between `/unlock` and `/setup`.
   */
  async vaultExists(accessToken: string): Promise<boolean> {
    const folderId = await this.findFolder(accessToken);
    if (!folderId) {
      return false;
    }

    return (await this.findFile(accessToken, folderId)) !== null;
  }

  /** Creates the `keeperpass` folder/file if this is the first save, or overwrites the existing file otherwise. */
  async saveVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    const folderId = (await this.findFolder(accessToken)) ?? (await this.createFolder(accessToken));
    const file = await this.findFile(accessToken, folderId);

    if (file) {
      await this.updateFile(accessToken, file.id, content, onProgress);
    } else {
      await this.createFile(accessToken, folderId, content, onProgress);
    }
  }

  /**
   * For a forgotten secret: there's no way to recover data encrypted under a
   * secret nobody remembers, so this doesn't try. Instead it renames the
   * existing file out of `vault.json.enc`'s way (a timestamped backup, kept
   * in case the secret is ever remembered) and creates a fresh, empty vault
   * under the new one.
   */
  async resetVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    const folderId = (await this.findFolder(accessToken)) ?? (await this.createFolder(accessToken));
    const file = await this.findFile(accessToken, folderId);

    if (file) {
      await this.renameFile(
        accessToken,
        file.id,
        `vault.backup-${Date.now()}.json.enc`,
        this.i18n.translate('errors.drive.backupFailed'),
      );
    }

    await this.createFile(accessToken, folderId, content, onProgress);
  }

  /**
   * For "delete account": renames the vault file so this app stops finding it,
   * and leaves the data itself alone.
   *
   * Nothing is deleted, because nothing here is ours to delete — the file lives
   * in the user's own Drive, and only they can say whether an encrypted blob
   * they may still want the contents of should go. `loadVault` looks for one
   * exact name (see `findFile`), so a rename is all it takes for the app to see
   * an empty slate, and the user can delete the renamed file at their leisure.
   * The new name says what happened and when, so it is recognisable in a folder
   * listing months later.
   *
   * Returns whether there was a file to rename — `false` means the account
   * never had a vault, which is not an error.
   */
  async detachVault(accessToken: string): Promise<boolean> {
    const folderId = await this.findFolder(accessToken);
    if (!folderId) {
      return false;
    }

    const file = await this.findFile(accessToken, folderId);
    if (!file) {
      return false;
    }

    await this.renameFile(
      accessToken,
      file.id,
      detachedFileName(new Date()),
      this.i18n.translate('errors.drive.renameFailed'),
    );
    return true;
  }

  /** Throws `GoogleAuthExpiredError` for a 401, or a plain `Error` for any other non-OK response. */
  private assertOk(response: Response, message: string): void {
    if (response.status === 401) {
      throw new GoogleAuthExpiredError(this.i18n.translate('errors.drive.authExpired'));
    }
    if (!response.ok) {
      throw new Error(message);
    }
  }

  private async renameFile(
    accessToken: string,
    fileId: string,
    name: string,
    failureMessage: string,
  ): Promise<void> {
    const response = await fetch(`${FILES_URL}/${fileId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    this.assertOk(response, failureMessage);
  }

  private async findFolder(accessToken: string): Promise<string | null> {
    const query = `name='${FOLDER_NAME}' and mimeType='${FOLDER_MIME_TYPE}' and trashed=false`;
    const { files } = await this.driveGet(accessToken, query);
    return files[0]?.id ?? null;
  }

  private async createFolder(accessToken: string): Promise<string> {
    const response = await fetch(FILES_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: FOLDER_NAME, mimeType: FOLDER_MIME_TYPE }),
    });
    this.assertOk(response, this.i18n.translate('errors.drive.createFolderFailed'));
    return ((await response.json()) as DriveFileRef).id;
  }

  private async findFile(accessToken: string, folderId: string): Promise<DriveFileRef | null> {
    const query = `name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`;
    const { files } = await this.driveGet(accessToken, query);
    return files[0] ?? null;
  }

  private async downloadFile(accessToken: string, fileId: string): Promise<string> {
    const response = await fetch(`${FILES_URL}/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    this.assertOk(response, this.i18n.translate('errors.drive.readFailed'));
    return response.text();
  }

  private async createFile(
    accessToken: string,
    folderId: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    await this.resumableUpload(
      accessToken,
      UPLOAD_URL,
      'POST',
      { name: FILE_NAME, mimeType: 'application/json', parents: [folderId] },
      content,
      onProgress,
    );
  }

  private async updateFile(
    accessToken: string,
    fileId: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    await this.resumableUpload(
      accessToken,
      `${UPLOAD_URL}/${fileId}`,
      'PATCH',
      { mimeType: 'application/json' },
      content,
      onProgress,
    );
  }

  /**
   * Drive's resumable-upload protocol — the one Google's own docs say to use
   * for a real progress bar; a single-request `uploadType=multipart` upload
   * (what this used to be) has no such visibility, since there's nothing to
   * report progress *on* until the one request completes.
   *
   * 1. POST/PATCH `?uploadType=resumable` with the metadata; the response's
   *    `Location` header is a session URI good for one week.
   * 2. PUT the content to that URI in `CHUNK_BYTES`-sized pieces, each with
   *    a `Content-Range: bytes {start}-{end}/{total}` header. A `308 Resume
   *    Incomplete` response's `Range` header says how much the server has
   *    actually confirmed — that, not anything the browser guesses about its
   *    own send buffer, is what `onProgress` reports. `200`/`201` means done.
   */
  private async resumableUpload(
    accessToken: string,
    url: string,
    method: 'POST' | 'PATCH',
    metadata: Record<string, unknown>,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    const bytes = new TextEncoder().encode(content);
    const total = bytes.length;

    const initiate = await fetch(`${url}?uploadType=resumable`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'application/json',
        'X-Upload-Content-Length': String(total),
      },
      body: JSON.stringify(metadata),
    });

    this.assertOk(initiate, this.i18n.translate('errors.drive.saveFailed'));

    const sessionUri = initiate.headers.get('Location');
    if (!sessionUri) {
      throw new Error(this.i18n.translate('errors.drive.saveFailed'));
    }

    onProgress?.(0);

    let start = 0;
    while (start < total) {
      const end = Math.min(start + CHUNK_BYTES, total);
      const chunk = bytes.subarray(start, end);

      const response = await fetch(sessionUri, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Length': String(chunk.length),
          'Content-Range': `bytes ${start}-${end - 1}/${total}`,
        },
        body: chunk,
      });

      if (response.ok) {
        onProgress?.(1);
        return;
      }

      if (response.status !== 308) {
        this.assertOk(response, this.i18n.translate('errors.drive.saveFailed'));
      }

      // "bytes=0-262143" — the upper bound is what the server has confirmed
      // so far; fall back to this chunk's own end if the header's missing
      // (shouldn't happen per spec, but nothing here should hang on it).
      const range = response.headers.get('Range');
      const confirmedEnd = range ? Number(range.split('-')[1]) + 1 : end;

      onProgress?.(confirmedEnd / total);
      start = confirmedEnd;
    }
  }

  private async driveGet(accessToken: string, query: string): Promise<{ files: DriveFileRef[] }> {
    const url = `${FILES_URL}?q=${encodeURIComponent(query)}&fields=${encodeURIComponent('files(id)')}`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    this.assertOk(response, this.i18n.translate('errors.drive.unreachable'));
    return (await response.json()) as { files: DriveFileRef[] };
  }
}
