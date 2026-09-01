import { decryptVault, encryptVault } from './vault-crypto';

describe('vault-crypto', () => {
  it('round-trips arbitrary data through the correct secret', async () => {
    const data = { items: [{ id: 'a', name: 'GitHub' }], vaults: [{ id: 'v', name: 'My Vault' }] };

    const encrypted = await encryptVault('correct-secret', data);
    const decrypted = await decryptVault('correct-secret', encrypted);

    expect(decrypted).toEqual(data);
  });

  it('never reuses a salt or IV across two encryptions of the same data', async () => {
    const first = await encryptVault('same-secret', { a: 1 });
    const second = await encryptVault('same-secret', { a: 1 });

    expect(first.salt).not.toBe(second.salt);
    expect(first.iv).not.toBe(second.iv);
    expect(first.ciphertext).not.toBe(second.ciphertext);
  });

  it('rejects decryption with the wrong secret', async () => {
    const encrypted = await encryptVault('correct-secret', { a: 1 });

    await expect(decryptVault('wrong-secret', encrypted)).rejects.toThrow();
  });

  it('round-trips a large vault without blowing the call stack', async () => {
    // Regression test: `String.fromCharCode(...bytes)` throws "Maximum call
    // stack size exceeded" once the byte array gets into the tens of
    // thousands — a real vault with enough items reaches that easily.
    const items = Array.from({ length: 200 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i}`,
      fields: Array.from({ length: 10 }, (_, j) => ({
        name: `Field ${j}`,
        value: `some reasonably long field value for padding purposes #${i}-${j}`,
      })),
    }));

    const encrypted = await encryptVault('correct-secret', { items });
    const decrypted = await decryptVault('correct-secret', encrypted);

    expect(decrypted).toEqual({ items });
  });
});

describe('vault-crypto — compression', () => {
  it('marks what it wrote as gzip', async () => {
    const encrypted = await encryptVault('secret', { items: [] });

    expect(encrypted.encoding).toBe('gzip');
  });

  // A vault last saved by a client from before compression shipped has no
  // `encoding` field and holds bare JSON. If this ever stops working, those
  // users cannot open their vaults at all.
  it('still opens a vault written before compression existed', async () => {
    const data = { items: [{ id: 'a', name: 'Bank' }] };
    const encrypted = await encryptVault('secret', data);

    // Rebuild the pre-compression shape: same key, same IV, plain UTF-8 JSON
    // ciphertext, and no `encoding` marker.
    const salt = Uint8Array.from(atob(encrypted.salt), (c) => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(encrypted.iv), (c) => c.charCodeAt(0));
    const { argon2id } = await import('hash-wasm');
    const raw = await argon2id({
      password: 'secret',
      salt,
      memorySize: encrypted.kdf.memorySize,
      iterations: encrypted.kdf.iterations,
      parallelism: encrypted.kdf.parallelism,
      hashLength: 32,
      outputType: 'binary',
    });
    const keyBytes = new Uint8Array(new ArrayBuffer(raw.length));
    keyBytes.set(raw);
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, [
      'encrypt',
      'decrypt',
    ]);
    const legacyCiphertext = new Uint8Array(
      await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(JSON.stringify(data)),
      ),
    );

    const legacy = {
      ...encrypted,
      ciphertext: btoa(String.fromCharCode(...legacyCiphertext)),
      encoding: undefined,
    };
    delete (legacy as { encoding?: string }).encoding;

    await expect(decryptVault('secret', legacy)).resolves.toEqual(data);
  });

  it('shrinks a repetitive vault well below its JSON size', async () => {
    const items = Array.from({ length: 300 }, (_, i) => ({
      id: `id-${i}`,
      name: `Service ${i}`,
      fields: [
        { name: 'Username', type: 'username', value: `user${i}@company.example.com` },
        { name: 'URL', type: 'url', value: `https://service${i}.example.com/login` },
      ],
      tags: ['work', 'production'],
    }));
    const jsonBytes = new TextEncoder().encode(JSON.stringify({ items })).length;

    const encrypted = await encryptVault('secret', { items });
    const ciphertextBytes = atob(encrypted.ciphertext).length;

    expect(ciphertextBytes).toBeLessThan(jsonBytes / 2);
    await expect(decryptVault('secret', encrypted)).resolves.toEqual({ items });
  });
});
