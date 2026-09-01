/**
 * Time-based one-time passwords (RFC 6238) over HMAC-SHA1, which is what
 * authenticator apps and `otpauth://` URIs use.
 *
 * Requires a secure context for `crypto.subtle` — https, or localhost in
 * development.
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export const DEFAULT_TOTP_PERIOD_SECONDS = 30;
export const DEFAULT_TOTP_DIGITS = 6;

export class InvalidTotpSecretError extends Error {
  constructor(character: string) {
    super(`"${character}" is not a valid base32 character.`);
    this.name = 'InvalidTotpSecretError';
  }
}

/**
 * Decodes a base32 secret, ignoring padding, whitespace and letter case.
 *
 * Backed by an explicit ArrayBuffer so the result satisfies `BufferSource` and
 * can be handed straight to Web Crypto.
 */
export function base32ToBytes(secret: string): Uint8Array<ArrayBuffer> {
  const normalized = secret.replace(/[\s=]/g, '').toUpperCase();

  // Each character carries 5 bits; trailing bits that do not complete a byte
  // are padding and get dropped.
  const bytes = new Uint8Array(new ArrayBuffer(Math.floor((normalized.length * 5) / 8)));

  let buffer = 0;
  let bufferedBits = 0;
  let written = 0;

  for (const character of normalized) {
    const index = BASE32_ALPHABET.indexOf(character);
    if (index === -1) {
      throw new InvalidTotpSecretError(character);
    }

    buffer = (buffer << 5) | index;
    bufferedBits += 5;

    if (bufferedBits >= 8) {
      bufferedBits -= 8;
      bytes[written++] = (buffer >>> bufferedBits) & 0xff;
    }
  }

  return bytes;
}

export interface TotpOptions {
  period?: number;
  digits?: number;
  /** Milliseconds since the epoch. Injectable so tests stay deterministic. */
  timestamp?: number;
}

/** The counter value the given moment falls into. */
export function totpCounter(timestamp: number, period = DEFAULT_TOTP_PERIOD_SECONDS): number {
  return Math.floor(timestamp / 1000 / period);
}

/** How far through the current period we are, from 0 to 1. */
export function totpProgress(timestamp: number, period = DEFAULT_TOTP_PERIOD_SECONDS): number {
  return ((timestamp / 1000) % period) / period;
}

export async function generateTotp(secret: string, options: TotpOptions = {}): Promise<string> {
  const {
    period = DEFAULT_TOTP_PERIOD_SECONDS,
    digits = DEFAULT_TOTP_DIGITS,
    timestamp = Date.now(),
  } = options;

  const key = await crypto.subtle.importKey(
    'raw',
    base32ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );

  const counter = new Uint8Array(new ArrayBuffer(8));
  new DataView(counter.buffer).setBigUint64(0, BigInt(totpCounter(timestamp, period)));

  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, counter));

  // Dynamic truncation: the low nibble of the last byte picks the offset of a
  // 4-byte window, whose top bit is cleared to keep the result positive.
  const offset = mac[mac.length - 1] & 0x0f;
  const code =
    ((mac[offset] & 0x7f) << 24) |
    (mac[offset + 1] << 16) |
    (mac[offset + 2] << 8) |
    mac[offset + 3];

  return String(code % 10 ** digits).padStart(digits, '0');
}
