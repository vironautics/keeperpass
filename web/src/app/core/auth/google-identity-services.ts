import { inject, Injectable } from '@angular/core';
import { I18nService, TranslationKey } from '../i18n';

/**
 * Thin wrapper around Google Identity Services' OAuth 2.0 token client
 * (https://accounts.google.com/gsi/client). Not published as `@types`, so
 * the handful of shapes we actually call are declared locally.
 */
interface GoogleTokenResponse {
  access_token: string;
  /** Lifetime in seconds — Google issues about an hour. */
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken(overrides?: { prompt?: string }): void;
}

/**
 * The `error_callback` payload for failures that never reach OAuth at all —
 * the popup itself couldn't run. Per Google's JS API reference this has a
 * fixed `type` and no `message` field:
 * https://developers.google.com/identity/oauth2/web/reference/js-reference
 */
interface GoogleTokenClientError {
  type: 'popup_failed_to_open' | 'popup_closed' | 'unknown';
}

const TOKEN_CLIENT_ERROR_KEYS: Record<GoogleTokenClientError['type'], TranslationKey> = {
  popup_failed_to_open: 'errors.auth.popupBlocked',
  popup_closed: 'errors.auth.popupClosed',
  unknown: 'errors.auth.unknown',
};

/** An access token and the moment it stops being usable. */
export interface AccessTokenGrant {
  accessToken: string;
  /** Epoch ms. */
  expiresAt: number;
}

/** Treat a token as expired slightly early, so it can't die mid-request. */
const EXPIRY_SKEW_MS = 60_000;

/** Fallback when Google omits `expires_in` — its documented default. */
const DEFAULT_LIFETIME_MS = 3_600_000;

interface GoogleIdentityServicesApi {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: GoogleTokenResponse) => void;
        error_callback?: (error: GoogleTokenClientError) => void;
      }): GoogleTokenClient;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServicesApi;
  }
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/**
 * A class (rather than plain functions) so tests can swap it out via
 * Angular's `TestBed` DI instead of mocking a relative import, which the
 * Angular unit-test runner doesn't support.
 */
@Injectable({ providedIn: 'root' })
export class GoogleIdentityServices {
  private readonly i18n = inject(I18nService);
  private scriptLoadPromise: Promise<void> | null = null;

  /**
   * Warms up the sign-in service as soon as it's created — see `AuthService`.
   * Failure here is not an error: it clears the cached promise (above) so the
   * user's click retries, and swallowing it keeps a warm-up miss from
   * surfacing as an unhandled rejection.
   */
  private readonly preload = this.ensureLoaded().catch(() => {});

  /**
   * Fetches the Google Identity Services script, once. Safe to call
   * speculatively (e.g. as soon as the sign-in page mounts) so that by the
   * time the user actually clicks, `requestAccessToken` only has to wait on
   * `initTokenClient`/`requestAccessToken`, not a network round-trip —
   * popups opened after too long an async gap from the click are liable to
   * be blocked by the browser's popup blocker.
   */
  ensureLoaded(): Promise<void> {
    if (window.google?.accounts?.oauth2) {
      return Promise.resolve();
    }
    if (!this.scriptLoadPromise) {
      this.scriptLoadPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          // Drop the failed tag so the retry below starts from a clean slate
          // rather than leaving a dead <script> in the head.
          script.remove();
          reject(new Error('Failed to load Google Identity Services.'));
        };
        document.head.appendChild(script);
      }).catch((error) => {
        // Without this the rejected promise stays cached and *every* later
        // attempt fails instantly — one dropped request (a flaky connection, a
        // blocker that was briefly in the way, a slow cold start) would
        // otherwise wedge sign-in until the page is reloaded. Clearing it lets
        // the next click try again.
        this.scriptLoadPromise = null;
        throw error;
      });
    }
    return this.scriptLoadPromise;
  }

  /**
   * Runs Google's OAuth 2.0 consent popup and resolves with the access
   * token granted for `scope`. Rejects if the user closes the popup or
   * Google reports an error.
   *
   * Per Google's migration guidance, this needs a direct user gesture (a
   * click, not a focus/timer event) to reliably open its popup — "a user
   * gesture is required to request an access token, even if there was a
   * prior request"
   * (https://developers.google.com/identity/oauth2/web/guides/migration-to-gis).
   * Called without one, the browser can block the popup and neither
   * `callback` nor `error_callback` may ever fire — see `AuthService`'s
   * `RENEWAL_TIMEOUT_MS`, which is what actually bounds that case; this
   * method itself has no timeout of its own.
   */
  async requestAccessToken(
    clientId: string,
    scope: string,
    /**
     * `''` asks Google to skip the consent UI and reuse the existing session
     * — how a token is renewed without interrupting the user. It fails rather
     * than prompting when that isn't possible, so callers fall back to an
     * interactive request.
     */
    prompt?: string,
  ): Promise<AccessTokenGrant> {
    // `ensureLoaded()`, not `preload`: the warm-up swallows its own failure so
    // a miss can't surface as an unhandled rejection, which means awaiting it
    // resolves even when the script never arrived. This retries instead, and
    // reports a real error if it still can't load.
    await this.ensureLoaded();

    const oauth2 = window.google?.accounts?.oauth2;
    if (!oauth2) {
      // Loaded without defining what we need — a blocked or truncated
      // response. Clear the cache so the next attempt refetches rather than
      // failing the same way forever.
      this.scriptLoadPromise = null;
      throw new Error(this.i18n.translate('errors.auth.gisLoadFailed'));
    }

    return new Promise<AccessTokenGrant>((resolve, reject) => {
      const client = oauth2.initTokenClient({
        client_id: clientId,
        scope,
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          const lifetime = response.expires_in ? response.expires_in * 1000 : DEFAULT_LIFETIME_MS;
          resolve({
            accessToken: response.access_token,
            expiresAt: Date.now() + lifetime - EXPIRY_SKEW_MS,
          });
        },
        error_callback: (error) => {
          const key = TOKEN_CLIENT_ERROR_KEYS[error.type] ?? TOKEN_CLIENT_ERROR_KEYS.unknown;
          reject(new Error(this.i18n.translate(key)));
        },
      });
      client.requestAccessToken(prompt === undefined ? undefined : { prompt });
    });
  }
}
