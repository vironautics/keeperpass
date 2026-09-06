import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICON_GLYPHS, IconName } from './icon-glyphs';

/**
 * Renders a single glyph from the icon font.
 *
 * Icons are decorative by default and hidden from assistive technology — the
 * surrounding control is responsible for its own accessible name. Pass `label`
 * only when the icon is the sole carrier of meaning.
 *
 * Pass either `name` (this app's own curated vocabulary, `icon-glyphs.ts`) or
 * `codePoint` (a raw Font Awesome Solid hex code point picked in the source
 * app's full catalogue and stored on the item/field) — never both.
 * `codePoint` takes priority over `name`.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: {
    '[attr.role]': 'label() ? "img" : "presentation"',
  },
})
export class Icon {
  readonly name = input<IconName>();

  /** A raw Solid-face hex code point, e.g. `f023`. Takes priority over `name`. */
  readonly codePoint = input<string>();

  /** Set when the icon carries meaning no adjacent text conveys. */
  readonly label = input<string>('');

  protected readonly glyph = computed(() => {
    const codePoint = this.codePoint();
    if (codePoint) {
      return String.fromCodePoint(parseInt(codePoint, 16));
    }

    const name = this.name();
    return name ? ICON_GLYPHS[name] : '';
  });
}
