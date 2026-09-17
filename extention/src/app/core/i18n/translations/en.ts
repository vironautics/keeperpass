/**
 * The source table. Every other locale is typed as `TranslationTable`, so
 * adding a key here turns every other file in this folder into a compile
 * error until it is translated — missing copy cannot reach the popup silently.
 *
 * Covers the whole popup now: the list/detail/generator screens, the start
 * and unlock screens, every service-layer error message that can reach the
 * UI via `error.message`, and the model-layer label tables (`field.ts`,
 * `item-template.ts`, `vault-item.ts`'s audit tables). `src/scripts/*.ts`
 * (the background and content scripts) are deliberately not covered — they
 * run outside Angular's injector, so `I18nService` isn't reachable there, and
 * they have no user-facing strings of their own to begin with (DOM/form
 * detection and message plumbing only). One exception, noted where it lives:
 * `core/auth/google-oauth-flow.ts` is framework-agnostic on purpose (shared
 * with `background.ts`, see its own doc comment), so its two English literals
 * stay untranslated for the same reason.
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

  // Shared, reusable copy — see rule 4 in the i18n pass: prefer these over a
  // duplicate, feature-scoped key wherever the exact word already exists.
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.unnamed': 'Unnamed',
  'common.hideValue': 'Hide value',
  'common.revealValue': 'Reveal value',
  'common.hideSecret': 'Hide secret',
  'common.showSecret': 'Show secret',
  'common.genericError': 'Something went wrong. Please try again.',

  'auth.start.description': 'Welcome! Please sign in with Google to continue.',
  'auth.start.continueWithGoogle': 'Continue with Google',

  'auth.unlock.description': 'Enter your secret to unlock your vault.',
  'auth.unlock.secretLabel': 'Secret',
  'auth.unlock.unlock': 'Unlock',
  'auth.unlock.forgotSecret': 'Forgot your secret?',
  'auth.unlock.incorrectSecret': 'Incorrect secret. Please try again.',
  'auth.unlock.resetInWebApp': 'Open the KeeperPass web app to reset your secret.',

  // GoogleOAuthService — the popup-side messaging wrapper around
  // `background.ts`'s actual OAuth flow. `{details}` carries a raw HTTP
  // status or similar, not prose, so it stays uninterpolated-safe.
  'auth.oauth.signInInProgress': 'Sign-in is already in progress.',
  'auth.oauth.noBackgroundResponse': 'No response from the extension background script.',
  'auth.oauth.tokenExpired': 'Google authentication token has expired. Please sign in again.',
  'auth.oauth.cancelled': 'Google sign-in was cancelled.',
  'auth.oauth.networkError': 'Network error during authentication: {details}',
  'auth.oauth.unknownError': 'Unknown error',
  'auth.oauth.insufficientScope': 'Token does not have the required drive.file scope.',
  'auth.oauth.verifyTokenFailed': 'Failed to verify token',

  // Reused verbatim from the web app's already-translated `errors.*` — same
  // English wording, so the same table applies here unchanged.
  'errors.drive.authExpired': 'Your Google session has expired. Please reconnect.',
  'errors.drive.backupFailed':
    'Could not back up your existing vault in Google Drive. Please try again.',
  'errors.drive.createFolderFailed':
    'Could not create the keeperpass folder in Google Drive. Please try again.',
  'errors.drive.readFailed': 'Could not read your vault from Google Drive. Please try again.',
  'errors.drive.saveFailed': 'Could not save your vault to Google Drive. Please try again.',
  'errors.drive.unreachable': 'Could not reach Google Drive. Please try again.',
  'errors.auth.profileFailed': 'Could not read your Google profile. Please try again.',
  'errors.masterPassword.vaultNotFound': 'Could not find your vault in Google Drive.',
  'errors.masterPassword.wrongPassword': 'That is not your current master password.',

  // VaultUnlockService — not wired into any screen yet (see its own doc
  // comment), but translated for the same reason `item-template.ts` is:
  // consistency, and so it doesn't reopen this gap the day it is wired up.
  'vault.unlock.notFound':
    'Vault not found on Google Drive. Please ensure your vault is synced from the main KeeperPass app.',
  'vault.unlock.parseFailed': 'Failed to parse vault data. The vault file may be corrupted.',
  'vault.unlock.invalidStructure': 'Invalid vault data structure after decryption.',
  'vault.unlock.missingFields': 'Vault data is missing required fields.',

  /** `createEmptyVaultSnapshot()`'s default — see its own doc comment for when the default itself (rather than a translated call-site override) is what actually ships. */
  'vaults.defaultName': 'My Vault',

  'items.field.empty': '[empty]',
  'items.field.copyValueAria': 'Copy value',
  'items.totp.invalidCode': 'Invalid code',
  'items.list.sortOldestFirstAria': 'Sort oldest first',
  'items.list.sortNewestFirstAria': 'Sort newest first',

  // GeneratorPanel — casing (lower-case "passphrase"/"random string"/"length")
  // is this panel's own deliberate casual style, not an oversight; kept as-is
  // rather than normalized to Title Case.
  'generator.passphrase': 'passphrase',
  'generator.randomString': 'random string',
  'generator.wordSeparator': 'Word Separator',
  'generator.separatorPlaceholder': 'Separator',
  'generator.language': 'Language',
  'generator.languagePlaceholder': 'Language',
  'generator.words': 'Words',
  'generator.numberOfWordsAria': 'Number of words',
  'generator.length': 'length',
  'generator.passwordLengthAria': 'Password length',
  'generator.regenerate': 'Regenerate',
  'generator.copyPasswordAria': 'Copy password',

  // field.ts — FIELD_DEFINITIONS' `labelKey`. What the "add field" menu (and
  // any other by-type label) calls each kind of value.
  'field.type.username': 'Username',
  'field.type.password': 'Password',
  'field.type.email': 'Email Address',
  'field.type.url': 'URL',
  'field.type.ipHost': 'IP / Host',
  'field.type.date': 'Date',
  'field.type.month': 'Month',
  'field.type.credit': 'Credit Card Number',
  'field.type.phone': 'Phone Number',
  'field.type.pin': 'PIN',
  'field.type.totp': 'One-Time Password',
  'field.type.certificate': 'Certificate',
  'field.type.sshKey': 'SSH / Private Key',
  'field.type.recoveryCodes': 'Recovery Codes',
  'field.type.note': 'Richtext / Markdown',
  'field.type.text': 'Plain Text',

  // item-template.ts — ITEM_TEMPLATES' `labelKey`s and each template's own
  // field `nameKey`s. Not currently rendered anywhere in the popup
  // (`createNewItem()` opens the web app instead of a local template picker —
  // see `popup.ts`), but translated for the same reason as `VaultUnlockService`.
  'items.templates.website': 'Website / App',
  'items.templates.computer': 'Computer',
  'items.templates.creditCard': 'Credit Card',
  'items.templates.bankAccount': 'Bank Account',
  'items.templates.wifi': 'WIFI Password',
  'items.templates.passport': 'Passport',
  'items.templates.note': 'Note',
  'items.templates.authenticator': 'Authenticator',
  'items.templates.custom': 'Custom',

  'items.templates.fields.cardNumber': 'Card Number',
  'items.templates.fields.cardOwner': 'Card Owner',
  'items.templates.fields.validUntil': 'Valid Until',
  'items.templates.fields.cvc': 'CVC',
  'items.templates.fields.accountOwner': 'Account Owner',
  'items.templates.fields.iban': 'IBAN',
  'items.templates.fields.bic': 'BIC',
  'items.templates.fields.cardPin': 'Card PIN',
  'items.templates.fields.name': 'Name',
  'items.templates.fields.fullName': 'Full Name',
  'items.templates.fields.passportNumber': 'Passport Number',
  'items.templates.fields.country': 'Country',
  'items.templates.fields.birthdate': 'Birthdate',
  'items.templates.fields.birthplace': 'Birthplace',
  'items.templates.fields.issuedOn': 'Issued On',
  'items.templates.fields.expires': 'Expires',
  'items.templates.fields.note': 'Note',

  // vault-item.ts — the security audit's per-finding copy. Labels match the
  // web app's wording (reused below); the descriptions and empty-states are
  // this app's own, ported verbatim from the source app's copy (see
  // `AUDIT_DESCRIPTION_KEYS`'s doc comment) rather than the web app's rewrite.
  'audit.weakPassword.label': 'Weak Passwords',
  'audit.weakPassword.description':
    "Passwords are considered weak if they're too short, don't have a lot of variation or contain commonly used words or phrases. These passwords generally don't offer enough protection against automated guessing attempts and should be replaced with strong, randomly generated passwords.",
  'audit.weakPassword.empty': "You don't have any items with weak passwords!",
  'audit.reusedPassword.label': 'Reused Passwords',
  'audit.reusedPassword.description':
    'Using the same password in multiple places is strongly discouraged as a data leak in one of those places will automatically compromise all other accounts/logins using the same password. We recommend generating strong, random and unique passwords for every single vault item.',
  'audit.reusedPassword.empty': "You don't have any items with reused passwords!",
  'audit.compromisedPassword.label': 'Compromised Passwords',
  'audit.compromisedPassword.description':
    'Compromised passwords are those that have been identified as having been leaked in the past by comparing them against a database of known data breaches. These passwords can no longer be considered secure and should be changed immediately.',
  'audit.compromisedPassword.empty': "You don't have any items with compromised passwords!",
};

export type TranslationKey = keyof typeof en;

export type TranslationTable = Record<TranslationKey, string>;
