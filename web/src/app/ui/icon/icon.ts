import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICON_GLYPHS, IconName } from './icon-glyphs';

/**
 * Renders a single glyph from the icon font.
 *
 * Icons are decorative by default and hidden from assistive technology — the
 * surrounding control is responsible for its own accessible name. Pass `label`
 * only when the icon is the sole carrier of meaning.
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
  readonly name = input.required<IconName>();

  /** Set when the icon carries meaning no adjacent text conveys. */
  readonly label = input<string>('');

  protected readonly glyph = computed(() => ICON_GLYPHS[this.name()]);
}
