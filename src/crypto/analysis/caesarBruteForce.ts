import { BruteForceResult } from '../../types/crypto';
import { caesarCipher } from '../classical/caesar';

const COMMON_WORDS = [
  'THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I',
  'IT', 'FOR', 'NOT', 'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT',
  'THIS', 'BUT', 'HIS', 'BY', 'FROM', 'THEY', 'WE', 'SAY', 'HER', 'SHE',
  'OR', 'AN', 'WILL', 'MY', 'ONE', 'ALL', 'WOULD', 'THERE', 'THEIR', 'WHAT',
  'CIPHER', 'SECRET', 'CRYPTO', 'SECURITY', 'KEY', 'MESSAGE', 'ATTACK', 'LAB',
  'FLAG', 'HELLO', 'WORLD', 'PASSWORD', 'HASH', 'PROTECT',
];

function scoreEnglishText(text: string): number {
  const upper = text.toUpperCase();
  let score = 0;

  // Check common word matches
  for (const word of COMMON_WORDS) {
    // Regex for word boundary or space/punctuation
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = upper.match(regex);
    if (matches) {
      score += matches.length * 20;
    }
  }

  // Bonus for standard vowels ratio (approx 35-40% in English)
  let vowels = 0;
  let consonants = 0;
  for (const ch of upper) {
    if ('AEIOU'.includes(ch)) vowels++;
    else if (ch >= 'A' && ch <= 'Z') consonants++;
  }

  const total = vowels + consonants;
  if (total > 0) {
    const vowelRatio = vowels / total;
    if (vowelRatio >= 0.25 && vowelRatio <= 0.45) {
      score += 15;
    }
  }

  return score;
}

export function bruteForceCaesar(ciphertext: string): BruteForceResult[] {
  const results: BruteForceResult[] = [];

  for (let shift = 0; shift < 26; shift++) {
    // Decrypting with shift
    const decrypted = caesarCipher(ciphertext, shift, 'decrypt').output;
    const score = scoreEnglishText(decrypted);

    results.push({
      key: shift,
      keyLabel: `Shift ${shift} (Rot-${shift})`,
      result: decrypted,
      score,
    });
  }

  // Determine top likelihood
  const maxScore = Math.max(...results.map(r => r.score));
  if (maxScore > 0) {
    results.forEach(r => {
      if (r.score === maxScore) {
        r.isLikelyMatch = true;
      }
    });
  }

  return results;
}
