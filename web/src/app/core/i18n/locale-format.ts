import { signal } from '@angular/core';
import { AppLocale, DEFAULT_LOCALE } from './locales';

/**
 * The BCP 47 tag each interface language formats dates and numbers with. Portuguese is
 * European, matching the copy (`ficheiro`, `palavra-passe`).
 */
const FORMAT_TAGS: Readonly<Record<AppLocale, string>> = {
  en: 'en',
  de: 'de',
  es: 'es',
  fr: 'fr',
  pt: 'pt-PT',
};

/**
 * The interface language, as seen by plain formatting functions.
 *
 * `Intl` formatters left to their own devices use the *browser's* locale, so a French
 * browser showed "il y a 6 heures" in an English interface. Everything that formats a
 * date asks this instead. It is a signal so a computed or template that formats a date
 * re-runs when the language is switched, without each caller injecting `I18nService`.
 * `I18nService` is the only writer.
 */
const activeLocale = signal<AppLocale>(DEFAULT_LOCALE);

export function setFormattingLocale(locale: AppLocale): void {
  activeLocale.set(locale);
}

/** The tag to hand to `Intl.*` and `toLocale*String` — never `undefined`. */
export function formattingLocale(): string {
  return FORMAT_TAGS[activeLocale()];
}
