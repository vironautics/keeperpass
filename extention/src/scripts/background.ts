/**
 * Background service worker for the KeeperPass extension
 * Handles sync, messaging, and extension-wide state
 */

// `chrome` is declared globally in `src/types/chrome.d.ts` — an ambient
// `.d.ts` file with no imports/exports of its own, so it contributes to the
// global scope for the whole program regardless of whether *this* file has
// imports. That used to not be true (see that file's own doc comment for the
// history); it's why this file can safely import the shared OAuth flow below
// without losing `chrome` typing.
import {
  buildAuthorizationUrl,
  getRedirectUrl,
  launchInteractiveAuth,
} from '../app/core/auth/google-oauth-flow';

interface VaultData {
  items: Array<{
    id: string;
    name: string;
    fields: Array<{ name: string; value: string }>;
  }>;
}

const CHROME_API_TIMEOUT_MS = 3000;

/**
 * Shared with the popup — see `core/storage/extension-session-storage.ts`.
 * Deliberately NOT module-level variables: Chrome terminates an idle service
 * worker after about 30 seconds, taking every global with it, so a secret
 * held in one would be gone by the time the user clicked autofill.
 * `chrome.storage.session` is in-memory (never written to disk), shared
 * between the worker and the popup, and cleared when the browser restarts.
 */
const SESSION_KEYS = {
  accessToken: 'keeperpass:accessToken',
  secret: 'keeperpass:secret',
  vaultData: 'keeperpass:vaultData',
} as const;

async function sessionGet<T>(key: string): Promise<T | null> {
  try {
    return ((await chrome.storage.session.get([key]))[key] as T) ?? null;
  } catch {
    return null;
  }
}

async function sessionSet(key: string, value: unknown): Promise<void> {
  try {
    await chrome.storage.session.set({ [key]: value });
  } catch {
    // A storage failure must not break messaging; the caller sees the
    // value as missing and re-prompts, which is the safe direction.
  }
}

/**
 * Send message to content script with timeout and error handling
 */
function sendMessageToTab<T>(
  tabId: number,
  message: Record<string, unknown>,
  timeoutMs: number = CHROME_API_TIMEOUT_MS,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Chrome message timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    chrome.tabs.sendMessage(tabId, message, (response: any) => {
      clearTimeout(timeoutId);

      if (chrome.runtime.lastError) {
        reject(new Error(`Chrome API error: ${chrome.runtime.lastError.message}`));
        return;
      }

      resolve(response as T);
    });
  });
}

/**
 * Runs the whole interactive Google sign-in here rather than in the popup.
 * `launchWebAuthFlow` opens a real, focusable browser window for Google's
 * consent screen — and an extension action popup closes the moment a new
 * window takes focus, which would destroy the popup's own JS context and the
 * in-flight promise with it. The service worker survives that; the popup
 * doesn't. Tokens are written to `chrome.storage.session` directly (not just
 * returned) so sign-in completes correctly even if the popup that requested
 * it has already closed — the user picks it back up by reopening the popup,
 * which reads the same storage on boot (`SessionStore.restore()`).
 */
async function handleGoogleSignIn(): Promise<{
  accessToken?: string;
  error?: string;
}> {
  try {
    const redirectUri = getRedirectUrl();
    const authUrl = buildAuthorizationUrl(redirectUri);

    const tokens = await launchInteractiveAuth(authUrl);
    await sessionSet(SESSION_KEYS.accessToken, tokens.accessToken);

    return { accessToken: tokens.accessToken };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Google sign-in failed.' };
  }
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  // Every storage-backed branch returns `true` to hold the message channel
  // open: `chrome.storage.session` is async, and a handler that returned
  // synchronously would close the port before `sendResponse` ran.
  if (request.action === 'googleSignIn') {
    handleGoogleSignIn().then(sendResponse);
    return true;
  }

  if (request.action === 'setMasterSecret') {
    sessionSet(SESSION_KEYS.secret, request.secret).then(() =>
      sendResponse({ success: true }),
    );
    return true;
  }

  if (request.action === 'getMasterSecret') {
    sessionGet<string>(SESSION_KEYS.secret).then((secret) =>
      sendResponse({ secret, isAuthenticated: secret !== null }),
    );
    return true;
  }

  if (request.action === 'setVaultData') {
    sessionSet(SESSION_KEYS.vaultData, request.data).then(() =>
      sendResponse({ success: true }),
    );
    return true;
  }

  if (request.action === 'getVaultData') {
    sessionGet<VaultData>(SESSION_KEYS.vaultData).then((vaultData) =>
      sendResponse({ vaultData }),
    );
    return true;
  }

  if (request.action === 'clearSession') {
    chrome.storage.session
      .remove([SESSION_KEYS.secret, SESSION_KEYS.vaultData])
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  if (request.action === 'autoFill' && sender.tab?.id) {
    sendMessageToTab<{ success: boolean }>(sender.tab.id, {
      action: 'autoFill',
      fields: request.fields,
    })
      .then((response) => {
        sendResponse({ success: response?.success || false });
      })
      .catch((error) => {
        console.error('Auto-fill forwarding failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }

  if (request.action === 'detectLoginForms' && sender.tab?.id) {
    sendMessageToTab<{ forms: unknown[] }>(sender.tab.id, {
      action: 'detectLoginForms',
    })
      .then((response) => {
        sendResponse(response || { forms: [] });
      })
      .catch((error) => {
        console.error('Form detection forwarding failed:', error);
        sendResponse({ forms: [], error: error.message });
      });
    return true; // Keep channel open for async response
  }

  return false;
});

/**
 * `onSuspend` fires when the worker is about to be unloaded — which happens
 * routinely, not just at shutdown, so this must not be relied on for
 * clearing secrets. `chrome.storage.session` already drops everything when
 * the browser restarts or the extension reloads; this is belt-and-braces for
 * the explicit-unload case.
 */
chrome.runtime.onSuspend.addListener(() => {
  void chrome.storage.session.remove([SESSION_KEYS.secret, SESSION_KEYS.vaultData]);
});

/**
 * Create context menu items with error handling
 */
function createContextMenus(): void {
  try {
    chrome.contextMenus.create({
      id: 'keeperpass-fill',
      title: 'KeeperPass: Fill Form',
      contexts: ['editable'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    });

    chrome.contextMenus.create({
      id: 'keeperpass-fill-password',
      title: 'KeeperPass: Fill Password',
      contexts: ['editable'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    });
  } catch (error) {
    console.error('Failed to create context menus:', error);
  }
}

// Initialize context menus on install
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info: any, tab: any) => {
  if (!tab?.id) {
    return;
  }

  if (
    info.menuItemId === 'keeperpass-fill' ||
    info.menuItemId === 'keeperpass-fill-password'
  ) {
    // Open the popup to let user select which item to fill with
    chrome.action.openPopup().catch((error: any) => {
      console.error('Failed to open popup:', error);
    });

    // Send message to content script that user initiated fill
    sendMessageToTab<{ success: boolean }>(tab.id, {
      action: 'contextMenuFill',
      elementId: info.elementId,
    }).catch((error: any) => {
      console.error('Context menu fill message failed:', error);
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.action.openPopup().catch((error: any) => {
    console.error('Failed to open popup:', error);
  });
});
