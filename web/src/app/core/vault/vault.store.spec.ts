import { TestBed } from '@angular/core/testing';
import { AuditType, FieldType, ITEM_TEMPLATES } from '../models';
import {
  createEmptyVaultSnapshot,
  ITEM_HISTORY_LIMIT,
  PERSONAL_VAULT_ID,
  VaultStore,
} from './vault.store';

function websiteFields() {
  const template = ITEM_TEMPLATES.find((t) => t.id === 'website')!;
  return template.fields.map((field) => ({
    name: field.name,
    type: field.type,
    value: field.value ?? '',
  }));
}

describe('VaultStore.ownVaults', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
    store.hydrate({
      vaults: [{ id: PERSONAL_VAULT_ID, name: 'My Vault' }],
      items: [],
      organizations: [],
      favouriteIds: [],
    });
  });

  it('includes the personal vault', () => {
    expect(store.ownVaults().map((vault) => vault.id)).toEqual([PERSONAL_VAULT_ID]);
  });

  it('includes vaults created via createVault(), alongside the personal one', () => {
    const created = store.createVault('Travel');

    expect(store.ownVaults().map((vault) => vault.id)).toEqual([PERSONAL_VAULT_ID, created.id]);
  });

  it('excludes vaults that belong to an organization', () => {
    store.hydrate({
      vaults: [
        { id: PERSONAL_VAULT_ID, name: 'My Vault' },
        { id: 'vault-team', name: 'Team Vault', organizationId: 'org-1' },
      ],
      items: [],
      organizations: [{ id: 'org-1', name: 'Acme' }],
      favouriteIds: [],
    });

    expect(store.ownVaults().map((vault) => vault.id)).toEqual([PERSONAL_VAULT_ID]);
  });
});

describe('VaultStore.createItem', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('adds a fully-composed item exactly as given, filling in the rest', () => {
    const item = store.createItem({
      id: 'item-1',
      vaultId: PERSONAL_VAULT_ID,
      name: 'GitHub',
      icon: 'web',
      fields: [{ name: 'Username', type: FieldType.Username, value: 'ada' }],
      tags: ['work'],
    });

    expect(item).toEqual({
      id: 'item-1',
      vaultId: PERSONAL_VAULT_ID,
      name: 'GitHub',
      icon: 'web',
      fields: [{ name: 'Username', type: FieldType.Username, value: 'ada' }],
      tags: ['work'],
      created: expect.any(Date),
      updated: expect.any(Date),
      history: [],
    });
    expect(store.itemById('item-1')).toEqual(item);
  });

  it('appends rather than replacing existing items', () => {
    store.createItem({ id: 'a', vaultId: PERSONAL_VAULT_ID, name: 'A', fields: [], tags: [] });
    store.createItem({ id: 'b', vaultId: PERSONAL_VAULT_ID, name: 'B', fields: [], tags: [] });

    expect(store.items().map((item) => item.id)).toEqual(['a', 'b']);
  });
});

describe('VaultStore.moveItem', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('changes only the vaultId of the target item', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'Item', fields: [], tags: [] });
    store.createItem({ id: 'item-2', vaultId: 'vault-a', name: 'Other', fields: [], tags: [] });

    store.moveItem('item-1', 'vault-b');

    expect(store.itemById('item-1')?.vaultId).toBe('vault-b');
    expect(store.itemById('item-2')?.vaultId).toBe('vault-a');
  });

  it('is a no-op for an unknown id', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'Item', fields: [], tags: [] });

    store.moveItem('does-not-exist', 'vault-b');

    expect(store.itemById('item-1')?.vaultId).toBe('vault-a');
  });
});

describe('VaultStore.moveItems', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('moves every listed item and leaves the rest alone', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'One', fields: [], tags: [] });
    store.createItem({ id: 'item-2', vaultId: 'vault-a', name: 'Two', fields: [], tags: [] });
    store.createItem({ id: 'item-3', vaultId: 'vault-a', name: 'Three', fields: [], tags: [] });

    store.moveItems(['item-1', 'item-3'], 'vault-b');

    expect(store.itemById('item-1')?.vaultId).toBe('vault-b');
    expect(store.itemById('item-2')?.vaultId).toBe('vault-a');
    expect(store.itemById('item-3')?.vaultId).toBe('vault-b');
  });

  it('is a no-op for an empty selection', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'One', fields: [], tags: [] });

    store.moveItems([], 'vault-b');

    expect(store.itemById('item-1')?.vaultId).toBe('vault-a');
  });
});

