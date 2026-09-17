import { toSignal } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSlider } from '@spartan-ng/helm/slider';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { ClipboardService } from '../../../core/clipboard/clipboard.service';
import { TranslatePipe } from '../../../core/i18n';
import {
  AVAILABLE_LANGUAGES,
  CHARS,
  generatePassphrase,
  randomString,
} from '../../../core/generator/generator';
import { SelectOption } from '../../../core/select-option';
import { Icon } from '../../../ui/icon/icon';

type GeneratorMode = 'words' | 'chars';

/** How long the copy confirmation stays on the button. */
const COPIED_FEEDBACK_MS = 1000;

/** How long the regenerate "bounce" plays for. */
const BOUNCE_DURATION_MS = 500;

const SEPARATOR_OPTIONS: readonly SelectOption[] = [
  { value: '-', label: 'Dash ( - )' },
  { value: '_', label: 'Underscore ( _ )' },
  { value: '/', label: 'Slash ( / )' },
  { value: ' ', label: 'Space (   )' },
];

/**
 * A passphrase, or a random-character string — regenerated live as any
 * option changes, and copyable to the clipboard.
 *
 * Ported from the source app's `pl-generator`, which regenerates on a single
 * delegated `change` listener; here each option is a signal (or a
 * `FormControl` bridged to one via `toSignal`) read inside one `effect()`, so
 * changing any of them re-runs `generate()` the same way.
 */
@Component({
  selector: 'app-generator-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    ReactiveFormsModule,
    TranslatePipe,
    HlmButton,
    HlmCardImports,
    HlmCheckbox,
    HlmFieldImports,
    HlmLabel,
    HlmSelectImports,
    HlmSlider,
    HlmToggleGroupImports,
  ],
  templateUrl: './generator-panel.html',
  host: { class: 'block' },
})
export class GeneratorPanel {
  protected readonly separatorOptions = SEPARATOR_OPTIONS;
  protected readonly languageOptions: readonly SelectOption[] = AVAILABLE_LANGUAGES;

  protected readonly separatorControl = new FormControl(SEPARATOR_OPTIONS[0].value, {
    nonNullable: true,
  });
  protected readonly languageControl = new FormControl(AVAILABLE_LANGUAGES[0].value, {
    nonNullable: true,
  });

  private readonly separator = toSignal(this.separatorControl.valueChanges, {
    initialValue: this.separatorControl.value,
  });
  private readonly language = toSignal(this.languageControl.valueChanges, {
    initialValue: this.languageControl.value,
  });

  protected readonly mode = signal<GeneratorMode>('words');
  protected readonly wordCount = signal(4);

  protected readonly lower = signal(true);
  protected readonly upper = signal(true);
  protected readonly numbers = signal(true);
  protected readonly other = signal(false);
  protected readonly length = signal(20);

  protected readonly value = signal('');
  protected readonly copied = signal(false);

  private readonly resultRef = viewChild<ElementRef<HTMLElement>>('result');

  private readonly clipboard = inject(ClipboardService);

  constructor() {
    effect(() => {
      // Reading every option here is what makes the effect re-run whenever
      // any one of them changes.
      this.mode();
      this.separator();
      this.language();
      this.wordCount();
      this.lower();
      this.upper();
      this.numbers();
      this.other();
      this.length();
      void this.generate();
    });
  }

  protected selectMode(mode: GeneratorMode): void {
    this.mode.set(mode);
  }

  /** `hlm-toggle-group` is typed for multi-select, so its value needs narrowing. */
  protected onModePicked(mode: unknown): void {
    if (mode === 'words' || mode === 'chars') {
      this.selectMode(mode);
    }
  }

  /**
   * The trigger stringifies the *value*, and the options only exist while the
   * panel is open — so a closed trigger would otherwise show `-` or `en`, not
   * `Dash ( - )`.
   */
  protected readonly separatorLabel = (value: string): string =>
    SEPARATOR_OPTIONS.find((option) => option.value === value)?.label ?? value;

  protected readonly languageLabel = (value: string): string =>
    AVAILABLE_LANGUAGES.find((option) => option.value === value)?.label ?? value;

  protected onSeparatorPicked(value: unknown): void {
    if (typeof value === 'string') {
      this.separatorControl.setValue(value);
    }
  }

  protected onLanguagePicked(value: unknown): void {
    if (typeof value === 'string') {
      this.languageControl.setValue(value);
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
      let charset = '';
      if (this.lower()) {
        charset += CHARS.lower;
      }
      if (this.upper()) {
        charset += CHARS.upper;
      }
      if (this.numbers()) {
        charset += CHARS.numbers;
      }
      if (this.other()) {
        charset += CHARS.other;
      }
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
   * Driven by `Element.animate` rather than a CSS keyframe class: it
   * re-triggers on every call without the remove-reflow-add dance a keyframe
   * class needs, and needs no stylesheet of its own now that the legacy
   * global `_animation.scss` (which defined `@keyframes bounce`) is gone.
   */
  private bounce(): void {
    const el = this.resultRef()?.nativeElement;
    if (!el) {
      return;
    }

    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
      { duration: BOUNCE_DURATION_MS, easing: 'ease' },
    );
  }
}
