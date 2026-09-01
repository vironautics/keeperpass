import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { TokenRefreshService } from './core/auth/token-refresh.service';
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
    // Route parameters arrive as component inputs, e.g. ItemView's `itemId`.
    provideRouter(routes, withComponentInputBinding()),
  ],
};
