import { Injectable } from '@angular/core';

/**
 * Copying secrets to the system clipboard.
 *
 * Centralised so the auto-clear timeout the original applies has one place to
 * live once it is brought over. Requires a secure context.
 */
@Injectable({ providedIn: 'root' })
export class ClipboardService {
  async copy(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }
}