describe('VaultStore.deleteItem', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('removes the item and only that one', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'Item', fields: [], tags: [] });
    store.createItem({ id: 'item-2', vaultId: 'vault-a', name: 'Other', fields: [], tags: [] });

    store.deleteItem('item-1');

    expect(store.itemById('item-1')).toBeUndefined();
    expect(store.itemById('item-2')).toBeTruthy();
  });

  it('drops the deleted item from favourites too', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'Item', fields: [], tags: [] });
    store.toggleFavourite('item-1');
    expect(store.isFavourite('item-1')).toBe(true);

    store.deleteItem('item-1');

    expect(store.favouriteIds().has('item-1')).toBe(false);
  });

  it('is a no-op for an unknown id', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'Item', fields: [], tags: [] });

    store.deleteItem('does-not-exist');

    expect(store.itemById('item-1')).toBeTruthy();
  });
});

describe('VaultStore.deleteItems', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('removes every listed item and leaves the rest alone', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'One', fields: [], tags: [] });
    store.createItem({ id: 'item-2', vaultId: 'vault-a', name: 'Two', fields: [], tags: [] });
    store.createItem({ id: 'item-3', vaultId: 'vault-a', name: 'Three', fields: [], tags: [] });

    store.deleteItems(['item-1', 'item-3']);

    expect(store.itemById('item-1')).toBeUndefined();
    expect(store.itemById('item-2')).toBeTruthy();
    expect(store.itemById('item-3')).toBeUndefined();
  });

  it('drops every deleted item from favourites too', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'One', fields: [], tags: [] });
    store.createItem({ id: 'item-2', vaultId: 'vault-a', name: 'Two', fields: [], tags: [] });
    store.toggleFavourite('item-1');
    store.toggleFavourite('item-2');

    store.deleteItems(['item-1', 'item-2']);

    expect(store.favouriteIds().has('item-1')).toBe(false);
    expect(store.favouriteIds().has('item-2')).toBe(false);
  });

  it('is a no-op for an empty selection', () => {
    store.createItem({ id: 'item-1', vaultId: 'vault-a', name: 'Item', fields: [], tags: [] });

    store.deleteItems([]);

    expect(store.itemById('item-1')).toBeTruthy();
  });
});

