import { TestBed } from '@angular/core/testing';
import { AuditType, FieldType } from '../models';
import { VaultSyncService } from '../vault/vault-sync.service';
import { VaultStore } from '../vault/vault.store';
import { AuditService } from './audit.service';

/** HIBP returning no matching suffixes — nothing is compromised. */
function mockNothingCompromised() {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, text: async () => '' } as Response);
}

describe('AuditService.runFullAudit', () => {
  let service: AuditService;
  let store: VaultStore;

  beforeEach(() => {
    service = TestBed.inject(AuditService);
    store = TestBed.inject(VaultStore);
    mockNothingCompromised();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createTestItem(id: string, password?: string) {
    return store.createItem({
      id,
      vaultId: 'vault-personal',
      name: 'Item',
      fields: password ? [{ name: 'Password', type: FieldType.Password, value: password }] : [],
      tags: [],
    });
  }

  it('records findings for a weak password', async () => {
    const item = createTestItem('a', 'password');

    await service.runFullAudit();

    expect(service.findingsFor(item.id)).toContainEqual({
      type: AuditType.WeakPassword,
      fieldIndex: 0,
    });
    expect(service.hasFinding(item.id, AuditType.WeakPassword)).toBe(true);
  });

  it('leaves a clean item with no findings', async () => {
    const item = createTestItem('a', 'Tr0ub4dor&9!Zx#Qm');

    await service.runFullAudit();

    expect(service.findingsFor(item.id)).toEqual([]);
    expect(service.flaggedCount()).toBe(0);
  });

  // The reason findings moved out of `VaultItem`: an audit is derived data,
  // so it must never cause the vault to be re-encrypted and re-uploaded.
  it('never syncs to Drive', async () => {
    createTestItem('a', 'password');
    const sync = vi.spyOn(TestBed.inject(VaultSyncService), 'syncNow').mockResolvedValue();

    await service.runFullAudit();
    await service.runFullAudit();

    expect(sync).not.toHaveBeenCalled();
  });

  it('counts how many items are flagged', async () => {
    createTestItem('a', 'password');
    createTestItem('b', '123456');
    createTestItem('c', 'Tr0ub4dor&9!Zx#Qm');

    await service.runFullAudit();

    expect(service.flaggedCount()).toBe(2);
  });

  it('drops findings for items that no longer exist', async () => {
    const item = createTestItem('a', 'password');
    await service.runFullAudit();
    expect(service.flaggedCount()).toBe(1);

    store.deleteItem(item.id);
    await service.runFullAudit();

    expect(service.findingsFor(item.id)).toEqual([]);
    expect(service.flaggedCount()).toBe(0);
  });

  it('is a no-op with nothing in the vault', async () => {
    await expect(service.runFullAudit()).resolves.toBeUndefined();
    expect(service.flaggedCount()).toBe(0);
  });

  it('clear() forgets everything — locking must not leave findings behind', async () => {
    createTestItem('a', 'password');
    await service.runFullAudit();
    expect(service.flaggedCount()).toBe(1);

    service.clear();

    expect(service.flaggedCount()).toBe(0);
  });
});

describe('AuditService.runAuditForItem', () => {
  let service: AuditService;
  let store: VaultStore;

  beforeEach(() => {
    service = TestBed.inject(AuditService);
    store = TestBed.inject(VaultStore);
    mockNothingCompromised();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('replaces only the targeted item’s findings, leaving others intact', async () => {
    store.createItem({
      id: 'a',
      vaultId: 'vault-personal',
      name: 'A',
      fields: [{ name: 'Password', type: FieldType.Password, value: 'password' }],
      tags: [],
    });
    store.createItem({
      id: 'b',
      vaultId: 'vault-personal',
      name: 'B',
      fields: [{ name: 'Password', type: FieldType.Password, value: '123456' }],
      tags: [],
    });
    await service.runFullAudit();
    expect(service.flaggedCount()).toBe(2);

    // 'a' is fixed and re-audited on its own; 'b' is not rescanned.
    store.updateItem('a', {
      fields: [{ name: 'Password', type: FieldType.Password, value: 'Tr0ub4dor&9!Zx#Qm' }],
    });
    await service.runAuditForItem('a');

    expect(service.findingsFor('a')).toEqual([]);
    expect(service.hasFinding('b', AuditType.WeakPassword)).toBe(true);
  });
});

describe('AuditService — error handling', () => {
  let service: AuditService;
  let store: VaultStore;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    service = TestBed.inject(AuditService);
    store = TestBed.inject(VaultStore);
  });

  it('swallows a network failure from the compromised-password check instead of throwing', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    store.createItem({
      id: 'a',
      vaultId: 'vault-personal',
      name: 'Item',
      fields: [{ name: 'Password', type: FieldType.Password, value: 'password' }],
      tags: [],
    });

    await expect(service.runFullAudit()).resolves.toBeUndefined();
    // The whole run failed together, so no findings were recorded — the weak
    // password would have been flagged had it completed.
    expect(service.findingsFor('a')).toEqual([]);
  });

  it('recovers on the next call once the network is back', async () => {
    store.createItem({
      id: 'a',
      vaultId: 'vault-personal',
      name: 'Item',
      fields: [{ name: 'Password', type: FieldType.Password, value: 'password' }],
      tags: [],
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock.mockRejectedValueOnce(new Error('offline'));

    await service.runFullAudit();
    expect(service.findingsFor('a')).toEqual([]);

    fetchMock.mockResolvedValue({ ok: true, text: async () => '' } as Response);
    await service.runFullAudit();

    expect(service.hasFinding('a', AuditType.WeakPassword)).toBe(true);
  });
});
