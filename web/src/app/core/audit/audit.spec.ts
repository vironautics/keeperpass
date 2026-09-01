import { AuditType, FieldType, VaultItem } from '../models';
import { auditItems, sha1Hex } from './audit';

type FetchMock = ReturnType<typeof vi.fn>;

/** No unique-password test in this file, so nothing is ever "compromised" unless a test says otherwise. */
function mockNothingCompromised(): FetchMock {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    text: async () => '',
  } as Response);
}

function item(overrides: Partial<VaultItem> & Pick<VaultItem, 'id'>): VaultItem {
  return {
    vaultId: 'vault-a',
    name: overrides.id,
    fields: [],
    tags: [],
    updated: new Date('2026-08-01T12:00:00Z'),
    history: [],
    ...overrides,
  };
}

function passwordField(value: string) {
  return { name: 'Password', type: FieldType.Password, value };
}

// `vi.spyOn` on an already-spied `globalThis.fetch` returns the *same* spy
// rather than a fresh one, so call counts would otherwise accumulate across
// every test in this file — fatal for the "only once per run" assertions
// below, which need each test's spy to start at zero.
afterEach(() => {
  vi.restoreAllMocks();
});

describe('sha1Hex', () => {
  it('matches the well-known SHA-1 of "password"', async () => {
    expect(await sha1Hex('password')).toBe('5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8');
  });
});

describe('auditItems — weak passwords', () => {
  beforeEach(mockNothingCompromised);

  it('flags a short, low-variety password as weak', async () => {
    const a = item({ id: 'a', fields: [passwordField('abc')] });

    const results = await auditItems([a]);

    expect(results.get('a')!.auditResults).toContainEqual({
      type: AuditType.WeakPassword,
      fieldIndex: 0,
    });
  });

  it('does not flag a long, high-variety password as weak', async () => {
    const a = item({ id: 'a', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });

    const results = await auditItems([a]);

    expect(results.get('a')!.auditResults).not.toContainEqual(
      expect.objectContaining({ type: AuditType.WeakPassword }),
    );
  });

  it('ignores non-password fields entirely, however weak-looking', async () => {
    const a = item({
      id: 'a',
      fields: [{ name: 'Username', type: FieldType.Username, value: 'abc' }],
    });

    const results = await auditItems([a]);

    expect(results.get('a')!.auditResults).toEqual([]);
  });

  it('ignores an empty password value', async () => {
    const a = item({ id: 'a', fields: [passwordField('')] });

    const results = await auditItems([a]);

    expect(results.get('a')!.auditResults).toEqual([]);
  });
});

describe('auditItems — reused passwords', () => {
  beforeEach(mockNothingCompromised);

  it('flags the same password reused across two items, on both', async () => {
    const a = item({ id: 'a', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });
    const b = item({ id: 'b', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });

    const results = await auditItems([a, b]);

    expect(results.get('a')!.auditResults).toContainEqual({
      type: AuditType.ReusedPassword,
      fieldIndex: 0,
    });
    expect(results.get('b')!.auditResults).toContainEqual({
      type: AuditType.ReusedPassword,
      fieldIndex: 0,
    });
  });

  it('does not flag a password that is unique across the vault', async () => {
    const a = item({ id: 'a', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });
    const b = item({ id: 'b', fields: [passwordField('SomethingCompletelyDifferent42!')] });

    const results = await auditItems([a, b]);

    expect(results.get('a')!.auditResults).not.toContainEqual(
      expect.objectContaining({ type: AuditType.ReusedPassword }),
    );
    expect(results.get('b')!.auditResults).not.toContainEqual(
      expect.objectContaining({ type: AuditType.ReusedPassword }),
    );
  });
});

describe('auditItems — compromised passwords', () => {
  it('flags a password whose hash suffix appears in the HIBP range response', async () => {
    // sha1("password") = 5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8 — prefix 5baa6, suffix the rest.
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () =>
        '1E4C9B93F3F0682250B6CF8331B7EE68FD8:37\r\nFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:1',
    } as Response);
    const a = item({ id: 'a', fields: [passwordField('password')] });

    const results = await auditItems([a]);

    expect(results.get('a')!.auditResults).toContainEqual({
      type: AuditType.CompromisedPassword,
      fieldIndex: 0,
    });
  });

  it('does not flag a password whose hash suffix is absent from the response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:1',
    } as Response);
    const a = item({ id: 'a', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });

    const results = await auditItems([a]);

    expect(results.get('a')!.auditResults).not.toContainEqual(
      expect.objectContaining({ type: AuditType.CompromisedPassword }),
    );
  });

  it('only requests the 5-character hash prefix, never the password or full hash', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, text: async () => '' } as Response);
    const a = item({ id: 'a', fields: [passwordField('password')] });

    await auditItems([a]);

    expect(fetchMock).toHaveBeenCalledWith('https://api.pwnedpasswords.com/range/5baa6');
  });

  it('looks up an identical password only once per run, even reused across items', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, text: async () => '' } as Response);
    const a = item({ id: 'a', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });
    const b = item({ id: 'b', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });

    await auditItems([a, b]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('fails the run when the lookup is rejected, rather than reporting the password as clean', async () => {
    // A rate-limit body parsed as a range response finds no match, which would
    // otherwise be indistinguishable from "this password is not in any breach".
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => 'Rate limit exceeded',
    } as Response);
    const a = item({ id: 'a', fields: [passwordField('password')] });

    await expect(auditItems([a])).rejects.toThrow('429');
  });
});

describe('auditItems — onlyItemId', () => {
  beforeEach(mockNothingCompromised);

  it('scans every item for cross-referencing but only returns the targeted one', async () => {
    const a = item({ id: 'a', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });
    const b = item({ id: 'b', fields: [passwordField('Tr0ub4dor&9!Zx#Qm')] });

    const results = await auditItems([a, b], { onlyItemId: 'a' });

    expect([...results.keys()]).toEqual(['a']);
    // "a"'s reused finding still reflects "b" sharing its password, even
    // though "b" itself was never written back.
    expect(results.get('a')!.auditResults).toContainEqual({
      type: AuditType.ReusedPassword,
      fieldIndex: 0,
    });
  });
});
