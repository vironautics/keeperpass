import { computed, inject, Injectable, signal } from '@angular/core';
import { AuditResult, AuditType } from '../models';
import { VaultStore } from '../vault/vault.store';
import { auditItems } from './audit';

const NO_FINDINGS: readonly AuditResult[] = [];

/**
 * Runs security audits and holds their results, keyed by item id.
 *
 * Findings live here, in memory, and deliberately not on `VaultItem`: they
 * are derived data — recomputable at any time from the passwords already in
 * the vault — and the vault is a single encrypted blob that has to be
 * re-encrypted and re-uploaded in full for any change to it. Storing
 * findings there meant every audit wrote to Google Drive, so a background
 * scan triggered a save the user never asked for, and each edit of a flagged
 * item saved twice: once for the edit, once more when the audit finished.
 * Keeping them out of the vault removes that entirely, and shrinks the file.
 *
 * The cost is that findings don't survive a reload — which is why
 * `runFullAudit()` runs on every unlock. That scan is fire-and-forget: it
 * never blocks the UI, and results appear as soon as they land.
 *
 * Trigger points: a full run once after the vault is hydrated on `/unlock`,
 * and a single-item run right after that item is created, edited, or
 * restored from history.
 */
@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly store = inject(VaultStore);

  private readonly _findings = signal<ReadonlyMap<string, readonly AuditResult[]>>(new Map());

  /** Findings by item id. Empty until the first audit of the session finishes. */
  readonly findings = this._findings.asReadonly();

  /** How many items currently carry at least one finding — the menu's badge. */
  readonly flaggedCount = computed(() => {
    let count = 0;
    for (const results of this._findings().values()) {
      if (results.length) {
        count++;
      }
    }
    return count;
  });

  /** This item's findings, or an empty list if it has none (or hasn't been audited yet). */
  findingsFor(itemId: string): readonly AuditResult[] {
    return this._findings().get(itemId) ?? NO_FINDINGS;
  }

  /** Whether this item has a finding of the given type — used by the report filter. */
  hasFinding(itemId: string, type: AuditType): boolean {
    return this.findingsFor(itemId).some((result) => result.type === type);
  }

  /** Every item currently flagged with the given type, in vault order. */
  itemsWithFinding(type: AuditType) {
    return this.store.items().filter((item) => this.hasFinding(item.id, type));
  }

  /** Re-audits every item. Run once after `/unlock` hydrates the vault. */
  async runFullAudit(): Promise<void> {
    await this.runAndApply();
  }

  /**
   * Re-audits one item. Still scans every item's passwords (a
   * reused-password finding depends on all of them) but only replaces that
   * one item's entry.
   */
  async runAuditForItem(itemId: string): Promise<void> {
    await this.runAndApply({ onlyItemId: itemId });
  }

  /** Drops every finding — called on lock, so nothing outlives the session. */
  clear(): void {
    this._findings.set(new Map());
  }

  private async runAndApply(options?: { onlyItemId?: string }): Promise<void> {
    try {
      const results = await auditItems(this.store.items(), options);

      this._findings.update((current) => {
        // A full run replaces everything, so stale entries for items deleted
        // mid-scan don't linger. A single-item run patches just that item.
        const next = options?.onlyItemId ? new Map(current) : new Map();
        for (const [itemId, result] of results) {
          next.set(itemId, result.auditResults);
        }
        return next;
      });
    } catch {
      // The compromised-password check calls a real API; a network hiccup
      // shouldn't break the app. Findings simply stay as they were, and the
      // next trigger — the next edit, the next unlock — tries again.
    }
  }
}
