import { TestBed } from '@angular/core/testing';
import { ACCESS_TOKEN_STORAGE_KEY, SessionStore } from './session.store';

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
