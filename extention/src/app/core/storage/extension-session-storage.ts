/**
 * `chrome.storage.session` — the only correct home for extension state that
 * must outlive a popup but must never reach disk.
 *
 * Two MV3 facts drive this:
 *
 * 1. **The popup is destroyed when it closes.** `sessionStorage` is scoped to
 *    a browsing context, so a popup gets an empty one every time it opens.
 *    Anything kept there is lost the moment the user clicks away.
 * 2. **Service workers are not persistent.** Chrome terminates the worker
 *    after ~30s idle, so module-level variables in `background.ts` vanish
 *    between events. The worker also has no `sessionStorage` at all — the Web
 *    Storage API is not available there.
 *
 * `chrome.storage.session` is shared across the popup, the service worker and
 * (if explicitly allowed) content scripts, is held in memory rather than on
 * disk, and is cleared when the browser restarts or the extension reloads —
 * which is exactly the lifetime a master secret should have.
 *
 * Access level is left at Chrome's default, `TRUSTED_CONTEXTS`, so content
 * scripts running in web pages cannot read any of this.
 */

declare const chrome: {
  storage?: {
    session?: {
      get(keys: string[] | null): Promise<Record<string, unknown>>;
      set(items: Record<string, unknown>): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
    };
  };
};

/** Keys shared between the Angular app and the service worker. */
export const SESSION_KEYS = {
  accessToken: 'keeperpass:accessToken',
  secret: 'keeperpass:secret',
  vaultData: 'keeperpass:vaultData',
} as const;

/** Absent outside the extension (unit tests, a plain browser tab). */
function area() {
  return typeof chrome !== 'undefined' ? chrome.storage?.session : undefined;
}

export async function sessionGet<T>(key: string): Promise<T | undefined> {
  const store = area();
  if (!store) {
    return undefined;
  }

  try {
    return (await store.get([key]))[key] as T | undefined;
  } catch {
    // A storage failure must not take the app down with it; callers treat a
    // missing value the same as "nothing stored yet".
    return undefined;
  }
}

export async function sessionSet(key: string, value: unknown): Promise<void> {
  try {
    await area()?.set({ [key]: value });
  } catch {
    // Ignored deliberately — see `sessionGet`.
  }
}

export async function sessionRemove(...keys: string[]): Promise<void> {
  try {
    await area()?.remove(keys);
  } catch {
    // Ignored deliberately — see `sessionGet`.
  }
}
