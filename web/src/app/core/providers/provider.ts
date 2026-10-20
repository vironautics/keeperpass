/**
 * Every sign-in + storage backend the app can run on. Adding one means adding
 * its id here, an implementation of `CloudProvider`, and one line in
 * `cloud-providers.ts` — nothing else switches on the id.
 */
export const PROVIDER_IDS = ['google', 'dropbox'] as const;

export type ProviderId = (typeof PROVIDER_IDS)[number];

/** What an old session (stored before providers existed) was signed in with. */
export const DEFAULT_PROVIDER_ID: ProviderId = 'google';

export function isProviderId(value: unknown): value is ProviderId {
  return typeof value === 'string' && (PROVIDER_IDS as readonly string[]).includes(value);
}

/** An access token and the moment it stops being usable. */
export interface TokenGrant {
  accessToken: string;
  /** Epoch ms, already shortened by a safety margin. */
  expiresAt: number;
  /** Only providers that can renew without UI hand one back. */
  refreshToken?: string;
}

export interface ProviderProfile {
  email: string;
  name: string;
}

/** Called with how much of an upload has been sent, from `0` to `1`. */
export type UploadProgressHandler = (fraction: number) => void;

/** The sign-in half of a provider. */
export interface AuthProvider {
  readonly id: ProviderId;
  /** Shown in the UI, e.g. "Google". */
  readonly displayName: string;
  /** Where the vault lives, as users know it — "Google Drive", "Dropbox". */
  readonly storageName: string;

  /** Whether this build has what the provider needs (e.g. a client id). Unconfigured providers are not offered. */
  isConfigured(): boolean;

  /** Interactive; must be called from a user gesture. */
  signIn(): Promise<TokenGrant & ProviderProfile>;

  /**
   * A fresh grant for the current session, without showing UI. Rejects when
   * that is not possible — the caller then falls back to disconnecting.
   */
  renew(current: TokenGrant): Promise<TokenGrant>;

  fetchProfile(accessToken: string): Promise<ProviderProfile>;
}

/**
 * Where the one encrypted vault file lives. The vault is an opaque string to
 * the storage — encryption happens before it gets here.
 *
 * Every method rejects with `StorageAuthExpiredError` when the token is dead.
 */
export interface VaultStorage {
  /** The encrypted vault's contents, or `null` if this account has none yet. */
  loadVault(accessToken: string): Promise<string | null>;

  /** Whether a vault exists, without downloading it. */
  vaultExists(accessToken: string): Promise<boolean>;

  /** Creates the vault on first save, overwrites it afterwards. */
  saveVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void>;

  /** Keeps the current vault as a backup and creates a new one with `content`. */
  resetVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void>;

  /** Moves the vault out of the app's way without deleting it. `false` if there was none. */
  detachVault(accessToken: string): Promise<boolean>;
}

export interface CloudProvider {
  readonly auth: AuthProvider;
  readonly storage: VaultStorage;
}
