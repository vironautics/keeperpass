import { TranslationTable } from './en';

/**
 * European Portuguese, which is what an unqualified `pt` conventionally means
 * ("palavra-passe", "Definições", "Guardar"). If Brazil is the bigger audience,
 * this table should become `pt-BR` ("senha", "Configurações", "Salvar") and
 * `resolveBrowserLocale` should match on the region subtag rather than dropping it.
 */
export const pt: TranslationTable = {
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',

  'settings.title': 'Definições',
  'settings.openMenu': 'Abrir o menu de navegação',

  'settings.language.title': 'Idioma',
  'settings.language.label': 'Idioma da interface',
  'settings.language.hint':
    'Altera o idioma da interface. Guardado apenas neste dispositivo — não faz parte do seu cofre.',

  'settings.profile.title': 'Perfil',
  'settings.profile.email': 'E-mail',
  'settings.profile.displayName': 'Nome a apresentar',
  'settings.profile.managedByGoogle':
    'Obtido da conta Google com que iniciou sessão. Altere-o na sua conta Google.',
  'settings.profile.logOut': 'Terminar sessão',
  'settings.profile.deleteAccount': 'Eliminar conta',
  'settings.profile.deleteWarning':
    'Os seus dados são seus: estão num único ficheiro cifrado, no seu próprio Google Drive. Eliminar a sua conta muda o nome desse ficheiro para que esta aplicação já não o encontre e termina a sua sessão; nada é apagado. Para eliminar os dados em si, abra o Google Drive, vá à pasta keeperpass e apague o ficheiro aí.',
  'settings.profile.deleteTypePrefix': 'Escreva',
  'settings.profile.deleteTypeSuffix': 'para confirmar.',
  'settings.profile.confirmation': 'Confirmação',
  'settings.profile.deleteDone': 'O nome do seu ficheiro de cofre foi alterado',
  'settings.profile.deleteDoneHint':
    'Continua na pasta keeperpass do seu Google Drive. Apague-o aí quando quiser que os dados desapareçam definitivamente.',
  'settings.profile.deleteError':
    'Não foi possível alterar o nome do ficheiro de cofre. Nada foi alterado.',

  'settings.masterPassword.title': 'Palavra-passe mestra',
  'settings.masterPassword.description':
    'A sua palavra-passe principal cifra tudo o que está nos seus cofres e nunca sai deste dispositivo, pelo que não pode ser recuperada — apenas alterada.',
  'settings.masterPassword.change': 'Alterar palavra-passe mestra',

  'settings.data.title': 'Importar / Exportar',
  'settings.data.import': 'Importar…',
  'settings.data.export': 'Exportar…',
  'settings.data.history': 'Exportações recentes',
  'settings.data.historyEmpty': 'Ainda não exportou nada.',
  'settings.data.historyHint': 'As últimas 10 exportações ficam guardadas no seu cofre.',
  'settings.data.historyItems': 'itens',
};
