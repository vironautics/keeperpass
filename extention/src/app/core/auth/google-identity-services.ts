import { Injectable } from '@angular/core';

/**
 * Thin wrapper around Google Identity Services' OAuth 2.0 token client
 * (https://accounts.google.com/gsi/client). Not published as `@types`, so
 * the handful of shapes we actually call are declared locally.
 */
interface GoogleTokenResponse {
  access_token: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken(): void;
}

interface GoogleIdentityServicesApi {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: GoogleTokenResponse) => void;
        error_callback?: (error: { type: string; message?: string }) => void;
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
  private scriptLoadPromise: Promise<void> | null = null;

  /** Warms up the sign-in service as soon as it's created — see `AuthService`. */
  private readonly preload = this.ensureLoaded();

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
      this.scriptLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Identity Services.'));
        document.head.appendChild(script);
      });
    }
    return this.scriptLoadPromise;
  }

  /**
   * Runs Google's OAuth 2.0 consent popup and resolves with the access
   * token granted for `scope`. Rejects if the user closes the popup or
   * Google reports an error.
   */
  async requestAccessToken(clientId: string, scope: string): Promise<string> {
    await this.preload;

    return new Promise<string>((resolve, reject) => {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          resolve(response.access_token);
        },
        error_callback: (error) => {
          reject(new Error(error.message || error.type));
        },
      });
      client.requestAccessToken();
    });
  }
}
