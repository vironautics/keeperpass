import { Directive } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCollapsibleContent],hlm-collapsible-content',
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
	host: { 'data-slot': 'collapsible-content' },
})
export class HlmCollapsibleContent {
	constructor() {
		// Upstream is `data-[state=closed]:hidden`, which cannot animate: display is not
		// interpolable. A single-row grid collapsing 1fr -> 0fr is, and it needs no measured
		// height, no keyframes and no fill-mode — so nothing animates on first paint either,
		// which a keyframe on the closed state would. Closed content is also `inert` (set by
		// the brain directive), so it stays out of the tab order at zero height.
		//
		// `minmax(0, …)` rather than a bare `0fr`/`1fr`: an `fr` row is really
		// `minmax(auto, <fr>)`, so it never shrinks past its item's min-content height and a
		// collapsed section keeps a few pixels of the child's padding. Pinning the minimum to
		// 0 collapses it exactly. `[&>*]:min-h-0 [&>*]:overflow-hidden` puts the clipping on
		// the child, which is the box the row actually sizes.
		classes(
			() =>
				'grid grid-rows-[minmax(0,0fr)] overflow-hidden transition-[grid-template-rows] duration-200 ease-out [&>*]:min-h-0 [&>*]:overflow-hidden data-[state=open]:grid-rows-[minmax(0,1fr)] motion-reduce:transition-none',
		);
	}
}
