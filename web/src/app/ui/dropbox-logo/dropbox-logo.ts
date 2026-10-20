import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Dropbox's open-box mark, in its brand blue. Like `GoogleLogo`, the colour is
 * part of the brand guidelines rather than something a caller's theme should
 * override.
 */
@Component({
  selector: 'app-dropbox-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="block size-full">
      <path
        fill="#0061FF"
        d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z"
      />
    </svg>
  `,
  host: {
    role: 'img',
    'aria-label': 'Dropbox',
    class: 'inline-block size-5',
  },
})
export class DropboxLogo {}
