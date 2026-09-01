import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SessionStore } from './session.store';
import { GoogleIdentityServices } from './google-identity-services';

export interface GoogleProfile {
  email: string;
  name: string;
}

export interface AuthRequestResult extends GoogleProfile {
  /** Already carries `drive.file` — see `GOOGLE_SCOPE` — so `/unlock` can fetch/create the vault file without its own consent popup. */
  accessToken: string;
  /** Epoch ms at which `accessToken` stops being usable. */
  expiresAt: number;
}

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

/**
 * Requested in one popup, not two: `openid email profile` for sign-in, plus
 * `drive.file` (only files this app creates — never the rest of the user's
 * Drive) for fetching/creating the vault file at `/unlock`. Trades the
 * stricter incremental-authorization pattern (ask for Drive only once the
 * user reaches that step) for a single consent screen instead of two.
 */
const GOOGLE_SCOPE = 'openid email profile https://www.googleapis.com/auth/drive.file';

/**
 * Bound on how long a renewal is allowed to hang.
 *
 * Google's own migration guidance is explicit that `requestAccessToken()`
 * needs a direct user gesture to reliably open its popup — "a user gesture
 * is required to request an access token, even if there was a prior
 * request" (https://developers.google.com/identity/oauth2/web/guides/migration-to-gis).
 * `ensureFreshToken` is also called from places with no gesture at all (e.g.
 * `TokenRefreshService`'s focus/visibility check), where the browser can
 * silently block the popup without EITHER Google Identity Services callback
 * ever firing. Without a bound, that would hang this renewal — and, because
 * `renewal` below is shared, every later caller (including a real, gestured
 * one) waiting on it — forever, until the page is reloaded. This timeout
 * guarantees it always eventually settles instead.
 */
const RENEWAL_TIMEOUT_MS = 8_000;

/**
 * Entry point of the authentication flow.
 *
 * `signInWithGoogle` runs Google's real OAuth consent popup
 * (`environment.googleClientId`) and reads the resulting profile straight
 * from Google's userinfo endpoint.
 *
 * INTEGRATION SEAM
 * ----------------
 * The popup and the profile fetch are real. What's still missing is a
 * backend: a real deployment exchanges the access token server-side (never
 * calls Google's API directly from the browser — a token that can read the
 * user's profile shouldn't live in page JS longer than it has to), and asks
 * that backend whether the address already has an account, an existing
 * session it can restore, and so on. Once that backend exists, this is
 * where its response — session token, login-vs-signup branch, trusted
 * device — comes back too; extend `AuthRequestResult` then, not before.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly googleIdentity = inject(GoogleIdentityServices);
  private readonly session = inject(SessionStore);

  /** In-flight renewal, so concurrent Drive calls share one popup-free request. */
  private renewal: Promise<string> | null = null;

  async signInWithGoogle(): Promise<AuthRequestResult> {
    const { accessToken, expiresAt } = await this.googleIdentity.requestAccessToken(
      environment.googleClientId,
      GOOGLE_SCOPE,
    );

    const profile = await this.fetchProfile(accessToken);
    return { ...profile, accessToken, expiresAt };
  }

  /**
   * The access token to use right now, renewed first if it is at (or near)
   * its hour-long expiry.
   *
   * Renewal asks Google with `prompt: ''`, which reuses the existing session
   * and never shows UI — it simply fails if the user is no longer signed in,
   * and the caller falls back to disconnecting. Without this, every token
   * that aged out mid-session turned the next save into a forced sign-out.
   *
   * Concurrent callers share one request: several vault operations can be in
   * flight at once, and each firing its own renewal would be wasteful and
   * could interleave two different tokens.
   */
  async ensureFreshToken(): Promise<string> {
    if (!this.session.tokenExpired()) {
      return this.session.accessToken();
    }

    this.renewal ??= this.renewWithTimeout().finally(() => {
      this.renewal = null;
    });

    return this.renewal;
  }

  /** See `RENEWAL_TIMEOUT_MS` for why this can't just await the popup-free request directly. */
  private async renewWithTimeout(): Promise<string> {
    let timer!: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error('Timed out waiting for Google to renew the session.')),
        RENEWAL_TIMEOUT_MS,
      );
    });

    try {
      const { accessToken, expiresAt } = await Promise.race([
        this.googleIdentity.requestAccessToken(environment.googleClientId, GOOGLE_SCOPE, ''),
        timeout,
      ]);
      this.session.renewToken(accessToken, expiresAt);
      return accessToken;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Re-reads the Google profile for an already-granted access token, without
   * a consent popup. Needed because `AccountStore` only ever gets populated
   * from `signInWithGoogle()`'s own result — a session restored from
   * `sessionStorage` after a page refresh (see `SessionStore`) skips `/start`
   * entirely and would otherwise leave `AccountStore` on its placeholder fake
   * data for the rest of the tab's life. `UnlockPage` calls this on every
   * mount to (re)ground it in the real signed-in account.
   */
  async fetchProfile(accessToken: string): Promise<GoogleProfile> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error('Could not read your Google profile. Please try again.');
    }
    return (await response.json()) as GoogleProfile;
  }
}
