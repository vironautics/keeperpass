import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideKeyRound, lucideLockKeyhole } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { TranslatePipe } from '../../../core/i18n';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog';

/** Entry point for rotating the master password. */
@Component({
  selector: 'app-master-password-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChangePasswordDialog, TranslatePipe, NgIcon, HlmButton],
  providers: [provideIcons({ lucideKeyRound, lucideLockKeyhole })],
  templateUrl: './master-password-section.html',
  host: { class: 'block' },
})
export class MasterPasswordSection {
  protected readonly changing = signal(false);

  protected startChange(): void {
    this.changing.set(true);
  }
}
