import _sodium from 'libsodium-wrappers';
import { CryptoResult } from '../../types/crypto';

/**
 * ChaCha20-Poly1305 — Modern AEAD cipher.
 *
 * Combines the ChaCha20 stream cipher with the Poly1305 MAC.
 * Uses only ARX operations (Add-Rotate-XOR) — immune to
 * cache-timing attacks. Mandatory in TLS 1.3 alongside AES-GCM.
 *
 * Uses `libsodium-wrappers` (Web Crypto does NOT support ChaCha20-Poly1305).
 * The library requires initialization via `await sodium.ready`.
 */

let sodiumInitialized = false;

async function ensureSodium() {
  if (!sodiumInitialized) {
    await _sodium.ready;
    sodiumInitialized = true;
  }
  return _sodium;
}

/**
 * Convert Uint8Array to hex string.
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array.
 */
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Generate a fresh 32-byte ChaCha20 key (256 bits).
 */
export async function generateChaCha20Key(): Promise<string> {
  const sodium = await ensureSodium();
  const key = sodium.crypto_aead_chacha20poly1305_ietf_keygen();
  return bytesToHex(key);
}

/**
 * Generate a fresh 12-byte nonce (96 bits).
 */
export async function generateChaCha20Nonce(): Promise<string> {
  const sodium = await ensureSodium();
  const nonce = sodium.randombytes_buf(12);
  return bytesToHex(nonce);
}

/**
 * Import a key from hex string. If invalid, derive from passphrase.
 */
async function resolveKey(keyInput: string): Promise<Uint8Array> {
  const sodium = await ensureSodium();
  const clean = keyInput.trim();

  // Valid 64-char hex → 32 bytes
  if (/^[0-9a-fA-F]{64}$/.test(clean)) {
    return hexToBytes(clean);
  }

  // Otherwise: hash passphrase with SHA-256 to get 32 bytes
  const hash = sodium.crypto_hash_sha256(
    new TextEncoder().encode(clean)
  );
  return hash;
}

/**
 * Encrypt plaintext with ChaCha20-Poly1305 (IETF variant).
 * Output format: "NONCE_HEX:CIPHERTEXT_HEX" (ciphertext includes 16-byte Poly1305 tag).
 */
export async function chacha20Encrypt(
  plaintext: string,
  keyInput: string,
  customNonceHex?: string
): Promise<CryptoResult> {
  const startTime = performance.now();
  const sodium = await ensureSodium();

  if (!keyInput) {
    throw new Error('ChaCha20 requires a secret key.');
  }

  const key = await resolveKey(keyInput);
  const nonce =
    customNonceHex && customNonceHex.length === 24
      ? hexToBytes(customNonceHex)
      : sodium.randombytes_buf(12);

  const plaintextBytes = new TextEncoder().encode(plaintext);
  const ciphertext = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
    plaintextBytes,
    null, // additional data
    null, // secret nonce (not used in IETF variant)
    nonce,
    key
  );

  const nonceHex = bytesToHex(nonce);
  const cipherHex = bytesToHex(ciphertext);
  const output = `${nonceHex}:${cipherHex}`;

  const durationMs = performance.now() - startTime;

  return {
    output,
    meta: {
      algorithm: 'ChaCha20-Poly1305 (IETF)',
      mode: 'encrypt',
      inputLength: plaintext.length,
      outputLength: output.length,
      durationMs: Math.round(durationMs * 100) / 100,
      ivHex: nonceHex,
      keyInfo: `256-bit key + 96-bit nonce. Output includes 16-byte Poly1305 tag. Constant-time, cache-timing immune.`,
    },
  };
}

/**
 * Decrypt ciphertext with ChaCha20-Poly1305.
 * Input format: "NONCE_HEX:CIPHERTEXT_HEX"
 */
export async function chacha20Decrypt(
  ciphertextWithNonce: string,
  keyInput: string
): Promise<CryptoResult> {
  const startTime = performance.now();
  const sodium = await ensureSodium();

  if (!keyInput) {
    throw new Error('ChaCha20 requires a secret key.');
  }

  const trimmed = ciphertextWithNonce.trim();
  if (!trimmed.includes(':')) {
    throw new Error(
      'Invalid ciphertext format. Expected "NONCE_HEX:CIPHERTEXT_HEX".'
    );
  }

  const [nonceHex, cipherHex] = trimmed.split(':');
  const nonce = hexToBytes(nonceHex);
  const ciphertext = hexToBytes(cipherHex);
  const key = await resolveKey(keyInput);

  let plaintextBytes: Uint8Array;
  try {
    plaintextBytes = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
      null, // secret nonce (not used)
      ciphertext,
      null, // additional data
      nonce,
      key
    );
  } catch {
    throw new Error(
      'Authentication failed. The ciphertext or key is wrong, or the message was tampered with.'
    );
  }

  const plaintext = new TextDecoder().decode(plaintextBytes);
  const durationMs = performance.now() - startTime;

  return {
    output: plaintext,
    meta: {
      algorithm: 'ChaCha20-Poly1305 (IETF)',
      mode: 'decrypt',
      inputLength: ciphertextWithNonce.length,
      outputLength: plaintext.length,
      durationMs: Math.round(durationMs * 100) / 100,
      ivHex: nonceHex,
      keyInfo: 'Poly1305 authentication tag verified successfully.',
    },
  };
}

// Aliases
export const chacha20EncryptAlias = chacha20Encrypt;
export const chacha20DecryptAlias = chacha20Decrypt;