import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { VaultItem } from '../../../core/models';
import { itemFaviconUrl } from './item-favicon-url';
import { itemIconName } from './item-icon-name';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';

/**
 * The favicon or glyph that stands for an item. A favicon is preferred whenever
 * the item has a `Url` field — see `itemFaviconUrl` — falling back to the
 * FontAwesome glyph from `itemIconName` if there is none, or if it fails to load. There is no
 * setting to turn this off; it's always on.
 *
 * The caller sizes it (`class="size-8"`) and it fills that box either way, so a
 * favicon and a glyph occupy the same slot. `ItemRow` deliberately does not use
 * this: there the glyph is an `hlm-item-media`, whose `variant` has to switch
 * between `icon` and `image`, and that has to be a flex child of the row itself.
 */
@Component({
  selector: 'app-item-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    @if (showFavicon()) {
      <!--
        White tile in both themes — see the note in \`item-row.html\`. It belongs to
        the image and not to the host, because the glyph below takes its colour from
        the theme and would be invisible on white in dark mode.
      -->
      <img
        [src]="faviconUrl()"
        alt=""
        class="size-full rounded-md border border-black/10 bg-white object-contain p-1"
        (error)="onFaviconError()"
      />
    } @else {
      <app-icon [name]="glyph()" />
    }
  `,
  host: { class: 'flex items-center justify-center overflow-hidden rounded-md' },
})
export class ItemIcon {
  readonly item = input.required<VaultItem>();

  protected readonly glyph = computed<IconName>(() => itemIconName(this.item()));
  protected readonly faviconUrl = computed(() => itemFaviconUrl(this.item()));

  private readonly failedFaviconUrl = signal<string | undefined>(undefined);
  protected readonly showFavicon = computed(
    () => !!this.faviconUrl() && this.faviconUrl() !== this.failedFaviconUrl(),
  );

  protected onFaviconError(): void {
    this.failedFaviconUrl.set(this.faviconUrl());
  }
}
