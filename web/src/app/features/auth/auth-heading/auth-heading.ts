import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

/**
 * The top of every auth step: an icon tile naming the step at a glance, the step's
 * `<h1>`, and its one-line description. Anything marked `authHeadingLead` (the recover
 * page's way back, for instance) is projected above the tile.
 *
 * The icon is a Lucide name; the page that uses it provides the glyph with
 * `provideIcons`, as helm's own components do.
 */
@Component({
  selector: 'app-auth-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  template: `
    <ng-content select="[authHeadingLead]" />
    <span
      class="bg-primary/15 text-accent-strong ring-primary/25 mb-6 inline-flex size-12 items-center justify-center rounded-2xl ring-1"
      aria-hidden="true"
    >
      <ng-icon [name]="icon()" size="1.375rem" strokeWidth="1.75" />
    </span>
    <h1
      class="text-foreground text-[1.75rem] leading-tight font-extrabold tracking-tight text-balance sm:text-[2rem]"
    >
      {{ heading() }}
    </h1>
    <p class="text-muted-foreground mt-2.5 text-[0.9375rem] leading-relaxed text-pretty">
      {{ description() }}
    </p>
  `,
  host: { class: 'flex flex-col items-start' },
})
export class AuthHeading {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
}
