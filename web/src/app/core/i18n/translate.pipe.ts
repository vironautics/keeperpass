import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService, TranslationParams } from './i18n.service';
import { TranslationKey } from './translations';

/**
 * `{{ 'settings.title' | t }}`, or with placeholders,
 * `{{ 'vault.itemCount' | t: { count: total() } }}`.
 *
 * Impure on purpose. A pure pipe re-runs only when its *arguments* change, and
 * the key does not change when the language does — so a pure pipe would render
 * the old language until something else happened to dirty the view. Impure
 * costs nothing here: the app is zoneless, so `transform` runs only when the
 * view refreshes, and the `locale()` read inside it is what schedules that
 * refresh in the first place.
 *
 * The `TranslationKey` parameter type means a typo in a template key is a
 * build error, not a string that quietly renders itself.
 */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: TranslationKey, params?: TranslationParams): string {
    return this.i18n.translate(key, params);
  }
}
