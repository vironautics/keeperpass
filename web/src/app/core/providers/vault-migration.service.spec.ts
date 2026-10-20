import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SessionStore } from '../auth/session.store';
import { decryptVault } from '../vault/vault-crypto';
import { createEmptyVaultSnapshot, VaultStore } from '../vault/vault.store';
import { CLOUD_PROVIDERS } from './cloud-providers';
import { AuthProvider, CloudProvider, ProviderId, VaultStorage } from './provider';
import { StorageAuthExpiredError } from './storage-errors';
import {
  MigrationTarget,
  TargetVaultExistsError,
  VaultMigrationService,
} from './vault-migration.service';

/** An in-memory storage that remembers what was done to it, in order. */
class FakeStorage implements VaultStorage {
  content: string | null;
  calls: string[] = [];
  failSave: Error | null = null;
  failDetach = false;
  /** Replaces what a read returns, to simulate a copy that did not survive. */
  readBack: string | null | undefined;

  constructor(content: string | null = null) {
    this.content = content;
  }

  async loadVault() {
    this.calls.push('load');
    return this.readBack !== undefined ? this.readBack : this.content;
  }
  async vaultExists() {
    return this.content !== null;
  }
  async saveVault(_token: string, content: string) {
    this.calls.push('save');
    if (this.failSave) throw this.failSave;
    this.content = content;
  }
  async resetVault(_token: string, content: string) {
    this.calls.push('reset');
    if (this.failSave) throw this.failSave;
    this.content = content;
  }
  async detachVault() {
    this.calls.push('detach');
    if (this.failDetach) throw new Error('rename failed');
    const had = this.content !== null;
    this.content = null;
    return had;
  }
}

function fakeAuth(id: ProviderId, storageName: string, configured = true): AuthProvider {
  return {
    id,
    displayName: storageName,
    storageName,
    isConfigured: () => configured,
    signIn: async () => ({
      accessToken: `${id}-token`,
      expiresAt: Date.now() + 3_600_000,
      email: `${id}@example.com`,
      name: id,
    }),
    renew: async (current) => current,
    fetchProfile: async () => ({ email: `${id}@example.com`, name: id }),
  };
}

