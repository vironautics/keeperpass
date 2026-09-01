import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { Icon } from '../../../ui/icon/icon';

/**
 * What this app is and how it keeps a vault private, in the order someone asks it.
 *
 * Static content, so there is no state here — the only interactive part is the FAQ
 * accordion, which spartan owns.
 */
@Component({
  selector: 'app-support-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, HlmAccordionImports, HlmButton, HlmCardImports, HlmSidebarTrigger],
  templateUrl: './support-page.html',
  /** Fills the shell's view area — see `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class SupportPage {}
