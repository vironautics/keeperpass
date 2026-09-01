/**
 * Master password strength estimation.
 *
 * The master password is the only thing standing between an attacker with the
 * encrypted vault and its contents, so it is graded on resistance to offline
 * brute force: how much search space it actually represents, not whether it
 * satisfies a checklist of character classes.
 *
 * Scores run 0-4, the scale strength meters are conventionally built on (and the
 * one zxcvbn made standard), so the meter has five states and the app has one
 * number to compare against everywhere.
 *
 * This is arithmetic, not a dictionary: it measures how much search space the
 * characters represent, discounts the patterns it can recognise, and floors the
 * handful of passwords common enough to be tried first. What it cannot see is
 * that `Tr0ub4dor&3` is a dictionary word with predictable substitutions — a
 * real leaked-password corpus catches that, and adding one is the upgrade path
 * here. Until then the estimator deliberately errs low: calling a decent
 * password weak costs the user a second look, and the opposite costs them the
 * vault.
 */

/** Below this score the app refuses to accept a master password. */
export const MIN_MASTER_PASSWORD_SCORE = 2;

export type StrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
  score: StrengthScore;
  /** Estimated bits of entropy after pattern penalties. */
  entropy: number;
}

const CHARACTER_POOLS: readonly { readonly pattern: RegExp; readonly size: number }[] = [
  { pattern: /[a-z]/, size: 26 },
  { pattern: /[A-Z]/, size: 26 },
  { pattern: /[0-9]/, size: 10 },
  { pattern: /[^a-zA-Z0-9]/, size: 33 },
];

/** Entropy in bits at which each score is reached. */
const SCORE_THRESHOLDS: readonly { readonly bits: number; readonly score: StrengthScore }[] = [
  { bits: 80, score: 4 },
  { bits: 60, score: 3 },
  { bits: 40, score: 2 },
  { bits: 28, score: 1 },
];

/**
 * Passwords any attacker tries in the first second, whatever they score on
 * entropy. `p@ssw0rd` looks respectable to the maths — mixed case, a digit, a
 * symbol — and is on every list ever published.
 *
 * A floor, not a dictionary: thirty entries cannot stand in for a real corpus,
 * and are not meant to. They catch the cases where an honest score would be
 * actively misleading.
 */
const TRIVIAL_PASSWORDS = new Set([
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  'password',
  'password1',
  'password123',
  'qwerty',
  'qwerty123',
  'abc123',
  'letmein',
  'welcome',
  'monkey',
  'dragon',
  'iloveyou',
  'admin',
  'administrator',
  'login',
  'passw0rd',
  'p@ssw0rd',
  'master',
  'sunshine',
  'princess',
  'football',
  'baseball',
  'trustno1',
  'superman',
  'starwars',
  'whatever',
  'changeme',
  'secret',
]);

/**
 * Collapses runs of the same character and ascending or descending sequences,
 * which add length without adding search space: `aaaa` and `1234` are each
 * about as hard to guess as a single character plus a rule.
 */
function effectiveLength(password: string): number {
  let length = 0;
  let runDirection: number | null = null;

  for (let i = 0; i < password.length; i++) {
    if (i === 0) {
      length += 1;
      continue;
    }

    const delta = password.codePointAt(i)! - password.codePointAt(i - 1)!;
    const isRun = delta === 0 || delta === 1 || delta === -1;

    if (isRun && delta === runDirection) {
      // Continuing an established run — heavily discounted.
      length += 0.25;
    } else if (isRun) {
      runDirection = delta;
      length += 0.5;
    } else {
      runDirection = null;
      length += 1;
    }
  }

  return length;
}

function poolSize(password: string): number {
  return CHARACTER_POOLS.reduce(
    (total, { pattern, size }) => (pattern.test(password) ? total + size : total),
    0,
  );
}

export function estimatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, entropy: 0 };
  }

  if (TRIVIAL_PASSWORDS.has(password.toLowerCase())) {
    return { score: 0, entropy: 0 };
  }

  const pool = poolSize(password);
  const entropy = pool > 1 ? effectiveLength(password) * Math.log2(pool) : 0;
  const match = SCORE_THRESHOLDS.find((threshold) => entropy >= threshold.bits);

  return { score: match?.score ?? 0, entropy };
}

export function isAcceptableMasterPassword(password: string): boolean {
  return estimatePasswordStrength(password).score >= MIN_MASTER_PASSWORD_SCORE;
}
