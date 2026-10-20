import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AccountStore } from '../../../core/account/account.store';
import { AuthService } from '../../../core/auth/auth.service';
import { SessionStore } from '../../../core/auth/session.store';
import { StartPage } from './start-page';

class FakeAuthService {
  /** The real one renews an aged-out token; here it just hands the current one back. */
  async ensureFreshToken() {
    return 'the-access-token';
  }

  result: Awaited<ReturnType<AuthService['signIn']>> | null = null;
  error: Error | null = null;
  callCount = 0;
  lastProvider: string | null = null;

  async signIn(providerId: string) {
    this.lastProvider = providerId;
    this.callCount++;
    if (this.error) {
      throw this.error;
    }
    return this.result!;
  }
}

describe('StartPage', () => {
  let fixture: ComponentFixture<StartPage>;
  let auth: FakeAuthService;
  let router: Router;
  let accounts: AccountStore;
  let session: SessionStore;

  const element = () => fixture.nativeElement as HTMLElement;
  const button = () => element().querySelector('button')!;
  const alertText = () =>
    [...element().querySelectorAll('[role="alert"]')]
      .map((node) => node.textContent?.trim())
      .join(' ');

  beforeEach(async () => {
    auth = new FakeAuthService();

    await TestBed.configureTestingModule({
      imports: [StartPage],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    router = TestBed.inject(Router);
    accounts = TestBed.inject(AccountStore);
    session = TestBed.inject(SessionStore);
    fixture = TestBed.createComponent(StartPage);
    await fixture.whenStable();
  });

  const click = async () => {
    button().dispatchEvent(new Event('click', { bubbles: true }));
    await fixture.whenStable();
  };

  it('stores the Google profile, opens a session with the Drive-scoped token, and moves on to the secret step', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    auth.result = {
      email: 'known@example.com',
      name: 'Known User',
      accessToken: 'the-access-token',
      expiresAt: Date.now() + 3_600_000,
    };

    await click();

    expect(auth.callCount).toBe(1);
    expect(accounts.email()).toBe('known@example.com');
    expect(accounts.name()).toBe('Known User');
    expect(session.phase()).toBe('awaiting-secret');
    expect(session.accessToken()).toBe('the-access-token');
    expect(navigate).toHaveBeenCalledWith(['/unlock']);
  });

  it('surfaces a backend failure instead of navigating', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    auth.error = new Error('Service unreachable.');

    await click();

    expect(navigate).not.toHaveBeenCalled();
    expect(session.phase()).toBe('signed-out');
    expect(alertText()).toContain('Service unreachable.');
  });

  it('clears a previous failure on a retry', async () => {
    auth.error = new Error('Service unreachable.');
    await click();
    expect(alertText()).toContain('Service unreachable.');

    auth.error = null;
    auth.result = {
      email: 'new@example.com',
      name: 'New User',
      accessToken: 'the-access-token',
      expiresAt: Date.now() + 3_600_000,
    };
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await click();

    expect(alertText()).not.toContain('Service unreachable.');
  });
});

describe('StartPage — providers', () => {
  let fixture: ComponentFixture<StartPage>;
  let auth: FakeAuthService;
  let session: SessionStore;

  const buttons = () => [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')];

  beforeEach(async () => {
    sessionStorage.clear();
    auth = new FakeAuthService();

    await TestBed.configureTestingModule({
      imports: [StartPage],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    session = TestBed.inject(SessionStore);
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(StartPage);
    await fixture.whenStable();
  });

  it('offers a button for every configured provider', () => {
    expect(buttons().map((button) => button.textContent?.trim())).toEqual([
      'Continue with Google',
      'Continue with Dropbox',
    ]);
  });

  it('signs in with the provider whose button was pressed, and remembers it on the session', async () => {
    auth.result = {
      email: 'd@example.com',
      name: 'D',
      accessToken: 'dropbox-token',
      expiresAt: Date.now() + 3_600_000,
      refreshToken: 'dropbox-refresh',
    };

    buttons()[1].dispatchEvent(new Event('click', { bubbles: true }));
    await fixture.whenStable();

    expect(auth.lastProvider).toBe('dropbox');
    expect(session.providerId()).toBe('dropbox');
    expect(session.accessToken()).toBe('dropbox-token');
    expect(session.refreshToken()).toBe('dropbox-refresh');
  });
});
