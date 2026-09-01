/**
 * The source table. Every other locale is typed as `TranslationTable`, so
 * adding a key here turns every other file in this folder into a compile
 * error until it is translated — missing copy cannot reach the popup silently.
 *
 * Scoped to the popup: the start and unlock screens are still English, and are
 * the next surfaces to do.
 */
export const en = {
  'popup.sync': 'Sync with Google Drive',
  'popup.disconnect': 'Disconnect',
  'popup.language': 'Language',
  'popup.back': 'Back',

  'popup.search': 'Search…',
  'popup.allVaults': 'All Vaults',
  'popup.allTags': 'All Tags',

  'popup.unlocking': 'Unlocking your vault…',
  'popup.noItems': 'No items found.',
  // The placeholder name an item with no name of its own falls back to —
  // distinct from `popup.newItem`, the button that creates one.
  'popup.untitledItem': 'New Item',
  'popup.showDetails': 'Show details',
  'popup.fillOnPage': 'Fill on this page',

  'popup.generate': 'Generate',
  'popup.generatorLabel': 'Password generator',
  'popup.newItem': 'New Item',
  'popup.newItemLabel': 'Create a new item',

  'popup.noActiveTab': 'No active tab found',
  'popup.filling': 'Filling form…',
  'popup.filled': '✓ Credentials filled!',
  'popup.noLoginForm': '✗ No login form found or no credentials to fill',
  'popup.fillFailed': 'Auto-fill failed',
};

export type TranslationKey = keyof typeof en;

export type TranslationTable = Record<TranslationKey, string>;
