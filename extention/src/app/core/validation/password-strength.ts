/**
 * Master password strength estimation.
 *
 * The master password is the only thing standing between an attacker with the
 * encrypted vault and its contents, so it is graded on resistance to offline
 * brute force: how much search space it actually represents, not whether it
 * satisfies a checklist of character classes.
 *
 * Scores use the same 0-4 scale as zxcvbn, which the source app used and which
 * should eventually replace this: a real dictionary of 30k leaked passwords
 * catches human patterns that entropy maths cannot. Until that dependency is
 * added, this errs towards under-estimating — a password called weak that is
 * actually fine costs the user a second look; the reverse costs them the vault.
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
 * Passwords so common that any search starts with them, so their real strength
 * is zero no matter how they score on entropy. A floor, not a dictionary —
 * zxcvbn's full list is what this is standing in for.
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
