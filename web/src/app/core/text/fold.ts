/**
 * Lower-cased and stripped of accents, for matching what someone types against
 * what is stored.
 *
 * Only ever used on the *query* side of a search — nothing folded is saved. A
 * password manager must never rewrite a value to make it easier to match.
 */
export function foldText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
}
