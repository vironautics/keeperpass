import { getRandomBytesAsync } from 'expo-crypto';

function randomBytes(length: number): Promise<Uint8Array> {
  return getRandomBytesAsync(length);
}

export { randomBytes };
