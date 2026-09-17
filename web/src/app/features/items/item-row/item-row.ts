import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { ClipboardService } from '../../../core/clipboard/clipboard.service';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import {
  Field,
  FieldType,
  fieldDefinition,
  formatFieldValue,
  VaultItem,
} from '../../../core/models';
import { generateTotp } from '../../../core/otp/totp';
import { tagColor } from '../../../core/vault/tag-color';
import { itemFaviconUrl } from '../item-icon/item-favicon-url';
import { itemIconName } from '../item-icon/item-icon-name';
import { Totp } from '../totp/totp';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';

/** How long the "copied" confirmation stays on a chip. */
const COPIED_FEEDBACK_MS = 1000;

/**
 * Starting estimate for the items list's virtual-scroll viewport, used only
 * for the very first render — `ItemsList` measures a real row straight after
 * and corrects it. Rows size to their content, so this is not a height the
 * row is held to.
 */
export const ITEM_ROW_HEIGHT_ESTIMATE = 121;

/**
 * One vault item, built from spartan's Item block: the header line is
 * media + content + badges, and the field chips wrap onto a second line as the
 * item's footer. Each chip is itself a nested `hlmItem` — a field is a
 * title/value pair, which is exactly what an item renders.
 */
@Component({
  selector: 'app-item-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmBadge,
    HlmCheckbox,
    HlmHoverCardImports,
    HlmItemImports,
    Icon,
    RouterLink,
    RouterLinkActive,
    Totp,
    TranslatePipe,
  ],
  templateUrl: './item-row.html',
  /** The row is the block the viewport measures; nothing else styles the host. */
  host: { class: 'block' },
})
export class ItemRow {
  readonly item = input.required<VaultItem>();
  /** `Organization / Vault`, shown above the item name. */
  readonly vaultLabel = input('');
  readonly favourite = input(false);

  /** Whether the security audit flagged this item — see `AuditService`. */
  readonly flagged = input(false);

  /** In selection mode the row toggles instead of opening the item. */
  readonly selectable = input(false);
  readonly selected = input(false);

  readonly selectionToggled = output<void>();

  protected readonly copiedFieldIndex = signal<number | null>(null);

  private readonly clipboard = inject(ClipboardService);
  private readonly i18n = inject(I18nService);

  /** An item with no name yet still needs something to click and to announce. */
  protected readonly unnamed = computed(() => !this.item().name);
  protected readonly displayName = computed(
    () => this.item().name || this.i18n.translate('items.row.newItemFallback'),
  );

  /** Used as the field-name fallback in the copy-chip aria-label. */
  protected readonly fieldFallback = computed(() => this.i18n.translate('items.field.fieldFallback'));

  /** The first tag is shown in full; the rest collapse into a `+n` badge. */
  protected readonly firstTag = computed(() => this.item().tags[0] ?? '');
  protected readonly extraTagCount = computed(() => Math.max(this.item().tags.length - 1, 0));

  /**
   * The favicon is preferred whenever the item has a `Url` field, falling back
   * to the glyph inferred from its field types if there is none, or if it
   * fails to load. Inlined here rather than nesting `<app-item-icon>`, which
   * draws with the legacy icon font.
   */
  protected readonly faviconUrl = computed(() => itemFaviconUrl(this.item()));
  protected readonly glyph = computed<IconName>(() => itemIconName(this.item()));
  protected readonly iconGlyph = computed(() => this.item().iconGlyph);

  private readonly failedFaviconUrl = signal<string | undefined>(undefined);
  protected readonly showFavicon = computed(
    () => !!this.faviconUrl() && this.faviconUrl() !== this.failedFaviconUrl(),
  );

  protected onFaviconError(): void {
    this.failedFaviconUrl.set(this.faviconUrl());
  }

  protected tagColor(tag: string): string {
    return tagColor(tag);
  }

  protected fieldGlyph(field: Field): IconName {
    return fieldDefinition(field.type).icon;
  }

  protected fieldIconGlyph(field: Field): string | undefined {
    return field.iconGlyph;
  }

  protected isTotp(field: Field): boolean {
    return field.type === FieldType.Totp;
  }

  /** Chips always mask secrets — the detail view is where values are revealed. */
  protected displayValue(field: Field): string {
    return formatFieldValue(field, true);
  }

  /**
   * Copies the field's value — or, for a TOTP field, the currently valid
   * *generated code* rather than the secret it's derived from, matching
   * what the row's `<app-totp>` chip actually displays.
   */
  protected async copyField(field: Field, index: number): Promise<void> {
    if (!field.value) {
      return;
    }

    let value: string;
    if (field.type === FieldType.Totp) {
      try {
        value = await generateTotp(field.value);
      } catch {
        return;
      }
    } else {
      value = field.value;
    }

    await this.clipboard.copy(value, {
      field: field.name || this.i18n.translate('items.field.fieldFallback'),
      item: this.displayName(),
    });

    this.copiedFieldIndex.set(index);
    setTimeout(() => {
      if (this.copiedFieldIndex() === index) {
        this.copiedFieldIndex.set(null);
      }
    }, COPIED_FEEDBACK_MS);
  }
}
