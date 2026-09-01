import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { AccountStore } from '../../core/account/account.store';
import { ThemePreference, ThemeService } from '../../core/theme/theme.service';
import { Icon } from '../../ui/icon/icon';
import { IconName } from '../../ui/icon/icon-glyphs';

/** Theme item icon per preference. */
const THEME_ICONS: Record<ThemePreference, IconName> = {
  auto: 'theme-auto',
  light: 'theme-light',
  dark: 'theme-dark',
};

/**
 * The sidebar footer: who is signed in, and the account-level actions that used
 * to be the legacy menu's three footer buttons (theme, lock, disconnect).
 *
 * Both destructive-ish actions are raised as outputs rather than performed here —
 * `AppShell` owns the session and the router, and it also has to close the mobile
 * sidebar on the way out.
 */
@Component({
  selector: 'app-nav-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSidebarImports, HlmAvatarImports, HlmDropdownMenuImports, Icon],
  templateUrl: './nav-user.html',
})
export class NavUser {
  /** Raised by "Lock app": forget the secret, keep the Google session. */
  readonly lockRequested = output<void>();

  /** Raised by "Disconnect": end the Google session entirely. */
  readonly signOutRequested = output<void>();

  private readonly accounts = inject(AccountStore);
  private readonly themeService = inject(ThemeService);
  private readonly sidebarService = inject(HlmSidebarService);

  protected readonly email = this.accounts.email;

  /**
   * `AccountStore` starts empty and is only filled from a real Google profile, which
   * `/start` and `/unlock` fetch but `/setup` does not — so a first-run session can
   * reach here with nothing known. Better a neutral label than a blank row.
   */
  protected readonly label = computed(() => this.accounts.displayName() || 'Signed in');

  /**
   * No avatar image: the Google profile picture is not fetched, so the fallback is
   * the only thing that ever renders. Initials come from the display name, which
   * falls back to the email address.
   */
  protected readonly initials = computed(() => {
    const source = this.accounts.displayName().trim();
    if (!source) {
      return '?';
    }
    const words = source.split(/\s+/).filter(Boolean);
    const letters = words.length > 1 ? [words[0], words[words.length - 1]] : [words[0]];
    return letters
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  });

  protected readonly themePreference = this.themeService.preference;
  protected readonly themeIcon = computed(() => THEME_ICONS[this.themeService.preference()]);

  /** On mobile the sidebar is a bottom-anchored sheet, so the menu has to open upward. */
  protected readonly menuSide = computed(() => (this.sidebarService.isMobile() ? 'top' : 'right'));

  protected nextTheme(): void {
    this.themeService.next();
  }
}
