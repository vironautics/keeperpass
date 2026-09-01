import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AccountStore } from '../../../core/account/account.store';
import {
  disconnectSession,
  ensureFreshTokenOrDisconnect,
} from '../../../core/auth/disconnect-session';
import { AuthService } from '../../../core/auth/auth.service';
import { SessionStore } from '../../../core/auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
} from '../../../core/drive/google-drive.service';
import {
  estimatePasswordStrength,
  matchesValidator,
  MIN_MASTER_PASSWORD_SCORE,
} from '../../../core/validation';
import { encryptVault } from '../../../core/vault/vault-crypto';
import { createEmptyVaultSnapshot, VaultStore } from '../../../core/vault/vault.store';
import { Icon } from '../../../ui/icon/icon';
import { GeneratePasswordDialog } from '../../items/generate-password-dialog/generate-password-dialog';
import { STRENGTH_COLOURS, STRENGTH_LABELS, strengthPercent } from '../../items/strength-scale';

/**
 * "Forgot your secret?", reached only from `/unlock` (same guard, same phase
 * gate — see `unlockGuard`).
 *
 * Read the name as an offer to start over, not to recover anything. The vault is
 * encrypted with a key derived from the secret and nothing else: no copy of it
 * exists on any server, because there is no server — just Google sign-in and an
 * encrypted file in the user's own Drive. A forgotten secret means the contents
 * are unreadable, and no amount of proving who you are can change that.
 *
 * So submitting does the only honest thing available: the old encrypted file is
 * renamed to a timestamped backup rather than deleted (see
 * `GoogleDriveService.resetVault` — if the secret is ever remembered, that file
 * is still openable), and a new empty vault is created under the secret entered
 * here. The page says so in as many words before the button, because "recover"
 * raises an expectation this cannot meet.
 */
@Component({
  selector: 'app-recover-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    GeneratePasswordDialog,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmFieldImports,
    HlmInput,
    HlmInputGroupImports,
    HlmProgressImports,
    HlmSpinnerImports,
  ],
  templateUrl: './recover-page.html',
  /** Fills the layout's centred column — see `UnlockPage` for why the host has to stretch. */
  host: { class: 'block self-stretch' },
})
export class RecoverPage {
  private readonly accounts = inject(AccountStore);
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly vault = inject(VaultStore);
  private readonly drive = inject(GoogleDriveService);
  private readonly router = inject(Router);

  /** Drives the submit button's spinner and keeps a second submit out. */
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  /** Shared by both secret fields — see the note in `setup-page.html`. */
  protected readonly revealed = signal(false);

  /** Whether the generator dialog is showing — see `field-value-editor.ts` for the same pattern. */
  protected readonly generating = signal(false);

  protected readonly form = new FormGroup(
    {
      // Shown, not asked for: it names the account whose vault is about to be
      // replaced, which is worth being sure about before pressing the button,
      // and it cannot be changed here — it is whichever Google account this
      // session signed in with. A control rather than plain text so it sits in
      // the same field layout as the two below.
      //
      // Kept in step with `AccountStore` further down rather than read once: a
      // session restored after a refresh may still be fetching the profile when
      // this page mounts, and a permanently blank box invites a second guess
      // about which account this is.
      email: new FormControl(this.accounts.email(), { nonNullable: true }),
      secret: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: matchesValidator('secret', 'confirmation') },
  );

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  constructor() {
    effect(() => this.form.controls.email.setValue(this.accounts.email()));
  }

  protected readonly newSecret = computed(() => this.value().secret ?? '');

  private readonly strength = computed(() => estimatePasswordStrength(this.newSecret()).score);

  protected readonly strengthPercent = computed(() => strengthPercent(this.strength()));
  protected readonly strengthColour = computed(() => STRENGTH_COLOURS[this.strength()]);
  protected readonly strengthLabel = computed(() => STRENGTH_LABELS[this.strength()]);

  protected readonly weak = computed(
    () => !!this.newSecret() && this.strength() < MIN_MASTER_PASSWORD_SCORE,
  );

  /** Only complain about the repeat once there is something to compare. */
  protected readonly mismatch = computed(
    () => !!this.value().confirmation && this.value().confirmation !== this.newSecret(),
  );

  protected readonly canSubmit = computed(() => this.status() === 'VALID');

  protected toggleRevealed(): void {
    this.revealed.update((revealed) => !revealed);
  }

  /**
   * The generator's suggestion, accepted. Fills both fields, not just
   * `secret` — the confirmation field exists to catch a typo, and a
   * generated string was never typed, so making the user retype it by hand
   * would add exactly the risk the button exists to remove.
   */
  protected onGenerated(secret: string): void {
    this.form.patchValue({ secret, confirmation: secret });
    this.revealed.set(true);
  }

  protected back(): void {
    void this.router.navigate(['/unlock']);
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit() || this.submitting()) {
      return;
    }

    const secret = this.form.getRawValue().secret;

    this.submitting.set(true);
    this.errorMessage.set('');

    const accessToken = await ensureFreshTokenOrDisconnect(this.auth, this.session, this.router);
    if (!accessToken) {
      this.submitting.set(false);
      return;
    }

    try {
      const empty = createEmptyVaultSnapshot();
      const encrypted = await encryptVault(secret, empty);
      await this.drive.resetVault(accessToken, JSON.stringify(encrypted));

      this.vault.hydrate(empty);
      this.session.unlock(secret);
      await this.router.navigate(['/items']);
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        disconnectSession(this.session, this.router);
        return;
      }

      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : 'Could not recover your account. Please try again.',
      );
    } finally {
      // Reached on the success path too — the navigation has already resolved by
      // then, so the spinner never outlives the page.
      this.submitting.set(false);
    }
  }
}
