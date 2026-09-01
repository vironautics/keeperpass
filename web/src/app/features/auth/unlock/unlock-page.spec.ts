import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AccountStore } from '../../../core/account/account.store';
import { AuthService } from '../../../core/auth/auth.service';
import { SessionStore } from '../../../core/auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
} from '../../../core/drive/google-drive.service';
import { encryptVault } from '../../../core/vault/vault-crypto';
import { VaultStore } from '../../../core/vault/vault.store';
import { UnlockPage } from './unlock-page';

class FakeGoogleDriveService {
  stored: string | null = null;
  loadError: Error | null = null;
  saveError: Error | null = null;
  saved: string | null = null;

  async loadVault() {
    if (this.loadError) throw this.loadError;
    return this.stored;
  }

  async saveVault(_accessToken: string, content: string) {
    if (this.saveError) throw this.saveError;
    this.saved = content;
  }
}

class FakeAuthService {
  renewError: Error | null = null;

  /** The real one renews an aged-out token; here it just hands the current one back. */
  async ensureFreshToken() {
    if (this.renewError) throw this.renewError;
    return 'the-access-token';
  }

  profile = { email: 'known@example.com', name: 'Known User' };
  fetchError: Error | null = null;

  async fetchProfile() {
    if (this.fetchError) throw this.fetchError;
    return this.profile;
  }
}

