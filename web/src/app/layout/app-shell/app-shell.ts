import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { AuditService } from '../../core/audit/audit.service';
import { AutoLockService } from '../../core/auth/auto-lock.service';
import { lockSession } from '../../core/auth/lock-session';
import { SessionStore } from '../../core/auth/session.store';
import { VaultStore } from '../../core/vault/vault.store';
import { AppSidebar } from '../app-sidebar/app-sidebar';
import { SyncOverlay } from '../sync-overlay/sync-overlay';

/**
 * Frame around every signed-in screen, built on spartan's `sidebar-inset` block:
 * the navigation sidebar on the left, the active view inset on the right.
 *
 * Below the sidebar's mobile breakpoint the sidebar becomes a sheet, opened from the
 * trigger in each view's own header; above it, a permanent column that collapses to an
 * icon rail from the trigger beside the logo. There is no bar of its own above the
 * view — each view's header is the only one.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HlmSidebarImports, AppSidebar, SyncOverlay],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly sidebar = inject(HlmSidebarService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionStore);
  private readonly vault = inject(VaultStore);
  private readonly audit = inject(AuditService);
  private readonly autoLock = inject(AutoLockService);

  constructor() {
    // The shell only exists while signed in, so this starts and stops with
    // the session rather than needing its own phase watcher.
    this.autoLock.start();
  }

  /** "Lock app": forget the secret and the decrypted vault, keep the Google session. */
  protected lock(): void {
    this.sidebar.setOpenMobile(false);
    lockSession(this.session, this.vault, this.audit, this.router);
  }

  /** "Disconnect": end the Google session too, so signing back in needs consent again. */
  protected disconnect(): void {
    this.sidebar.setOpenMobile(false);
    this.session.signOut();
    void this.router.navigate(['/start']);
  }
}
