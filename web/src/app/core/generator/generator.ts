/**
 * Client-side password and passphrase generation.
 *
 * Every random draw comes from Web Crypto (`crypto.getRandomValues`) — never
 * `Math.random`, which is a predictable PRNG and would make a generated
 * password guessable from a handful of earlier ones.
 *
 * Both primitives below reject part of what they draw rather than folding it
 * with a plain modulo. Taking `byte % 26` would hand out the first
 * `256 % 26 = 22` letters slightly more often than the rest, and a bias that
 * small is still a bias an attacker can weight their search with.
 */

/** Every character in an inclusive code-point range — `0x61`–`0x7a` is a–z. */
function codePointRange(first: number, last: number): string {
  let characters = '';
  for (let code = first; code <= last; code++) {
    characters += String.fromCodePoint(code);
  }
  return characters;
}

const DIGITS = codePointRange(0x30, 0x39);
const UPPERCASE = codePointRange(0x41, 0x5a);
const LOWERCASE = codePointRange(0x61, 0x7a);

/**
 * The alphabets a generated password can draw on, one per toggle in the UI.
 *
 * Derived from the printable-ASCII code points rather than written out, so the
 * sets cannot silently disagree with their own names: `symbols` is *everything*
 * printable that is not a letter or a digit, which is the 32 ASCII punctuation
 * marks. Nothing is held back for being awkward to type — a password manager
 * types it for you, and dropping characters only shrinks the search space.
 */
export const ALPHABETS = {
  digits: DIGITS,
  lowercase: LOWERCASE,
  uppercase: UPPERCASE,
  symbols: [...codePointRange(0x21, 0x7e)]
    .filter((character) => !DIGITS.includes(character))
    .filter((character) => !UPPERCASE.includes(character))
    .filter((character) => !LOWERCASE.includes(character))
    .join(''),
};

/** One byte can address at most this many characters without bias. */
const MAX_ALPHABET_SIZE = 256;

/**
 * A random string of `length` characters drawn from `alphabet`.
 *
 * Bytes arrive in batches of `length` rather than one at a time: a 32-character
 * password is then one call into the CSPRNG instead of 32, and the loop simply
 * draws another batch if too many bytes were rejected.
 */
export function randomString(length: number, alphabet: string): string {
  const characters = [...alphabet];

  if (length <= 0 || characters.length === 0) {
    return '';
  }
  if (characters.length > MAX_ALPHABET_SIZE) {
    throw new Error(`An alphabet of more than ${MAX_ALPHABET_SIZE} characters is not supported.`);
  }

  // Byte values at or above the last whole multiple of the alphabet size are
  // the biased tail; they get thrown away instead of wrapped around.
  const usableBytes = MAX_ALPHABET_SIZE - (MAX_ALPHABET_SIZE % characters.length);
  const batch = new Uint8Array(length);
  const picked: string[] = [];

  while (picked.length < length) {
    crypto.getRandomValues(batch);

    for (const byte of batch) {
      if (byte >= usableBytes) {
        continue;
      }
      picked.push(characters[byte % characters.length]);
      if (picked.length === length) {
        break;
      }
    }
  }

  return picked.join('');
}

/**
 * A uniformly distributed integer in `[min, max]`, both ends included.
 *
 * One 32-bit draw per attempt, rejected when it lands in the incomplete block
 * at the top of the range — the same reasoning as `randomString`, one word
 * wider. Ranges beyond 2³² are not supported; nothing here needs them.
 */
export function randomInt(min: number, max: number): number {
  if (max < min) {
    throw new Error(`Empty range: ${min} to ${max}.`);
  }

  const range = max - min + 1;
  if (range === 1) {
    return min;
  }

  const blocks = 2 ** 32 - (2 ** 32 % range);
  const draw = new Uint32Array(1);

  let value: number;
  do {
    crypto.getRandomValues(draw);
    value = draw[0];
  } while (value >= blocks);

  return min + (value % range);
}

export interface GeneratorLanguage {
  value: string;
  label: string;
}

/**
 * The languages a passphrase can be built from — one per word list in
 * `public/wordlists/`. Labels are endonyms, for the same reason the interface
 * language picker uses them: see `core/i18n/locales.ts`.
 */
export const AVAILABLE_LANGUAGES: readonly GeneratorLanguage[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
];

export interface GeneratorSeparator {
  value: string;
  label: string;
}

/**
 * The separators offered between passphrase words. Shared by every place that
 * builds a passphrase (`GeneratorPanel`, `GeneratePasswordDialog`) so the
 * choices — and their labels — can't drift apart between them.
 */
export const SEPARATOR_OPTIONS: readonly GeneratorSeparator[] = [
  { value: '-', label: 'Dash ( - )' },
  { value: '_', label: 'Underscore ( _ )' },
  { value: '/', label: 'Slash ( / )' },
  { value: ' ', label: 'Space (   )' },
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
  for (let index = 0; index < wordCount; index++) {
    picked.push(words[randomInt(0, words.length - 1)]);
  }

  return picked.join(separator);
}
