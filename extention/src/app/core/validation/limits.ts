/**
 * Length ceilings for user input.
 *
 * The first four mirror the server's own `validate()` checks — keeping them in
 * sync means the user is told about an over-long value before a request is
 * built, not after it is rejected. The rest are client-side guards that bound
 * how much text a single field can push through encryption, sync and export.
 *
 * These are ceilings, never truncation points: silently trimming a secret is
 * worse than refusing it.
 */
export const LIMITS = {
  /** ACCOUNT_EMAIL_MAX_LENGTH */
  email: 255,
  /** ACCOUNT_NAME_MAX_LENGTH */
  accountName: 100,
  /** ORG_NAME_MAX_LENGTH */
  orgName: 100,
  /** GROUP name — shares the org ceiling. */
  groupName: 100,

  itemName: 500,
  fieldName: 200,
  fieldValue: 10_000,
  noteValue: 100_000,
  tagName: 100,
  /** No explicit ceiling in the source app — chosen to match org/group names. */
  vaultName: 100,
  url: 2048,
} as const;

export type LimitName = keyof typeof LIMITS;
