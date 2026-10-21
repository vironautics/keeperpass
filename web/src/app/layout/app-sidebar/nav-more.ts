import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucideScale, lucideSettings, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AuditService } from '../../core/audit/audit.service';
import { TranslatePipe, TranslationKey } from '../../core/i18n';

/**
 * A plain link in the sidebar's "More" group: a label, a glyph, a route.
 *
 * Two destinations are deliberately not in this list. Security Report is
 * rendered by hand in the template because it carries a live count badge, and
 * folding that into the loop would mean a badge field every other entry leaves
 * empty. The password generator sits at the end of "Vaults & Items" instead,
 * next to the things it generates passwords for.
 */
interface SidebarDestination {
  label: TranslationKey;
  /** A Lucide glyph, registered with `provideIcons` below. */
  icon: string;
  route: string;
}

const SIDEBAR_DESTINATIONS: readonly SidebarDestination[] = [
  { label: 'layout.sidebar.settings', icon: 'lucideSettings', route: '/settings' },
  { label: 'layout.sidebar.support', icon: 'lucideLifeBuoy', route: '/support' },
  { label: 'layout.sidebar.policies', icon: 'lucideScale', route: '/policies' },
];

@Component({
  selector: 'app-nav-more',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSidebarImports, NgIcon, RouterLink, RouterLinkActive, TranslatePipe],
  providers: [provideIcons({ lucideLifeBuoy, lucideScale, lucideSettings, lucideShieldCheck })],
  templateUrl: './nav-more.html',
  /** `mt-auto` on the group needs the host to participate in the content column. */
  host: { class: 'mt-auto' },
})
export class NavMore {
  private readonly auditService = inject(AuditService);

  protected readonly destinations = SIDEBAR_DESTINATIONS;

  /** How many items currently have at least one security-audit finding. */
  protected readonly flaggedCount = this.auditService.flaggedCount;
}
