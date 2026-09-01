import { estimatePasswordStrength } from '../validation/password-strength';
import { AuditResult, AuditType, FieldType, VaultItem } from '../models';

/** Same threshold the source app used on zxcvbn's identical 0-4 scale. */
const WEAK_PASSWORD_SCORE_THRESHOLD = 2;

/**
 * Above this length, scoring gets expensive for no real benefit — a password
 * this long is assumed strong enough. Matches the source app's own guard on
 * `isPasswordWeak()`.
 */
const MAX_PASSWORD_LENGTH_TO_SCORE = 100;

function isPasswordWeak(password: string): boolean {
  if (password.length > MAX_PASSWORD_LENGTH_TO_SCORE) {
    return false;
  }
  return estimatePasswordStrength(password).score < WEAK_PASSWORD_SCORE_THRESHOLD;
}

/** Lowercase hex SHA-1 — matches the source app's `sha1()`; case matters, HIBP suffixes are compared lowercase. */
export async function sha1Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Have I Been Pwned's k-anonymity range API: only the first 5 hex characters
 * of the password's SHA-1 hash ever leave the browser — never the password,
 * never the full hash. Matches the source app's `hasPasswordBeenCompromised()`.
 */
async function isPasswordCompromised(passwordHash: string): Promise<boolean> {
  const prefix = passwordHash.slice(0, 5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const body = await response.text();

  return body
    .split('\r\n')
    .some((line) => `${prefix}${line.split(':')[0].toLowerCase()}` === passwordHash);
}

export interface AuditOptions {
  /**
   * Only write results back for this item id. Every other item is still
   * scanned — a reused-password finding depends on every item's passwords —
   * but left out of the returned map, so nothing else gets touched. Matches
   * the source app's `updateOnlyItemWithId` option, used after a single item
   * is saved or restored from history.
   */
  onlyItemId?: string;
}

export interface AuditRunResult {
  auditResults: AuditResult[];
}

/**
 * Computes fresh audit results for `items` — three of the four checks from
 * the source app's `auditVaults()`; its expiry check is deliberately omitted:
 *
 * - **Weak**: `estimatePasswordStrength(value).score < 2` (see
 *   `password-strength.ts` — same 0-4 scale as the source app's zxcvbn, a
 *   documented, already-accepted deviation elsewhere in this project).
 * - **Reused**: a password field is reused if its hash appears on more than
 *   one field across every item — computed in one pass over everything
 *   first, exactly like the source app, since the answer for item A can
 *   depend on item Z.
 * - **Compromised**: real Have I Been Pwned lookups (see
 *   `isPasswordCompromised` above). Deduplicated per unique hash within one
 *   run — a harmless optimization the source app doesn't bother with, since
 *   it doesn't change which items end up flagged, only how many times an
 *   identical password gets looked up.
 *
 * Pure and side-effect-free beyond the HIBP network calls — applying the
 * result to `VaultStore` is the caller's job (`AuditService`).
 */
export async function auditItems(
  items: readonly VaultItem[],
  options: AuditOptions = {},
): Promise<ReadonlyMap<string, AuditRunResult>> {

  const passwordHashByField = new Map<string, string>();
  const passwordHashCounts = new Map<string, number>();

  for (const item of items) {
    for (const [fieldIndex, field] of item.fields.entries()) {
      if (field.type !== FieldType.Password || !field.value) {
        continue;
      }
      const hash = await sha1Hex(field.value);
      passwordHashByField.set(`${item.id}:${fieldIndex}`, hash);
      passwordHashCounts.set(hash, (passwordHashCounts.get(hash) ?? 0) + 1);
    }
  }

  // One lookup per *distinct* password, not per field: a password reused
  // across ten items is one question to HIBP, and the answer is the same for
  // all ten. Batched so a vault with hundreds of unique passwords doesn't
  // become hundreds of sequential round trips — but bounded, rather than all
  // at once, to stay a well-behaved client of a free public API.
  const compromisedByHash = await lookupCompromised([...passwordHashCounts.keys()]);
  const results = new Map<string, AuditRunResult>();

  for (const item of items) {
    if (options.onlyItemId && options.onlyItemId !== item.id) {
      continue;
    }

    const auditResults: AuditResult[] = [];

    for (const [fieldIndex, field] of item.fields.entries()) {
      if (field.type !== FieldType.Password || !field.value) {
        continue;
      }

      const hash = passwordHashByField.get(`${item.id}:${fieldIndex}`)!;

      if ((passwordHashCounts.get(hash) ?? 0) > 1) {
        auditResults.push({ type: AuditType.ReusedPassword, fieldIndex });
      }

      if (isPasswordWeak(field.value)) {
        auditResults.push({ type: AuditType.WeakPassword, fieldIndex });
      }

      if (compromisedByHash.get(hash)) {
        auditResults.push({ type: AuditType.CompromisedPassword, fieldIndex });
      }
    }

    results.set(item.id, { auditResults });
  }

  return results;
}

/** How many HIBP requests are allowed to be in flight at once. */
const HIBP_BATCH_SIZE = 10;

async function lookupCompromised(hashes: readonly string[]): Promise<ReadonlyMap<string, boolean>> {
  const compromised = new Map<string, boolean>();

  for (let i = 0; i < hashes.length; i += HIBP_BATCH_SIZE) {
    const batch = hashes.slice(i, i + HIBP_BATCH_SIZE);
    const answers = await Promise.all(batch.map((hash) => isPasswordCompromised(hash)));
    batch.forEach((hash, index) => compromised.set(hash, answers[index]));
  }

  return compromised;
}
