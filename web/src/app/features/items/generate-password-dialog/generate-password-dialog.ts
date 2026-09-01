import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSlider } from '@spartan-ng/helm/slider';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { ClipboardService } from '../../../core/clipboard/clipboard.service';
import {
  ALPHABETS,
  AVAILABLE_LANGUAGES,
  generatePassphrase,
  GeneratorLanguage,
  GeneratorSeparator,
  randomString,
  SEPARATOR_OPTIONS,
} from '../../../core/generator/generator';
import { estimatePasswordStrength } from '../../../core/validation';
import { Icon } from '../../../ui/icon/icon';
import { STRENGTH_COLOURS, STRENGTH_LABELS, strengthPercent } from '../strength-scale';

type GeneratorMode = 'chars' | 'words';

/** Enough words that the passphrase is worth the typing. */
const DEFAULT_WORD_COUNT = 4;
const DEFAULT_LENGTH = 20;

/** How long the copy confirmation stays on the button. Same as `GeneratorPanel`. */
const COPIED_FEEDBACK_MS = 1000;

/** How long the regenerate "bounce" plays for. Same as `GeneratorPanel`. */
const BOUNCE_DURATION_MS = 500;

/**
 * The password generator, as a dialog, for filling a password field in place.
 *
 * Same generation primitives *and* the same options as the standalone generator
 * page (`GeneratorPanel`), separator and language included — the point of having
 * it here is that a new password is almost always wanted *while* editing an item
 * (or choosing a master password), and going to another screen to fetch one loses
 * the edit.
 *
 * The value is only handed back when the user confirms, so opening this, looking at a
 * suggestion and cancelling leaves the field exactly as it was.
 */
@Component({
  selector: 'app-generate-password-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButton,
    HlmCheckbox,
    HlmDialogImports,
    HlmFieldImports,
    HlmLabel,
    HlmProgressImports,
    HlmSelectImports,
    HlmSlider,
    HlmToggleGroupImports,
    Icon,
  ],
  templateUrl: './generate-password-dialog.html',
  /** The dialog itself lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class GeneratePasswordDialog {
  /** Two-way, so the dialog can report itself closed. */
  readonly open = model(false);

  /** The password the user accepted. */
  readonly confirmed = output<string>();

  protected readonly separatorOptions: readonly GeneratorSeparator[] = SEPARATOR_OPTIONS;
  protected readonly languageOptions: readonly GeneratorLanguage[] = AVAILABLE_LANGUAGES;

  protected readonly mode = signal<GeneratorMode>('chars');
  protected readonly length = signal(DEFAULT_LENGTH);
  protected readonly wordCount = signal(DEFAULT_WORD_COUNT);
  protected readonly separator = signal(SEPARATOR_OPTIONS[0].value);
  protected readonly language = signal(AVAILABLE_LANGUAGES[0].value);

  protected readonly lower = signal(true);
  protected readonly upper = signal(true);
  protected readonly numbers = signal(true);
  protected readonly symbols = signal(false);

  protected readonly value = signal('');
  protected readonly copied = signal(false);

  /** Bumped to force a regenerate with the options unchanged. */
  private readonly reroll = signal(0);

  private readonly resultRef = viewChild<ElementRef<HTMLElement>>('result');

  private readonly clipboard = inject(ClipboardService);

  protected readonly score = computed(() => estimatePasswordStrength(this.value()).score);
  protected readonly strengthLabel = computed(() => STRENGTH_LABELS[this.score()]);
  protected readonly strengthPercent = computed(() => strengthPercent(this.score()));
  protected readonly strengthColour = computed(() => STRENGTH_COLOURS[this.score()]);

  /** At least one character class has to be on, or there is nothing to draw from. */
  protected readonly charsetEmpty = computed(
    () => !this.lower() && !this.upper() && !this.numbers() && !this.symbols(),
  );

  constructor() {
    // Every option is read here, so changing any of them regenerates — the same
    // single-path behaviour the generator page gets from one change listener.
    effect(() => {
      const mode = this.mode();
      const length = this.length();
      const wordCount = this.wordCount();
      const separator = this.separator();
      const language = this.language();
      const charset =
        (this.lower() ? ALPHABETS.lowercase : '') +
        (this.upper() ? ALPHABETS.uppercase : '') +
        (this.numbers() ? ALPHABETS.digits : '') +
        (this.symbols() ? ALPHABETS.symbols : '');
      this.reroll();

      untracked(() => {
        if (mode === 'chars') {
          this.value.set(charset ? randomString(length, charset) : '');
          this.bounce();
          return;
        }
        void generatePassphrase(wordCount, separator, language).then((phrase) => {
          this.value.set(phrase);
          this.bounce();
        });
      });
    });

    // A fresh suggestion each time it opens, rather than whatever was on screen last.
    effect(() => {
      if (this.open()) {
        untracked(() => this.regenerate());
      }
    });
  }

  protected regenerate(): void {
    this.reroll.update((n) => n + 1);
  }

  /** The toggle group's value is typed for multi-select, so it needs narrowing. */
  protected setMode(mode: unknown): void {
    if (mode === 'chars' || mode === 'words') {
      this.mode.set(mode);
    }
  }

  /**
   * The trigger stringifies the *value*, and the options only exist while the
   * dialog is open — so a closed trigger would otherwise show `-` or `en`,
   * not `Dash ( - )`. Same helper as `GeneratorPanel`.
   */
  protected readonly separatorLabel = (value: string): string =>
    SEPARATOR_OPTIONS.find((option) => option.value === value)?.label ?? value;

  protected readonly languageLabel = (value: string): string =>
    AVAILABLE_LANGUAGES.find((option) => option.value === value)?.label ?? value;

  protected onSeparatorPicked(value: unknown): void {
    if (typeof value === 'string') {
      this.separator.set(value);
    }
  }

  protected onLanguagePicked(value: unknown): void {
    if (typeof value === 'string') {
      this.language.set(value);
    }
  }

  /** `hlm-slider` is a range control, so its value is an array even with one thumb. */
  protected onLengthChange(value: readonly number[]): void {
    this.length.set(value[0]);
  }

  protected onWordCountChange(value: readonly number[]): void {
    this.wordCount.set(value[0]);
  }

  protected confirm(): void {
    if (!this.value()) {
      return;
    }
    this.confirmed.emit(this.value());
    this.open.set(false);
  }

  protected cancel(): void {
    this.open.set(false);
  }

  /** Same as `GeneratorPanel.copy()` — copies the suggestion without accepting it. */
  protected async copy(): Promise<void> {
    if (!this.value()) {
      return;
    }

    await this.clipboard.copy(this.value());

    this.copied.set(true);
    setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS);
  }

  /**
   * A short pulse on the result, so a regenerate reads as "this is new" even when the
   * new value looks like the old one. Same as `GeneratorPanel.bounce()`.
   */
  private bounce(): void {
    const el = this.resultRef()?.nativeElement;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
      {
        duration: BOUNCE_DURATION_MS,
        easing: 'ease',
      },
    );
  }
}
