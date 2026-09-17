import { CryptoResult } from '../../types/crypto';

// Convert Uint8Array to hex string
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Convert hex string to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Generate random AES key as hex string
export async function generateAesKeyHex(length: 128 | 256 = 256): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length },
    true,
    ['encrypt', 'decrypt']
  );
  const exported = await crypto.subtle.exportKey('raw', key);
  return bytesToHex(new Uint8Array(exported));
}

export async function generateAesKey(bitLength: 128 | 256 = 256): Promise<{ keyHex: string }> {
  const keyHex = await generateAesKeyHex(bitLength);
  return { keyHex };
}

// Generate random 12-byte IV
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

// Import raw key from hex or derive from passphrase
async function importKeyFromHexOrPass(keyInput: string): Promise<CryptoKey> {
  const clean = keyInput.trim();
  let rawBytes: Uint8Array;

  // If 64 hex characters (32 bytes = 256 bits), use directly
  if (/^[0-9a-fA-F]{64}$/.test(clean)) {
    rawBytes = hexToBytes(clean);
  } else if (/^[0-9a-fA-F]{32}$/.test(clean)) {
    // 32 hex characters = 16 bytes = 128 bits
    rawBytes = hexToBytes(clean);
  } else {
    // Hash passphrase with SHA-256 to derive consistent 256-bit key
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(clean));
    rawBytes = new Uint8Array(hash);
  }

  const length = (rawBytes.length * 8) as 128 | 256;

  return crypto.subtle.importKey(
    'raw',
    rawBytes,
    { name: 'AES-GCM', length: length === 128 ? 128 : 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function aesGcmEncrypt(
  plaintext: string,
  keyInput: string,
  customIvHex?: string
): Promise<CryptoResult> {
  const startTime = performance.now();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const cryptoKey = await importKeyFromHexOrPass(keyInput);
  const iv = customIvHex && customIvHex.length === 24
    ? hexToBytes(customIvHex)
    : generateIV();

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    data
  );

  const cipherBytes = new Uint8Array(encryptedBuffer);
  const ivHex = bytesToHex(iv);
  const cipherHex = bytesToHex(cipherBytes);
  // Combined formatted payload: IV:Ciphertext (hex)
  const output = `${ivHex}:${cipherHex}`;

  const durationMs = performance.now() - startTime;

  return {
    output,
    meta: {
      algorithm: 'AES-GCM (256-bit)',
      mode: 'encrypt',
      inputLength: plaintext.length,
      outputLength: output.length,
      durationMs: Math.round(durationMs * 100) / 100,
      ivHex,
      keyInfo: '256-bit Galois/Counter Mode with 96-bit random IV and built-in 128-bit authentication tag',
    },
  };
}

export async function aesGcmDecrypt(
  ciphertextWithIv: string,
  keyInput: string,
  customIvHex?: string
): Promise<CryptoResult> {
  const startTime = performance.now();
  const trimmed = ciphertextWithIv.trim();

  let ivBytes: Uint8Array;
  let cipherBytes: Uint8Array;

  if (trimmed.includes(':')) {
    const [ivPart, cipherPart] = trimmed.split(':');
    ivBytes = hexToBytes(ivPart);
    cipherBytes = hexToBytes(cipherPart);
  } else if (customIvHex && customIvHex.length >= 24) {
    ivBytes = hexToBytes(customIvHex.substring(0, 24));
    cipherBytes = hexToBytes(trimmed);
  } else if (trimmed.length >= 24) {
    // Assume first 24 chars (12 bytes) are IV
    ivBytes = hexToBytes(trimmed.substring(0, 24));
    cipherBytes = hexToBytes(trimmed.substring(24));
  } else {
    throw new Error('Invalid AES ciphertext format. Expected "IV_HEX:CIPHERTEXT_HEX".');
  }

  const cryptoKey = await importKeyFromHexOrPass(keyInput);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    cryptoKey,
    cipherBytes
  );

  const decoder = new TextDecoder();
  const plaintext = decoder.decode(decryptedBuffer);

  const durationMs = performance.now() - startTime;

  return {
    output: plaintext,
    meta: {
      algorithm: 'AES-GCM (256-bit)',
      mode: 'decrypt',
      inputLength: ciphertextWithIv.length,
      outputLength: plaintext.length,
      durationMs: Math.round(durationMs * 100) / 100,
      ivHex: bytesToHex(ivBytes),
      keyInfo: 'Authentication tag successfully verified! Decryption and integrity confirmed.',
    },
  };
}

// Aliases for compatibility
export const aesEncrypt = aesGcmEncrypt;
export const aesDecrypt = aesGcmDecrypt;
