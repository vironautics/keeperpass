import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { CSV_FORMAT, downloadTextFile, itemsToCsv } from '../../../core/import-export';
import { VaultStore } from '../../../core/vault/vault.store';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { Icon } from '../../../ui/icon/icon';

/** One entry in the vault picker. Local, so this dialog needs no shared option type. */
interface Option {
  value: string;
  label: string;
}

/** Sentinel for "every vault", which is not a vault id. */
const ALL_VAULTS = 'all';

/**
 * Writes a plaintext CSV of the chosen vault.
 *
 * CSV is the only format on offer. An encrypted export would be a second key
 * hierarchy to get right — and a file nothing but this app could open, which is
 * the opposite of what an export is for: getting data *out*.
 */
@Component({
  selector: 'app-export-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    HlmAlertImports,
    HlmButton,
    HlmDialogImports,
    HlmFieldImports,
    HlmSelectImports,
  ],
  templateUrl: './export-dialog.html',
  /** The dialog lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class ExportDialog {
  readonly open = model(false);

  protected readonly vaultControl = new FormControl(ALL_VAULTS, { nonNullable: true });

  private readonly store = inject(VaultStore);
  private readonly vaultSync = inject(VaultSyncService);

  private readonly selectedVault = toSignal(this.vaultControl.valueChanges, {
    initialValue: this.vaultControl.value,
  });

  protected readonly vaultOptions = computed<Option[]>(() => [
    { value: ALL_VAULTS, label: 'All Vaults' },
    ...this.store.vaults().map((vault) => ({
      value: vault.id,
      label: this.store.labelForVault(vault.id),
    })),
  ]);

  /** The trigger stringifies the *value* — a vault id — so it needs a label lookup. */
  protected readonly vaultLabel = (value: string): string =>
    this.vaultOptions().find((option) => option.value === value)?.label ?? value;

  private readonly items = computed(() => {
    const vaultId = this.selectedVault();
    return vaultId === ALL_VAULTS ? this.store.items() : this.store.itemsInVault(vaultId);
  });

  protected readonly itemCount = computed(() => this.items().length);

  protected readonly canExport = computed(() => this.itemCount() > 0);

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      untracked(() => this.reset());
    });
  }

  protected cancel(): void {
    this.open.set(false);
  }

  protected exportData(): void {
    if (!this.canExport()) {
      return;
    }

    const fileName = this.fileName();
    downloadTextFile(fileName, 'text/csv;charset=utf-8', itemsToCsv(this.items()));

    /**
     * Recorded *after* the download is handed to the browser, so the list only ever
     * shows exports that actually happened. Synced straight away — a record of data
     * leaving the vault is not worth losing to a closed tab.
     */
    this.store.recordExport({
      format: CSV_FORMAT.id,
      scope: this.scopeLabel(),
      itemCount: this.itemCount(),
      fileName,
    });
    void this.vaultSync.syncNow();

    this.open.set(false);
  }

  /** What was exported, in words — "All Vaults", or the vault's own name. */
  private scopeLabel(): string {
    const vaultId = this.selectedVault();
    return vaultId === ALL_VAULTS ? 'All Vaults' : (this.store.labelForVault(vaultId) ?? 'Vault');
  }

  private fileName(): string {
    const vaultId = this.selectedVault();
    const scope =
      vaultId === ALL_VAULTS ? 'all-vaults' : (this.store.vaultById(vaultId)?.name ?? 'vault');
    const slug = scope
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `keeperpass-${slug}.csv`;
  }

  private reset(): void {
    this.vaultControl.setValue(ALL_VAULTS);
  }
}
