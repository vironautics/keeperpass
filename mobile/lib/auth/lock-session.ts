import { useSessionStore } from '@/lib/auth/session-store';
import { createEmptyVaultSnapshot } from '@/lib/vault/vault-snapshot';
import { useVaultStore } from '@/lib/vault/vault-store';

/** Keeps the Google token, wipes the decrypted vault and master secret from memory. */
function lockSession(): void {
  useSessionStore.getState().lock();
  useVaultStore.getState().hydrate(createEmptyVaultSnapshot());
}

export { lockSession };
