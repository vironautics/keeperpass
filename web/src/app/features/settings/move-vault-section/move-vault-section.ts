import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCloudUpload } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { TranslatePipe } from '../../../core/i18n';
import { ProviderId } from '../../../core/providers/provider';
import { VaultMigrationService } from '../../../core/providers/vault-migration.service';
import { DropboxLogo } from '../../../ui/dropbox-logo/dropbox-logo';
import { GoogleLogo } from '../../../ui/google-logo/google-logo';
import { MoveVaultDialog } from '../move-vault-dialog/move-vault-dialog';

/**
 * Entry point for moving the vault to another storage provider. One button per
 * provider the vault could go to; hidden entirely when there is none (only one
 * provider is configured in this build).
 */
@Component({
  selector: 'app-move-vault-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoveVaultDialog, TranslatePipe, NgIcon, DropboxLogo, GoogleLogo, HlmButton],
  providers: [provideIcons({ lucideCloudUpload })],
  templateUrl: './move-vault-section.html',
  host: { class: 'block empty:hidden' },
})
export class MoveVaultSection {
  protected readonly targets = inject(VaultMigrationService).targets();

  protected readonly moving = signal(false);
  protected readonly targetId = signal<ProviderId | null>(null);

  protected start(id: ProviderId): void {
    this.targetId.set(id);
    this.moving.set(true);
  }
}
