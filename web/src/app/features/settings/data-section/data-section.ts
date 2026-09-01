import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { TranslatePipe } from '../../../core/i18n';
import { IMPORT_ACCEPT } from '../../../core/import-export';
import { VaultStore } from '../../../core/vault/vault.store';
import { Icon } from '../../../ui/icon/icon';
import { formatDateTime } from '../../items/format-date';
import { ExportDialog } from '../export-dialog/export-dialog';
import { ImportDialog } from '../import-dialog/import-dialog';

/** Getting data in and out of the vaults. */
@Component({
  selector: 'app-data-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ExportDialog,
    ImportDialog,
    Icon,
    TranslatePipe,
    HlmBadge,
    HlmButton,
    HlmCardImports,
    HlmItemImports,
  ],
  templateUrl: './data-section.html',
  host: { class: 'block' },
})
export class DataSection {
  protected readonly acceptedFiles = IMPORT_ACCEPT;

  protected readonly importing = signal(false);
  protected readonly exporting = signal(false);
  protected readonly chosenFile = signal<File | null>(null);

  private readonly filePicker = viewChild.required<ElementRef<HTMLInputElement>>('filePicker');

  private readonly store = inject(VaultStore);

  /**
   * The recorded exports, newest first, formatted for display.
   *
   * `key` rather than a date object for `track`: two exports in the same second would
   * otherwise collide, and the timestamp alone is not guaranteed unique.
   */
  protected readonly exports = computed(() =>
    this.store.exportHistory().map((record, index) => ({
      key: `${index}-${record.fileName}`,
      when: record.at instanceof Date ? formatDateTime(record.at) : String(record.at),
      scope: record.scope,
      itemCount: record.itemCount,
      format: record.format,
    })),
  );

  protected chooseFile(): void {
    this.filePicker().nativeElement.click();
  }

  protected onFileChosen(event: Event): void {
    const picker = event.target as HTMLInputElement;
    const file = picker.files?.[0] ?? null;

    // Cleared so that picking the same file twice still fires a change.
    picker.value = '';

    if (file) {
      this.chosenFile.set(file);
      this.importing.set(true);
    }
  }

  protected startExport(): void {
    this.exporting.set(true);
  }
}
