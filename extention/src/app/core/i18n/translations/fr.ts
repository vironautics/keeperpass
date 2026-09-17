import { TranslationTable } from './en';

/** Formal address (vous), the norm for software in French. */
export const fr: TranslationTable = {
  'popup.sync': 'Synchroniser avec Google Drive',
  'popup.disconnect': 'Se déconnecter',
  'popup.language': 'Langue',
  'popup.back': 'Retour',

  'popup.search': 'Rechercher…',
  'popup.allVaults': 'Tous les coffres-forts',
  'popup.allTags': 'Toutes les étiquettes',

  'popup.unlocking': 'Déverrouillage de votre coffre-fort…',
  'popup.noItems': 'Aucun élément trouvé.',
  'popup.untitledItem': 'Élément sans nom',
  'popup.showDetails': 'Afficher les détails',
  'popup.fillOnPage': 'Remplir sur cette page',

  'popup.generate': 'Générer',
  'popup.generatorLabel': 'Générateur de mots de passe',
  'popup.newItem': 'Nouvel élément',
  'popup.newItemLabel': 'Créer un élément',

  'popup.noActiveTab': 'Aucun onglet actif trouvé',
  'popup.filling': 'Remplissage du formulaire…',
  'popup.filled': '✓ Identifiants remplis !',
  'popup.noLoginForm': '✗ Aucun formulaire de connexion trouvé ou aucun identifiant à remplir',
  'popup.fillFailed': 'Échec du remplissage automatique',

  'common.copy': 'Copier',
  'common.copied': 'Copié',
  'common.unnamed': 'Sans nom',
  'common.hideValue': 'Masquer la valeur',
  'common.revealValue': 'Afficher la valeur',
  'common.hideSecret': 'Masquer le secret',
  'common.showSecret': 'Afficher le secret',
  'common.genericError': "Une erreur s'est produite. Veuillez réessayer.",

  'auth.start.description': 'Bienvenue ! Veuillez vous connecter avec Google pour continuer.',
  'auth.start.continueWithGoogle': 'Continuer avec Google',

  'auth.unlock.description': 'Saisissez votre secret pour déverrouiller votre coffre-fort.',
  'auth.unlock.secretLabel': 'Secret',
  'auth.unlock.unlock': 'Déverrouiller',
  'auth.unlock.forgotSecret': 'Secret oublié ?',
  'auth.unlock.incorrectSecret': 'Secret incorrect. Veuillez réessayer.',
  'auth.unlock.resetInWebApp': "Ouvrez l'application web KeeperPass pour réinitialiser votre secret.",

  'auth.oauth.signInInProgress': 'La connexion est déjà en cours.',
  'auth.oauth.noBackgroundResponse': "Aucune réponse du script d'arrière-plan de l'extension.",
  'auth.oauth.tokenExpired': "Le jeton d'authentification Google a expiré. Veuillez vous reconnecter.",
  'auth.oauth.cancelled': 'La connexion Google a été annulée.',
  'auth.oauth.networkError': "Erreur réseau lors de l'authentification : {details}",
  'auth.oauth.unknownError': 'Erreur inconnue',
  'auth.oauth.insufficientScope': "Le jeton ne dispose pas de la portée drive.file requise.",
  'auth.oauth.verifyTokenFailed': 'Échec de la vérification du jeton',

  'errors.drive.authExpired': 'Votre session Google a expiré. Veuillez vous reconnecter.',
  'errors.drive.backupFailed':
    'Impossible de sauvegarder votre coffre-fort existant dans Google Drive. Veuillez réessayer.',
  'errors.drive.createFolderFailed':
    'Impossible de créer le dossier keeperpass dans Google Drive. Veuillez réessayer.',
  'errors.drive.readFailed':
    'Impossible de lire votre coffre-fort depuis Google Drive. Veuillez réessayer.',
  'errors.drive.saveFailed':
    'Impossible d’enregistrer votre coffre-fort dans Google Drive. Veuillez réessayer.',
  'errors.drive.unreachable': 'Impossible de joindre Google Drive. Veuillez réessayer.',
  'errors.auth.profileFailed': 'Impossible de lire votre profil Google. Veuillez réessayer.',
  'errors.masterPassword.vaultNotFound': 'Votre coffre-fort est introuvable dans Google Drive.',
  'errors.masterPassword.wrongPassword': 'Ce n’est pas votre mot de passe principal actuel.',

  'vault.unlock.notFound':
    'Coffre-fort introuvable sur Google Drive. Veuillez vous assurer que votre coffre-fort est synchronisé depuis l’application principale KeeperPass.',
  'vault.unlock.parseFailed':
    'Impossible d’analyser les données du coffre-fort. Le fichier est peut-être corrompu.',
  'vault.unlock.invalidStructure': 'Structure des données du coffre-fort invalide après le déchiffrement.',
  'vault.unlock.missingFields': 'Il manque des champs requis dans les données du coffre-fort.',

  'vaults.defaultName': 'Mon coffre-fort',

  'items.field.empty': '[vide]',
  'items.field.copyValueAria': 'Copier la valeur',
  'items.totp.invalidCode': 'Code invalide',
  'items.list.sortOldestFirstAria': 'Trier du plus ancien au plus récent',
  'items.list.sortNewestFirstAria': 'Trier du plus récent au plus ancien',

  'generator.passphrase': 'phrase de passe',
  'generator.randomString': 'chaîne aléatoire',
  'generator.wordSeparator': 'Séparateur de mots',
  'generator.separatorPlaceholder': 'Séparateur',
  'generator.language': 'Langue',
  'generator.languagePlaceholder': 'Langue',
  'generator.words': 'Mots',
  'generator.numberOfWordsAria': 'Nombre de mots',
  'generator.length': 'longueur',
  'generator.passwordLengthAria': 'Longueur du mot de passe',
  'generator.regenerate': 'Régénérer',
  'generator.copyPasswordAria': 'Copier le mot de passe',

  'field.type.username': 'Nom d’utilisateur',
  'field.type.password': 'Mot de passe',
  'field.type.email': 'Adresse e-mail',
  'field.type.url': 'URL',
  'field.type.ipHost': 'IP / Hôte',
  'field.type.date': 'Date',
  'field.type.month': 'Mois',
  'field.type.credit': 'Numéro de carte de crédit',
  'field.type.phone': 'Numéro de téléphone',
  'field.type.pin': 'Code PIN',
  'field.type.totp': 'Mot de passe à usage unique',
  'field.type.certificate': 'Certificat',
  'field.type.sshKey': 'Clé SSH / privée',
  'field.type.recoveryCodes': 'Codes de récupération',
  'field.type.note': 'Texte enrichi / Markdown',
  'field.type.text': 'Texte brut',

  'items.templates.website': 'Site web / App',
  'items.templates.computer': 'Ordinateur',
  'items.templates.creditCard': 'Carte bancaire',
  'items.templates.bankAccount': 'Compte bancaire',
  'items.templates.wifi': 'Mot de passe Wi-Fi',
  'items.templates.passport': 'Passeport',
  'items.templates.note': 'Note',
  'items.templates.authenticator': 'Authentificateur',
  'items.templates.custom': 'Personnalisé',

  'items.templates.fields.cardNumber': 'Numéro de carte',
  'items.templates.fields.cardOwner': 'Titulaire de la carte',
  'items.templates.fields.validUntil': "Valable jusqu'au",
  'items.templates.fields.cvc': 'CVC',
  'items.templates.fields.accountOwner': 'Titulaire du compte',
  'items.templates.fields.iban': 'IBAN',
  'items.templates.fields.bic': 'BIC',
  'items.templates.fields.cardPin': 'Code PIN de la carte',
  'items.templates.fields.name': 'Nom',
  'items.templates.fields.fullName': 'Nom complet',
  'items.templates.fields.passportNumber': 'Numéro de passeport',
  'items.templates.fields.country': 'Pays',
  'items.templates.fields.birthdate': 'Date de naissance',
  'items.templates.fields.birthplace': 'Lieu de naissance',
  'items.templates.fields.issuedOn': 'Délivré le',
  'items.templates.fields.expires': 'Expire le',
  'items.templates.fields.note': 'Note',

  'audit.weakPassword.label': 'Mots de passe faibles',
  'audit.weakPassword.description':
    "Un mot de passe est considéré comme faible s'il est trop court, manque de variété ou contient des mots ou expressions couramment utilisés. Ces mots de passe n'offrent généralement pas une protection suffisante contre les tentatives de devinette automatisées et doivent être remplacés par des mots de passe forts et générés aléatoirement.",
  'audit.weakPassword.empty': "Vous n'avez aucun élément avec des mots de passe faibles !",
  'audit.reusedPassword.label': 'Mots de passe réutilisés',
  'audit.reusedPassword.description':
    "Il est fortement déconseillé d'utiliser le même mot de passe à plusieurs endroits, car une fuite de données à l'un de ces endroits compromettra automatiquement tous les autres comptes/connexions utilisant ce même mot de passe. Nous recommandons de générer des mots de passe forts, aléatoires et uniques pour chaque élément du coffre-fort.",
  'audit.reusedPassword.empty': "Vous n'avez aucun élément avec des mots de passe réutilisés !",
  'audit.compromisedPassword.label': 'Mots de passe compromis',
  'audit.compromisedPassword.description':
    'Les mots de passe compromis sont ceux identifiés comme ayant fuité par le passé, en les comparant à une base de données de fuites connues. Ces mots de passe ne peuvent plus être considérés comme sûrs et doivent être changés immédiatement.',
  'audit.compromisedPassword.empty': "Vous n'avez aucun élément avec des mots de passe compromis !",
};
