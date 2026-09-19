/**
 * File Inspector — parse and analyze `.encrypted` files without decrypting.
 *
 * Reads the ChiperLab header, extracts metadata, and computes byte-level
 * statistics (entropy, distribution) to help users understand the structure
 * of an encrypted file.
 *
 * Read-only — never modifies the input bytes.
 */

export type MediaAlgorithm = 'aes-gcm' | 'chacha20' | 'xor';

const MAGIC = new Uint8Array([0x43, 0x4c, 0x45, 0x4e]); // "CLEN"
const VERSION = 0x01;

const ALGO_AES = 0x01;
const ALGO_CHACHA = 0x02;
const ALGO_XOR = 0x03;

const HEADER_SIZE = 19; // 4 magic + 1 version + 1 algo + 1 nonceLen + 12 nonce

/* ============================================================
   TYPES
============================================================ */

export interface HeaderInfo {
  valid: boolean;
  magicAscii: string;
  magicHex: string;
  version: number;
  algorithm: MediaAlgorithm | null;
  algorithmByte: number;
  algorithmLabel: string;
  nonceLength: number;
  nonceHex: string;
  payloadOffset: number;
  payloadSize: number;
  /** Human-readable diagnosis */
  diagnosis: string;
  /** Whether this looks like a ChiperLab file */
  isChiperLabFile: boolean;
}

export interface ByteStatistics {
  totalBytes: number;
  entropy: number;          // 0-8 bits per byte
  entropyLabel: string;     // "Near-random", "Structured", etc.
  uniqueBytes: number;      // 0-256
  mostCommonByte: number;
  mostCommonByteCount: number;
  mostCommonByteHex: string;
  zeroBytesCount: number;
  zeroBytesPercent: number;
}

export interface InspectResult {
  header: HeaderInfo;
  statistics: ByteStatistics;
  previewHex: string[];
  originalBytes: Uint8Array;  
}

/* ============================================================
   HELPERS
============================================================ */

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function algorithmFromByte(b: number): MediaAlgorithm | null {
  if (b === ALGO_AES) return 'aes-gcm';
  if (b === ALGO_CHACHA) return 'chacha20';
  if (b === ALGO_XOR) return 'xor';
  return null;
}

function algorithmLabel(algo: MediaAlgorithm | null): string {
  if (algo === 'aes-gcm') return 'AES-GCM (256-bit)';
  if (algo === 'chacha20') return 'ChaCha20-Poly1305';
  if (algo === 'xor') return 'XOR (SHA-256 derived)';
  return 'Unknown';
}

/* ============================================================
   HEADER PARSER
============================================================ */

export function parseHeader(bytes: Uint8Array): HeaderInfo {
  if (bytes.length < 7) {
    return {
      valid: false,
      magicAscii: '',
      magicHex: '',
      version: 0,
      algorithm: null,
      algorithmByte: 0,
      algorithmLabel: 'Unknown',
      nonceLength: 0,
      nonceHex: '',
      payloadOffset: 0,
      payloadSize: bytes.length,
      diagnosis: 'File is too short (< 7 bytes) to contain a valid ChiperLab header.',
      isChiperLabFile: false,
    };
  }

  const magicBytes = bytes.slice(0, 4);
  const magicAscii = Array.from(magicBytes)
    .map(b => (b >= 32 && b < 127 ? String.fromCharCode(b) : '.'))
    .join('');
  const magicHex = bytesToHex(magicBytes);

  // Verify magic
  const magicMatches =
    magicBytes[0] === MAGIC[0] &&
    magicBytes[1] === MAGIC[1] &&
    magicBytes[2] === MAGIC[2] &&
    magicBytes[3] === MAGIC[3];

  if (!magicMatches) {
    return {
      valid: false,
      magicAscii,
      magicHex,
      version: bytes[4] ?? 0,
      algorithm: null,
      algorithmByte: bytes[5] ?? 0,
      algorithmLabel: 'Unknown',
      nonceLength: bytes[6] ?? 0,
      nonceHex: '',
      payloadOffset: 0,
      payloadSize: bytes.length,
      diagnosis: `Magic bytes are "${magicAscii}" (hex: ${magicHex}), expected "CLEN". This is NOT a ChiperLab .encrypted file.`,
      isChiperLabFile: false,
    };
  }

  const version = bytes[4];
  const algorithmByte = bytes[5];
  const nonceLength = bytes[6];
  const algo = algorithmFromByte(algorithmByte);

  // Nonce
  const nonceEnd = 7 + nonceLength;
  const nonceSlice = bytes.slice(7, Math.min(nonceEnd, bytes.length));
  const nonceHex = bytesToHex(nonceSlice);

  // Header validity checks
  const versionOk = version === VERSION;
  const algoOk = algo !== null;
  const nonceOk = nonceLength === 12;
  const lengthOk = bytes.length >= HEADER_SIZE;

  const valid = versionOk && algoOk && nonceOk && lengthOk;

  let diagnosis = '';
  if (!lengthOk) {
    diagnosis = `File is ${bytes.length} bytes — too short for a complete header (needs ${HEADER_SIZE}).`;
  } else if (!versionOk) {
    diagnosis = `Unsupported version ${version}. This file was made with a newer ChiperLab version.`;
  } else if (!algoOk) {
    diagnosis = `Unknown algorithm byte 0x${algorithmByte.toString(16).padStart(2, '0')}. Expected 0x01 (AES), 0x02 (ChaCha20), or 0x03 (XOR).`;
  } else if (!nonceOk) {
    diagnosis = `Unexpected nonce length ${nonceLength} bytes. Expected 12 bytes.`;
  } else {
    diagnosis = `Valid ChiperLab .encrypted file. Uses ${algorithmLabel(algo)}. Nonce is 12 bytes. Payload is ${bytes.length - HEADER_SIZE} bytes.`;
  }

  return {
    valid,
    magicAscii,
    magicHex,
    version,
    algorithm: algo,
    algorithmByte,
    algorithmLabel: algorithmLabel(algo),
    nonceLength,
    nonceHex,
    payloadOffset: HEADER_SIZE,
    payloadSize: Math.max(0, bytes.length - HEADER_SIZE),
    diagnosis,
    isChiperLabFile: true,
  };
}

