/**
 * Client-side password and passphrase generation.
 *
 * Randomness comes straight from Web Crypto (`crypto.getRandomValues`), never
 * `Math.random`, with rejection sampling so every value in range is equally
 * likely. `randomString`/`randomInt` are ports of the source app's
 * `randomString`/`randomNumber` (`packages/core/src/util.ts`), adapted from an
 * async custom-provider abstraction to direct, synchronous Web Crypto calls —
 * the same approach `core/otp/totp.ts` already takes for this port.
 */

export const CHARS = {
  numbers: '0123456789',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  other: '/+()%"=&-!:\'*#?;,_.@`~$^[{]}\\|<>',
};

/** A random string of the given `length`, with characters drawn from `charset`. */
export function randomString(length: number, charset: string): string {
  if (!charset) {
    return '';
  }

  // Reject bytes above the highest multiple of charset.length so every
  // character stays equally likely (no modulo bias toward the low end).
  const rejectAbove = 255 - (256 % charset.length);
  const byte = new Uint8Array(1);
  let result = '';

  while (result.length < length) {
    crypto.getRandomValues(byte);
    if (byte[0] > rejectAbove) {
      continue;
    }
    result += charset[byte[0] % charset.length];
  }

  return result;
}

/** A uniformly random integer in `[min, max]`, inclusive. */
export function randomInt(min: number, max: number): number {
  if (max < min) {
    throw new Error('Upper bound must be greater than or equal to lower bound.');
  }

  const range = max - min + 1;
  const bitsNeeded = Math.ceil(Math.log2(range));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = 2 ** bitsNeeded - 1;
  const bytes = new Uint8Array(bytesNeeded);

  while (true) {
    crypto.getRandomValues(bytes);

    let value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value += bytes[i] * 2 ** (8 * (bytesNeeded - 1 - i));
    }
    value &= mask;

    if (value < range) {
      return min + value;
    }
  }
}

export interface GeneratorLanguage {
  value: string;
  label: string;
}

/** Matches `packages/locale/src/wordlists.ts` — same five languages, same order. */
export const AVAILABLE_LANGUAGES: readonly GeneratorLanguage[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
];

const wordListCache = new Map<string, Promise<readonly string[]>>();

/**
 * Fetches a language's word list from `public/wordlists/`, once per session.
 * Falls back to English if the language is missing or fails to load.
 */
export function loadWordList(language: string): Promise<readonly string[]> {
  const cached = wordListCache.get(language);
  if (cached) {
    return cached;
  }

  const promise = fetch(`/wordlists/${language}.json`)
    .then((response) => (response.ok ? (response.json() as Promise<string[]>) : []))
    .catch(() => [])
    .then((words) => (words.length > 0 || language === 'en' ? words : loadWordList('en')));

  wordListCache.set(language, promise);
  return promise;
}

/** A passphrase of `wordCount` words from `language`'s word list, joined by `separator`. */
export async function generatePassphrase(
  wordCount: number,
  separator: string,
  language: string,
): Promise<string> {
  const words = await loadWordList(language);
  if (words.length === 0) {
    return '';
  }

  const picked: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    picked.push(words[randomInt(0, words.length - 1)]);
  }

  return picked.join(separator);
}
