import { TestBed } from '@angular/core/testing';
import { SupportPage } from './support-page';

describe('SupportPage', () => {
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportPage);
    fixture.detectChanges();
  });

  it('renders the page', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('header')).toBeTruthy();
    expect(host.textContent).toContain('Where your data lives');
  });

  it('displays the contact email', () => {
    const host = fixture.nativeElement as HTMLElement;
    const email = host.querySelector('a[href="mailto:contact@keeperpass.com"]');
    expect(email?.textContent).toContain('contact@keeperpass.com');
  });

  it('includes the FAQ', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Questions');
    expect(host.textContent).toContain('What does it cost?');
  });

  it('describes the two-party storage model rather than a server', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Keeperpass has no server');
    expect(host.textContent).toContain('Your browser');
    expect(host.textContent).toContain('Your Google Drive');
  });

  it('points at Settings for changing the secret, not the recovery flow', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Change Master Password');
  });

  it('warns that a forgotten secret is unrecoverable but keeps a backup', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('cannot be recovered');
    expect(host.textContent).toContain('vault.backup-');
  });
});
