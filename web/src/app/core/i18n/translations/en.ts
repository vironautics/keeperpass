/**
 * The source table. Every other locale is typed as `TranslationTable`, so
 * adding a key here turns every other file in this folder into a compile
 * error until it is translated — missing copy cannot reach the app silently.
 *
 * Keys are dot-namespaced by where they appear (`settings.profile.*`), except
 * `common.*`, which is for words reused across features. Translated page by
 * page: only the Settings page is done so far.
 */
export const en = {
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',

  'settings.title': 'Settings',
  'settings.openMenu': 'Open navigation menu',

  'settings.language.title': 'Language',
  'settings.language.label': 'Display Language',
  'settings.language.hint':
    'Changes the language of the interface. Saved on this device only — it is not part of your vault.',

  'settings.profile.title': 'Profile',
  'settings.profile.email': 'Email',
  'settings.profile.displayName': 'Display Name',
  'settings.profile.managedByGoogle':
    'Taken from the Google account you signed in with. Change it in your Google account.',
  'settings.profile.logOut': 'Log Out',
  'settings.profile.deleteAccount': 'Delete Account',
  'settings.profile.deleteWarning':
    'Your data is yours: it lives as one encrypted file in your own Google Drive. Deleting your account renames that file so this app can no longer find it, and signs you out — nothing is erased. To delete the data itself, open Google Drive, go to the keeperpass folder, and delete the file there.',
  // Split around the literal token the user has to type, which is never
  // translated. All five locales can place that token mid-sentence, so a
  // prefix/suffix pair is enough and keeps the token emphasised in the markup.
  'settings.profile.deleteTypePrefix': 'Type',
  'settings.profile.deleteTypeSuffix': 'to confirm.',
  'settings.profile.confirmation': 'Confirmation',
  'settings.profile.deleteDone': 'Your vault file has been renamed',
  'settings.profile.deleteDoneHint':
    'It is still in the keeperpass folder in your Google Drive. Delete it there whenever you want the data gone for good.',
  'settings.profile.deleteError': 'Could not rename your vault file. Nothing was changed.',

  'settings.masterPassword.title': 'Master Password',
  'settings.masterPassword.description':
    'Your master password encrypts everything in your vaults and never leaves this device, so it cannot be recovered — only changed.',
  'settings.masterPassword.change': 'Change Master Password',

  'settings.data.title': 'Import / Export',
  'settings.data.import': 'Import…',
  'settings.data.export': 'Export…',
  'settings.data.history': 'Recent exports',
  'settings.data.historyEmpty': 'You have not exported anything yet.',
  'settings.data.historyHint': 'The last 10 exports are remembered, in your vault.',
  'settings.data.historyItems': 'items',
};

export type TranslationKey = keyof typeof en;

export type TranslationTable = Record<TranslationKey, string>;
