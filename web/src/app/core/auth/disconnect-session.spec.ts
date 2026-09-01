import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { disconnectSession, ensureFreshTokenOrDisconnect } from './disconnect-session';
import { SessionStore } from './session.store';

class FakeAuthService {
  error: Error | null = null;

  async ensureFreshToken() {
    if (this.error) throw this.error;
    return 'the-access-token';
  }
}

describe('ensureFreshTokenOrDisconnect', () => {
  let session: SessionStore;
  let router: Router;
  let auth: FakeAuthService;

  beforeEach(() => {
    auth = new FakeAuthService();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    });

    session = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    session.signIn('the-access-token', Date.now() + 3_600_000);
  });

  it('returns the token without touching the session when renewal succeeds', async () => {
    const token = await ensureFreshTokenOrDisconnect(auth as unknown as AuthService, session, router);

    expect(token).toBe('the-access-token');
    expect(session.phase()).toBe('awaiting-secret');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('disconnects and returns null on any renewal failure — not just a GoogleAuthExpiredError', async () => {
    // The failure GIS actually throws for a dead/unrenewable session is a
    // plain Error (from its error_callback, or AuthService's own renewal
    // timeout) — GoogleAuthExpiredError is Drive-401-only and never thrown
    // here. This must still be treated as unrecoverable.
    auth.error = new Error('popup_failed_to_open');

    const token = await ensureFreshTokenOrDisconnect(auth as unknown as AuthService, session, router);

    expect(token).toBeNull();
    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/start']);
  });
});

describe('disconnectSession', () => {
  it('signs out and returns to /start', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const session = TestBed.inject(SessionStore);
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    session.signIn('the-access-token', Date.now() + 3_600_000);

    disconnectSession(session, router);

    expect(session.phase()).toBe('signed-out');
    expect(router.navigate).toHaveBeenCalledWith(['/start']);
  });
});
