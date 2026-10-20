import { inject, InjectionToken } from '@angular/core';
import { GoogleDriveService } from '../drive/google-drive.service';
import { DropboxAuthProvider } from './dropbox/dropbox-auth.provider';
import { DropboxVaultStorage } from './dropbox/dropbox-vault.storage';
import { GoogleAuthProvider } from './google/google-auth.provider';
import { CloudProvider } from './provider';

/**
 * Every provider the app offers. Adding one is one entry here.
 *
 * A root-provided factory rather than a multi-provider in `app.config.ts`, so
 * tests that build a bare `TestBed` get the same list the app does.
 */
export const CLOUD_PROVIDERS = new InjectionToken<readonly CloudProvider[]>('CLOUD_PROVIDERS', {
  providedIn: 'root',
  factory: () => [
    { auth: inject(GoogleAuthProvider), storage: inject(GoogleDriveService) },
    { auth: inject(DropboxAuthProvider), storage: inject(DropboxVaultStorage) },
  ],
});
