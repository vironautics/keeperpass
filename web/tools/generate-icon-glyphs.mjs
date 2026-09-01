/**
 * Regenerates `src/app/ui/icon/icon-glyphs.ts`.
 *
 *   node tools/generate-icon-glyphs.mjs [path/to/fontawesome.css]
 *
 * `ICONS` below is the whole editorial decision: which glyph stands for which
 * idea in this app. Everything else — the code points — is read out of the
 * FontAwesome Pro release the app ships in `public/fonts`, so the table can
 * never drift from the font, and adding an icon is one line here plus a re-run.
 *
 * An unknown FontAwesome name fails the run rather than writing a blank glyph:
 * a missing code point renders as a tofu box, which is the kind of thing that
 * reaches production because nobody looked at that one screen.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/** Keys are this app's vocabulary; values are FontAwesome icon names. */
const ICONS = {
  // Chrome and navigation
  add: 'plus',
  cancel: 'xmark',
  more: 'ellipsis',
  search: 'magnifying-glass',
  settings: 'gear',
  support: 'headset',
  policies: 'file-contract',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'circle-arrow-left': 'circle-arrow-left',
  'circle-arrow-right': 'circle-arrow-right',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  'sort-asc': 'arrow-up-short-wide',
  'sort-desc': 'arrow-down-short-wide',

  // Status
  alert: 'triangle-exclamation',
  success: 'circle-check',
  check: 'check',
  forbidden: 'ban',
  'info-circle': 'circle-info',
  'checkbox-checked': 'square-check',
  'checkbox-unchecked': 'square',
  'select-all': 'check-double',

  // Vaults, items and tags
  vault: 'vault',
  vaults: 'layer-group',
  tag: 'tag',
  tags: 'tags',
  favourite: 'star',
  field: 'pen-field',
  file: 'file',
  history: 'rectangle-history',
  copy: 'copy',
  edit: 'pen-to-square',
  delete: 'trash',
  move: 'up-down-left-right',
  generate: 'wand-magic-sparkles',
  refresh: 'rotate',
  export: 'file-export',
  import: 'file-import',
  cloud: 'cloud',

  // Session
  lock: 'lock-keyhole',
  unlock: 'unlock-keyhole',
  login: 'right-to-bracket',
  /**
   * One glyph for every way out — "Log Out" in settings and "Disconnect" on the
   * sidebar, unlock and setup screens are the same act from the app's side, and
   * two different pictures for it read as two different consequences. The mirror
   * of `login`, so arriving and leaving are visibly the same door.
   */
  disconnect: 'right-from-bracket',
  user: 'user',

  // Security report findings
  weak: 'shield-exclamation',
  reused: 'recycle',
  compromised: 'user-secret',
  'audit-clean': 'shield-check',

  // Field types, and the item templates built out of them
  password: 'key',
  show: 'eye',
  hide: 'eye-slash',
  email: 'at',
  mail: 'envelope',
  web: 'earth-americas',
  phone: 'phone',
  credit: 'credit-card',
  date: 'calendar-days',
  month: 'calendar',
  time: 'clock',
  totp: 'clock-rotate-left',
  note: 'memo-pad',
  text: 'text',
  custom: 'note-sticky',
  computer: 'laptop',
  bank: 'building-columns',
  wifi: 'wifi',
  passport: 'passport',

  // Note editor toolbar
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'list-ul': 'list-ul',
  'list-ol': 'list-ol',
  'list-check': 'list-check',

  // Appearance menu
  'theme-light': 'sun-bright',
  'theme-dark': 'moon-stars',
  'theme-auto': 'circle-half-stroke',
};

const here = dirname(fileURLToPath(import.meta.url));
const cssPath =
  process.argv[2] ??
  resolve(here, '../../fontawesome-pro-main/releases/v7.3.0/css/fontawesome.css');
const outPath = resolve(here, '../src/app/ui/icon/icon-glyphs.ts');

/**
 * Reads FontAwesome's own name-to-code-point table.
 *
 * The release ships it as `.fa-a,.fa-b{--fa:"\e2c5"}` — aliases share a rule,
 * and a glyph in the printable-ASCII range is written as the character itself
 * (`.fa-at{--fa:"\@"}`) rather than as a hex escape.
 */
function readVendorGlyphs(css) {
  const glyphs = new Map();
  const rule = /((?:\.fa-[a-z0-9-]+,)*\.fa-[a-z0-9-]+)\{--fa:(?:"|')\\?([^"']+)(?:"|')\}/g;

  for (const [, selectors, value] of css.matchAll(rule)) {
    const literal = value.trim();
    const codePoint = /^[0-9a-f]{2,5}$/i.test(literal)
      ? parseInt(literal, 16)
      : literal.codePointAt(0);

    for (const selector of selectors.split(',')) {
      glyphs.set(selector.trim().replace(/^\.fa-/, ''), codePoint);
    }
  }

  return glyphs;
}

const vendor = readVendorGlyphs(readFileSync(cssPath, 'utf8'));
if (vendor.size === 0) {
  throw new Error(`No glyphs found in ${cssPath} — has the release format changed?`);
}

const unknown = Object.entries(ICONS).filter(([, name]) => !vendor.has(name));
if (unknown.length > 0) {
  throw new Error(
    `Not in this FontAwesome release: ${unknown.map(([key, name]) => `${key} -> ${name}`).join(', ')}`,
  );
}

const escape = (codePoint) => `\\u${codePoint.toString(16).padStart(4, '0')}`;
const quote = (key) => (/^[a-z][a-z0-9]*$/.test(key) ? key : `'${key}'`);

const entries = Object.entries(ICONS)
  .map(([key, name]) => `  ${quote(key)}: '${escape(vendor.get(name))}', // fa-${name}`)
  .join('\n');

const file = `/**
 * What each icon in this app means, as a code point in the FontAwesome Pro
 * face loaded by \`icon.scss\`.
 *
 * Generated — run \`npm run icons\` after editing \`tools/generate-icon-glyphs.mjs\`,
 * which is where the name-to-glyph decisions live. The code points come from
 * the release in \`public/fonts\`; the names are this app's own vocabulary, so a
 * screen asks for \`weak\` or \`audit-clean\` and never for a glyph number.
 */
export const ICON_GLYPHS = {
${entries}
} as const satisfies Record<string, string>;

export type IconName = keyof typeof ICON_GLYPHS;
`;

writeFileSync(outPath, file);
console.log(`Wrote ${Object.keys(ICONS).length} icons to ${outPath}`);
