import {
  base32ToBytes,
  generateTotp,
  InvalidTotpSecretError,
  totpCounter,
  totpProgress,
} from './totp';

/** "12345678901234567890" — the shared secret from RFC 6238 appendix B. */
const RFC_6238_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

describe('base32ToBytes', () => {
  it('decodes to the expected bytes', () => {
    expect([...base32ToBytes('JBSWY3DP')]).toEqual([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
  });

  it('ignores padding, whitespace and case', () => {
    expect([...base32ToBytes('jbsw y3dp==')]).toEqual([...base32ToBytes('JBSWY3DP')]);
  });

  it('rejects a character outside the base32 alphabet', () => {
    expect(() => base32ToBytes('JBSW1234')).toThrow(InvalidTotpSecretError);
  });
});

describe('totpCounter', () => {
  it('advances once per period', () => {
    expect(totpCounter(0)).toBe(0);
    expect(totpCounter(29_999)).toBe(0);
    expect(totpCounter(30_000)).toBe(1);
  });
});

describe('totpProgress', () => {
  it('runs from 0 to just under 1 across a period', () => {
    expect(totpProgress(0)).toBe(0);
    expect(totpProgress(15_000)).toBeCloseTo(0.5);
    expect(totpProgress(29_000)).toBeCloseTo(29 / 30);
  });
});

describe('generateTotp', () => {
  // Expected values are the RFC 6238 SHA-1 vectors, truncated to six digits.
  it.each([
    [59_000, '287082'],
    [1_111_111_109_000, '081804'],
    [1_111_111_111_000, '050471'],
    [1_234_567_890_000, '005924'],
  ])('matches the RFC 6238 vector at %ims', async (timestamp, expected) => {
    await expect(generateTotp(RFC_6238_SECRET, { timestamp })).resolves.toBe(expected);
  });

  it('holds the same code for the whole period, then changes', async () => {
    const first = await generateTotp(RFC_6238_SECRET, { timestamp: 30_000 });
    const sameWindow = await generateTotp(RFC_6238_SECRET, { timestamp: 59_999 });
    const nextWindow = await generateTotp(RFC_6238_SECRET, { timestamp: 60_000 });

    expect(sameWindow).toBe(first);
    expect(nextWindow).not.toBe(first);
  });
});
