import { computed, Injectable, signal } from '@angular/core';
import { Account } from '../models';

/** Nothing is known yet — not fake data, an honest "not signed in" placeholder until a real Google profile lands. */
function emptyAccount(): Account {
  return { id: '', email: '', name: '', createdAt: new Date(0) };
}

/**
 * The signed-in account.
 *
 * Starts empty. Populated exclusively from real Google data: `StartPage`
 * calls `updateProfile()` with the result of the OAuth popup
 * (`AuthService.signInWithGoogle()`), and `UnlockPage` does the same with
 * `AuthService.fetchProfile()` on every mount, so a session restored from a
 * persisted access token after a page refresh (which skips `/start`
 * entirely — see `SessionStore`) still ends up with the real profile before
 * anything downstream (`/recover`'s "Logged In As" field, the settings
 * Profile section, …) reads it.
 */
@Injectable({ providedIn: 'root' })
export class AccountStore {
  private readonly _account = signal<Account>(emptyAccount());

  readonly account = this._account.asReadonly();

  readonly email = computed(() => this._account().email);
  readonly name = computed(() => this._account().name);

  /** Falls back to the address, which every account has. */
  readonly displayName = computed(() => this._account().name || this._account().email);

  updateProfile(profile: { name: string; email: string }): void {
    this._account.update((account) => ({ ...account, ...profile }));
  }
}
