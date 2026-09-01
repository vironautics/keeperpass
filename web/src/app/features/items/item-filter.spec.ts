import { AuditType, FieldType, VaultItem } from '../../core/models';
import { filterItems, isUnfiltered, parseItemFilter } from './item-filter';

const NOW = new Date('2026-08-01T12:00:00Z');

function item(overrides: Partial<VaultItem> & Pick<VaultItem, 'id'>): VaultItem {
  return {
    vaultId: 'vault-a',
    name: overrides.id,
    fields: [],
    tags: [],
    updated: NOW,
    history: [],
    ...overrides,
  };
}

const context = {
  favouriteIds: new Set(['starred']),
  recentIds: [] as string[],
  hasFinding: () => false,
};

const EMPTY_FILTER = parseItemFilter({});

describe('parseItemFilter', () => {
  it('defaults every flag to off', () => {
    expect(EMPTY_FILTER).toEqual({
      vaultId: undefined,
      tag: undefined,
      favourites: false,
      recent: false,
      report: undefined,
      search: '',
    });
  });

  it('reads flags whether the router gives strings or booleans', () => {
    expect(parseItemFilter({ recent: 'true' }).recent).toBe(true);
    expect(parseItemFilter({ recent: true }).recent).toBe(true);
    expect(parseItemFilter({ recent: 'false' }).recent).toBe(false);
  });

  it('ignores a report value that is not a known audit type', () => {
    expect(parseItemFilter({ report: 'nonsense' }).report).toBeUndefined();
    expect(parseItemFilter({ report: AuditType.WeakPassword }).report).toBe(AuditType.WeakPassword);
  });

  it('recognises an unnarrowed filter', () => {
    expect(isUnfiltered(EMPTY_FILTER)).toBe(true);
    expect(isUnfiltered(parseItemFilter({ tag: 'work' }))).toBe(false);
  });
});

describe('filterItems', () => {
  it('sorts by name rather than insertion order', () => {
    const items = [item({ id: 'c' }), item({ id: 'a' }), item({ id: 'b' })];
    expect(filterItems(items, EMPTY_FILTER, context).map((i) => i.id)).toEqual(['a', 'b', 'c']);
  });

  it('narrows to a single vault', () => {
    const items = [item({ id: 'a', vaultId: 'vault-a' }), item({ id: 'b', vaultId: 'vault-b' })];
    const filter = parseItemFilter({ vault: 'vault-b' });
    expect(filterItems(items, filter, context).map((i) => i.id)).toEqual(['b']);
  });

  it('narrows by tag, favourite and audit finding', () => {
    const items = [
      item({ id: 'tagged', tags: ['work'] }),
      item({ id: 'starred' }),
      item({ id: 'weak' }),
    ];
    // Findings come from `AuditService` via the context, not off the item.
    const withFindings = {
      ...context,
      hasFinding: (itemId: string, type: AuditType) =>
        itemId === 'weak' && type === AuditType.WeakPassword,
    };

    const ids = (params: Record<string, string>) =>
      filterItems(items, parseItemFilter(params), withFindings).map((i) => i.id);

    expect(ids({ tag: 'work' })).toEqual(['tagged']);
    expect(ids({ favourites: 'true' })).toEqual(['starred']);
    expect(ids({ report: AuditType.WeakPassword })).toEqual(['weak']);
  });

  it('narrows to items whose id is in recentIds', () => {
    const items = [item({ id: 'opened' }), item({ id: 'never-opened' })];
    const filter = parseItemFilter({ recent: 'true' });
    const recentContext = { ...context, recentIds: ['opened'] };

    expect(filterItems(items, filter, recentContext).map((i) => i.id)).toEqual(['opened']);
  });

  it('sorts the "recent" filter by recency, not alphabetically', () => {
    // Names are the reverse of recency, so a passing test proves recency
    // order won, not that it coincidentally matches the name sort.
    const items = [
      item({ id: 'old-apple', name: 'Apple' }),
      item({ id: 'recent-zebra', name: 'Zebra' }),
    ];
    const filter = parseItemFilter({ recent: 'true' });
    const recentContext = { ...context, recentIds: ['recent-zebra', 'old-apple'] };

    expect(filterItems(items, filter, recentContext).map((i) => i.id)).toEqual([
      'recent-zebra',
      'old-apple',
    ]);
  });

  it('still sorts by name when a search term overrides the "recent" filter', () => {
    const items = [
      item({ id: 'old-apple', name: 'Apple' }),
      item({ id: 'recent-zebra', name: 'Zebra' }),
    ];
    const filter = { ...parseItemFilter({ recent: 'true' }), search: 'a' };
    const recentContext = { ...context, recentIds: ['recent-zebra', 'old-apple'] };

    expect(filterItems(items, filter, recentContext).map((i) => i.id)).toEqual([
      'old-apple',
      'recent-zebra',
    ]);
  });

  it('searches names, tags, field names and field values', () => {
    const items = [
      item({ id: 'by-name', name: 'GitHub' }),
      item({ id: 'by-tag', name: 'x', tags: ['infrastructure'] }),
      item({
        id: 'by-field-value',
        name: 'y',
        fields: [{ name: 'Username', value: 'ada.lovelace', type: FieldType.Username }],
      }),
      item({ id: 'unrelated', name: 'z' }),
    ];

    const search = (term: string) =>
      filterItems(items, { ...EMPTY_FILTER, search: term }, context).map((i) => i.id);

    expect(search('github')).toEqual(['by-name']);
    expect(search('infra')).toEqual(['by-tag']);
    expect(search('lovelace')).toEqual(['by-field-value']);
    expect(search('username')).toEqual(['by-field-value']);
  });

  it('requires every word to match, in any order', () => {
    const items = [
      item({ id: 'both', name: 'Production Database' }),
      item({ id: 'one', name: 'Production' }),
    ];
    const search = (term: string) =>
      filterItems(items, { ...EMPTY_FILTER, search: term }, context).map((i) => i.id);

    expect(search('database production')).toEqual(['both']);
    // Both match; "Production" sorts before "Production Database".
    expect(search('production')).toEqual(['one', 'both']);
  });

  it('searches across the whole vault set, ignoring the structural filter', () => {
    const items = [item({ id: 'elsewhere', name: 'Target', vaultId: 'vault-b' })];
    const filter = { ...parseItemFilter({ vault: 'vault-a' }), search: 'target' };
    expect(filterItems(items, filter, context).map((i) => i.id)).toEqual(['elsewhere']);
  });
});

describe('filterItems — ordering', () => {
  // Same-named items used to tie, leaving their order down to however the
  // vault happened to hand them over — which shifts as items are added or
  // synced, so a list could reshuffle under the user between renders.
  it('is stable for items sharing a name, oldest first', () => {
    const older = item({ id: 'b', name: 'Bank', created: new Date('2024-01-01') });
    const newer = item({ id: 'a', name: 'Bank', created: new Date('2026-01-01') });

    expect(filterItems([newer, older], EMPTY_FILTER, context).map((i) => i.id)).toEqual(['b', 'a']);
    expect(filterItems([older, newer], EMPTY_FILTER, context).map((i) => i.id)).toEqual(['b', 'a']);
  });

  it('falls back to `updated` for items saved before `created` existed', () => {
    const legacy = item({ id: 'old', name: 'Bank', updated: new Date('2020-01-01') });
    const fresh = item({ id: 'new', name: 'Bank', created: new Date('2026-01-01') });

    expect(filterItems([fresh, legacy], EMPTY_FILTER, context).map((i) => i.id)).toEqual([
      'old',
      'new',
    ]);
  });
});
