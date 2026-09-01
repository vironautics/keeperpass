import { computed, Injectable, signal } from '@angular/core';
import { ItemDraft } from '../import-export';
import {
  AuditResult,
  AuditType,
  HistoryEntry,
  Organization,
  TagInfo,
  Vault,
  VaultItem,
  vaultLabel,
} from '../models';
import { tagColor } from './tag-color';

/** Every real account has this vault; it's not sample data, just the one structural default. */
export const PERSONAL_VAULT_ID = 'vault-personal';

/** What a brand-new account's vault looks like, before anything has been added to it. */
export interface VaultSnapshot {
  vaults: readonly Vault[];
  items: readonly VaultItem[];
  organizations: readonly Organization[];
  favouriteIds: readonly string[];
  /**
   * Tag names known to exist even with zero items — e.g. created ahead of
   * use from the tag-management page. Optional so a snapshot saved before
   * this field existed still hydrates cleanly (see `hydrate()`).
   */
  tagRegistry?: readonly (string | TagRegistryEntry)[];
  /**
   * The last few exports, newest first — see `EXPORT_HISTORY_LIMIT`. Optional, like
   * `tagRegistry`, so a snapshot saved before this existed still hydrates.
   *
   * Kept in the vault rather than in `localStorage` because it is a record of what left
   * the vault and when: that belongs behind the same encryption as the data itself, and
   * it should follow the user to their other devices.
   */
  exportHistory?: readonly ExportRecord[];
}

/** One export, as it is stored. `at` is an ISO string in the file, a `Date` in memory. */
export interface ExportRecord {
  at: string | Date;
  /** The format's id. Always `csv` today; kept as a field so old records stay readable. */
  format: string;
  /** What was exported, in words: a vault's name, or "All Vaults". */
  scope: string;
  itemCount: number;
  fileName: string;
}

/**
 * A registered tag as stored in the snapshot.
 *
 * The registry used to be a bare `string[]`; entries written by this version carry the
 * date the tag was registered, and a plain string still hydrates cleanly as an entry
 * with no date. `created` is typed loosely because `JSON.parse` hands dates back as
 * strings — `hydrate()` revives them.
 */
export interface TagRegistryEntry {
  name: string;
  created?: string | Date;
}

/**
 * How many past versions each item keeps. Every entry duplicates the item's
 * full name, fields and tags, so this is the main thing standing between a
 * long-lived vault and an unbounded one — the whole vault is a single
 * encrypted blob downloaded and decrypted on every unlock.
 */
export const ITEM_HISTORY_LIMIT = 5;

/**
 * How many past exports are remembered. Enough to answer "did I already export this
 * week?", short enough that the list stays readable and the vault stays small.
 */
export const EXPORT_HISTORY_LIMIT = 10;

export function createEmptyVaultSnapshot(): VaultSnapshot {
  return {
    vaults: [{ id: PERSONAL_VAULT_ID, name: 'My Vault', created: new Date() }],
    items: [],
    organizations: [],
    favouriteIds: [],
    tagRegistry: [],
    exportHistory: [],
  };
}

/**
 * `JSON.parse` leaves dates as strings — `new Date` on an already-real Date
 * is a no-op, so this is safe either way.
 *
 * Also enforces `ITEM_HISTORY_LIMIT` on the way in, so a vault written before
 * the cap existed (or by an older client) is trimmed the first time it is
 * opened rather than staying oversized until every item happens to be edited.
 * The trim reaches Drive on the next save.
 */
function reviveItemDates(item: VaultItem): VaultItem {
  return {
    ...item,
    created: item.created ? new Date(item.created) : undefined,
    updated: new Date(item.updated),
    expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
    history: item.history
      .slice(0, ITEM_HISTORY_LIMIT)
      .map((entry) => ({ ...entry, updated: new Date(entry.updated) })),
  };
}

/** Same reason as `reviveItemDates`: a date out of `JSON.parse` is a string. */
function reviveVaultDates(vault: Vault): Vault {
  return vault.created ? { ...vault, created: new Date(vault.created) } : vault;
}

/** As with items and vaults: a date out of `JSON.parse` is a string. */
function reviveExportRecord(record: ExportRecord): ExportRecord {
  return { ...record, at: new Date(record.at) };
}

