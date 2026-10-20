import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GoogleIdentityServices } from '../../auth/google-identity-services';
import { I18nService } from '../../i18n';
import { AuthProvider, ProviderProfile, TokenGrant } from '../provider';

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
 * `renew` is also called from places with no gesture at all (e.g.
 * `TokenRefreshService`'s focus/visibility check), where the browser can
 * silently block the popup without EITHER Google Identity Services callback
 * ever firing. Without a bound, that would hang this renewal — and, because
 * `AuthService` shares one in-flight renewal, every later caller (including a
 * real, gestured one) waiting on it — forever, until the page is reloaded.
 * This timeout guarantees it always eventually settles instead.
 */
const RENEWAL_TIMEOUT_MS = 8_000;

/** Google sign-in through Google Identity Services, with Drive as the storage. */
@Injectable({ providedIn: 'root' })
export class GoogleAuthProvider implements AuthProvider {
  readonly id = 'google' as const;
  readonly displayName = 'Google';
  readonly storageName = 'Google Drive';

  private readonly googleIdentity = inject(GoogleIdentityServices);
  private readonly i18n = inject(I18nService);

  isConfigured(): boolean {
    return environment.googleClientId.length > 0;
  }

  async signIn(): Promise<TokenGrant & ProviderProfile> {
    const grant = await this.googleIdentity.requestAccessToken(
      environment.googleClientId,
      GOOGLE_SCOPE,
    );

    const profile = await this.fetchProfile(grant.accessToken);
    return { ...profile, ...grant };
  }

  /**
   * Asks Google with `prompt: ''`, which reuses the existing session and never
   * shows UI — it simply fails if the user is no longer signed in. See
   * `RENEWAL_TIMEOUT_MS` for why this can't just await that request directly.
   */
  async renew(_current: TokenGrant): Promise<TokenGrant> {
    let timer!: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error('Timed out waiting for Google to renew the session.')),
        RENEWAL_TIMEOUT_MS,
      );
    });

    try {
      return await Promise.race([
        this.googleIdentity.requestAccessToken(environment.googleClientId, GOOGLE_SCOPE, ''),
        timeout,
      ]);
    } finally {
      clearTimeout(timer);
    }
  }

  async fetchProfile(accessToken: string): Promise<ProviderProfile> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error(this.i18n.translate('errors.auth.profileFailed'));
    }
    return (await response.json()) as ProviderProfile;
  }
}
