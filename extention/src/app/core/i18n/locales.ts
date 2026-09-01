import { SelectOption } from '../select-option';

/** The locales the interface is translated into. */
export type AppLocale = 'en' | 'de' | 'es' | 'fr' | 'pt';

/**
 * The source locale. Every translation key is guaranteed to have a string
 * here, so it doubles as the fallback when another table is missing one.
 */
export const DEFAULT_LOCALE: AppLocale = 'en';

/**
 * Shaped as `SelectOption[]` so it drops straight into `<app-select>`.
 *
 * Labels are endonyms: a language picker you can only read once you have
 * already found your language is no use to the person looking for it.
 *
 * Keep in step with `ngkeeper/src/app/core/i18n/locales.ts` — the popup and
 * the web app are separate origins and cannot share a stored choice, but they
 * should at least offer the same list.
 */
export const AVAILABLE_LOCALES: readonly SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
];

const SUPPORTED = new Set<string>(AVAILABLE_LOCALES.map((option) => option.value));

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return !!value && SUPPORTED.has(value);
}

/**
 * The first of the browser's preferred languages the app actually has, or
 * `DEFAULT_LOCALE` if it has none of them.
 *
 * Region subtags are dropped before matching, so `pt-BR`, `pt-PT` and `pt` all
 * resolve to `pt`. Matching is case-insensitive because `navigator.languages`
 * is only conventionally lowercase, not guaranteed to be.
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
