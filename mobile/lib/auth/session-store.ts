import { vaultExists } from '@/lib/drive/google-drive';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

// SecureStore keys are restricted to alphanumeric, ".", "-", and "_" — no colons.
const ACCESS_TOKEN_KEY = 'keeperpass.accessToken';
const ACCESS_TOKEN_EXPIRY_KEY = 'keeperpass.accessTokenExpiry';

type SessionPhase = 'bootstrapping' | 'signed-out' | 'awaiting-secret' | 'ready';

type SessionStoreState = {
  phase: SessionPhase;
  accessToken: string | null;
  expiresAt: number | null;
  /** The vault master password. Never persisted — always empty again after a cold start, same guarantee as the web app. */
  secret: string | null;
  /** `null` = not checked yet this session. Cached so Drive is only asked once. */
  hasVault: boolean | null;
  vaultCheckPromise: Promise<void> | null;

  bootstrap: () => Promise<void>;
  signIn: (accessToken: string, expiresAt: number) => Promise<void>;
  renewToken: (accessToken: string, expiresAt: number) => Promise<void>;
  unlock: (secret: string) => void;
  updateSecret: (secret: string) => void;
  lock: () => void;
  signOut: () => Promise<void>;
  setHasVault: (exists: boolean) => void;
  tokenExpired: () => boolean;
  ensureVaultChecked: () => void;
};

const useSessionStore = create<SessionStoreState>((set, get) => ({
  phase: 'bootstrapping',
  accessToken: null,
  expiresAt: null,
  secret: null,
  hasVault: null,
  vaultCheckPromise: null,

  async bootstrap() {
    const [accessToken, expiresAtRaw] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(ACCESS_TOKEN_EXPIRY_KEY),
    ]);
    const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : null;

    if (!accessToken || !expiresAt || Date.now() >= expiresAt) {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRY_KEY),
      ]);
      set({ phase: 'signed-out', accessToken: null, expiresAt: null });
      return;
    }

    set({ accessToken, expiresAt, phase: 'awaiting-secret' });
    get().ensureVaultChecked();
  },

  async signIn(accessToken, expiresAt) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(ACCESS_TOKEN_EXPIRY_KEY, String(expiresAt)),
    ]);
    set({
      accessToken,
      expiresAt,
      phase: 'awaiting-secret',
      hasVault: null,
      vaultCheckPromise: null,
    });
    get().ensureVaultChecked();
  },

  async renewToken(accessToken, expiresAt) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(ACCESS_TOKEN_EXPIRY_KEY, String(expiresAt)),
    ]);
    set({ accessToken, expiresAt });
  },

  unlock(secret) {
    set({ secret, phase: 'ready' });
  },

  updateSecret(secret) {
    set({ secret });
  },

  lock() {
    set({ secret: null, phase: 'awaiting-secret' });
  },

  async signOut() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRY_KEY),
    ]);
    set({
      phase: 'signed-out',
      accessToken: null,
      expiresAt: null,
      secret: null,
      hasVault: null,
      vaultCheckPromise: null,
    });
  },

  setHasVault(exists) {
    set({ hasVault: exists });
  },

  tokenExpired() {
    const { accessToken, expiresAt } = get();
    return !accessToken || !expiresAt || Date.now() >= expiresAt;
  },

  ensureVaultChecked() {
    const state = get();
    if (state.hasVault !== null || state.vaultCheckPromise || !state.accessToken) return;

    const promise = vaultExists(state.accessToken)
      .then((exists) => {
        set({ hasVault: exists, vaultCheckPromise: null });
      })
      .catch(() => {
        set({ vaultCheckPromise: null });
        void get().signOut();
      });

    set({ vaultCheckPromise: promise });
  },
}));

export { useSessionStore };
export type { SessionPhase };
