/** The locales the interface is translated into. */
export type AppLocale = 'en' | 'de' | 'es' | 'fr' | 'pt';

/**
 * One entry in the language picker.
 *
 * Its own type, so `core` owes the UI layer nothing. `value` is an `AppLocale`
 * rather than a string, which is what makes a typo in the list below a compile
 * error instead of a language nobody can select.
 */
export interface LocaleOption {
  value: AppLocale;
  label: string;
}

/**
 * The locale the app is written in. Every translation key is guaranteed to have
 * a string here, so it doubles as the fallback whenever another table is missing
 * one — a half-translated screen still reads.
 */
export const DEFAULT_LOCALE: AppLocale = 'en';

/**
 * The languages offered, shaped as options so the picker can bind to it
 * directly.
 *
 * Labels are endonyms: a language picker you have to already read the interface
 * language to use is no help to the person looking for their own.
 *
 * This is not the same setting as the generator's word-list language, even
 * though the two happen to cover the same five languages today — one chooses
 * what the interface says, the other what a passphrase is built from, and
 * someone reading a French interface may well want an English passphrase. They
 * stay separate lists so either can grow without dragging the other along.
 */
export const AVAILABLE_LOCALES: readonly LocaleOption[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
];

const OFFERED = new Set<string>(AVAILABLE_LOCALES.map((option) => option.value));

/**
 * Whether a string is a locale this build has. Written as a type guard because
 * every caller is narrowing something untrusted — a stored preference, a form
 * control's value, a browser tag.
 */
export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return !!value && OFFERED.has(value);
}

/**
 * The first of the browser's preferred languages this app actually has, or
 * `DEFAULT_LOCALE` when it has none of them.
 *
 * Region subtags are dropped before matching, so `pt-BR`, `pt-PT` and `pt` all
 * arrive at `pt`: a Brazilian reader is far better served by Portuguese than by
 * the English fallback. Matching is case-insensitive because `navigator.languages`
 * is only conventionally lower-case, not guaranteed to be.
 */
export function resolveBrowserLocale(languages: readonly string[]): AppLocale {
  for (const tag of languages) {
    const primary = tag.split('-')[0]?.toLowerCase();
    if (isAppLocale(primary)) {
      return primary;
    }
  }

  return DEFAULT_LOCALE;
}
