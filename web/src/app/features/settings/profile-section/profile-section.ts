import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideLogOut } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { AccountStore } from '../../../core/account/account.store';
import { SessionStore } from '../../../core/auth/session.store';
import { TranslatePipe } from '../../../core/i18n';

/**
 * Who is signed in, and the everyday way out: signing out. Deleting the account lives
 * apart, at the foot of the page — see `DangerZoneSection`.
 *
 * Both values are **read-only**. They belong to the Google account this session signed
 * in with, and `UnlockPage` re-reads them from Google (`AuthService.fetchProfile`) on
 * every mount — so anything typed here was overwritten at the next unlock. An editable
 * field that silently reverts is worse than no field, and this app cannot change a
 * Google account's name or address; only Google can.
 */
@Component({
  selector: 'app-profile-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, NgIcon, HlmButton],
  providers: [provideIcons({ lucideInfo, lucideLogOut })],
  templateUrl: './profile-section.html',
  host: { class: 'block' },
})
export class ProfileSection {
  private readonly accounts = inject(AccountStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  /** Straight from the store, which `UnlockPage` keeps in step with Google. */
  protected readonly email = this.accounts.email;
  protected readonly name = this.accounts.name;

  /** Up to two initials from the name, falling back to the email — the same rule as the sidebar. */
  protected readonly initials = computed(() => {
    const source = (this.name() || this.email()).trim();
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

  protected logOut(): void {
    this.session.signOut();
    void this.router.navigate(['/start']);
  }
}
