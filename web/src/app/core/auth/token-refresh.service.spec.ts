import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionStore } from './session.store';
import { TokenRefreshService } from './token-refresh.service';

class FakeAuthService {
  error: Error | null = null;
  calls = 0;

  async ensureFreshToken() {
    this.calls++;
    if (this.error) throw this.error;
    return 'renewed-token';
  }
}

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
}

describe('TokenRefreshService', () => {
  let service: TokenRefreshService;
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
    service = TestBed.inject(TokenRefreshService);
    setVisibility('visible');
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('does nothing before any Google sign-in', async () => {
    service.start();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(auth.calls).toBe(0);
  });

  it('does nothing when the token is still fresh', async () => {
    session.signIn('the-token', Date.now() + 3_600_000);

    service.start();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(auth.calls).toBe(0);
  });

  it('does nothing while the tab is hidden', async () => {
    setVisibility('hidden');
    session.signIn('stale-token', Date.now() - 1000);

    service.start();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(auth.calls).toBe(0);
  });

  it('renews silently on refocus when the token has expired and renewal can complete', async () => {
    session.signIn('stale-token', Date.now() - 1000);

    service.start();

    await vi.waitFor(() => expect(auth.calls).toBe(1));
    expect(session.phase()).toBe('awaiting-secret');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('disconnects to /start when client-side renewal is not possible', async () => {
    // Renewal fails outright — the user's Google session is genuinely over,
    // or the popup was blocked for lack of a user gesture (see the class
    // doc). Either way there is no client-side path left, so this is the
    // "otherwise redirect to reconnect" half of the requirement.
    session.signIn('stale-token', Date.now() - 1000);
    auth.error = new Error('popup_failed_to_open');

    service.start();

    await vi.waitFor(() => expect(router.navigate).toHaveBeenCalledWith(['/start']));
    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
  });

  it('checks again on window focus, not only at startup', async () => {
    session.signIn('the-token', Date.now() + 3_600_000);
    service.start();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(auth.calls).toBe(0);

    // The token ages out while the tab sits unfocused elsewhere.
    session.signIn('now-stale-token', Date.now() - 1000);
    window.dispatchEvent(new Event('focus'));

    await vi.waitFor(() => expect(auth.calls).toBe(1));
  });

  it('stops listening once destroyed', async () => {
    session.signIn('the-token', Date.now() + 3_600_000);
    service.start();
    service.ngOnDestroy();

    session.signIn('now-stale-token', Date.now() - 1000);
    window.dispatchEvent(new Event('focus'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(auth.calls).toBe(0);
  });
});
