import { Injectable, signal } from '@angular/core';
import { ItemTemplate } from '../models';

export interface ItemDraft {
  id: string;
  vaultId: string;
  template: ItemTemplate;
}

/**
 * Holds at most one new-item draft in memory — never in `VaultStore`, and so
 * never synced to Drive — until the user actually saves it from `ItemView`.
 *
 * `CreateItemDialog` starts one and hands its `id` to the URL so `ItemView`
 * can look it up the same way it looks up a real item; cancelling or
 * navigating away without saving just leaves it to be replaced by the next
 * one started, or dropped with the rest of the app on reload — there's
 * nothing to undo, because nothing was ever written anywhere.
 */
@Injectable({ providedIn: 'root' })
export class ItemDraftStore {
  private readonly _draft = signal<ItemDraft | null>(null);

  readonly draft = this._draft.asReadonly();

  start(vaultId: string, template: ItemTemplate): string {
    const id = crypto.randomUUID();
    this._draft.set({ id, vaultId, template });
    return id;
  }

  /** `undefined` if there's no pending draft, or it belongs to a different id. */
  get(id: string): ItemDraft | undefined {
    const draft = this._draft();
    return draft && draft.id === id ? draft : undefined;
  }

  clear(): void {
    this._draft.set(null);
  }
}
