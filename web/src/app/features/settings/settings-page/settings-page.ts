import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { TranslatePipe } from '../../../core/i18n';
import { Icon } from '../../../ui/icon/icon';
import { DataSection } from '../data-section/data-section';
import { LanguageSection } from '../language-section/language-section';
import { MasterPasswordSection } from '../master-password-section/master-password-section';
import { ProfileSection } from '../profile-section/profile-section';

/**
 * Everything that configures the account, on one page.
 *
 * One scrolling column of sections rather than a route per section. There are
 * four of them, they are all short, and settings is where people go when they
 * are not sure where the thing they want lives — a page you can scan beats a
 * menu you have to guess your way through. Each section owns its own state and
 * knows nothing about the others; this page only decides the order.
 */
@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataSection,
    Icon,
    LanguageSection,
    MasterPasswordSection,
    ProfileSection,
    TranslatePipe,
    HlmSidebarTrigger,
  ],
  templateUrl: './settings-page.html',
  /** Fills the shell's view area — see `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class SettingsPage {}
