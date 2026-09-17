import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService, LOCALE_STORAGE_KEY } from './i18n.service';
import { AppLocale, DEFAULT_LOCALE, resolveBrowserLocale } from './locales';
import { TranslatePipe } from './translate.pipe';
import { TRANSLATIONS, TranslationKey } from './translations';

/** Points `navigator.languages` at `languages` for the duration of one test. */
function withBrowserLanguages(languages: readonly string[]): void {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages as string[]);
}

// `navigator` is shared across tests in one file, so a leaked spy would decide
// the starting locale of every test after it.
afterEach(() => vi.restoreAllMocks());

describe('resolveBrowserLocale', () => {
  it('takes the first preferred language the app has', () => {
    expect(resolveBrowserLocale(['fr-FR', 'en-US'])).toBe('fr');
  });

  it('skips languages the app does not have', () => {
    expect(resolveBrowserLocale(['ja', 'ko', 'de'])).toBe('de');
  });

  it('drops the region subtag, so pt-BR and pt-PT both resolve to pt', () => {
    expect(resolveBrowserLocale(['pt-BR'])).toBe('pt');
    expect(resolveBrowserLocale(['pt-PT'])).toBe('pt');
  });

  it('matches case-insensitively', () => {
    expect(resolveBrowserLocale(['ES-es'])).toBe('es');
  });

  it('falls back to English when none of the preferred languages match', () => {
    expect(resolveBrowserLocale(['ja', 'ko'])).toBe(DEFAULT_LOCALE);
  });

  it('falls back to English when the browser reports nothing', () => {
    expect(resolveBrowserLocale([])).toBe(DEFAULT_LOCALE);
  });
});

describe('I18nService', () => {
  it('starts at the browser language when nothing is stored', () => {
    withBrowserLanguages(['de-DE', 'en']);

    expect(TestBed.inject(I18nService).locale()).toBe('de');
  });

  it('starts at English when the browser language is one the app lacks', () => {
    withBrowserLanguages(['ja-JP']);

    expect(TestBed.inject(I18nService).locale()).toBe('en');
  });

  it('prefers a stored choice over the browser language', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');
    withBrowserLanguages(['de-DE']);

    expect(TestBed.inject(I18nService).locale()).toBe('fr');
  });

  it('ignores a stored locale the app no longer ships', () => {
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

    // Set explicitly rather than relying on whatever language the machine
    // running the suite reports.
    service.setLocale('en');
    expect(service.translate('settings.title')).toBe('Settings');

    service.setLocale('fr');
    expect(service.translate('settings.title')).toBe('Paramètres');
  });

  it('fills in placeholders', () => {
    const service = TestBed.inject(I18nService);
    // No shipped key uses placeholders yet, so exercise the interpolation
    // through a key stubbed into the active table.
    const table = TRANSLATIONS.en as Record<string, string>;
    table['test.greeting' as TranslationKey] = 'Hello {name}, you have {count} items';

    expect(service.translate('test.greeting' as TranslationKey, { name: 'Ada', count: 3 })).toBe(
      'Hello Ada, you have 3 items',
    );

    delete table['test.greeting'];
  });

  it('reflects the locale onto <html lang>', () => {
    const service = TestBed.inject(I18nService);

    service.setLocale('es');
    TestBed.tick();

    expect(document.documentElement.getAttribute('lang')).toBe('es');
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

  it('leaves nothing untranslated outside English', () => {
    // A non-English string identical to English is usually a forgotten key.
    // The exceptions are genuine cognates and shared terms.
    const shared = new Set([
      'settings.profile.title',
      'settings.profile.confirmation',
      'settings.data.title',
      'common.cancel',
      'settings.profile.email',
      'settings.profile.deleteTypeSuffix',
      // Cognates, acronyms and loanwords that legitimately read the same across
      // the shipped locales rather than forgotten translations.
      'common.name',
      'common.tags',
      'generator.passphrase',
      'items.templates.computer',
      'items.templates.note',
      'field.type.url',
      'field.type.ipHost',
      'field.type.pin',
      'field.type.text',
      'field.type.date',
      'items.templates.fields.cvc',
      'items.templates.fields.iban',
      'items.templates.fields.bic',
      'tags.title',
      'tags.itemsCountOne',
      'vaults.itemsCountOne',
      'layout.sidebar.support',
      'support.title',
      'support.terms.tagTermSingular',
      'support.faq.title',
      'auth.unlock.secretLabel',
      'auth.setup.secretLabel',
    ]);

    for (const locale of locales.filter((l) => l !== 'en')) {
      for (const key of englishKeys as TranslationKey[]) {
        if (shared.has(key)) {
          continue;
        }
        expect(TRANSLATIONS[locale][key], `${locale} "${key}" is identical to English`).not.toBe(
          TRANSLATIONS.en[key],
        );
      }
    }
  });
});

@Component({
  selector: 'app-translate-host',
  imports: [TranslatePipe],
  template: `{{ 'settings.title' | t }}`,
})
class TranslateHost {}

describe('TranslatePipe', () => {
  it('renders the active locale', () => {
    TestBed.inject(I18nService).setLocale('en');

    const fixture = TestBed.createComponent(TranslateHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Settings');
  });

  /**
   * The reason the pipe is impure. Nothing about the view changes here except
   * the locale signal — if this passes, switching language repaints the app
   * without a reload.
   */
  it('re-renders when only the locale changes', () => {
    const service = TestBed.inject(I18nService);
    service.setLocale('en');

    const fixture = TestBed.createComponent(TranslateHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Settings');

    service.setLocale('de');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Einstellungen');
    expect(fixture.nativeElement.textContent).not.toContain('Settings');
  });
});
