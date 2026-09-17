import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import {
  AUDIT_DESCRIPTION_KEYS,
  AUDIT_ICONS,
  AUDIT_LABEL_KEYS,
  AuditType,
  VaultItem,
} from '../../../core/models';
import { AuditService } from '../../../core/audit/audit.service';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { VaultStore } from '../../../core/vault/vault.store';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';
import { ItemRow } from '../../items/item-row/item-row';

/** Every row a section can show, most this page ever renders per card. */
const MAX_VISIBLE_PER_SECTION = 5;

/**
 * Weak → Reused → Compromised: fixed, and in that order because it is the order
 * the user can act in. A weak password is fixed by generating a new one; a
 * reused one needs deciding which account keeps it; a compromised one means
 * changing it at the site itself. Sorting by count instead would reshuffle the
 * page between visits and make it unlearnable.
 */
const AUDIT_ORDER: readonly AuditType[] = [
  AuditType.WeakPassword,
  AuditType.ReusedPassword,
  AuditType.CompromisedPassword,
];

interface AuditSectionItem {
  item: VaultItem;
  vaultLabel: string;
}

interface AuditSection {
  type: AuditType;
  icon: IconName;
  title: string;
  description: string;
  items: readonly AuditSectionItem[];
}

/**
 * Security Report — one card per kind of finding, over the audit results this
 * session has computed (they live in `AuditService`, not in the vault).
 *
 * This page reads and never scans. Opening a report should not start work, and a
 * page that audited on mount would either block on the network or redraw itself
 * underneath the person reading it; `AuditService` decides when a scan happens
 * and this renders whatever it has. The cost is that the report is empty for the
 * moment after an unlock, until the first scan lands.
 */
@Component({
  selector: 'app-report-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Icon,
    ItemRow,
    HlmAlertImports,
    HlmBadge,
    HlmButton,
    HlmCardImports,
    HlmPopoverImports,
    HlmSidebarTrigger,
    TranslatePipe,
  ],
  templateUrl: './report-page.html',
  /** Fills the shell's view area — see `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class ReportPage {
  private readonly store = inject(VaultStore);
  private readonly auditService = inject(AuditService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  protected readonly sections = computed<AuditSection[]>(() =>
    AUDIT_ORDER.map((type) => ({
      type,
      icon: AUDIT_ICONS[type],
      title: this.i18n.translate(AUDIT_LABEL_KEYS[type]),
      description: this.i18n.translate(AUDIT_DESCRIPTION_KEYS[type]),
      items: this.auditService.itemsWithFinding(type).map((item) => ({
        item,
        vaultLabel: this.store.labelForVault(item.vaultId),
      })),
    })),
  );

  protected readonly maxVisible = MAX_VISIBLE_PER_SECTION;

  /**
   * Items with at least one finding — the same number the sidebar's badge shows, and
   * deliberately not the sum of the cards.
   *
   * The cards count *findings*: one item with a weak and reused password appears in two
   * of them, so they add up to more than this. Two numbers for "how much is wrong" on
   * one screen read as a bug, so the badge here says items and matches the nav.
   */
  protected readonly flaggedItemCount = this.auditService.flaggedCount;

  protected visibleItems(section: AuditSection): readonly AuditSectionItem[] {
    return section.items.slice(0, MAX_VISIBLE_PER_SECTION);
  }

  protected isFavourite(itemId: string): boolean {
    return this.store.isFavourite(itemId);
  }

  protected openItem(itemId: string): void {
    void this.router.navigate(['/items', itemId]);
  }
}
