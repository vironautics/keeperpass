import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { GoogleIdentityServices } from './google-identity-services';

class FakeGoogleIdentityServices {
  result: string | null = null;
  error: Error | null = null;
  seenScope: string | null = null;

  async requestAccessToken(_clientId: string, scope: string) {
    this.seenScope = scope;
    if (this.error) {
      throw this.error;
    }
    return { accessToken: this.result!, expiresAt: Date.now() + 3_600_000 };
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let googleIdentity: FakeGoogleIdentityServices;

  beforeEach(() => {
    googleIdentity = new FakeGoogleIdentityServices();

    TestBed.configureTestingModule({
      providers: [{ provide: GoogleIdentityServices, useValue: googleIdentity }],
    });

    service = TestBed.inject(AuthService);
    vi.spyOn(globalThis, 'fetch');
  });

  it('reads the Google profile once the consent popup grants an access token', async () => {
    googleIdentity.result = 'token-123';
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ email: 'a@b.com', name: 'A B' }),
    });

    const result = await service.signInWithGoogle();

    expect(fetch).toHaveBeenCalledWith('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: 'Bearer token-123' },
    });
    expect(result).toMatchObject({ email: 'a@b.com', name: 'A B', accessToken: 'token-123' });
    expect(result.expiresAt).toBeGreaterThan(Date.now());
  });

  it('asks for Drive access in the same popup as sign-in', async () => {
    googleIdentity.result = 'token-123';
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ email: 'a@b.com', name: 'A B' }),
    });

    await service.signInWithGoogle();

    expect(googleIdentity.seenScope).toContain('https://www.googleapis.com/auth/drive.file');
  });

  it('surfaces a failure reading the profile', async () => {
    googleIdentity.result = 'token-123';
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false });

    await expect(service.signInWithGoogle()).rejects.toThrow(/Google profile/);
  });

  it('propagates a popup failure, e.g. the user closing it', async () => {
    googleIdentity.error = new Error('popup_closed_by_user');

    await expect(service.signInWithGoogle()).rejects.toThrow('popup_closed_by_user');
  });

  describe('ensureFreshToken', () => {
    it('bounds a renewal that never calls back, instead of hanging forever', async () => {
      // Simulates the browser silently blocking the popup because this was
      // called with no user gesture (see the class doc on RENEWAL_TIMEOUT_MS)
      // — neither GIS callback fires, so the underlying promise never settles.
      vi.useFakeTimers();
      googleIdentity.requestAccessToken = () => new Promise<never>(() => {});

      const renewal = service.ensureFreshToken();
      const assertion = expect(renewal).rejects.toThrow(/Timed out/);
      await vi.advanceTimersByTimeAsync(8_000);
      await assertion;

      vi.useRealTimers();
    });

    it('clears the pending renewal after a timeout, so a later call can retry', async () => {
      vi.useFakeTimers();
      googleIdentity.requestAccessToken = () => new Promise<never>(() => {});

      const first = service.ensureFreshToken();
      const firstAssertion = expect(first).rejects.toThrow(/Timed out/);
      await vi.advanceTimersByTimeAsync(8_000);
      await firstAssertion;

      vi.useRealTimers();
      googleIdentity.requestAccessToken = async () => ({
        accessToken: 'retried-token',
        expiresAt: Date.now() + 3_600_000,
      });

      await expect(service.ensureFreshToken()).resolves.toBe('retried-token');
    });

    it('shares one in-flight renewal between concurrent callers', async () => {
      let calls = 0;
      googleIdentity.requestAccessToken = async () => {
        calls++;
        return { accessToken: 'shared-token', expiresAt: Date.now() + 3_600_000 };
      };

      const [a, b] = await Promise.all([service.ensureFreshToken(), service.ensureFreshToken()]);

      expect(a).toBe('shared-token');
      expect(b).toBe('shared-token');
      expect(calls).toBe(1);
    });
  });
});
