import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { TranslatePipe } from '../../../core/i18n';
import { Icon } from '../../../ui/icon/icon';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog';

/** Entry point for rotating the master password. */
@Component({
  selector: 'app-master-password-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChangePasswordDialog, TranslatePipe, Icon, HlmButton, HlmCardImports],
  templateUrl: './master-password-section.html',
  host: { class: 'block' },
})
export class MasterPasswordSection {
  protected readonly changing = signal(false);

  protected startChange(): void {
    this.changing.set(true);
  }
}
