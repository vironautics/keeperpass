import { itemCreated, VaultItem } from './models/vault-item';

export interface ItemFilter {
  search: string;
  /** Restricts the list to one vault. Absent means every vault. */
  vaultId?: string;
  tag?: string;
}

export interface FilterContext {
  favouriteIds: ReadonlySet<string>;
}

/**
 * Every word in the query must appear somewhere in the item — its name, tags,
 * field names or field values. Word order does not matter.
 */
function matchesSearch(item: VaultItem, search: string): boolean {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return true;
  }

  const haystack = [
    item.name,
    ...item.tags,
    ...item.fields.flatMap((field) => [field.name, field.value]),
  ]
    .join(' ')
    .toLowerCase();

  return words.every((word) => haystack.includes(word));
}

/**
 * Applies the filter and sorts by name.
 *
 * A search term overrides the structural filters, matching the web app: when
 * the user types, they are looking across everything rather than within the
 * vault or tag they happened to have selected.
 */
export function filterItems(
  items: readonly VaultItem[],
  filter: ItemFilter,
  context: FilterContext,
): VaultItem[] {
  const matches = filter.search
    ? items.filter((item) => matchesSearch(item, filter.search))
    : items.filter((item) => matchesFilter(item, filter));

  return [...matches].sort(byNameThenAge);
}

/**
 * The structural filters, which narrow together — picking a vault *and* a tag
 * shows the items with that tag in that vault.
 */
function matchesFilter(item: VaultItem, filter: ItemFilter): boolean {
  if (filter.vaultId && item.vaultId !== filter.vaultId) {
    return false;
  }
  if (filter.tag && !item.tags.includes(filter.tag)) {
    return false;
  }
  return true;
}

/**
 * Name first, then oldest-first, then id — the same total ordering the web app
 * uses, so an item sits in the same place in both.
 *
 * `localeCompare` alone leaves same-named items tied, and a tie means the
 * order is whatever the vault happened to hand over, which shifts as items are
 * added or synced.
 */
function byNameThenAge(a: VaultItem, b: VaultItem): number {
  return (
    a.name.localeCompare(b.name) || itemCreated(a) - itemCreated(b) || a.id.localeCompare(b.id)
  );
}
