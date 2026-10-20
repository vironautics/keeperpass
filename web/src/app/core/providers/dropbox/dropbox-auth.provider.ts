import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { I18nService } from '../../i18n';
import { AuthProvider, ProviderProfile, TokenGrant } from '../provider';
import { DropboxOAuth } from './dropbox-oauth';

const CURRENT_ACCOUNT_URL = 'https://api.dropboxapi.com/2/users/get_current_account';

interface DropboxAccount {
  email: string;
  name?: { display_name?: string };
}

/** Dropbox sign-in (Authorization Code + PKCE), with a Dropbox app folder as the storage. */
@Injectable({ providedIn: 'root' })
export class DropboxAuthProvider implements AuthProvider {
  readonly id = 'dropbox' as const;
  readonly displayName = 'Dropbox';
  readonly storageName = 'Dropbox';

  private readonly oauth = inject(DropboxOAuth);
  private readonly i18n = inject(I18nService);

  /** Without an app key there is nothing to sign in with, so the button is not offered. */
  isConfigured(): boolean {
    return environment.dropboxAppKey.length > 0;
  }

  // Deliberately not `async`: `authorize()` must open its popup inside the
  // click that called this, before anything is awaited.
  signIn(): Promise<TokenGrant & ProviderProfile> {
    return this.oauth.authorize().then(async (grant) => ({
      ...(await this.fetchProfile(grant.accessToken)),
      ...grant,
    }));
  }

  async renew(current: TokenGrant): Promise<TokenGrant> {
    if (!current.refreshToken) {
      throw new Error(this.i18n.translate('errors.dropbox.authExpired'));
    }
    return this.oauth.refresh(current.refreshToken);
  }

  async fetchProfile(accessToken: string): Promise<ProviderProfile> {
    // No body and no Content-Type: Dropbox rejects this endpoint if either is sent.
    const response = await fetch(CURRENT_ACCOUNT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error(this.i18n.translate('errors.dropbox.profileFailed'));
    }
    const account = (await response.json()) as DropboxAccount;
    return { email: account.email, name: account.name?.display_name ?? '' };
  }
}
