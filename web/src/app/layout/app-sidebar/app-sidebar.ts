import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { Logo } from '../../ui/logo/logo';
import { NavMore } from './nav-more';
import { NavUser } from './nav-user';
import { NavVaults } from './nav-vaults';

/** Shown under the app name in the sidebar header. */
const APP_VERSION = '3.0.0';

/**
 * The application's primary navigation, built on spartan's `sidebar-inset` block.
 *
 * Projects its content next to the sidebar rather than inside it, so the caller
 * supplies the `<main hlmSidebarInset>` — that is what the block's peer selectors
 * (`peer-data-[variant=inset]`) need to see as a sibling of `<hlm-sidebar>`.
 */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSidebarImports, RouterLink, Logo, NavVaults, NavMore, NavUser],
  templateUrl: './app-sidebar.html',
  host: { class: 'block' },
})
export class AppSidebar {
  /** Raised by the footer's "Lock app" item. */
  readonly lockRequested = output<void>();

  /** Raised by the footer's "Disconnect" item. */
  readonly signOutRequested = output<void>();

  protected readonly version = APP_VERSION;
}
