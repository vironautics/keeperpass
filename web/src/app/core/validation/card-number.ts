/**
 * Payment-card number checking: the Luhn checksum, and which network issued it.
 *
 * Both are decided from the number alone — no network call, no lookup table beyond
 * the published IIN (issuer identification number) ranges below. A card that passes
 * both is *well-formed*, which is not the same as active or accepted; the point here
 * is to catch a typo the moment it is typed, not to authorise anything.
 */

/**
 * The Luhn (mod-10) checksum, ISO/IEC 7812-1.
 *
 * Walking right to left, double every second digit and subtract 9 if that goes past
 * 9 (the same thing as summing the two digits of the product); a valid number's total
 * is divisible by 10. It catches every single-digit error and almost every
 * transposition of adjacent digits, which is exactly the class of mistake a person
 * typing 16 digits makes.
 */
export function passesLuhn(digits: string): boolean {
  if (!/^\d{2,}$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits.charCodeAt(i) - 48;

    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

/** A card network, as far as it can be told from the number. */
export interface CardBrand {
  id: string;
  /** Shown next to the field. */
  label: string;
  /** Valid total lengths for this network. */
  lengths: readonly number[];
  /** Matches the leading digits (the IIN range). */
  pattern: RegExp;
}

/**
 * IIN ranges and lengths per network, longest/most specific first — `2221-2720` has
 * to be tried before a bare `2`, and `Maestro`'s prefixes overlap Mastercard's, so
 * order is the tie-break.
 *
 * Sources are each network's own published ranges; the ones that matter in practice
 * are Visa, Mastercard, Amex and the regional networks below.
 */
const BRANDS: readonly CardBrand[] = [
  { id: 'visa', label: 'Visa', lengths: [13, 16, 19], pattern: /^4/ },
  {
    id: 'mastercard',
    label: 'Mastercard',
    lengths: [16],
    pattern: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/,
  },
  { id: 'amex', label: 'American Express', lengths: [15], pattern: /^3[47]/ },
  {
    id: 'discover',
    label: 'Discover',
    lengths: [16, 19],
    pattern: /^(6011|64[4-9]|65|622(12[6-9]|1[3-9]|[2-8]|9[01]|92[0-5]))/,
  },
  {
    id: 'diners',
    label: 'Diners Club',
    lengths: [14, 16, 19],
    pattern: /^(30[0-5]|3095|36|3[89])/,
  },
  { id: 'jcb', label: 'JCB', lengths: [16, 17, 18, 19], pattern: /^35(2[89]|[3-8])/ },
  { id: 'unionpay', label: 'UnionPay', lengths: [14, 15, 16, 17, 18, 19], pattern: /^62/ },
  {
    id: 'maestro',
    label: 'Maestro',
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    pattern: /^(5018|5020|5038|5893|6304|6759|676[1-3])/,
  },
  { id: 'mir', label: 'Mir', lengths: [16, 17, 18, 19], pattern: /^220[0-4]/ },
  {
    id: 'elo',
    label: 'Elo',
    lengths: [16],
    pattern:
      /^(4011(78|79)|43(1274|8935)|45(1416|7393|763[12])|50(4175|6699|67[0-6]|677[0-8]|9[0-8])|627780|63(6297|6368)|650[0-9]|65[1-6]|6516[5-7]|6550[01])/,
  },
  { id: 'hipercard', label: 'Hipercard', lengths: [16], pattern: /^(606282|3841)/ },
  { id: 'rupay', label: 'RuPay', lengths: [16], pattern: /^(60|65|81|82|508)/ },
  { id: 'troy', label: 'Troy', lengths: [16], pattern: /^9792/ },
  { id: 'uatp', label: 'UATP', lengths: [15], pattern: /^1/ },
];

/** Everything worth saying about a typed card number. */
export interface CardNumberInfo {
  /** Just the digits, punctuation stripped. */
  digits: string;
  brand?: CardBrand;
  /** Luhn passes *and* the length is one this network uses. */
  valid: boolean;
  /** Long enough to judge — below this, `valid: false` only means "still typing". */
  complete: boolean;
  /** `4242 4242 4242 4242`, grouped the way the network prints it. */
  formatted: string;
}

/** Amex prints 4-6-5; everyone else groups in fours. */
function group(digits: string, brandId?: string): string {
  const sizes = brandId === 'amex' ? [4, 6, 5] : brandId === 'diners' ? [4, 6, 4] : null;

  if (!sizes) {
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  const parts: string[] = [];
  let at = 0;
  for (const size of sizes) {
    if (at >= digits.length) {
      break;
    }
    parts.push(digits.slice(at, at + size));
    at += size;
  }
  if (at < digits.length) {
    parts.push(digits.slice(at));
  }
  return parts.join(' ');
}

export function inspectCardNumber(value: string): CardNumberInfo {
  const digits = value.replace(/\D/g, '');
  const brand = BRANDS.find((candidate) => candidate.pattern.test(digits));
  const complete = !!brand && brand.lengths.includes(digits.length);

  return {
    digits,
    brand,
    complete,
    valid: complete && passesLuhn(digits),
    formatted: group(digits, brand?.id),
  };
}

/** Every network this can name, for documentation and tests. */
export const CARD_BRANDS = BRANDS;
