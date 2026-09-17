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
   * A specific icon picked from the source app's full Font Awesome catalogue,
   * as a raw hex code point. Takes priority over `icon` when set — the
   * extension only ever displays this, it never lets the user pick one.
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

/** Verbatim from the source app's `descriptionForAudit()` — shown as the finding badge's title/aria-label in `ItemField`. */
export const AUDIT_DESCRIPTION_KEYS: Record<AuditType, TranslationKey> = {
  [AuditType.WeakPassword]: 'audit.weakPassword.description',
  [AuditType.ReusedPassword]: 'audit.reusedPassword.description',
  [AuditType.CompromisedPassword]: 'audit.compromisedPassword.description',
};

/**
 * Verbatim from the source app's `noItemsTextForAudit()` — the items list's
 * empty state when a `?report=<type>` filter matches nothing. Not currently
 * rendered anywhere in the popup (there is no report page here), but kept in
 * step with `AUDIT_LABEL_KEYS`/`AUDIT_DESCRIPTION_KEYS` for the same reason.
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
