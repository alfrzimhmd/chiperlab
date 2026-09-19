import _sodium from 'libsodium-wrappers';

/**
 * Media File Encryption — byte-level encryption for arbitrary files.
 *
 * Uses only byte-level algorithms (AES-GCM, ChaCha20-Poly1305, XOR).
 * Letter-based ciphers (Caesar, Vigenère, Atbash) cannot process binary
 * files because they only transform A-Z characters.
 *
 * Output format (binary):
 *   [MAGIC 4B][VERSION 1B][ALGO 1B][NONCE_LEN 1B][NONCE 12B][CIPHERTEXT+TAG]
 *
 * The magic header helps identify `.encrypted` files and detect
 * corrupted/wrong inputs at decrypt time.
 *
 * TypeScript 5.7+ NOTES:
 * Web Crypto's `BufferSource` requires `Uint8Array<ArrayBuffer>` strictly.
 * We provide `toArrayBuffer()` and a hardened `parseHeader()` to guarantee
 * every byte array passed to Web Crypto is backed by a non-shared ArrayBuffer.
 */

const MAGIC = new Uint8Array([0x43, 0x4c, 0x45, 0x4e]); // "CLEN" (ChiperLab ENcrypted)
const VERSION = 0x01;

const ALGO_AES = 0x01;
const ALGO_CHACHA = 0x02;
const ALGO_XOR = 0x03;

export type MediaAlgorithm = 'aes-gcm' | 'chacha20' | 'xor';

export interface MediaEncryptResult {
  output: Uint8Array;
  algorithm: MediaAlgorithm;
  nonceHex: string;
  durationMs: number;
  originalSize: number;
  encryptedSize: number;
}

/* ============================================================
   UTILITY
============================================================ */

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Convert Uint8Array → ArrayBuffer (fresh, non-shared copy).
 *
 * TypeScript 5.7+ strictly types `Uint8Array.buffer` as `ArrayBufferLike`
 * (which includes `SharedArrayBuffer`), but Web Crypto APIs require
 * `ArrayBuffer` specifically. This helper guarantees a safe copy.
 */
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

/**
 * Copy a Uint8Array into a fresh `Uint8Array<ArrayBuffer>`.
 *
 * Use this when you need to pass a byte array to Web Crypto as `iv`,
 * `additionalData`, etc. — any context where the shared-buffer ambiguity
 * breaks type inference.
 */
function toFreshBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

/* ============================================================
   KEY GENERATION
============================================================ */

export async function generateMediaKey(
  algorithm: MediaAlgorithm
): Promise<{ keyHex: string; nonceHex: string }> {
  if (algorithm === 'aes-gcm') {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const exported = await crypto.subtle.exportKey('raw', key);
    const nonce = crypto.getRandomValues(new Uint8Array(12));
    return {
      keyHex: bytesToHex(new Uint8Array(exported)),
      nonceHex: bytesToHex(nonce),
    };
  }

  if (algorithm === 'chacha20') {
    await _sodium.ready;
    const sodium = _sodium;
    const key = sodium.crypto_aead_chacha20poly1305_ietf_keygen();
    const nonce = sodium.randombytes_buf(12);
    return {
      keyHex: bytesToHex(key),
      nonceHex: bytesToHex(nonce),
    };
  }

  // XOR — 32-byte key
  const key = crypto.getRandomValues(new Uint8Array(32));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  return {
    keyHex: bytesToHex(key),
    nonceHex: bytesToHex(nonce),
  };
}

/* ============================================================
   HEADER HELPERS
============================================================ */

function buildHeader(
  algorithm: MediaAlgorithm,
  nonce: Uint8Array
): Uint8Array {
  const algoByte =
    algorithm === 'aes-gcm' ? ALGO_AES : algorithm === 'chacha20' ? ALGO_CHACHA : ALGO_XOR;

  const header = new Uint8Array(7 + nonce.length);
  header.set(MAGIC, 0);        // 4 bytes
  header[4] = VERSION;         // 1 byte
  header[5] = algoByte;        // 1 byte
  header[6] = nonce.length;    // 1 byte
  header.set(nonce, 7);        // 12 bytes
  return header;
}

