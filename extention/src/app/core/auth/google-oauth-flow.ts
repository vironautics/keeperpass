/**
 * Google OAuth 2.0 — implicit grant, driven by `identity.launchWebAuthFlow()`.
 *
 * Framework-agnostic on purpose: these are plain functions, no Angular DI, so
 * the exact same code can be imported both by the Angular bundle
 * (`google-oauth.service.ts`, for type-checking/testing convenience) and by
 * `src/scripts/background.ts` (a separate esbuild entry point — the flow
 * itself has to run there, not in the popup; see that file's own comment for
 * why). Importing this module into `background.ts` is safe: the `chrome`
 * global comes from the ambient `src/types/chrome.d.ts`, which is global
 * regardless of whether `background.ts` itself has imports.
 *
 * Replaces `chrome.identity.getAuthToken()`, which is a Chrome-only,
 * browser-profile-bound mechanism (doesn't exist on Firefox, is unreliable on
 * Edge). `launchWebAuthFlow`/`getRedirectURL` are real WebExtensions-spec
 * APIs and behave the same on Chrome, Edge, and Firefox.
 *
 * Implicit grant (`response_type=token`), not authorization code + PKCE: the
 * OAuth client registered for this is a **Web application** type (the only
 * type Google Cloud Console will let `launchWebAuthFlow`'s redirect URI be
 * registered against), and Google's token endpoint wants that client type's
 * secret for a code exchange regardless of PKCE — a secret an extension can
 * never safely hold, since its whole bundle is public. Implicit grant never
 * calls the token endpoint at all: Google hands the access token straight
 * back in the redirect URL's fragment, so there's no exchange step and no
 * secret to be asked for. Same shape the web app's own sign-in effectively
 * uses (Google Identity Services does this exchange internally, out of
 * sight, which is why it never needed a secret either). The one real
 * trade-off: implicit grant never issues a `refresh_token` — only the
 * authorization-code grant does — so there is no silent renewal here; an
 * expired token means asking the user to sign in again, not a background
 * `fetch()`.
 */

import { environment } from '../../../environments/environment';

declare const chrome: any;
declare const browser: any;

const AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';

/** Whichever browser's `identity` namespace actually exists. */
function identityApi(): any {
  const api = typeof browser !== 'undefined' ? browser.identity : undefined;
  return api ?? chrome.identity;
}

/**
 * `https://<extension-id>.chromiumapp.org/` on Chrome/Edge, a different
 * `https://<id>.extensions.allizom.org/`-style domain on Firefox — the
 * Google Cloud Console OAuth client's "Authorized redirect URIs" needs
 * whichever one this actually returns at runtime for each browser/channel.
 */
export function getRedirectUrl(): string {
  return identityApi().getRedirectURL();
}

export function buildAuthorizationUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: environment.googleClientId,
    response_type: 'token',
    redirect_uri: redirectUri,
    scope: SCOPE,
  });

  return `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
}

export interface TokenResult {
  accessToken: string;
  /** Epoch ms. */
  expiresAt: number;
}

/**
 * Opens Google's consent screen and resolves with the access token once the
 * user finishes it. Rejects on cancel — Chrome and Firefox both surface that
 * as `chrome.runtime.lastError`/a rejected promise rather than a
 * resolved-but-empty result.
 */
export async function launchInteractiveAuth(authUrl: string): Promise<TokenResult> {
  const api = identityApi();

  // Firefox's `browser.identity.launchWebAuthFlow` is promise-only — it has
  // no callback form at all. Chrome/Edge's `chrome.identity` one is
  // callback-only for this call. Branch on which namespace actually exists
  // (`identityApi()` above) rather than guessing from a return value.
  const responseUrl: string | undefined =
    typeof browser !== 'undefined'
      ? await api.launchWebAuthFlow({ url: authUrl, interactive: true })
      : await new Promise((resolve, reject) => {
          api.launchWebAuthFlow(
            { url: authUrl, interactive: true },
            (redirectedTo?: string) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message ?? 'popup_closed'));
                return;
              }
              resolve(redirectedTo);
            },
          );
        });

  if (!responseUrl) {
    throw new Error('popup_closed');
  }

  const redirected = new URL(responseUrl);
  // The implicit grant returns the token in the URL *fragment*
  // (`#access_token=...&expires_in=...`), not the query string — that's the
  // one thing that actually differs from the code-grant redirect shape.
  const fragment = new URLSearchParams(redirected.hash.replace(/^#/, ''));

  const accessToken = fragment.get('access_token');
  if (!accessToken) {
    // `error` is Google's own OAuth error code when present — left as-is,
    // same as every other place in this app that passes Google's raw text
    // through untranslated. The 'No access token returned.' fallback is this
    // app's own copy, but this module can't reach `I18nService` to translate
    // it (see the file's own doc comment: framework-agnostic on purpose, so
    // `background.ts` can import it too, and that context has no Angular
    // injector). It can still reach a user via `GoogleOAuthService.signIn()`'s
    // `response.error` path, so this is a deliberate, narrow i18n gap rather
    // than an oversight.
    const error = fragment.get('error') ?? redirected.searchParams.get('error');
    throw new Error(error ?? 'No access token returned.');
  }

  const expiresIn = Number(fragment.get('expires_in') ?? '3600');
  return { accessToken, expiresAt: Date.now() + expiresIn * 1000 };
}
