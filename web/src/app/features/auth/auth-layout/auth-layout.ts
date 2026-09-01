import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from '../../../ui/logo/logo';

/**
 * Chrome shared by every unauthenticated screen: full-bleed backdrop, centred
 * single-column content, and the brand mark. Each step renders into the outlet
 * below the logo.
 */
@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Logo],
  templateUrl: './auth-layout.html',
  /** The document does not scroll; this layout owns its own overflow. */
  host: { class: 'absolute inset-0' },
})
export class AuthLayout {}
