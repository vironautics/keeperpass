import { AppLocale } from '../locales';
import { de } from './de';
import { en, TranslationTable } from './en';
import { es } from './es';
import { fr } from './fr';
import { pt } from './pt';

export type { TranslationKey, TranslationTable } from './en';

export const TRANSLATIONS: Readonly<Record<AppLocale, TranslationTable>> = { en, de, es, fr, pt };

/**
 * Whether a string is a real key in the source table — used by
 * `LocalizedTitleStrategy`, where `Route.title` is typed as a plain `string`
 * by Angular itself, so a `TranslationKey` arrives with that type information
 * already erased.
 */
export function isTranslationKey(value: string): value is keyof typeof en {
  return value in en;
}
