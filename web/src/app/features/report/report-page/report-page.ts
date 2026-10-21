import { ChangeDetectionStrategy, Component, computed, DOCUMENT, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCircleCheck,
  lucideInfo,
  lucideRepeat2,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideShieldX,
  lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { AuditService } from '../../../core/audit/audit.service';
import { I18nService, TranslatePipe, TranslationKey } from '../../../core/i18n';
import {
  AUDIT_DESCRIPTION_KEYS,
  AUDIT_LABEL_KEYS,
  AuditType,
  FieldType,
  VaultItem,
} from '../../../core/models';
import { VaultStore } from '../../../core/vault/vault.store';
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

/** Lucide glyph per finding, registered with `provideIcons` below. */
const AUDIT_GLYPHS: Record<AuditType, string> = {
  [AuditType.WeakPassword]: 'lucideShieldAlert',
  [AuditType.ReusedPassword]: 'lucideRepeat2',
  [AuditType.CompromisedPassword]: 'lucideShieldX',
};

/** What a section says when it has nothing in it — specific beats a generic "nothing found". */
const AUDIT_EMPTY_KEYS: Record<AuditType, TranslationKey> = {
  [AuditType.WeakPassword]: 'audit.weakPassword.empty',
  [AuditType.ReusedPassword]: 'audit.reusedPassword.empty',
  [AuditType.CompromisedPassword]: 'audit.compromisedPassword.empty',
};

/**
 * Score bands for the health meter. The fill carries severity — accent, then amber,
 * then the danger red — and the label beside it says the same thing in words, so the
 * state never rests on colour alone.
 */
type HealthTone = 'good' | 'fair' | 'poor';
const HEALTH_GOOD_FROM = 90;
const HEALTH_FAIR_FROM = 60;

interface AuditSectionItem {
  item: VaultItem;
  vaultLabel: string;
}

interface AuditSection {
  type: AuditType;
  anchor: string;
  icon: string;
  title: string;
  description: string;
  empty: string;
  items: readonly AuditSectionItem[];
}

/**
 * Security Report — a health score, one tile per kind of finding, then one card per
 * kind listing the items, over the audit results this session has computed (they
 * live in `AuditService`, not in the vault).
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
    NgIcon,
    ItemRow,
    HlmButton,
    HlmPopoverImports,
    HlmSidebarTrigger,
    TranslatePipe,
  ],
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideCircleCheck,
      lucideInfo,
      lucideRepeat2,
      lucideShieldAlert,
      lucideShieldCheck,
      lucideShieldX,
      lucideTriangleAlert,
    }),
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
  private readonly document = inject(DOCUMENT);

  protected readonly sections = computed<AuditSection[]>(() =>
    AUDIT_ORDER.map((type) => ({
      type,
      anchor: `report-${type}`,
      icon: AUDIT_GLYPHS[type],
      title: this.i18n.translate(AUDIT_LABEL_KEYS[type]),
      description: this.i18n.translate(AUDIT_DESCRIPTION_KEYS[type]),
      empty: this.i18n.translate(AUDIT_EMPTY_KEYS[type]),
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

  /** The audit only looks at passwords, so only items that hold one count towards the score. */
  protected readonly checkedItemCount = computed(
    () =>
      this.store.items().filter((item) => item.fields.some((f) => f.type === FieldType.Password))
        .length,
  );

  /** Share of checked items with no finding, as a whole percentage; `null` with nothing to check. */
  protected readonly healthScore = computed(() => {
    const checked = this.checkedItemCount();
    if (!checked) {
      return null;
    }
    const healthy = Math.max(0, checked - this.flaggedItemCount());
    return Math.round((healthy / checked) * 100);
  });

  protected readonly healthTone = computed<HealthTone>(() => {
    const score = this.healthScore() ?? 100;
    if (score >= HEALTH_GOOD_FROM) {
      return 'good';
    }
    return score >= HEALTH_FAIR_FROM ? 'fair' : 'poor';
  });

  protected readonly healthLabels = {
    good: 'report.healthGood',
    fair: 'report.healthFair',
    poor: 'report.healthPoor',
  } as const satisfies Record<HealthTone, TranslationKey>;

  protected visibleItems(section: AuditSection): readonly AuditSectionItem[] {
    return section.items.slice(0, MAX_VISIBLE_PER_SECTION);
  }

  protected isFavourite(itemId: string): boolean {
    return this.store.isFavourite(itemId);
  }

  protected openItem(itemId: string): void {
    void this.router.navigate(['/items', itemId]);
  }

  /** The stat tiles jump to their card; a fragment link would go through the router. */
  protected scrollTo(anchor: string): void {
    this.document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
