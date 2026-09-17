import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { I18nService } from '../i18n';
import { GoogleIdentityServices } from './google-identity-services';

export interface GoogleProfile {
  email: string;
  name: string;
}

export interface AuthRequestResult extends GoogleProfile {
  /** Already carries `drive.file` — see `GOOGLE_SCOPE` — so `/unlock` can fetch/create the vault file without its own consent popup. */
  accessToken: string;
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
  private readonly i18n = inject(I18nService);

  async signInWithGoogle(): Promise<AuthRequestResult> {
    const accessToken = await this.googleIdentity.requestAccessToken(
      environment.googleClientId,
      GOOGLE_SCOPE,
    );

    const profile = await this.fetchProfile(accessToken);
    return { ...profile, accessToken };
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
      throw new Error(this.i18n.translate('errors.auth.profileFailed'));
    }
    return (await response.json()) as GoogleProfile;
  }
}
