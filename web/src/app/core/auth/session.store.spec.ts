import { TestBed } from '@angular/core/testing';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  PROVIDER_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  SessionStore,
} from './session.store';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = TestBed.inject(SessionStore);
  });

  it('starts signed out', () => {
    expect(store.phase()).toBe('signed-out');
    expect(store.accessToken()).toBe('');
    expect(store.secret()).toBe('');
  });

  it('walks through sign-in and unlock, keeping the access token for later saves', () => {
    store.signIn('the-access-token', Date.now() + 3_600_000);
    expect(store.phase()).toBe('awaiting-secret');
    expect(store.accessToken()).toBe('the-access-token');

    store.unlock('the-secret');
    expect(store.phase()).toBe('ready');
    expect(store.accessToken()).toBe('the-access-token');
    expect(store.secret()).toBe('the-secret');
  });

  it('signs out from any phase, clearing the access token and secret', () => {
    store.signIn('the-access-token', Date.now() + 3_600_000);
    store.unlock('the-secret');

    store.signOut();

    expect(store.phase()).toBe('signed-out');
    expect(store.accessToken()).toBe('');
    expect(store.secret()).toBe('');
  });

  it('persists the access token to sessionStorage on sign-in, surviving a refresh', () => {
    store.signIn('the-access-token', Date.now() + 3_600_000);

    expect(sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('the-access-token');
  });

  it('removes the persisted access token on sign-out', () => {
    store.signIn('the-access-token', Date.now() + 3_600_000);

    store.signOut();

    expect(sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
  });
});

describe('SessionStore — restoring from sessionStorage on startup', () => {
  it('restores the access token and lands in awaiting-secret, skipping straight past Google sign-in', () => {
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'restored-token');

    const store = TestBed.inject(SessionStore);

    expect(store.phase()).toBe('awaiting-secret');
    expect(store.accessToken()).toBe('restored-token');
    // The vault secret is never persisted — a refresh always re-asks for it.
    expect(store.secret()).toBe('');
  });

  it('starts signed out when nothing was left over from a previous session', () => {
    const store = TestBed.inject(SessionStore);

    expect(store.phase()).toBe('signed-out');
    expect(store.accessToken()).toBe('');
  });
});

describe('SessionStore — providers', () => {
  beforeEach(() => sessionStorage.clear());

  it('treats a stored token with no provider as a Google session, so a deploy does not log anyone out', () => {
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'old-token');

    const store = TestBed.inject(SessionStore);

    expect(store.phase()).toBe('awaiting-secret');
    expect(store.providerId()).toBe('google');
  });

  it('restores the provider and refresh token the session signed in with', () => {
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'token');
    sessionStorage.setItem(PROVIDER_STORAGE_KEY, 'dropbox');
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, 'refresh');

    const store = TestBed.inject(SessionStore);

    expect(store.providerId()).toBe('dropbox');
    expect(store.refreshToken()).toBe('refresh');
  });

  it('drops a session whose provider this build does not know, instead of failing later', () => {
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'token');
    sessionStorage.setItem(PROVIDER_STORAGE_KEY, 'from-the-future');

    const store = TestBed.inject(SessionStore);

    expect(store.phase()).toBe('signed-out');
    expect(store.accessToken()).toBe('');
    expect(sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('records the provider and refresh token on sign-in, and clears them on sign-out', () => {
    const store = TestBed.inject(SessionStore);

    store.signIn('token', Date.now() + 3_600_000, { providerId: 'dropbox', refreshToken: 'r1' });
    expect(store.providerId()).toBe('dropbox');
    expect(sessionStorage.getItem(PROVIDER_STORAGE_KEY)).toBe('dropbox');
    expect(sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBe('r1');

    store.signOut();
    expect(store.providerId()).toBe('google');
    expect(store.refreshToken()).toBe('');
    expect(sessionStorage.getItem(PROVIDER_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('keeps the refresh token across a renewal that does not return a new one', () => {
    const store = TestBed.inject(SessionStore);
    store.signIn('token', Date.now() + 3_600_000, { providerId: 'dropbox', refreshToken: 'r1' });

    store.renewToken('token-2', Date.now() + 3_600_000);

    expect(store.accessToken()).toBe('token-2');
    expect(store.refreshToken()).toBe('r1');
  });
});
