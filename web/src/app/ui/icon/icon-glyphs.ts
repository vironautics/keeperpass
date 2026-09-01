/**
 * What each icon in this app means, as a code point in the FontAwesome Pro
 * face loaded by `icon.scss`.
 *
 * Generated — run `npm run icons` after editing `tools/generate-icon-glyphs.mjs`,
 * which is where the name-to-glyph decisions live. The code points come from
 * the release in `public/fonts`; the names are this app's own vocabulary, so a
 * screen asks for `weak` or `audit-clean` and never for a glyph number.
 */
export const ICON_GLYPHS = {
  add: '\u002b', // fa-plus
  cancel: '\uf00d', // fa-xmark
  more: '\uf141', // fa-ellipsis
  search: '\uf002', // fa-magnifying-glass
  settings: '\uf013', // fa-gear
  support: '\uf590', // fa-headset
  policies: '\uf56c', // fa-file-contract
  'chevron-down': '\uf078', // fa-chevron-down
  'chevron-left': '\uf053', // fa-chevron-left
  'chevron-right': '\uf054', // fa-chevron-right
  'circle-arrow-left': '\uf0a8', // fa-circle-arrow-left
  'circle-arrow-right': '\uf0a9', // fa-circle-arrow-right
  'arrow-up': '\uf062', // fa-arrow-up
  'arrow-down': '\uf063', // fa-arrow-down
  'arrow-left': '\uf060', // fa-arrow-left
  'arrow-right': '\uf061', // fa-arrow-right
  'sort-asc': '\uf885', // fa-arrow-up-short-wide
  'sort-desc': '\uf884', // fa-arrow-down-short-wide
  alert: '\uf071', // fa-triangle-exclamation
  success: '\uf058', // fa-circle-check
  check: '\uf00c', // fa-check
  forbidden: '\uf05e', // fa-ban
  'info-circle': '\uf05a', // fa-circle-info
  'checkbox-checked': '\uf14a', // fa-square-check
  'checkbox-unchecked': '\uf0c8', // fa-square
  'select-all': '\uf560', // fa-check-double
  vault: '\ue2c5', // fa-vault
  vaults: '\uf5fd', // fa-layer-group
  tag: '\uf02b', // fa-tag
  tags: '\uf02c', // fa-tags
  favourite: '\uf005', // fa-star
  field: '\ue211', // fa-pen-field
  file: '\uf15b', // fa-file
  history: '\ue4a2', // fa-rectangle-history
  copy: '\uf0c5', // fa-copy
  edit: '\uf044', // fa-pen-to-square
  delete: '\uf1f8', // fa-trash
  move: '\uf0b2', // fa-up-down-left-right
  generate: '\ue2ca', // fa-wand-magic-sparkles
  refresh: '\uf2f1', // fa-rotate
  export: '\uf56e', // fa-file-export
  import: '\uf56f', // fa-file-import
  cloud: '\uf0c2', // fa-cloud
  lock: '\uf30d', // fa-lock-keyhole
  unlock: '\uf13e', // fa-unlock-keyhole
  login: '\uf2f6', // fa-right-to-bracket
  disconnect: '\uf2f5', // fa-right-from-bracket
  user: '\uf007', // fa-user
  weak: '\ue247', // fa-shield-exclamation
  reused: '\uf1b8', // fa-recycle
  compromised: '\uf21b', // fa-user-secret
  'audit-clean': '\uf2f7', // fa-shield-check
  password: '\uf084', // fa-key
  show: '\uf06e', // fa-eye
  hide: '\uf070', // fa-eye-slash
  email: '\u0040', // fa-at
  mail: '\uf0e0', // fa-envelope
  web: '\uf57d', // fa-earth-americas
  phone: '\uf095', // fa-phone
  credit: '\uf09d', // fa-credit-card
  date: '\uf073', // fa-calendar-days
  month: '\uf133', // fa-calendar
  time: '\uf017', // fa-clock
  totp: '\uf1da', // fa-clock-rotate-left
  note: '\ue1da', // fa-memo-pad
  text: '\uf893', // fa-text
  custom: '\uf249', // fa-note-sticky
  computer: '\uf109', // fa-laptop
  bank: '\uf19c', // fa-building-columns
  wifi: '\uf1eb', // fa-wifi
  passport: '\uf5ab', // fa-passport
  'heading-1': '\uf313', // fa-h1
  'heading-2': '\uf314', // fa-h2
  'heading-3': '\uf315', // fa-h3
  'list-ul': '\uf0ca', // fa-list-ul
  'list-ol': '\uf0cb', // fa-list-ol
  'list-check': '\uf0ae', // fa-list-check
  'theme-light': '\ue28f', // fa-sun-bright
  'theme-dark': '\uf755', // fa-moon-stars
  'theme-auto': '\uf042', // fa-circle-half-stroke
} as const satisfies Record<string, string>;

export type IconName = keyof typeof ICON_GLYPHS;
