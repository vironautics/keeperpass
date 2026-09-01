import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterPasswordService } from '../../../core/account/master-password.service';
import { ChangePasswordDialog } from './change-password-dialog';

type ProgressHandler = (fraction: number) => void;

/** Controllable in place of the real service, so tests can freeze mid-flow and inspect the UI. */
class FakeMasterPasswordService {
  lastOnProgress: ProgressHandler | undefined;
  private resolveChange: (() => void) | null = null;
  private rejectChange: ((error: Error) => void) | null = null;

  change(_current: string, _next: string, onProgress?: ProgressHandler): Promise<void> {
    this.lastOnProgress = onProgress;
    return new Promise((resolve, reject) => {
      this.resolveChange = resolve;
      this.rejectChange = reject;
    });
  }

  resolve(): void {
    this.resolveChange?.();
  }

  reject(error: Error): void {
    this.rejectChange?.(error);
  }

  progress(fraction: number): void {
    this.lastOnProgress?.(fraction);
  }
}

describe('ChangePasswordDialog', () => {
  let fixture: ComponentFixture<ChangePasswordDialog>;
  let masterPassword: FakeMasterPasswordService;

  /**
   * The dialog renders into the CDK overlay container — a sibling of the fixture's host,
   * not a descendant — so everything is looked up from `document`. See "Testing a
   * spartan surface" in SPARTAN.md.
   */
  const dialog = () =>
    document.querySelector<HTMLElement>(
      '.cdk-overlay-container [aria-label="Change Master Password"]',
    )!;
  const currentInput = () => dialog().querySelector<HTMLInputElement>('.current-password')!;
  const nextInput = () => dialog().querySelector<HTMLInputElement>('.next-password')!;
  const confirmationInput = () => dialog().querySelector<HTMLInputElement>('.repeat-password')!;
  const actionButtons = () => [
    ...dialog().querySelectorAll<HTMLButtonElement>('[data-slot=dialog-footer] button'),
  ];
  const submitButton = () => actionButtons().find((b) => b.type === 'submit')!;
  const cancelButton = () => actionButtons().find((b) => b.type === 'button')!;
  const uploadStatus = () => dialog().querySelector('output');
  const alertText = () =>
    [...dialog().querySelectorAll('[role="alert"], [data-slot=field-error]')]
      .map((n) => n.textContent?.trim())
      .join(' ');

  const open = async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
  };

  const type = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const fillValidForm = async () => {
    await type(currentInput(), 'old-secret');
    await type(nextInput(), 'a-reasonably-long-passphrase');
    await type(confirmationInput(), 'a-reasonably-long-passphrase');
  };

  beforeEach(async () => {
    masterPassword = new FakeMasterPasswordService();

    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialog],
      providers: [{ provide: MasterPasswordService, useValue: masterPassword }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialog);
    await fixture.whenStable();
  });

  it('keeps submit disabled until the repeat matches the new password', async () => {
    await open();
    expect(submitButton().disabled).toBe(true);

    await type(currentInput(), 'old-secret');
    await type(nextInput(), 'new-secret');
    expect(submitButton().disabled).toBe(true);

    await type(confirmationInput(), 'different');
    expect(submitButton().disabled).toBe(true);

    await type(confirmationInput(), 'new-secret');
    expect(submitButton().disabled).toBe(false);
  });

  it('shows "verifying" before any upload progress arrives', async () => {
    await open();
    await fillValidForm();

    submitButton().click();
    await fixture.whenStable();

    expect(uploadStatus()?.textContent).toContain('Verifying your current password');
  });

  it('switches to a live upload percentage once the upload actually starts', async () => {
    await open();
    await fillValidForm();

    submitButton().click();
    await fixture.whenStable();

    masterPassword.progress(0);
    await fixture.whenStable();
    expect(uploadStatus()?.textContent).toContain('0%');

    masterPassword.progress(0.5);
    await fixture.whenStable();
    expect(uploadStatus()?.textContent).toContain('50%');
    expect(uploadStatus()?.querySelector('[data-slot=progress]')).toBeTruthy();
  });

  it('reports success and closes once the change resolves', async () => {
    await open();
    await fillValidForm();

    submitButton().click();
    await fixture.whenStable();

    masterPassword.resolve();
    // Settling a promise the fixture didn't create itself (the fake
    // service's) can take an extra microtask beyond one `whenStable()` flush
    // — same real-world gap `unlock-page.spec.ts` works around with `vi.waitFor`.
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(fixture.componentInstance.open()).toBe(false);
    });
  });

  it('surfaces a rejection (e.g. wrong current password) without closing', async () => {
    await open();
    await fillValidForm();

    submitButton().click();
    await fixture.whenStable();

    masterPassword.reject(new Error('That is not your current master password.'));
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(alertText()).toContain('That is not your current master password.');
    });

    expect(fixture.componentInstance.open()).toBe(true);
    expect(uploadStatus()).toBeFalsy();
  });

  it('resets progress state each time it opens', async () => {
    await open();
    await fillValidForm();
    submitButton().click();
    await fixture.whenStable();
    masterPassword.reject(new Error('nope'));
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(alertText()).toContain('nope');
    });

    cancelButton().click();
    await fixture.whenStable();
    await open();

    expect(uploadStatus()).toBeFalsy();
    expect(currentInput().value).toBe('');
  });
});
