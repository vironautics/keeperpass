import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  isDevMode,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AccountStore } from '../../../core/account/account.store';
import { AuditService } from '../../../core/audit/audit.service';
import { AuthService } from '../../../core/auth/auth.service';
import {
  disconnectSession,
  ensureFreshTokenOrDisconnect,
} from '../../../core/auth/disconnect-session';
import { SessionStore } from '../../../core/auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
} from '../../../core/drive/google-drive.service';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { decryptVault, encryptVault } from '../../../core/vault/vault-crypto';
import {
  createEmptyVaultSnapshot,
  VaultSnapshot,
  VaultStore,
} from '../../../core/vault/vault.store';
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
    TranslatePipe,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmFieldImports,
    HlmInputGroupImports,
    HlmSpinnerImports,
  ],
  templateUrl: './unlock-page.html',
  /**
   * The card sizes itself against the layout column rather than its own
   * content, so the host has to fill that column — `auth-layout` centres it
   * with `align-items: center`, which would otherwise shrink-wrap the host to
   * max-content and make the card's `max-w-*` resolve against a width that
   * varies with the copy inside it.
   */
  host: { class: 'block self-stretch' },
})
export class UnlockPage {
  private readonly session = inject(SessionStore);
  private readonly vault = inject(VaultStore);
  private readonly drive = inject(GoogleDriveService);
  private readonly router = inject(Router);
  private readonly auditService = inject(AuditService);
  private readonly auth = inject(AuthService);
  private readonly accounts = inject(AccountStore);
  private readonly i18n = inject(I18nService);

  protected readonly form = new FormGroup({
    // Shown, not asked for — same reasoning as `RecoverPage`'s own `email`
    // control: it names the account whose vault this unlocks, which is worth
    // being sure about before typing a secret, and it cannot be changed here.
    email: new FormControl(this.accounts.email(), { nonNullable: true }),
    secret: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /** Drives the submit button's spinner and keeps a second submit out. */
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  /** Show/hide toggle on the secret field. */
  protected readonly revealed = signal(false);

  private readonly secretValue = toSignal(this.form.controls.secret.valueChanges, {
    initialValue: '',
  });
  protected readonly hasSecret = computed(() => this.secretValue().length > 0);

  constructor() {
    // AccountStore only ever gets the real profile from `/start`'s own
    // sign-in call. A session restored from a persisted access token after a
    // page refresh (see SessionStore) skips `/start` entirely and lands here
    // directly — without this, AccountStore would be left showing its
    // placeholder fake data (e.g. on `/recover`'s "Logged In As" field) for
    // the rest of the tab's life. Best-effort and fire-and-forget: /unlock
    // itself doesn't depend on the profile, and a token that's actually gone
    // stale surfaces normally through the real Drive call on submit.
    void this.auth
      .fetchProfile(this.session.accessToken())
      .then((profile) => this.accounts.updateProfile(profile))
      .catch(() => {});

    // Keeps the read-only email field in step once the fetch above resolves
    // — same reasoning as `RecoverPage`'s own `email` control.
    effect(() => this.form.controls.email.setValue(this.accounts.email()));
  }

  protected toggleRevealed(): void {
    this.revealed.update((revealed) => !revealed);
  }

  /** Existing content is selected on focus, so retyping replaces it outright. */
  protected selectAll(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  /** "Forgot your secret?" — the account-recovery page, see `RecoverPage`. */
  protected openReset(): void {
    void this.router.navigate(['/recover']);
  }

  /** Abandons this sign-in — back to `/start`, same as the sidebar's "Disconnect". */
  protected disconnect(): void {
    disconnectSession(this.session, this.router);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    const secret = this.form.getRawValue().secret;

    this.submitting.set(true);
    this.errorMessage.set('');

    // Renewed rather than read: the token may have aged out while the tab
    // sat in the background. A failure here — expired or unrenewable — goes
    // straight to reconnect, same as a 401 from Drive below; the only
    // difference is which layer noticed.
    const accessToken = await ensureFreshTokenOrDisconnect(this.auth, this.session, this.router);
    if (!accessToken) {
      this.submitting.set(false);
      return;
    }

    try {
      const stored = await this.drive.loadVault(accessToken);
      const data = stored
        ? await decryptVault(secret, JSON.parse(stored))
        : createEmptyVaultSnapshot(this.i18n.translate('vaults.defaultName'));

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
      this.session.unlock(secret);
      // Fire-and-forget: a fresh security audit shouldn't delay landing on
      // /items, and its own network/sync errors are already swallowed.
      void this.auditService.runFullAudit();
      await this.router.navigate(['/items']);
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        // A token restored from sessionStorage after a refresh (see
        // SessionStore) can be stale by the time it's actually used here.
        this.disconnect();
        return;
      }

      this.errorMessage.set(this.describeError(error));
    } finally {
      // Reached on the success path too — the navigation has already resolved
      // by then, so the spinner never outlives the page.
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
      return this.i18n.translate('auth.unlock.incorrectSecret');
    }
    return error instanceof Error ? error.message : this.i18n.translate('common.genericError');
  }
}
