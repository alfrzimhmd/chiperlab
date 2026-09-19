import { CryptoResult } from '../../types/crypto';

/**
 * Base64 Encoding — NOT encryption.
 *
 * Converts binary data to ASCII-safe text using 64 printable
 * characters (A-Z, a-z, 0-9, +, /). Output is 33% larger.
 *
 * Uses the browser-native `btoa` and `atob` functions, with
 * UTF-8 handling via TextEncoder/TextDecoder.
 */

/**
 * Encode a UTF-8 string to Base64.
 * Handles Unicode correctly by encoding to UTF-8 bytes first.
 */
export function base64Encode(text: string): CryptoResult {
  const startTime = performance.now();

  if (!text) {
    return {
      output: '',
      meta: {
        algorithm: 'Base64 Encoding',
        mode: 'encrypt',
        inputLength: 0,
        outputLength: 0,
        durationMs: 0,
        keyInfo: 'Base64 is NOT encryption — it provides zero confidentiality.',
      },
    };
  }

  try {
    // Convert UTF-8 string to bytes, then to binary string for btoa
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const output = btoa(binary);

    const durationMs = performance.now() - startTime;

    return {
      output,
      meta: {
        algorithm: 'Base64 Encoding',
        mode: 'encrypt',
        inputLength: text.length,
        outputLength: output.length,
        durationMs: Math.round(durationMs * 100) / 100,
        keyInfo: `Encoded ${text.length} chars → ${output.length} chars (${(
          (output.length / text.length) *
          100
        ).toFixed(1)}% overhead). No key. No security.`,
      },
    };
  } catch (err) {
    throw new Error('Base64 encoding failed: ' + (err as Error).message);
  }
}

/**
 * Decode a Base64 string back to UTF-8 text.
 */
export function base64Decode(text: string): CryptoResult {
  const startTime = performance.now();

  if (!text) {
    return {
      output: '',
      meta: {
        algorithm: 'Base64 Decoding',
        mode: 'decrypt',
        inputLength: 0,
        outputLength: 0,
        durationMs: 0,
        keyInfo: 'Base64 decoding requires no key.',
      },
    };
  }

  try {
    // Clean whitespace and pad if necessary
    const cleaned = text.replace(/\s+/g, '');
    const padded = cleaned.padEnd(Math.ceil(cleaned.length / 4) * 4, '=');

    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const output = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

    const durationMs = performance.now() - startTime;

    return {
      output,
      meta: {
        algorithm: 'Base64 Decoding',
        mode: 'decrypt',
        inputLength: text.length,
        outputLength: output.length,
        durationMs: Math.round(durationMs * 100) / 100,
        keyInfo: 'Decoded successfully. Remember: Base64 is NOT encryption.',
      },
    };
  } catch (err) {
    throw new Error(
      'Invalid Base64 input. Make sure the string contains only A-Z, a-z, 0-9, +, /, and =.'
    );
  }
}

// Aliases for compatibility with EncryptPlayground
export const base64Encrypt = base64Encode;
export const base64Decrypt = base64Decode;