describe('VaultMigrationService', () => {
  let service: VaultMigrationService;
  let source: FakeStorage;
  let destination: FakeStorage;
  let target: MigrationTarget;
  const stages: string[] = [];
  const onStage = (stage: string) => stages.push(stage);

  /** What the vault in memory serialises to — what must come out the other side. */
  const snapshotJson = () => JSON.stringify(JSON.parse(JSON.stringify(TestBed.inject(VaultStore).snapshot())));

  beforeEach(() => {
    sessionStorage.clear();
    stages.length = 0;
    source = new FakeStorage('source-ciphertext');
    destination = new FakeStorage(null);

    const providers: CloudProvider[] = [
      { auth: fakeAuth('google', 'Google Drive'), storage: source },
      { auth: fakeAuth('dropbox', 'Dropbox'), storage: destination },
    ];
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CLOUD_PROVIDERS, useValue: providers }],
    });

    const session = TestBed.inject(SessionStore);
    session.signIn('source-token', Date.now() + 3_600_000, { providerId: 'google' });
    session.unlock('the-secret');
    TestBed.inject(VaultStore).hydrate(createEmptyVaultSnapshot('My Vault'));

    service = TestBed.inject(VaultMigrationService);
    target = {
      providerId: 'dropbox',
      storageName: 'Dropbox',
      accessToken: 'dropbox-token',
      email: 'dropbox@example.com',
      hasVault: false,
    };
  });

  const decryptDestination = (secret: string) =>
    decryptVault(secret, JSON.parse(destination.content!));

  describe('targets', () => {
    it('offers every configured provider except the one in use', () => {
      expect(service.targets()).toEqual([{ id: 'dropbox', storageName: 'Dropbox' }]);
    });
  });

  describe('connect', () => {
    it('signs in to the destination and reports whether it already holds a vault', async () => {
      destination.content = 'something';

      await expect(service.connect('dropbox')).resolves.toMatchObject({
        providerId: 'dropbox',
        email: 'dropbox@example.com',
        hasVault: true,
      });
    });

    it('does not touch the session', async () => {
      await service.connect('dropbox');

      const session = TestBed.inject(SessionStore);
      expect(session.providerId()).toBe('google');
      expect(session.accessToken()).toBe('source-token');
    });

    it('refuses to move a vault to the provider it is already in', async () => {
      await expect(service.connect('google')).rejects.toThrow(/already in that storage/);
    });
  });

  describe('migrate', () => {
    it('writes the vault to the destination, checks it, and only then renames the source', async () => {
      const result = await service.migrate(target, { secret: 'the-secret', replaceExisting: false }, onStage);

      expect(JSON.stringify(await decryptDestination('the-secret'))).toBe(snapshotJson());
      expect(destination.calls).toEqual(['save', 'load']);
      expect(source.calls).toEqual(['detach']);
      expect(result).toEqual({ sourceRenamed: true });
      expect(stages).toEqual(['encrypting', 'uploading', 'verifying', 'finishing']);
    });

    it('encrypts under a new secret when asked, which the old secret cannot open', async () => {
      await service.migrate(target, { secret: 'a-brand-new-secret', replaceExisting: false }, onStage);

      expect(JSON.stringify(await decryptDestination('a-brand-new-secret'))).toBe(snapshotJson());
      await expect(decryptDestination('the-secret')).rejects.toBeDefined();
    });

    it('does not overwrite a vault already at the destination unless told to', async () => {
      destination.content = 'their-existing-vault';

      await expect(
        service.migrate({ ...target, hasVault: true }, { secret: 'the-secret', replaceExisting: false }, onStage),
      ).rejects.toBeInstanceOf(TargetVaultExistsError);

      expect(destination.content).toBe('their-existing-vault');
      expect(destination.calls).toEqual([]);
      expect(source.calls).toEqual([]);
    });

    it('replaces an existing destination vault through the backup path, not a blind overwrite', async () => {
      destination.content = 'their-existing-vault';

      await service.migrate({ ...target, hasVault: true }, { secret: 'the-secret', replaceExisting: true }, onStage);

      expect(destination.calls[0]).toBe('reset');
      expect(destination.calls).not.toContain('save');
    });

    it('leaves the source alone when the copy that came back does not match', async () => {
      destination.readBack = 'not-the-vault-we-wrote';

      await expect(
        service.migrate(target, { secret: 'the-secret', replaceExisting: false }, onStage),
      ).rejects.toThrow(/did not match/);

      expect(source.calls).toEqual([]);
    });

    it('leaves the source alone when the copy cannot be read back at all', async () => {
      destination.readBack = null;

      await expect(
        service.migrate(target, { secret: 'the-secret', replaceExisting: false }, onStage),
      ).rejects.toThrow(/did not match/);

      expect(source.calls).toEqual([]);
    });

    it('leaves the source alone when the destination refuses the write', async () => {
      destination.failSave = new Error('quota exceeded');

      await expect(
        service.migrate(target, { secret: 'the-secret', replaceExisting: false }, onStage),
      ).rejects.toThrow('quota exceeded');

      expect(source.calls).toEqual([]);
    });

    it('says the destination sign-in expired, rather than disconnecting the session', async () => {
      destination.failSave = new StorageAuthExpiredError();

      await expect(
        service.migrate(target, { secret: 'the-secret', replaceExisting: false }, onStage),
      ).rejects.toThrow(/Dropbox sign-in expired/);

      expect(TestBed.inject(SessionStore).phase()).toBe('ready');
      expect(source.calls).toEqual([]);
    });

    it('reports a copy that succeeded but could not rename the old file as a success with a caveat', async () => {
      source.failDetach = true;

      const result = await service.migrate(target, { secret: 'the-secret', replaceExisting: false }, onStage);

      expect(result).toEqual({ sourceRenamed: false });
      expect(JSON.stringify(await decryptDestination('the-secret'))).toBe(snapshotJson());
    });

    it('refuses to start without a secret', async () => {
      await expect(
        service.migrate(target, { secret: '', replaceExisting: false }, onStage),
      ).rejects.toBeDefined();

      expect(destination.calls).toEqual([]);
    });
  });
});
