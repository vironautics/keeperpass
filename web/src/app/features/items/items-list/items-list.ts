import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import {
  AUDIT_EMPTY_MESSAGE_KEYS,
  AUDIT_ICONS,
  AUDIT_LABEL_KEYS,
  VaultItem,
} from '../../../core/models';
import { RecentItemsService } from '../../../core/recent/recent-items.service';
import { AuditService } from '../../../core/audit/audit.service';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { VaultStore } from '../../../core/vault/vault.store';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';
import { CreateItemDialog } from '../create-item-dialog/create-item-dialog';
import { filterItems, ItemFilter, parseItemFilter } from '../item-filter';
import { ITEM_ROW_HEIGHT_ESTIMATE, ItemRow } from '../item-row/item-row';

/** Title, icon and organisation context describing the active filter. */
interface ListHeading {
  icon: IconName;
  title: string;
  context: string;
}

/** What to show in place of the list when the filter matches nothing. */
interface EmptyState {
  icon: IconName;
  message: string;
}

/** One choice in the "Move To Vault" select. */
interface VaultOption {
  value: string;
  label: string;
}

interface ItemRowModel {
  item: VaultItem;
  vaultLabel: string;
  favourite: boolean;
  flagged: boolean;
}

@Component({
  selector: 'app-items-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ScrollingModule,
    ReactiveFormsModule,
    CreateItemDialog,
    HlmAlertDialogImports,
    HlmButton,
    HlmDialogImports,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmSelectImports,
    HlmSidebarTrigger,
    HlmTooltip,
    Icon,
    ItemRow,
    TranslatePipe,
  ],
  templateUrl: './items-list.html',
  /** A column that fills the pane `ItemsPage` gives it, and never scrolls itself. */
  host: { class: 'bg-card relative flex min-h-0 flex-col' },
})
export class ItemsList {
  protected readonly searchControl = new FormControl('', { nonNullable: true });

  /** Whether the search field has replaced the title header. */
  protected readonly searching = signal(false);

  /**
   * Newest first, by `updated`.
   *
   * The default because the item you just added or edited is the one you are most
   * likely to want next — a vault sorted by name buries it wherever the alphabet
   * happens to put it.
   */
  protected readonly newestFirst = signal(true);

  /** Whether rows show checkboxes instead of navigating. */
  protected readonly selecting = signal(false);

  /** Whether the "New Vault Item" dialog is showing. */
  protected readonly creating = signal(false);

  /** Whether the "Move selected items" dialog is showing. */
  protected readonly movingItems = signal(false);

  /** Whether the "Delete selected items" confirmation is showing. */
  protected readonly deleteRequested = signal(false);

  protected readonly moveVaultControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private readonly store = inject(VaultStore);
  private readonly route = inject(ActivatedRoute);
  private readonly vaultSync = inject(VaultSyncService);
  private readonly recentItems = inject(RecentItemsService);
  private readonly auditService = inject(AuditService);
  private readonly i18n = inject(I18nService);

  private readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  private readonly queryParams = toSignal(this.route.queryParams, { initialValue: {} });
  private readonly searchTerm = toSignal(this.searchControl.valueChanges, { initialValue: '' });
  private readonly moveVaultValue = toSignal(this.moveVaultControl.valueChanges, {
    initialValue: this.moveVaultControl.value,
  });

  private readonly filter = computed<ItemFilter>(() => ({
    ...parseItemFilter(this.queryParams()),
    search: this.searchTerm(),
  }));

  private readonly matchingItems = computed(() =>
    filterItems(this.store.items(), this.filter(), {
      favouriteIds: this.store.favouriteIds(),
      recentIds: this.recentItems.ids(),
      hasFinding: (itemId, type) => this.auditService.hasFinding(itemId, type),
    }),
  );

