import { Router } from '@angular/router';
import { SessionStore } from './session.store';

/**
 * Ends the session and returns to `/start` to reconnect. Two call sites:
 * the sidebar/unlock-screen "Disconnect" buttons (a deliberate choice), and
 * every place that talks to Drive, on catching a `GoogleAuthExpiredError`
 * (a 401 — the access token is dead, and there's no refresh-token flow, so
 * reconnecting for a fresh one is the only recovery; see
 * `google-drive.service.ts` and `SessionStore`'s own doc comment).
 */
export function disconnectSession(session: SessionStore, router: Router): void {
  session.signOut();
  void router.navigate(['/start']);
}
