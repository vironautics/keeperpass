import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ItemsList } from '../items-list/items-list';

/** Matches `/items/<id>`, the URL shape that puts an item in the detail pane. */
const ITEM_DETAIL_URL = /^\/items\/[^/?#]+/;

/**
 * Master/detail container for the vault.
 *
 * The list is always mounted; the detail pane is a child route, so opening an
 * item never rebuilds the list and the URL alone describes what is on screen.
 *
 * On narrow screens the detail pane slides in over the list, driven by the
 * `open` class — which is why this component needs to know whether an item is
 * showing. It reads that from the router's URL rather than from
 * `route.firstChild.snapshot`: a child route's snapshot is not yet populated
 * while its parent is being constructed, so reading it here would throw.
 */
@Component({
  selector: 'app-items-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ItemsList],
  templateUrl: './items-page.html',
  /**
   * Fills the shell's view area. `--inset-top` (from `app-shell`) clears a mobile
   * home-screen cutout, so `top` is set from it rather than by `inset-0`.
   */
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)]' },
})
export class ItemsPage {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly hasSelection = computed(() => ITEM_DETAIL_URL.test(this.currentUrl()));
}