  /**
   * Sorted after filtering, and never in place — `filterItems` hands back a view of
   * the store's own array, so sorting it directly would reorder the vault.
   */
  protected readonly items = computed(() => {
    const direction = this.newestFirst() ? -1 : 1;
    return [...this.matchingItems()].sort(
      (a, b) => direction * (a.updated.getTime() - b.updated.getTime()),
    );
  });

  /**
   * The filtered items paired with everything a row needs to render.
   *
   * Resolved here rather than by calling methods from the template: a
   * template method runs on every change-detection pass, for every row, and
   * `labelForVault` scans the vault list each time. At a few thousand items
   * that was thousands of lookups per pass. This recomputes only when the
   * items, favourites, or audit findings actually change.
   */
  protected readonly rows = computed<ItemRowModel[]>(() => {
    const favourites = this.store.favouriteIds();
    const findings = this.auditService.findings();

    return this.items().map((item) => ({
      item,
      vaultLabel: this.store.labelForVault(item.vaultId),
      favourite: favourites.has(item.id),
      flagged: (findings.get(item.id)?.length ?? 0) > 0,
    }));
  });

  protected readonly selectedCount = computed(() => this.selectedIds().size);
  protected readonly isEmpty = computed(() => this.items().length === 0);

  /**
   * Every vault, as a destination for the bulk "Move selected items" action.
   * Unlike `ItemView`'s single-item move, there's no one "current vault" to
   * exclude — the selection can span several.
   */
  protected readonly moveVaultOptions = computed<VaultOption[]>(() =>
    this.store
      .vaults()
      .map((vault) => ({ value: vault.id, label: this.store.labelForVault(vault.id) })),
  );

  protected readonly canMove = computed(() => !!this.moveVaultValue());

  /**
   * The select's trigger stringifies the *value*, and its options only exist while the
   * dropdown is open — so without this a closed trigger shows a raw vault id.
   */
  protected readonly vaultOptionLabel = (vaultId: string): string =>
    this.store.labelForVault(vaultId);

  private readonly heading = computed<ListHeading>(() => {
    const filter = this.filter();

    if (filter.favourites) {
      return { icon: 'favourite', title: this.i18n.translate('items.list.favorites'), context: '' };
    }
    if (filter.recent) {
      return { icon: 'time', title: this.i18n.translate('items.list.recentlyUsed'), context: '' };
    }
    if (filter.tag) {
      return { icon: 'tags', title: filter.tag, context: '' };
    }
    if (filter.report) {
      return {
        icon: AUDIT_ICONS[filter.report],
        title: this.i18n.translate(AUDIT_LABEL_KEYS[filter.report]),
        context: '',
      };
    }
    if (filter.vaultId) {
      const vault = this.store.vaultById(filter.vaultId);
      const organization = this.store.organizationById(vault?.organizationId);
      return {
        icon: 'vaults',
        title: vault?.name ?? this.i18n.translate('items.list.vaultFallback'),
        context: organization?.name ?? '',
      };
    }
    return { icon: 'vaults', title: this.i18n.translate('items.list.allVaults'), context: '' };
  });

  protected readonly headingIcon = computed(() => this.heading().icon);
  protected readonly headingTitle = computed(() => this.heading().title);
  protected readonly headingContext = computed(() => this.heading().context);

  private readonly emptyState = computed<EmptyState>(() => {
    const filter = this.filter();

    if (filter.search) {
      return { icon: 'search', message: this.i18n.translate('items.list.searchNoResults') };
    }
    if (filter.vaultId) {
      return { icon: 'vault', message: this.i18n.translate('items.list.vaultEmpty') };
    }
    if (filter.favourites) {
      return { icon: 'favourite', message: this.i18n.translate('items.list.noFavourites') };
    }
    if (filter.recent) {
      return { icon: 'time', message: this.i18n.translate('items.list.noRecent') };
    }
    if (filter.report) {
      return {
        icon: 'audit-clean',
        message: this.i18n.translate(AUDIT_EMPTY_MESSAGE_KEYS[filter.report]),
      };
    }
    return { icon: 'vaults', message: this.i18n.translate('items.list.noItems') };
  });

