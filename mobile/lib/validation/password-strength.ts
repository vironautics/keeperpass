/**
 * Reconstruction of the web app's warning-only strength meter (character-pool ×
 * discounted effective length, scored against entropy-bit thresholds) — the exact
 * source wasn't available to port verbatim, so this is a faithful equivalent, not
 * a literal copy. It only ever produces a warning; Setup/Recover never block on it.
 */
const ENTROPY_THRESHOLDS = [28, 40, 60, 80] as const; // bits, boundaries between scores 0-4
const MIN_MASTER_PASSWORD_SCORE = 2;

const TRIVIAL_PASSWORDS = [
  'password',
  '123456',
  '123456789',
  'qwerty',
  'password1',
  '12345678',
  '111111',
  '123123',
  'abc123',
  'password123',
  '1234567',
  'iloveyou',
  'admin',
  'welcome',
  'monkey',
  'login',
  'letmein',
  'dragon',
  'sunshine',
  'master',
  'hello',
  'freedom',
  'whatever',
  'qazwsx',
  'trustno1',
  'starwars',
  '000000',
  '1q2w3e4r',
  'zaq12wsx',
  'football',
];

function poolSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 33;
  return size || 1;
}

/** Collapses repeated/sequential runs ("aaaa", "1234") toward a single unit each, so they don't inflate the entropy estimate. */
function effectiveLength(password: string): number {
  if (password.length === 0) return 0;

  let effective = 1;
  let runLength = 1;
  for (let i = 1; i < password.length; i++) {
    const prev = password.charCodeAt(i - 1);
    const curr = password.charCodeAt(i);
    const isRun = curr === prev || curr === prev + 1 || curr === prev - 1;
    if (isRun) {
      runLength++;
      effective += 1 / runLength;
    } else {
      runLength = 1;
      effective += 1;
    }
  }
  return effective;
}

/** Returns a score from 0 (weakest) to 4 (strongest). */
function estimatePasswordStrength(password: string): number {
  if (!password || TRIVIAL_PASSWORDS.includes(password.toLowerCase())) return 0;

  const bits = effectiveLength(password) * Math.log2(poolSize(password));
  return ENTROPY_THRESHOLDS.filter((threshold) => bits >= threshold).length;
}

export { estimatePasswordStrength, MIN_MASTER_PASSWORD_SCORE, TRIVIAL_PASSWORDS };
