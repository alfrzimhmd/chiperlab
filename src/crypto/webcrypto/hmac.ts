import { CryptoResult } from '../../types/crypto';

/**
 * HMAC-SHA256 — Keyed Message Authentication Code.
 *
 * Combines a secret key with SHA-256 using nested hashing.
 * Provides both integrity (data unchanged) and authenticity
 * (sender holds the key). Immune to length-extension attacks.
 *
 * Web Crypto API supports HMAC natively.
 */

const encoder = new TextEncoder();

/**
 * Convert Uint8Array to hex string.
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Import a raw key for HMAC-SHA256.
 */
async function importHmacKey(keyString: string): Promise<CryptoKey> {
  if (!keyString) {
    throw new Error('HMAC requires a secret key (at least 1 character).');
  }

  return crypto.subtle.importKey(
    'raw',
    encoder.encode(keyString),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Compute HMAC-SHA256 tag for a message.
 * Output is a 64-character hex string (32 bytes).
 */
export async function hmacSign(
  message: string,
  keyString: string
): Promise<CryptoResult> {
  const startTime = performance.now();

  if (!message) {
    return {
      output: '',
      meta: {
        algorithm: 'HMAC-SHA256',
        mode: 'encrypt',
        inputLength: 0,
        outputLength: 0,
        durationMs: 0,
        keyInfo: 'Enter a message to authenticate.',
      },
    };
  }

  const key = await importHmacKey(keyString);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const hex = bytesToHex(new Uint8Array(signature));

  const durationMs = performance.now() - startTime;

  return {
    output: hex,
    meta: {
      algorithm: 'HMAC-SHA256',
      mode: 'encrypt',
      inputLength: message.length,
      outputLength: hex.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: `Signed with key "${keyString.slice(0, 3)}${'*'.repeat(
        Math.max(0, keyString.length - 3)
      )}". Output: 32-byte tag (64 hex chars).`,
    },
  };
}

/**
 * Verify an HMAC-SHA256 tag against a message + key.
 * Returns true if the tag is valid, false otherwise.
 */
export async function hmacVerify(
  message: string,
  keyString: string,
  tagHex: string
): Promise<CryptoResult> {
  const startTime = performance.now();

  if (!message || !tagHex) {
    throw new Error('Verification requires both a message and a tag.');
  }

  const cleanHex = tagHex.replace(/\s+/g, '');
  if (cleanHex.length !== 64 || !/^[0-9a-fA-F]+$/.test(cleanHex)) {
    throw new Error(
      'Invalid HMAC tag. Expected 64 hexadecimal characters (256-bit tag).'
    );
  }

  const tagBytes = new Uint8Array(32);
  for (let i = 0; i < 64; i += 2) {
    tagBytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }

  const key = await importHmacKey(keyString);
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    tagBytes,
    encoder.encode(message)
  );

  const durationMs = performance.now() - startTime;

  return {
    output: isValid ? '✓ VALID — Tag matches message + key' : '✗ INVALID — Tag does not match',
    meta: {
      algorithm: 'HMAC-SHA256 Verification',
      mode: 'decrypt',
      inputLength: message.length,
      outputLength: isValid ? 31 : 35,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: isValid
        ? 'Authentication tag verified successfully. Message is intact and authentic.'
        : 'Authentication failed. Message may have been tampered with, or the key is wrong.',
    },
  };
}

// Aliases
export const hmacEncrypt = hmacSign;
export const hmacDecrypt = hmacVerify;