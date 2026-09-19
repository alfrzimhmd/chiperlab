import { CharFrequency } from '../../types/crypto';

// ============================================================
// English Letter Frequency Benchmark
// Source: Cornell Math — "Letter Frequency in English"
// https://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
// ============================================================
export const ENGLISH_FREQUENCIES: { letter: string; pct: number }[] = [
  { letter: 'E', pct: 12.70 },
  { letter: 'T', pct: 9.06 },
  { letter: 'A', pct: 8.17 },
  { letter: 'O', pct: 7.51 },
  { letter: 'I', pct: 6.97 },
  { letter: 'N', pct: 6.75 },
  { letter: 'S', pct: 6.33 },
  { letter: 'H', pct: 6.09 },
  { letter: 'R', pct: 5.99 },
  { letter: 'D', pct: 4.25 },
  { letter: 'L', pct: 4.03 },
  { letter: 'C', pct: 2.78 },
  { letter: 'U', pct: 2.76 },
  { letter: 'M', pct: 2.41 },
  { letter: 'W', pct: 2.36 },
  { letter: 'F', pct: 2.23 },
  { letter: 'G', pct: 2.02 },
  { letter: 'Y', pct: 1.97 },
  { letter: 'P', pct: 1.93 },
  { letter: 'B', pct: 1.29 },
  { letter: 'V', pct: 0.98 },
  { letter: 'K', pct: 0.77 },
  { letter: 'J', pct: 0.15 },
  { letter: 'X', pct: 0.15 },
  { letter: 'Q', pct: 0.10 },
  { letter: 'Z', pct: 0.07 },
];

// ============================================================
// Lookup map untuk akses cepat: { E: 12.70, T: 9.06, ... }
// Dibuat sekali di module load, bukan setiap kali analyzeFrequency dipanggil.
// ============================================================
const ENGLISH_FREQUENCY_MAP: Record<string, number> = Object.fromEntries(
  ENGLISH_FREQUENCIES.map(({ letter, pct }) => [letter, pct])
);

// ============================================================
// Return type untuk analyzeFrequency
// ============================================================
export interface FrequencyResult {
  frequencies: CharFrequency[];
  totalLetters: number;
  uniqueLetters: number;
  topBigrams: { bigram: string; count: number }[];
}

// ============================================================
// Constants
// ============================================================
const A_CODE = 65;
const Z_CODE = 90;
const BIGRAM_LIMIT = 6; // jumlah top bigram yang dikembalikan

// ============================================================
// analyzeFrequency
// ============================================================
export function analyzeFrequency(text: string): FrequencyResult {
  // ---------- 1. Hitung frekuensi huruf ----------
  const counts: Record<string, number> = {};
  let totalLetters = 0;

  // Initialize A–Z dengan 0 supaya semua huruf selalu muncul di output
  for (let i = A_CODE; i <= Z_CODE; i++) {
    counts[String.fromCharCode(i)] = 0;
  }

  // Loop sekali untuk hitung huruf DAN bigram sekaligus (lebih efisien)
  const upperText = text.toUpperCase();
  const bigramCounts: Record<string, number> = {};
  let lastLetter = ''; // untuk bigram — hanya huruf A–Z yang dihitung

  for (let i = 0; i < upperText.length; i++) {
    const char = upperText[i];

    if (char >= 'A' && char <= 'Z') {
      // Update frekuensi huruf
      counts[char] = (counts[char] || 0) + 1;
      totalLetters++;

      // Update bigram — hanya kalau huruf sebelumnya juga A–Z
      if (lastLetter) {
        const bigram = lastLetter + char;
        bigramCounts[bigram] = (bigramCounts[bigram] || 0) + 1;
      }

      lastLetter = char;
    } else {
      // Karakter non-huruf memutus rantai bigram
      lastLetter = '';
    }
  }

  // ---------- 2. Build array frequencies ----------
  const frequencies: CharFrequency[] = Object.keys(counts).map(char => {
    const count = counts[char];
    const percentage = totalLetters > 0 ? (count / totalLetters) * 100 : 0;
    return {
      char,
      count,
      percentage: Math.round(percentage * 10) / 10,
      expectedEnglish: ENGLISH_FREQUENCY_MAP[char] ?? 0,
    };
  });

  // Sort: count descending, lalu alphabetically
  frequencies.sort(
    (a, b) => b.count - a.count || a.char.localeCompare(b.char)
  );

  // ---------- 3. Hitung unique letters ----------
  const uniqueLetters = frequencies.filter(f => f.count > 0).length;

  // ---------- 4. Build top bigrams ----------
  const topBigrams = Object.entries(bigramCounts)
    .map(([bigram, count]) => ({ bigram, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, BIGRAM_LIMIT);

  return {
    frequencies,
    totalLetters,
    uniqueLetters,
    topBigrams,
  };
}