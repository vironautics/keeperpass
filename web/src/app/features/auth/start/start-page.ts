import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AccountStore } from '../../../core/account/account.store';
import { AuthService } from '../../../core/auth/auth.service';
import { SessionStore } from '../../../core/auth/session.store';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { TranslationKey } from '../../../core/i18n/translations';
import { ProviderId } from '../../../core/providers/provider';
import { ProviderRegistry } from '../../../core/providers/provider-registry';
import { DropboxLogo } from '../../../ui/dropbox-logo/dropbox-logo';
import { GoogleLogo } from '../../../ui/google-logo/google-logo';
import { Icon } from '../../../ui/icon/icon';

/**
 * Entry point of the app.
 *
 * Hands off to the chosen provider's sign-in, stores the returned profile, and moves on to
 * the secret that unlocks the vault (`/unlock`).
 */
@Component({
  selector: 'app-start-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropboxLogo,
    GoogleLogo,
    Icon,
    TranslatePipe,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmSpinnerImports,
  ],
  templateUrl: './start-page.html',
  /** Fills the layout's column, so the card's `max-w-*` is not measured against its own copy — see `UnlockPage`. */
  host: { class: 'block self-stretch' },
})
export class StartPage {
  private readonly auth = inject(AuthService);
  private readonly accounts = inject(AccountStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  /**
   * Drives the button's spinner and keeps a second popup out.
   *
   * There is no success state to show: on success this navigates away, and a
   * flash of a tick on a button nobody will look at again is not worth the
   * extra state the old four-state button carried.
   */
  protected readonly submitting = signal(false);
  /** Which provider's button was clicked; the others stay disabled without a spinner. */
  protected readonly activeProvider = signal<ProviderId | null>(null);
  protected readonly errorMessage = signal('');

  /** The sign-in buttons: every registered provider this build is configured for. */
  protected readonly providers: readonly ProviderId[] = inject(ProviderRegistry)
    .available()
    .map((provider) => provider.auth.id);

  protected readonly labelKeys = {
    google: 'auth.start.continueWithGoogle',
    dropbox: 'auth.start.continueWithDropbox',
  } as const satisfies Record<ProviderId, TranslationKey>;

  // Nothing before `auth.signIn` awaits: a provider's popup has to open inside
  // the click, and browsers only allow that during the user gesture.
  protected async signIn(providerId: ProviderId): Promise<void> {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.activeProvider.set(providerId);
    this.errorMessage.set('');

    try {
      const { email, name, accessToken, expiresAt, refreshToken } =
        await this.auth.signIn(providerId);

      this.accounts.updateProfile({ email, name });
      this.session.signIn(accessToken, expiresAt, { providerId, refreshToken });
      await this.router.navigate(['/unlock']);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : this.i18n.translate('common.genericError'),
      );
    } finally {
      this.submitting.set(false);
      this.activeProvider.set(null);
    }
  }
}
