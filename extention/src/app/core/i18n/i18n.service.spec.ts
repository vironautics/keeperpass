import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService, LOCALE_STORAGE_KEY } from './i18n.service';
import { AppLocale, DEFAULT_LOCALE, resolveBrowserLocale } from './locales';
import { TranslatePipe } from './translate.pipe';
import { TRANSLATIONS } from './translations';

/** Points `navigator.languages` at `languages` for the duration of one test. */
function withBrowserLanguages(languages: readonly string[]): void {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages as string[]);
}

// `navigator` and `localStorage` are shared across tests in one file — a leaked
// spy or key would decide the starting locale of every test after it.
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('resolveBrowserLocale', () => {
  it('takes the first preferred language the popup has', () => {
    expect(resolveBrowserLocale(['fr-FR', 'en-US'])).toBe('fr');
  });

  it('skips languages the popup does not have', () => {
    expect(resolveBrowserLocale(['ja', 'ko', 'de'])).toBe('de');
  });

  it('drops the region subtag, so pt-BR and pt-PT both resolve to pt', () => {
    expect(resolveBrowserLocale(['pt-BR'])).toBe('pt');
    expect(resolveBrowserLocale(['pt-PT'])).toBe('pt');
  });

  it('falls back to English when nothing matches', () => {
    expect(resolveBrowserLocale(['ja', 'ko'])).toBe(DEFAULT_LOCALE);
    expect(resolveBrowserLocale([])).toBe(DEFAULT_LOCALE);
  });
});

describe('I18nService', () => {
  it('starts at the browser language when nothing is stored', () => {
    withBrowserLanguages(['de-DE', 'en']);

    expect(TestBed.inject(I18nService).locale()).toBe('de');
  });

  it('starts at English when the browser language is one the popup lacks', () => {
    withBrowserLanguages(['ja-JP']);

    expect(TestBed.inject(I18nService).locale()).toBe('en');
  });

  it('prefers a stored choice over the browser language', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');
    withBrowserLanguages(['de-DE']);

    expect(TestBed.inject(I18nService).locale()).toBe('fr');
  });

  it('ignores a stored locale the popup no longer ships', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'ja');
    withBrowserLanguages(['es-ES']);

    expect(TestBed.inject(I18nService).locale()).toBe('es');
  });

  it('does not persist the detected locale, so the browser stays in charge until asked', () => {
    withBrowserLanguages(['de-DE']);

    TestBed.inject(I18nService);

    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });

  it('persists an explicit choice', () => {
    const service = TestBed.inject(I18nService);

    service.setLocale('pt');

    expect(service.locale()).toBe('pt');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pt');
  });

  it('translates in the active locale', () => {
    const service = TestBed.inject(I18nService);

    service.setLocale('en');
    expect(service.translate('popup.allVaults')).toBe('All Vaults');

    service.setLocale('fr');
    expect(service.translate('popup.allVaults')).toBe('Tous les coffres-forts');
  });
});

describe('translation tables', () => {
  const locales = Object.keys(TRANSLATIONS) as AppLocale[];
  const englishKeys = Object.keys(TRANSLATIONS.en);

  it.each(locales)('%s covers every key in the source table', (locale) => {
    expect(Object.keys(TRANSLATIONS[locale]).sort()).toEqual([...englishKeys].sort());
  });

  it.each(locales)('%s has no blank strings', (locale) => {
    const blank = Object.entries(TRANSLATIONS[locale])
      .filter(([, value]) => !value.trim())
      .map(([key]) => key);

    expect(blank).toEqual([]);
  });
});

@Component({
  selector: 'app-translate-host',
  imports: [TranslatePipe],
  template: `{{ 'popup.allVaults' | t }}`,
})
class TranslateHost {}

describe('TranslatePipe', () => {
  /**
   * The reason the pipe is impure. Nothing about the view changes here except
   * the locale signal — if this passes, switching language repaints the popup
   * without a reload.
   */
  it('re-renders when only the locale changes', () => {
    const service = TestBed.inject(I18nService);
    service.setLocale('en');

    const fixture = TestBed.createComponent(TranslateHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('All Vaults');

    service.setLocale('de');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Alle Tresore');
    expect(fixture.nativeElement.textContent).not.toContain('All Vaults');
  });
});
