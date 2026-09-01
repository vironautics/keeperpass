import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { Icon } from '../../../ui/icon/icon';

/** Fills the detail pane while no item is open. */
@Component({
  selector: 'app-no-item-selected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmEmptyImports, Icon],
  template: `
    <div hlmEmpty>
      <hlm-empty-header>
        <hlm-empty-media variant="icon">
          <app-icon name="note" class="text-2xl" />
        </hlm-empty-media>
        <div hlmEmptyTitle>No item selected</div>
        <div hlmEmptyDescription>Pick one from the list to see and edit it.</div>
      </hlm-empty-header>
    </div>
  `,
  /** Fills the detail pane. See `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-0 flex items-center justify-center p-6' },
})
export class NoItemSelected {}
