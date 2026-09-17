import { TranslationTable } from './en';

/**
 * European Portuguese, which is what an unqualified `pt` conventionally means
 * ("palavra-passe", "separador", "Guardar"). Kept in step with the web app's
 * `pt` table — if that one moves to Brazilian Portuguese, this should follow.
 */
export const pt: TranslationTable = {
  'popup.sync': 'Sincronizar com o Google Drive',
  'popup.disconnect': 'Terminar sessão',
  'popup.language': 'Idioma',
  'popup.back': 'Voltar',

  'popup.search': 'Pesquisar…',
  'popup.allVaults': 'Todos os cofres',
  'popup.allTags': 'Todas as etiquetas',

  'popup.unlocking': 'A desbloquear o seu cofre…',
  'popup.noItems': 'Nenhum item encontrado.',
  'popup.untitledItem': 'Item sem nome',
  'popup.showDetails': 'Ver detalhes',
  'popup.fillOnPage': 'Preencher nesta página',

  'popup.generate': 'Gerar',
  'popup.generatorLabel': 'Gerador de palavras-passe',
  'popup.newItem': 'Novo item',
  'popup.newItemLabel': 'Criar um novo item',

  'popup.noActiveTab': 'Nenhum separador ativo encontrado',
  'popup.filling': 'A preencher o formulário…',
  'popup.filled': '✓ Credenciais preenchidas!',
  'popup.noLoginForm':
    '✗ Nenhum formulário de início de sessão encontrado ou sem credenciais para preencher',
  'popup.fillFailed': 'Falha no preenchimento automático',

  'common.copy': 'Copiar',
  'common.copied': 'Copiado',
  'common.unnamed': 'Sem nome',
  'common.hideValue': 'Ocultar valor',
  'common.revealValue': 'Mostrar valor',
  'common.hideSecret': 'Ocultar segredo',
  'common.showSecret': 'Mostrar segredo',
  'common.genericError': 'Algo correu mal. Tente novamente.',

  'auth.start.description': 'Bem-vindo! Inicie sessão com o Google para continuar.',
  'auth.start.continueWithGoogle': 'Continuar com o Google',

  'auth.unlock.description': 'Introduza o seu segredo para desbloquear o seu cofre.',
  'auth.unlock.secretLabel': 'Segredo',
  'auth.unlock.unlock': 'Desbloquear',
  'auth.unlock.forgotSecret': 'Esqueceu-se do segredo?',
  'auth.unlock.incorrectSecret': 'Segredo incorreto. Tente novamente.',
  'auth.unlock.resetInWebApp': 'Abra a aplicação Web do KeeperPass para repor o seu segredo.',

  'auth.oauth.signInInProgress': 'O início de sessão já está em curso.',
  'auth.oauth.noBackgroundResponse': 'Sem resposta do script em segundo plano da extensão.',
  'auth.oauth.tokenExpired': 'O token de autenticação do Google expirou. Volte a iniciar sessão.',
  'auth.oauth.cancelled': 'O início de sessão com o Google foi cancelado.',
  'auth.oauth.networkError': 'Erro de rede durante a autenticação: {details}',
  'auth.oauth.unknownError': 'Erro desconhecido',
  'auth.oauth.insufficientScope': 'O token não tem o âmbito drive.file necessário.',
  'auth.oauth.verifyTokenFailed': 'Falha ao verificar o token',

  'errors.drive.authExpired': 'A sua sessão do Google expirou. Volte a ligar-se.',
  'errors.drive.backupFailed':
    'Não foi possível fazer uma cópia de segurança do seu cofre atual no Google Drive. Tente novamente.',
  'errors.drive.createFolderFailed':
    'Não foi possível criar a pasta keeperpass no Google Drive. Tente novamente.',
  'errors.drive.readFailed':
    'Não foi possível ler o seu cofre a partir do Google Drive. Tente novamente.',
  'errors.drive.saveFailed': 'Não foi possível guardar o seu cofre no Google Drive. Tente novamente.',
  'errors.drive.unreachable': 'Não foi possível contactar o Google Drive. Tente novamente.',
  'errors.auth.profileFailed': 'Não foi possível ler o seu perfil do Google. Tente novamente.',
  'errors.masterPassword.vaultNotFound': 'Não foi possível encontrar o seu cofre no Google Drive.',
  'errors.masterPassword.wrongPassword': 'Essa não é a sua palavra-passe mestra atual.',

  'vault.unlock.notFound':
    'Cofre não encontrado no Google Drive. Certifique-se de que o seu cofre está sincronizado a partir da aplicação principal do KeeperPass.',
  'vault.unlock.parseFailed':
    'Não foi possível processar os dados do cofre. O ficheiro do cofre pode estar corrompido.',
  'vault.unlock.invalidStructure': 'Estrutura de dados do cofre inválida após a desencriptação.',
  'vault.unlock.missingFields': 'Faltam campos obrigatórios nos dados do cofre.',

  'vaults.defaultName': 'O Meu Cofre',

  'items.field.empty': '[vazio]',
  'items.field.copyValueAria': 'Copiar valor',
  'items.totp.invalidCode': 'Código inválido',
  'items.list.sortOldestFirstAria': 'Ordenar do mais antigo para o mais recente',
  'items.list.sortNewestFirstAria': 'Ordenar do mais recente para o mais antigo',

  'generator.passphrase': 'frase-passe',
  'generator.randomString': 'cadeia aleatória',
  'generator.wordSeparator': 'Separador de palavras',
  'generator.separatorPlaceholder': 'Separador',
  'generator.language': 'Idioma',
  'generator.languagePlaceholder': 'Idioma',
  'generator.words': 'Palavras',
  'generator.numberOfWordsAria': 'Número de palavras',
  'generator.length': 'comprimento',
  'generator.passwordLengthAria': 'Comprimento da palavra-passe',
  'generator.regenerate': 'Regenerar',
  'generator.copyPasswordAria': 'Copiar palavra-passe',

  'field.type.username': 'Nome de utilizador',
  'field.type.password': 'Palavra-passe',
  'field.type.email': 'Endereço de E-mail',
  'field.type.url': 'URL',
  'field.type.ipHost': 'IP / Host',
  'field.type.date': 'Data',
  'field.type.month': 'Mês',
  'field.type.credit': 'Número do Cartão de Crédito',
  'field.type.phone': 'Número de Telefone',
  'field.type.pin': 'PIN',
  'field.type.totp': 'Palavra-passe de Utilização Única',
  'field.type.certificate': 'Certificado',
  'field.type.sshKey': 'Chave SSH / Privada',
  'field.type.recoveryCodes': 'Códigos de Recuperação',
  'field.type.note': 'Nota em Texto Formatado / Markdown',
  'field.type.text': 'Texto Simples',

  'items.templates.website': 'Site / App',
  'items.templates.computer': 'Computador',
  'items.templates.creditCard': 'Cartão de Crédito',
  'items.templates.bankAccount': 'Conta Bancária',
  'items.templates.wifi': 'Palavra-passe de Wi-Fi',
  'items.templates.passport': 'Passaporte',
  'items.templates.note': 'Nota',
  'items.templates.authenticator': 'Autenticador',
  'items.templates.custom': 'Personalizado',

  'items.templates.fields.cardNumber': 'Número do Cartão',
  'items.templates.fields.cardOwner': 'Titular do Cartão',
  'items.templates.fields.validUntil': 'Válido até',
  'items.templates.fields.cvc': 'CVC',
  'items.templates.fields.accountOwner': 'Titular da Conta',
  'items.templates.fields.iban': 'IBAN',
  'items.templates.fields.bic': 'BIC',
  'items.templates.fields.cardPin': 'PIN do Cartão',
  'items.templates.fields.name': 'Nome',
  'items.templates.fields.fullName': 'Nome Completo',
  'items.templates.fields.passportNumber': 'Número do Passaporte',
  'items.templates.fields.country': 'País',
  'items.templates.fields.birthdate': 'Data de Nascimento',
  'items.templates.fields.birthplace': 'Local de Nascimento',
  'items.templates.fields.issuedOn': 'Emitido em',
  'items.templates.fields.expires': 'Expira em',
  'items.templates.fields.note': 'Nota',

  'audit.weakPassword.label': 'Palavras-passe Fracas',
  'audit.weakPassword.description':
    'As palavras-passe são consideradas fracas se forem demasiado curtas, tiverem pouca variação ou contiverem palavras ou frases de uso comum. Estas palavras-passe geralmente não oferecem proteção suficiente contra tentativas automatizadas de adivinhação e devem ser substituídas por palavras-passe fortes e geradas aleatoriamente.',
  'audit.weakPassword.empty': 'Não tem nenhum item com palavras-passe fracas!',
  'audit.reusedPassword.label': 'Palavras-passe Reutilizadas',
  'audit.reusedPassword.description':
    'É fortemente desaconselhado usar a mesma palavra-passe em vários sítios, uma vez que uma fuga de dados num deles comprometerá automaticamente todas as outras contas/sessões que usem essa mesma palavra-passe. Recomendamos gerar palavras-passe fortes, aleatórias e únicas para cada item do cofre.',
  'audit.reusedPassword.empty': 'Não tem nenhum item com palavras-passe reutilizadas!',
  'audit.compromisedPassword.label': 'Palavras-passe Comprometidas',
  'audit.compromisedPassword.description':
    'As palavras-passe comprometidas são aquelas identificadas como tendo sido expostas no passado, através da comparação com uma base de dados de fugas conhecidas. Estas palavras-passe já não podem ser consideradas seguras e devem ser alteradas de imediato.',
  'audit.compromisedPassword.empty': 'Não tem nenhum item com palavras-passe comprometidas!',
};
