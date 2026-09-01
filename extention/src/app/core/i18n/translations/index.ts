import { AppLocale } from '../locales';
import { de } from './de';
import { en, TranslationTable } from './en';
import { es } from './es';
import { fr } from './fr';
import { pt } from './pt';

export type { TranslationKey, TranslationTable } from './en';

export const TRANSLATIONS: Readonly<Record<AppLocale, TranslationTable>> = { en, de, es, fr, pt };
