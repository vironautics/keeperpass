import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n';
import {
  DROPBOX_OAUTH_CHANNEL,
  DropboxOAuthMessage,
} from '../../../core/providers/dropbox/dropbox-oauth';
import { DOCUMENT } from '@angular/common';

/**
 * Where Dropbox sends the consent popup back to (`/oauth/dropbox`).
 *
 * Does one thing: hands the `code` (or the error) and `state` from the URL to
 * the window that opened the popup, over a same-origin `BroadcastChannel`, and
 * closes itself. It is routed outside every guard — the visitor is mid-sign-in
 * and in no phase the guards would let through — and it never touches the
 * session: the opener validates `state` and finishes the flow.
 */
@Component({
  selector: 'app-dropbox-callback-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `<p class="text-muted-foreground p-6 text-center text-sm">
    {{ 'auth.callback.closeWindow' | t }}
  </p>`,
  host: { class: 'block' },
})
export class DropboxCallbackPage {
  private readonly document = inject(DOCUMENT);

  constructor() {
    const params = new URLSearchParams(this.document.location.search);
    const message: DropboxOAuthMessage = {
      state: params.get('state') ?? '',
      code: params.get('code') ?? undefined,
      error: params.get('error') ?? undefined,
      errorDescription: params.get('error_description') ?? undefined,
    };

    // Nothing to report if Dropbox sent us here without a state: not our flow.
    if (message.state) {
      const channel = new BroadcastChannel(DROPBOX_OAUTH_CHANNEL);
      channel.postMessage(message);
      channel.close();
    }

    // Takes the one-time code out of the address bar and history, in case the
    // window cannot close itself.
    this.document.defaultView?.history.replaceState(null, '', this.document.location.pathname);
    this.document.defaultView?.close();
  }
}
