import { Injectable, inject } from '@angular/core';
import { GoogleDriveService } from '../drive/google-drive.service';
import { I18nService } from '../i18n';
import { decryptVault } from './vault-crypto';
import { VaultSnapshot } from './vault.store';

/**
 * Handles the initial vault fetch and decryption during unlock
 * This is a one-time operation during app initialization
 */
@Injectable({ providedIn: 'root' })
export class VaultUnlockService {
  private readonly drive = inject(GoogleDriveService);
  private readonly i18n = inject(I18nService);

  /**
   * Fetch vault from Google Drive and decrypt it with the master secret
   * Returns the decrypted VaultSnapshot
   *
   * @param accessToken Google access token
   * @param masterSecret Master secret for decryption
   * @throws Error if vault not found or decryption fails
   */
  async sync(accessToken: string, masterSecret: string): Promise<VaultSnapshot> {
    // Fetch encrypted vault from Google Drive
    const encryptedVaultJson = await this.drive.loadVault(accessToken);

    if (!encryptedVaultJson) {
      throw new Error(this.i18n.translate('vault.unlock.notFound'));
    }

    // Parse the encrypted vault
    let encryptedVault;
    try {
      encryptedVault = JSON.parse(encryptedVaultJson);
    } catch (error) {
      throw new Error(this.i18n.translate('vault.unlock.parseFailed'));
    }

    // Decrypt the vault
    const decrypted = await decryptVault(masterSecret, encryptedVault);

    // The decrypted data should be a VaultSnapshot
    // ngkeeper's core uses this structure
    if (!decrypted || typeof decrypted !== 'object') {
      throw new Error(this.i18n.translate('vault.unlock.invalidStructure'));
    }

    const snapshot = decrypted as VaultSnapshot;

    // Ensure required fields exist
    if (!Array.isArray(snapshot.vaults) || !Array.isArray(snapshot.items)) {
      throw new Error(this.i18n.translate('vault.unlock.missingFields'));
    }

    return snapshot;
  }
}
