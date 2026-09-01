import argon2 from 'react-native-argon2';
import { fromHex, toHex } from '@/lib/crypto/base64';

type Argon2Params = {
  memorySize: number; // KiB
  iterations: number;
  parallelism: number;
};

/**
 * Derives raw key bytes from a secret via Argon2id.
 *
 * `react-native-argon2`'s `rawHash` is hex-encoded despite the name — decode
 * it before treating it as key material, or every derived key is silently wrong.
 */
async function deriveKey(
  secret: string,
  salt: Uint8Array,
  params: Argon2Params,
  keyLength: number
): Promise<Uint8Array> {
  const { rawHash } = await argon2(secret, toHex(salt), {
    memory: params.memorySize,
    iterations: params.iterations,
    parallelism: params.parallelism,
    hashLength: keyLength,
    mode: 'argon2id',
    saltEncoding: 'hex',
  });
  return fromHex(rawHash);
}

export { deriveKey };
export type { Argon2Params };
