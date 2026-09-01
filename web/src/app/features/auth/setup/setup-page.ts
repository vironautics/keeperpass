import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
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
 * First run: this Google account has no vault file yet, so instead of asking
 * for a secret that opens one, it asks the user to choose the secret that
 * will encrypt their first.
 *
 * Reached only via `setupGuard`, which checks Drive for an existing file —
 * `/unlock` and this page split the same `awaiting-secret` phase between
 * them, and the guard decides which one a visitor belongs on.
 *
 * The secret is confirmed by repeating it because there is nothing to check
 * it against: a typo here does not fail, it silently becomes the key to a
 * vault the user cannot open. Weak secrets are allowed (with a warning),
 * matching `/recover`.
 */
@Component({
  selector: 'app-setup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    GeneratePasswordDialog,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmFieldImports,
    HlmInputGroupImports,
    HlmProgressImports,
    HlmSpinnerImports,
  ],
  templateUrl: './setup-page.html',
  /** Fills the layout's centred column — see `UnlockPage` for why the host has to stretch. */
  host: { class: 'block self-stretch' },
})
export class SetupPage {
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly vault = inject(VaultStore);
  private readonly drive = inject(GoogleDriveService);
  private readonly router = inject(Router);
  private readonly accounts = inject(AccountStore);

  /** Drives the submit button's spinner and keeps a second submit out. */
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  /** Shared by both secret fields — see the note in the template. */
  protected readonly revealed = signal(false);

  /** Whether the generator dialog is showing — see `field-value-editor.ts` for the same pattern. */
  protected readonly generating = signal(false);

  /** Which Google account this vault will belong to — the wrong one is worth catching now. */
  protected readonly email = this.accounts.email;

  protected readonly form = new FormGroup(
    {
      secret: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: matchesValidator('secret', 'confirmation') },
  );

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  protected readonly secret = computed(() => this.value().secret ?? '');

  private readonly strength = computed(() => estimatePasswordStrength(this.secret()).score);

  protected readonly strengthPercent = computed(() => strengthPercent(this.strength()));
  protected readonly strengthColour = computed(() => STRENGTH_COLOURS[this.strength()]);
  protected readonly strengthLabel = computed(() => STRENGTH_LABELS[this.strength()]);

  /** A warning, not a block — see the class doc. */
  protected readonly weak = computed(
    () => !!this.secret() && this.strength() < MIN_MASTER_PASSWORD_SCORE,
  );

  /** Only complain about the repeat once there is something to compare. */
  protected readonly mismatch = computed(
    () => !!this.value().confirmation && this.value().confirmation !== this.secret(),
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

  protected disconnect(): void {
    disconnectSession(this.session, this.router);
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
      await this.drive.saveVault(accessToken, JSON.stringify(await encryptVault(secret, empty)));

      this.vault.hydrate(empty);
      // The guards cached "no vault" to send the user here; that is now stale,
      // and leaving it would bounce them back after unlocking.
      this.session.setHasVault(true);
      this.session.unlock(secret);
      await this.router.navigate(['/items']);
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        this.disconnect();
        return;
      }

      this.errorMessage.set(
        error instanceof Error ? error.message : 'Could not create your vault. Please try again.',
      );
    } finally {
      // Reached on the success path too — the navigation has already resolved by
      // then, so the spinner never outlives the page.
      this.submitting.set(false);
    }
  }
}
