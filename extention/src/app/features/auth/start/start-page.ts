import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { GoogleOAuthService } from '../../../core/auth/google-oauth.service';
import { SessionStore } from '../../../core/auth/session.store';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { Icon } from '../../../ui/icon/icon';
import { GoogleLogo } from '../../../ui/google-logo/google-logo';

/**
 * Entry point of the popup — the same screen as the web app's `/start`, so
 * the two look and read identically.
 *
 * Adapted in one place: the extension signs in through
 * `chrome.identity` (`GoogleOAuthService`) rather than the web app's
 * `AuthService`, and there is no router here — `AppComponent` swaps screens
 * on `SessionStore.phase()` instead of navigating.
 */
@Component({
  selector: 'app-start-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    GoogleLogo,
    TranslatePipe,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmSpinnerImports,
  ],
  templateUrl: './start-page.html',
})
export class StartPage {
  private readonly googleOAuth = inject(GoogleOAuthService);
  private readonly session = inject(SessionStore);
  private readonly i18n = inject(I18nService);

  /**
   * Drives the button's spinner. No success state to show — a flash of a
   * tick on a button nobody looks at again isn't worth the extra state the
   * old four-state `ButtonState` carried (see SPARTAN.md).
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
      const accessToken = await this.googleOAuth.signIn();
      await this.googleOAuth.verifyToken(accessToken);

      this.session.signIn(accessToken);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : this.i18n.translate('common.genericError'),
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
