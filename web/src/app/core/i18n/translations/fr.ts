import { TranslationTable } from './en';

/** Formal address (vous), the norm for software in French. */
export const fr: TranslationTable = {
  'common.save': 'Enregistrer',
  'common.cancel': 'Annuler',
  'common.delete': 'Supprimer',

  'settings.title': 'Paramètres',
  'settings.openMenu': 'Ouvrir le menu de navigation',

  'settings.language.title': 'Langue',
  'settings.language.label': 'Langue de l’interface',
  'settings.language.hint':
    'Modifie la langue de l’interface. Enregistrée uniquement sur cet appareil — elle ne fait pas partie de votre coffre-fort.',

  'settings.profile.title': 'Profil',
  'settings.profile.email': 'E-mail',
  'settings.profile.displayName': 'Nom affiché',
  'settings.profile.managedByGoogle':
    'Récupéré depuis le compte Google utilisé pour la connexion. Modifiez-le dans votre compte Google.',
  'settings.profile.logOut': 'Se déconnecter',
  'settings.profile.deleteAccount': 'Supprimer le compte',
  'settings.profile.deleteWarning':
    'Vos données sont les vôtres : elles tiennent dans un seul fichier chiffré, dans votre propre Google Drive. Supprimer votre compte renomme ce fichier pour que cette application ne le trouve plus, et vous déconnecte ; rien n’est effacé. Pour supprimer les données elles-mêmes, ouvrez Google Drive, allez dans le dossier keeperpass et supprimez le fichier depuis là.',
  'settings.profile.deleteTypePrefix': 'Saisissez',
  'settings.profile.deleteTypeSuffix': 'pour confirmer.',
  'settings.profile.confirmation': 'Confirmation',
  'settings.profile.deleteDone': 'Votre fichier de coffre-fort a été renommé',
  'settings.profile.deleteDoneHint':
    'Il reste dans le dossier keeperpass de votre Google Drive. Supprimez-le là-bas quand vous voulez effacer définitivement les données.',
  'settings.profile.deleteError':
    'Impossible de renommer votre fichier de coffre-fort. Rien n’a été modifié.',

  'settings.masterPassword.title': 'Mot de passe maître',
  'settings.masterPassword.description':
    'Votre mot de passe principal chiffre tout ce que contiennent vos coffres-forts et ne quitte jamais cet appareil : il ne peut donc pas être récupéré, seulement changé.',
  'settings.masterPassword.change': 'Changer le mot de passe maître',

  'settings.data.title': 'Importer / Exporter',
  'settings.data.import': 'Importer…',
  'settings.data.export': 'Exporter…',
  'settings.data.history': 'Exports récents',
  'settings.data.historyEmpty': "Vous n'avez encore rien exporté.",
  'settings.data.historyHint': 'Les 10 derniers exports sont conservés, dans votre coffre.',
  'settings.data.historyItems': 'éléments',
};
