import { TestBed } from '@angular/core/testing';
import { GoogleAuthExpiredError } from '../drive/google-drive.service';
import { SessionStore } from '../auth/session.store';
import { ProviderRegistry } from './provider-registry';
import { StorageAuthExpiredError } from './storage-errors';

describe('ProviderRegistry', () => {
  beforeEach(() => sessionStorage.clear());

  it('offers Google', () => {
    const registry = TestBed.inject(ProviderRegistry);

    expect(registry.get('google').auth.id).toBe('google');
    expect(registry.list().map((provider) => provider.auth.id)).toContain('google');
  });

  it('uses Google for a session that has not chosen a provider', () => {
    expect(TestBed.inject(ProviderRegistry).active().auth.id).toBe('google');
  });

  it('rejects an id nothing is registered for, rather than returning undefined', () => {
    const registry = TestBed.inject(ProviderRegistry);

    expect(() => registry.get('not-registered' as never)).toThrow(/No sign-in provider/);
  });

  it('follows the session when it signs in with a registered provider', () => {
    const session = TestBed.inject(SessionStore);
    session.signIn('token', 0, { providerId: 'google' });

    expect(TestBed.inject(ProviderRegistry).active().auth.id).toBe('google');
  });
});

describe('StorageAuthExpiredError', () => {
  it('is what the Google-specific error extends, so one catch handles every provider', () => {
    expect(new GoogleAuthExpiredError()).toBeInstanceOf(StorageAuthExpiredError);
  });
});
