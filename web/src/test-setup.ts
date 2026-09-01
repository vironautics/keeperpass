import { afterEach } from 'vitest';

/**
 * Shims for platform APIs jsdom does not implement.
 *
 * These stand in for browser behaviour so component tests can run headlessly;
 * the real behaviour is exercised in a browser. Nothing here is imported by
 * application code.
 */

/** jsdom has no layout engine, so ResizeObserver has nothing to report. */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof globalThis.ResizeObserver;
}

/**
 * Also no layout engine, so no scrolling: jsdom leaves `scrollIntoView`
 * undefined. spartan's select calls it on the active option as it opens, and
 * without this the overlay never finishes attaching.
 */
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView(): void {};
}

/**
 * jsdom parses <dialog> but implements neither modal display nor the top layer.
 * Toggling `open` and firing `close` is enough for tests to observe open state
 * and dismissal; focus trapping and the backdrop are browser-only.
 */
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement): void {
    this.open = true;
  };

  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement): void {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function close(
    this: HTMLDialogElement,
    returnValue?: string,
  ): void {
    if (!this.open) {
      return;
    }
    this.open = false;
    if (returnValue !== undefined) {
      this.returnValue = returnValue;
    }
    this.dispatchEvent(new Event('close'));
  };
}

/**
 * Unlike Angular's `TestBed`, jsdom's `sessionStorage`/`localStorage` aren't
 * reset between tests — `SessionStore` persists the Google access token in
 * `sessionStorage` and `RecentItemsService` persists recent item ids in
 * `localStorage`, so without this, one test's state would leak into the next
 * test's (or even the next file's) initial state.
 */
afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});
