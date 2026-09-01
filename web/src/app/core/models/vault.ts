export interface Organization {
  id: string;
  name: string;
}

export interface Vault {
  id: string;
  name: string;
  /**
   * When the vault was created. Optional: a vault written before this field existed
   * simply has none, and the UI says so rather than inventing a date.
   */
  created?: Date;
  /** Absent for the user's personal vault. */
  organizationId?: string;
  /** Set when the vault failed to sync; shown as a warning in the menu. */
  error?: string;
}

/** Tag with its usage count, as shown in the menu and on items. */
export interface TagInfo {
  name: string;
  count: number;
  /** CSS colour applied to the tag chip and menu entry. */
  color?: string;
  /**
   * When the tag was first registered. Absent for a tag that was already in a vault
   * saved before the registry stored dates — see `VaultSnapshot.tagRegistry`.
   */
  created?: Date;
}

/**
 * How a vault is named in item headers: `Organization / Vault` for shared
 * vaults, just the name for a personal one.
 */
export function vaultLabel(vault: Vault, organization?: Organization): string {
  return organization ? `${organization.name} / ${vault.name}` : vault.name;
}
