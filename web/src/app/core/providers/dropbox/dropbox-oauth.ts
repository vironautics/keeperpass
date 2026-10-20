import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { I18nService } from '../../i18n';
import { TokenGrant } from '../provider';
import { codeChallengeS256, randomUrlSafe } from './pkce';

const AUTHORIZE_URL = 'https://www.dropbox.com/oauth2/authorize';
const TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

/**
 * What the app is allowed to do. `account_info.read` is the profile; the file
 * scopes are the vault. They must be ticked on the app's Permissions tab in the
 * Dropbox App Console, or Dropbox rejects the request.
 */
const SCOPE = [
  'account_info.read',
  'files.metadata.read',
  'files.metadata.write',
  'files.content.read',
  'files.content.write',
].join(' ');

/** Treat a token as expired slightly early, so it can't die mid-request. */
const EXPIRY_SKEW_MS = 60_000;

/** Dropbox's documented default (4 hours) when `expires_in` is missing. */
const DEFAULT_LIFETIME_MS = 14_400_000;

/** How long the user gets to finish the consent screen. */
const FLOW_TIMEOUT_MS = 10 * 60_000;

/** How often the popup is checked for having been closed. */
const POPUP_POLL_MS = 500;

/** Where Dropbox sends the user back to. Must be registered, exactly, in the App Console. */
export const DROPBOX_CALLBACK_PATH = '/oauth/dropbox';

/**
 * Same-origin channel the callback page reports through. Not `window.opener` /
 * `postMessage`: if Dropbox ever enforces a Cross-Origin-Opener-Policy on its
 * consent page, the popup loses its opener the moment it navigates there,
 * while a `BroadcastChannel` keeps working regardless.
 */
export const DROPBOX_OAUTH_CHANNEL = 'keeperpass:dropbox-oauth';

export interface DropboxOAuthMessage {
  state: string;
  code?: string;
  error?: string;
  errorDescription?: string;
}

interface TokenResponse {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
}

export function dropboxRedirectUri(): string {
  return `${window.location.origin}${DROPBOX_CALLBACK_PATH}`;
}

/**
 * The OAuth plumbing for Dropbox: the consent popup and the two token
 * requests. Knows nothing about vaults or sessions.
 */
@Injectable({ providedIn: 'root' })
export class DropboxOAuth {
  private readonly i18n = inject(I18nService);

  /**
   * Runs the consent popup and resolves with the granted tokens.
   *
   * Must be called synchronously from a click handler — the popup is opened
   * before anything is awaited, because browsers only allow `window.open`
   * during the user gesture. The (async) PKCE challenge is computed after, and
   * the popup is pointed at Dropbox once it is ready.
   */
  authorize(): Promise<TokenGrant> {
    const popup = window.open('', 'keeperpass-dropbox', 'popup,width=520,height=720');
    if (!popup) {
      return Promise.reject(new Error(this.i18n.translate('errors.dropbox.popupBlocked')));
    }
    return this.runFlow(popup);
  }

  /** A fresh access token from a refresh token. Silent: no popup, no gesture needed. */
  async refresh(refreshToken: string): Promise<TokenGrant> {
    const response = await this.requestTokens({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: environment.dropboxAppKey,
    });
    return this.toGrant(response, refreshToken);
  }

  private async runFlow(popup: Window): Promise<TokenGrant> {
    const verifier = randomUrlSafe(64);
    const state = randomUrlSafe(16);

    let challenge: string;
    try {
      challenge = await codeChallengeS256(verifier);
    } catch (error) {
      popup.close();
      throw error;
    }

    const redirectUri = dropboxRedirectUri();
    const params = new URLSearchParams({
      client_id: environment.dropboxAppKey,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      token_access_type: 'offline',
      scope: SCOPE,
      state,
    });

    // Listening starts before the popup is pointed anywhere, so the callback
    // page can never report into the void.
    const code = this.waitForCode(popup, state);
    popup.location.href = `${AUTHORIZE_URL}?${params.toString()}`;

    const response = await this.requestTokens({
      grant_type: 'authorization_code',
      code: await code,
      client_id: environment.dropboxAppKey,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    });
    return this.toGrant(response);
  }

  private waitForCode(popup: Window, state: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const channel = new BroadcastChannel(DROPBOX_OAUTH_CHANNEL);
      let sawOpen = false;

      const finish = (settle: () => void) => {
        channel.close();
        clearInterval(poll);
        clearTimeout(timeout);
        if (!popup.closed) {
          popup.close();
        }
        settle();
      };

      channel.onmessage = (event: MessageEvent<DropboxOAuthMessage>) => {
        const message = event.data;
        // Another tab's flow, or something that never started with us.
        if (message?.state !== state) {
          return;
        }
        if (message.code) {
          finish(() => resolve(message.code as string));
          return;
        }
        finish(() =>
          reject(new Error(message.errorDescription || message.error || this.unknownError())),
        );
      };

      // `closed` is only trusted once it has been seen to change: under an
      // enforced Cross-Origin-Opener-Policy it reads `true` from the start, and
      // that must not be mistaken for the user giving up.
      const poll = setInterval(() => {
        if (!popup.closed) {
          sawOpen = true;
        } else if (sawOpen) {
          finish(() => reject(new Error(this.i18n.translate('errors.dropbox.popupClosed'))));
        }
      }, POPUP_POLL_MS);

      const timeout = setTimeout(
        () => finish(() => reject(new Error(this.i18n.translate('errors.dropbox.popupClosed')))),
        FLOW_TIMEOUT_MS,
      );
    });
  }

  private async requestTokens(body: Record<string, string>): Promise<TokenResponse> {
    const response = await fetch(TOKEN_URL, { method: 'POST', body: new URLSearchParams(body) });
    if (!response.ok) {
      const detail = (await response.json().catch(() => null)) as {
        error_description?: string;
      } | null;
      throw new Error(detail?.error_description || this.unknownError());
    }
    return (await response.json()) as TokenResponse;
  }

  private toGrant(response: TokenResponse, previousRefreshToken?: string): TokenGrant {
    const lifetime = response.expires_in ? response.expires_in * 1000 : DEFAULT_LIFETIME_MS;
    return {
      accessToken: response.access_token,
      expiresAt: Date.now() + lifetime - EXPIRY_SKEW_MS,
      // A refresh response carries no new refresh token — the old one stays valid.
      refreshToken: response.refresh_token ?? previousRefreshToken,
    };
  }

  private unknownError(): string {
    return this.i18n.translate('errors.dropbox.unknown');
  }
}
