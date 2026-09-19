import { md5 } from 'js-md5';
import { CryptoResult } from '../../types/crypto';

/**
 * MD5 — Broken hash function (educational demo).
 *
 * A 128-bit cryptographic hash designed by Ron Rivest in 1991.
 * Cryptographically BROKEN since 2004 due to practical collision
 * attacks. Included in ChiperLab as a cautionary tale.
 *
 * Uses the `js-md5` library. Web Crypto does NOT support MD5.
 *
 * ⚠️ NEVER use MD5 for any security purpose.
 */

/**
 * Compute the MD5 hash of a text.
 * Output is a 32-character lowercase hex string.
 */
export function md5Hash(text: string): CryptoResult {
  const startTime = performance.now();

  if (!text) {
    return {
      output: '',
      meta: {
        algorithm: 'MD5',
        mode: 'encrypt',
        inputLength: 0,
        outputLength: 0,
        durationMs: 0,
        keyInfo: 'Enter text to compute MD5 hash.',
      },
    };
  }

  const hash = md5(text);
  const durationMs = performance.now() - startTime;

  return {
    output: hash,
    meta: {
      algorithm: 'MD5 (BROKEN — educational only)',
      mode: 'encrypt',
      inputLength: text.length,
      outputLength: hash.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: `MD5 produces a 128-bit digest (32 hex chars). BROKEN since 2004 — never use for security.`,
    },
  };
}

/**
 * Compute MD5 of a hex string (returns binary hash as hex).
 * Used for comparing hash outputs.
 */
export function md5Hex(text: string): string {
  return md5(text);
}

// Alias for playground compatibility
export const md5Encrypt = md5Hash;