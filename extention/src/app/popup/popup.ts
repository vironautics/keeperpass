import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

import { VaultItem } from '../core/models/vault-item';
import { VaultStore } from '../core/vault/vault.store';
import { VaultSessionService } from '../core/vault/vault-session.service';
import { filterItems, ItemFilter } from '../core/item-filter';
import { AutoFillService } from '../core/autofill.service';
import { SessionStore } from '../core/auth/session.store';
import { SelectOption } from '../core/select-option';
import { I18nService, isAppLocale, TranslatePipe } from '../core/i18n';
import { Icon } from '../ui/icon/icon';
import { GeneratorPanel } from '../features/generator/generator-panel/generator-panel';
import { ItemIcon } from '../features/items/item-icon/item-icon';
import { ItemField } from '../features/items/item-field/item-field';
import { Logo } from '../ui/logo/logo';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    GeneratorPanel,
    Icon,
    ItemField,
    ItemIcon,
    Logo,
    TranslatePipe,
    HlmAlertImports,
    HlmBadge,
    HlmButton,
    HlmInput,
    HlmItemImports,
    HlmSelectImports,
    HlmSpinnerImports,
  ],
  templateUrl: './popup.html',
  /**
   * Without an explicit host layout, `<app-popup>` has no height of its own
   * inside `AppComponent`'s flex column, so the `min-h-0`/`overflow-y-auto`
   * region further down the template has nothing bounded to scroll inside —
   * it just grows to fit its content instead (same root cause as the
   * min-height chain bug documented in ngkeeperspartan's SPARTAN.md).
   */
  host: { class: 'flex min-h-0 w-full flex-1 flex-col' },
})
export class PopupComponent {
  private readonly store = inject(VaultStore);
  private readonly autoFillService = inject(AutoFillService);
  private readonly vaultSession = inject(VaultSessionService);
  private readonly session = inject(SessionStore);
  private readonly i18n = inject(I18nService);

  /** Manual refresh — the popup otherwise reads its cached copy. */
  protected readonly syncing = this.vaultSession.syncing;
  protected readonly syncError = this.vaultSession.error;

  protected sync(): void {
    void this.vaultSession.refresh();
  }

  /** Ends the Google session — the header's counterpart to `sync`. */
  protected disconnect(): void {
    // No router in the popup: clearing the session drops `phase` back to
    // `signed-out` and `AppComponent` swaps in the start screen. Same reason
    // `UnlockPage.disconnect()` calls `signOut()` rather than
    // `disconnectSession()`, which navigates.
    this.session.signOut();
  }

  protected readonly view = signal<'list' | 'generator' | 'details'>('list');

  /** The item shown in the detail view. */
  protected readonly selectedItem = signal<VaultItem | null>(null);

  /** True while the popup re-downloads and decrypts the vault on open. */
  protected readonly loading = this.store.loading;
  protected readonly autoFillStatus = signal('');

  /**
   * Newest first by default, which is what you want right after adding
   * something — same toggle and default as the web app's item list.
   */
  protected readonly newestFirst = signal(true);

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly tagControl = new FormControl('', { nonNullable: true });
  protected readonly vaultControl = new FormControl('', { nonNullable: true });

  protected readonly localeOptions = this.i18n.options;
  protected readonly localeControl = new FormControl<string>(this.i18n.locale(), {
    nonNullable: true,
  });

