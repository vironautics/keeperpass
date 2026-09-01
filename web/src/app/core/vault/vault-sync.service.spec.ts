import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SessionStore } from '../auth/session.store';
import { GoogleAuthExpiredError, GoogleDriveService } from '../drive/google-drive.service';
import { decryptVault } from './vault-crypto';
import { createEmptyVaultSnapshot, VaultStore } from './vault.store';
import { VaultSyncService } from './vault-sync.service';

class FakeGoogleDriveService {
  saved: string | null = null;
  saveCount = 0;
  saveError: Error | null = null;
  /** When false, `saveVault` stays pending until `finishSave()` is called. */
  autoResolve = true;
  lastOnProgress: ((fraction: number) => void) | undefined;

  private resolveSave: (() => void) | null = null;
  private rejectSave: ((error: Error) => void) | null = null;

  async loadVault() {
    return null;
  }

  saveVault(
    _accessToken: string,
    content: string,
    onProgress?: (fraction: number) => void,
  ): Promise<void> {
    this.saveCount++;
    this.lastOnProgress = onProgress;

    if (this.autoResolve) {
      if (this.saveError) {
        return Promise.reject(this.saveError);
      }
      this.saved = content;
      onProgress?.(1);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.resolveSave = () => {
        this.saved = content;
        resolve();
      };
      this.rejectSave = reject;
    });
  }

  finishSave(): void {
    this.resolveSave?.();
  }

  failSave(error: Error): void {
    this.rejectSave?.(error);
  }
}

describe('VaultSyncService', () => {
  let session: SessionStore;
  let vault: VaultStore;
  let drive: FakeGoogleDriveService;
  let service: VaultSyncService;
  let router: Router;

  function signInAndUnlock(secret = 'the-secret') {
    session.signIn('the-token', Date.now() + 3_600_000);
    vault.hydrate(createEmptyVaultSnapshot());
    session.unlock(secret);
  }

  beforeEach(() => {
    drive = new FakeGoogleDriveService();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: GoogleDriveService, useValue: drive }],
    });

    session = TestBed.inject(SessionStore);
    vault = TestBed.inject(VaultStore);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    service = TestBed.inject(VaultSyncService);
  });

  it('does nothing on its own — no save happens without syncNow()', async () => {
    signInAndUnlock();
    vault.createVault('Second Vault');

    // Give a would-be background save every chance to happen, then confirm it didn't.
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(drive.saveCount).toBe(0);
  });

  it('does nothing when there is nothing to sync with (signed out)', async () => {
    await service.syncNow();
    expect(drive.saveCount).toBe(0);
  });

  describe('syncNow', () => {
    it('encrypts and saves the current snapshot immediately', async () => {
      signInAndUnlock();
      vault.createVault('Second Vault');

      await service.syncNow();

      expect(drive.saveCount).toBe(1);
      const decrypted = (await decryptVault('the-secret', JSON.parse(drive.saved!))) as {
        vaults: unknown[];
      };
      expect(decrypted.vaults).toHaveLength(2);
    });

    it('still uploads when called with nothing changed, for visible feedback', async () => {
      signInAndUnlock();

      await service.syncNow();

      expect(drive.saveCount).toBe(1);
    });

    it('reports syncing and progress while a save is in flight, then clears them', async () => {
      drive.autoResolve = false;
      signInAndUnlock();

      expect(service.syncing()).toBe(false);
      const pending = service.syncNow();

      // Real Argon2id doesn't resolve within a single microtask flush —
      // same real-time trade-off unlock-page.spec.ts makes, for the same reason.
      await vi.waitFor(() => expect(drive.saveCount).toBe(1), { timeout: 8000 });
      expect(service.syncing()).toBe(true);

      drive.lastOnProgress?.(0.5);
      expect(service.progress()).toBe(0.5);

      drive.finishSave();
      await pending;

      expect(service.syncing()).toBe(false);
    });

    it('re-runs once more if asked to sync again while already syncing, picking up the latest data', async () => {
      drive.autoResolve = false;
      signInAndUnlock();

      const first = service.syncNow();
      await vi.waitFor(() => expect(drive.saveCount).toBe(1), { timeout: 8000 });

      vault.createVault('Second Vault');
      const second = service.syncNow(); // deferred: a save is already in flight

      drive.finishSave();
      await first;

      await vi.waitFor(() => expect(drive.saveCount).toBe(2), { timeout: 8000 });
      drive.finishSave();
      await second;

      const decrypted = (await decryptVault('the-secret', JSON.parse(drive.saved!))) as {
        vaults: unknown[];
      };
      expect(decrypted.vaults).toHaveLength(2); // the second save picked up the new vault
    }, 20000);

    it('records a failed save instead of losing it silently', async () => {
      signInAndUnlock();
      drive.saveError = new Error('Could not reach Google Drive.');

      await service.syncNow();

      expect(service.syncing()).toBe(false);
      expect(service.lastError()).toBe('Could not reach Google Drive.');
    });

    it('clears a stale error on the next successful save', async () => {
      signInAndUnlock();
      drive.saveError = new Error('Could not reach Google Drive.');
      await service.syncNow();
      expect(service.lastError()).not.toBeNull();

      drive.saveError = null;
      await service.syncNow();

      expect(service.lastError()).toBeNull();
    });

    it('disconnects instead of recording an error when the token has expired (401)', async () => {
      signInAndUnlock();
      drive.saveError = new GoogleAuthExpiredError();

      await service.syncNow();

      expect(session.phase()).toBe('signed-out');
      expect(session.accessToken()).toBe('');
      expect(router.navigate).toHaveBeenCalledWith(['/start']);
      // Not a normal failure — nothing to show or retry once signed out.
      expect(service.lastError()).toBeNull();
      expect(service.syncing()).toBe(false);
    });

    it('does not retry a deferred sync after disconnecting on an expired token', async () => {
      drive.autoResolve = false;
      signInAndUnlock();

      const first = service.syncNow();
      await vi.waitFor(() => expect(drive.saveCount).toBe(1), { timeout: 8000 });

      const second = service.syncNow(); // deferred: a save is already in flight
      drive.failSave(new GoogleAuthExpiredError());
      await first;
      await second;

      expect(drive.saveCount).toBe(1); // the deferred retry never ran
      expect(session.phase()).toBe('signed-out');
    });
  });

  describe('dismissError', () => {
    it('clears a failed save’s error without retrying', async () => {
      signInAndUnlock();
      drive.saveError = new Error('Could not reach Google Drive.');
      await service.syncNow();
      expect(service.lastError()).not.toBeNull();

      service.dismissError();

      expect(service.lastError()).toBeNull();
      expect(drive.saveCount).toBe(1);
    });
  });
});
