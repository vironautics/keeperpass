import { inject, Injectable } from '@angular/core';
import { ProviderRegistry } from './provider-registry';
import { UploadProgressHandler, VaultStorage } from './provider';

/**
 * The vault storage of whichever provider the current session signed in with.
 *
 * Same method names as `VaultStorage`, so a call site that used to talk to
 * Google Drive directly swaps one injected class and nothing else.
 */
@Injectable({ providedIn: 'root' })
export class VaultStorageService implements VaultStorage {
  private readonly registry = inject(ProviderRegistry);

  loadVault(accessToken: string): Promise<string | null> {
    return this.registry.active().storage.loadVault(accessToken);
  }

  vaultExists(accessToken: string): Promise<boolean> {
    return this.registry.active().storage.vaultExists(accessToken);
  }

  saveVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    return this.registry.active().storage.saveVault(accessToken, content, onProgress);
  }

  resetVault(
    accessToken: string,
    content: string,
    onProgress?: UploadProgressHandler,
  ): Promise<void> {
    return this.registry.active().storage.resetVault(accessToken, content, onProgress);
  }

  detachVault(accessToken: string): Promise<boolean> {
    return this.registry.active().storage.detachVault(accessToken);
  }
}
