import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { csvToItemDrafts, ItemDraft, parseCsv } from '../../../core/import-export';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { VaultStore } from '../../../core/vault/vault.store';
import { Icon } from '../../../ui/icon/icon';

/** One entry in the vault picker. Local, so this dialog needs no shared option type. */
interface Option {
  value: string;
  label: string;
}

/**
 * Reads a CSV file into a vault.
 *
 * The file is parsed as soon as it is chosen so the count shown on the button is
 * what will actually be imported, rather than a guess.
 */
@Component({
  selector: 'app-import-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    HlmAlertImports,
    HlmButton,
    HlmDialogImports,
    HlmFieldImports,
    HlmSelectImports,
    TranslatePipe,
  ],
  templateUrl: './import-dialog.html',
  /** The dialog lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class ImportDialog {
  readonly open = model(false);

  /** The file chosen in the settings page, or null before one is picked. */
  readonly file = input<File | null>(null);

  protected readonly vaultControl = new FormControl('', { nonNullable: true });

  protected readonly parseError = signal('');

  protected readonly vaultLabel = (value: string): string =>
    this.vaultOptions().find((option) => option.value === value)?.label ?? value;

  private readonly store = inject(VaultStore);
  private readonly router = inject(Router);
  private readonly vaultSync = inject(VaultSyncService);
  private readonly i18n = inject(I18nService);

  private readonly drafts = signal<readonly ItemDraft[]>([]);

  private readonly selectedVault = toSignal(this.vaultControl.valueChanges, {
    initialValue: this.vaultControl.value,
  });

  protected readonly fileName = computed(() => this.file()?.name ?? '');

  protected readonly vaultOptions = computed<Option[]>(() =>
    this.store.vaults().map((vault) => ({
      value: vault.id,
      label: this.store.labelForVault(vault.id),
    })),
  );

  protected readonly previewCount = computed(() => this.drafts().length);

  protected readonly canImport = computed(
    () => this.previewCount() > 0 && !!this.selectedVault(),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      untracked(() => this.reset());
    });

    // Re-parse whenever the chosen file changes.
    effect(() => {
      const file = this.file();
      untracked(() => void this.parse(file));
    });
  }

  protected cancel(): void {
    this.open.set(false);
  }

  protected async importData(): Promise<void> {
    if (!this.canImport()) {
      return;
    }

    const vaultId = this.selectedVault();
    this.store.addItems(vaultId, this.drafts());

    this.open.set(false);
    void this.vaultSync.syncNow();
    await this.router.navigate(['/items'], { queryParams: { vault: vaultId } });
  }

  private async parse(file: File | null): Promise<void> {
    this.drafts.set([]);
    this.parseError.set('');

    if (!file) {
      return;
    }

    try {
      const drafts = csvToItemDrafts(parseCsv(await file.text()));

      if (drafts.length === 0) {
        this.parseError.set(this.i18n.translate('settings.import.noItemsFound'));
      }

      this.drafts.set(drafts);
    } catch {
      this.parseError.set(this.i18n.translate('settings.import.invalidCsv'));
    }
  }

  private reset(): void {
    this.vaultControl.setValue(this.store.personalVault()?.id ?? this.store.vaults()[0]?.id ?? '');
    this.parseError.set('');
  }
}
