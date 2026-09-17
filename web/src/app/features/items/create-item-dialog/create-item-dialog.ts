import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { TranslatePipe } from '../../../core/i18n';
import { DEFAULT_ITEM_TEMPLATE, ITEM_TEMPLATES, ItemTemplate } from '../../../core/models';
import { ItemDraftStore } from '../../../core/vault/item-draft.store';
import { VaultStore } from '../../../core/vault/vault.store';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';

/**
 * "New Vault Item": choose a vault and the kind of item to add.
 *
 * The template decides which fields the new item starts with, which is why it is
 * chosen here rather than after the fact. Naming and filling in the item happen
 * next, in the item view.
 */
@Component({
  selector: 'app-create-item-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButton,
    HlmDialogImports,
    HlmFieldImports,
    HlmSelectImports,
    Icon,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './create-item-dialog.html',
  /** The dialog itself lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class CreateItemDialog {
  /** Two-way, so the dialog can report itself closed. */
  readonly open = model(false);

  protected readonly templates = ITEM_TEMPLATES;

  protected readonly vaultControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private readonly store = inject(VaultStore);
  private readonly router = inject(Router);
  private readonly draftStore = inject(ItemDraftStore);

  private readonly selectedTemplate = signal<ItemTemplate>(DEFAULT_ITEM_TEMPLATE);
  private readonly vaultId = toSignal(this.vaultControl.valueChanges, {
    initialValue: this.vaultControl.value,
  });

  protected readonly vaultOptions = computed(() =>
    this.store.vaults().map((vault) => ({
      value: vault.id,
      label: this.store.labelForVault(vault.id),
    })),
  );

  protected readonly canCreate = computed(() => !!this.vaultId());

  /**
   * The trigger stringifies the *value*, and the option elements only exist while
   * the dropdown is open — so without this a closed trigger shows a raw vault id
   * instead of the vault's name.
   */
  protected readonly vaultOptionLabel = (vaultId: string): string =>
    this.store.labelForVault(vaultId);

  constructor() {
    // Each opening starts fresh, defaulted to the user's own vault.
    effect(() => {
      if (!this.open()) {
        return;
      }
      untracked(() => this.reset());
    });
  }

  /** The glyph standing for a template, straight from the model. */
  protected glyphFor(template: ItemTemplate): IconName {
    return template.icon;
  }

  protected isSelected(template: ItemTemplate): boolean {
    return this.selectedTemplate().id === template.id;
  }

  protected selectTemplate(template: ItemTemplate): void {
    this.selectedTemplate.set(template);
  }

  protected cancel(): void {
    this.open.set(false);
  }

  /**
   * Starts a draft and jumps straight into naming/filling it in — nothing
   * reaches `VaultStore` (or Drive) until that step's own Save. Cancelling
   * from there, or navigating away, just leaves the draft unsaved.
   */
  protected async create(): Promise<void> {
    const vaultId = this.vaultId();

    if (!vaultId) {
      return;
    }

    const id = this.draftStore.start(vaultId, this.selectedTemplate());

    this.open.set(false);
    await this.router.navigate(['/items', id], { queryParams: { edit: true, new: true } });
  }

  private reset(): void {
    this.vaultControl.setValue(this.store.personalVault()?.id ?? this.store.vaults()[0]?.id ?? '');
    this.selectedTemplate.set(DEFAULT_ITEM_TEMPLATE);
  }
}
