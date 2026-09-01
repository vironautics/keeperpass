import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import {
  AppLocale,
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
  isAppLocale,
  resolveBrowserLocale,
} from './locales';
import { TRANSLATIONS, TranslationKey } from './translations';

/** `localStorage` key — see the class doc comment for why this is per-device, not per-account. */
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
 * falling back to English. A stored value for a locale the app no longer ships
 * fails `isAppLocale` and is treated as absent rather than left to blow up at
 * lookup time.
 */
function loadInitialLocale(): AppLocale {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) — fall through
    // to browser detection rather than failing to start.
  }

  if (isAppLocale(stored)) {
    return stored;
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  return resolveBrowserLocale(preferred ?? []);
}

/**
 * The interface language, and the lookup that turns keys into copy.
 *
 * Runtime translation rather than Angular's built-in `$localize`: that is
 * resolved at build time into one bundle per locale, so switching requires
 * serving a different build and reloading. The requirement here is a picker
 * that takes effect immediately and remembers the choice, so the tables ship
 * together and the active one is a signal.
 *
 * The choice lives in `localStorage`, not in the vault: it is a property of
 * this browser, like `RecentItemsService`'s history, and writing it to the
 * vault would mean a sync round-trip to change a dropdown. It is deliberately
 * *not* written on startup — a user who never opens the picker keeps
 * following their browser's language if that changes later.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  /** Ready to hand to `<app-select>`'s `options`. */
  readonly options = AVAILABLE_LOCALES;

  private readonly document = inject(DOCUMENT);

  private readonly _locale = signal<AppLocale>(loadInitialLocale());

  readonly locale = this._locale.asReadonly();

  constructor() {
    // Keeps `<html lang>` truthful, which is what screen readers and the
    // browser's own translation prompt read.
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
   * Falls back to English, then to the key itself, so an untranslated screen
   * degrades to readable English instead of a blank.
   */
  translate(key: TranslationKey, params?: TranslationParams): string {
    const template = TRANSLATIONS[this._locale()][key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key;
    return params ? interpolate(template, params) : template;
  }
}
