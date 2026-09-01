import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AccountStore } from '../../../core/account/account.store';
import { SessionStore } from '../../../core/auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
} from '../../../core/drive/google-drive.service';
import { VaultStore } from '../../../core/vault/vault.store';
import { RecoverPage } from './recover-page';

class FakeGoogleDriveService {
  reset: { accessToken: string; content: string } | null = null;
  resetError: Error | null = null;

  async resetVault(accessToken: string, content: string) {
    if (this.resetError) throw this.resetError;
    this.reset = { accessToken, content };
  }
}

describe('RecoverPage', () => {
  let fixture: ComponentFixture<RecoverPage>;
  let router: Router;
  let session: SessionStore;
  let vault: VaultStore;
  let accounts: AccountStore;
  let drive: FakeGoogleDriveService;

  const host = () => fixture.nativeElement as HTMLElement;
  const emailInput = () => host().querySelector<HTMLInputElement>('input[type="email"]')!;
  const secretInput = () => host().querySelectorAll<HTMLInputElement>('input[type="password"]')[0];
  const confirmationInput = () =>
    host().querySelectorAll<HTMLInputElement>('input[type="password"]')[1];
  const submitButton = () => host().querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const backButton = () => host().querySelector<HTMLButtonElement>('.recover-back-button')!;
  /**
   * The standing IMPORTANT notice is a spartan alert too, so this deliberately spans
   * every one of them: what each test cares about is that its own message is in there.
   */
  const alertText = () =>
    [...host().querySelectorAll('[role="alert"]')].map((n) => n.textContent?.trim()).join(' ');

  /** Just the one raised by a failed submit, which is the signal that the attempt is over. */
  const errorAlert = () => host().querySelector('.submit-error');

  const generateButton = () =>
    host().querySelector<HTMLButtonElement>('button[aria-label="Generate a secret"]')!;
  /**
   * The generator renders into the CDK overlay container — a sibling of the
   * fixture's host, not a descendant — so it's looked up from `document`.
   * See "Testing a spartan surface" in SPARTAN.md.
   */
  const generatorDialog = () =>
    document.querySelector<HTMLElement>('.cdk-overlay-container [aria-label="Generate Password"]')!;
  const useGeneratedButton = () =>
    [...generatorDialog().querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => b.textContent?.trim() === 'Use this password',
    )!;

  const type = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const submit = async () => {
    host().querySelector('form')!.dispatchEvent(new Event('submit'));
    // Real Argon2id doesn't resolve within a single `whenStable()` flush. Waits on the
    // outcome itself — the vault was reset in Drive, or an error came back.
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(drive.reset ?? errorAlert()).toBeTruthy();
    });
  };

  beforeEach(async () => {
    drive = new FakeGoogleDriveService();

    await TestBed.configureTestingModule({
      imports: [RecoverPage],
      providers: [provideRouter([]), { provide: GoogleDriveService, useValue: drive }],
    }).compileComponents();

    router = TestBed.inject(Router);
    session = TestBed.inject(SessionStore);
    vault = TestBed.inject(VaultStore);
    accounts = TestBed.inject(AccountStore);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    session.signIn('the-access-token', Date.now() + 3_600_000);
    accounts.updateProfile({ email: 'known@example.com', name: 'Known User' });

    fixture = TestBed.createComponent(RecoverPage);
    await fixture.whenStable();
  });

  it('shows the signed-in account email, read-only', () => {
    expect(emailInput().value).toBe('known@example.com');
    expect(emailInput().readOnly).toBe(true);
  });

  it('stays in sync if the account email resolves after this page has already mounted', async () => {
    accounts.updateProfile({ email: 'refreshed@example.com', name: 'Known User' });
    await fixture.whenStable();

    expect(emailInput().value).toBe('refreshed@example.com');
  });

  it('keeps Recover Account disabled until both secrets are filled in and match', async () => {
    expect(submitButton().disabled).toBe(true);

    await type(secretInput(), 'new-secret');
    expect(submitButton().disabled).toBe(true);

    await type(confirmationInput(), 'different');
    expect(submitButton().disabled).toBe(true);

    await type(confirmationInput(), 'new-secret');
    expect(submitButton().disabled).toBe(false);
  });

  it('backs up the old file and creates a fresh empty vault under the new secret', async () => {
    await type(secretInput(), 'new-secret');
    await type(confirmationInput(), 'new-secret');

    await submit();

    expect(drive.reset).not.toBeNull();
    expect(drive.reset!.accessToken).toBe('the-access-token');
    expect(vault.items()).toEqual([]);
    expect(vault.vaults()).toEqual([
      { id: 'vault-personal', name: 'My Vault', created: expect.any(Date) },
    ]);
    expect(session.phase()).toBe('ready');
    expect(session.secret()).toBe('new-secret');
    expect(router.navigate).toHaveBeenCalledWith(['/items']);
  });

  it('surfaces a Drive failure instead of navigating', async () => {
    drive.resetError = new Error('Could not back up your existing vault in Google Drive.');

    await type(secretInput(), 'new-secret');
    await type(confirmationInput(), 'new-secret');

    await submit();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(alertText()).toContain('Could not back up');
  });

  it('disconnects instead of showing an error when the token has expired (401)', async () => {
    drive.resetError = new GoogleAuthExpiredError();

    await type(secretInput(), 'new-secret');
    await type(confirmationInput(), 'new-secret');

    host().querySelector('form')!.dispatchEvent(new Event('submit'));
    await vi.waitFor(() => expect(router.navigate).toHaveBeenCalledWith(['/start']), {
      timeout: 8000,
    });

    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
  });

  it('opens the generator from the secret field and fills both fields with the same suggestion', async () => {
    // Captured before generating: `secretInput`/`confirmationInput` select by
    // `input[type="password"]`, and generating reveals the value — flipping
    // the `type` attribute to `text` — so the same live query would stop
    // matching these same elements afterwards.
    const secret = secretInput();
    const confirmation = confirmationInput();

    generateButton().click();
    await fixture.whenStable();
    expect(generatorDialog()).toBeTruthy();

    useGeneratedButton().click();
    await fixture.whenStable();

    expect(secret.value).not.toBe('');
    expect(secret.value).toBe(confirmation.value);
    expect(submitButton().disabled).toBe(false);
  });

  it('reveals the generated secret instead of leaving it masked', async () => {
    const secret = secretInput();
    expect(secret.type).toBe('password');

    generateButton().click();
    await fixture.whenStable();
    useGeneratedButton().click();
    await fixture.whenStable();

    expect(secret.type).toBe('text');
  });

  it('flags a weak secret without blocking submission', async () => {
    await type(secretInput(), 'weak');
    await type(confirmationInput(), 'weak');

    // `output` is a status region by default — see the template.
    expect(host().querySelector('output')?.textContent).toContain('weak');
    expect(submitButton().disabled).toBe(false);
  });

  it('navigates back to /unlock from the back button', async () => {
    backButton().click();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/unlock']);
  });
});
