import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { VaultItem } from '../../../core/models';
import { Icon } from '../../../ui/icon/icon';
import { itemFaviconUrl } from './item-favicon-url';
import { itemIconName } from './item-icon-name';

/**
 * The favicon or glyph that stands for an item. A favicon is preferred
 * whenever the item has a `Url` field — see `itemFaviconUrl` — falling back
 * to the glyph from `itemIconName` if there is none, or if it fails to load.
 * There is no setting to turn this off; it's always on.
 */
@Component({
  selector: 'app-item-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './item-icon.html',
  styleUrl: './item-icon.scss',
})
export class ItemIcon {
  readonly item = input.required<VaultItem>();

  protected readonly icon = computed(() => itemIconName(this.item()));
  protected readonly faviconUrl = computed(() => itemFaviconUrl(this.item()));

  private readonly failedFaviconUrl = signal<string | undefined>(undefined);
  protected readonly showFavicon = computed(
    () => !!this.faviconUrl() && this.faviconUrl() !== this.failedFaviconUrl()
  );

  protected onFaviconError(): void {
    this.failedFaviconUrl.set(this.faviconUrl());
  }
}
