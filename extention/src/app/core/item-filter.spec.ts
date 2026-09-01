import { filterItems, ItemFilter } from './item-filter';
import { VaultItem } from './models/vault-item';

function item(id: string, vaultId: string, name: string, tags: string[] = []): VaultItem {
  return {
    id,
    vaultId,
    name,
    fields: [],
    tags,
    created: new Date('2026-01-01T00:00:00Z'),
    updated: new Date('2026-01-01T00:00:00Z'),
    history: [],
  };
}

const ITEMS: VaultItem[] = [
  item('1', 'vault-personal', 'Alpha', ['work']),
  item('2', 'vault-work', 'Bravo', ['work']),
  item('3', 'vault-work', 'Charlie', ['personal']),
  item('4', 'vault-personal', 'Delta'),
];

const CONTEXT = { favouriteIds: new Set<string>() };

const run = (filter: Partial<ItemFilter>) =>
  filterItems(ITEMS, { search: '', ...filter }, CONTEXT).map((found) => found.name);

describe('filterItems', () => {
  it('returns every item when nothing is selected', () => {
    expect(run({})).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
  });

  /**
   * The popup's vault dropdown had no effect at all: `ItemFilter` carried no
   * `vaultId`, so the value the popup passed was silently dropped.
   */
  it('narrows to one vault', () => {
    expect(run({ vaultId: 'vault-work' })).toEqual(['Bravo', 'Charlie']);
    expect(run({ vaultId: 'vault-personal' })).toEqual(['Alpha', 'Delta']);
  });

  it('treats an absent vaultId as every vault', () => {
    expect(run({ vaultId: undefined })).toHaveLength(4);
  });

  it('narrows to one tag', () => {
    expect(run({ tag: 'work' })).toEqual(['Alpha', 'Bravo']);
  });

  it('applies vault and tag together rather than either alone', () => {
    expect(run({ vaultId: 'vault-work', tag: 'work' })).toEqual(['Bravo']);
    expect(run({ vaultId: 'vault-personal', tag: 'personal' })).toEqual([]);
  });

  it('lets a search term override the vault and tag filters', () => {
    // Deliberate, and matching the web app: typing searches everything rather
    // than only the vault that happened to be selected.
    expect(run({ search: 'charlie', vaultId: 'vault-personal', tag: 'work' })).toEqual(['Charlie']);
  });

  it('sorts by name', () => {
    expect(run({})).toEqual([...run({})].sort());
  });
});
