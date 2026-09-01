import { estimatePasswordStrength } from '../validation/password-strength';
import { AuditResult, AuditType, FieldType, VaultItem } from '../models';

/**
 * The score below which a password is called weak — the same line
 * `MIN_MASTER_PASSWORD_SCORE` draws for the master password, on the same 0-4
 * scale. Two different bars for "strong enough" would be indefensible: the
 * audit would flag passwords the app itself had just accepted.
 */
const WEAK_PASSWORD_SCORE_THRESHOLD = 2;

/**
 * Longer than this and the password is taken as strong without being scored.
 *
 * Scoring walks the string, so a pasted document in a password field would cost
 * real time on every audit, and there is no answer worth waiting for: nothing
 * this long is weak on length, and the estimator has no penalty that could pull
 * a hundred characters below the threshold.
 */
const MAX_PASSWORD_LENGTH_TO_SCORE = 100;

function isPasswordWeak(password: string): boolean {
  if (password.length > MAX_PASSWORD_LENGTH_TO_SCORE) {
    return false;
  }
  return estimatePasswordStrength(password).score < WEAK_PASSWORD_SCORE_THRESHOLD;
}

/**
 * SHA-1 of `value` as lower-case hex.
 *
 * SHA-1 is broken for signatures and exactly right here: it is the hash the
 * breach corpus is indexed by, so it is not a security choice at all, just the
 * lookup key. Lower-case because every comparison in this file is made against
 * a lower-cased response line, and one end of that has to be pinned down.
 */
export async function sha1Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Asks Have I Been Pwned whether a password appears in a known breach.
 *
 * The query is k-anonymous: only the first five hex characters of the hash
 * leave the browser, and the service answers with every breached hash sharing
 * that prefix — some hundreds of them — which is then matched locally. The
 * password never leaves, and neither does its full hash, so nobody at the other
 * end can tell which of those hundreds was being asked about.
 *
 * A response that is not OK throws rather than returning `false`. This is the
 * one check in the audit that can fail for reasons outside the vault — a rate
 * limit, an outage, a captive portal — and a rate-limit body parsed as "no
 * match" would tell the user their breached password is fine. `AuditService`
 * catches it, keeps the findings from the last good run, and tries again on the
 * next trigger; saying nothing is the only honest thing to say when the answer
 * never arrived.
 */
async function isPasswordCompromised(passwordHash: string): Promise<boolean> {
  const prefix = passwordHash.slice(0, 5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);

  if (!response.ok) {
    throw new Error(`Breach lookup failed with status ${response.status}`);
  }

  const body = await response.text();

  return body
    .split('\r\n')
    .some((line) => `${prefix}${line.split(':')[0].toLowerCase()}` === passwordHash);
}

export interface AuditOptions {
  /**
   * Report on this one item only.
   *
   * Every other item is still *scanned* — whether a password is reused is a
   * question about the whole vault, and it cannot be answered from one item —
   * but only this one appears in the returned map, so the caller replaces one
   * entry instead of every entry. Used after a single item is saved or restored,
   * where nothing else can have changed.
   */
  onlyItemId?: string;
}

export interface AuditRunResult {
  auditResults: AuditResult[];
}

/**
 * Grades every password in `items` and returns what is wrong with each item.
 *
 * Only `Password` fields are examined, and only ones with a value; a PIN or a
 * card number is a secret but not a password, and none of the three checks below
 * says anything true about one.
 *
 * - **Weak** — scores under the threshold on its own, from the value alone.
 * - **Reused** — its hash shows up on more than one field anywhere in the set.
 *   This is why the whole set is hashed before anything is judged: whether item
 *   A's password is reused can depend on item Z, so there is no order in which
 *   one pass could answer it.
 * - **Compromised** — the hash is in a known breach, asked once per *distinct*
 *   password rather than once per field. Ten items sharing a password is one
 *   question with one answer, and asking it ten times would only make the audit
 *   slower and the API's day worse.
 *
 * Nothing here writes anything: it reads items and returns findings. Storing
 * them is `AuditService`'s job, and keeping that split is what lets the whole
 * thing be tested without a vault.
 */
