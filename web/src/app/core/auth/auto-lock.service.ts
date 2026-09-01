import { DOCUMENT, inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuditService } from '../audit/audit.service';
import { VaultStore } from '../vault/vault.store';
import { lockSession } from './lock-session';
import { SessionStore } from './session.store';

/** How long the app may sit untouched before it locks itself. */
export const AUTO_LOCK_AFTER_MS = 10 * 60_000;

/**
 * Locks the vault after a stretch of inactivity.
 *
 * An unlocked vault holds every password in memory and on screen, so leaving
 * it open indefinitely means a walk-past is enough to read them. Locking
 * clears the secret and the decrypted items, exactly like the Lock button —
 * the Google session survives, so coming back only asks for the secret again.
 *
 * Only real user input counts as activity: `mousemove` alone would keep the
 * vault open under a resting hand or a jittery trackpad. Returning to the tab
 * also counts, so switching away and back doesn't lock mid-glance — but a tab
 * left in the background still locks on schedule, which is the case that
 * matters.
 *
 * Listeners are registered outside Angular's zone: they fire constantly, and
 * every one of them would otherwise trigger change detection across the whole
 * app for no visible reason.
 */
@Injectable({ providedIn: 'root' })
export class AutoLockService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly session = inject(SessionStore);
  private readonly vault = inject(VaultStore);
  private readonly audit = inject(AuditService);
  private readonly router = inject(Router);

  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly onActivity = () => this.reset();

  private static readonly ACTIVITY_EVENTS = [
    'pointerdown',
    'keydown',
    'wheel',
    'touchstart',
  ] as const;

  /** Called once from the app shell, which only exists while signed in. */
  start(): void {
    this.zone.runOutsideAngular(() => {
      for (const event of AutoLockService.ACTIVITY_EVENTS) {
        this.document.addEventListener(event, this.onActivity, { passive: true });
      }
      this.document.addEventListener('visibilitychange', this.onActivity);
    });

    this.reset();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  stop(): void {
    for (const event of AutoLockService.ACTIVITY_EVENTS) {
      this.document.removeEventListener(event, this.onActivity);
    }
    this.document.removeEventListener('visibilitychange', this.onActivity);
    this.clear();
  }

  private reset(): void {
    this.clear();

    if (this.session.phase() !== 'ready') {
      return;
    }

    this.timer = setTimeout(() => {
      // Back inside Angular: locking navigates and clears signals the UI is
      // bound to, none of which would be picked up from outside the zone.
      this.zone.run(() => {
        if (this.session.phase() === 'ready') {
          lockSession(this.session, this.vault, this.audit, this.router);
        }
      });
    }, AUTO_LOCK_AFTER_MS);
  }

  private clear(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
