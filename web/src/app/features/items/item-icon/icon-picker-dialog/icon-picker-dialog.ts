import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInput } from '@spartan-ng/helm/input';
import { CatalogIcon } from '../../../../ui/icon/icon-catalog';
import { searchIconCatalog } from '../../../../ui/icon/icon-catalog-search';
import { Icon } from '../../../../ui/icon/icon';

/**
 * Lets the user replace an item's icon with any icon from the full Font
 * Awesome catalogue, searched the same way fontawesome.com searches its own
 * icons — by name, label, or alias ("padlock" finds `lock`).
 *
 * Returns a raw code point via `picked`, not an `IconName` — see the note on
 * `VaultItem.iconGlyph` for why this catalogue is a separate vocabulary from
 * the app's own curated icon set.
 */
@Component({
  selector: 'app-icon-picker-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmDialogImports, HlmInput, Icon],
  templateUrl: './icon-picker-dialog.html',
  /** The dialog itself lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class IconPickerDialog {
  /** Two-way, so the dialog can report itself closed. */
  readonly open = model(false);

  /** The icon the user chose, or `undefined` for "use the default icon". */
  readonly picked = output<string | undefined>();

  protected readonly search = signal('');
  protected readonly results = computed(() => searchIconCatalog(this.search()));

  private readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    // Each opening starts from a blank search, focused and ready to type.
    effect(() => {
      if (!this.open()) {
        return;
      }
      untracked(() => {
        this.search.set('');
        queueMicrotask(() => this.searchInputRef()?.nativeElement.focus());
      });
    });
  }

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  protected select(icon: CatalogIcon): void {
    this.picked.emit(icon.unicode);
    this.open.set(false);
  }

  protected useDefault(): void {
    this.picked.emit(undefined);
    this.open.set(false);
  }

  protected cancel(): void {
    this.open.set(false);
  }
}
