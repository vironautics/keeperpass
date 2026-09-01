import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { disconnectSession } from '../auth/disconnect-session';
import { SessionStore } from '../auth/session.store';
import { GoogleAuthExpiredError, GoogleDriveService } from '../drive/google-drive.service';
import { encryptVault } from './vault-crypto';
import { VaultSnapshot, VaultStore } from './vault.store';

/**
 * Saves the vault to Drive — only when explicitly asked to, via `syncNow()`.
 *
 * There is no background/debounced autosave: `syncNow()` is called right
 * after every committed change (`ItemView.save()`, moving/deleting an item,
 * creating a vault, importing, restoring or deleting a history entry) — see
 * each call site. Editing a field, for instance, only reaches Drive once
 * that edit is actually saved; nothing syncs from an in-progress draft.
 *
 * `syncing`/`progress` expose the in-flight save for `SyncOverlay`, since a
 * save otherwise has no visible feedback of its own.
 *
 * `uploading` distinguishes the two real phases of a save: deriving the
 * Argon2id key and encrypting (CPU-bound, no byte count to report — often
 * the *slower* half) versus the actual upload (network-bound, where
 * `progress` is meaningful). Without this, a UI reading `progress` alone
 * sees it pinned at `0` through the entire encryption phase and then jump
 * straight to `1` once the — usually small, usually fast — upload finishes,
 * which looks like "it's not tracking anything," even though `progress`
 * itself is accurate for the phase it actually measures.
 *
 * `lastError` exists because a failed save used to be genuinely invisible —
 * caught, `console.error`'d, and otherwise indistinguishable from success.
 * Silently losing an edit is worse than an intrusive retry prompt, so
 * `SyncOverlay` blocks on this the same way it blocks on `syncing`, and only
 * clears once a later save actually succeeds (or the user dismisses it).
 *
 * A `401` (`GoogleAuthExpiredError`) is not a normal failure — it means the
 * access token is dead and no retry will ever succeed, so it skips
 * `lastError` entirely and disconnects the session instead (see
 * `disconnectSession()`), sending the user back to `/start` for a fresh
 * token.
 */
@Injectable({ providedIn: 'root' })
export class VaultSyncService {
  private readonly session = inject(SessionStore);
  private readonly vault = inject(VaultStore);
  private readonly drive = inject(GoogleDriveService);
  private readonly router = inject(Router);

  private pending: VaultSnapshot | undefined;

  /** Set when `syncNow()` is called again while a save is already in flight — see `save()`. */
  private saveAgain = false;

  private readonly _syncing = signal(false);
  private readonly _uploading = signal(false);
  private readonly _progress = signal(0);
  private readonly _lastError = signal<string | null>(null);

  /** Whether a save is actually in flight right now — for `SyncOverlay`. */
  readonly syncing = this._syncing.asReadonly();
  /** Whether the in-flight save has reached the upload — see the class doc comment. */
  readonly uploading = this._uploading.asReadonly();
  /** `0` to `1`, meaningful only while `uploading()` is true. */
  readonly progress = this._progress.asReadonly();
  /** Message from the most recent save, if it failed — cleared by a later success or `dismissError()`. */
  readonly lastError = this._lastError.asReadonly();

  /**
   * Encrypts and saves the current vault to Drive right now. Always goes
   * through, even back-to-back with no change in between — the caller just
   * committed a real edit, so this is the one and only place that edit gets
   * written; skipping it as "probably redundant" would risk silently
   * dropping a save.
   */
  async syncNow(): Promise<void> {
    this.pending = this.vault.snapshot();
    await this.save();
  }

  private async save(): Promise<void> {
    // A save is already in flight — flag it so the in-flight save runs
    // itself again right after, picking up whatever `pending` holds by then
    // (already the latest, since `syncNow()` updates it before calling).
    if (this._syncing()) {
      this.saveAgain = true;
      return;
    }

    const accessToken = this.session.accessToken();
    const secret = this.session.secret();
    const snapshot = this.pending;

    if (!accessToken || !secret || !snapshot) {
      return;
    }

    this._syncing.set(true);
    this._uploading.set(false);
    this._progress.set(0);
    this._lastError.set(null);

    try {
      const encrypted = await encryptVault(secret, snapshot);
      await this.drive.saveVault(accessToken, JSON.stringify(encrypted), (fraction) => {
        this._uploading.set(true);
        this._progress.set(fraction);
      });
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        this.saveAgain = false; // the session is over — nothing left to retry with
        disconnectSession(this.session, this.router);
        return;
      }

      console.error('Could not save the vault to Google Drive.', error);
      this._lastError.set(
        error instanceof Error ? error.message : 'Could not save your vault to Google Drive.',
      );
    } finally {
      this._syncing.set(false);
      this._uploading.set(false);

      if (this.saveAgain) {
        this.saveAgain = false;
        void this.save();
      }
    }
  }

  /** Clears a failed save's error without retrying — the user has seen it and chosen to move on. */
  dismissError(): void {
    this._lastError.set(null);
  }
}