describe('UnlockPage', () => {
  let fixture: ComponentFixture<UnlockPage>;
  let router: Router;
  let session: SessionStore;
  let vault: VaultStore;
  let accounts: AccountStore;
  let drive: FakeGoogleDriveService;
  let auth: FakeAuthService;

  const element = () => fixture.nativeElement as HTMLElement;
  // Not the first `input` on the page any more — the read-only email field
  // (added alongside this) now comes before it in the DOM.
  const field = () => element().querySelector<HTMLInputElement>('#unlock-secret')!;
  const emailField = () => element().querySelector<HTMLInputElement>('#unlock-email')!;
  const button = () => element().querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const alertText = () =>
    [...element().querySelectorAll('[role="alert"]')]
      .map((node) => node.textContent?.trim())
      .join(' ');
  /** spartan's button has no state input — a spinner inside it is the loading tell. */
  const submitting = () => !!element().querySelector('hlm-spinner');

  beforeEach(async () => {
    drive = new FakeGoogleDriveService();
    auth = new FakeAuthService();

    await TestBed.configureTestingModule({
      imports: [UnlockPage],
      providers: [
        provideRouter([]),
        { provide: GoogleDriveService, useValue: drive },
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    session = TestBed.inject(SessionStore);
    vault = TestBed.inject(VaultStore);
    accounts = TestBed.inject(AccountStore);
    session.signIn('the-access-token', Date.now() + 3_600_000);
    fixture = TestBed.createComponent(UnlockPage);
    await fixture.whenStable();
  });

  const type = async (value: string) => {
    field().value = value;
    field().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const submit = async () => {
    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    // Real Argon2id doesn't resolve within a single `whenStable()` flush. Waiting on
    // one of the two *positive* ends of the round trip — vault unlocked, or an error
    // on screen — rather than on the spinner clearing, which is also its pre-submit
    // state and would pass before the work had started.
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(session.phase() === 'ready' || alertText() !== '').toBe(true);
    });
    expect(submitting()).toBe(false);
  };

  it('refreshes AccountStore with the real Google profile on mount', async () => {
    await vi.waitFor(() => {
      expect(accounts.email()).toBe('known@example.com');
      expect(accounts.name()).toBe('Known User');
    });
  });

  it('shows the connected account email, read-only, once the profile resolves', async () => {
    await vi.waitFor(() => expect(emailField().value).toBe('known@example.com'));
    expect(emailField().readOnly).toBe(true);
  });

  it('does not throw when the profile refresh fails — a stale token surfaces normally on submit instead', async () => {
    auth.fetchError = new Error('token expired');
    fixture = TestBed.createComponent(UnlockPage);

    await expect(fixture.whenStable()).resolves.not.toThrow();
  });

  it('blocks submission until a secret is entered', async () => {
    expect(button().disabled).toBe(true);
    await type('my-secret');
    expect(button().disabled).toBe(false);
  });

  it('only shows the primary color once a secret is entered', async () => {
    // spartan expresses this as the button's `variant`: `secondary` until there is
    // something to submit, `default` (the primary fill) once there is.
    const isPrimary = () => button().classList.contains('bg-primary');

    expect(isPrimary()).toBe(false);
    await type('my-secret');
    expect(isPrimary()).toBe(true);
    await type('');
    expect(isPrimary()).toBe(false);
  });

  it('creates an empty vault and saves it to Drive the first time (no file there yet)', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    drive.stored = null;

    await type('my-secret');
    await submit();

    expect(vault.items()).toEqual([]);
    expect(vault.vaults()).toEqual([
      { id: 'vault-personal', name: 'My Vault', created: expect.any(Date) },
    ]);
    expect(drive.saved).not.toBeNull();
    expect(session.phase()).toBe('ready');
    expect(navigate).toHaveBeenCalledWith(['/items']);
  });

  it('fetches and decrypts an existing vault, without re-saving it', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const snapshot = {
      vaults: [{ id: 'vault-personal', name: 'My Vault' }],
      items: [],
      organizations: [],
      favouriteIds: ['fav-1'],
    };
    drive.stored = JSON.stringify(await encryptVault('correct-secret', snapshot));

    await type('correct-secret');
    await submit();

    expect(vault.favouriteIds()).toEqual(new Set(['fav-1']));
    expect(drive.saved).toBeNull();
    expect(session.phase()).toBe('ready');
    expect(navigate).toHaveBeenCalledWith(['/items']);
  });

  it('rejects the wrong secret and stays on /unlock', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    drive.stored = JSON.stringify(
      await encryptVault('correct-secret', {
        vaults: [],
        items: [],
        organizations: [],
        favouriteIds: [],
      }),
    );

    await type('wrong-secret');
    await submit();

    expect(navigate).not.toHaveBeenCalled();
    expect(session.phase()).toBe('awaiting-secret');
    expect(alertText()).toContain('Incorrect secret');
  });

  it('surfaces a Drive failure instead of navigating', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    drive.loadError = new Error('Could not reach Google Drive. Please try again.');

    await type('my-secret');
    await submit();

    expect(navigate).not.toHaveBeenCalled();
    expect(session.phase()).toBe('awaiting-secret');
    expect(alertText()).toContain('Could not reach Google Drive');
  });

  it('disconnects instead of showing an error when the token has expired (401)', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    drive.loadError = new GoogleAuthExpiredError();

    await type('my-secret');
    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith(['/start']));

    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
    // Not the usual failure path — no "please try again" left behind.
    expect(alertText()).toBe('');
  });

  it('disconnects when the token can no longer be renewed at all — not just on a Drive 401', async () => {
    // A dead Google session throws a plain Error from renewal (GIS's
    // error_callback, or AuthService's own renewal timeout) — never a
    // GoogleAuthExpiredError, which is Drive-401-only. This must still
    // send the user to reconnect, not surface a raw error message.
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    auth.renewError = new Error('popup_failed_to_open');

    await type('my-secret');
    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith(['/start']));

    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
    expect(alertText()).toBe('');
  });

  it('navigates to /recover from "Forgot your secret?"', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const forgotButton = [...element().querySelectorAll<HTMLButtonElement>('button')].find((b) =>
      b.textContent?.includes('Forgot your secret?'),
    )!;

    forgotButton.click();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/recover']);
  });

  it('"Disconnect" (beside the email field) signs out and returns to /start, abandoning this sign-in', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const disconnectButton = element().querySelector<HTMLButtonElement>(
      'button[aria-label="Disconnect"]',
    )!;

    disconnectButton.click();
    await fixture.whenStable();

    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
    expect(navigate).toHaveBeenCalledWith(['/start']);
  });
});
