import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { AccountStore } from '../../../core/account/account.store';
import { AuthService } from '../../../core/auth/auth.service';
import {
  disconnectSession,
  ensureFreshTokenOrDisconnect,
} from '../../../core/auth/disconnect-session';
import { SessionStore } from '../../../core/auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
} from '../../../core/drive/google-drive.service';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { Icon } from '../../../ui/icon/icon';

/**
 * The word the user has to type out before the delete button does anything.
 *
 * Deliberate friction: a destructive action reached by two clicks is an action
 * reached by accident, and typing it is the cheapest way to make the intent
 * explicit without a second confirmation dialog.
 */
const DELETE_CONFIRMATION = 'DELETE';

/**
 * Name and email, plus the two account-level exits: signing out and deleting.
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
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    Icon,
    HlmAlertImports,
    HlmButton,
    HlmCardImports,
    HlmDialogImports,
    HlmFieldImports,
    HlmInput,
    HlmSpinnerImports,
  ],
  templateUrl: './profile-section.html',
  host: { class: 'block' },
})
export class ProfileSection {
  /** Rendered in the confirmation prompt, so the word shown is the word compared. */
  protected readonly deleteToken = DELETE_CONFIRMATION;

  protected readonly deleteRequested = signal(false);
  protected readonly deleteConfirmation = new FormControl('', { nonNullable: true });

  /** Set while the rename is in flight, so the button cannot be pressed twice. */
  protected readonly deleting = signal(false);
  protected readonly errorMessage = signal('');

  private readonly accounts = inject(AccountStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly drive = inject(GoogleDriveService);
  private readonly i18n = inject(I18nService);

  /** Straight from the store, which `UnlockPage` keeps in step with Google. */
  protected readonly email = this.accounts.email;
  protected readonly name = this.accounts.name;

  private readonly confirmationText = toSignal(this.deleteConfirmation.valueChanges, {
    initialValue: '',
  });

  protected readonly deleteConfirmed = computed(
    () => this.confirmationText() === DELETE_CONFIRMATION,
  );

  protected logOut(): void {
    this.session.signOut();
    void this.router.navigate(['/start']);
  }

  protected confirmDelete(): void {
    this.deleteConfirmation.setValue('');
    this.errorMessage.set('');
    this.deleteRequested.set(true);
  }

  protected cancelDelete(): void {
    this.deleteRequested.set(false);
  }

  /**
   * Renames the vault file in Drive, then signs out.
   *
   * Renaming is the whole of it: the encrypted file is the user's, sitting in
   * their own Drive, so this app takes itself out of the picture rather than
   * destroying something it does not own. `GoogleDriveService.detachVault`
   * explains what that costs; the dialog tells the user where the file went and
   * that deleting it for real is theirs to do.
   *
   * A failure leaves the dialog open with the reason. Signing out on a failed
   * rename would be the worst of both worlds — the account would look deleted
   * while the app still found the vault on the next sign-in.
   */
  protected async deleteAccount(): Promise<void> {
    if (!this.deleteConfirmed() || this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.errorMessage.set('');

    const accessToken = await ensureFreshTokenOrDisconnect(this.auth, this.session, this.router);
    if (!accessToken) {
      this.deleting.set(false);
      return;
    }

    try {
      await this.drive.detachVault(accessToken);

      // Said on the way out, because the settings page is about to disappear:
      // the toaster lives on the root component, so it survives the navigation.
      toast.success(this.i18n.translate('settings.profile.deleteDone'), {
        description: this.i18n.translate('settings.profile.deleteDoneHint'),
        duration: 12_000,
      });

      this.deleteRequested.set(false);
      this.session.signOut();
      await this.router.navigate(['/start']);
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        // Nothing was renamed, and there is no token left to retry with — the
        // vault is untouched and the next sign-in will find it as it was.
        disconnectSession(this.session, this.router);
        return;
      }

      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : this.i18n.translate('settings.profile.deleteError'),
      );
    } finally {
      this.deleting.set(false);
    }
  }
}
