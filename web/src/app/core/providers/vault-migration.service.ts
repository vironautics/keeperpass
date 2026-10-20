import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ensureFreshTokenOrDisconnect } from '../auth/disconnect-session';
import { AuthService } from '../auth/auth.service';
import { SessionStore } from '../auth/session.store';
import { I18nService } from '../i18n';
import { decryptVault, encryptVault } from '../vault/vault-crypto';
import { VaultStore } from '../vault/vault.store';
import { VaultSyncService } from '../vault/vault-sync.service';
import { ProviderId } from './provider';
import { ProviderRegistry } from './provider-registry';
import { StorageAuthExpiredError } from './storage-errors';

/** A signed-in destination, held only for the length of one move — never put on the session. */
export interface MigrationTarget {
  providerId: ProviderId;
  /** "Dropbox" — for messages. */
  storageName: string;
  accessToken: string;
  email: string;
  /** Whether the destination account already holds a vault. */
  hasVault: boolean;
}

export type MigrationStage = 'encrypting' | 'uploading' | 'verifying' | 'finishing';

export interface MigrationOptions {
  /** The secret the moved vault is encrypted with: the current one, or a new one chosen for the destination. */
  secret: string;
  /** Confirms the user knows the destination's existing vault will be kept as a backup and replaced. */
  replaceExisting: boolean;
}

export interface MigrationResult {
  /** `false` when the copy succeeded but the old file could not be renamed. */
  sourceRenamed: boolean;
}

/** The destination already has a vault and the caller did not agree to replace it. */
export class TargetVaultExistsError extends Error {
  constructor() {
    super('The destination already holds a vault.');
    this.name = 'TargetVaultExistsError';
  }
}

/**
 * Moves the vault from the provider this session is signed in with to another.
 *
 * Works from the unlocked, in-memory vault rather than copying the stored file:
 * the user has already proved the secret by unlocking, and encrypting the
 * snapshot afresh is what makes "choose a new secret for the destination" the
 * same code path as "keep this one".
 *
 * Ordered so that no step can lose data: the destination is written, then read
 * back and decrypted and compared to what was meant to be saved, and only then
 * is the source file renamed — never deleted. An existing destination vault is
 * not overwritten but renamed to a timestamped backup (`resetVault`), and only
 * if the caller agreed to that. Any failure before the rename leaves the source
 * exactly as it was.
 *
 * The destination's token is used directly and never stored on `SessionStore`:
 * the session keeps talking to the source until the move is finished, and a
 * destination failure must not look like the session's own token dying (which
 * would disconnect it).
 */
@Injectable({ providedIn: 'root' })
export class VaultMigrationService {
  private readonly registry = inject(ProviderRegistry);
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly vault = inject(VaultStore);
  private readonly sync = inject(VaultSyncService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  /** Providers the vault could move to: configured in this build, and not the one in use. */
  targets(): readonly { id: ProviderId; storageName: string }[] {
    return this.registry
      .available()
      .filter((provider) => provider.auth.id !== this.session.providerId())
      .map((provider) => ({ id: provider.auth.id, storageName: provider.auth.storageName }));
  }

  /**
   * Signs in to the destination and reports whether it already has a vault.
   * Interactive — call it straight from a click, with nothing awaited first.
   */
  connect(targetId: ProviderId): Promise<MigrationTarget> {
    const provider = this.registry.get(targetId);

    // Rejected without awaiting anything above it: the popup has to open
    // inside the click.
    if (targetId === this.session.providerId()) {
      return Promise.reject(new Error(this.i18n.translate('settings.migrate.error.sameProvider')));
    }

    return provider.auth.signIn().then(async (grant) => ({
      providerId: targetId,
      storageName: provider.auth.storageName,
      accessToken: grant.accessToken,
      email: grant.email,
      hasVault: await provider.storage.vaultExists(grant.accessToken),
    }));
  }

  async migrate(
    target: MigrationTarget,
    options: MigrationOptions,
    onStage: (stage: MigrationStage) => void,
  ): Promise<MigrationResult> {
    if (target.hasVault && !options.replaceExisting) {
      throw new TargetVaultExistsError();
    }
    if (!options.secret || this.session.phase() !== 'ready') {
      throw new Error(this.i18n.translate('common.genericError'));
    }
    // A save in flight could write to the source after it has been renamed,
    // recreating it with stale contents.
    if (this.sync.syncing()) {
      throw new Error(this.i18n.translate('settings.migrate.error.busy'));
    }

    const source = this.registry.active().storage;
    const destination = this.registry.get(target.providerId).storage;

    const sourceToken = await ensureFreshTokenOrDisconnect(this.auth, this.session, this.router);
    if (!sourceToken) {
      throw new Error(this.i18n.translate('settings.migrate.error.sourceExpired'));
    }

    const snapshot = this.vault.snapshot();

    onStage('encrypting');
    const content = JSON.stringify(await encryptVault(options.secret, snapshot));

    onStage('uploading');
    try {
      if (target.hasVault) {
        await destination.resetVault(target.accessToken, content);
      } else {
        await destination.saveVault(target.accessToken, content);
      }

      onStage('verifying');
      await this.verify(destination.loadVault(target.accessToken), options.secret, snapshot);
    } catch (error) {
      if (error instanceof StorageAuthExpiredError) {
        throw new Error(
          this.i18n.translate('settings.migrate.error.targetExpired', {
            provider: target.storageName,
          }),
        );
      }
      throw error;
    }

    onStage('finishing');
    try {
      return { sourceRenamed: await source.detachVault(sourceToken) };
    } catch {
      // The copy is safe and checked; failing to tidy the old file must not
      // read as a failed move.
      return { sourceRenamed: false };
    }
  }

  /** The stored copy must decrypt, with this secret, to exactly the vault that was meant to be saved. */
  private async verify(
    stored: Promise<string | null>,
    secret: string,
    snapshot: unknown,
  ): Promise<void> {
    const failure = new Error(this.i18n.translate('settings.migrate.error.verifyFailed'));

    const text = await stored;
    if (!text) {
      throw failure;
    }

    let roundTrip: unknown;
    try {
      roundTrip = await decryptVault(secret, JSON.parse(text));
    } catch {
      throw failure;
    }

    // Through JSON on both sides: that is the shape that was encrypted.
    if (JSON.stringify(roundTrip) !== JSON.stringify(JSON.parse(JSON.stringify(snapshot)))) {
      throw failure;
    }
  }
}
