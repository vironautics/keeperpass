import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuditService } from '../audit/audit.service';
import { VaultStore } from '../vault/vault.store';
import { lockSession } from './lock-session';
import { ACCESS_TOKEN_STORAGE_KEY, SessionStore } from './session.store';

describe('lockSession', () => {
  let session: SessionStore;
  let vault: VaultStore;
  let audit: AuditService;
  let router: Router;

  beforeEach(() => {
    session = TestBed.inject(SessionStore);
    vault = TestBed.inject(VaultStore);
    audit = TestBed.inject(AuditService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    session.signIn('token', Date.now() + 3_600_000);
    session.unlock('the-secret');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('forgets the secret so nothing can be decrypted or saved', () => {
    lockSession(session, vault, audit, router);

    expect(session.secret()).toBe('');
  });

  // The whole point of locking: a passer-by must not be able to read the
  // vault, and the decrypted items live in this store.
  it('clears the decrypted vault out of memory', () => {
    vault.createItem({
      id: 'a',
      vaultId: 'vault-personal',
      name: 'Bank login',
      fields: [],
      tags: [],
    });
    expect(vault.items()).toHaveLength(1);

    lockSession(session, vault, audit, router);

    expect(vault.items()).toHaveLength(0);
    expect(vault.itemById('a')).toBeUndefined();
  });

  it('keeps the Google session, so unlocking asks only for the secret', () => {
    lockSession(session, vault, audit, router);

    expect(session.accessToken()).toBe('token');
    expect(sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('token');
    expect(session.phase()).toBe('awaiting-secret');
  });

  it('sends the user to /unlock, not /start', () => {
    lockSession(session, vault, audit, router);

    expect(router.navigate).toHaveBeenCalledWith(['/unlock']);
  });
});
