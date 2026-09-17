import { CharFrequency } from '../../types/crypto';

// Standard English letter frequency percentages (ETAOIN SHRDLU...)
export const ENGLISH_FREQUENCY: Record<string, number> = {
  E: 12.02, T: 9.10, A: 8.12, O: 7.68, I: 7.31, N: 6.95,
  S: 6.28, R: 6.02, H: 5.92, D: 4.32, L: 3.98, U: 2.88,
  C: 2.71, M: 2.61, F: 2.30, Y: 2.11, W: 2.09, G: 2.03,
  P: 1.82, B: 1.49, V: 1.11, K: 0.69, X: 0.17, Q: 0.11,
  J: 0.10, Z: 0.07,
};

export function analyzeFrequency(text: string): {
  frequencies: CharFrequency[];
  totalLetters: number;
  uniqueLetters: number;
} {
  const counts: Record<string, number> = {};
  let totalLetters = 0;

  // Initialize A-Z
  for (let i = 65; i <= 90; i++) {
    counts[String.fromCharCode(i)] = 0;
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    if (char >= 'A' && char <= 'Z') {
      counts[char] = (counts[char] || 0) + 1;
      totalLetters++;
    }
  }

  const frequencies: CharFrequency[] = Object.keys(counts).map(char => {
    const count = counts[char];
    const percentage = totalLetters > 0 ? (count / totalLetters) * 100 : 0;
    return {
      char,
      count,
      percentage: Math.round(percentage * 10) / 10,
      expectedEnglish: ENGLISH_FREQUENCY[char] || 0,
    };
  });

  // Sort descending by actual count
  frequencies.sort((a, b) => b.count - a.count || a.char.localeCompare(b.char));

  const uniqueLetters = frequencies.filter(f => f.count > 0).length;

  return {
    frequencies,
    totalLetters,
    uniqueLetters,
  };
}
