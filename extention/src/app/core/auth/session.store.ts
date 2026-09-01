import { Injectable, signal } from '@angular/core';
import { SESSION_KEYS, sessionGet, sessionRemove, sessionSet } from '../storage/extension-session-storage';

/**
 * Steps of the sign-in flow, in order: Google sign-in, then the secret that
 * fetches (or creates) and decrypts the vault. Route guards key off this to
 * send visitors to whichever step they're actually on.
 */
export type SessionPhase = 'signed-out' | 'awaiting-secret' | 'ready';

/** `sessionStorage` key for the persisted Google access token — see the class doc comment. */
export const ACCESS_TOKEN_STORAGE_KEY = SESSION_KEYS.accessToken;

/**
 * The Google access token survives a page refresh via `sessionStorage` —
 * cleared when the tab closes, never written to `localStorage`, so it
 * doesn't outlive the browser session it was granted in. On a refresh with a
 * token present, phase restores to `awaiting-secret`, not `ready`: the vault
 * secret is deliberately never persisted anywhere (it's the vault's
 * decryption key), so a refresh always re-prompts for it, same as it always
 * has — only the Google sign-in step is skipped.
 *
 * The restored token isn't checked for expiry before use — Google access
 * tokens are short-lived (about an hour). There's no refresh-token flow
 * (the sign-in flow is an implicit grant, which is what lets it work without
 * a client secret an extension could never hold safely — see
 * `core/auth/google-oauth-flow.ts` — and implicit grants never issue a
 * refresh token), so a stale token can't be silently renewed: the next
 * Drive call fails with 401 (`GoogleAuthExpiredError`), which every caller
 * treats as fatal and responds to by disconnecting the session outright
 * (`disconnectSession()`) rather than showing it as a normal save/load
 * error — reconnecting from `/start` for a fresh token is the only recovery.
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _accessToken = signal('');
  private readonly _phase = signal<SessionPhase>('signed-out');

  /**
   * Rehydrates from `chrome.storage.session`, awaited once at bootstrap
   * (`app.config.ts`). The popup is destroyed every time it closes, so
   * `sessionStorage` — which the web app uses here — would start empty on
   * each open and force a fresh Google sign-in. See
   * `core/storage/extension-session-storage.ts`.
   */
  async restore(): Promise<void> {
    const [accessToken, secret] = await Promise.all([
      sessionGet<string>(SESSION_KEYS.accessToken),
      sessionGet<string>(SESSION_KEYS.secret),
    ]);

    if (!accessToken) {
      return;
    }

    this._accessToken.set(accessToken);

    if (secret) {
      this._secret.set(secret);
      this._phase.set('ready');
    } else {
      this._phase.set('awaiting-secret');
    }
  }
  private readonly _secret = signal('');
  private readonly _hasVault = signal<boolean | null>(null);

  readonly phase = this._phase.asReadonly();

  /**
   * Whether this Google account already has a vault file in Drive, or `null`
   * before anything has looked. Decides `/unlock` versus `/setup` — see
   * `auth.guard.ts`, which fills it in on first use. Not persisted: a page
   * refresh re-checks, which costs two metadata requests and keeps the answer
   * honest if the file changed in another tab.
   */
  readonly hasVault = this._hasVault.asReadonly();

  /** The Google access token from sign-in, scoped for `drive.file` — kept for the rest of the session so edits can be saved back, not just the initial `/unlock` fetch. */
  readonly accessToken = this._accessToken.asReadonly();

  /** The passphrase from `/unlock`, kept in memory so vault edits can be re-encrypted and saved without asking for it again. */
  readonly secret = this._secret.asReadonly();

  /** Records whether a vault file exists, so the guards ask Drive only once. */
  setHasVault(exists: boolean): void {
    this._hasVault.set(exists);
  }

  /** Google sign-in succeeded; next step is entering the secret. */
  signIn(accessToken: string): void {
    void sessionSet(SESSION_KEYS.accessToken, accessToken);
    this._accessToken.set(accessToken);
    this._phase.set('awaiting-secret');
  }

  /**
   * A renewed Google token for the same session. Deliberately not `signIn()`,
   * which resets the phase to `awaiting-secret` — that would relock the vault
   * every time a token aged out.
   */
  renewToken(accessToken: string): void {
    void sessionSet(SESSION_KEYS.accessToken, accessToken);
    this._accessToken.set(accessToken);
  }

  /** The vault has been fetched (or created) and decrypted; the app is fully usable. */
  unlock(secret: string): void {
    void sessionSet(SESSION_KEYS.secret, secret);
    this._secret.set(secret);
    this._phase.set('ready');
  }

  /**
   * The vault has been re-encrypted under a new secret (changing the master
   * password) — same session, same vault, just a different key.
   */
  updateSecret(secret: string): void {
    void sessionSet(SESSION_KEYS.secret, secret);
    this._secret.set(secret);
  }

  /**
   * Locks the vault without ending the Google session: forgets the secret
   * (so nothing can be decrypted or saved) but keeps the access token, so
   * unlocking again only asks for the secret — no second Google consent.
   * This is the state a restored-from-`sessionStorage` session starts in.
   */
  lock(): void {
    void sessionRemove(SESSION_KEYS.secret, SESSION_KEYS.vaultData);
    this._secret.set('');
    this._phase.set('awaiting-secret');
  }

  signOut(): void {
    void sessionRemove(SESSION_KEYS.accessToken, SESSION_KEYS.secret, SESSION_KEYS.vaultData);
    this._accessToken.set('');
    this._secret.set('');
    // The next sign-in may be a different Google account, so what was true
    // about this one's Drive says nothing about the next one's.
    this._hasVault.set(null);
    this._phase.set('signed-out');
  }
}
