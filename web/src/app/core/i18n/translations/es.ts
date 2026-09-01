import { TranslationTable } from './en';

/** Informal address (tú), the norm for consumer software in Spanish. */
export const es: TranslationTable = {
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',

  'settings.title': 'Ajustes',
  'settings.openMenu': 'Abrir el menú de navegación',

  'settings.language.title': 'Idioma',
  'settings.language.label': 'Idioma de la interfaz',
  'settings.language.hint':
    'Cambia el idioma de la interfaz. Se guarda solo en este dispositivo — no forma parte de tu caja fuerte.',

  'settings.profile.title': 'Perfil',
  'settings.profile.email': 'Correo electrónico',
  'settings.profile.displayName': 'Nombre visible',
  'settings.profile.managedByGoogle':
    'Se toma de la cuenta de Google con la que has iniciado sesión. Cámbialo en tu cuenta de Google.',
  'settings.profile.logOut': 'Cerrar sesión',
  'settings.profile.deleteAccount': 'Eliminar cuenta',
  'settings.profile.deleteWarning':
    'Tus datos son tuyos: están en un único archivo cifrado dentro de tu propio Google Drive. Al eliminar tu cuenta se cambia el nombre de ese archivo para que esta aplicación ya no lo encuentre y se cierra tu sesión; no se borra nada. Para eliminar los datos, abre Google Drive, entra en la carpeta keeperpass y borra el archivo allí.',
  'settings.profile.deleteTypePrefix': 'Escribe',
  'settings.profile.deleteTypeSuffix': 'para confirmar.',
  'settings.profile.confirmation': 'Confirmación',
  'settings.profile.deleteDone': 'Se ha cambiado el nombre de tu archivo de caja fuerte',
  'settings.profile.deleteDoneHint':
    'Sigue en la carpeta keeperpass de tu Google Drive. Bórralo allí cuando quieras que los datos desaparezcan definitivamente.',
  'settings.profile.deleteError':
    'No se ha podido cambiar el nombre del archivo. No se ha modificado nada.',

  'settings.masterPassword.title': 'Contraseña maestra',
  'settings.masterPassword.description':
    'Tu contraseña maestra cifra todo lo que hay en tus cajas fuertes y nunca sale de este dispositivo, por lo que no se puede recuperar: solo cambiar.',
  'settings.masterPassword.change': 'Cambiar contraseña maestra',

  'settings.data.title': 'Importar / Exportar',
  'settings.data.import': 'Importar…',
  'settings.data.export': 'Exportar…',
  'settings.data.history': 'Exportaciones recientes',
  'settings.data.historyEmpty': 'Todavía no has exportado nada.',
  'settings.data.historyHint': 'Se guardan las últimas 10 exportaciones, en tu caja fuerte.',
  'settings.data.historyItems': 'elementos',
};
