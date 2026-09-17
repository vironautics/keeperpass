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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { TranslatePipe } from '../../../core/i18n';
import { maxLength, singleLineValidator } from '../../../core/validation';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { VaultStore } from '../../../core/vault/vault.store';

/**
 * "New Vault": just a name. Unlike an item, a vault has nothing else to
 * choose up front — organizing its contents happens afterwards.
 */
@Component({
  selector: 'app-create-vault-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, HlmButton, HlmDialogImports, HlmFieldImports, HlmInput, TranslatePipe],
  templateUrl: './create-vault-dialog.html',
  /** The dialog lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class CreateVaultDialog {
  /** Two-way, so the dialog can report itself closed. */
  readonly open = model(false);

  protected readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, maxLength('vaultName'), singleLineValidator()],
  });

  private readonly store = inject(VaultStore);
  private readonly vaultSync = inject(VaultSyncService);

  private readonly nameValue = toSignal(this.nameControl.valueChanges, {
    initialValue: this.nameControl.value,
  });
  private readonly nameStatus = toSignal(this.nameControl.statusChanges, {
    initialValue: this.nameControl.status,
  });

  /** Two vaults with one name is legal in the data but unusable in the sidebar. */
  protected readonly nameIsDuplicate = computed(() => {
    const trimmed = this.nameValue().trim();
    return !!trimmed && this.store.vaults().some((vault) => vault.name === trimmed);
  });

  protected readonly canCreate = computed(
    () =>
      this.nameStatus() === 'VALID' &&
      this.nameValue().trim().length > 0 &&
      !this.nameIsDuplicate(),
  );

  constructor() {
    // Each opening starts fresh.
    effect(() => {
      if (!this.open()) {
        return;
      }
      untracked(() => this.nameControl.setValue(''));
    });
  }

  protected cancel(): void {
    this.open.set(false);
  }

  protected create(): void {
    if (!this.canCreate()) {
      return;
    }

    this.store.createVault(this.nameControl.value.trim());
    this.open.set(false);
    void this.vaultSync.syncNow();
  }
}
