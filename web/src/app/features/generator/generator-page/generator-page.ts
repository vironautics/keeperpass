import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { Icon } from '../../../ui/icon/icon';
import { GeneratorPanel } from '../generator-panel/generator-panel';

/** Standalone passphrase / random-string generator, reachable from the sidebar. */
@Component({
  selector: 'app-generator-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GeneratorPanel, Icon, HlmSidebarTrigger],
  templateUrl: './generator-page.html',
  /** Fills the shell's view area — see `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class GeneratorPage {}
