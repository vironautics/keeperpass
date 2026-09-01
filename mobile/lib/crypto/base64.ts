const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const CHAR_INDEX: Record<string, number> = {};
for (let i = 0; i < CHARS.length; i++) {
  CHAR_INDEX[CHARS[i]] = i;
}

/**
 * Self-contained base64 codec (no `btoa`/`atob`, which Hermes doesn't
 * reliably provide) — mirrors the web app's chunk-free byte-table approach.
 */
function toBase64(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];

    result += CHARS[b0 >> 2];
    result += CHARS[((b0 & 0x03) << 4) | (b1 === undefined ? 0 : b1 >> 4)];
    result += b1 === undefined ? '=' : CHARS[((b1 & 0x0f) << 2) | (b2 === undefined ? 0 : b2 >> 6)];
    result += b2 === undefined ? '=' : CHARS[b2 & 0x3f];
  }
  return result;
}

function fromBase64(base64: string): Uint8Array {
  const clean = base64.replace(/=+$/, '');
  const bytes = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let byteIndex = 0;

  for (let i = 0; i < clean.length; i += 4) {
    const c0 = CHAR_INDEX[clean[i]];
    const c1 = CHAR_INDEX[clean[i + 1]];
    const c2 = clean[i + 2] === undefined ? undefined : CHAR_INDEX[clean[i + 2]];
    const c3 = clean[i + 3] === undefined ? undefined : CHAR_INDEX[clean[i + 3]];

    bytes[byteIndex++] = (c0 << 2) | (c1 >> 4);
    if (c2 !== undefined) {
      bytes[byteIndex++] = ((c1 & 0x0f) << 4) | (c2 >> 2);
      if (c3 !== undefined) {
        bytes[byteIndex++] = ((c2 & 0x03) << 6) | c3;
      }
    }
  }
  return bytes;
}

function toHex(bytes: Uint8Array): string {
  let hex = '';
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export { fromBase64, fromHex, toBase64, toHex };
