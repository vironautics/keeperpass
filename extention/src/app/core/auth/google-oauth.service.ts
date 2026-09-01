import { Injectable, signal } from '@angular/core';
import { SESSION_KEYS, sessionGet } from '../storage/extension-session-storage';

declare const chrome: any;

/**
 * Google OAuth error types
 */
export class GoogleAuthError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}

export class GoogleAuthExpiredError extends GoogleAuthError {
  constructor() {
    super('auth_expired', 'Google authentication token has expired. Please sign in again.');
  }
}

export class GoogleAuthCancelledError extends GoogleAuthError {
  constructor() {
    super('auth_cancelled', 'Google sign-in was cancelled.');
  }
}

export class GoogleAuthNetworkError extends GoogleAuthError {
  constructor(details: string) {
    super('auth_network_error', `Network error during authentication: ${details}`);
  }
}

interface OAuthMessageResponse {
  accessToken?: string;
  error?: string;
}

function sendToBackground(action: string): Promise<OAuthMessageResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action }, (response: OAuthMessageResponse | undefined) => {
      if (chrome.runtime.lastError) {
        reject(new GoogleAuthError('messaging_error', chrome.runtime.lastError.message));
        return;
      }
      resolve(response ?? { error: 'No response from the extension background script.' });
    });
  });
}

/**
 * Handles Google sign-in for the extension.
 *
 * The actual OAuth work — an implicit-grant flow driven by
 * `identity.launchWebAuthFlow()` — runs in `src/scripts/background.ts`, not
 * here. `launchWebAuthFlow` opens a real browser window for Google's consent
 * screen, and an extension popup closes the moment that window takes focus;
 * the background service worker survives that, this popup-hosted service
 * doesn't. This class is a thin messaging wrapper so every existing caller
 * (`StartPage`, `VaultSessionService`) keeps the same method signatures and
 * error types regardless of which context actually does the work.
 *
 * Scoped for `drive.file`: only access to files created by this app. Same
 * scope as before — this only changed *how* the token is obtained
 * (`identity.launchWebAuthFlow`, a real WebExtensions-spec flow that works on
 * Chrome, Edge and Firefox alike), not what it grants access to. See
 * `core/auth/google-oauth-flow.ts` for the flow itself, and why it's an
 * implicit grant rather than authorization-code + PKCE.
 */
@Injectable({ providedIn: 'root' })
export class GoogleOAuthService {
  private readonly _isLoading = signal(false);

  readonly isLoading = this._isLoading.asReadonly();

  /** No-op: nothing to preload for a message-passing flow. */
  async initialize(): Promise<void> {}

  /**
   * Sign in with Google. Shows Google's OAuth consent screen (unless this
   * browser profile already consented recently) and returns an access token
   * scoped for `drive.file`.
   */
  async signIn(): Promise<string> {
    if (this._isLoading()) {
      throw new GoogleAuthError('already_signing_in', 'Sign-in is already in progress.');
    }

    this._isLoading.set(true);

    try {
      const response = await sendToBackground('googleSignIn');

      if (!response.accessToken) {
        const message = response.error ?? 'Unknown error';
        if (message.includes('user_cancelled_popup_flow') || message.includes('popup_closed')) {
          throw new GoogleAuthCancelledError();
        }
        throw new GoogleAuthError('token_error', message);
      }

      return response.accessToken;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * There is no silent renewal path: the implicit grant this flow uses
   * (see `core/auth/google-oauth-flow.ts` for why — a Web application OAuth
   * client wants its secret for a code exchange regardless of PKCE, and an
   * extension can never hold one safely) never issues a refresh token, only
   * the authorization-code grant does. An expired token always means asking
   * the user through a fresh `signIn()`; every caller of this method already
   * treats a thrown `GoogleAuthExpiredError` as "disconnect and reconnect"
   * (see `disconnect-session.ts`), so this just goes straight there.
   */
  async renewToken(_staleToken: string): Promise<never> {
    throw new GoogleAuthExpiredError();
  }

  /**
   * Verify the access token is still valid by making a test API call
   * Throws GoogleAuthExpiredError if token is invalid/expired
   */
  async verifyToken(token: string): Promise<void> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token);

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          throw new GoogleAuthExpiredError();
        }
        throw new GoogleAuthNetworkError(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Check if token has drive.file scope
      const scopes = (data.scope || '').split(' ');
      if (!scopes.includes('https://www.googleapis.com/auth/drive.file')) {
        throw new GoogleAuthError(
          'insufficient_scope',
          'Token does not have the required drive.file scope.',
        );
      }
    } catch (error) {
      if (error instanceof GoogleAuthError) {
        throw error;
      }
      throw new GoogleAuthNetworkError(
        error instanceof Error ? error.message : 'Failed to verify token',
      );
    }
  }

  /**
   * Revoke the access token and sign out
   */
  async signOut(): Promise<void> {
    try {
      // From `chrome.storage.session`, not `sessionStorage`: the popup that
      // signed in has its own document, and its `sessionStorage` is already
      // gone by the time another popup calls this.
      const token = await sessionGet<string>(SESSION_KEYS.accessToken);

      if (token) {
        // Revoke the token on Google's servers.
        await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
      }
    } catch (error) {
      console.warn('Error during sign-out:', error);
    }
  }
}
