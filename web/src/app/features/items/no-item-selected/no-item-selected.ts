import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMousePointerClick } from '@ng-icons/lucide';
import { TranslatePipe } from '../../../core/i18n';

/** Fills the detail pane while no item is open. */
@Component({
  selector: 'app-no-item-selected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TranslatePipe],
  providers: [provideIcons({ lucideMousePointerClick })],
  template: `
    <div class="flex max-w-72 flex-col items-center gap-3 text-center">
      <span
        class="bg-card text-accent-strong ring-border mb-1 inline-flex size-16 items-center justify-center rounded-2xl shadow-xs ring-1"
        aria-hidden="true"
      >
        <ng-icon name="lucideMousePointerClick" size="1.75rem" strokeWidth="1.5" />
      </span>
      <p class="text-foreground text-base font-bold">{{ 'items.noSelection.title' | t }}</p>
      <p class="text-muted-foreground text-sm leading-relaxed">
        {{ 'items.noSelection.description' | t }}
      </p>
    </div>
  `,
  /** Fills the detail pane. See `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-background absolute inset-0 flex items-center justify-center p-6' },
})
export class NoItemSelected {}