describe('VaultStore.updateItem', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  function createTestItem() {
    return store.createItem({
      id: crypto.randomUUID(),
      vaultId: 'vault-personal',
      name: 'Original',
      icon: 'web',
      fields: websiteFields(),
      tags: [],
    });
  }

  it('patches only the target item', () => {
    const target = createTestItem();
    const other = createTestItem();

    store.updateItem(target.id, { name: 'Renamed' });

    expect(store.itemById(target.id)?.name).toBe('Renamed');
    expect(store.itemById(other.id)?.name).toBe('Original');
  });

  it('snapshots the pre-edit name/fields/tags as the first history entry', () => {
    const item = createTestItem();
    const originalFields = item.fields.map((field) => ({ ...field }));

    store.updateItem(item.id, { name: 'Renamed' });

    const [snapshot] = store.itemById(item.id)!.history;
    expect(snapshot.name).toBe('Original');
    expect(snapshot.fields).toEqual(originalFields);
    expect(snapshot.tags).toEqual([]);
  });

  it('prepends across consecutive edits, most recent first', () => {
    const item = createTestItem();

    store.updateItem(item.id, { name: 'Second' });
    store.updateItem(item.id, { name: 'Third' });

    const history = store.itemById(item.id)!.history;
    expect(history.map((entry) => entry.name)).toEqual(['Second', 'Original']);
    expect(store.itemById(item.id)?.name).toBe('Third');
  });

  it('bumps updated', () => {
    const item = createTestItem();
    const before = store.itemById(item.id)!.updated;

    store.updateItem(item.id, { name: 'Renamed' });

    expect(store.itemById(item.id)!.updated.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('does not mutate the previous item object', () => {
    const item = createTestItem();
    const before = store.itemById(item.id);

    store.updateItem(item.id, { name: 'Renamed' });

    expect(before?.name).toBe('Original');
    expect(store.itemById(item.id)).not.toBe(before);
  });

  it('is a no-op for an unknown id', () => {
    createTestItem();
    const itemsBefore = store.items();

    store.updateItem('does-not-exist', { name: 'Renamed' });

    expect(store.items()).toEqual(itemsBefore);
  });
});

describe('VaultStore.restoreHistoryEntry', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  function createTestItem() {
    return store.createItem({
      id: crypto.randomUUID(),
      vaultId: 'vault-personal',
      name: 'Original',
      icon: 'web',
      fields: websiteFields(),
      tags: ['work'],
    });
  }

  it('applies the old name/fields/tags, and snapshots the pre-restore state first', () => {
    const item = createTestItem();
    store.updateItem(item.id, { name: 'Renamed', tags: ['personal'] });

    store.restoreHistoryEntry(item.id, 0); // the entry updateItem() just pushed — "Original"/["work"]

    const restored = store.itemById(item.id)!;
    expect(restored.name).toBe('Original');
    expect(restored.tags).toEqual(['work']);
    expect(restored.history[0].name).toBe('Renamed'); // pre-restore state, preserved
  });

  it('is a no-op for an unknown item', () => {
    store.restoreHistoryEntry('does-not-exist', 0);
    // Nothing to assert beyond "it doesn't throw" — there's no item to have changed.
  });

  it('is a no-op for an out-of-range history index', () => {
    const item = createTestItem();
    store.updateItem(item.id, { name: 'Renamed' });

    store.restoreHistoryEntry(item.id, 5);

    expect(store.itemById(item.id)!.name).toBe('Renamed');
  });
});

describe('VaultStore.tags', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('derives counts from item usage', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work', 'urgent'],
    });
    store.createItem({
      id: 'b',
      vaultId: PERSONAL_VAULT_ID,
      name: 'B',
      fields: [],
      tags: ['work'],
    });

    expect(store.tags()).toEqual([
      { name: 'work', count: 2, color: expect.any(String), created: expect.any(Date) },
      { name: 'urgent', count: 1, color: expect.any(String), created: expect.any(Date) },
    ]);
  });

  it('keeps a tag with a count of 0 once every item carrying it is deleted', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work'],
    });

    store.deleteItem('a');

    expect(store.tags()).toEqual([
      { name: 'work', count: 0, color: expect.any(String), created: expect.any(Date) },
    ]);
  });

  it('keeps a tag added via updateItem even after it is later removed from the item', () => {
    const item = store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: [],
    });
    store.updateItem(item.id, { tags: ['work'] });

    store.updateItem(item.id, { tags: [] });

    expect(store.tags()).toEqual([
      { name: 'work', count: 0, color: expect.any(String), created: expect.any(Date) },
    ]);
  });

  it('includes a registry-only tag with a count of 0', () => {
    store.createTag('someday');

    expect(store.tags()).toEqual([
      { name: 'someday', count: 0, color: expect.any(String), created: expect.any(Date) },
    ]);
  });

  it('does not duplicate a tag that is both registered and in use', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work'],
    });
    store.createTag('work');

    expect(store.tags()).toEqual([
      { name: 'work', count: 1, color: expect.any(String), created: expect.any(Date) },
    ]);
  });

  it('ignores a blank name', () => {
    store.createTag('   ');

    expect(store.tags()).toEqual([]);
  });
});

describe('VaultStore.renameTag', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('renames the tag on every item that carries it, leaving others untouched', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work', 'urgent'],
    });
    store.createItem({
      id: 'b',
      vaultId: PERSONAL_VAULT_ID,
      name: 'B',
      fields: [],
      tags: ['personal'],
    });

    store.renameTag('work', 'job');

    expect(store.itemById('a')?.tags).toEqual(['urgent', 'job']);
    expect(store.itemById('b')?.tags).toEqual(['personal']);
  });

  it('renames a registry-only tag with no items', () => {
    store.createTag('someday');

    store.renameTag('someday', 'later');

    expect(store.tags().map((tag) => tag.name)).toEqual(['later']);
  });

  it('merges into an existing tag instead of duplicating it on an item that already has both', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work', 'job'],
    });

    store.renameTag('work', 'job');

    expect(store.itemById('a')?.tags).toEqual(['job']);
  });

  it('snapshots the pre-rename tags into history for each affected item', () => {
    const item = store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work'],
    });

    store.renameTag('work', 'job');

    expect(store.itemById(item.id)!.history[0].tags).toEqual(['work']);
  });

  it('is a no-op for a blank new name', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work'],
    });

    store.renameTag('work', '   ');

    expect(store.itemById('a')?.tags).toEqual(['work']);
  });

  it('is a no-op when the new name matches the old one', () => {
    const item = store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work'],
    });

    store.renameTag('work', 'work');

    expect(store.itemById(item.id)!.history).toEqual([]);
  });
});