export async function auditItems(
  items: readonly VaultItem[],
  options: AuditOptions = {},
): Promise<ReadonlyMap<string, AuditRunResult>> {
  const passwordsByItem = await scanPasswords(items);
  const timesUsed = countByHash(passwordsByItem);
  const compromisedByHash = await lookupCompromised([...timesUsed.keys()]);

  // Reporting on one item still needed the scan above to cover all of them,
  // because that is where the reuse counts come from.
  const reported = options.onlyItemId
    ? items.filter((item) => item.id === options.onlyItemId)
    : items;

  const results = new Map<string, AuditRunResult>();

  for (const item of reported) {
    const auditResults: AuditResult[] = [];

    for (const { fieldIndex, value, hash } of passwordsByItem.get(item.id) ?? []) {
      if ((timesUsed.get(hash) ?? 0) > 1) {
        auditResults.push({ type: AuditType.ReusedPassword, fieldIndex });
      }

      if (isPasswordWeak(value)) {
        auditResults.push({ type: AuditType.WeakPassword, fieldIndex });
      }

      if (compromisedByHash.get(hash)) {
        auditResults.push({ type: AuditType.CompromisedPassword, fieldIndex });
      }
    }

    // Set even when empty: an item that just had its last finding fixed needs
    // an answer of "nothing", or the caller keeps showing the old one.
    results.set(item.id, { auditResults });
  }

  return results;
}

/** A password field worth judging, with the hash both later checks need. */
interface ScannedPassword {
  /** Its position in the item's `fields`, which is how a finding points at it. */
  fieldIndex: number;
  value: string;
  hash: string;
}

/**
 * Every non-empty password field in the set, hashed once, grouped by item.
 *
 * Hashing up front is what keeps the rest of the audit straightforward: the
 * reuse count and the breach lookup both need the hash, and neither should be
 * computing it again. Items with no password fields are simply absent.
 */
async function scanPasswords(
  items: readonly VaultItem[],
): Promise<ReadonlyMap<string, readonly ScannedPassword[]>> {
  const byItem = new Map<string, readonly ScannedPassword[]>();

  for (const item of items) {
    const scanned: ScannedPassword[] = [];

    for (const [fieldIndex, field] of item.fields.entries()) {
      if (field.type !== FieldType.Password || !field.value) {
        continue;
      }

      scanned.push({ fieldIndex, value: field.value, hash: await sha1Hex(field.value) });
    }

    if (scanned.length > 0) {
      byItem.set(item.id, scanned);
    }
  }

  return byItem;
}

/** How many fields across the whole set hold each password. Two or more is reuse. */
function countByHash(
  passwordsByItem: ReadonlyMap<string, readonly ScannedPassword[]>,
): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();

  for (const passwords of passwordsByItem.values()) {
    for (const { hash } of passwords) {
      counts.set(hash, (counts.get(hash) ?? 0) + 1);
    }
  }

  return counts;
}

/**
 * How many breach lookups may be in flight at once.
 *
 * Some concurrency, because a vault with three hundred distinct passwords would
 * otherwise be three hundred round trips end to end; not unbounded, because
 * this is a free public service and firing every request at once is how a
 * client gets rate-limited — which, since a failed lookup fails the run, would
 * cost the audit rather than just the request.
 */
const BREACH_LOOKUP_CONCURRENCY = 10;

/** Breached-or-not per hash. Throws if any lookup fails — see `isPasswordCompromised`. */
async function lookupCompromised(hashes: readonly string[]): Promise<ReadonlyMap<string, boolean>> {
  const compromised = new Map<string, boolean>();

  for (let start = 0; start < hashes.length; start += BREACH_LOOKUP_CONCURRENCY) {
    const batch = hashes.slice(start, start + BREACH_LOOKUP_CONCURRENCY);
    const answers = await Promise.all(batch.map((hash) => isPasswordCompromised(hash)));
    batch.forEach((hash, index) => compromised.set(hash, answers[index]));
  }

  return compromised;
}
