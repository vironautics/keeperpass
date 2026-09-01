import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  inject,
} from '@angular/core';
import { AutoLockService } from './core/auth/auto-lock.service';
import { SessionStore } from './core/auth/session.store';
import { ThemeService } from './core/theme/theme.service';
import { StartPage } from './features/auth/start/start-page';
import { UnlockPage } from './features/auth/unlock/unlock-page';
import { PopupComponent } from './popup/popup';
import { Logo } from './ui/logo/logo';

/**
 * Root of the popup.
 *
 * The web app routes between its screens; the popup has no router, so it
 * swaps them on `SessionStore.phase()` instead. The screens themselves are
 * the web app's own, so the two read identically:
 *
 * - `signed-out`       -> `StartPage`, the same "Continue with Google" card
 * - `awaiting-secret`  -> `UnlockPage`, the same secret prompt
 * - `ready`            -> the popup's vault list
 *
 * Signed-out and awaiting-secret sit on the same logo-over-card layout the
 * web app uses (`auth-layout`), inlined here since there is no router outlet
 * to fill.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopupComponent, StartPage, UnlockPage, Logo],
  template: `
    <div class="flex h-full w-full flex-col">
      @switch (phase()) {
        @case ('ready') {
          <app-popup />
        }
        @case ('signed-out') {
          <div class="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto p-4">
            <app-logo class="h-8 text-foreground" />
            <app-start-page />
          </div>
        }
        @default {
          <div class="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto p-4">
            <app-logo class="h-8 text-foreground" />
            <app-unlock-page />
          </div>
        }
      }
    </div>
  `,
})
export class AppComponent {
  private readonly sessionStore = inject(SessionStore);

  /**
   * Injected for its side effect: `ThemeService`'s constructor is what stamps
   * `dark` onto `<html>`, and spartan.css's tokens key off that class.
   * Without something instantiating it, the popup is stuck in light mode no
   * matter what the OS is set to.
   */
  private readonly theme = inject(ThemeService);

  /**
   * Auto-lock runs on the popup's own idle time. The popup is destroyed on
   * close, so this only covers a popup left open — the longer-lived case is
   * `chrome.storage.session`, which the browser clears on restart.
   */
  private readonly autoLock = inject(AutoLockService);

  private readonly document = inject(DOCUMENT);

  constructor() {
    this.autoLock.start();

    afterNextRender(() => {
      /**
       * `index.html`'s pre-bootstrap spinner is removed rather than hidden — it
       * was only ever "covered by <app-root>", which stops being true once a
       * view draws its own background instead of inheriting one from a global
       * sheet.
       */
      this.document.querySelector('.boot-spinner')?.remove();

      /**
       * The pre-bootstrap backdrop goes with it: the attribute is what its
       * rules match on, so dropping it hands the page back to `body`'s own
       * `bg-background`, which follows a theme change afterwards. Leaving it
       * would pin <html> to whichever theme the popup happened to open in.
       */
      delete this.document.documentElement.dataset['bootTheme'];
    });
  }

  protected readonly phase = computed(() => this.sessionStore.phase());
}
