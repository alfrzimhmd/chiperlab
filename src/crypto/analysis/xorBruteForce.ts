import { ENGLISH_FREQUENCIES } from './frequency';

// ============================================================
// Single-byte XOR Brute-Force
// Mencoba semua 256 kemungkinan byte key (0x00–0xFF).
// ============================================================

export interface XorCandidate {
  key: number;         // 0x00–0xFF
  keyHex: string;      // "0x2a"
  keyChar: string;     // printable char kalau ada, else "."
  result: string;      // hasil dekripsi (printable)
  resultBytes: Uint8Array;
  score: number;       // 0–100
  isLikelyMatch: boolean;
}

// Frekuensi huruf English sebagai lookup map (0–1, bukan persen)
const ENGLISH_MAP: Record<string, number> = Object.fromEntries(
  ENGLISH_FREQUENCIES.map(({ letter, pct }) => [letter, pct / 100])
);

/**
 * Score sebuah byte string dengan chi-squared terhadap English frequencies.
 * Score rendah = lebih mirip English. Kita invert supaya score tinggi = bagus.
 */
function scoreEnglish(bytes: Uint8Array): number {
  // Hitung frekuensi huruf A-Z saja
  const counts: Record<string, number> = {};
  let totalLetters = 0;

  for (const b of bytes) {
    // 65–90 = A–Z, 97–122 = a–z
    let upper = -1;
    if (b >= 65 && b <= 90) upper = b;
    else if (b >= 97 && b <= 122) upper = b - 32;

    if (upper >= 65) {
      const ch = String.fromCharCode(upper);
      counts[ch] = (counts[ch] || 0) + 1;
      totalLetters++;
    }
  }

  if (totalLetters === 0) return 0;

  // Chi-squared: sum((observed - expected)^2 / expected)
  let chiSq = 0;
  for (const { letter, pct } of ENGLISH_FREQUENCIES) {
    const observed = counts[letter] || 0;
    const expected = (pct / 100) * totalLetters;
    if (expected > 0) {
      chiSq += Math.pow(observed - expected, 2) / expected;
    }
  }

  // Bonus: proporsi karakter printable
  let printable = 0;
  for (const b of bytes) {
    if ((b >= 32 && b <= 126) || b === 9 || b === 10 || b === 13) printable++;
  }
  const printableRatio = printable / bytes.length;

  // Konversi chi-squared ke score 0–100
  // chiSq kecil → score tinggi
  const chiScore = Math.max(0, 100 - chiSq);
  return chiScore * printableRatio;
}

/**
 * Coba semua 256 byte key untuk single-byte XOR.
 */
export function bruteForceSingleByteXor(bytes: Uint8Array): XorCandidate[] {
  if (bytes.length === 0) return [];

  const candidates: XorCandidate[] = [];

  for (let key = 0; key < 256; key++) {
    const result = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      result[i] = bytes[i] ^ key;
    }

    const score = scoreEnglish(result);

    // Konversi byte hasil ke string printable
    const resultStr = Array.from(result)
      .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
      .join('');

    candidates.push({
      key,
      keyHex: `0x${key.toString(16).padStart(2, '0')}`,
      keyChar:
        key >= 32 && key <= 126 ? String.fromCharCode(key) : '.',
      result: resultStr,
      resultBytes: result,
      score,
      isLikelyMatch: false,
    });
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Tandai top 3 yang score-nya ≥ 60 sebagai likely match
  let marked = 0;
  for (const c of candidates) {
    if (c.score >= 60 && marked < 3) {
      c.isLikelyMatch = true;
      marked++;
    }
  }

  // Kembalikan diurutkan berdasarkan key (0x00–0xFF) untuk display default
  return [...candidates].sort((a, b) => a.key - b.key);
}

/**
 * Parse input hex (dengan spasi/0x optional) menjadi Uint8Array.
 * Juga support input sebagai raw text (fallback).
 */
export function parseXorInput(input: string): Uint8Array {
  const trimmed = input.trim();

  // Deteksi apakah hex: hanya 0-9, a-f, A-F, spasi, dan opsional "0x"
  const hexOnly = trimmed.replace(/0x/gi, '').replace(/\s/g, '');
  const isHex = /^[0-9a-fA-F]+$/.test(hexOnly) && hexOnly.length % 2 === 0;

  if (isHex && hexOnly.length > 0) {
    const bytes = new Uint8Array(hexOnly.length / 2);
    for (let i = 0; i < hexOnly.length; i += 2) {
      bytes[i / 2] = parseInt(hexOnly.slice(i, i + 2), 16);
    }
    return bytes;
  }

  // Fallback: treat as UTF-8 text
  return new TextEncoder().encode(trimmed);
}

/**
 * Format bytes jadi hex string untuk display.
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
}