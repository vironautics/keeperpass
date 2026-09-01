import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Google's "G" mark, at its official four brand colours.
 *
 * Unlike `Logo`, this can't be drawn as a `currentColor` mask — the four
 * colours are part of Google's brand guidelines, not something a caller's
 * theme should override.
 */
@Component({
  selector: 'app-google-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './google-logo.html',
  styleUrl: './google-logo.scss',
  host: {
    role: 'img',
    'aria-label': 'Google',
  },
})
export class GoogleLogo {}
