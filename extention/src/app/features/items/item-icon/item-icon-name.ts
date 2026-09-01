import { FieldType, VaultItem } from '../../../core/models';
import { IconName } from '../../../ui/icon/icon-glyphs';

/**
 * Picks the glyph that stands for an item.
 *
 * An explicit `item.icon` wins; otherwise it is inferred from which field types
 * the item holds, so a login looks different from a card without the user having
 * to categorise anything.
 *
 * A pure function rather than only a component, because the detail header needs
 * the same answer without nesting another component inside its layout.
 */
export function itemIconName(item: VaultItem): IconName {
  if (item.icon) {
    return item.icon;
  }

  const types = new Set(item.fields.map((field) => field.type));

  if (types.has(FieldType.Url)) {
    return 'web';
  }
  if (types.has(FieldType.Credit)) {
    return 'credit';
  }
  if (types.has(FieldType.Username) && types.has(FieldType.Password)) {
    return 'login';
  }
  if (types.has(FieldType.Email) && types.has(FieldType.Password)) {
    return 'email';
  }
  if (types.has(FieldType.Password) || types.has(FieldType.Pin)) {
    return 'lock';
  }
  return 'note';
}