/* ============================================================
   STATISTICS
============================================================ */

function computeEntropy(bytes: Uint8Array): number {
  if (bytes.length === 0) return 0;

  // Count frequency of each byte value (0-255)
  const counts = new Uint32Array(256);
  for (let i = 0; i < bytes.length; i++) {
    counts[bytes[i]]++;
  }

  // Shannon entropy
  let entropy = 0;
  const total = bytes.length;
  for (let i = 0; i < 256; i++) {
    if (counts[i] === 0) continue;
    const p = counts[i] / total;
    entropy -= p * Math.log2(p);
  }

  return Math.round(entropy * 1000) / 1000;
}

function entropyLabel(entropy: number): string {
  if (entropy >= 7.9) return 'Near-random (typical for encrypted data)';
  if (entropy >= 7.5) return 'High entropy (likely encrypted or compressed)';
  if (entropy >= 6.0) return 'Medium entropy (mixed structure)';
  if (entropy >= 4.0) return 'Low entropy (structured data)';
  return 'Very low entropy (highly structured, likely plaintext)';
}

export function computeStatistics(bytes: Uint8Array): ByteStatistics {
  const total = bytes.length;
  const counts = new Uint32Array(256);
  let zeroBytes = 0;

  for (let i = 0; i < total; i++) {
    counts[bytes[i]]++;
    if (bytes[i] === 0) zeroBytes++;
  }

  let mostCommonByte = 0;
  let mostCommonCount = 0;
  let uniqueBytes = 0;
  for (let i = 0; i < 256; i++) {
    if (counts[i] > 0) uniqueBytes++;
    if (counts[i] > mostCommonCount) {
      mostCommonCount = counts[i];
      mostCommonByte = i;
    }
  }

  const entropy = computeEntropy(bytes);

  return {
    totalBytes: total,
    entropy,
    entropyLabel: entropyLabel(entropy),
    uniqueBytes,
    mostCommonByte,
    mostCommonByteCount: mostCommonCount,
    mostCommonByteHex: mostCommonByte.toString(16).padStart(2, '0'),
    zeroBytesCount: zeroBytes,
    zeroBytesPercent: total > 0 ? Math.round((zeroBytes / total) * 1000) / 10 : 0,
  };
}

/* ============================================================
   MAIN INSPECT
============================================================ */

export function inspectFile(bytes: Uint8Array): InspectResult {
  return {
    header: parseHeader(bytes),
    statistics: computeStatistics(bytes),
    previewHex: Array.from(bytes.slice(0, 64)).map(b =>
      b.toString(16).padStart(2, '0')
    ),
    originalBytes: bytes,
  };
}

/* ============================================================
   HEX VIEWER HELPERS
============================================================ */

export interface HexLine {
  offset: number;
  offsetHex: string;
  hexBytes: string[];
  ascii: string;
  isHeader: boolean;
}

/**
 * Build hex viewer lines from byte array.
 * @param bytes - Input bytes
 * @param bytesPerLine - How many bytes per row (default 16)
 * @param maxLines - Optional cap (for performance)
 * @param headerSize - Bytes considered "header" (highlighted)
 */
export function buildHexLines(
  bytes: Uint8Array,
  bytesPerLine: number = 16,
  maxLines?: number,
  headerSize: number = 19
): HexLine[] {
  const lines: HexLine[] = [];
  const total = bytes.length;
  const linesToShow = maxLines ? Math.min(maxLines, Math.ceil(total / bytesPerLine)) : Math.ceil(total / bytesPerLine);

  for (let lineIdx = 0; lineIdx < linesToShow; lineIdx++) {
    const start = lineIdx * bytesPerLine;
    const end = Math.min(start + bytesPerLine, total);
    const hexBytes: string[] = [];
    let ascii = '';

    for (let i = start; i < end; i++) {
      hexBytes.push(bytes[i].toString(16).padStart(2, '0'));
      const b = bytes[i];
      ascii += b >= 32 && b < 127 ? String.fromCharCode(b) : '.';
    }

    // Pad hexBytes to fixed width for alignment
    while (hexBytes.length < bytesPerLine) {
      hexBytes.push('  ');
    }

    lines.push({
      offset: start,
      offsetHex: start.toString(16).padStart(8, '0'),
      hexBytes,
      ascii,
      isHeader: start < headerSize,
    });
  }

  return lines;
}