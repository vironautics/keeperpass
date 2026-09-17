import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MasterPasswordService } from '../../../core/account/master-password.service';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import {
  estimatePasswordStrength,
  MIN_MASTER_PASSWORD_SCORE,
  matchesValidator,
} from '../../../core/validation';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { Icon } from '../../../ui/icon/icon';
import { STRENGTH_COLOURS, STRENGTH_LABELS, strengthPercent } from '../../items/strength-scale';

/**
 * Changes the master password in one step: confirm the old, choose the new,
 * repeat it.
 *
 * All three fields on one form, rather than a sequence of prompts: it lets the
 * strength meter react as the new password is typed, and lets the repeat field
 * be checked against something still on screen. Splitting them up would also
 * mean a user could get two prompts in before discovering the third one rejects
 * what they chose.
 *
 * A weak new password is a warning, not a block. Refusing outright would be
 * defensible for a new account, but this is a password the user is choosing for
 * a vault they already own, and an app that will not let them proceed is an app
 * they work around by writing the strong one down.
 *
 * "Master password" and the `/unlock` secret are the same thing in this app —
 * `MasterPasswordService.change()` proves the current one by decrypting the
 * Drive vault with it, then re-encrypts and re-uploads under the new one.
 * That upload is the slow part for a large vault, hence the progress bar
 * below once it actually starts (`uploading()`); before that, it's real work
 * too (two Argon2id derivations) but not something a byte count can measure.
 */
@Component({
  selector: 'app-change-password-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    HlmAlertImports,
    HlmButton,
    HlmDialogImports,
    HlmFieldImports,
    HlmInput,
    HlmInputGroupImports,
    HlmProgressImports,
    HlmSpinnerImports,
    TranslatePipe,
  ],
  templateUrl: './change-password-dialog.html',
  /** The dialog lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class ChangePasswordDialog {
  readonly open = model(false);

  /**
   * In flight, rather than the old four-state button: success closes the dialog and
   * failure is the message below, so there is nothing for a tick or a cross to say.
   */
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  /** Show/hide on the new password — the one field worth reading back while typing. */
  protected readonly revealed = signal(false);

  /** Whether the Drive upload has actually started (as opposed to still verifying/re-encrypting). */
  protected readonly uploading = signal(false);
  /** `0` to `1`. Only meaningful once `uploading()` is true. */
  protected readonly uploadProgress = signal(0);
  protected readonly uploadPercent = computed(() => Math.round(this.uploadProgress() * 100));

  protected readonly form = new FormGroup(
    {
      current: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      next: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: matchesValidator('next', 'confirmation') },
  );

  private readonly masterPassword = inject(MasterPasswordService);
  private readonly i18n = inject(I18nService);

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  protected readonly nextPassword = computed(() => this.value().next ?? '');

  protected readonly weak = computed(
    () =>
      !!this.nextPassword() &&
      estimatePasswordStrength(this.nextPassword()).score < MIN_MASTER_PASSWORD_SCORE,
  );

  /** Only complain about the repeat once there is something to compare. */
  protected readonly mismatch = computed(
    () => !!this.value().confirmation && this.value().confirmation !== this.nextPassword(),
  );

  protected readonly canSubmit = computed(() => this.status() === 'VALID');

  /** The same scale as the item fields and the generator — see `strength-scale.ts`. */
  private readonly strengthScore = computed(
    () => estimatePasswordStrength(this.nextPassword()).score,
  );
  protected readonly strengthPercent = computed(() => strengthPercent(this.strengthScore()));
  protected readonly strengthColour = computed(() => STRENGTH_COLOURS[this.strengthScore()]);
  protected readonly strengthLabel = computed(() => this.i18n.translate(STRENGTH_LABELS[this.strengthScore()]));

  protected toggleRevealed(): void {
    this.revealed.update((revealed) => !revealed);
  }

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      untracked(() => this.reset());
    });
  }

  protected cancel(): void {
    this.open.set(false);
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit() || this.submitting()) {
      return;
    }

    const { current, next } = this.form.getRawValue();

    this.submitting.set(true);
    this.errorMessage.set('');
    this.uploading.set(false);
    this.uploadProgress.set(0);

    try {
      await this.masterPassword.change(current, next, (fraction) => {
        this.uploading.set(true);
        this.uploadProgress.set(fraction);
      });
      this.open.set(false);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : this.i18n.translate('settings.changePassword.genericError'),
      );
    } finally {
      this.submitting.set(false);
    }
  }

  private reset(): void {
    this.form.reset({ current: '', next: '', confirmation: '' });
    this.errorMessage.set('');
    this.submitting.set(false);
    this.revealed.set(false);
    this.uploading.set(false);
    this.uploadProgress.set(0);
  }
}
