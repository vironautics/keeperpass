import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { Vault } from '../../core/models';
import { RecentItemsService } from '../../core/recent/recent-items.service';
import { VaultStore } from '../../core/vault/vault.store';
import { CreateVaultDialog } from '../../features/items/create-vault-dialog/create-vault-dialog';
import { Icon } from '../../ui/icon/icon';

/**
 * "Vaults & Items" — the sidebar's primary group: the three saved filters, then a
 * collapsible list per vault owner (own vaults, then each organisation), then tags.
 *
 * Nothing here holds selection state of its own: every destination is a link with
 * query parameters and `routerLinkActive` decides what is highlighted, so the URL
 * alone describes what is on screen.
 */
@Component({
  selector: 'app-nav-vaults',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmSidebarImports,
    HlmCollapsibleImports,
    Icon,
    RouterLink,
    RouterLinkActive,
    CreateVaultDialog,
  ],
  templateUrl: './nav-vaults.html',
})
export class NavVaults {
  private readonly store = inject(VaultStore);
  private readonly recentItems = inject(RecentItemsService);

  protected readonly ownVaults = this.store.ownVaults;
  protected readonly organizations = this.store.organizations;
  protected readonly tags = this.store.tags;
  protected readonly counts = this.store.counts;

  /** Whether the "New Vault" dialog is showing. */
  protected readonly creatingVault = signal(false);

  /**
   * How many of the ids in `RecentItemsService` still point at a real item — a
   * deleted item's id can briefly linger between `deleteItem()` and its `forget()`
   * call, and this keeps the badge honest either way.
   */
  protected readonly recentCount = computed(() => {
    const ids = new Set(this.recentItems.ids());
    return this.store.items().filter((item) => ids.has(item.id)).length;
  });

  /** Ids of the collapsible sections currently expanded. */
  private readonly expanded = signal<ReadonlySet<string>>(new Set(['vaults', 'tags']));

  /** `routerLinkActive` needs an exact query-param match to tell the filters apart. */
  protected readonly exactMatch = {
    queryParams: 'exact',
    paths: 'exact',
    matrixParams: 'ignored',
    fragment: 'ignored',
  } as const;

  protected isExpanded(sectionId: string): boolean {
    return this.expanded().has(sectionId);
  }

  protected setExpanded(sectionId: string, expanded: boolean): void {
    this.expanded.update((current) => {
      const next = new Set(current);
      if (expanded) {
        next.add(sectionId);
      } else {
        next.delete(sectionId);
      }
      return next;
    });
  }

  /** Section id for an organisation's list of vaults. */
  protected vaultsSectionId(organizationId: string): string {
    return `org-vaults-${organizationId}`;
  }

  protected vaultsOf(organizationId: string): Vault[] {
    return this.store.vaults().filter((vault) => vault.organizationId === organizationId);
  }

  protected itemCount(vaultId: string): number {
    return this.store.itemsInVault(vaultId).length;
  }

  protected createVault(): void {
    this.creatingVault.set(true);
  }
}
