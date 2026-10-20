import { Injectable, signal } from '@angular/core';
import { DEFAULT_PROVIDER_ID, isProviderId, ProviderId } from '../providers/provider';

/**
 * Steps of the sign-in flow, in order: provider sign-in, then the secret that
 * fetches (or creates) and decrypts the vault. Route guards key off this to
 * send visitors to whichever step they're actually on.
 */
export type SessionPhase = 'signed-out' | 'awaiting-secret' | 'ready';

/** `sessionStorage` key for the persisted access token — see the class doc comment. */
export const ACCESS_TOKEN_STORAGE_KEY = 'keeperpass:accessToken';

/** When the stored token stops being usable, so a refresh doesn't have to guess. */
export const TOKEN_EXPIRY_STORAGE_KEY = 'keeperpass:accessTokenExpiry';

/** Which provider the stored token belongs to. Absent on sessions stored before providers existed — those were all Google. */
export const PROVIDER_STORAGE_KEY = 'keeperpass:provider';

/** Only providers that can renew without UI have one; kept for the tab's life like the access token. */
export const REFRESH_TOKEN_STORAGE_KEY = 'keeperpass:refreshToken';

interface RestoredSession {
  accessToken: string;
  providerId: ProviderId;
}

/**
 * Reads whatever a previous page load left in `sessionStorage`.
 *
 * A token with no provider key is a session stored before providers existed,
 * and belongs to Google — treating it as signed out would log every user out
 * on the deploy that introduced providers. A token whose provider this build
 * does not know (a downgrade, a hand-edited value) cannot be used, because
 * there is nothing to talk to; it is dropped, which lands the visitor on
 * `/start` instead of failing later.
 */
function restoreSession(): RestoredSession {
  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? '';
  const stored = sessionStorage.getItem(PROVIDER_STORAGE_KEY);

  if (!accessToken) {
    return { accessToken: '', providerId: DEFAULT_PROVIDER_ID };
  }

  if (stored === null) {
    return { accessToken, providerId: DEFAULT_PROVIDER_ID };
  }

  if (isProviderId(stored)) {
    return { accessToken, providerId: stored };
  }

  clearPersistedSession();
  return { accessToken: '', providerId: DEFAULT_PROVIDER_ID };
}

