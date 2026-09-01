import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SessionStore } from '../auth/session.store';
import {
  GoogleAuthExpiredError,
  GoogleDriveService,
  UploadProgressHandler,
} from '../drive/google-drive.service';
import { decryptVault, encryptVault } from '../vault/vault-crypto';
import { MasterPasswordService, WrongMasterPasswordError } from './master-password.service';

class FakeGoogleDriveService {
  stored: string | null = null;
  saved: { accessToken: string; content: string } | null = null;
  loadError: Error | null = null;
  saveError: Error | null = null;

  async loadVault() {
    if (this.loadError) throw this.loadError;
    return this.stored;
  }

  async saveVault(accessToken: string, content: string, onProgress?: UploadProgressHandler) {
    if (this.saveError) throw this.saveError;
    onProgress?.(0);
    onProgress?.(1);
    this.saved = { accessToken, content };
  }
}

describe('MasterPasswordService', () => {
  let service: MasterPasswordService;
  let session: SessionStore;
  let router: Router;
  let drive: FakeGoogleDriveService;
  const data = {
    vaults: [{ id: 'vault-personal', name: 'My Vault' }],
    items: [],
    organizations: [],
  };

  beforeEach(async () => {
    drive = new FakeGoogleDriveService();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: GoogleDriveService, useValue: drive }],
    });

    service = TestBed.inject(MasterPasswordService);
    session = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    session.signIn('the-access-token', Date.now() + 3_600_000);
    session.unlock('correct-secret');

    drive.stored = JSON.stringify(await encryptVault('correct-secret', data));
  });

  it('rejects the wrong current password without touching Drive', async () => {
    await expect(service.change('wrong-secret', 'new-secret')).rejects.toThrow(
      WrongMasterPasswordError,
    );

    expect(drive.saved).toBeNull();
    expect(session.secret()).toBe('correct-secret');
  });

  it('re-encrypts the same data under the new password and saves it', async () => {
    await service.change('correct-secret', 'new-secret');

    expect(drive.saved).not.toBeNull();
    expect(drive.saved!.accessToken).toBe('the-access-token');

    const decrypted = await decryptVault('new-secret', JSON.parse(drive.saved!.content));
    expect(decrypted).toEqual(data);

    // The old password no longer works — this isn't append-only re-wrapping.
    await expect(
      decryptVault('correct-secret', JSON.parse(drive.saved!.content)),
    ).rejects.toThrow();
  });

  it('updates SessionStore so later autosaves use the new password', async () => {
    await service.change('correct-secret', 'new-secret');

    expect(session.secret()).toBe('new-secret');
  });

  it('forwards upload progress to the caller', async () => {
    const onProgress = vi.fn();

    await service.change('correct-secret', 'new-secret', onProgress);

    expect(onProgress).toHaveBeenCalledWith(0);
    expect(onProgress).toHaveBeenCalledWith(1);
  });

  it('fails clearly when there is no vault in Drive yet', async () => {
    drive.stored = null;

    await expect(service.change('correct-secret', 'new-secret')).rejects.toThrow(/Drive/);
    expect(drive.saved).toBeNull();
  });

  it('disconnects when the token has expired (401), instead of a normal failure', async () => {
    drive.saveError = new GoogleAuthExpiredError();

    await expect(service.change('correct-secret', 'new-secret')).rejects.toBeInstanceOf(
      GoogleAuthExpiredError,
    );

    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/start']);
  });

  it('disconnects when the token can no longer be renewed at all — not just on a Drive 401', async () => {
    // A dead Google session throws a plain Error from renewal (GIS's
    // error_callback, or AuthService's own renewal timeout) — never a
    // GoogleAuthExpiredError, which is Drive-401-only.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: GoogleDriveService, useValue: drive },
        {
          provide: AuthService,
          useValue: { ensureFreshToken: () => Promise.reject(new Error('popup_failed_to_open')) },
        },
      ],
    });
    service = TestBed.inject(MasterPasswordService);
    session = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    session.signIn('the-access-token', Date.now() + 3_600_000);
    session.unlock('correct-secret');

    await expect(service.change('correct-secret', 'new-secret')).rejects.toThrow(
      /session has expired/,
    );

    expect(drive.saved).toBeNull();
    expect(session.phase()).toBe('signed-out');
    expect(session.accessToken()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/start']);
  });
});
