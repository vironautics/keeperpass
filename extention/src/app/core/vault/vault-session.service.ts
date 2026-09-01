import { inject, Injectable, signal } from '@angular/core';
import { SessionStore } from '../auth/session.store';
import { GoogleOAuthService } from '../auth/google-oauth.service';
import { GoogleAuthExpiredError, GoogleDriveService } from '../drive/google-drive.service';
import { SESSION_KEYS, sessionGet, sessionSet } from '../storage/extension-session-storage';
import { decryptVault } from './vault-crypto';
import { VaultSnapshot, VaultStore } from './vault.store';

/**
 * Keeps the popup's vault loaded without going back to Drive every time it
 * opens.
 *
 * The popup is destroyed on close, so `VaultStore` starts empty each time.
 * Re-downloading and re-deriving the key on every open costs a network round
 * trip plus an Argon2id pass — noticeable, and pointless when nothing has
 * changed. Instead the decrypted snapshot is kept in `chrome.storage.session`
 * and rehydrated instantly; `refresh()` is the explicit way to go and fetch
 * again.
 *
 * The cache lives in session storage, not local: it holds plaintext vault
 * contents, so it stays in memory and dies with the browser, exactly like the
 * secret it was decrypted with. Nothing here is written to disk.
 */
@Injectable({ providedIn: 'root' })
export class VaultSessionService {
  private readonly session = inject(SessionStore);
  private readonly drive = inject(GoogleDriveService);
  private readonly oauth = inject(GoogleOAuthService);
  private readonly vault = inject(VaultStore);

  private readonly _syncing = signal(false);
  private readonly _error = signal('');

  /** True while `refresh()` is talking to Drive. */
  readonly syncing = this._syncing.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Fills `VaultStore` on popup open: from the session cache when there is
   * one, otherwise from Drive. Returns without touching anything if the
   * session isn't unlocked.
   */
  async restore(): Promise<void> {
    if (this.session.phase() !== 'ready') {
      return;
    }

    const cached = await sessionGet<VaultSnapshot>(SESSION_KEYS.vaultData);
    if (cached) {
      this.vault.hydrate(cached);
      return;
    }

    await this.refresh();
  }

  /**
   * Loads the vault, renewing the token once if Google says it has expired.
   *
   * Access tokens last about an hour. Treating that as fatal signed the user
   * out mid-session; Chrome can re-issue silently, so it is worth one retry
   * before giving up.
   */
  private async loadWithRenewal(): Promise<string | null> {
    try {
      return await this.drive.loadVault(this.session.accessToken());
    } catch (error) {
      if (!(error instanceof GoogleAuthExpiredError)) {
        throw error;
      }

      const fresh = await this.oauth.renewToken(this.session.accessToken());
      this.session.renewToken(fresh);
      return this.drive.loadVault(fresh);
    }
  }

  /** Re-downloads and decrypts the vault, then updates the cache. */
  async refresh(): Promise<void> {
    if (this._syncing()) {
      return;
    }

    this._syncing.set(true);
    this._error.set('');
    this.vault.setLoading(true);

    try {
      const stored = await this.loadWithRenewal();
      if (!stored) {
        this.session.lock();
        return;
      }

      const snapshot = (await decryptVault(
        this.session.secret(),
        JSON.parse(stored),
      )) as VaultSnapshot;

      this.vault.hydrate(snapshot);
      await sessionSet(SESSION_KEYS.vaultData, snapshot);
    } catch {
      // A dead token, no network, or a secret that no longer matches. Keep
      // whatever is already on screen rather than blanking it, and say so —
      // silently showing an empty vault would read as data loss.
      this._error.set('Could not reach Google Drive. Showing the last loaded copy.');
    } finally {
      this._syncing.set(false);
      this.vault.setLoading(false);
    }
  }
}
