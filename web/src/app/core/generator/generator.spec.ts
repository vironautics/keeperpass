import {
  AVAILABLE_LANGUAGES,
  ALPHABETS,
  generatePassphrase,
  loadWordList,
  randomInt,
  randomString,
} from './generator';

describe('randomInt', () => {
  it('never falls outside [min, max]', () => {
    for (let i = 0; i < 200; i++) {
      const value = randomInt(5, 8);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(8);
    }
  });

  it('supports a single-value range', () => {
    expect(randomInt(3, 3)).toBe(3);
  });

  it('rejects a max below min', () => {
    expect(() => randomInt(5, 4)).toThrow();
  });
});

describe('randomString', () => {
  it('produces a string of the requested length', () => {
    expect(randomString(20, ALPHABETS.lowercase)).toHaveLength(20);
  });

  it('only draws from the given charset', () => {
    const result = randomString(100, ALPHABETS.digits);
    expect(result).toMatch(/^[0-9]{100}$/);
  });

  it('returns an empty string for an empty charset', () => {
    expect(randomString(20, '')).toBe('');
  });
});

describe('loadWordList', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ['alpha', 'bravo', 'charlie'],
    } as Response);
  });

  it('fetches the word list for a language exactly once', async () => {
    await loadWordList('de');
    await loadWordList('de');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith('/wordlists/de.json');
  });

  it('falls back to English when the language fails to load', async () => {
    // A language never requested elsewhere in this file, so its cache entry
    // (and the 'en' entry the fallback populates) can't collide with other tests.
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) =>
      input === '/wordlists/en.json'
        ? Promise.resolve({ ok: true, json: async () => ['fallback'] } as Response)
        : Promise.resolve({ ok: false, json: async () => [] } as Response),
    );

    await expect(loadWordList('zz')).resolves.toEqual(['fallback']);
  });
});

describe('generatePassphrase', () => {
  beforeEach(() => {
    // A language not touched by the loadWordList tests above, since the word
    // list cache is module-level and would otherwise leak between them.
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ['alpha', 'bravo', 'charlie', 'delta'],
    } as Response);
  });

  it('joins the requested number of words with the separator', async () => {
    const phrase = await generatePassphrase(4, '-', 'es');
    expect(phrase.split('-')).toHaveLength(4);
  });

  it('only uses words from the loaded list', async () => {
    const phrase = await generatePassphrase(6, '_', 'es');
    for (const word of phrase.split('_')) {
      expect(['alpha', 'bravo', 'charlie', 'delta']).toContain(word);
    }
  });
});

describe('AVAILABLE_LANGUAGES', () => {
  it('lists English first, matching the default selection', () => {
    expect(AVAILABLE_LANGUAGES[0]).toEqual({ value: 'en', label: 'English' });
  });
});
