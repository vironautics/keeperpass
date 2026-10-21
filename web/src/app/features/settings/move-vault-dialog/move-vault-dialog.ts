import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCloudUpload } from '@ng-icons/lucide';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { SessionStore } from '../../../core/auth/session.store';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { TranslationKey } from '../../../core/i18n/translations';
import { ProviderId } from '../../../core/providers/provider';
import { ProviderRegistry } from '../../../core/providers/provider-registry';
import {
  MigrationStage,
  MigrationTarget,
  VaultMigrationService,
} from '../../../core/providers/vault-migration.service';
import {
  estimatePasswordStrength,
  matchesValidator,
  MIN_MASTER_PASSWORD_SCORE,
} from '../../../core/validation';
import { Icon } from '../../../ui/icon/icon';
import { STRENGTH_COLOURS, STRENGTH_LABELS, strengthPercent } from '../../items/strength-scale';

type Step = 'connect' | 'configure' | 'working';

const STAGE_KEYS = {
  encrypting: 'settings.migrate.stage.encrypting',
  uploading: 'settings.migrate.stage.uploading',
  verifying: 'settings.migrate.stage.verifying',
  finishing: 'settings.migrate.stage.finishing',
} as const satisfies Record<MigrationStage, TranslationKey>;

/**
 * Moves the vault to another storage provider, in three steps: sign in to the
 * destination, say how to move it, and wait.
 *
 * Signing in comes first, on its own button, because the sign-in popup can only
 * open from a click — and because it lets the next step say, truthfully, which
 * account the vault is about to go to and whether that account already has one.
 * Nothing is written until the last button.
 *
 * The secret can stay as it is or be replaced for the destination. Either way
 * the moved vault is encrypted afresh; the old file keeps the old secret.
 */
@Component({
  selector: 'app-move-vault-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    ReactiveFormsModule,
    Icon,
    HlmAlertImports,
    HlmButton,
    HlmDialogImports,
    HlmFieldImports,
    HlmInput,
    HlmProgressImports,
    HlmSpinnerImports,
    TranslatePipe,
  ],
  providers: [provideIcons({ lucideCloudUpload })],
  templateUrl: './move-vault-dialog.html',
  /** The dialog lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class MoveVaultDialog {
  readonly open = model(false);
  readonly targetId = input.required<ProviderId>();

  private readonly migration = inject(VaultMigrationService);
  private readonly registry = inject(ProviderRegistry);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  protected readonly step = signal<Step>('connect');
  protected readonly busy = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly target = signal<MigrationTarget | null>(null);
  protected readonly stage = signal<MigrationStage>('encrypting');
  protected readonly stageKey = computed(() => STAGE_KEYS[this.stage()]);

  /** Whether the user has agreed that an existing destination vault is kept as a backup and replaced. */
  protected readonly replaceConfirmed = signal(false);
  protected readonly newSecret = signal(false);

  protected readonly form = new FormGroup(
    {
      next: new FormControl('', { nonNullable: true }),
      confirmation: new FormControl('', { nonNullable: true }),
    },
    { validators: matchesValidator('next', 'confirmation') },
  );

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  protected readonly storageName = computed(
    () => this.registry.get(this.targetId()).auth.storageName,
  );
  protected readonly sourceName = computed(
    () => this.registry.get(this.session.providerId()).auth.storageName,
  );

  protected readonly nextSecret = computed(() => this.value().next ?? '');
  private readonly strengthScore = computed(
    () => estimatePasswordStrength(this.nextSecret()).score,
  );
  protected readonly strengthPercent = computed(() => strengthPercent(this.strengthScore()));
  protected readonly strengthColour = computed(() => STRENGTH_COLOURS[this.strengthScore()]);
  protected readonly strengthLabel = computed(() =>
    this.i18n.translate(STRENGTH_LABELS[this.strengthScore()]),
  );
  protected readonly weak = computed(
    () => !!this.nextSecret() && this.strengthScore() < MIN_MASTER_PASSWORD_SCORE,
  );
  protected readonly mismatch = computed(
    () => !!this.value().confirmation && this.value().confirmation !== this.nextSecret(),
  );

  /** Ready to move: any replacement agreed to, and — if a new secret was asked for — a matching one typed. */
  protected readonly canMove = computed(() => {
    const target = this.target();
    if (!target || this.busy()) {
      return false;
    }
    if (target.hasVault && !this.replaceConfirmed()) {
      return false;
    }
    if (this.newSecret()) {
      return !!this.nextSecret() && !this.mismatch();
    }
    return true;
  });

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      untracked(() => this.reset());
    });
  }

  protected cancel(): void {
    // Leaving mid-move would orphan the work in progress; the buttons are
    // disabled then, and this guards the escape key and the backdrop too.
    if (this.step() !== 'working') {
      this.open.set(false);
    }
  }

  // Nothing before the service call awaits: the destination's sign-in popup
  // has to open inside the click.
  protected async connect(): Promise<void> {
    if (this.busy()) {
      return;
    }

    this.busy.set(true);
    this.errorMessage.set('');

    try {
      this.target.set(await this.migration.connect(this.targetId()));
      this.step.set('configure');
    } catch (error) {
      this.errorMessage.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }

  protected setNewSecret(enabled: boolean): void {
    this.newSecret.set(enabled);
  }

  protected toggleReplace(): void {
    this.replaceConfirmed.update((confirmed) => !confirmed);
  }

  protected async move(): Promise<void> {
    const target = this.target();
    if (!target || !this.canMove()) {
      return;
    }

    this.busy.set(true);
    this.errorMessage.set('');
    this.step.set('working');
    this.stage.set('encrypting');

    try {
      const { sourceRenamed } = await this.migration.migrate(
        target,
        {
          secret: this.newSecret() ? this.nextSecret() : this.session.secret(),
          replaceExisting: this.replaceConfirmed(),
        },
        (stage) => this.stage.set(stage),
      );

      const params = { provider: target.storageName, from: this.sourceName() };
      if (sourceRenamed) {
        toast.success(this.i18n.translate('settings.migrate.done', params), {
          description: this.i18n.translate('settings.migrate.doneHint', params),
          duration: 12_000,
        });
      } else {
        toast.warning(this.i18n.translate('settings.migrate.doneNotRenamed', params), {
          duration: 20_000,
        });
      }

      this.open.set(false);
      // The vault now lives elsewhere; the way in is signing in there.
      this.session.signOut();
      await this.router.navigate(['/start']);
    } catch (error) {
      // Back to the form with the reason; nothing was changed on the source.
      this.step.set('configure');
      this.errorMessage.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }

  private describe(error: unknown): string {
    return error instanceof Error ? error.message : this.i18n.translate('common.genericError');
  }

  private reset(): void {
    this.step.set('connect');
    this.busy.set(false);
    this.errorMessage.set('');
    this.target.set(null);
    this.replaceConfirmed.set(false);
    this.newSecret.set(false);
    this.form.reset({ next: '', confirmation: '' });
  }
}
