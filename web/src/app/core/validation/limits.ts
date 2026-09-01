/**
 * How long each kind of user input is allowed to be.
 *
 * One table rather than a number sprinkled through the forms, so the answer to
 * "how long can a tag be?" is in one place and the same everywhere a tag is
 * typed — the item view and the tags page would otherwise be free to disagree.
 *
 * The values are generous on purpose. Everything here ends up inside a single
 * encrypted file that is uploaded whole on every save, so the ceilings exist to
 * stop one runaway paste from bloating that file, not to tell anyone how to name
 * their vault. Notes get their own, much larger, ceiling because a note is the
 * one field people legitimately write paragraphs into.
 *
 * They are ceilings, never truncation points: quietly trimming a value in a
 * password manager hands back a password that no longer opens the account.
 */
export const LIMITS = {
  email: 255,
  itemName: 500,
  fieldName: 200,
  fieldValue: 10_000,
  noteValue: 100_000,
  tagName: 100,
  vaultName: 100,
} as const;

/** The keys above, so `maxLength('tagName')` cannot be misspelled. */
export type LimitName = keyof typeof LIMITS;
