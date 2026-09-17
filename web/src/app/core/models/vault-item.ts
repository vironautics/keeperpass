import { TranslationKey } from '../i18n/translations';
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

export const AUDIT_LABEL_KEYS: Record<AuditType, TranslationKey> = {
  [AuditType.WeakPassword]: 'audit.weakPassword.label',
  [AuditType.ReusedPassword]: 'audit.reusedPassword.label',
  [AuditType.CompromisedPassword]: 'audit.compromisedPassword.label',
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
export const AUDIT_DESCRIPTION_KEYS: Record<AuditType, TranslationKey> = {
  [AuditType.WeakPassword]: 'audit.weakPassword.description',
  [AuditType.ReusedPassword]: 'audit.reusedPassword.description',
  [AuditType.CompromisedPassword]: 'audit.compromisedPassword.description',
};

/**
 * The items list's empty state when a `?report=<type>` filter matches nothing.
 *
 * Phrased as the good news it is, and specific about which check came back
 * clean — "nothing found" alone reads like the scan failed.
 */
export const AUDIT_EMPTY_MESSAGE_KEYS: Record<AuditType, TranslationKey> = {
  [AuditType.WeakPassword]: 'audit.weakPassword.empty',
  [AuditType.ReusedPassword]: 'audit.reusedPassword.empty',
  [AuditType.CompromisedPassword]: 'audit.compromisedPassword.empty',
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
