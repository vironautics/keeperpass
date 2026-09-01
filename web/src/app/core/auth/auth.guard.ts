import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { GoogleDriveService } from '../drive/google-drive.service';
import { SessionPhase, SessionStore } from './session.store';

/** Where a visitor in a given phase belongs. */
const ROUTE_FOR_PHASE: Record<SessionPhase, string> = {
  'signed-out': '/start',
  'awaiting-secret': '/unlock',
  ready: '/items',
};

/**
 * Signed-in-only routes (`/items`, `/settings`, `/generator`).
 *
 * Returns a plain boolean, never a redirect: this route's path is `''`, so
 * the router tries it as a candidate for every URL, including whatever a
 * redirect here would target. Redirecting from it would immediately
 * re-invoke this same guard against that target, looping forever. Instead
 * it just declines the match — the router falls through to whichever of
 * `start`/`unlock` (or the wildcard) resolves the current phase.
 */
export const authGuard: CanMatchFn = () => inject(SessionStore).phase() === 'ready';

/**
 * Builds a guard for one step of the flow (`/start`, `/unlock`): allowed
 * only in its own phase; otherwise redirects to whichever step the
 * visitor's actual phase requires. Safe to redirect from — each of these
 * routes has a distinct literal path, so the guard only runs when that
 * exact path is requested, and `ROUTE_FOR_PHASE` never maps back to the
 * guard's own phase, so it can't re-trigger itself.
 */
function stepGuard(phase: SessionPhase): CanMatchFn {
  return () => {
    const session = inject(SessionStore);
    if (session.phase() === phase) {
      return true;
    }
    return inject(Router).createUrlTree([ROUTE_FOR_PHASE[session.phase()]]);
  };
}

export const startGuard = stepGuard('signed-out');

/**
 * Builds the guard for the two screens that share the `awaiting-secret`
 * phase but differ on whether a vault already exists: `/unlock` asks for the
 * secret that opens one, `/setup` asks the user to choose a secret for their
 * first. `wantsVault` says which side of that split the route is on.
 *
 * The answer comes from Drive, so this is async — the only async guard here.
 * It is asked once per session and cached on `SessionStore`; a refresh clears
 * the cache and re-checks.
 *
 * Any failure disconnects. There is no safe way to guess: showing `/setup` to
 * someone who has a vault invites them to create a second secret for a file
 * they can already open, and `/unlock` to someone who has none asks for a
 * secret that does not exist. Better to send them back to `/start`.
 */
function vaultStepGuard(wantsVault: boolean): CanMatchFn {
  return async () => {
    // All injected up front: `inject()` is only valid synchronously, and
    // everything below the first `await` has left the injection context.
    const session = inject(SessionStore);
    const router = inject(Router);
    const drive = inject(GoogleDriveService);

    if (session.phase() !== 'awaiting-secret') {
      return router.createUrlTree([ROUTE_FOR_PHASE[session.phase()]]);
    }

    let hasVault = session.hasVault();

    if (hasVault === null) {
      try {
        hasVault = await drive.vaultExists(session.accessToken());
        session.setHasVault(hasVault);
      } catch {
        // Deliberately not `disconnectSession`: that navigates itself, and a
        // guard returning a UrlTree at the same time races two navigations.
        session.signOut();
        return router.createUrlTree(['/start']);
      }
    }

    return hasVault === wantsVault ? true : router.createUrlTree([hasVault ? '/unlock' : '/setup']);
  };
}

/** `/unlock` (and `/recover`, reachable only from it): an existing vault. */
export const unlockGuard = vaultStepGuard(true);

/** `/setup`: no vault yet, so the user is choosing their first secret. */
export const setupGuard = vaultStepGuard(false);

/** Sends any otherwise-unmatched URL — including a bare `/` — to whichever step the current phase requires. */
export const homeGuard: CanMatchFn = () =>
  inject(Router).createUrlTree([ROUTE_FOR_PHASE[inject(SessionStore).phase()]]);
