import { createEmptyVaultSnapshot, type VaultSnapshot } from '@/lib/vault/vault-snapshot';
import { create } from 'zustand';

type VaultStoreState = {
  snapshot: VaultSnapshot;
  hydrate: (snapshot: VaultSnapshot) => void;
};

const useVaultStore = create<VaultStoreState>((set) => ({
  snapshot: createEmptyVaultSnapshot(),
  hydrate: (snapshot) => set({ snapshot }),
}));

export { useVaultStore };