function clearPersistedSession(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_STORAGE_KEY);
  sessionStorage.removeItem(PROVIDER_STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

function persistRefreshToken(refreshToken: string): void {
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  } else {
    sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

/**
 * The access token survives a page refresh via `sessionStorage` — cleared
 * when the tab closes, never written to `localStorage`, so it doesn't outlive
 * the browser session it was granted in. On a refresh with a token present,
 * phase restores to `awaiting-secret`, not `ready`: the vault secret is
 * deliberately never persisted anywhere (it's the vault's decryption key), so
 * a refresh always re-prompts for it, same as it always has — only the
 * provider sign-in step is skipped.
 *
 * Which provider the token belongs to is stored beside it (`providerId`), so a
 * restored session talks to the right storage.
 *
 * INTEGRATION SEAM
 * ----------------
 * The restored token isn't checked for expiry before use. Providers whose
 * tokens can be renewed silently (`AuthProvider.renew`) get a fresh one from
 * `AuthService.ensureFreshToken`; when renewal is impossible, the next storage
 * call fails with `StorageAuthExpiredError`, which every caller treats as
 * fatal and responds to by disconnecting the session outright
 * (`disconnectSession()`) — reconnecting from `/start` for a fresh token is
 * then the only recovery. A real deployment would exchange a refresh token
 * server-side instead of storing tokens client-side at all.
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly restored = restoreSession();

  private readonly _providerId = signal<ProviderId>(this.restored.providerId);
  private readonly _refreshToken = signal(
    this.restored.accessToken ? (sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? '') : '',
  );
  private readonly _accessToken = signal(this.restored.accessToken);
  private readonly _phase = signal<SessionPhase>(
    this._accessToken() ? 'awaiting-secret' : 'signed-out',
  );
  private readonly _secret = signal('');
  private readonly _expiresAt = signal(
    Number(sessionStorage.getItem(TOKEN_EXPIRY_STORAGE_KEY) ?? 0),
  );
  private readonly _hasVault = signal<boolean | null>(null);

  readonly phase = this._phase.asReadonly();

  /** The provider this session signed in with — Google before anyone has. */
  readonly providerId = this._providerId.asReadonly();

  /** Present only for providers that can renew silently. */
  readonly refreshToken = this._refreshToken.asReadonly();

  /**
   * Whether this account already has a vault file in its storage, or `null`
   * before anything has looked. Decides `/unlock` versus `/setup` — see
   * `auth.guard.ts`, which fills it in on first use. Not persisted: a page
   * refresh re-checks, which costs a metadata request or two and keeps the
   * answer honest if the file changed in another tab.
   */
  readonly hasVault = this._hasVault.asReadonly();

  /** The access token from sign-in, scoped for the vault's storage — kept for the rest of the session so edits can be saved back, not just the initial `/unlock` fetch. */
  readonly accessToken = this._accessToken.asReadonly();

  /** The passphrase from `/unlock`, kept in memory so vault edits can be re-encrypted and saved without asking for it again. */
  readonly secret = this._secret.asReadonly();

  /** Records whether a vault file exists, so the guards ask the storage only once. */
  setHasVault(exists: boolean): void {
    this._hasVault.set(exists);
  }

  /**
   * Whether the token is past (or within a minute of) its expiry.
   * Also true when nothing has been signed in yet.
   */
  tokenExpired(): boolean {
    return !this._accessToken() || Date.now() >= this._expiresAt();
  }

  /** Provider sign-in succeeded; next step is entering the secret. */
  signIn(
    accessToken: string,
    expiresAt = 0,
    options: { providerId?: ProviderId; refreshToken?: string } = {},
  ): void {
    const providerId = options.providerId ?? DEFAULT_PROVIDER_ID;
    const refreshToken = options.refreshToken ?? '';

    sessionStorage.setItem(PROVIDER_STORAGE_KEY, providerId);
    persistRefreshToken(refreshToken);
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    sessionStorage.setItem(TOKEN_EXPIRY_STORAGE_KEY, String(expiresAt));

    this._providerId.set(providerId);
    this._refreshToken.set(refreshToken);
    this._accessToken.set(accessToken);
    this._expiresAt.set(expiresAt);
    this._phase.set('awaiting-secret');
  }

  /**
   * A renewed token for the same session — phase and secret are untouched.
   * A renewal that does not hand back a new refresh token keeps the old one.
   */
  renewToken(accessToken: string, expiresAt: number, refreshToken?: string): void {
    if (refreshToken) {
      persistRefreshToken(refreshToken);
      this._refreshToken.set(refreshToken);
    }
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    sessionStorage.setItem(TOKEN_EXPIRY_STORAGE_KEY, String(expiresAt));
    this._accessToken.set(accessToken);
    this._expiresAt.set(expiresAt);
  }

  /** The vault has been fetched (or created) and decrypted; the app is fully usable. */
  unlock(secret: string): void {
    this._secret.set(secret);
    this._phase.set('ready');
  }

  /**
   * The vault has been re-encrypted under a new secret (changing the master
   * password) — same session, same vault, just a different key.
   */
  updateSecret(secret: string): void {
    this._secret.set(secret);
  }

  /**
   * Locks the vault without ending the provider session: forgets the secret
   * (so nothing can be decrypted or saved) but keeps the access token, so
   * unlocking again only asks for the secret — no second consent.
   * This is the state a restored-from-`sessionStorage` session starts in.
   */
  lock(): void {
    this._secret.set('');
    this._phase.set('awaiting-secret');
  }

  signOut(): void {
    clearPersistedSession();
    this._providerId.set(DEFAULT_PROVIDER_ID);
    this._refreshToken.set('');
    this._accessToken.set('');
    this._expiresAt.set(0);
    this._secret.set('');
    // The next sign-in may be a different account or provider, so what was
    // true about this one's storage says nothing about the next one's.
    this._hasVault.set(null);
    this._phase.set('signed-out');
  }
}
