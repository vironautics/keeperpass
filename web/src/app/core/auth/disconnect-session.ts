import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionStore } from './session.store';

/**
 * Ends the session and returns to `/start` to reconnect. Call sites: the
 * sidebar/unlock-screen "Disconnect" buttons (a deliberate choice), every
 * place that talks to Drive on catching a `GoogleAuthExpiredError` (a 401 —
 * the access token is dead, and there's no refresh-token flow, so
 * reconnecting for a fresh one is the only recovery; see
 * `google-drive.service.ts` and `SessionStore`'s own doc comment), and
 * `ensureFreshTokenOrDisconnect` below for when renewal itself fails.
 */
export function disconnectSession(session: SessionStore, router: Router): void {
  session.signOut();
  void router.navigate(['/start']);
}

/**
 * `AuthService.ensureFreshToken()`, but disconnecting instead of throwing if
 * renewal fails — returns `null` in that case so the caller can bail out.
 *
 * This is deliberately unconditional (unlike the `instanceof
 * GoogleAuthExpiredError` checks around Drive calls elsewhere): a renewal
 * failure never *is* a `GoogleAuthExpiredError` — that class is only thrown
 * by `GoogleDriveService` for a Drive `401`. A dead/renewal-blocked Google
 * session instead throws a plain `Error` (from
 * `GoogleIdentityServices`/GIS's `error_callback`, or `AuthService`'s own
 * renewal timeout), and either way the outcome is identical: there is no
 * token to proceed with, and reconnecting is the only recovery.
 */
export async function ensureFreshTokenOrDisconnect(
  auth: AuthService,
  session: SessionStore,
  router: Router,
): Promise<string | null> {
  try {
    return await auth.ensureFreshToken();
  } catch {
    disconnectSession(session, router);
    return null;
  }
}
