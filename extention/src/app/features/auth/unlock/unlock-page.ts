import { ChangeDetectionStrategy, Component, computed, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuditService } from '../../../core/audit/audit.service';
import { SessionStore } from '../../../core/auth/session.store';
import { SESSION_KEYS, sessionSet } from '../../../core/storage/extension-session-storage';
import { GoogleAuthExpiredError, GoogleDriveService } from '../../../core/drive/google-drive.service';
import { decryptVault, encryptVault } from '../../../core/vault/vault-crypto';
import { createEmptyVaultSnapshot, VaultSnapshot, VaultStore } from '../../../core/vault/vault.store';
import { Icon } from '../../../ui/icon/icon';

/**
 * Second, final step of the sign-in flow: the secret that opens the vault.
 *
 * A single field, no confirmation and no strength meter. Submitting it does
 * the whole round trip: fetch the encrypted vault from the `keeperpass`
 * folder in Drive (or, the first time, create it empty), decrypt it with
 * the secret, and hand the result to `VaultStore` — then go straight to
 * `/items`. There is no separate "connect Drive" step; Drive access was
 * already granted alongside Google sign-in (see `AuthService`).
 */
@Component({
  selector: 'app-unlock-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmFieldImports,
    HlmInputGroupImports,
    HlmSpinnerImports,
  ],
  templateUrl: './unlock-page.html',
})
export class UnlockPage {
  private readonly session = inject(SessionStore);
  private readonly vault = inject(VaultStore);
  private readonly drive = inject(GoogleDriveService);
  private readonly auditService = inject(AuditService);

  protected readonly form = new FormGroup({
    secret: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  /** Drives the submit button's spinner. */
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  /** Show/hide toggle on the secret field — the old `app-input`'s own internal state, now here since `hlm-input-group` doesn't keep it for us. */
  protected readonly revealed = signal(false);

  private readonly secretValue = toSignal(this.form.controls.secret.valueChanges, {
    initialValue: '',
  });
  protected readonly hasSecret = computed(() => this.secretValue().length > 0);

  protected toggleRevealed(): void {
    this.revealed.update((revealed) => !revealed);
  }

  /** Existing content is selected on focus, so retyping replaces it outright. */
  protected selectAll(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  /** "Forgot your secret?" — the account-recovery page, see `RecoverPage`. */
  protected openReset(): void {
    // `/recover` isn't part of the popup — recovery happens in the web app.
    this.errorMessage.set('Open the KeeperPass web app to reset your secret.');
  }

  /** Abandons this sign-in — back to `/start`, same as the sidebar's "Disconnect". */
  protected disconnect(): void {
    // No router in the popup — clearing the session drops `phase` back to
    // `signed-out`, and `AppComponent` swaps in the start screen.
    this.session.signOut();
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    const secret = this.form.getRawValue().secret;
    const accessToken = this.session.accessToken();

    this.submitting.set(true);
    this.errorMessage.set('');

    try {
      const stored = await this.drive.loadVault(accessToken);
      const data = stored
        ? await decryptVault(secret, JSON.parse(stored))
        : createEmptyVaultSnapshot();

      // DEV ONLY — prints the whole decrypted vault, passwords included, so
      // keep it off any shared screen or recording. `isDevMode()` is a
      // runtime check: it stops this running in a production build, but the
      // code still ships in the bundle. Delete it once you're done rather
      // than relying on the guard alone.
      if (isDevMode()) {
        console.log('Decrypted vault data:', data);
      }

      if (!stored) {
        await this.drive.saveVault(accessToken, JSON.stringify(await encryptVault(secret, data)));
      }

      this.vault.hydrate(data as VaultSnapshot);
      // Seed the popup's cache so reopening doesn't go back to Drive.
      await sessionSet(SESSION_KEYS.vaultData, data);
      this.session.unlock(secret);
      // Fire-and-forget: a fresh security audit shouldn't delay landing on
      // /items, and its own network/sync errors are already swallowed.
      void this.auditService.runFullAudit();
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        // A token restored from sessionStorage after a refresh (see
        // SessionStore) can be stale by the time it's actually used here.
        this.disconnect();
        return;
      }

      this.errorMessage.set(this.describeError(error));
    } finally {
      // Reached on the success path too — the popup swaps to the vault list
      // right after, so the spinner never outlives the page.
      this.submitting.set(false);
    }
  }

  private describeError(error: unknown): string {
    // Web Crypto rejects a GCM authentication failure with a generic
    // "OperationError" DOMException, not a helpful message — checking `name`
    // directly (rather than `instanceof DOMException`/`Error`) sidesteps
    // cross-realm oddities between jsdom's globals and the ones
    // `crypto.subtle` throws with.
    if ((error as { name?: string } | null)?.name === 'OperationError') {
      return 'Incorrect secret. Please try again.';
    }
    return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  }
}
