import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import {
  AppLocale,
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
  isAppLocale,
  resolveBrowserLocale,
} from './locales';
import { TRANSLATIONS, TranslationKey } from './translations';

/** `localStorage` key — see the class doc comment for why this is per-device. */
export const LOCALE_STORAGE_KEY = 'keeperpass:locale';

/** Values substitutable into a translated string via `{name}` placeholders. */
export type TranslationParams = Readonly<Record<string, string | number>>;

function interpolate(template: string, params: TranslationParams): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/**
 * Reads the stored choice, falling back to the browser's preferred language,
 * falling back to English. A stored value for a locale the popup no longer
 * ships fails `isAppLocale` and is treated as absent rather than left to blow
 * up at lookup time.
 */
function loadInitialLocale(): AppLocale {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    // Storage can be unavailable — fall through to browser detection rather
    // than failing to start.
  }

  if (isAppLocale(stored)) {
    return stored;
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  return resolveBrowserLocale(preferred ?? []);
}

/**
 * The popup's interface language, and the lookup that turns keys into copy.
 *
 * Deliberately `localStorage` and not `chrome.storage`: the initial locale has
 * to be known before the first paint or the header renders in English and
 * corrects itself a tick later, and `chrome.storage` is async. `localStorage`
 * is synchronous, per-extension, and survives the popup closing — the same
 * reasoning `RecentItemsService` already uses here.
 *
 * The choice does not travel to the web app: an extension and the site are
 * separate origins with separate storage. Both default to the browser's
 * language, so they agree until someone changes one of them.
 *
 * Not written on startup — a user who never opens the picker keeps following
 * their browser's language if that changes later.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  /** Ready to hand to `<app-select>`'s `options`. */
  readonly options = AVAILABLE_LOCALES;

  private readonly document = inject(DOCUMENT);

  private readonly _locale = signal<AppLocale>(loadInitialLocale());

  readonly locale = this._locale.asReadonly();

  constructor() {
    effect(() => this.document.documentElement.setAttribute('lang', this._locale()));
  }

  /** Switches language and remembers it on this device. */
  setLocale(locale: AppLocale): void {
    this._locale.set(locale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Unavailable storage costs persistence, not the switch itself.
    }
  }

  /**
   * The copy for `key` in the active locale, with any `{placeholder}` filled in.
   *
   * Falls back to English, then to the key itself, so an untranslated string
   * degrades to readable English instead of a blank.
   */
  translate(key: TranslationKey, params?: TranslationParams): string {
    const template = TRANSLATIONS[this._locale()][key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key;
    return params ? interpolate(template, params) : template;
  }
}
