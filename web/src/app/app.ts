import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HlmToaster],
  templateUrl: './app.html',
  host: { class: 'block h-full' },
})
export class App {
  /** Instantiated here so the theme reaches <body> from first paint. */
  private readonly theme = inject(ThemeService);

  private readonly document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => {
      /**
       * `index.html`'s pre-bootstrap spinner is removed rather than hidden. It was
       * only ever "covered by <app-root>", which stopped being true once the views
       * drew their own backgrounds instead of inheriting one from a global sheet —
       * it showed through the sign-in screens.
       */
      this.document.querySelector('.boot-spinner')?.remove();

      /**
       * The pre-bootstrap backdrop goes with it: the attribute is what its rules
       * match on, so dropping it hands the page back to `body`'s own background,
       * which follows a theme change. Leaving it would pin <html> to whichever
       * theme the tab happened to open in.
       */
      delete this.document.documentElement.dataset['bootTheme'];
    });
  }
}
