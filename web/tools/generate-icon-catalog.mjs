/**
 * Regenerates `src/app/ui/icon/icon-catalog.ts` — the searchable index behind
 * the item icon picker.
 *
 *   node tools/generate-icon-catalog.mjs [path/to/fontawesome-metadata/icons.json]
 *
 * Source is Font Awesome's own per-icon metadata (`label`, `unicode`,
 * `styles`, `search.terms`), not the curated app vocabulary in
 * `icon-glyphs.ts` — that file is this app's own small set of semantic
 * names (`weak`, `login`, ...), some of which reuse a plain-English word for
 * a *different* glyph than Font Awesome's own icon of that name (the app's
 * `lock` is Font Awesome's `lock-keyhole`). Mixing the two would silently
 * change what an existing app-vocabulary key renders, so the picker's
 * catalogue is kept in its own file and its own field on `VaultItem`
 * (`iconGlyph`, a raw code point) rather than folded into `IconName`.
 *
 * Free tier only: this app currently loads only the Solid weight of Font
 * Awesome (see `spartan.css`), so only icons Font Awesome ships free in
 * Solid are included — Light/Thin/Duotone are Pro-only weights this app
 * doesn't load, and Regular/Brands aren't wired up either.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const metadataPath =
  process.argv[2] ?? resolve(here, 'fontawesome-metadata/icons.json');
const outPath = resolve(here, '../src/app/ui/icon/icon-catalog.ts');

const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));

const entries = Object.entries(metadata)
  .filter(([, icon]) => (icon.free ?? []).includes('solid'))
  .map(([name, icon]) => ({
    name,
    label: icon.label ?? name,
    unicode: icon.unicode,
    terms: icon.search?.terms ?? [],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

if (entries.length === 0) {
  throw new Error(`No free Solid icons found in ${metadataPath} — has the metadata format changed?`);
}

const file = `/**
 * The searchable catalogue behind the item icon picker: every icon Font
 * Awesome ships free in its Solid weight, with the same name/label/search
 * terms fontawesome.com itself searches against.
 *
 * Generated — run \`npm run icons:catalog\` after replacing
 * \`tools/fontawesome-metadata/icons.json\` with a newer Font Awesome Free
 * metadata release. See \`tools/generate-icon-catalog.mjs\` for why this is
 * a separate catalogue from \`icon-glyphs.ts\`.
 */
export interface CatalogIcon {
  /** Font Awesome's own icon name, e.g. \`lock\`. */
  readonly name: string;
  /** Human-readable display name, e.g. "Lock". */
  readonly label: string;
  /** Hex code point in the Solid face, e.g. \`f023\`. */
  readonly unicode: string;
  /** Search aliases, e.g. \`padlock\`, \`secure\` for \`lock\`. */
  readonly terms: readonly string[];
}

export const ICON_CATALOG: readonly CatalogIcon[] = ${JSON.stringify(entries, null, 2)};
`;

writeFileSync(outPath, file);
console.log(`Wrote ${entries.length} icons to ${outPath}`);
