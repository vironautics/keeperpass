import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideExternalLink,
  lucideFileText,
  lucideGlobe,
  lucideScale,
  lucideShieldCheck,
} from '@ng-icons/lucide';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { TranslatePipe, TranslationKey } from '../../../core/i18n';

type PolicyTab = 'terms' | 'privacy';

/** One policy: its tab, what the card says about it, and where the full text lives. */
interface PolicyDocument {
  tab: PolicyTab;
  icon: string;
  title: TranslationKey;
  body: TranslationKey;
  href: string;
  /** The address as shown — the domain and path, which is what people check. */
  label: string;
}

/**
 * Terms and privacy, each summarised on a card that points at the one maintained copy on
 * the website rather than duplicating it in the app.
 */
@Component({
  selector: 'app-policies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmSidebarTrigger, HlmTabsImports, TranslatePipe],
  providers: [
    provideIcons({
      lucideExternalLink,
      lucideFileText,
      lucideGlobe,
      lucideScale,
      lucideShieldCheck,
    }),
  ],
  templateUrl: './policies-page.html',
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class PoliciesPage {
  readonly activeTab = signal<PolicyTab>('terms');

  protected readonly documents: readonly PolicyDocument[] = [
    {
      tab: 'terms',
      icon: 'lucideFileText',
      title: 'policies.termsTab',
      body: 'policies.termsBody',
      href: 'https://keeperpass.com/terms-of-service',
      label: 'keeperpass.com/terms-of-service',
    },
    {
      tab: 'privacy',
      icon: 'lucideShieldCheck',
      title: 'policies.privacyTab',
      body: 'policies.privacyBody',
      href: 'https://keeperpass.com/privacy-policy',
      label: 'keeperpass.com/privacy-policy',
    },
  ];

  selectTab(tab: PolicyTab): void {
    this.activeTab.set(tab);
  }

  protected onTabActivated(tab: string): void {
    if (tab === 'terms' || tab === 'privacy') {
      this.activeTab.set(tab);
    }
  }
}
