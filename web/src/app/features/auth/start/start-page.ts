import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AccountStore } from '../../../core/account/account.store';
import { AuthService } from '../../../core/auth/auth.service';
import { SessionStore } from '../../../core/auth/session.store';
import { GoogleLogo } from '../../../ui/google-logo/google-logo';
import { Icon } from '../../../ui/icon/icon';

/**
 * Entry point of the app.
 *
 * Hands off to Google sign-in, stores the returned profile, and moves on to
 * the secret that unlocks the vault (`/unlock`).
 */
@Component({
  selector: 'app-start-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoogleLogo, Icon, HlmAlertImports, HlmButtonImports, HlmCardImports, HlmSpinnerImports],
  templateUrl: './start-page.html',
  /** Fills the layout's column, so the card's `max-w-*` is not measured against its own copy — see `UnlockPage`. */
  host: { class: 'block self-stretch' },
})
export class StartPage {
  private readonly auth = inject(AuthService);
  private readonly accounts = inject(AccountStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  /**
   * Drives the button's spinner and keeps a second popup out.
   *
   * There is no success state to show: on success this navigates away, and a
   * flash of a tick on a button nobody will look at again is not worth the
   * extra state the old four-state button carried.
   */
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  protected async signInWithGoogle(): Promise<void> {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    try {
      const { email, name, accessToken, expiresAt } = await this.auth.signInWithGoogle();

      this.accounts.updateProfile({ email, name });
      this.session.signIn(accessToken, expiresAt);
      await this.router.navigate(['/unlock']);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
