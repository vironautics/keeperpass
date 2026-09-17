import { TranslationTable } from './en';

/** Formal address (Sie), matching how German password managers address users. */
export const de: TranslationTable = {
  'popup.sync': 'Mit Google Drive synchronisieren',
  'popup.disconnect': 'Verbindung trennen',
  'popup.language': 'Sprache',
  'popup.back': 'Zurück',

  'popup.search': 'Suchen…',
  'popup.allVaults': 'Alle Tresore',
  'popup.allTags': 'Alle Schlagwörter',

  'popup.unlocking': 'Tresor wird entsperrt…',
  'popup.noItems': 'Keine Einträge gefunden.',
  'popup.untitledItem': 'Neuer Eintrag',
  'popup.showDetails': 'Details anzeigen',
  'popup.fillOnPage': 'Auf dieser Seite ausfüllen',

  'popup.generate': 'Erzeugen',
  'popup.generatorLabel': 'Passwortgenerator',
  'popup.newItem': 'Neuer Eintrag',
  'popup.newItemLabel': 'Neuen Eintrag erstellen',

  'popup.noActiveTab': 'Kein aktiver Tab gefunden',
  'popup.filling': 'Formular wird ausgefüllt…',
  'popup.filled': '✓ Zugangsdaten eingetragen!',
  'popup.noLoginForm': '✗ Kein Anmeldeformular gefunden oder keine Zugangsdaten vorhanden',
  'popup.fillFailed': 'Automatisches Ausfüllen fehlgeschlagen',

  'common.copy': 'Kopieren',
  'common.copied': 'Kopiert',
  'common.unnamed': 'Unbenannt',
  'common.hideValue': 'Wert verbergen',
  'common.revealValue': 'Wert anzeigen',
  'common.hideSecret': 'Geheimnis verbergen',
  'common.showSecret': 'Geheimnis anzeigen',
  'common.genericError': 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',

  'auth.start.description': 'Willkommen! Bitte melden Sie sich mit Google an, um fortzufahren.',
  'auth.start.continueWithGoogle': 'Mit Google fortfahren',

  'auth.unlock.description': 'Geben Sie Ihr Geheimnis ein, um Ihren Tresor zu entsperren.',
  'auth.unlock.secretLabel': 'Geheimnis',
  'auth.unlock.unlock': 'Entsperren',
  'auth.unlock.forgotSecret': 'Geheimnis vergessen?',
  'auth.unlock.incorrectSecret': 'Falsches Geheimnis. Bitte versuchen Sie es erneut.',
  'auth.unlock.resetInWebApp': 'Öffnen Sie die KeeperPass-Web-App, um Ihr Geheimnis zurückzusetzen.',

  'auth.oauth.signInInProgress': 'Die Anmeldung läuft bereits.',
  'auth.oauth.noBackgroundResponse': 'Keine Antwort vom Hintergrundskript der Erweiterung.',
  'auth.oauth.tokenExpired':
    'Das Google-Authentifizierungstoken ist abgelaufen. Bitte melden Sie sich erneut an.',
  'auth.oauth.cancelled': 'Die Google-Anmeldung wurde abgebrochen.',
  'auth.oauth.networkError': 'Netzwerkfehler bei der Authentifizierung: {details}',
  'auth.oauth.unknownError': 'Unbekannter Fehler',
  'auth.oauth.insufficientScope':
    'Das Token verfügt nicht über den erforderlichen drive.file-Berechtigungsumfang.',
  'auth.oauth.verifyTokenFailed': 'Token konnte nicht überprüft werden',

  'errors.drive.authExpired': 'Ihre Google-Sitzung ist abgelaufen. Bitte verbinden Sie sich erneut.',
  'errors.drive.backupFailed':
    'Ihr bestehender Tresor konnte nicht in Google Drive gesichert werden. Bitte versuchen Sie es erneut.',
  'errors.drive.createFolderFailed':
    'Der keeperpass-Ordner konnte in Google Drive nicht erstellt werden. Bitte versuchen Sie es erneut.',
  'errors.drive.readFailed':
    'Ihr Tresor konnte nicht aus Google Drive gelesen werden. Bitte versuchen Sie es erneut.',
  'errors.drive.saveFailed':
    'Ihr Tresor konnte nicht in Google Drive gespeichert werden. Bitte versuchen Sie es erneut.',
  'errors.drive.unreachable': 'Google Drive konnte nicht erreicht werden. Bitte versuchen Sie es erneut.',
  'errors.auth.profileFailed':
    'Ihr Google-Profil konnte nicht gelesen werden. Bitte versuchen Sie es erneut.',
  'errors.masterPassword.vaultNotFound': 'Ihr Tresor wurde in Google Drive nicht gefunden.',
  'errors.masterPassword.wrongPassword': 'Das ist nicht Ihr aktuelles Master-Passwort.',

  'vault.unlock.notFound':
    'Tresor nicht in Google Drive gefunden. Bitte stellen Sie sicher, dass Ihr Tresor über die Haupt-KeeperPass-App synchronisiert wurde.',
  'vault.unlock.parseFailed':
    'Tresordaten konnten nicht verarbeitet werden. Die Tresordatei ist möglicherweise beschädigt.',
  'vault.unlock.invalidStructure': 'Ungültige Tresordatenstruktur nach der Entschlüsselung.',
  'vault.unlock.missingFields': 'Den Tresordaten fehlen erforderliche Felder.',

  'vaults.defaultName': 'Mein Tresor',

  'items.field.empty': '[leer]',
  'items.field.copyValueAria': 'Wert kopieren',
  'items.totp.invalidCode': 'Ungültiger Code',
  'items.list.sortOldestFirstAria': 'Älteste zuerst sortieren',
  'items.list.sortNewestFirstAria': 'Neueste zuerst sortieren',

  'generator.passphrase': 'Passphrase',
  'generator.randomString': 'Zufällige Zeichenfolge',
  'generator.wordSeparator': 'Worttrennzeichen',
  'generator.separatorPlaceholder': 'Trennzeichen',
  'generator.language': 'Sprache',
  'generator.languagePlaceholder': 'Sprache',
  'generator.words': 'Wörter',
  'generator.numberOfWordsAria': 'Anzahl der Wörter',
  'generator.length': 'Länge',
  'generator.passwordLengthAria': 'Passwortlänge',
  'generator.regenerate': 'Neu generieren',
  'generator.copyPasswordAria': 'Passwort kopieren',

  'field.type.username': 'Benutzername',
  'field.type.password': 'Passwort',
  'field.type.email': 'E-Mail-Adresse',
  'field.type.url': 'URL',
  'field.type.ipHost': 'IP / Host',
  'field.type.date': 'Datum',
  'field.type.month': 'Monat',
  'field.type.credit': 'Kreditkartennummer',
  'field.type.phone': 'Telefonnummer',
  'field.type.pin': 'PIN',
  'field.type.totp': 'Einmalpasswort',
  'field.type.certificate': 'Zertifikat',
  'field.type.sshKey': 'SSH-/Privatschlüssel',
  'field.type.recoveryCodes': 'Wiederherstellungscodes',
  'field.type.note': 'Rich-Text / Markdown',
  'field.type.text': 'Reiner Text',

  'items.templates.website': 'Website / App',
  'items.templates.computer': 'Computer',
  'items.templates.creditCard': 'Kreditkarte',
  'items.templates.bankAccount': 'Bankkonto',
  'items.templates.wifi': 'WLAN-Passwort',
  'items.templates.passport': 'Reisepass',
  'items.templates.note': 'Notiz',
  'items.templates.authenticator': 'Authentifizierung',
  'items.templates.custom': 'Benutzerdefiniert',

  'items.templates.fields.cardNumber': 'Kartennummer',
  'items.templates.fields.cardOwner': 'Karteninhaber',
  'items.templates.fields.validUntil': 'Gültig bis',
  'items.templates.fields.cvc': 'CVC',
  'items.templates.fields.accountOwner': 'Kontoinhaber',
  'items.templates.fields.iban': 'IBAN',
  'items.templates.fields.bic': 'BIC',
  'items.templates.fields.cardPin': 'Karten-PIN',
  'items.templates.fields.name': 'Name',
  'items.templates.fields.fullName': 'Vollständiger Name',
  'items.templates.fields.passportNumber': 'Reisepassnummer',
  'items.templates.fields.country': 'Land',
  'items.templates.fields.birthdate': 'Geburtsdatum',
  'items.templates.fields.birthplace': 'Geburtsort',
  'items.templates.fields.issuedOn': 'Ausgestellt am',
  'items.templates.fields.expires': 'Gültig bis',
  'items.templates.fields.note': 'Notiz',

  'audit.weakPassword.label': 'Schwache Passwörter',
  'audit.weakPassword.description':
    'Passwörter gelten als schwach, wenn sie zu kurz sind, kaum Variation aufweisen oder häufig verwendete Wörter oder Phrasen enthalten. Solche Passwörter bieten in der Regel keinen ausreichenden Schutz gegen automatisiertes Erraten und sollten durch starke, zufällig generierte Passwörter ersetzt werden.',
  'audit.weakPassword.empty': 'Sie haben keine Einträge mit schwachen Passwörtern!',
  'audit.reusedPassword.label': 'Wiederverwendete Passwörter',
  'audit.reusedPassword.description':
    'Von der Verwendung desselben Passworts an mehreren Stellen wird dringend abgeraten, da ein Datenleck an einer dieser Stellen automatisch alle anderen Konten/Logins mit demselben Passwort kompromittiert. Wir empfehlen, für jeden einzelnen Tresoreintrag ein starkes, zufälliges und einzigartiges Passwort zu generieren.',
  'audit.reusedPassword.empty': 'Sie haben keine Einträge mit wiederverwendeten Passwörtern!',
  'audit.compromisedPassword.label': 'Kompromittierte Passwörter',
  'audit.compromisedPassword.description':
    'Kompromittierte Passwörter sind solche, die durch den Abgleich mit einer Datenbank bekannter Datenlecks als in der Vergangenheit geleakt identifiziert wurden. Diese Passwörter gelten nicht mehr als sicher und sollten umgehend geändert werden.',
  'audit.compromisedPassword.empty': 'Sie haben keine Einträge mit kompromittierten Passwörtern!',
};
