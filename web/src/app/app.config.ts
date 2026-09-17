import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';

import { AnalyticsService } from './core/analytics/analytics.service';
import { TokenRefreshService } from './core/auth/token-refresh.service';
import { LocalizedTitleStrategy } from './core/i18n';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    /**
     * Watches for the app regaining focus and renews an aged-out Google token
     * then, rather than letting the next Drive call discover it — see
     * `TokenRefreshService`.
     */
    provideAppInitializer(() => inject(TokenRefreshService).start()),
    // Reports a GA4 page_view on every route change — see `AnalyticsService`.
    provideAppInitializer(() => inject(AnalyticsService).start()),
    // Route parameters arrive as component inputs, e.g. ItemView's `itemId`.
    provideRouter(routes, withComponentInputBinding()),
    // Route `title`s are translation keys, not literal text — see `app.routes.ts`.
    { provide: TitleStrategy, useClass: LocalizedTitleStrategy },
  ],
};
