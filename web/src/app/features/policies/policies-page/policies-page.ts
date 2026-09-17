import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { TranslatePipe } from '../../../core/i18n';
import { Icon } from '../../../ui/icon/icon';

type PolicyTab = 'terms' | 'privacy';

/**
 * The two legal documents, behind one pair of tabs.
 *
 * `hlm-tabs` holds the selection; `activeTab` mirrors it so the rest of the component —
 * and anything driving this page programmatically — can still read and set which
 * document is showing.
 */
@Component({
  selector: 'app-policies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, HlmCardImports, HlmSidebarTrigger, HlmTabsImports, TranslatePipe],
  templateUrl: './policies-page.html',
  /** Fills the shell's view area — see `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class PoliciesPage {
  readonly activeTab = signal<PolicyTab>('terms');

  selectTab(tab: PolicyTab): void {
    this.activeTab.set(tab);
  }

  /** `tabActivated` emits the trigger's key, which is a plain string, so it is narrowed. */
  protected onTabActivated(tab: string): void {
    if (tab === 'terms' || tab === 'privacy') {
      this.activeTab.set(tab);
    }
  }
}
