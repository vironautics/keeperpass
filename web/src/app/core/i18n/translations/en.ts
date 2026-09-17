/**
 * The source table. Every other locale is typed as `TranslationTable`, so
 * adding a key here turns every other file in this folder into a compile
 * error until it is translated — missing copy cannot reach the app silently.
 *
 * Keys are dot-namespaced by where they appear (`settings.profile.*`), except
 * `common.*`, which is for words reused across features, and `errors.*`, for
 * messages thrown by services (Drive, auth) that surface via `Error.message`
 * in a catch block rather than being written in a template. Every screen,
 * the `core/models` domain vocabulary (field types, item templates,
 * security-report copy), browser-tab titles (see `app.routes.ts` and
 * `LocalizedTitleStrategy`), and these service error strings are translated.
 *
 * The phone field's country list is not a translation table at all: its
 * names come from `Intl.DisplayNames`, the browser's own CLDR data, via
 * `countryName()` in `core/models/country-codes.ts` — the right source for
 * ~240 country names in 5+ languages, not something to hand-maintain here.
 *
 * Deliberately NOT translated: proper nouns (card network names, "keeperpass"
 * itself) and the Font Awesome icon-picker's search terms — neither is prose
 * meant to read differently per locale.
 */
export const en = {
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.edit': 'Edit',
  'common.remove': 'Remove',
  'common.move': 'Move',
  'common.create': 'Create',
  'common.unnamed': 'Unnamed',
  'common.signedIn': 'Signed in',
  'common.name': 'Name',
  'common.tags': 'Tags',
  'common.fields': 'Fields',
  'common.favorite': 'Favorite',
  'common.openNavMenu': 'Open navigation menu',
  'common.leaveSelectionMode': 'Leave selection mode',
  'common.selectOrDeselectAll': 'Select or deselect all',
  'common.hideSecret': 'Hide secret',
  'common.showSecret': 'Show secret',
  'common.hideValue': 'Hide value',
  'common.revealValue': 'Reveal value',
  'common.hidePassword': 'Hide password',
  'common.showPassword': 'Show password',
  'common.generateSecret': 'Generate a secret',
  'common.disconnect': 'Disconnect',
  'common.genericError': 'Something went wrong. Please try again.',
  'common.fieldCopied': '{field} copied',
  'common.copiedFromItem': 'From {item}',

  'auth.start.title': 'Welcome to KeeperPass',
  'auth.start.description':
    'Your vault is a single encrypted file in your own Google Drive. Sign in to open it.',
  'auth.start.signInFailed': 'Sign-in failed',
  'auth.start.continueWithGoogle': 'Continue with Google',
  'auth.start.accessNote':
    'Access is limited to the files KeeperPass creates. The rest of your Drive stays out of reach.',
  'auth.start.encryptionNote':
    'Your vault is encrypted in this browser with a secret you choose next. Google stores the file; it cannot read it.',
  'auth.start.noServerNote': 'There is no KeeperPass server. Nothing is sent anywhere else.',
  'auth.start.footerNote': 'Signing in creates the vault file if you do not have one yet.',

  'auth.unlock.title': 'Unlock your vault',
  'auth.unlock.description': 'Enter your secret to unlock your vault.',
  'auth.unlock.emailLabel': 'Email address',
  'auth.unlock.secretLabel': 'Secret',
  'auth.unlock.unlock': 'Unlock',
  'auth.unlock.forgotSecret': 'Forgot your secret?',
  'auth.unlock.incorrectSecret': 'Incorrect secret. Please try again.',

  'auth.setup.title': 'Create your vault',
  'auth.setup.description':
    'Choose the secret that will encrypt your vault. Everything you save is locked with it.',
  'auth.setup.settingUpFor': 'Setting up for',
  'auth.setup.secretLabel': 'Secret',
  'auth.setup.repeatSecret': 'Repeat secret',
  'auth.setup.weakWarning':
    'This secret is weak, which makes the encryption around your vault easier to break. You can continue, but a longer passphrase is strongly recommended.',
  'auth.setup.mismatch': 'The two secrets do not match.',
  'auth.setup.readBeforeContinue': 'Please read this before you continue',
  'auth.setup.warningIntro':
    'Your vault is encrypted on this device with a key made from the secret you choose here. KeeperPass never receives that secret, so we could not read your vault even if we were asked to. That is the point — and it comes with three consequences worth knowing now rather than later:',
  'auth.setup.warningBullet1':
    'Your secret is never sent anywhere and is never stored. Nobody — not us, not Google — can look it up or reset it for you.',
  'auth.setup.warningBullet2':
    'If you forget it, your vault cannot be recovered. There is no reset link and no support request that can open it.',
  'auth.setup.warningBullet3': 'Write it down and keep it somewhere safe before you continue.',
  'auth.setup.createVault': 'Create vault',
  'auth.setup.genericError': 'Could not create your vault. Please try again.',

  'auth.recover.backToUnlock': 'Back to unlock',
  'auth.recover.title': 'Recover account',
  'auth.recover.description': 'Please confirm your account and choose a new secret.',
  'auth.recover.emailLabel': 'Email address',
  'auth.recover.newSecretLabel': 'New secret',
  'auth.recover.weakWarning':
    'This secret is weak, which makes the encryption around your vaults easier to break. You can continue, but a longer passphrase is strongly recommended.',
  'auth.recover.repeatSecretLabel': 'Repeat new secret',
  'auth.recover.warningIntro':
    'Your vault is encrypted with a key that only your secret can produce. Nobody else holds a copy — not us, not Google — which is what keeps your data yours, and it also means a forgotten secret cannot be reset. Continuing here does not recover your vault. It does this:',
  'auth.recover.bullet1':
    "Your current vault becomes inaccessible under this new secret — you'll start again with a brand new, empty vault.",
  'auth.recover.bullet2Prefix':
    "Your existing vault file isn't deleted. It's kept as a timestamped backup in your",
  'auth.recover.bullet2Suffix':
    'folder in Google Drive, in case the old secret ever comes back to you.',
  'auth.recover.submit': 'Recover account',
  'auth.recover.genericError': 'Could not recover your account. Please try again.',

  'items.pageTitle': 'Vault',
  'generator.pageTitle': 'Password Generator',
  'generator.passphrase': 'Passphrase',
  'generator.randomString': 'Random string',
  'generator.dialogCharacters': 'Characters',
  'generator.dialogWords': 'Words',
  'generator.wordSeparator': 'Word separator',
  'generator.separatorPlaceholder': 'Separator',
  'generator.language': 'Language',
  'generator.languagePlaceholder': 'Language',
  'generator.words': 'Words',
  'generator.numberOfWordsAria': 'Number of words',
  'generator.length': 'Length',
  'generator.passwordLengthAria': 'Password length',
  'generator.pickAtLeastOneChar': 'Pick at least one kind of character.',
  'generator.symbols': 'Symbols',
  'generator.nothingToGenerate': 'Nothing to generate.',
  'generator.regenerate': 'Regenerate',
  'generator.copyPasswordAria': 'Copy password',

  'items.generatePassword.ariaLabel': 'Generate Password',
  'items.generatePassword.title': 'Generate a password',
  'items.generatePassword.description': 'Nothing is filled in until you accept it.',
  'items.generatePassword.useThisPassword': 'Use this password',

  'items.createItem.title': 'New Vault Item',
  'items.createItem.description': 'Pick the vault it belongs in and the kind of item you want to add.',
  'items.createItem.vaultLabel': 'Vault',
  'items.selectVaultPlaceholder': 'Select a vault',
  'items.createItem.itemType': 'Item type',
  'items.templates.website': 'Website or App',
  'items.templates.computer': 'Computer',
  'items.templates.creditCard': 'Credit Card',
  'items.templates.bankAccount': 'Bank Account',
  'items.templates.wifi': 'Wi-Fi Network',
  'items.templates.passport': 'Passport',
  'items.templates.note': 'Note',
  'items.templates.authenticator': 'Authenticator',
  'items.templates.custom': 'Custom',

  'field.type.username': 'Username',
  'field.type.password': 'Password',
  'field.type.email': 'Email',
  'field.type.url': 'URL',
  'field.type.ipHost': 'IP / Host',
  'field.type.date': 'Date',
  'field.type.month': 'Month',
  'field.type.credit': 'Card Number',
  'field.type.phone': 'Phone',
  'field.type.pin': 'PIN',
  'field.type.totp': 'Authenticator Code',
  'field.type.certificate': 'Certificate',
  'field.type.sshKey': 'SSH / Private Key',
  'field.type.recoveryCodes': 'Recovery Codes',
  'field.type.note': 'Formatted Note',
  'field.type.text': 'Text',

  'items.templates.fields.cardholder': 'Cardholder',
  'items.templates.fields.expiresOn': 'Expires On',
  'items.templates.fields.cvc': 'CVC',
  'items.templates.fields.accountHolder': 'Account Holder',
  'items.templates.fields.iban': 'IBAN',
  'items.templates.fields.bic': 'BIC',
  'items.templates.fields.cardPin': 'Card PIN',
  'items.templates.fields.networkName': 'Network Name',
  'items.templates.fields.fullName': 'Full Name',
  'items.templates.fields.passportNumber': 'Passport Number',
  'items.templates.fields.issuingCountry': 'Issuing Country',
  'items.templates.fields.dateOfBirth': 'Date of Birth',
  'items.templates.fields.placeOfBirth': 'Place of Birth',
  'items.templates.fields.issuedOn': 'Issued On',

  'vaults.createVault.title': 'New Vault',
  'vaults.createVault.description':
    'A vault is a separate group of items. Unlike an item, there is nothing else to choose up front.',
  'vaults.nameLabel': 'Vault name',
  'vaults.defaultName': 'My Vault',
  'vaults.duplicateError': 'A vault with this name already exists.',

  'items.field.changeIcon': 'Change icon',
  'items.field.namePlaceholder': 'Field name',
  'items.field.pickMonth': 'Pick a month',
  'items.field.pickDate': 'Pick a date',
  'items.field.countryCodeAria': 'Country code',
  'items.field.searchCountries': 'Search countries',
  'items.field.noCountryMatch': 'No country matches that.',
  'items.field.phoneNumber': 'Phone number',
  'items.field.defaultPlaceholder': 'Enter value here',
  'items.field.generatePasswordAria': 'Generate a password',
  'items.field.cardNumber': 'Card number',
  'items.field.emailAddress': 'Email address',
  'items.field.valueAria': 'Field value',
  'items.field.checksumFail': 'That number fails its checksum — one of the digits is probably wrong.',
  'items.field.notEmail': 'That does not look like an email address.',
  'items.field.makeNotSecret': 'Make this field not secret',
  'items.field.makeSecret': 'Make this field secret',
  'items.field.remove': 'Remove field',
  'items.field.empty': '[empty]',
  'items.field.failsChecksumInline': '— fails its checksum',
  'items.field.copyValueAria': 'Copy value',
  'items.field.copyFieldAria': 'Copy {field}',
  'items.field.fieldFallback': 'Field',
  'items.field.ipHostPlaceholder': 'e.g. 192.168.1.1, ::1, or db.example.com',
  'items.field.recoveryCodesPlaceholder': 'One per line — any format works',
  'items.totp.invalidCode': 'Invalid code',
  'strength.veryWeak': 'Very weak',
  'strength.weak': 'Weak',
  'strength.fair': 'Fair',
  'strength.strong': 'Strong',
  'strength.veryStrong': 'Very strong',

  'items.iconPicker.title': 'Choose Icon',
  'items.iconPicker.description': "Search Font Awesome's icon set by name, or by what it's used for.",
  'items.iconPicker.searchPlaceholder': 'Search icons — try "bank" or "padlock"',
  'items.iconPicker.noResults': 'No icons match "{search}".',
  'items.iconPicker.useDefault': 'Use default icon',

  'items.row.selectItemAria': 'Select {name}',
  'items.row.securityIssue': 'Security issue',
  'items.row.moreTagsAria': '{count} more tags',
  'items.row.noFields': 'No Fields',
  'items.row.newItemFallback': 'New Item',
  'items.noFieldsMessage': 'This item has no fields.',

  'items.view.notFound': 'This item no longer exists.',
  'items.view.notFoundHint': 'It may have been deleted from another device.',
  'items.view.backToListAria': 'Back to list',
  'items.view.namePlaceholder': 'Item name',
  'items.view.editItemAria': 'Edit item',
  'items.view.moreOptionsAria': 'More options',
  'items.view.removeTagAria': 'Remove tag {tag}',
  'items.view.addTag': 'Add tag',
  'items.view.searchOrTypeTag': 'Search or type a new tag',
  'items.view.tagTooLong': 'That name is too long.',
  'items.view.noTagsYetType': 'No tags yet — type one.',
  'items.view.createTag': 'Create "{name}"',
  'items.view.noTags': 'No tags.',
  'items.view.addField': 'Add Field',
  'items.view.historyTitle': 'History',
  'items.view.currentVersion': 'Current Version',
  'items.view.deleteVersionAria': 'Delete version from {date}',
  'items.view.moveToVaultAction': 'Move To Vault …',
  'items.view.deleteItemAction': 'Delete Item',
  'items.view.addFieldDescription': 'Pick the kind of value the new field holds.',
  'items.view.removeFieldTitle': 'Remove Field',
  'items.view.removeFieldConfirm': 'Are you sure you want to remove this field?',
  'items.view.moveToVaultTitle': 'Move To Vault',
  'items.view.moveToVaultDescription': 'Pick the vault this item should live in.',
  'items.view.noOtherVault':
    'There is no other vault to move this item to. Create one from the sidebar first.',
  'items.view.deleteItemTitle': 'Delete Item',
  'items.view.deleteItemConfirm': 'Are you sure you want to delete "{name}"? This cannot be undone.',
  'items.view.versionHistoryAria': 'Version History',
  'items.view.restoreSuffix': '(restore)',
  'items.view.noFieldsHistory': 'No fields.',
  'items.view.restore': 'Restore',
  'items.view.deleteVersionAriaLabel': 'Delete Version',
  'items.view.deleteVersionTitle': 'Delete This Version',
  'items.view.deleteVersionConfirm':
    'Are you sure you want to delete this version from the history? This cannot be undone.',

  'items.list.selectMultipleAria': 'Select multiple items',
  'items.list.newItemAria': 'New item',
  'items.list.searchItemsAria': 'Search items',
  'items.list.sortOldestFirstAria': 'Sort oldest first',
  'items.list.sortNewestFirstAria': 'Sort newest first',
  'items.list.newestFirst': 'Newest first',
  'items.list.oldestFirst': 'Oldest first',
  'items.list.typeToSearch': 'Type to search',
  'items.list.cancelSearchAria': 'Cancel search',
  'items.list.moveSelectedAria': 'Move selected items',
  'items.list.deleteSelectedAria': 'Delete selected items',
  'items.list.searchNoResults': 'Your search did not match any items.',
  'items.list.vaultEmpty': 'This vault does not have any items yet.',
  'items.list.noFavourites': "You don't have any favorites yet.",
  'items.list.noRecent': "You don't have any recently used items!",
  'items.list.noItems': "You don't have any items yet.",
  'items.list.newVaultItem': 'New Vault Item',
  'items.list.pickVaultTheyLiveIn': 'Pick the vault they should live in.',
  'items.list.favorites': 'Favorites',
  'items.list.recentlyUsed': 'Recently Used',
  'items.list.allVaults': 'All Vaults',
  'items.list.vaultFallback': 'Vault',
  'items.list.itemSelectedOne': '{count} item selected',
  'items.list.itemSelectedMany': '{count} items selected',
  'items.list.moveOne': 'Move 1 item',
  'items.list.moveMany': 'Move {count} items',
  'items.list.deleteDialogAriaLabel': 'Delete Items',
  'items.list.deleteOneTitle': 'Delete 1 item',
  'items.list.deleteManyTitle': 'Delete {count} items',
  'items.list.deleteConfirmOne': 'Are you sure you want to delete this item? This cannot be undone.',
  'items.list.deleteConfirmMany': 'Are you sure you want to delete these items? This cannot be undone.',

  'report.title': 'Security Report',
  'report.flaggedBadgeOne': '{count} item flagged',
  'report.flaggedBadgeMany': '{count} items flagged',
  'report.allClearTitle': 'No problems found',
  'report.allClearDescription': 'Every password in your vaults passed the last audit.',
  'report.aboutSectionAria': 'About {title}',
  'report.nothingFound': 'Nothing found',
  'report.showAll': 'Show all {count}',

  'audit.weakPassword.label': 'Weak Passwords',
  'audit.weakPassword.description':
    'A password is weak when the space an attacker has to search is small: it is short, it draws on a narrow set of characters, or it is built from a word, name or keyboard run that sits in every cracking dictionary. Offline guessing runs at billions of attempts per second, so anything in that class falls quickly. Replace it with a long, randomly generated one.',
  'audit.weakPassword.empty': 'Every password in your vault is strong enough.',
  'audit.reusedPassword.label': 'Reused Passwords',
  'audit.reusedPassword.description':
    'One password used in several places means a single breach anywhere unlocks all of them — and you have no say in which of those services will be the one to leak. Give every item its own generated password so a leak stays contained to the account it came from.',
  'audit.reusedPassword.empty': 'Every password in your vault is used exactly once.',
  'audit.compromisedPassword.label': 'Compromised Passwords',
  'audit.compromisedPassword.description':
    'This password appears in a public record of breached credentials, which puts it on the lists attackers try first no matter how strong it looks. Change it everywhere it is used: a password only has to leak once to stay leaked.',
  'audit.compromisedPassword.empty': 'None of your passwords turned up in a known breach.',

  'tags.title': 'Tags',
  'tags.selectMultipleAria': 'Select multiple tags',
  'tags.addTagAria': 'Add tag',
  'tags.selectedOne': '{count} tag selected',
  'tags.selectedMany': '{count} tags selected',
  'tags.deleteSelectedAria': 'Delete selected tags',
  'tags.emptyTitle': 'No tags yet',
  'tags.emptyDescription':
    'Tags are created from an item, or here — either way they group items across vaults.',
  'tags.addTag': 'Add Tag',
  'tags.selectAria': 'Select {name}',
  'tags.itemsCountOne': '{count} item',
  'tags.itemsCountMany': '{count} items',
  'tags.renameAria': 'Rename {name}',
  'tags.deleteAria': 'Delete {name}',
  'tags.addTagDescription': "A tag with no items yet. Put it on an item from that item's own page.",
  'tags.tagNameLabel': 'Tag name',
  'tags.duplicateError': 'A tag with this name already exists.',
  'tags.add': 'Add',
  'tags.renameTagTitle': 'Rename Tag',
  'tags.renameTagDescription': 'Every item carrying it is updated.',
  'tags.renameMergeNotice': '"{name}" already exists — renaming will merge them.',
  'tags.deleteTagTitle': 'Delete "{name}"?',
  'tags.deleteTagConfirmOne':
    'It will be removed from {count} item. The items themselves are kept. This cannot be undone.',
  'tags.deleteTagConfirmMany':
    'It will be removed from {count} items. The items themselves are kept. This cannot be undone.',
  'tags.deleteSelectedTitleOne': 'Delete {count} tag?',
  'tags.deleteSelectedTitleMany': 'Delete {count} tags?',
  'tags.deleteSelectedConfirm':
    'Each one is removed from every item that has it. The items themselves are kept. This cannot be undone.',

  'vaults.title': 'My Vaults',
  'vaults.selectMultipleAria': 'Select multiple vaults',
  'vaults.newVaultAria': 'New vault',
  'vaults.selectedOne': '{count} vault selected',
  'vaults.selectedMany': '{count} vaults selected',
  'vaults.deleteSelectedAria': 'Delete selected vaults',
  'vaults.emptyTitle': 'You only have the default vault',
  'vaults.emptyDescription':
    'A second vault keeps a set of items apart — work from personal, or shared from private.',
  'vaults.newVault': 'New Vault',
  'vaults.selectAria': 'Select {name}',
  'vaults.itemsCountOne': '{count} item',
  'vaults.itemsCountMany': '{count} items',
  'vaults.createdOn': 'created {date}',
  'vaults.renameAria': 'Rename {name}',
  'vaults.deleteAria': 'Delete {name}',
  'vaults.renameVaultTitle': 'Rename Vault',
  'vaults.renameVaultDescription': 'The items in it are not affected.',
  'vaults.duplicateRenameError': 'A vault named "{name}" already exists.',
  'vaults.deleteVaultTitle': 'Delete "{name}"?',
  'vaults.deleteVaultConfirmOne':
    'Its {count} item moves to {personalVaultName}. This cannot be undone.',
  'vaults.deleteVaultConfirmMany':
    'Its {count} items move to {personalVaultName}. This cannot be undone.',
  'vaults.deleteSelectedTitleOne': 'Delete {count} vault?',
  'vaults.deleteSelectedTitleMany': 'Delete {count} vaults?',
  'vaults.deleteSelectedConfirmOne':
    'Everything in them — {count} item — moves to {personalVaultName}. This cannot be undone.',
  'vaults.deleteSelectedConfirmMany':
    'Everything in them — {count} items — moves to {personalVaultName}. This cannot be undone.',
  'vaults.personalSummaryOne': '{name} holds {count} item and cannot be renamed or deleted.',
  'vaults.personalSummaryMany': '{name} holds {count} items and cannot be renamed or deleted.',

  'settings.changePassword.title': 'Change Master Password',
  'settings.changePassword.description':
    'Your vault is re-encrypted under the new password and uploaded again. It cannot be recovered if you forget it.',
  'settings.changePassword.currentLabel': 'Current password',
  'settings.changePassword.newLabel': 'New password',
  'settings.changePassword.weakWarning':
    'This password is weak, which makes the encryption around your vaults easier to break. You can continue, but a longer passphrase is strongly recommended.',
  'settings.changePassword.repeatLabel': 'Repeat new password',
  'settings.changePassword.mismatch': 'The two passwords do not match.',
  'settings.changePassword.uploadingProgress': 'Saving to Google Drive… {percent}%',
  'settings.changePassword.verifying': 'Verifying your current password…',
  'settings.changePassword.submit': 'Change Password',
  'settings.changePassword.genericError': 'Could not change your master password. Please try again.',

  'settings.export.title': 'Export Data',
  'settings.export.description':
    "Writes a CSV of the chosen vault. Exported items leave the vault's encryption behind — what you do with the file is up to you.",
  'settings.export.sourceVaultLabel': 'Source vault',
  'settings.export.allVaultsPlaceholder': 'All Vaults',
  'settings.export.notEncryptedTitle': 'A CSV file is not encrypted',
  'settings.export.notEncryptedDescription':
    'Anyone who opens it can read every password in it. Keep it somewhere safe and delete it when you are done.',
  'settings.export.exportOne': 'Export {count} item',
  'settings.export.exportMany': 'Export {count} items',
  'settings.export.allVaultsFallback': 'All Vaults',
  'settings.export.vaultFallback': 'Vault',

  'settings.import.title': 'Import Data',
  'settings.import.description': 'Items are added to the vault you pick. Nothing is replaced.',
  'settings.import.targetVaultLabel': 'Target vault',
  'settings.import.myVaultPlaceholder': 'My Vault',
  'settings.import.foundPrefix': 'Found',
  'settings.import.foundSuffixOne': 'item to import.',
  'settings.import.foundSuffixMany': 'items to import.',
  'settings.import.importOne': 'Import {count} item',
  'settings.import.importMany': 'Import {count} items',
  'settings.import.noItemsFound': 'No items found in this file.',
  'settings.import.invalidCsv': 'This file could not be read as CSV.',

  'layout.sidebar.vaultsAndItems': 'Vaults & Items',
  'layout.sidebar.favoritesTooltip': 'Favorites',
  'layout.sidebar.myVaultsTooltip': 'My Vaults',
  'layout.sidebar.manageVaultsAria': 'Manage vaults',
  'layout.sidebar.toggleVaultsListAria': 'Toggle vaults list',
  'layout.sidebar.manageTagsAria': 'Manage tags',
  'layout.sidebar.toggleTagsListAria': 'Toggle tags list',
  'layout.sidebar.noTagsYet': 'No tags yet.',
  'layout.sidebar.toggleOrgAria': 'Toggle {name}',
  'layout.sidebar.more': 'More',
  'layout.sidebar.settings': 'Settings',
  'layout.sidebar.support': 'Support',
  'layout.sidebar.policies': 'Policies',
  'layout.sidebar.themePrefix': 'Theme: {theme}',
  'layout.sidebar.lockApp': 'Lock app',

  'layout.sync.savingTitle': 'Saving your vault',
  'layout.sync.encrypting': 'Encrypting your vault…',
  'layout.sync.notSavedTitle': 'Your vault was not saved',
  'layout.sync.dismiss': 'Dismiss',
  'layout.sync.retry': 'Retry',

  'policies.title': 'Policies',
  'policies.termsTab': 'Terms & Conditions',
  'policies.privacyTab': 'Privacy Policy',
  'policies.termsBody':
    'The Terms of Service are kept up to date in one place, outside the app, so they stay consistent no matter where you read them.',
  'policies.linkPrefix': 'Read the current version at',
  'policies.privacyBody':
    'The Privacy Policy is kept up to date in one place, outside the app, so it stays consistent no matter where you read it.',

  'support.title': 'Support',
  'support.dataLives.title': 'Where your data lives',
  'support.dataLives.description':
    'Keeperpass has no server. Your vault is a single encrypted file in your own Google Drive, and your browser is the only place it is ever readable.',
  'support.dataLives.browserTitle': 'Your browser',
  'support.dataLives.browserDescription':
    'Encrypts and decrypts everything. Your secret never leaves this device.',
  'support.dataLives.encryptedFile': 'encrypted file',
  'support.dataLives.driveTitle': 'Your Google Drive',
  'support.dataLives.driveDescriptionPrefix': 'Holds',
  'support.dataLives.driveDescriptionSuffix': '— unreadable ciphertext.',
  'support.dataLives.footer':
    'Keeperpass never receives your data. There is no account to breach and no operator who could read your vault, because there is nobody in the middle.',
  'support.protects.title': 'What protects it',
  'support.protects.secretTerm': 'Your secret',
  'support.protects.secretDescription':
    'Never transmitted, never stored. It exists only in memory while the app is unlocked.',
  'support.protects.kdfTerm': 'Key derivation',
  'support.protects.kdfDescription':
    'Argon2id, 64 MiB memory, 3 passes — deliberately slow to make guessing expensive.',
  'support.protects.encryptionTerm': 'Encryption',
  'support.protects.encryptionDescription':
    'AES-GCM, which detects tampering as well as preventing reading.',
  'support.protects.driveAccessTerm': 'Drive access',
  'support.protects.driveAccessDescriptionPrefix': 'Scoped to',
  'support.protects.driveAccessDescriptionSuffix':
    '— Keeperpass sees only the files it creates, nothing else in your Drive.',
  'support.signingIn.title': 'Signing in',
  'support.signingIn.description': 'Two separate things, for two separate reasons.',
  'support.signingIn.step1Title': 'Continue with Google',
  'support.signingIn.step1Description':
    'Grants permission to read and write your vault file. This proves who owns the Drive — it does not unlock anything.',
  'support.signingIn.step2Title': 'Enter your secret',
  'support.signingIn.step2Description':
    'Derives the key that decrypts the file, in your browser. Google never sees this, and neither do we.',
  'support.signingIn.footer':
    'Someone with your Google account still cannot read your vault. Someone with your secret still cannot reach the file. Both are needed.',
  'support.terms.title': 'Terms worth knowing',
  'support.terms.secretDescription': 'The one phrase that unlocks your vault. Not recoverable — see below.',
  'support.terms.vaultTerm': 'Vault',
  'support.terms.vaultDescription': 'A group of items. Create several to keep work and personal separate.',
  'support.terms.tagTermSingular': 'Tag',
  'support.terms.tagDescriptionPrefix': 'A label for filtering across vaults, like',
  'support.terms.tagDescriptionMiddle': 'or',
  'support.terms.reportTerm': 'Security report',
  'support.terms.reportDescription':
    'Flags weak, reused, and known-breached passwords. Runs entirely on your device.',
  'support.faq.title': 'Questions',
  'support.faq.forgetSecretQ': 'What if I forget my secret?',
  'support.faq.forgetSecretA1':
    'Your existing vault cannot be recovered. Not by you, not by us — the key is derived from your secret alone, so without it the file stays permanently unreadable. This is the cost of nobody else being able to read it either.',
  'support.faq.forgetSecretA2Prefix': 'What you can do is start over.',
  'support.faq.forgetSecretA2Strong': 'Forgot your secret?',
  'support.faq.forgetSecretA2Middle':
    'on the unlock screen sets up a new, empty vault under a new secret. Your old file is not deleted — it is renamed to',
  'support.faq.forgetSecretA2Suffix':
    'and left in your Drive folder, so if the old secret ever comes back to you, the data is still there.',
  'support.faq.forgetSecretA3':
    'Write your secret down and keep it somewhere safe. It is the one thing in Keeperpass that cannot be replaced.',
  'support.faq.seeQ': 'Can Keeperpass see my passwords?',
  'support.faq.seeA':
    'No — and not as a promise, as a consequence of the design. Encryption happens in your browser and the ciphertext goes straight to your Drive. There is no Keeperpass server in the path to see anything.',
  'support.faq.syncQ': 'Does it sync across devices?',
  'support.faq.syncA':
    'Yes. Every device reads the same file from your Drive. Sign in with the same Google account, enter the same secret, and your vault is there.',
  'support.faq.googleQ': 'What if Google reads the file?',
  'support.faq.googleA':
    'They would see encrypted bytes. The key is never sent to Google, so the contents stay unreadable to them.',
  'support.faq.importQ': 'Can I import from another password manager?',
  'support.faq.importA': 'Yes — export to CSV there, then use Import in Settings.',
  'support.faq.changeSecretQ': 'How do I change my secret?',
  'support.faq.changeSecretAPrefix': 'Open Settings and choose',
  'support.faq.changeSecretAStrong': 'Change Master Password',
  'support.faq.changeSecretASuffix':
    'You enter your current secret and the new one; your vault is decrypted, re-encrypted under the new secret, and saved back. Nothing is lost — every item comes with you, and the change applies on every device the next time it loads your vault.',
  'support.faq.costQ': 'What does it cost?',
  'support.faq.costA':
    'Nothing. Keeperpass is free and open-source, and it stores data in Drive space you already have.',
  'support.contact.title': 'Still stuck?',

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

  'errors.drive.authExpired': 'Your Google session has expired. Please reconnect.',
  'errors.drive.backupFailed':
    'Could not back up your existing vault in Google Drive. Please try again.',
  'errors.drive.renameFailed':
    'Could not rename your vault file in Google Drive. Nothing was changed — please try again.',
  'errors.drive.createFolderFailed':
    'Could not create the keeperpass folder in Google Drive. Please try again.',
  'errors.drive.readFailed': 'Could not read your vault from Google Drive. Please try again.',
  'errors.drive.saveFailed': 'Could not save your vault to Google Drive. Please try again.',
  'errors.drive.unreachable': 'Could not reach Google Drive. Please try again.',
  'errors.auth.profileFailed': 'Could not read your Google profile. Please try again.',
  'errors.auth.gisLoadFailed': 'Failed to load Google Identity Services.',
  'errors.auth.popupBlocked':
    'Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.',
  'errors.auth.popupClosed': 'The Google sign-in window was closed before finishing. Please try again.',
  'errors.auth.unknown': 'Something went wrong while contacting Google. Please try again.',
  'errors.masterPassword.vaultNotFound': 'Could not find your vault in Google Drive.',
  'errors.masterPassword.wrongPassword': 'That is not your current master password.',
};

export type TranslationKey = keyof typeof en;

export type TranslationTable = Record<TranslationKey, string>;
