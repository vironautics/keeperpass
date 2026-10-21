import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCopy,
  lucideRefreshCw,
  lucideSlidersHorizontal,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
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
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { estimatePasswordStrength } from '../../../core/validation';
import { STRENGTH_COLOURS, STRENGTH_LABELS, strengthPercent } from '../../items/strength-scale';

type GeneratorMode = 'words' | 'chars';

/**
 * How one run of the result is drawn. Digits and symbols are tinted so a long string can
 * be read back character by character — `0`/`O` and `1`/`l` stop being guesses — and
 * a passphrase's separators recede so the words stand out.
 */
type SegmentKind = 'letter' | 'digit' | 'symbol';

interface ResultSegment {
  kind: SegmentKind;
  text: string;
}

function kindOf(char: string): SegmentKind {
  if (/[0-9]/.test(char)) return 'digit';
  if (/\p{L}/u.test(char)) return 'letter';
  return 'symbol';
}

/** How long the copy confirmation stays on the button. */
const COPIED_FEEDBACK_MS = 1000;

/** How long the regenerate "bounce" plays for. */
const BOUNCE_DURATION_MS = 500;

/**
 * A passphrase, or a random-character string — regenerated live as any option
 * changes, and copyable to the clipboard.
 *
 * Every option is a signal, and one `effect()` reads all of them and calls
 * `generate()` — so a new option needs no wiring to take effect, and there is no
 * list of change handlers to keep in step with the list of controls. The result
 * updating as you drag a slider is also the point: it shows what the setting
 * does instead of describing it.
 *
 * The generator dialog on a password field
 * (`features/items/generate-password-dialog/`) is built on the same primitives
 * and offers the same options — separator and language included. This is the
 * standalone page: same generator, its own surface (a copy button instead of
 * a confirm that fills a field).
 */
@Component({
  selector: 'app-generator-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButton,
    HlmCheckbox,
    HlmFieldImports,
    HlmSelectImports,
    HlmSlider,
    HlmToggleGroupImports,
    NgIcon,
    TranslatePipe,
  ],
  providers: [provideIcons({ lucideCheck, lucideCopy, lucideRefreshCw, lucideSlidersHorizontal })],
  templateUrl: './generator-panel.html',
  host: { class: 'block' },
})
export class GeneratorPanel {
  protected readonly separatorOptions: readonly GeneratorSeparator[] = SEPARATOR_OPTIONS;
  protected readonly languageOptions: readonly GeneratorLanguage[] = AVAILABLE_LANGUAGES;

  protected readonly mode = signal<GeneratorMode>('words');

  protected readonly separator = signal(SEPARATOR_OPTIONS[0].value);
  protected readonly language = signal(AVAILABLE_LANGUAGES[0].value);
  protected readonly wordCount = signal(4);

  protected readonly lower = signal(true);
  protected readonly upper = signal(true);
  protected readonly numbers = signal(true);
  protected readonly other = signal(false);
  protected readonly length = signal(20);

  /** The four character sets as tiles: what each one adds, and the switch for it. */
  protected readonly charsets = [
    { label: 'a–z', value: this.lower },
    { label: 'A–Z', value: this.upper },
    { label: '0–9', value: this.numbers },
    { label: '?()/%…', value: this.other },
  ] as const;

  protected readonly value = signal('');
  protected readonly copied = signal(false);

  /** Nothing to draw from, so nothing is generated — said out loud rather than left blank. */
  protected readonly charsetEmpty = computed(
    () => !this.lower() && !this.upper() && !this.numbers() && !this.other(),
  );

  /** The result split into runs of one kind, so a 150-character string is a handful of spans. */
  protected readonly segments = computed<ResultSegment[]>(() => {
    const runs: ResultSegment[] = [];
    for (const char of this.value()) {
      const kind = kindOf(char);
      const last = runs[runs.length - 1];
      if (last?.kind === kind) {
        last.text += char;
      } else {
        runs.push({ kind, text: char });
      }
    }
    return runs;
  });

  /** The same 0–4 scale and wording the vault uses for saved passwords. */
  private readonly strength = computed(() => estimatePasswordStrength(this.value()).score);
  protected readonly strengthPercent = computed(() => strengthPercent(this.strength()));
  protected readonly strengthColour = computed(() => STRENGTH_COLOURS[this.strength()]);
  protected readonly strengthLabel = computed(() =>
    this.i18n.translate(STRENGTH_LABELS[this.strength()]),
  );

  /** Characters, not UTF-16 units — a passphrase in Portuguese has accented letters. */
  protected readonly characterCount = computed(() => [...this.value()].length);

  private readonly i18n = inject(I18nService);

  private readonly resultRef = viewChild<ElementRef<HTMLElement>>('result');

  private readonly clipboard = inject(ClipboardService);

  constructor() {
    effect(() => {
      // Reading every option here is what makes the effect re-run whenever any one
      // of them changes; the generation itself is untracked so writing `value`
      // cannot feed back into it.
      this.mode();
      this.separator();
      this.language();
      this.wordCount();
      this.lower();
      this.upper();
      this.numbers();
      this.other();
      this.length();
      untracked(() => void this.generate());
    });
  }

  /**
   * The trigger stringifies the *value*, and the options only exist while the panel
   * is open — so a closed trigger would otherwise show `-` or `en`, not `Dash ( - )`.
   */
  protected readonly separatorLabel = (value: string): string =>
    this.i18n.translate(
      SEPARATOR_OPTIONS.find((option) => option.value === value)?.labelKey ??
        SEPARATOR_OPTIONS[0].labelKey,
    );

  protected readonly languageLabel = (value: string): string =>
    AVAILABLE_LANGUAGES.find((option) => option.value === value)?.label ?? value;

  /** The toggle group is typed for multi-select, so its value needs narrowing. */
  protected setMode(mode: unknown): void {
    if (mode === 'words' || mode === 'chars') {
      this.mode.set(mode);
    }
  }

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
  protected onWordCountChange(value: readonly number[]): void {
    this.wordCount.set(value[0]);
  }

  protected onLengthChange(value: readonly number[]): void {
    this.length.set(value[0]);
  }

  protected async generate(): Promise<void> {
    if (this.mode() === 'words') {
      this.value.set(await generatePassphrase(this.wordCount(), this.separator(), this.language()));
    } else {
      const charset =
        (this.lower() ? ALPHABETS.lowercase : '') +
        (this.upper() ? ALPHABETS.uppercase : '') +
        (this.numbers() ? ALPHABETS.digits : '') +
        (this.other() ? ALPHABETS.symbols : '');
      this.value.set(charset ? randomString(this.length(), charset) : '');
    }

    this.bounce();
  }

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
   * new value looks like the old one.
   *
   * Driven by `Element.animate` rather than a CSS class: it re-triggers on every call
   * without the remove-reflow-add dance a keyframe class needs, and it keeps a
   * one-component animation out of the one global stylesheet.
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
