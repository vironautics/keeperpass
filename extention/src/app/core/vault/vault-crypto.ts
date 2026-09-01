import { argon2id } from 'hash-wasm';

/**
 * Encrypts vault export payloads with a secret, over real Web Crypto (plus
 * `hash-wasm` for Argon2id, which browsers don't implement natively) — the
 * same style as `core/otp/totp.ts` and `core/generator/generator.ts`: pure
 * functions, no faking.
 *
 * Argon2id derives an AES-256-GCM key from the secret; a fresh salt and IV
 * are generated per encryption, so encrypting the same data twice with the
 * same secret never produces the same ciphertext. Argon2id is memory-hard —
 * unlike PBKDF2, brute-forcing it can't be sped up by throwing more compute
 * at it (GPUs/ASICs) without also paying for the memory each guess needs.
 *
 * The KDF parameters travel with the ciphertext rather than living as fixed
 * constants read back out of thin air: that's what lets a future tuning of
 * `ARGON2_PARAMS` (a stronger machine, an updated OWASP recommendation)
 * apply to new vaults without breaking anyone still on the old parameters.
 *
 * Requires a secure context for `crypto.subtle` — https, or localhost in
 * development.
 */

/**
 * Matches Bitwarden's production default: strong enough to be a serious
 * obstacle to offline brute force, cheap enough to run once per unlock in a
 * browser tab.
 */
const ARGON2_PARAMS = {
  memorySize: 65_536, // KiB (64 MiB).
  iterations: 3,
  parallelism: 4,
};

const AES_KEY_BYTES = 32; // 256 bits.
const SALT_BYTES = 16;
/** Recommended nonce length for AES-GCM. */
const IV_BYTES = 12;

interface KdfParams {
  algorithm: 'argon2id';
  memorySize: number;
  iterations: number;
  parallelism: number;
}

export interface EncryptedVault {
  /** Base64. Argon2id salt. */
  salt: string;
  /** Base64. AES-GCM nonce. */
  iv: string;
  /** Base64. Ciphertext, with the GCM authentication tag appended. */
  ciphertext: string;
  /** Parameters `encryptVault` used, so `decryptVault` never has to guess them. */
  kdf: KdfParams;
  /**
   * How the plaintext was encoded before encryption. Absent means the vault
   * predates compression and holds bare UTF-8 JSON — every vault written by
   * an older client looks like that, so this must stay optional forever, or
   * those vaults become unreadable.
   */
  encoding?: 'gzip';
}

/**
 * `String.fromCharCode(...bytes)` blows the call stack once `bytes` gets
 * into the tens of thousands (a real vault with enough items gets there
 * easily) — spreading an array into call arguments is bounded by the
 * engine's argument-count limit, not available memory. Chunking keeps every
 * individual call well under that limit regardless of vault size.
 */
const BASE64_CHUNK_SIZE = 0x8000; // 32,768 bytes.

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + BASE64_CHUNK_SIZE));
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const decoded = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(decoded.length));
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

/**
 * Vault JSON compresses roughly 9x — the field names, tags and URLs repeat
 * heavily across items, and history entries duplicate whole items. Doing it
 * before encryption is the only order that works: ciphertext is
 * indistinguishable from random and does not compress at all.
 *
 * Costs ~30ms on a large vault, against an Argon2id derivation measured in
 * hundreds of ms and an upload measured in seconds — so this makes saving
 * faster overall, by shrinking what actually goes over the wire.
 */
async function through(
  bytes: Uint8Array<ArrayBuffer>,
  transform: CompressionStream | DecompressionStream,
): Promise<Uint8Array<ArrayBuffer>> {
  // Fed from a ReadableStream rather than `new Blob([...]).stream()`: Blob
  // in jsdom has no `.stream()`, and this needs no Blob anyway.
  const source = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });

  const output = await new Response(source.pipeThrough(transform as TransformStream)).arrayBuffer();
  return new Uint8Array(output);
}

function gzip(bytes: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  return through(bytes, new CompressionStream('gzip'));
}

function gunzip(bytes: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  return through(bytes, new DecompressionStream('gzip'));
}

async function deriveKey(
  secret: string,
  salt: Uint8Array<ArrayBuffer>,
  kdf: KdfParams,
): Promise<CryptoKey> {
  const rawKeyBytes = await argon2id({
    password: secret,
    salt,
    memorySize: kdf.memorySize,
    iterations: kdf.iterations,
    parallelism: kdf.parallelism,
    hashLength: AES_KEY_BYTES,
    outputType: 'binary',
  });

  // `argon2id`'s return type doesn't pin its buffer to `ArrayBuffer` (as
  // opposed to the wider `ArrayBufferLike`), which is all `importKey` accepts.
  const keyBytes = new Uint8Array(new ArrayBuffer(rawKeyBytes.length));
  keyBytes.set(rawKeyBytes);

  return crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptVault(secret: string, data: unknown): Promise<EncryptedVault> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const kdf: KdfParams = { algorithm: 'argon2id', ...ARGON2_PARAMS };
  const key = await deriveKey(secret, salt, kdf);

  const json = new TextEncoder().encode(JSON.stringify(data));
  const plaintext = await gzip(json);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));

  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
    kdf,
    encoding: 'gzip',
  };
}

/** Rejects (GCM authentication failure) if `secret` doesn't match the one `encryptVault` used. */
export async function decryptVault(secret: string, encrypted: EncryptedVault): Promise<unknown> {
  const key = await deriveKey(secret, fromBase64(encrypted.salt), encrypted.kdf);
  const decrypted = new Uint8Array(
    await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(encrypted.iv) },
      key,
      fromBase64(encrypted.ciphertext),
    ),
  );

  // No `encoding` means a vault written before compression existed: plain
  // UTF-8 JSON. Both shapes have to keep opening, indefinitely — a user may
  // not have unlocked (and so re-saved) since before this shipped.
  const plaintext = encrypted.encoding === 'gzip' ? await gunzip(decrypted) : decrypted;

  return JSON.parse(new TextDecoder().decode(plaintext));
}