  protected readonly emptyStateIcon = computed(() => this.emptyState().icon);
  protected readonly emptyStateMessage = computed(() => this.emptyState().message);

  /**
   * Row height in px, as actually rendered.
   *
   * The viewport positions rows by multiplying this out, so a value that
   * disagrees with reality overlaps them (too small) or gaps them (too big).
   * Rather than hard-code a number that has to track the stylesheet, the
   * first real row is measured once and this is corrected — which also
   * survives a different base font size or browser zoom.
   */
  protected readonly rowHeight = signal(ITEM_ROW_HEIGHT_ESTIMATE);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    effect(() => {
      if (!this.searching()) {
        return;
      }
      untracked(() =>
        setTimeout(() => {
          const input = this.searchInput()?.nativeElement;
          input?.focus();
          input?.select();
        }),
      );
    });

    // One measurement, from a row the browser has already laid out. Runs
    // after render so it reads a settled layout rather than forcing one
    // mid-build, and stops as soon as it agrees with what's on screen.
    afterRenderEffect(() => {
      if (!this.rows().length) {
        return;
      }

      const row = (this.host.nativeElement as HTMLElement).querySelector('app-item-row');
      const measured = row?.getBoundingClientRect().height ?? 0;

      if (measured > 0 && Math.abs(measured - this.rowHeight()) >= 1) {
        this.rowHeight.set(measured);
      }
    });
  }

  protected trackRow(_index: number, row: ItemRowModel): string {
    return row.item.id;
  }

  protected isSelected(item: VaultItem): boolean {
    return this.selectedIds().has(item.id);
  }

  protected toggleSortOrder(): void {
    this.newestFirst.update((newest) => !newest);
  }

  protected startSearch(): void {
    this.searching.set(true);
  }

  protected cancelSearch(): void {
    this.searching.set(false);
    this.searchControl.setValue('');
  }

  protected createItem(): void {
    this.creating.set(true);
  }

  protected startSelecting(): void {
    this.selecting.set(true);
  }

  protected cancelSelecting(): void {
    this.selecting.set(false);
    this.selectedIds.set(new Set());
  }

  protected toggleSelection(item: VaultItem): void {
    this.selectedIds.update((current) => {
      const next = new Set(current);
      if (!next.delete(item.id)) {
        next.add(item.id);
      }
      return next;
    });
  }

  /** Select everything currently listed, or clear if all are already selected. */
  protected toggleSelectAll(): void {
    const listed = this.items();
    const allSelected = listed.length > 0 && this.selectedCount() === listed.length;

    this.selectedIds.set(allSelected ? new Set() : new Set(listed.map((item) => item.id)));
  }

  protected openMove(): void {
    if (!this.selectedCount()) {
      return;
    }
    this.moveVaultControl.setValue(this.moveVaultOptions()[0]?.value ?? '');
    this.movingItems.set(true);
  }

  protected cancelMove(): void {
    this.movingItems.set(false);
  }

  protected confirmMove(): void {
    const vaultId = this.moveVaultControl.value;
    if (!vaultId || !this.selectedCount()) {
      return;
    }

    this.store.moveItems([...this.selectedIds()], vaultId);
    void this.vaultSync.syncNow();
    this.movingItems.set(false);
    this.cancelSelecting();
  }

  protected requestDelete(): void {
    if (!this.selectedCount()) {
      return;
    }
    this.deleteRequested.set(true);
  }

  protected cancelDelete(): void {
    this.deleteRequested.set(false);
  }

  protected confirmDelete(): void {
    if (!this.selectedCount()) {
      return;
    }

    const ids = [...this.selectedIds()];
    this.store.deleteItems(ids);
    for (const id of ids) {
      this.recentItems.forget(id);
    }
    void this.vaultSync.syncNow();
    this.deleteRequested.set(false);
    this.cancelSelecting();
  }
}