  private readonly searchValue = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value,
  });
  private readonly tagValue = toSignal(this.tagControl.valueChanges, {
    initialValue: this.tagControl.value,
  });
  private readonly vaultValue = toSignal(this.vaultControl.valueChanges, {
    initialValue: this.vaultControl.value,
  });

  protected readonly filter = computed<ItemFilter>(() => ({
    search: this.searchValue(),
    tag: this.tagValue() || undefined,
    vaultId: this.vaultValue() || undefined,
  }));

  protected readonly items = this.store.items;

  protected readonly tags = computed(() => {
    const tagMap = new Map<string, number>();
    for (const item of this.items()) {
      for (const tag of item.tags) {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      }
    }
    return [...tagMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

  protected readonly tagOptions = computed<SelectOption[]>(() => [
    { label: this.i18n.translate('popup.allTags'), value: '' },
    ...this.tags().map((tag) => ({ label: `${tag.name} (${tag.count})`, value: tag.name })),
  ]);

  protected readonly vaultOptions = computed<SelectOption[]>(() => [
    { label: this.i18n.translate('popup.allVaults'), value: '' },
    ...this.store.vaults().map((vault) => ({
      label: this.store.labelForVault(vault.id),
      value: vault.id,
    })),
  ]);

  protected vaultLabelFor(item: VaultItem): string {
    return this.store.labelForVault(item.vaultId);
  }

  /**
   * `hlm-select`'s trigger stringifies the *value*, and its options only
   * exist while the panel is open — so a closed trigger would otherwise show
   * the raw id/code rather than the picked option's label. Same adapter
   * shape as `GeneratorPanel`'s `separatorLabel`/`languageLabel`.
   */
  protected readonly localeLabel = (value: string): string =>
    this.localeOptions.find((option) => option.value === value)?.label ?? value;

  protected readonly vaultOptionLabel = (value: string): string =>
    this.vaultOptions().find((option) => option.value === value)?.label ?? value;

  protected readonly tagOptionLabel = (value: string): string =>
    this.tagOptions().find((option) => option.value === value)?.label ?? value;

  protected onLocalePicked(value: unknown): void {
    if (typeof value === 'string') {
      this.localeControl.setValue(value);
    }
  }

  protected onVaultPicked(value: unknown): void {
    if (typeof value === 'string') {
      this.vaultControl.setValue(value);
    }
  }

  protected onTagPicked(value: unknown): void {
    if (typeof value === 'string') {
      this.tagControl.setValue(value);
    }
  }

  protected readonly filteredItems = computed(() =>
    filterItems(this.items(), this.filter(), { favouriteIds: new Set() }),
  );

  /** Same comparator as the web app's item list: sort by `updated`, direction from `newestFirst`. */
  protected readonly sortedItems = computed(() => {
    const direction = this.newestFirst() ? -1 : 1;
    return [...this.filteredItems()].sort(
      (a, b) => direction * (a.updated.getTime() - b.updated.getTime()),
    );
  });

  protected toggleSortOrder(): void {
    this.newestFirst.update((newest) => !newest);
  }

  constructor() {
    // Subscribed rather than mirrored into an effect: an effect would also
    // fire on init and persist the browser-detected locale, pinning the user
    // to whatever their browser reported the first time they opened the popup.
    this.localeControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((locale) => {
      if (isAppLocale(locale)) {
        this.i18n.setLocale(locale);
      }
    });
  }

  protected copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  /** Opens the item's own screen — the same detail the web app shows. */
  protected showDetails(item: VaultItem): void {
    this.selectedItem.set(item);
    this.view.set('details');
  }

  protected async fillOnPage(item: VaultItem): Promise<void> {
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      this.autoFillStatus.set(this.i18n.translate('popup.noActiveTab'));
      setTimeout(() => this.autoFillStatus.set(''), 3000);
      return;
    }

    this.autoFillStatus.set(this.i18n.translate('popup.filling'));

    try {
      const success = await this.autoFillService.autoFill(tab.id, item);

      if (success) {
        this.autoFillStatus.set(this.i18n.translate('popup.filled'));
        setTimeout(() => this.autoFillStatus.set(''), 2000);
      } else {
        this.autoFillStatus.set(this.i18n.translate('popup.noLoginForm'));
        setTimeout(() => this.autoFillStatus.set(''), 3000);
      }
    } catch (error) {
      this.autoFillStatus.set(
        error instanceof Error ? error.message : this.i18n.translate('popup.fillFailed'),
      );
      setTimeout(() => this.autoFillStatus.set(''), 3000);
    }
  }

  /**
   * Creating an item happens in the web app, not the popup: it needs the full
   * template picker, field editor and validation, none of which fit — or would
   * stay in step — in a 400px panel.
   */
  protected createNewItem(): void {
    void chrome.tabs.create({ url: environment.webAppUrl });
  }

  protected openGenerator(): void {
    this.view.set('generator');
  }

  protected backToList(): void {
    this.selectedItem.set(null);
    this.view.set('list');
  }
}