describe('VaultStore.deleteTags', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  it('strips a deleted tag from every item that carries it, leaving other tags alone', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work', 'urgent'],
    });
    store.createItem({
      id: 'b',
      vaultId: PERSONAL_VAULT_ID,
      name: 'B',
      fields: [],
      tags: ['personal'],
    });

    store.deleteTag('work');

    expect(store.itemById('a')?.tags).toEqual(['urgent']);
    expect(store.itemById('b')?.tags).toEqual(['personal']);
    expect(store.tags().map((tag) => tag.name)).not.toContain('work');
  });

  it('deletes several tags at once, each from whichever items carry it', () => {
    store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work', 'urgent'],
    });
    store.createItem({
      id: 'b',
      vaultId: PERSONAL_VAULT_ID,
      name: 'B',
      fields: [],
      tags: ['urgent', 'personal'],
    });

    store.deleteTags(['work', 'urgent']);

    expect(store.itemById('a')?.tags).toEqual([]);
    expect(store.itemById('b')?.tags).toEqual(['personal']);
  });

  it('removes a registry-only tag with no items', () => {
    store.createTag('someday');

    store.deleteTag('someday');

    expect(store.tags()).toEqual([]);
  });

  it('snapshots the pre-delete tags into history for each affected item', () => {
    const item = store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work'],
    });

    store.deleteTag('work');

    expect(store.itemById(item.id)!.history[0].tags).toEqual(['work']);
  });

  it('is a no-op for an empty selection', () => {
    const item = store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'A',
      fields: [],
      tags: ['work'],
    });

    store.deleteTags([]);

    expect(store.itemById(item.id)!.tags).toEqual(['work']);
    expect(store.itemById(item.id)!.history).toEqual([]);
  });
});

describe('VaultStore.deleteHistoryEntry', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
  });

  function createTestItem() {
    return store.createItem({
      id: crypto.randomUUID(),
      vaultId: 'vault-personal',
      name: 'Original',
      fields: [],
      tags: [],
    });
  }

  it('removes only the targeted entry', () => {
    const item = createTestItem();
    store.updateItem(item.id, { name: 'Second' });
    store.updateItem(item.id, { name: 'Third' });
    expect(store.itemById(item.id)!.history.map((h) => h.name)).toEqual(['Second', 'Original']);

    store.deleteHistoryEntry(item.id, 0); // "Second" — the most recent entry

    expect(store.itemById(item.id)!.history.map((h) => h.name)).toEqual(['Original']);
  });

  it('does not affect other items', () => {
    const item = createTestItem();
    const other = createTestItem();
    store.updateItem(item.id, { name: 'Second' });
    store.updateItem(other.id, { name: 'Second' });

    store.deleteHistoryEntry(item.id, 0);

    expect(store.itemById(item.id)!.history).toHaveLength(0);
    expect(store.itemById(other.id)!.history).toHaveLength(1);
  });

  it('is a no-op for an unknown item', () => {
    store.deleteHistoryEntry('does-not-exist', 0);
    // Nothing to assert beyond "it doesn't throw".
  });
});

describe('VaultStore — history cap', () => {
  let store: VaultStore;

  beforeEach(() => {
    store = TestBed.inject(VaultStore);
    store.hydrate(createEmptyVaultSnapshot());
  });

  it('keeps only the newest ITEM_HISTORY_LIMIT versions, dropping the oldest', () => {
    const item = store.createItem({
      id: 'a',
      vaultId: PERSONAL_VAULT_ID,
      name: 'v0',
      fields: [],
      tags: [],
    });

    for (let i = 1; i <= ITEM_HISTORY_LIMIT + 4; i++) {
      store.updateItem(item.id, { name: `v${i}` });
    }

    const history = store.itemById('a')!.history;
    expect(history).toHaveLength(ITEM_HISTORY_LIMIT);
    // Newest first: the snapshot taken by the most recent edit holds the name
    // the item had just before it.
    expect(history[0].name).toBe(`v${ITEM_HISTORY_LIMIT + 3}`);
    expect(history.map((entry) => entry.name)).not.toContain('v0');
  });

  // Vaults written before the cap existed carry unbounded history; opening one
  // has to trim it, or those users stay oversized forever.
  it('trims an over-long history already present in a loaded vault', () => {
    const entry = (name: string) => ({ updated: new Date(), name, fields: [], tags: [] });
    store.hydrate({
      ...createEmptyVaultSnapshot(),
      items: [
        {
          id: 'a',
          vaultId: PERSONAL_VAULT_ID,
          name: 'Current',
          fields: [],
          tags: [],
          updated: new Date(),
          history: Array.from({ length: 40 }, (_, i) => entry(`old-${i}`)),
        },
      ],
    });

    expect(store.itemById('a')!.history).toHaveLength(ITEM_HISTORY_LIMIT);
  });
});