/** Normalises the two shapes the registry has had into the current one. */
function reviveTagRegistry(
  entries: readonly (string | TagRegistryEntry)[] | undefined,
): readonly TagRegistryEntry[] {
  return (entries ?? []).map((entry) =>
    typeof entry === 'string'
      ? { name: entry }
      : { name: entry.name, created: entry.created ? new Date(entry.created) : undefined },
  );
}

/**
 * Read model for everything the vault UI renders.
 *
 * Starts empty. `/unlock` calls `hydrate()` once, with whichever vault it
 * fetched (or created) from Google Drive — see `core/drive` and
 * `features/auth/unlock`.
 */
@Injectable({ providedIn: 'root' })
export class VaultStore {
  private readonly _vaults = signal<readonly Vault[]>([]);
  private readonly _items = signal<readonly VaultItem[]>([]);
  private readonly _organizations = signal<readonly Organization[]>([]);
  private readonly _favouriteIds = signal<ReadonlySet<string>>(new Set());
  /** Tags registered independently of item usage — see `VaultSnapshot.tagRegistry`. */
  private readonly _tagRegistry = signal<readonly TagRegistryEntry[]>([]);
  /** The last `EXPORT_HISTORY_LIMIT` exports, newest first. */
  private readonly _exportHistory = signal<readonly ExportRecord[]>([]);

  readonly vaults = this._vaults.asReadonly();
  readonly items = this._items.asReadonly();
  readonly organizations = this._organizations.asReadonly();
  readonly favouriteIds = this._favouriteIds.asReadonly();
  readonly exportHistory = this._exportHistory.asReadonly();

  /** The user's own vault, which is always listed above shared ones. */
  readonly personalVault = computed(() =>
    this._vaults().find((vault) => vault.id === PERSONAL_VAULT_ID),
  );

  /**
   * Every vault owned directly by the user — not shared through an
   * organization. Always includes the personal vault; `createVault()` can
   * add more, sitting alongside it in the sidebar (`_vaults` keeps creation
   * order, and the personal vault is always seeded first, so this needs no
   * separate sort).
   */
  readonly ownVaults = computed(() => this._vaults().filter((vault) => !vault.organizationId));

  readonly sharedVaults = computed(() => this._vaults().filter((vault) => !!vault.organizationId));

