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
import { TagInfo } from '../../../core/models';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { VaultStore } from '../../../core/vault/vault.store';
import { formatDate } from '../../items/format-date';
import { Icon } from '../../../ui/icon/icon';

/**
 * Tag management — reachable from the sidebar's "Tags" section via its gear
 * icon (`nav-vaults`), not from `/settings`. Tags have no detail view of their
 * own here (nothing to drill into beyond a name and a count), so every row
 * exposes its actions inline instead of navigating anywhere.
 *
 * Deleting or renaming a tag is a `VaultStore` operation that rewrites every
 * affected item's `tags[]`, not just this page's own list — see
 * `VaultStore.renameTag()`/`deleteTags()`. There is deliberately no way to
 * end up with a tag name on an item that isn't reflected here, or vice
 * versa.
 */
@Component({
  selector: 'app-tags-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
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
  templateUrl: './tags-page.html',
  /** Fills the shell's view area — see `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class TagsPage {
  private readonly store = inject(VaultStore);
  private readonly vaultSync = inject(VaultSyncService);

  protected readonly tags = this.store.tags;
  protected readonly isEmpty = computed(() => this.tags().length === 0);

  private readonly tagNames = computed(() => new Set(this.tags().map((tag) => tag.name)));

  /**
   * "since 20 Aug 2026", or nothing at all.
   *
   * A tag registered before the registry stored dates falls back to the earliest item
   * carrying it (see `VaultStore.tags`), and one with neither says nothing rather than
   * inventing a date.
   */
  protected createdLabel(tag: TagInfo): string {
    return tag.created ? `since ${formatDate(tag.created)}` : '';
  }

  // --- Bulk selection --------------------------------------------------

  /** Whether rows show checkboxes instead of their rename/delete buttons. */
  protected readonly selecting = signal(false);

  private readonly selectedNames = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedCount = computed(() => this.selectedNames().size);

  protected isSelected(tag: TagInfo): boolean {
    return this.selectedNames().has(tag.name);
  }

  protected startSelecting(): void {
    this.selecting.set(true);
  }

  protected cancelSelecting(): void {
    this.selecting.set(false);
    this.selectedNames.set(new Set());
  }

  protected toggleSelection(tag: TagInfo): void {
    this.selectedNames.update((current) => {
      const next = new Set(current);
      if (!next.delete(tag.name)) {
        next.add(tag.name);
      }
      return next;
    });
  }

  /** Select everything currently listed, or clear if all are already selected. */
  protected toggleSelectAll(): void {
    const listed = this.tags();
    const allSelected = listed.length > 0 && this.selectedCount() === listed.length;

    this.selectedNames.set(allSelected ? new Set() : new Set(listed.map((tag) => tag.name)));
  }

  // --- Add tag -----------------------------------------------------------

  protected readonly addingTag = signal(false);

  protected readonly newTagControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, maxLength('tagName'), singleLineValidator()],
  });

  private readonly newTagValue = toSignal(this.newTagControl.valueChanges, {
    initialValue: this.newTagControl.value,
  });
  private readonly newTagStatus = toSignal(this.newTagControl.statusChanges, {
    initialValue: this.newTagControl.status,
  });

  protected readonly newTagIsDuplicate = computed(() => {
    const trimmed = this.newTagValue().trim();
    return !!trimmed && this.tagNames().has(trimmed);
  });

  protected readonly canAddTag = computed(
    () =>
      this.newTagStatus() === 'VALID' &&
      this.newTagValue().trim().length > 0 &&
      !this.newTagIsDuplicate(),
  );

  protected startAddingTag(): void {
    this.newTagControl.setValue('');
    this.addingTag.set(true);
  }

  protected cancelAddTag(): void {
    this.addingTag.set(false);
  }

  protected confirmAddTag(): void {
    if (!this.canAddTag()) {
      return;
    }

    this.store.createTag(this.newTagControl.value.trim());
    void this.vaultSync.syncNow();
    this.addingTag.set(false);
  }

  // --- Rename tag ----------------------------------------------------------

  /** The tag being renamed, or `null` while the dialog is closed. */
  protected readonly renamingTag = signal<TagInfo | null>(null);

  protected readonly renameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, maxLength('tagName'), singleLineValidator()],
  });

  private readonly renameValue = toSignal(this.renameControl.valueChanges, {
    initialValue: this.renameControl.value,
  });
  private readonly renameStatus = toSignal(this.renameControl.statusChanges, {
    initialValue: this.renameControl.status,
  });

  protected readonly renameIsDuplicate = computed(() => {
    const trimmed = this.renameValue().trim();
    const current = this.renamingTag();
    return !!trimmed && trimmed !== current?.name && this.tagNames().has(trimmed);
  });

  protected readonly canRename = computed(
    () =>
      this.renameStatus() === 'VALID' &&
      this.renameValue().trim().length > 0 &&
      !this.renameIsDuplicate(),
  );

  protected startRenaming(tag: TagInfo): void {
    this.renameControl.setValue(tag.name);
    this.renamingTag.set(tag);
  }

  protected cancelRename(): void {
    this.renamingTag.set(null);
  }

  protected confirmRename(): void {
    const tag = this.renamingTag();
    if (!tag || !this.canRename()) {
      return;
    }

    this.store.renameTag(tag.name, this.renameControl.value.trim());
    void this.vaultSync.syncNow();
    this.renamingTag.set(null);
  }

  // --- Delete one tag --------------------------------------------------

  /** The tag pending delete confirmation, or `null` while the dialog is closed. */
  protected readonly deletingTag = signal<TagInfo | null>(null);

  protected requestDelete(tag: TagInfo): void {
    this.deletingTag.set(tag);
  }

  protected cancelDelete(): void {
    this.deletingTag.set(null);
  }

  protected confirmDelete(): void {
    const tag = this.deletingTag();
    if (!tag) {
      return;
    }

    this.store.deleteTag(tag.name);
    void this.vaultSync.syncNow();
    this.deletingTag.set(null);
  }

  // --- Bulk delete ---------------------------------------------------------

  protected readonly bulkDeleteRequested = signal(false);

  protected requestBulkDelete(): void {
    if (!this.selectedCount()) {
      return;
    }
    this.bulkDeleteRequested.set(true);
  }

  protected cancelBulkDelete(): void {
    this.bulkDeleteRequested.set(false);
  }

  protected confirmBulkDelete(): void {
    if (!this.selectedCount()) {
      return;
    }

    this.store.deleteTags([...this.selectedNames()]);
    void this.vaultSync.syncNow();
    this.bulkDeleteRequested.set(false);
    this.cancelSelecting();
  }
}
