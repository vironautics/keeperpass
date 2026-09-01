import { TestBed } from '@angular/core/testing';
import { PoliciesPage } from './policies-page';

describe('PoliciesPage', () => {
  let fixture: any;
  let component: PoliciesPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliciesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the page with tab navigation', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.tab-nav')).toBeTruthy();
    expect(host.textContent).toContain('Terms & Conditions');
    expect(host.textContent).toContain('Privacy Policy');
  });

  it('shows Terms & Conditions by default', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Acceptance of Terms');
  });

  it('switches to Privacy Policy when tab is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.tab-button');
    const privacyButton = buttons[1];

    privacyButton.click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe('privacy');
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('End-to-End Encryption');
  });

  it('has correct tab active state', () => {
    expect(component.activeTab()).toBe('terms');

    component.selectTab('privacy');
    expect(component.activeTab()).toBe('privacy');

    component.selectTab('terms');
    expect(component.activeTab()).toBe('terms');
  });

  it('includes policy content when tabs are switched', () => {
    const host = fixture.nativeElement as HTMLElement;
    // Terms tab is default
    expect(host.textContent).toContain('Acceptance of Terms');

    // Switch to privacy tab
    component.selectTab('privacy');
    fixture.detectChanges();
    expect(host.textContent).toContain('End-to-End Encryption');
  });
});