  /**
   * Every known tag, with its usage count, sorted by how often it appears.
   * "Known" is the union of two sources: names actually present on some
   * item, and names registered ahead of use via `createTag()` — a
   * registry-only tag simply shows a count of 0 until it's put on an item.
   */
  readonly tags = computed<TagInfo[]>(() => {
    const counts = new Map<string, number>();

    for (const item of this._items()) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    /**
     * When each tag was registered. A tag that predates the registry storing dates
     * falls back to the earliest `created` among the items carrying it — the closest
     * thing to a truthful answer, and better than showing nothing for every old tag.
     */
    const registered = new Map<string, Date | undefined>();
    for (const entry of this._tagRegistry()) {
      registered.set(entry.name, entry.created instanceof Date ? entry.created : undefined);
    }

    const firstUsed = new Map<string, Date>();
    for (const item of this._items()) {
      if (!item.created) {
        continue;
      }
      for (const tag of item.tags) {
        const earliest = firstUsed.get(tag);
        if (!earliest || item.created < earliest) {
          firstUsed.set(tag, item.created);
        }
      }
    }

    const names = new Set([...registered.keys(), ...counts.keys()]);

    return [...names]
      .map((name) => ({
        name,
        count: counts.get(name) ?? 0,
        color: tagColor(name),
        created: registered.get(name) ?? firstUsed.get(name),
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  });

  /**
   * Badge numbers shown next to the menu's filter entries. "Recently Used"
   * isn't here — it's driven by `RecentItemsService` (a per-device
   * `localStorage` list, not vault content), computed alongside it in
   * the sidebar instead.
   */
  readonly counts = computed(() => {
    const items = this._items();
    const favourites = this._favouriteIds();

    return {
      total: items.length,
      favourites: items.filter((item) => favourites.has(item.id)).length,
    };
  });

  /** Replaces all vault data — called once, when `/unlock` finishes loading or creating the encrypted store. */
  hydrate(data: VaultSnapshot): void {
    this._vaults.set(data.vaults.map(reviveVaultDates));
    this._items.set(data.items.map(reviveItemDates));
    this._organizations.set(data.organizations);
    this._favouriteIds.set(new Set(data.favouriteIds));
    // Older snapshots (saved before the tag registry existed) simply omit
    // the field — treat that the same as "no registered tags yet".
    this._tagRegistry.set(reviveTagRegistry(data.tagRegistry));
    this._exportHistory.set(
      (data.exportHistory ?? []).slice(0, EXPORT_HISTORY_LIMIT).map(reviveExportRecord),
    );
  }

  /** What `/unlock` encrypts and saves back to Drive. */
  snapshot(): VaultSnapshot {
    return {
      vaults: this._vaults(),
      items: this._items(),
      organizations: this._organizations(),
      favouriteIds: [...this._favouriteIds()],
      tagRegistry: this._tagRegistry(),
      exportHistory: this._exportHistory(),
    };
  }

  vaultById(id: string): Vault | undefined {
    return this._vaults().find((vault) => vault.id === id);
  }

  organizationById(id: string | undefined): Organization | undefined {
    return id ? this._organizations().find((organization) => organization.id === id) : undefined;
  }

  itemById(id: string): VaultItem | undefined {
    return this._items().find((item) => item.id === id);
  }

  itemsInVault(vaultId: string): VaultItem[] {
    return this._items().filter((item) => item.vaultId === vaultId);
  }

  /** `Organization / Vault`, or just the vault name for the personal one. */
  labelForVault(vaultId: string): string {
    const vault = this.vaultById(vaultId);
    return vault ? vaultLabel(vault, this.organizationById(vault.organizationId)) : '';
  }

  /** Adds a new, empty, personal vault and returns it. */
  createVault(name: string): Vault {
    const vault: Vault = { id: crypto.randomUUID(), name, created: new Date() };
    this._vaults.update((vaults) => [...vaults, vault]);
    return vault;
  }

  /**
   * Adds a fully-composed item — name, fields and tags already filled in —
   * and returns it.
   *
   * There's no "empty, just-picked-a-template" intermediate state here on
   * purpose: a new item only reaches the store once the user actually saves
   * it from `ItemView`. Until then it's an `ItemDraftStore` draft, held only
   * in memory, never synced to Drive.
   */
  createItem(item: Omit<VaultItem, 'created' | 'updated' | 'history'>): VaultItem {
    const now = new Date();
    const newItem: VaultItem = { ...item, created: now, updated: now, history: [] };

    this._items.update((items) => [...items, newItem]);
    this.registerTags(newItem.tags);

    return newItem;
  }

  /** Moves an item to a different vault. */
  moveItem(itemId: string, vaultId: string): void {
    this.moveItems([itemId], vaultId);
  }

  /** Moves several items to a different vault in one pass — the "Move selected items" bulk action. */
  moveItems(itemIds: readonly string[], vaultId: string): void {
    const ids = new Set(itemIds);
    this._items.update((items) =>
      items.map((item) => (ids.has(item.id) ? { ...item, vaultId } : item)),
    );
  }

  /** Permanently removes an item, and drops any favourite marker pointing at it. */
  deleteItem(itemId: string): void {
    this.deleteItems([itemId]);
  }

  /** Permanently removes several items in one pass — the "Delete selected items" bulk action. */
  deleteItems(itemIds: readonly string[]): void {
    const ids = new Set(itemIds);
    this._items.update((items) => items.filter((item) => !ids.has(item.id)));
    this._favouriteIds.update((favourites) => {
      if (![...ids].some((id) => favourites.has(id))) {
        return favourites;
      }
      const next = new Set(favourites);
      for (const id of ids) {
        next.delete(id);
      }
      return next;
    });
  }

  /**
   * Applies an edit to an item's name, fields and/or tags.
   *
   * Snapshots the item's state *before* the patch into `history` (most
   * recent first, matching how `ItemView` renders it — "Current Version"
   * first, then history in the same order), bumps `updated`, and clears
   * any audit findings, since they may no longer describe the new values.
   */
  updateItem(id: string, patch: Partial<Pick<VaultItem, 'name' | 'fields' | 'tags'>>): void {
    this._items.update((items) =>
      items.map((item) => (item.id === id ? this.withHistorySnapshot(item, patch) : item)),
    );
    if (patch.tags) {
      this.registerTags(patch.tags);
    }
  }

  /**
   * Restores an item to an earlier version. Just another `updateItem()`
   * patch — the item's current state gets snapshotted into history before
   * the old name/fields/tags are applied, so restoring a version is itself
   * undoable, the same way any other save is. A no-op if the item or the
   * history entry no longer exists (e.g. a stale index after a concurrent
   * `deleteHistoryEntry()`).
   */
  restoreHistoryEntry(itemId: string, historyIndex: number): void {
    const entry = this.itemById(itemId)?.history[historyIndex];
    if (!entry) {
      return;
    }

    this.updateItem(itemId, { name: entry.name, fields: entry.fields, tags: entry.tags });
  }

  /**
   * Permanently removes one entry from an item's history. Unlike deleting
   * the item itself, this has no undo — the entry is simply gone.
   */
  deleteHistoryEntry(itemId: string, historyIndex: number): void {
    this._items.update((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, history: item.history.filter((_, index) => index !== historyIndex) }
          : item,
      ),
    );
  }

  /**
   * Registers a tag name ahead of use, so it shows up (with a count of 0)
   * before it's ever put on an item. A no-op for a blank name or one that's
   * already known.
   */
  createTag(name: string): void {
    this.registerTags([name]);
  }

  /**
   * Remembers that an export happened. Newest first, capped at
   * `EXPORT_HISTORY_LIMIT` — the oldest entry falls off rather than the list growing.
   *
   * Only ever a record *about* an export: what, when, how many. Never the exported data.
   */
  recordExport(record: Omit<ExportRecord, 'at'> & { at?: Date }): void {
    const entry: ExportRecord = { ...record, at: record.at ?? new Date() };
    this._exportHistory.update((history) => [entry, ...history].slice(0, EXPORT_HISTORY_LIMIT));
  }

  /**
   * Makes one or more tag names durable in the registry, regardless of item
   * usage. Called every time tags are written onto an item — creating one,
   * editing one, importing, restoring history — so a tag the user typed
   * once never silently disappears just because the last item carrying it
   * was later deleted or edited to drop it. The only way a tag actually goes
   * away is an explicit `deleteTags()` call from the tag-management page.
   * Blank names (padding from an empty draft) and already-known names are
   * skipped.
   */
  private registerTags(names: readonly string[]): void {
    const trimmed = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
    if (!trimmed.length) {
      return;
    }

    this._tagRegistry.update((tags) => {
      const known = new Set(tags.map((tag) => tag.name));
      const missing = trimmed.filter((name) => !known.has(name));
      if (!missing.length) {
        return tags;
      }
      const now = new Date();
      return [...tags, ...missing.map((name) => ({ name, created: now }))];
    });
  }

  /**
   * Renames a tag everywhere it appears: on every item that carries it, and
   * in the registry. If `newName` collides with a tag some item already
   * has, the two merge — that item keeps a single instance of the name, not
   * two. A no-op if `newName` is blank or unchanged.
   */
  renameTag(oldName: string, newName: string): void {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) {
      return;
    }

    this._items.update((items) =>
      items.map((item) => {
        if (!item.tags.includes(oldName)) {
          return item;
        }

        const tags = item.tags.filter((tag) => tag !== oldName);
        if (!tags.includes(trimmed)) {
          tags.push(trimmed);
        }

        return this.withHistorySnapshot(item, { tags });
      }),
    );

    this._tagRegistry.update((tags) => {
      // A rename is the same tag under another name, so it keeps its date. Merging
      // into an existing tag keeps *that* tag's date, since it is the one that stays.
      const renamed = tags.find((tag) => tag.name === oldName);
      const withoutOld = tags.filter((tag) => tag.name !== oldName);
      return withoutOld.some((tag) => tag.name === trimmed)
        ? withoutOld
        : [...withoutOld, { name: trimmed, created: renamed?.created }];
    });
  }

  /**
   * Permanently removes one or more tags: strips them from every item that
   * carries any of them, and drops them from the registry. Deleting a tag
   * that's in use is exactly the point — the data must not be left
   * referencing a tag that no longer exists, so this is the only way tags
   * are removed, whether from the management page's single delete or its
   * bulk delete after a multi-select.
   */
  deleteTags(names: readonly string[]): void {
    const toDelete = new Set(names);
    if (!toDelete.size) {
      return;
    }

    this._items.update((items) =>
      items.map((item) => {
        if (!item.tags.some((tag) => toDelete.has(tag))) {
          return item;
        }

        return this.withHistorySnapshot(item, {
          tags: item.tags.filter((tag) => !toDelete.has(tag)),
        });
      }),
    );

    this._tagRegistry.update((tags) => tags.filter((tag) => !toDelete.has(tag.name)));
  }

  /** Single-tag convenience wrapper around `deleteTags()`. */
  deleteTag(name: string): void {
    this.deleteTags([name]);
  }

  /**
   * Applies a name/fields/tags patch to one item, snapshotting its pre-patch
   * state into `history` first, bumping `updated`, and clearing
   * any audit findings, since they may no longer describe the new values. Shared
   * by `updateItem()` (looks up the item by id) and `renameTag()`/
   * `deleteTags()` (already have it in hand from their own `_items.update()`
   * map).
   */
  private withHistorySnapshot(
    item: VaultItem,
    patch: Partial<Pick<VaultItem, 'name' | 'fields' | 'tags'>>,
  ): VaultItem {
    const snapshot: HistoryEntry = {
      updated: item.updated,
      name: item.name,
      fields: item.fields.map((field) => ({ ...field })),
      tags: [...item.tags],
    };

    return {
      ...item,
      ...patch,
      updated: new Date(),
      // Newest first, oldest dropped past the cap. Each entry duplicates the
      // item's whole name/fields/tags, so an uncapped history is what makes a
      // vault grow without bound — and the entire vault is one encrypted blob
      // that every unlock has to download and decrypt.
      history: [snapshot, ...item.history].slice(0, ITEM_HISTORY_LIMIT),
    };
  }

  /** Adds imported drafts to a vault and returns how many landed. */
  addItems(vaultId: string, drafts: readonly ItemDraft[]): number {
    const items: VaultItem[] = drafts.map((draft) => ({
      id: crypto.randomUUID(),
      vaultId,
      name: draft.name,
      fields: draft.fields.map((field) => ({ ...field })),
      tags: [...draft.tags],
      created: new Date(),
      updated: new Date(),
      history: [],
    }));

    this._items.update((current) => [...current, ...items]);
    this.registerTags(items.flatMap((item) => item.tags));

    return items.length;
  }

  isFavourite(itemId: string): boolean {
    return this._favouriteIds().has(itemId);
  }

  toggleFavourite(itemId: string): void {
    this._favouriteIds.update((current) => {
      const next = new Set(current);
      if (!next.delete(itemId)) {
        next.add(itemId);
      }
      return next;
    });
  }

  /** Renames a vault. A no-op if the vault doesn't exist or `newName` is blank. */
  renameVault(vaultId: string, newName: string): void {
    const trimmed = newName.trim();
    if (!trimmed) {
      return;
    }

    this._vaults.update((vaults) =>
      vaults.map((vault) => (vault.id === vaultId ? { ...vault, name: trimmed } : vault)),
    );
  }

  /**
   * Deletes a vault and moves all its items to the personal vault. A no-op if
   * the vault doesn't exist or is the personal vault itself (cannot delete the
   * default vault). Returns whether the deletion succeeded.
   */
  deleteVault(vaultId: string): boolean {
    if (vaultId === PERSONAL_VAULT_ID) {
      return false;
    }

    const vault = this.vaultById(vaultId);
    if (!vault) {
      return false;
    }

    this._vaults.update((vaults) => vaults.filter((v) => v.id !== vaultId));
    this.moveItems(
      this.itemsInVault(vaultId).map((item) => item.id),
      PERSONAL_VAULT_ID,
    );

    return true;
  }
}
