import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { VaultSyncService } from '../../core/vault/vault-sync.service';
import { Icon } from '../../ui/icon/icon';

/**
 * Blocks the whole app while a save to Google Drive is in flight, or while
 * the last one has failed — mounted once in `AppShell`, reacting to
 * `VaultSyncService`.
 *
 * An `hlm-dialog` with `disableClose`, which is what actually blocks the user: brain
 * routes Escape, backdrop clicks and outside pointer events through
 * `BrnDialog.dismiss()`, and that refuses while `disableClose` is set. The close button
 * is off too (`[showCloseButton]="false"`), so while syncing there is no way out except
 * the save finishing.
 *
 * On a failure, Retry and Dismiss are the only ways out — never a silent auto-close,
 * which is indistinguishable from success and is exactly what made the old
 * `console.error`-only failure path invisible.
 *
 * (It used to be built on the native `<dialog>` for its top layer and inertness. The
 * CDK overlay behind spartan's dialog gives the same three things — a backdrop, focus
 * trapping and an inert page — without a second dialog implementation in the app.)
 */
@Component({
  selector: 'app-sync-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    HlmAlertImports,
    HlmButton,
    HlmDialogImports,
    HlmProgressImports,
    HlmSpinnerImports,
  ],
  templateUrl: './sync-overlay.html',
  /** The dialog lives in an overlay, so this host renders nothing. */
  host: { class: 'contents' },
})
export class SyncOverlay {
  private readonly vaultSync = inject(VaultSyncService);

  protected readonly syncing = this.vaultSync.syncing;
  protected readonly uploading = this.vaultSync.uploading;
  protected readonly error = this.vaultSync.lastError;
  protected readonly percent = computed(() => Math.round(this.vaultSync.progress() * 100));
  protected readonly open = computed(() => this.syncing() || !!this.error());

  protected retry(): void {
    void this.vaultSync.syncNow();
  }

  protected dismiss(): void {
    this.vaultSync.dismissError();
  }
}
