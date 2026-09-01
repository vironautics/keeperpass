type Vault = {
  id: string;
  name: string;
  created: Date;
};

/** Real item/org/tag models are out of scope for the auth-flow port — these are placeholder shapes only. */
type VaultSnapshot = {
  vaults: Vault[];
  items: unknown[];
  organizations: unknown[];
  favouriteIds: string[];
  tagRegistry: unknown[];
  exportHistory: unknown[];
};

function createEmptyVaultSnapshot(): VaultSnapshot {
  return {
    vaults: [{ id: 'vault-personal', name: 'My Vault', created: new Date() }],
    items: [],
    organizations: [],
    favouriteIds: [],
    tagRegistry: [],
    exportHistory: [],
  };
}

export { createEmptyVaultSnapshot };
export type { Vault, VaultSnapshot };
