import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { disconnectSession, ensureFreshTokenOrDisconnect } from '../auth/disconnect-session';
import { AuthService } from '../auth/auth.service';
import { SessionStore } from '../auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
  UploadProgressHandler,
} from '../drive/google-drive.service';
import { decryptVault, encryptVault } from '../vault/vault-crypto';

export class WrongMasterPasswordError extends Error {
  constructor() {
    super('That is not your current master password.');
    this.name = 'WrongMasterPasswordError';
  }
}

/**
 * Rotating the master password — which, in this app, IS the secret
 * `/unlock` uses to decrypt the Drive vault; there is no separate account
 * key to re-derive.
 *
 * `change()` proves the current password by actually decrypting the vault
 * with it (not by comparing against `SessionStore.secret` — that would only
 * prove the secret hasn't changed since `/unlock`, not that the caller
 * knows it), then re-encrypts the same data under the new password and
 * saves it back. `SessionStore.updateSecret()` keeps `VaultSyncService`'s
 * later autosaves in step with whichever password is current.
 */
@Injectable({ providedIn: 'root' })
export class MasterPasswordService {
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly drive = inject(GoogleDriveService);
  private readonly router = inject(Router);

  async change(
    currentPassword: string,
    newPassword: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    const accessToken = await ensureFreshTokenOrDisconnect(this.auth, this.session, this.router);
    if (!accessToken) {
      throw new Error('Your Google session has expired. Please reconnect.');
    }

    try {
      const stored = await this.drive.loadVault(accessToken);
      if (!stored) {
        throw new Error('Could not find your vault in Google Drive.');
      }

      const parsed = JSON.parse(stored);
      let data: unknown;
      try {
        data = await decryptVault(currentPassword, parsed);
      } catch (error) {
        // See `unlock-page.ts`'s `describeError` for why `name` rather than
        // `instanceof` — same cross-realm DOMException concern.
        if ((error as { name?: string } | null)?.name === 'OperationError') {
          throw new WrongMasterPasswordError();
        }
        throw error;
      }

      const encrypted = await encryptVault(newPassword, data);
      await this.drive.saveVault(accessToken, JSON.stringify(encrypted), onProgress);

      this.session.updateSecret(newPassword);
    } catch (error) {
      // The access token is dead — no retry of this change will ever
      // succeed, so disconnect (same recovery as everywhere else that talks
      // to Drive) rather than surface it as "wrong password" or similar.
      if (error instanceof GoogleAuthExpiredError) {
        disconnectSession(this.session, this.router);
      }
      throw error;
    }
  }
}
