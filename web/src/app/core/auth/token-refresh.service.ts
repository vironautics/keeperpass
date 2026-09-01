import { DOCUMENT, inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { disconnectSession } from './disconnect-session';
import { SessionStore } from './session.store';

/**
 * Verifies (and renews) the Google token whenever the app comes back into view.
 *
 * Access tokens last about an hour, and a tab left in another window ages out
 * silently. Without this the staleness is only discovered by the first Drive
 * call that fails — which, on the unlock screen, is the one made right after
 * the user has typed their secret. The 401 reads as a rejected sign-in and
 * bounces them to Google, having just entered a perfectly good secret.
 *
 * Checking on focus moves that work to a moment when nothing is waiting on it.
 * Renewal is silent (`prompt: ''`) and cheap when the token is still valid —
 * `ensureFreshToken` returns immediately in that case, so this costs a
 * comparison on most focus events.
 *
 * A failed renewal disconnects the session and sends the user back to
 * `/start`: Google's own guidance is that `requestAccessToken()` needs a
 * user gesture to reliably run, and a `focus`/`visibilitychange` handler
 * isn't one — so this attempt may fail outright (the user's Google session
 * is genuinely over) or time out because the browser silently blocked the
 * popup (see `AuthService.RENEWAL_TIMEOUT_MS`). Either way, client-side
 * renewal isn't possible from here, and the one click on `/start` *is* a
 * real gesture the popup is allowed to open from — that's the recovery.
 */
@Injectable({ providedIn: 'root' })
export class TokenRefreshService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly onFocus = () => this.refreshIfVisible();

  /** Called once at startup; runs for the life of the app. */
  start(): void {
    // Outside the zone: focus fires often and none of this touches the UI
    // unless a renewal actually lands, which updates a signal on its own.
    this.zone.runOutsideAngular(() => {
      this.document.addEventListener('visibilitychange', this.onFocus);
      this.document.defaultView?.addEventListener('focus', this.onFocus);
    });

    this.refreshIfVisible();
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('visibilitychange', this.onFocus);
    this.document.defaultView?.removeEventListener('focus', this.onFocus);
  }

  private refreshIfVisible(): void {
    if (this.document.visibilityState === 'hidden') {
      return;
    }

    // Nothing to renew before Google sign-in has happened at all.
    if (this.session.phase() === 'signed-out' || !this.session.tokenExpired()) {
      return;
    }

    this.zone.run(() => {
      void this.auth.ensureFreshToken().catch(() => {
        // See the class doc — client-side renewal isn't possible from a
        // non-gesture context, so the only remaining recovery is reconnecting.
        disconnectSession(this.session, this.router);
      });
    });
  }
}
