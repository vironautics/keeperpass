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
};
