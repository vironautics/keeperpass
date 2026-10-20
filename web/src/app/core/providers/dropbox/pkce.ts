/**
 * PKCE (RFC 7636) helpers. Dropbox's browser flow is Authorization Code with
 * PKCE: there is no client secret to hold, only a one-time verifier that
 * proves the app finishing the flow is the one that started it.
 */

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Cryptographically random, URL-safe. 64 bytes gives an 86-character verifier (the spec allows 43–128). */
export function randomUrlSafe(byteLength: number): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

/** `BASE64URL(SHA256(verifier))` — the `S256` challenge. */
export async function codeChallengeS256(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return toBase64Url(new Uint8Array(digest));
}
