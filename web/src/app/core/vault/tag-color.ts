/**
 * Deterministic colour for a tag name, so the same tag always renders the
 * same chip colour across items and the menu — without persisting a colour
 * anywhere. Not cryptographic: all it has to do is spread names evenly and
 * never change its mind about one.
 *
 * Eight distinguishable hues, and no violet: that was the old accent, and a chip
 * in it still read as "the brand colour" rather than "a tag", so the slot moved to
 * the yellow-green gap between gold and green.
 */
const PALETTE = [
  '#3bb7f9', // blue
  '#8ec06c', // yellow-green
  '#4caf7d', // green
  '#f0a04b', // orange
  '#f26d8d', // pink
  '#3fc7c1', // teal
  '#e0b23c', // gold
  '#8d97a8', // slate
];

/**
 * Any odd 32-bit constant works as a starting state; this one is the FNV offset
 * basis, chosen only because it is a well-known value with no obvious structure.
 * The state must never be zero — xorshift cannot leave zero.
 */
const SEED = 0x811c9dc5;

/**
 * Advances an xorshift32 generator by one step.
 *
 * `>>> 0` after every step is not decoration: JavaScript's bitwise operators
 * hand back a *signed* 32-bit result, so without it the state would drift into
 * negative doubles and the shifts would stop agreeing with themselves.
 */
function scramble(state: number): number {
  let next = state;
  next = (next ^ (next << 13)) >>> 0;
  next = (next ^ (next >>> 17)) >>> 0;
  next = (next ^ (next << 5)) >>> 0;
  return next;
}

export function tagColor(name: string): string {
  /**
   * One xorshift step per code point, with the code point mixed into the state
   * before each step — so position matters ("ab" and "ba" diverge) and every
   * character reaches all 32 bits.
   *
   * `for…of` walks *code points*, not UTF-16 units, which is what keeps an
   * emoji tag one character instead of two half-surrogates that hash apart.
   */
  let state = SEED;
  for (const character of name) {
    state = scramble((state ^ (character.codePointAt(0) ?? 0)) >>> 0);
  }

  /**
   * The palette has 8 entries, so `% PALETTE.length` reads the low three bits
   * and nothing else. Folding the high halves down first is what gives those
   * three bits the whole word's worth of entropy.
   */
  const folded = (state ^ (state >>> 11) ^ (state >>> 22)) >>> 0;
  return PALETTE[folded % PALETTE.length];
}
