import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AccountStore } from '../../../core/account/account.store';
import { AuthService } from '../../../core/auth/auth.service';
import { SessionStore } from '../../../core/auth/session.store';
import { StartPage } from './start-page';

class FakeAuthService {
  result: Awaited<ReturnType<AuthService['signInWithGoogle']>> | null = null;
  error: Error | null = null;
  callCount = 0;

  async signInWithGoogle() {
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
    auth.result = { email: 'known@example.com', name: 'Known User', accessToken: 'the-access-token' };

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
    auth.result = { email: 'new@example.com', name: 'New User', accessToken: 'the-access-token' };
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await click();

    expect(alertText()).not.toContain('Service unreachable.');
  });
});
