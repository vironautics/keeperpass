import { TranslationTable } from './en';

/** Formal address (Sie), matching how German password managers address users. */
export const de: TranslationTable = {
  'common.save': 'Speichern',
  'common.cancel': 'Abbrechen',
  'common.delete': 'Löschen',

  'settings.title': 'Einstellungen',
  'settings.openMenu': 'Navigationsmenü öffnen',

  'settings.language.title': 'Sprache',
  'settings.language.label': 'Anzeigesprache',
  'settings.language.hint':
    'Ändert die Sprache der Benutzeroberfläche. Wird nur auf diesem Gerät gespeichert und ist nicht Teil Ihres Tresors.',

  'settings.profile.title': 'Profil',
  'settings.profile.email': 'E-Mail',
  'settings.profile.displayName': 'Anzeigename',
  'settings.profile.managedByGoogle':
    'Übernommen aus dem Google-Konto, mit dem Sie angemeldet sind. Ändern Sie es in Ihrem Google-Konto.',
  'settings.profile.logOut': 'Abmelden',
  'settings.profile.deleteAccount': 'Konto löschen',
  'settings.profile.deleteWarning':
    'Ihre Daten gehören Ihnen: Sie liegen als eine verschlüsselte Datei in Ihrem eigenen Google Drive. Beim Löschen des Kontos wird diese Datei umbenannt, sodass diese App sie nicht mehr findet, und Sie werden abgemeldet — gelöscht wird nichts. Um die Daten selbst zu löschen, öffnen Sie Google Drive, gehen Sie in den Ordner keeperpass und löschen Sie die Datei dort.',
  'settings.profile.deleteTypePrefix': 'Geben Sie zur Bestätigung',
  'settings.profile.deleteTypeSuffix': 'ein.',
  'settings.profile.confirmation': 'Bestätigung',
  'settings.profile.deleteDone': 'Ihre Tresordatei wurde umbenannt',
  'settings.profile.deleteDoneHint':
    'Sie liegt weiterhin im Ordner keeperpass in Ihrem Google Drive. Löschen Sie sie dort, wenn die Daten endgültig verschwinden sollen.',
  'settings.profile.deleteError':
    'Die Tresordatei konnte nicht umbenannt werden. Es wurde nichts geändert.',

  'settings.masterPassword.title': 'Master-Passwort',
  'settings.masterPassword.description':
    'Ihr Master-Passwort verschlüsselt alles in Ihren Tresoren und verlässt dieses Gerät nie. Es kann daher nicht wiederhergestellt, sondern nur geändert werden.',
  'settings.masterPassword.change': 'Master-Passwort ändern',

  'settings.data.title': 'Import / Export',
  'settings.data.import': 'Importieren…',
  'settings.data.export': 'Exportieren…',
  'settings.data.history': 'Letzte Exporte',
  'settings.data.historyEmpty': 'Sie haben noch nichts exportiert.',
  'settings.data.historyHint': 'Die letzten 10 Exporte werden in Ihrem Tresor gespeichert.',
  'settings.data.historyItems': 'Einträge',
};
