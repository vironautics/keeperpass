import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Brand mark. Size it by setting `height` — the width follows the artwork's
 * aspect ratio, and the colour follows `currentColor`.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  host: {
    role: 'img',
    '[attr.aria-label]': 'label()',
  },
})
export class Logo {
  readonly label = input('Keeperpass');
}
