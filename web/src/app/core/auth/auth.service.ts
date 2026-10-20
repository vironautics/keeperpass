import { inject, Injectable } from '@angular/core';
import { ProviderId, ProviderProfile, TokenGrant } from '../providers/provider';
import { ProviderRegistry } from '../providers/provider-registry';
import { SessionStore } from './session.store';

export interface AuthRequestResult extends ProviderProfile {
  /** Already scoped for the provider's vault storage, so `/unlock` can fetch/create the vault file without its own consent popup. */
  accessToken: string;
  /** Epoch ms at which `accessToken` stops being usable. */
  expiresAt: number;
  /** Only providers that can renew without UI hand one back. */
  refreshToken?: string;
}

/**
 * Entry point of the authentication flow, for whichever provider is in use.
 *
 * `signIn(providerId)` runs that provider's real sign-in and reads the
 * resulting profile. Everything else — renewal, profile re-reads — goes to the
 * provider the current session signed in with, so callers never name one.
 *
 * INTEGRATION SEAM
 * ----------------
 * The popup and the profile fetch are real. What's still missing is a
 * backend: a real deployment exchanges the access token server-side (never
 * calls a provider's API directly from the browser — a token that can read the
 * user's profile shouldn't live in page JS longer than it has to), and asks
 * that backend whether the address already has an account, an existing
 * session it can restore, and so on. Once that backend exists, this is
 * where its response — session token, login-vs-signup branch, trusted
 * device — comes back too; extend `AuthRequestResult` then, not before.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly registry = inject(ProviderRegistry);
  private readonly session = inject(SessionStore);

  /** In-flight renewal, so concurrent storage calls share one request. */
  private renewal: Promise<string> | null = null;

  async signIn(providerId: ProviderId): Promise<AuthRequestResult> {
    return this.registry.get(providerId).auth.signIn();
  }

  signInWithGoogle(): Promise<AuthRequestResult> {
    return this.signIn('google');
  }

  /**
   * The access token to use right now, renewed first if it is at (or near)
   * its expiry.
   *
   * Renewal is the provider's business (Google reuses its browser session,
   * others use a refresh token) and never shows UI — it simply fails if that
   * is not possible, and the caller falls back to disconnecting. Without this,
   * every token that aged out mid-session turned the next save into a forced
   * sign-out.
   *
   * Concurrent callers share one request: several vault operations can be in
   * flight at once, and each firing its own renewal would be wasteful and
   * could interleave two different tokens.
   */
  async ensureFreshToken(): Promise<string> {
    if (!this.session.tokenExpired()) {
      return this.session.accessToken();
    }

    this.renewal ??= this.renew().finally(() => {
      this.renewal = null;
    });

    return this.renewal;
  }

  private async renew(): Promise<string> {
    const current: TokenGrant = {
      accessToken: this.session.accessToken(),
      expiresAt: 0,
      refreshToken: this.session.refreshToken() || undefined,
    };

    const grant = await this.registry.active().auth.renew(current);
    this.session.renewToken(grant.accessToken, grant.expiresAt, grant.refreshToken);
    return grant.accessToken;
  }

  /**
   * Re-reads the profile for an already-granted access token, without a
   * consent popup. Needed because `AccountStore` only ever gets populated
   * from `signIn()`'s own result — a session restored from `sessionStorage`
   * after a page refresh (see `SessionStore`) skips `/start` entirely and
   * would otherwise leave `AccountStore` on its placeholder data for the rest
   * of the tab's life. `UnlockPage` calls this on every mount to (re)ground it
   * in the real signed-in account.
   */
  fetchProfile(accessToken: string): Promise<ProviderProfile> {
    return this.registry.active().auth.fetchProfile(accessToken);
  }
}
