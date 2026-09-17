import { effect, inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18nService } from './i18n.service';
import { isTranslationKey } from './translations';

/**
 * Angular's `DefaultTitleStrategy` treats `Route.title` as the literal
 * `document.title` — fine for an app with one language, wrong here, where
 * every route's `title` is actually a `TranslationKey` (see the note atop
 * `app.routes.ts`). This resolves that key through `I18nService` instead of
 * setting it verbatim.
 *
 * Re-applies on every locale change too, not only on navigation: without the
 * `effect`, the tab title would stay in whatever language it was on when the
 * user last navigated, even after switching languages in Settings without
 * leaving the page.
 */
@Injectable({ providedIn: 'root' })
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);

  /** The deepest route's raw `title` from the last navigation — re-translated on locale change. */
  private lastTitle: string | undefined;

  constructor() {
    super();
    effect(() => {
      this.i18n.locale();
      if (this.lastTitle !== undefined) {
        this.title.setTitle(this.resolve(this.lastTitle));
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastTitle = this.buildTitle(snapshot);
    if (this.lastTitle !== undefined) {
      this.title.setTitle(this.resolve(this.lastTitle));
    }
  }

  private resolve(rawTitle: string): string {
    return isTranslationKey(rawTitle) ? this.i18n.translate(rawTitle) : rawTitle;
  }
}
