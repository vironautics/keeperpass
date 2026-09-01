import { Injectable } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';

/** What was copied, for the confirmation toast. */
export interface CopiedFrom {
  /** The field's name, e.g. `Password`. */
  field: string;
  /** The item it belongs to, e.g. `GitHub`. */
  item: string;
}

/**
 * Copying secrets to the system clipboard.
 *
 * A wrapper this thin earns its place by being the only door: every copy in the
 * app goes through here, so anything that has to be true of all of them has one
 * place to be written. Clearing the clipboard after a timeout is the obvious
 * next thing to want — it does not happen today, and it belongs here when it
 * does. Note that until then a copied password stays on the clipboard for any
 * other app to read.
 *
 * The confirmation toast is raised here rather than at each call site, because a
 * copy is silent and instant and the screen looks identical before and after —
 * without the toast there is no way to tell it worked. Nothing is announced when
 * the write throws, which is what the browser does when the document is not
 * focused, and a success message for a copy that did not happen would be worse
 * than silence.
 *
 * Needs a secure context: `navigator.clipboard` does not exist without one.
 */
@Injectable({ providedIn: 'root' })
export class ClipboardService {
  async copy(value: string, from?: CopiedFrom): Promise<void> {
    await navigator.clipboard.writeText(value);

    if (from) {
      toast.success(`${from.field} copied`, { description: `From ${from.item}` });
    }
  }
}
