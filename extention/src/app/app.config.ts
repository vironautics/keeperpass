import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { SessionStore } from './core/auth/session.store';
import { VaultSessionService } from './core/vault/vault-session.service';
import { routes } from './app.routes';

/**
 * Restores the session, then the vault behind it.
 *
 * Only the session read is awaited before the first paint — it is a couple of
 * milliseconds out of `chrome.storage.session`. The vault comes from
 * `VaultSessionService`, which prefers its session cache and only reaches for
 * Drive when there isn't one, so a normal popup open paints immediately.
 */
async function restoreSession(session: SessionStore, vault: VaultSessionService): Promise<void> {
  await session.restore();
  void vault.restore();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    /**
     * Awaited before the first render: `chrome.storage.session` is async, and
     * without this the popup would paint the signed-out screen first and
     * correct itself a tick later — a visible flash on every open.
     */
    provideAppInitializer(() => restoreSession(inject(SessionStore), inject(VaultSessionService))),
    provideRouter(routes),
  ],
};
