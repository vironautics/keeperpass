import { inject, Injectable } from '@angular/core';
import { I18nService } from '../../i18n';
import { UploadProgressHandler, VaultStorage } from '../provider';
import { StorageAuthExpiredError, VaultConflictError } from '../storage-errors';

const API_URL = 'https://api.dropboxapi.com/2';
const CONTENT_URL = 'https://content.dropboxapi.com/2';

/** In the app folder's root — the app folder is already this app's own namespace. */
const VAULT_PATH = '/vault.json.enc';

/** Retries after a 429, each waiting what Dropbox asked for (capped). */
const MAX_RATE_LIMIT_RETRIES = 2;
const MAX_RETRY_WAIT_MS = 10_000;

/** A Dropbox error body: nested objects tagged with `.tag`. */
type DropboxError = { error?: unknown; error_summary?: string } | null;

/** Whether `.tag === tag` appears anywhere in the (nested) error — Dropbox buries the reason a level or two deep. */
function hasTag(value: unknown, tag: string): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return record['.tag'] === tag || Object.values(record).some((inner) => hasTag(inner, tag));
}

/** `Dropbox-API-Arg` is an HTTP header: it has to be ASCII, so anything else is `\uXXXX`-escaped. */
function apiArg(value: unknown): string {
  return JSON.stringify(value).replace(
    /[\u007f-￿]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
}

/** How an upload treats a file that may or may not already exist. */
type WriteMode = { '.tag': 'add' } | { '.tag': 'update'; update: string };

interface UploadResult {
  status: number;
  body: string;
}

/**
 * `fetch` cannot report upload progress, so uploads go through
 * `XMLHttpRequest`. Its own function so tests can stand a fake in.
 */
function upload(
  url: string,
  headers: Record<string, string>,
  body: string,
  onProgress?: UploadProgressHandler,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', url);
    for (const [name, value] of Object.entries(headers)) {
      request.setRequestHeader(name, value);
    }
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress?.(event.loaded / event.total);
      }
    };
    request.onload = () => resolve({ status: request.status, body: request.responseText });
    request.onerror = () => reject(new TypeError('Network error'));
    request.send(body);
  });
}

/**
 * The vault as one file, `vault.json.enc`, in the app's Dropbox folder.
 *
 * Mirrors `GoogleDriveService`'s invariants — one active vault file, never
 * deleted, only renamed away (backup on reset, detached on account removal) —
 * but is simpler: there is no folder to find or create, since the app folder
 * is the namespace.
 *
 * One thing Drive's version does not do: writes are guarded by the file's
 * `rev`. This remembers the revision it last read or wrote and asks Dropbox to
 * update only that revision, so a save from a second device or tab in between
 * fails with `VaultConflictError` instead of silently overwriting it.
 */
@Injectable({ providedIn: 'root' })
export class DropboxVaultStorage implements VaultStorage {
  private readonly i18n = inject(I18nService);

  /** The revision this session last read or wrote; `null` when it has seen no vault. */
  private rev: string | null = null;

  async vaultExists(accessToken: string): Promise<boolean> {
    const response = await this.rpc(accessToken, 'files/get_metadata', { path: VAULT_PATH });

    if (response.status === 409) {
      if (hasTag(await this.errorBody(response), 'not_found')) {
        this.rev = null;
        return false;
      }
      throw new Error(this.i18n.translate('errors.dropbox.unreachable'));
    }

    await this.assertOk(response, this.i18n.translate('errors.dropbox.unreachable'));
    return true;
  }

