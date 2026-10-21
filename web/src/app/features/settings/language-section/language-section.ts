import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLanguages } from '@ng-icons/lucide';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { I18nService, isAppLocale, TranslatePipe } from '../../../core/i18n';

/**
 * The interface language picker: `I18nService.options` in an `hlm-select`, the
 * same control the generator uses for its word-list language.
 *
 * Subscribes to `valueChanges` rather than mirroring the control into a
 * signal and writing from an `effect`: an effect would also fire on init and
 * persist the browser-detected locale, which would pin a user to whatever
 * language their browser reported the first time they opened this page. Only
 * an actual selection should be remembered.
 */
@Component({
  selector: 'app-language-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, NgIcon, HlmSelectImports],
  providers: [provideIcons({ lucideLanguages })],
  templateUrl: './language-section.html',
  host: { class: 'block' },
})
export class LanguageSection {
  private readonly i18n = inject(I18nService);

  protected readonly localeOptions = this.i18n.options;

  protected readonly control = new FormControl<string>(this.i18n.locale(), { nonNullable: true });

  /** The trigger shows the value, which is a code — so it needs the label for it. */
  protected readonly localeLabel = (value: string): string =>
    this.localeOptions.find((option) => option.value === value)?.label ?? value;

  constructor() {
    this.control.valueChanges.pipe(takeUntilDestroyed()).subscribe((locale) => {
      if (isAppLocale(locale)) {
        this.i18n.setLocale(locale);
      }
    });
  }
}