interface ParsedHeader {
  version: number;
  algorithm: MediaAlgorithm;
  nonce: Uint8Array<ArrayBuffer>;
  payloadOffset: number;
}

function parseHeader(data: Uint8Array): ParsedHeader {
  if (data.length < 7) {
    throw new Error('File is too short to be a valid ChiperLab encrypted file.');
  }

  for (let i = 0; i < 4; i++) {
    if (data[i] !== MAGIC[i]) {
      throw new Error(
        'Invalid file format. This is not a ChiperLab .encrypted file, or it is corrupted.'
      );
    }
  }

  const version = data[4];
  if (version !== VERSION) {
    throw new Error(
      `Unsupported file version: ${version}. This file was created with a newer ChiperLab version.`
    );
  }

  const algoByte = data[5];
  const algorithm: MediaAlgorithm =
    algoByte === ALGO_AES ? 'aes-gcm' : algoByte === ALGO_CHACHA ? 'chacha20' : 'xor';

  const nonceLen = data[6];
  if (nonceLen !== 12) {
    throw new Error('Malformed header: nonce length must be 12 bytes.');
  }

  // Fresh copy — guarantees `Uint8Array<ArrayBuffer>` for Web Crypto typing
  const nonceSlice = data.slice(7, 7 + nonceLen);
  const nonce = toFreshBytes(nonceSlice);

  return {
    version,
    algorithm,
    nonce,
    payloadOffset: 7 + nonceLen,
  };
}

/* ============================================================
   ENCRYPT
============================================================ */

export async function encryptFile(
  fileBytes: Uint8Array,
  algorithm: MediaAlgorithm,
  keyHex: string
): Promise<MediaEncryptResult> {
  const start = performance.now();
  const key = hexToBytes(keyHex);

  if (algorithm === 'aes-gcm') {
    if (key.length !== 32) {
      throw new Error('AES-256 requires a 32-byte (64 hex chars) key.');
    }
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(key),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    const nonce = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: toArrayBuffer(nonce), tagLength: 128 },
      cryptoKey,
      toArrayBuffer(fileBytes)
    );
    const cipherBytes = new Uint8Array(ciphertext);
    const header = buildHeader(algorithm, nonce);
    const output = new Uint8Array(header.length + cipherBytes.length);
    output.set(header, 0);
    output.set(cipherBytes, header.length);

    return {
      output,
      algorithm,
      nonceHex: bytesToHex(nonce),
      durationMs: Math.round((performance.now() - start) * 100) / 100,
      originalSize: fileBytes.length,
      encryptedSize: output.length,
    };
  }

  if (algorithm === 'chacha20') {
    if (key.length !== 32) {
      throw new Error('ChaCha20 requires a 32-byte (64 hex chars) key.');
    }
    await _sodium.ready;
    const sodium = _sodium;
    const nonce = sodium.randombytes_buf(12);
    const ciphertext = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
      fileBytes,
      null,
      null,
      nonce,
      key
    );
    const header = buildHeader(algorithm, nonce);
    const output = new Uint8Array(header.length + ciphertext.length);
    output.set(header, 0);
    output.set(ciphertext, header.length);

    return {
      output,
      algorithm,
      nonceHex: bytesToHex(nonce),
      durationMs: Math.round((performance.now() - start) * 100) / 100,
      originalSize: fileBytes.length,
      encryptedSize: output.length,
    };
  }

  // XOR
  if (key.length === 0) {
    throw new Error('XOR key cannot be empty.');
  }
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = new Uint8Array(key.length + nonce.length);
  keyMaterial.set(key, 0);
  keyMaterial.set(nonce, key.length);
  const derivedKeyFull = await crypto.subtle.digest(
    'SHA-256',
    toArrayBuffer(keyMaterial)
  );
  const derivedKey = new Uint8Array(derivedKeyFull);

  const cipherBytes = new Uint8Array(fileBytes.length);
  for (let i = 0; i < fileBytes.length; i++) {
    cipherBytes[i] = fileBytes[i] ^ derivedKey[i % derivedKey.length];
  }

  const header = buildHeader(algorithm, nonce);
  const output = new Uint8Array(header.length + cipherBytes.length);
  output.set(header, 0);
  output.set(cipherBytes, header.length);

  return {
    output,
    algorithm,
    nonceHex: bytesToHex(nonce),
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    originalSize: fileBytes.length,
    encryptedSize: output.length,
  };
}

