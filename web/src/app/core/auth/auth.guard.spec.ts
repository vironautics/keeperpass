import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { GoogleDriveService } from '../drive/google-drive.service';
import { authGuard, homeGuard, setupGuard, startGuard, unlockGuard } from './auth.guard';
import { SessionStore } from './session.store';

describe('auth guards', () => {
  let session: SessionStore;
  let router: Router;

  beforeEach(() => {
    session = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
  });

  const run = (guard: typeof authGuard) =>
    TestBed.runInInjectionContext(() => guard({} as never, {} as never));

  const redirectOf = (result: unknown) => router.serializeUrl(result as UrlTree);

  /** `/unlock` and `/setup` ask Drive whether a vault file exists. */
  const vaultExists = (exists: boolean | Error) =>
    vi.spyOn(TestBed.inject(GoogleDriveService), 'vaultExists').mockImplementation(async () => {
      if (exists instanceof Error) throw exists;
      return exists;
    });

  describe('authGuard (/items, /settings, /generator)', () => {
    it('allows a fully signed-in visitor through', () => {
      session.signIn('token', Date.now() + 3_600_000);
      session.unlock('the-secret');

      expect(run(authGuard)).toBe(true);
    });

    it.each(['signed-out', 'awaiting-secret'] as const)(
      'declines the match (falls through, not a redirect) while %s',
      (phase) => {
        if (phase !== 'signed-out') session.signIn('token', Date.now() + 3_600_000);

        expect(run(authGuard)).toBe(false);
      },
    );
  });

  describe('startGuard (/start)', () => {
    it('allows a signed-out visitor through', () => {
      expect(run(startGuard)).toBe(true);
    });

    it.each([
      ['awaiting-secret', '/unlock'],
      ['ready', '/items'],
    ] as const)('redirects a visitor in phase %s to %s', (phase, expected) => {
      session.signIn('token', Date.now() + 3_600_000);
      if (phase === 'ready') session.unlock('the-secret');

      expect(redirectOf(run(startGuard))).toBe(expected);
    });
  });

  describe('unlockGuard (/unlock)', () => {
    afterEach(() => vi.restoreAllMocks());

    it('allows a visitor who already has a vault through', async () => {
      vaultExists(true);
      session.signIn('token', Date.now() + 3_600_000);

      await expect(run(unlockGuard)).resolves.toBe(true);
    });

    it('sends a visitor with no vault to /setup instead', async () => {
      vaultExists(false);
      session.signIn('token', Date.now() + 3_600_000);

      expect(redirectOf(await run(unlockGuard))).toBe('/setup');
    });

    it('sends a signed-out visitor back to /start', async () => {
      expect(redirectOf(await run(unlockGuard))).toBe('/start');
    });

    it('sends a fully signed-in visitor to /items', async () => {
      session.signIn('token', Date.now() + 3_600_000);
      session.unlock('the-secret');

      expect(redirectOf(await run(unlockGuard))).toBe('/items');
    });

    // Guessing either way strands the visitor on a screen that cannot work.
    it('disconnects when Drive cannot be reached', async () => {
      vaultExists(new Error('offline'));
      session.signIn('token', Date.now() + 3_600_000);

      expect(redirectOf(await run(unlockGuard))).toBe('/start');
      expect(session.phase()).toBe('signed-out');
    });

    it('asks Drive only once per session', async () => {
      const probe = vaultExists(true);
      session.signIn('token', Date.now() + 3_600_000);

      await run(unlockGuard);
      await run(unlockGuard);

      expect(probe).toHaveBeenCalledTimes(1);
    });
  });

  describe('setupGuard (/setup)', () => {
    afterEach(() => vi.restoreAllMocks());

    it('allows a visitor with no vault through', async () => {
      vaultExists(false);
      session.signIn('token', Date.now() + 3_600_000);

      await expect(run(setupGuard)).resolves.toBe(true);
    });

    it('sends a visitor who already has a vault to /unlock instead', async () => {
      vaultExists(true);
      session.signIn('token', Date.now() + 3_600_000);

      expect(redirectOf(await run(setupGuard))).toBe('/unlock');
    });

    it('sends a signed-out visitor back to /start', async () => {
      expect(redirectOf(await run(setupGuard))).toBe('/start');
    });
  });

  describe('homeGuard (wildcard, and a bare /)', () => {
    it.each([
      ['signed-out', '/start'],
      ['awaiting-secret', '/unlock'],
      ['ready', '/items'],
    ] as const)('sends a visitor in phase %s to %s', (phase, expected) => {
      if (phase !== 'signed-out') session.signIn('token', Date.now() + 3_600_000);
      if (phase === 'ready') session.unlock('the-secret');

      expect(redirectOf(run(homeGuard))).toBe(expected);
    });
  });
});