  async loadVault(accessToken: string): Promise<string | null> {
    const response = await this.withRateLimitRetry(() =>
      fetch(`${CONTENT_URL}/files/download`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Dropbox-API-Arg': apiArg({ path: VAULT_PATH }),
        },
      }),
    );

    if (response.status === 409) {
      if (hasTag(await this.errorBody(response), 'not_found')) {
        this.rev = null;
        return null;
      }
      throw new Error(this.i18n.translate('errors.dropbox.readFailed'));
    }

    await this.assertOk(response, this.i18n.translate('errors.dropbox.readFailed'));
    this.rev = this.revFromResultHeader(response);
    return response.text();
  }

  async saveVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    // With a known revision: update exactly that one. With none: create, and
    // fail if a file turned up meanwhile — it is one this session never read.
    const mode: WriteMode = this.rev ? { '.tag': 'update', update: this.rev } : { '.tag': 'add' };
    await this.uploadVault(accessToken, content, mode, onProgress);
  }

  async resetVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    await this.moveVault(
      accessToken,
      `/vault.backup-${Date.now()}.json.enc`,
      this.i18n.translate('errors.dropbox.backupFailed'),
    );
    this.rev = null;
    await this.uploadVault(accessToken, content, { '.tag': 'add' }, onProgress);
  }

  async detachVault(accessToken: string): Promise<boolean> {
    const moved = await this.moveVault(
      accessToken,
      `/vault.removed-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json.enc`,
      this.i18n.translate('errors.dropbox.renameFailed'),
    );
    this.rev = null;
    return moved;
  }

  /** Renames the active vault out of the way. `false` if there was none to rename. */
  private async moveVault(
    accessToken: string,
    toPath: string,
    failureMessage: string,
  ): Promise<boolean> {
    const response = await this.rpc(accessToken, 'files/move_v2', {
      from_path: VAULT_PATH,
      to_path: toPath,
      autorename: true,
    });

    if (response.status === 409) {
      if (hasTag(await this.errorBody(response), 'not_found')) {
        return false;
      }
      throw new Error(failureMessage);
    }

    await this.assertOk(response, failureMessage);
    return true;
  }

  private async uploadVault(
    accessToken: string,
    content: string,
    mode: WriteMode,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    const failure = this.i18n.translate('errors.dropbox.saveFailed');
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': apiArg({ path: VAULT_PATH, mode, autorename: false, mute: true }),
    };

    onProgress?.(0);

    let result = await upload(`${CONTENT_URL}/files/upload`, headers, content, onProgress);
    for (let attempt = 0; result.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, MAX_RETRY_WAIT_MS));
      result = await upload(`${CONTENT_URL}/files/upload`, headers, content, onProgress);
    }

    if (result.status === 409) {
      const body = this.parse(result.body);
      if (hasTag(body, 'conflict')) {
        throw new VaultConflictError(this.i18n.translate('errors.dropbox.conflict'));
      }
      throw new Error(failure);
    }

    if (result.status === 401) {
      throw this.authError(this.parse(result.body));
    }
    if (result.status === 429) {
      throw new Error(this.i18n.translate('errors.dropbox.rateLimited'));
    }
    if (result.status < 200 || result.status >= 300) {
      throw new Error(failure);
    }

    const metadata = this.parse(result.body) as { rev?: string } | null;
    this.rev = metadata?.rev ?? null;
    onProgress?.(1);
  }

  private rpc(accessToken: string, endpoint: string, body: unknown): Promise<Response> {
    return this.withRateLimitRetry(() =>
      fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
  }

  /** Honours `Retry-After` on a 429, a bounded number of times, then hands the 429 back. */
  private async withRateLimitRetry(send: () => Promise<Response>): Promise<Response> {
    let response = await send();
    for (let attempt = 0; response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES; attempt++) {
      const seconds = Number(response.headers.get('Retry-After')) || 1;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(seconds * 1000, MAX_RETRY_WAIT_MS)),
      );
      response = await send();
    }
    return response;
  }

  /** Throws `StorageAuthExpiredError` for an expired token, or a plain `Error` for any other non-OK response. */
  private async assertOk(response: Response, message: string): Promise<void> {
    if (response.ok) {
      return;
    }
    if (response.status === 401) {
      throw this.authError(await this.errorBody(response));
    }
    if (response.status === 429) {
      throw new Error(this.i18n.translate('errors.dropbox.rateLimited'));
    }
    throw new Error(message);
  }

  /**
   * A 401 is an expired or revoked token — except `missing_scope`, which is a
   * misconfigured app. That one must not look like an expiry: disconnecting
   * would just send the user round the same loop forever.
   */
  private authError(body: DropboxError): Error {
    if (hasTag(body, 'missing_scope')) {
      return new Error(this.i18n.translate('errors.dropbox.missingScope'));
    }
    return new StorageAuthExpiredError(this.i18n.translate('errors.dropbox.authExpired'));
  }

  private async errorBody(response: Response): Promise<DropboxError> {
    return (await response.json().catch(() => null)) as DropboxError;
  }

  private parse(text: string): DropboxError {
    try {
      return JSON.parse(text) as DropboxError;
    } catch {
      return null;
    }
  }

  /** The `rev` Dropbox reports alongside a download. */
  private revFromResultHeader(response: Response): string | null {
    const header = response.headers.get('Dropbox-API-Result');
    if (!header) {
      return null;
    }
    try {
      return (JSON.parse(header) as { rev?: string }).rev ?? null;
    } catch {
      return null;
    }
  }
}
