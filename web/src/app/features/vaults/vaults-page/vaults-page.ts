import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { maxLength, singleLineValidator } from '../../../core/validation';
import { PERSONAL_VAULT_ID, VaultStore } from '../../../core/vault/vault.store';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { CreateVaultDialog } from '../../items/create-vault-dialog/create-vault-dialog';
import { formatDate } from '../../items/format-date';
import { Icon } from '../../../ui/icon/icon';

/**
 * Vault management — reachable from the sidebar's "My Vaults" section via its
 * gear icon. Allows renaming and deleting owned vaults. Deleting a vault moves
 * all its items to "My Vault" (the personal vault).
 */
@Component({
  selector: 'app-vaults-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CreateVaultDialog,
    Icon,
    HlmAlertDialogImports,
    HlmButton,
    HlmCheckbox,
    HlmDialogImports,
    HlmEmptyImports,
    HlmFieldImports,
    HlmInput,
    HlmItemImports,
    HlmSidebarTrigger,
    HlmTooltip,
  ],
  templateUrl: './vaults-page.html',
  /** Fills the shell's view area — see `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class VaultsPage {
  private readonly store = inject(VaultStore);
  private readonly vaultSync = inject(VaultSyncService);

  protected readonly ownVaults = this.store.ownVaults;

  /**
   * The personal vault is not listed: it cannot be renamed or deleted, so a row for it
   * would carry two disabled buttons and no purpose. The template used to filter it
   * inline, which made "is this list empty" and "what is in this list" two different
   * questions.
   */
  protected readonly renameableVaults = computed(() =>
    this.ownVaults().filter((vault) => vault.id !== PERSONAL_VAULT_ID),
  );

  protected readonly isEmpty = computed(() => this.renameableVaults().length === 0);

  /**
   * What each row shows: the name, how many items are in it, and when it was made.
   * A vault saved before `Vault.created` existed has no date, and the row says nothing
   * rather than guessing one.
   */
  protected readonly vaultRows = computed(() =>
    this.renameableVaults().map((vault) => ({
      id: vault.id,
      name: vault.name,
      itemCount: this.store.itemsInVault(vault.id).length,
      created: vault.created ? formatDate(vault.created) : '',
    })),
  );

  /** The personal vault, as a line of text under the list — see the template. */
  protected readonly personalSummary = computed(() => {
    const personal = this.store.personalVault();
    if (!personal) {
      return '';
    }
    const count = this.store.itemsInVault(personal.id).length;
    return `${personal.name} holds ${count} ${count === 1 ? 'item' : 'items'} and cannot be renamed or deleted.`;
  });

  /** Opens the shared "New Vault" dialog — the same one the sidebar's + opens. */
  protected readonly creatingVault = signal(false);

  // --- Bulk selection ------------------------------------------------

  /** Whether rows show checkboxes instead of their rename/delete buttons. */
  protected readonly selecting = signal(false);

  private readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedCount = computed(() => this.selectedIds().size);

  /** How many items the selected vaults hold between them — named in the confirmation. */
  protected readonly selectedItemCount = computed(() =>
    [...this.selectedIds()].reduce((total, id) => total + this.store.itemsInVault(id).length, 0),
  );

  protected isSelected(vaultId: string): boolean {
    return this.selectedIds().has(vaultId);
  }

  protected startSelecting(): void {
    this.selecting.set(true);
  }

  protected cancelSelecting(): void {
    this.selecting.set(false);
    this.selectedIds.set(new Set());
  }

  protected toggleSelection(vaultId: string): void {
    this.selectedIds.update((current) => {
      const next = new Set(current);
      if (!next.delete(vaultId)) {
        next.add(vaultId);
      }
      return next;
    });
  }

  /** Select everything listed, or clear if all are already selected. */
  protected toggleSelectAll(): void {
    const listed = this.renameableVaults();
    const allSelected = listed.length > 0 && this.selectedCount() === listed.length;

    this.selectedIds.set(allSelected ? new Set() : new Set(listed.map((vault) => vault.id)));
  }

  protected readonly bulkDeleteRequested = signal(false);

  protected requestBulkDelete(): void {
    if (this.selectedCount()) {
      this.bulkDeleteRequested.set(true);
    }
  }

  protected cancelBulkDelete(): void {
    this.bulkDeleteRequested.set(false);
  }

  protected confirmBulkDelete(): void {
    for (const id of this.selectedIds()) {
      this.store.deleteVault(id);
    }

    void this.vaultSync.syncNow();
    this.bulkDeleteRequested.set(false);
    this.cancelSelecting();
  }

  private readonly vaultNames = computed(
    () => new Set(this.ownVaults().map((vault) => vault.name)),
  );

  // --- Rename vault --------------------------------------------------

  protected readonly renamingVault = signal<{ id: string; name: string } | null>(null);

  protected readonly renameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, maxLength('vaultName'), singleLineValidator()],
  });

  private readonly renameValue = toSignal(this.renameControl.valueChanges, {
    initialValue: this.renameControl.value,
  });
  private readonly renameStatus = toSignal(this.renameControl.statusChanges, {
    initialValue: this.renameControl.status,
  });

  protected readonly renameIsDuplicate = computed(() => {
    const trimmed = this.renameValue().trim();
    const current = this.renamingVault();
    return !!trimmed && trimmed !== current?.name && this.vaultNames().has(trimmed);
  });

  protected readonly canRename = computed(
    () =>
      this.renameStatus() === 'VALID' &&
      this.renameValue().trim().length > 0 &&
      !this.renameIsDuplicate(),
  );

  protected startRenaming(vaultId: string, vaultName: string): void {
    this.renameControl.setValue(vaultName);
    this.renamingVault.set({ id: vaultId, name: vaultName });
  }

  protected cancelRename(): void {
    this.renamingVault.set(null);
  }

  protected confirmRename(): void {
    const vault = this.renamingVault();
    if (!vault || !this.canRename()) {
      return;
    }

    this.store.renameVault(vault.id, this.renameControl.value.trim());
    void this.vaultSync.syncNow();
    this.renamingVault.set(null);
  }

  // --- Delete vault --------------------------------------------------

  protected readonly deletingVault = signal<{ id: string; name: string } | null>(null);

  /** How many items would move to the personal vault — said before, not after. */
  protected readonly deletingCount = computed(() => {
    const vault = this.deletingVault();
    return vault ? this.store.itemsInVault(vault.id).length : 0;
  });

  protected requestDelete(vaultId: string, vaultName: string): void {
    if (vaultId === PERSONAL_VAULT_ID) {
      return;
    }
    this.deletingVault.set({ id: vaultId, name: vaultName });
  }

  protected cancelDelete(): void {
    this.deletingVault.set(null);
  }

  protected confirmDelete(): void {
    const vault = this.deletingVault();
    if (!vault) {
      return;
    }

    this.store.deleteVault(vault.id);
    void this.vaultSync.syncNow();
    this.deletingVault.set(null);
  }
}
