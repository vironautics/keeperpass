import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaultSyncService } from '../../core/vault/vault-sync.service';
import { SyncOverlay } from './sync-overlay';

class FakeVaultSyncService {
  syncNowCalls = 0;

  private readonly _syncing = signal(false);
  private readonly _uploading = signal(false);
  private readonly _progress = signal(0);
  private readonly _lastError = signal<string | null>(null);

  readonly syncing = this._syncing.asReadonly();
  readonly uploading = this._uploading.asReadonly();
  readonly progress = this._progress.asReadonly();
  readonly lastError = this._lastError.asReadonly();

  setSyncing(value: boolean): void {
    this._syncing.set(value);
  }

  setUploading(value: boolean): void {
    this._uploading.set(value);
  }

  setProgress(value: number): void {
    this._progress.set(value);
  }

  setLastError(value: string | null): void {
    this._lastError.set(value);
  }

  async syncNow(): Promise<void> {
    this.syncNowCalls++;
  }

  dismissError(): void {
    this._lastError.set(null);
  }
}

describe('SyncOverlay', () => {
  let fixture: ComponentFixture<SyncOverlay>;
  let vaultSync: FakeVaultSyncService;

  /**
   * The dialog renders into the CDK overlay container — a sibling of the fixture's host,
   * not a descendant — and a closed one is not in the DOM at all, so "open" is presence.
   * See "Testing a spartan surface" in SPARTAN.md.
   */
  const overlay = () => document.querySelector<HTMLElement>('.cdk-overlay-container');
  const dialog = () =>
    overlay()?.querySelector<HTMLElement>('[aria-label="Saving your vault"]') ?? null;
  const isOpen = () => !!dialog();
  const text = () => dialog()?.textContent ?? '';
  const retryButton = () => dialog()!.querySelector<HTMLButtonElement>('.retry-sync')!;
  const dismissButton = () => dialog()!.querySelector<HTMLButtonElement>('.dismiss-sync')!;

  /** What a user pressing Escape actually produces, aimed where CDK listens for it. */
  const pressEscape = async () => {
    dialog()!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
  };

  beforeEach(async () => {
    vaultSync = new FakeVaultSyncService();

    await TestBed.configureTestingModule({
      imports: [SyncOverlay],
      providers: [{ provide: VaultSyncService, useValue: vaultSync }],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncOverlay);
    await fixture.whenStable();
  });

  it('stays closed when nothing is syncing', () => {
    expect(isOpen()).toBe(false);
  });

  it('opens as a non-dismissible modal once a save starts', async () => {
    vaultSync.setSyncing(true);
    await fixture.whenStable();

    expect(isOpen()).toBe(true);
    expect(text()).toContain('Encrypting your vault');
    // No close button either: there is nothing to press mid-save.
    expect(dialog()!.querySelector('[hlmdialogclose]')).toBeNull();

    // Escape must not be able to close it — this is what actually blocks input.
    await pressEscape();
    expect(isOpen()).toBe(true);
  });

  it('shows a live percentage once the upload actually starts', async () => {
    vaultSync.setSyncing(true);
    vaultSync.setUploading(true);
    vaultSync.setProgress(0.75);
    await fixture.whenStable();

    expect(text()).toContain('75%');
    expect(dialog()!.querySelector('[data-slot=progress]')).toBeTruthy();
  });

  it('closes once the save finishes', async () => {
    vaultSync.setSyncing(true);
    await fixture.whenStable();

    vaultSync.setSyncing(false);
    await fixture.whenStable();

    expect(isOpen()).toBe(false);
  });

  it('opens with the error and Retry/Dismiss actions after a failed save', async () => {
    vaultSync.setLastError('Could not save your vault to Google Drive.');
    await fixture.whenStable();

    expect(isOpen()).toBe(true);
    expect(text()).toContain('Could not save your vault to Google Drive.');
    expect(text()).not.toContain('Encrypting');

    // Not dismissible by Escape either — same as the in-progress state.
    await pressEscape();
    expect(isOpen()).toBe(true);
  });

  it('Retry calls syncNow() again', async () => {
    vaultSync.setLastError('Could not save your vault to Google Drive.');
    await fixture.whenStable();

    retryButton().click();

    expect(vaultSync.syncNowCalls).toBe(1);
  });

  it('Dismiss clears the error and closes without retrying', async () => {
    vaultSync.setLastError('Could not save your vault to Google Drive.');
    await fixture.whenStable();

    dismissButton().click();
    await fixture.whenStable();

    expect(isOpen()).toBe(false);
    expect(vaultSync.syncNowCalls).toBe(0);
  });
});
