import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SessionStore } from '../../../core/auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
} from '../../../core/drive/google-drive.service';
import { decryptVault } from '../../../core/vault/vault-crypto';
import { VaultStore } from '../../../core/vault/vault.store';
import { SetupPage } from './setup-page';

class FakeGoogleDriveService {
  saveError: Error | null = null;
  saved: string | null = null;

  async saveVault(_accessToken: string, content: string) {
    if (this.saveError) throw this.saveError;
    this.saved = content;
  }
}

describe('SetupPage', () => {
  let fixture: ComponentFixture<SetupPage>;
  let router: Router;
  let session: SessionStore;
  let vault: VaultStore;
  let drive: FakeGoogleDriveService;

  const element = () => fixture.nativeElement as HTMLElement;
  const fields = () => [...element().querySelectorAll('input')];
  const secretField = () => fields()[0];
  const confirmField = () => fields()[1];
  const submitButton = () => element().querySelector<HTMLButtonElement>('button[type="submit"]')!;
  /**
   * The standing IMPORTANT notice is a spartan alert too, so this deliberately spans
   * every one of them: what each test cares about is that its own message is in there.
   */
  const alertText = () =>
    [...element().querySelectorAll('[role="alert"]')]
      .map((node) => node.textContent?.trim())
      .join(' ');

  /** Just the one raised by a failed submit, which is the signal that the attempt is over. */
  const errorAlert = () => element().querySelector('.submit-error');

  const generateButton = () =>
    element().querySelector<HTMLButtonElement>('button[aria-label="Generate a secret"]')!;
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

  beforeEach(async () => {
    drive = new FakeGoogleDriveService();

    await TestBed.configureTestingModule({
      imports: [SetupPage],
      providers: [provideRouter([]), { provide: GoogleDriveService, useValue: drive }],
    }).compileComponents();

    router = TestBed.inject(Router);
    session = TestBed.inject(SessionStore);
    vault = TestBed.inject(VaultStore);
    session.signIn('the-access-token', Date.now() + 3_600_000);
    fixture = TestBed.createComponent(SetupPage);
    await fixture.whenStable();
  });

  const fill = async (secret: string, confirmation: string) => {
    secretField().value = secret;
    secretField().dispatchEvent(new Event('input'));
    confirmField().value = confirmation;
    confirmField().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const submit = async () => {
    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    // Real Argon2id doesn't resolve within a single `whenStable()` flush. Waits on the
    // outcome itself — the vault reached Drive, or an error came back.
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(drive.saved ?? errorAlert()).toBeTruthy();
    });
  };

  it('blocks submission until both fields are filled', async () => {
    expect(submitButton().disabled).toBe(true);

    await fill('a-long-enough-secret', 'a-long-enough-secret');

    expect(submitButton().disabled).toBe(false);
  });

  // The whole reason the repeat exists: a typo here silently becomes the key
  // to a vault nobody can open.
  it('refuses a mismatched repeat and says so', async () => {
    await fill('a-long-enough-secret', 'a-long-enough-secrat');

    expect(submitButton().disabled).toBe(true);
    expect(alertText()).toContain('do not match');
  });

  it('warns about a weak secret but still allows it', async () => {
    await fill('password', 'password');

    expect(element().textContent).toContain('This secret is weak');
    expect(submitButton().disabled).toBe(false);
  });

  it('creates an empty vault encrypted under the chosen secret', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fill('a-long-enough-secret', 'a-long-enough-secret');

    await submit();

    expect(drive.saved).toBeTruthy();
    await expect(decryptVault('a-long-enough-secret', JSON.parse(drive.saved!))).resolves.toEqual(
      expect.objectContaining({ items: [] }),
    );
    expect(session.secret()).toBe('a-long-enough-secret');
    expect(session.phase()).toBe('ready');
    expect(vault.items()).toEqual([]);
    expect(navigate).toHaveBeenCalledWith(['/items']);
  });

  // The guards cached "no vault" to route the user here; leaving that stale
  // would bounce them straight back on the next navigation.
  it('records that a vault now exists', async () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fill('a-long-enough-secret', 'a-long-enough-secret');

    await submit();

    expect(session.hasVault()).toBe(true);
  });

  it('reports a failed save and stays put', async () => {
    drive.saveError = new Error('Drive is unavailable.');
    await fill('a-long-enough-secret', 'a-long-enough-secret');

    await submit();

    expect(alertText()).toContain('Drive is unavailable.');
    expect(session.phase()).toBe('awaiting-secret');
  });

  it('opens the generator from the secret field and fills both fields with the same suggestion', async () => {
    generateButton().click();
    await fixture.whenStable();
    expect(generatorDialog()).toBeTruthy();

    useGeneratedButton().click();
    await fixture.whenStable();

    expect(secretField().value).not.toBe('');
    expect(secretField().value).toBe(confirmField().value);
    expect(submitButton().disabled).toBe(false);
  });

  it('reveals the generated secret instead of leaving it masked', async () => {
    expect(secretField().type).toBe('password');

    generateButton().click();
    await fixture.whenStable();
    useGeneratedButton().click();
    await fixture.whenStable();

    expect(secretField().type).toBe('text');
  });

  it('disconnects when the Google token has expired', async () => {
    drive.saveError = new GoogleAuthExpiredError();
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fill('a-long-enough-secret', 'a-long-enough-secret');

    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    await vi.waitFor(() => expect(session.phase()).toBe('signed-out'));
  });
});
