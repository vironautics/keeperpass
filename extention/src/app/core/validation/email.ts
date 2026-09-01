import { LIMITS } from './limits';
import { isDisplaySafe } from './text-safety';

/**
 * Requires a local part, an `@`, and a dotted domain with a 2+ character final
 * label.
 *
 * Stricter than Angular's `Validators.email`, which accepts `a@b`. The address
 * is an account identifier that has to receive a verification mail, so a
 * domain that cannot resolve is not a valid answer — catching it here saves a
 * round trip and a confusing "check your inbox" for mail that will never come.
 */
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.\d]{2,}$/;

/**
 * Trims surrounding whitespace. Case is left alone on purpose: the local part
 * is case-sensitive per RFC 5321, and the server already compares addresses
 * case-insensitively, so lowercasing here would alter the user's identity for
 * no gain.
 */
export function normalizeEmail(value: string): string {
  return value.trim();
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return (
    email.length > 0 && email.length <= LIMITS.email && isDisplaySafe(email) && EMAIL.test(email)
  );
}
