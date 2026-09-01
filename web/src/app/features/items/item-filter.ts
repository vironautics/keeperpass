import { Params } from '@angular/router';
import { AuditType, itemCreated, VaultItem } from '../../core/models';

/**
 * Which subset of the vault the items list is showing.
 *
 * Every field comes from a query parameter, so a filtered list is a shareable,
 * bookmarkable URL and the menu needs no selection state of its own.
 */
export interface ItemFilter {
  vaultId?: string;
  tag?: string;
  favourites: boolean;
  recent: boolean;
  report?: AuditType;
  search: string;
}

const AUDIT_TYPES = new Set<string>(Object.values(AuditType));

function isAuditType(value: string | undefined): value is AuditType {
  return !!value && AUDIT_TYPES.has(value);
}

export function parseItemFilter(params: Params): ItemFilter {
  const report = params['report'] as string | undefined;

  return {
    vaultId: params['vault'] || undefined,
    tag: params['tag'] || undefined,
    favourites: params['favourites'] === 'true' || params['favourites'] === true,
    recent: params['recent'] === 'true' || params['recent'] === true,
    report: isAuditType(report) ? report : undefined,
    search: params['search'] || '',
  };
}

/** True when no narrowing is applied and the list shows the whole vault set. */
export function isUnfiltered(filter: ItemFilter): boolean {
  return !filter.vaultId && !filter.tag && !filter.report && !filter.favourites && !filter.recent;
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

export interface FilterContext {
  favouriteIds: ReadonlySet<string>;
  /** Ids the user has opened recently, most-recent-first — see `RecentItemsService`. */
  recentIds: readonly string[];
  /**
   * Whether an item carries a given audit finding. Passed in rather than read
   * off the item: findings live in `AuditService` for the session, not in the
   * vault — see that service's doc comment for why.
   */
  hasFinding: (itemId: string, type: AuditType) => boolean;
}

/**
 * The items to show, in the order to show them.
 *
 * A search term replaces the other filters rather than narrowing them further.
 * Someone typing a search is looking for a thing they know they own, and they
 * are rarely thinking about which vault or tag was selected when they started
 * typing — a search that silently only looked inside the current selection
 * would report "no results" for an item sitting in the next vault.
 *
 * Sorted by name, except under the "recent" filter, where the order *is* the
 * point: an alphabetised "Recently Used" answers a question nobody asked.
 */
export function filterItems(
  items: readonly VaultItem[],
  filter: ItemFilter,
  context: FilterContext,
): VaultItem[] {
  const matches = filter.search
    ? items.filter((item) => matchesSearch(item, filter.search))
    : items.filter((item) => matchesFilter(item, filter, context));

  if (!filter.search && filter.recent) {
    return sortByRecency(matches, context.recentIds);
  }

  return [...matches].sort(byNameThenAge);
}

/**
 * Most-recently-opened first, by position in `recentIds`.
 *
 * Anything missing from that list sorts to the end. The filter above only lets
 * through items that are on it, so nothing should be missing — but a sort
 * comparator that can return `NaN` produces an arbitrary order rather than an
 * error, and that is not a failure worth debugging later.
 */
function sortByRecency(items: readonly VaultItem[], recentIds: readonly string[]): VaultItem[] {
  const rankById = new Map(recentIds.map((id, index) => [id, index]));
  const rank = (item: VaultItem) => rankById.get(item.id) ?? Number.MAX_SAFE_INTEGER;

  return [...items].sort((a, b) => rank(a) - rank(b) || byNameThenAge(a, b));
}

function matchesFilter(item: VaultItem, filter: ItemFilter, context: FilterContext): boolean {
  if (filter.vaultId && item.vaultId !== filter.vaultId) {
    return false;
  }
  if (filter.tag && !item.tags.includes(filter.tag)) {
    return false;
  }
  if (filter.favourites && !context.favouriteIds.has(item.id)) {
    return false;
  }
  if (filter.recent && !context.recentIds.includes(item.id)) {
    return false;
  }
  if (filter.report && !context.hasFinding(item.id, filter.report)) {
    return false;
  }
  return true;
}

/**
 * Name first, then oldest-first, then id.
 *
 * `localeCompare` alone leaves every same-named item tied, and a tie means the
 * order is whatever the vault happened to hand over — which shifts as items
 * are added, edited or synced, so a list could reshuffle under the user
 * between two renders. Falling through to the creation time and finally the
 * id makes the ordering total, so it is the same every time.
 */
function byNameThenAge(a: VaultItem, b: VaultItem): number {
  return (
    a.name.localeCompare(b.name) || itemCreated(a) - itemCreated(b) || a.id.localeCompare(b.id)
  );
}
