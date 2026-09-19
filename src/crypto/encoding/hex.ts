import { CryptoResult } from '../../types/crypto';

/**
 * Hexadecimal Encoding (Base16) — NOT encryption.
 *
 * Represents each byte as two hex characters (0-9, A-F).
 * Output is 2× the input size. Used universally to display
 * cryptographic outputs (hashes, keys, MAC addresses).
 */

/**
 * Encode a UTF-8 string to hex.
 * @param uppercase If true, use A-F; else a-f. Default: uppercase.
 */
export function hexEncode(text: string, uppercase: boolean = true): CryptoResult {
  const startTime = performance.now();

  if (!text) {
    return {
      output: '',
      meta: {
        algorithm: 'Hex Encoding',
        mode: 'encrypt',
        inputLength: 0,
        outputLength: 0,
        durationMs: 0,
        keyInfo: 'Hex is NOT encryption — it provides zero confidentiality.',
      },
    };
  }

  const bytes = new TextEncoder().encode(text);
  const parts: string[] = [];
  for (let i = 0; i < bytes.byteLength; i++) {
    const hex = bytes[i].toString(16).padStart(2, '0');
    parts.push(uppercase ? hex.toUpperCase() : hex);
  }
  const output = parts.join(' ');

  const durationMs = performance.now() - startTime;

  return {
    output,
    meta: {
      algorithm: 'Hex Encoding (Base16)',
      mode: 'encrypt',
      inputLength: text.length,
      outputLength: output.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: `${bytes.byteLength} bytes → ${bytes.byteLength * 2} hex chars. Case: ${
        uppercase ? 'UPPERCASE' : 'lowercase'
      }.`,
    },
  };
}

/**
 * Decode a hex string back to UTF-8 text.
 * Accepts both uppercase and lowercase, with or without spaces.
 */
export function hexDecode(text: string): CryptoResult {
  const startTime = performance.now();

  if (!text) {
    return {
      output: '',
      meta: {
        algorithm: 'Hex Decoding',
        mode: 'decrypt',
        inputLength: 0,
        outputLength: 0,
        durationMs: 0,
        keyInfo: 'Hex decoding requires no key.',
      },
    };
  }

  // Remove all whitespace and optional 0x prefix
  const cleaned = text.replace(/\s+/g, '').replace(/^0x/i, '');

  if (cleaned.length % 2 !== 0) {
    throw new Error(
      'Invalid hex input: odd number of hex characters. Each byte requires exactly 2 hex chars.'
    );
  }

  if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
    throw new Error(
      'Invalid hex input: only characters 0-9 and A-F (or a-f) are allowed.'
    );
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }
  const output = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

  const durationMs = performance.now() - startTime;

  return {
    output,
    meta: {
      algorithm: 'Hex Decoding',
      mode: 'decrypt',
      inputLength: text.length,
      outputLength: output.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: `Decoded ${bytes.byteLength} bytes successfully.`,
    },
  };
}

// Aliases
export const hexEncrypt = hexEncode;
export const hexDecrypt = hexDecode;