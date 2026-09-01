import { fromBase64, toBase64 } from '@/lib/crypto/base64';
import { gunzip, gzip } from '@/lib/crypto/gzip';
import { deriveKey, type Argon2Params } from '@/lib/crypto/kdf';
import { randomBytes } from '@/lib/crypto/random';
import { gcm } from '@noble/ciphers/aes.js';

const ARGON2_PARAMS: Argon2Params = { memorySize: 65_536, iterations: 3, parallelism: 4 };
const AES_KEY_BYTES = 32;
const SALT_BYTES = 16;
const IV_BYTES = 12;

type EncryptedVault = {
  salt: string;
  iv: string;
  ciphertext: string;
  kdf: { algorithm: 'argon2id' } & Argon2Params;
  encoding?: 'gzip';
};

/** Thrown when a vault fails to decrypt — almost always a wrong secret, since nothing else in that call path can fail once the file was fetched and parsed. */
class VaultDecryptionError extends Error {
  constructor() {
    super('Failed to decrypt vault — the secret is likely incorrect.');
    this.name = 'VaultDecryptionError';
  }
}

async function encryptVault<T>(secret: string, data: T): Promise<EncryptedVault> {
  const salt = await randomBytes(SALT_BYTES);
  const iv = await randomBytes(IV_BYTES);
  const key = await deriveKey(secret, salt, ARGON2_PARAMS, AES_KEY_BYTES);

  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const compressed = gzip(plaintext);
  const ciphertext = gcm(key, iv).encrypt(compressed);

  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
    kdf: { algorithm: 'argon2id', ...ARGON2_PARAMS },
    encoding: 'gzip',
  };
}

async function decryptVault<T>(secret: string, encrypted: EncryptedVault): Promise<T> {
  const salt = fromBase64(encrypted.salt);
  const iv = fromBase64(encrypted.iv);
  const key = await deriveKey(secret, salt, encrypted.kdf, AES_KEY_BYTES);
  const ciphertext = fromBase64(encrypted.ciphertext);

  let compressed: Uint8Array;
  try {
    compressed = gcm(key, iv).decrypt(ciphertext);
  } catch {
    throw new VaultDecryptionError();
  }

  const plaintext = encrypted.encoding === 'gzip' ? gunzip(compressed) : compressed;
  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}

export {
  AES_KEY_BYTES,
  ARGON2_PARAMS,
  decryptVault,
  encryptVault,
  IV_BYTES,
  SALT_BYTES,
  VaultDecryptionError,
};
export type { EncryptedVault };
