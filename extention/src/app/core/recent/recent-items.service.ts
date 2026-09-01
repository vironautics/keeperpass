import { Injectable, signal } from '@angular/core';

/** `localStorage` key — see the class doc comment for why this isn't part of `VaultSnapshot`. */
export const RECENT_ITEMS_STORAGE_KEY = 'keeperpass:recentItemIds';

/** How many ids the "Recently Used" list remembers. */
export const MAX_RECENT_ITEMS = 50;

function loadFromStorage(): readonly string[] {
  const raw = localStorage.getItem(RECENT_ITEMS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Which items *this browser* has actually opened recently — most-recent-first,
 * capped at `MAX_RECENT_ITEMS`.
 *
 * Deliberately not a `VaultStore`/`VaultSnapshot` field: which item you looked
 * at is per-device browsing history, not vault content, so it lives in
 * `localStorage` (survives a refresh, never leaves the browser) instead of
 * round-tripping through Drive with the rest of the vault on every
 * `syncNow()`. This also replaces the item-level `lastUsed` timestamp the
 * original app tracked separately per item — this app never actually set
 * that field anywhere, so "Recently Used" was silently always empty; this
 * service is the real implementation.
 */
@Injectable({ providedIn: 'root' })
export class RecentItemsService {
  private readonly _ids = signal<readonly string[]>(loadFromStorage());

  /** Most-recent-first, capped at `MAX_RECENT_ITEMS`. */
  readonly ids = this._ids.asReadonly();

  /** Moves `id` to the front, dropping any older occurrence, then trims to the cap. */
  recordVisit(id: string): void {
    this._ids.update((current) => {
      const next = [id, ...current.filter((existing) => existing !== id)].slice(0, MAX_RECENT_ITEMS);
      localStorage.setItem(RECENT_ITEMS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  /** Drops one id — called when its item is deleted, so a dead id doesn't take up a slot forever. */
  forget(id: string): void {
    this._ids.update((current) => {
      if (!current.includes(id)) {
        return current;
      }
      const next = current.filter((existing) => existing !== id);
      localStorage.setItem(RECENT_ITEMS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }
}
