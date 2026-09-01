/**
 * Detection of characters that make displayed text lie about its content.
 *
 * A password manager is a trust-decision tool: the user reads an item name or a
 * URL and decides whether to hand over a credential. Characters that let text
 * render differently from how it is stored attack that decision directly, so
 * they are rejected on the way in.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * ----------------------------------
 * It does not strip or reject quotes, angle brackets, backslashes, semicolons
 * or any other "dangerous-looking" punctuation. Those are legitimate — and
 * desirable — characters in a stored password. Angular escapes on render and
 * the server parameterises its queries; that is where injection is prevented.
 * Filtering them here would corrupt secrets while adding no protection.
 */

/** Inclusive code point range. */
type CodePointRange = readonly [start: number, end: number];

/**
 * C0 and C1 control codes, excluding tab (09), line feed (0A) and carriage
 * return (0D). These survive a round-trip into CSV and JSON exports, where
 * they can break the record structure or hide content from whatever reads the
 * file next.
 */
const CONTROL_RANGES: readonly CodePointRange[] = [
  [0x0000, 0x0008],
  [0x000b, 0x000c],
  [0x000e, 0x001f],
  [0x007f, 0x009f],
];

/**
 * Explicit bidirectional formatting: LRM, RLM, the embedding/override family
 * (LRE, RLE, PDF, LRO, RLO) and the isolates (LRI, RLI, FSI, PDI).
 *
 * These reorder how a string renders without changing what it contains — the
 * "Trojan Source" class of attack. An entry displayed as `paypal.com` can be
 * stored as something else entirely, so autofill and the human reading the
 * vault list disagree about which site a credential belongs to.
 */
const BIDI_RANGES: readonly CodePointRange[] = [
  [0x200e, 0x200f],
  [0x202a, 0x202e],
  [0x2066, 0x2069],
];

/**
 * Zero-width characters: ZWSP, ZWNJ, ZWJ, word joiner and BOM.
 *
 * They pad a string invisibly, so two entries that look identical compare as
 * different — enough to slip a lookalike past a user scanning a vault list.
 */
const INVISIBLE_RANGES: readonly CodePointRange[] = [
  [0x200b, 0x200d],
  [0x2060, 0x2060],
  [0xfeff, 0xfeff],
];

/**
 * Builds a character class from code point ranges. None of the ranges above
 * contain `]`, `\`, `^` or `-`, so the members need no further escaping.
 */
function charClass(ranges: readonly CodePointRange[]): string {
  const members = ranges
    .map(([start, end]) =>
      start === end
        ? String.fromCodePoint(start)
        : `${String.fromCodePoint(start)}-${String.fromCodePoint(end)}`,
    )
    .join('');
  return `[${members}]`;
}

const CONTROL = new RegExp(charClass(CONTROL_RANGES));
const BIDI = new RegExp(charClass(BIDI_RANGES));
const INVISIBLE = new RegExp(charClass(INVISIBLE_RANGES));

const UNSAFE = new RegExp([CONTROL_RANGES, BIDI_RANGES, INVISIBLE_RANGES].map(charClass).join('|'));
const UNSAFE_GLOBAL = new RegExp(UNSAFE.source, 'g');

export function hasControlCharacters(value: string): boolean {
  return CONTROL.test(value);
}

export function hasBidiControl(value: string): boolean {
  return BIDI.test(value);
}

export function hasInvisibleCharacters(value: string): boolean {
  return INVISIBLE.test(value);
}

export function hasLineBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

/** True when the string renders as exactly what it contains. */
export function isDisplaySafe(value: string): boolean {
  return !UNSAFE.test(value);
}

/**
 * Removes the characters above.
 *
 * For cleaning text the app itself produced — imported files, pasted content —
 * never for a value the user typed into a secret field.
 */
export function stripUnsafeCharacters(value: string): string {
  return value.replace(UNSAFE_GLOBAL, '');
}
