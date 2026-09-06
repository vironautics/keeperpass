import { IconName } from '../../ui/icon/icon-glyphs';
import { Field } from './field';

/** Problems the security audit can flag on an item. */
export enum AuditType {
  WeakPassword = 'weak_password',
  ReusedPassword = 'reused_password',
  CompromisedPassword = 'compromised_password',
}

export interface AuditResult {
  type: AuditType;
  /** Index into `VaultItem.fields`, when the finding is about one field. */
  fieldIndex?: number;
}

/** A past version of an item, kept so a change can be reviewed or undone. */
export interface HistoryEntry {
  updated: Date;
  name: string;
  fields: Field[];
  tags: string[];
}

export interface VaultItem {
  id: string;
  vaultId: string;
  name: string;
  fields: Field[];
  tags: string[];
  /**
   * When the item was first added. Optional because vaults written before it
   * existed have no value — `itemCreated()` falls back to `updated` for those,
   * so ordering stays stable rather than bunching old items at the epoch.
   */
  created?: Date;
  updated: Date;
  /** Days after an update before the item counts as expired. */
  expiresAfter?: number;
  expiresAt?: Date;
  history: HistoryEntry[];
  /** Overrides the icon derived from the item's field types. */
  icon?: IconName;
  /**
   * A specific icon picked from the source app's full Font Awesome catalogue,
   * as a raw hex code point. Takes priority over `icon` when set — the
   * extension only ever displays this, it never lets the user pick one.
   */
  iconGlyph?: string;
}

export const AUDIT_LABELS: Record<AuditType, string> = {
  [AuditType.WeakPassword]: 'Weak Passwords',
  [AuditType.ReusedPassword]: 'Reused Passwords',
  [AuditType.CompromisedPassword]: 'Compromised Passwords',
};

export const AUDIT_ICONS: Record<AuditType, IconName> = {
  [AuditType.WeakPassword]: 'weak',
  [AuditType.ReusedPassword]: 'reused',
  [AuditType.CompromisedPassword]: 'compromised',
};

/** Verbatim from the source app's `descriptionForAudit()` — shown in the report page's per-section info popover. */
export const AUDIT_DESCRIPTIONS: Record<AuditType, string> = {
  [AuditType.WeakPassword]:
    "Passwords are considered weak if they're too short, don't have a lot of variation or contain commonly used words or phrases. These passwords generally don't offer enough protection against automated guessing attempts and should be replaced with strong, randomly generated passwords.",
  [AuditType.ReusedPassword]:
    'Using the same password in multiple places is strongly discouraged as a data leak in one of those places will automatically compromise all other accounts/logins using the same password. We recommend generating strong, random and unique passwords for every single vault item.',
  [AuditType.CompromisedPassword]:
    'Compromised passwords are those that have been identified as having been leaked in the past by comparing them against a database of known data breaches. These passwords can no longer be considered secure and should be changed immediately.',
};

/**
 * Verbatim from the source app's `noItemsTextForAudit()` — the items list's
 * empty state when a `?report=<type>` filter matches nothing.
 */
export const AUDIT_EMPTY_MESSAGES: Record<AuditType, string> = {
  [AuditType.WeakPassword]: "You don't have any items with weak passwords!",
  [AuditType.ReusedPassword]: "You don't have any items with reused passwords!",
  [AuditType.CompromisedPassword]: "You don't have any items with compromised passwords!",
};

/**
 * An item's creation time, or the closest thing available.
 *
 * Items saved before `created` existed only carry `updated`; for those it is
 * the best estimate there is, and it is stable, which is what sorting needs.
 */
export function itemCreated(item: VaultItem): number {
  return (item.created ?? item.updated).getTime();
}
