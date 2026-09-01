import { Router } from '@angular/router';
import { AuditService } from '../audit/audit.service';
import { createEmptyVaultSnapshot, VaultStore } from '../vault/vault.store';
import { SessionStore } from './session.store';

/**
 * Locks the vault and returns to `/unlock`.
 *
 * Distinct from `disconnectSession`: the Google access token survives, so
 * unlocking again asks only for the secret. What must not survive is the
 * decrypted vault — leaving items in `VaultStore` would keep every password
 * readable in memory (and in the DOM, on whichever route was open) after
 * the user asked for the app to be locked. Clearing the store — and the audit
 * findings derived from it — is therefore the point of this, not incidental
 * cleanup.
 */
export function lockSession(
  session: SessionStore,
  vault: VaultStore,
  audit: AuditService,
  router: Router,
): void {
  session.lock();
  vault.hydrate(createEmptyVaultSnapshot());
  audit.clear();
  void router.navigate(['/unlock']);
}