/* ============================================================
   DECRYPT
============================================================ */

export interface MediaDecryptResult {
  output: Uint8Array;
  algorithm: MediaAlgorithm;
  durationMs: number;
  encryptedSize: number;
  decryptedSize: number;
}

export async function decryptFile(
  encryptedBytes: Uint8Array,
  keyHex: string
): Promise<MediaDecryptResult> {
  const start = performance.now();
  const header = parseHeader(encryptedBytes);
  const key = hexToBytes(keyHex);

  if (key.length === 0) {
    throw new Error('Decryption requires a key.');
  }

  // Fresh slice — guarantees independent ArrayBuffer for the payload
  const payload = toFreshBytes(encryptedBytes.slice(header.payloadOffset));

  if (header.algorithm === 'aes-gcm') {
    if (key.length !== 32) {
      throw new Error('AES-256 requires a 32-byte (64 hex chars) key.');
    }
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(key),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    try {
      const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: header.nonce, tagLength: 128 },
        cryptoKey,
        payload
      );
      const output = new Uint8Array(plaintext);
      return {
        output,
        algorithm: header.algorithm,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        encryptedSize: encryptedBytes.length,
        decryptedSize: output.length,
      };
    } catch {
      throw new Error(
        'Decryption failed. Wrong key, or the file was tampered with (authentication check failed).'
      );
    }
  }

  if (header.algorithm === 'chacha20') {
    if (key.length !== 32) {
      throw new Error('ChaCha20 requires a 32-byte (64 hex chars) key.');
    }
    await _sodium.ready;
    const sodium = _sodium;
    try {
      const plaintext = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
        null,
        payload,
        null,
        header.nonce,
        key
      );
      return {
        output: plaintext,
        algorithm: header.algorithm,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        encryptedSize: encryptedBytes.length,
        decryptedSize: plaintext.length,
      };
    } catch {
      throw new Error(
        'Decryption failed. Wrong key, or the file was tampered with (authentication check failed).'
      );
    }
  }

  // XOR
  const keyMaterial = new Uint8Array(key.length + header.nonce.length);
  keyMaterial.set(key, 0);
  keyMaterial.set(header.nonce, key.length);
  const derivedKeyFull = await crypto.subtle.digest(
    'SHA-256',
    toArrayBuffer(keyMaterial)
  );
  const derivedKey = new Uint8Array(derivedKeyFull);

  const output = new Uint8Array(payload.length);
  for (let i = 0; i < payload.length; i++) {
    output[i] = payload[i] ^ derivedKey[i % derivedKey.length];
  }

  return {
    output,
    algorithm: header.algorithm,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    encryptedSize: encryptedBytes.length,
    decryptedSize: output.length,
  };
}

/* ============================================================
   HELPERS
============================================================ */

export function readFileAsBytes(
  file: File,
  onProgress?: (percent: number) => void
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = e => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(buffer));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
}

export function downloadBytes(bytes: Uint8Array, filename: string): void {
  // Fresh ArrayBuffer for BlobPart typing
  const ab = toArrayBuffer(bytes);
  const blob = new Blob([ab], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function getAlgorithmLabel(algo: MediaAlgorithm): string {
  return algo === 'aes-gcm'
    ? 'AES-GCM (256-bit)'
    : algo === 'chacha20'
    ? 'ChaCha20-Poly1305'
    : 'XOR (SHA-256 derived)';
}

export function getAlgorithmAccent(algo: MediaAlgorithm): string {
  return algo === 'aes-gcm'
    ? 'text-cyan-400'
    : algo === 'chacha20'
    ? 'text-purple-400'
    : 'text-amber-400';
}