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
   * A specific icon the user picked from the full Font Awesome catalogue
   * (`icon-catalog.ts`), as a raw Solid-face hex code point. Takes priority
   * over `icon` when set — see `itemIconGlyph`. A separate field from `icon`
   * rather than widening `IconName`, since the catalogue and this app's own
   * icon vocabulary aren't the same namespace (e.g. the app's own `lock` key
   * already means a different glyph than Font Awesome's `lock` icon).
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

/**
 * Why each finding matters, for the report page's per-section info popover.
 *
 * Each one says what the check actually measures and what to do about it —
 * a user deciding whether to spend ten minutes rotating a password deserves
 * the reason, not just the verdict.
 */
export const AUDIT_DESCRIPTIONS: Record<AuditType, string> = {
  [AuditType.WeakPassword]:
    'A password is weak when the space an attacker has to search is small: it is short, it draws on a narrow set of characters, or it is built from a word, name or keyboard run that sits in every cracking dictionary. Offline guessing runs at billions of attempts per second, so anything in that class falls quickly. Replace it with a long, randomly generated one.',
  [AuditType.ReusedPassword]:
    'One password used in several places means a single breach anywhere unlocks all of them — and you have no say in which of those services will be the one to leak. Give every item its own generated password so a leak stays contained to the account it came from.',
  [AuditType.CompromisedPassword]:
    'This password appears in a public record of breached credentials, which puts it on the lists attackers try first no matter how strong it looks. Change it everywhere it is used: a password only has to leak once to stay leaked.',
};

/**
 * The items list's empty state when a `?report=<type>` filter matches nothing.
 *
 * Phrased as the good news it is, and specific about which check came back
 * clean — "nothing found" alone reads like the scan failed.
 */
export const AUDIT_EMPTY_MESSAGES: Record<AuditType, string> = {
  [AuditType.WeakPassword]: 'Every password in your vault is strong enough.',
  [AuditType.ReusedPassword]: 'Every password in your vault is used exactly once.',
  [AuditType.CompromisedPassword]: 'None of your passwords turned up in a known breach.',
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
