import { foldText } from '../../core/text/fold';
import { CatalogIcon, ICON_CATALOG } from './icon-catalog';

/** Rendering this many buttons at once is already more than a screen shows; no reason to build more DOM than that for a scroll nobody reaches the end of. */
const MAX_RESULTS = 120;

/**
 * Searches the icon catalogue the way fontawesome.com searches its own: a
 * match against the icon's name, its label, or any of its search terms/aliases.
 *
 * An empty query returns the first page of the catalogue (alphabetical)
 * rather than nothing, so the picker never opens to a blank grid.
 */
export function searchIconCatalog(query: string): readonly CatalogIcon[] {
  const folded = foldText(query);
  if (!folded) {
    return ICON_CATALOG.slice(0, MAX_RESULTS);
  }

  const results: CatalogIcon[] = [];
  for (const icon of ICON_CATALOG) {
    if (matches(icon, folded)) {
      results.push(icon);
      if (results.length >= MAX_RESULTS) {
        break;
      }
    }
  }
  return results;
}

function matches(icon: CatalogIcon, folded: string): boolean {
  if (foldText(icon.name).includes(folded) || foldText(icon.label).includes(folded)) {
    return true;
  }
  return icon.terms.some((term) => foldText(term).includes(folded));
}
