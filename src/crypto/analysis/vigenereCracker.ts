// ============================================================
// Vigenère Cracker — Multi-Candidate + Length Hint
// ============================================================

import { ENGLISH_FREQUENCIES } from './frequency';

// ============================================================
// Types
// ============================================================
export interface KeyLengthCandidate {
  length: number;
  ioc: number;
  confidence: 'high' | 'medium' | 'low';
  peakScore: number;
}

export interface ColumnAnalysis {
  column: number;
  bestShift: number;
  bestLetter: string;
  logScore: number;
}

export interface CrackCandidate {
  rank: number;
  keyLength: number;
  key: string;
  plaintext: string;
  plaintextFormatted: string;
  columns: ColumnAnalysis[];
  score: number;
  wordMatches: number;
  trigramMatches: number;
  columnLogScore: number;
  confidence: 'high' | 'medium' | 'low';
}

export type LengthHint = 'too-short' | 'marginal' | 'good' | 'excellent';

export interface VigenereCrackResult {
  ciphertext: string;
  totalLetters: number;
  candidates: CrackCandidate[];
  best: CrackCandidate | null;
  keyLengthCandidates: KeyLengthCandidate[];
  lengthHint: LengthHint;
  warning?: string;
}

// ============================================================
// Constants
// ============================================================
const ENGLISH_IOC = 0.0667;
const MAX_CANDIDATES = 8;
const MAX_KEY_LENGTH_TO_TEST = 20;

const ENGLISH_LOG_PROB: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (const { letter, pct } of ENGLISH_FREQUENCIES) {
    map[letter] = Math.log(pct / 100);
  }
  for (let i = 65; i <= 90; i++) {
    const ch = String.fromCharCode(i);
    if (!(ch in map)) map[ch] = Math.log(0.0001);
  }
  return map;
})();

const COMMON_WORDS = [
  'THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I',
  'IT', 'FOR', 'NOT', 'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT',
  'THIS', 'BUT', 'HIS', 'BY', 'FROM', 'THEY', 'WE', 'SAY', 'HER', 'SHE',
  'OR', 'AN', 'WILL', 'MY', 'ONE', 'ALL', 'WOULD', 'THERE', 'THEIR', 'WHAT',
  'SO', 'UP', 'OUT', 'IF', 'ABOUT', 'WHO', 'GET', 'WHICH', 'GO', 'ME',
  'WHEN', 'MAKE', 'CAN', 'LIKE', 'TIME', 'NO', 'JUST', 'HIM', 'KNOW', 'TAKE',
  'PEOPLE', 'INTO', 'YEAR', 'YOUR', 'GOOD', 'SOME', 'COULD', 'THEM', 'SEE', 'OTHER',
  'THAN', 'THEN', 'NOW', 'LOOK', 'ONLY', 'COME', 'ITS', 'OVER', 'THINK', 'ALSO',
  'BACK', 'AFTER', 'USE', 'TWO', 'HOW', 'OUR', 'WORK', 'FIRST', 'WELL', 'WAY',
  'EVEN', 'NEW', 'WANT', 'BECAUSE', 'ANY', 'THESE', 'GIVE', 'DAY', 'MOST', 'US',
  'WAS', 'ARE', 'BEEN', 'HAS', 'HAD', 'WERE', 'SAID', 'EACH', 'IS', 'DOES',
  'ATTACK', 'SECRET', 'MESSAGE', 'ENCRYPT', 'DECRYPT', 'CIPHER', 'CRYPTO',
  'CODE', 'KEY', 'HELLO', 'WORLD', 'DAWN', 'MEET', 'FRIEND', 'FOE',
  'NIGHT', 'MORNING', 'EVENING', 'QUICK', 'BROWN', 'FOX', 'JUMPS', 'LAZY',
  'DOG', 'PASSWORD', 'TOKEN', 'AUTH', 'LOGIN', 'SYSTEM', 'DATA', 'FILE',
  'SEND', 'READY', 'WAIT', 'PROCEED', 'STOP', 'DANGER', 'SAFE',
];

const COMMON_TRIGRAMS = [
  'THE', 'AND', 'ING', 'HER', 'HAT', 'HIS', 'THA', 'ERE', 'FOR', 'ENT',
  'ION', 'TER', 'WAS', 'YOU', 'ITH', 'VER', 'ALL', 'TIO', 'EVE', 'OUL',
  'OUN', 'AIN', 'STH', 'OUR', 'EST', 'IGHT', 'AVE', 'CON', 'ECT', 'OTH',
  'ULD', 'OULD', 'ANCE', 'ENCE', 'MEN', 'ATI', 'ATE', 'WHI', 'HIC', 'ICH',
  'TIS', 'AIT', 'ATT', 'TTA', 'TAC', 'ACK',
];

// ============================================================
// Helpers
// ============================================================
function normalizeText(text: string): string {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

function indexOfCoincidence(text: string): number {
  const n = text.length;
  if (n < 2) return 0;
  const counts: Record<string, number> = {};
  for (const ch of text) counts[ch] = (counts[ch] || 0) + 1;
  let sum = 0;
  for (const count of Object.values(counts)) sum += count * (count - 1);
  return sum / (n * (n - 1));
}

function extractColumn(text: string, keyLength: number, offset: number): string {
  let result = '';
  for (let i = offset; i < text.length; i += keyLength) result += text[i];
  return result;
}

function logLikelihoodScore(text: string): number {
  if (text.length === 0) return -Infinity;
  const counts: Record<string, number> = {};
  for (const ch of text) {
    if (ch >= 'A' && ch <= 'Z') counts[ch] = (counts[ch] || 0) + 1;
  }
  let score = 0;
  for (const [ch, count] of Object.entries(counts)) {
    const logProb = ENGLISH_LOG_PROB[ch] ?? Math.log(0.0001);
    score += count * logProb;
  }
  return score;
}

function bestShiftForColumn(columnText: string): { shift: number; score: number } {
  let bestShift = 0;
  let bestScore = -Infinity;
  for (let shift = 0; shift < 26; shift++) {
    let decrypted = '';
    for (const ch of columnText) {
      const code = ((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65;
      decrypted += String.fromCharCode(code);
    }
    const score = logLikelihoodScore(decrypted);
    if (score > bestScore) {
      bestScore = score;
      bestShift = shift;
    }
  }
  return { shift: bestShift, score: bestScore };
}

function scorePlaintext(plaintext: string): {
  score: number;
  wordMatches: number;
  trigramMatches: number;
} {
  const upper = plaintext.toUpperCase();

  let wordMatches = 0;
  const matchedWords = new Set<string>();
  for (const word of COMMON_WORDS) {
    let idx = 0;
    while ((idx = upper.indexOf(word, idx)) !== -1) {
      wordMatches++;
      matchedWords.add(word);
      idx += word.length;
    }
  }

  let trigramMatches = 0;
  if (upper.length >= 3) {
    for (let i = 0; i <= upper.length - 3; i++) {
      const tri = upper.slice(i, i + 3);
      if (COMMON_TRIGRAMS.includes(tri)) trigramMatches++;
    }
  }

  const uniqueWords = matchedWords.size;
  const wordCoverage = wordMatches / Math.max(1, upper.length / 5);
  const trigramCoverage = trigramMatches / Math.max(1, upper.length - 2);
  const varietyBonus = Math.min(1, uniqueWords / 10);

  const rawScore = wordCoverage * 50 + trigramCoverage * 30 + varietyBonus * 20;

  return {
    score: Math.min(100, Math.max(0, rawScore * 100)),
    wordMatches,
    trigramMatches,
  };
}

// ============================================================
// Main
// ============================================================
export function crackVigenere(input: string): VigenereCrackResult {
  const ciphertext = normalizeText(input);
  const totalLetters = ciphertext.length;

  // Length hint
  let lengthHint: LengthHint;
  if (totalLetters < 50) lengthHint = 'too-short';
  else if (totalLetters < 100) lengthHint = 'marginal';
  else if (totalLetters < 200) lengthHint = 'good';
  else lengthHint = 'excellent';

  if (totalLetters < 20) {
    return {
      ciphertext,
      totalLetters,
      candidates: [],
      best: null,
      keyLengthCandidates: [],
      lengthHint: 'too-short',
      warning:
        'Ciphertext is too short (< 20 letters). Vigenère cracking requires at least 100 letters of English text for reliable results.',
    };
  }

  // Step 1: IoC-based key length estimation
  const MAX_KEY_LENGTH = Math.min(MAX_KEY_LENGTH_TO_TEST, Math.floor(totalLetters / 4));
  const keyLengthCandidates: KeyLengthCandidate[] = [];

  const rawIoC: Record<number, number> = {};

  for (let len = 2; len <= MAX_KEY_LENGTH; len++) {
    let sumIoC = 0;
    for (let offset = 0; offset < len; offset++) {
      sumIoC += indexOfCoincidence(extractColumn(ciphertext, len, offset));
    }
    rawIoC[len] = sumIoC / len;
  }

  for (let len = 2; len <= MAX_KEY_LENGTH; len++) {
    const ioc = rawIoC[len];
    let peakScore = 0;

    const prev = rawIoC[len - 1] ?? 0;
    const next = rawIoC[len + 1] ?? 0;

    if (ioc > prev) peakScore++;
    if (ioc > next) peakScore++;

    for (let multiple = len * 2; multiple <= MAX_KEY_LENGTH; multiple += len) {
      if (rawIoC[multiple] && rawIoC[multiple] > ENGLISH_IOC * 0.7) {
        peakScore += 0.5;
      }
    }

    const diff = Math.abs(ioc - ENGLISH_IOC);
    let confidence: 'high' | 'medium' | 'low';
    if (diff < 0.005) confidence = 'high';
    else if (diff < 0.012) confidence = 'medium';
    else confidence = 'low';

    keyLengthCandidates.push({ length: len, ioc, confidence, peakScore });
  }

  keyLengthCandidates.sort((a, b) => {
    const scoreA = a.ioc * 100 + a.peakScore * 5;
    const scoreB = b.ioc * 100 + b.peakScore * 5;
    return scoreB - scoreA;
  });

  const topKeyLengths = keyLengthCandidates.slice(0, 10);

  if (topKeyLengths.length === 0) {
    return {
      ciphertext,
      totalLetters,
      candidates: [],
      best: null,
      keyLengthCandidates: [],
      lengthHint,
      warning: 'Not enough data to estimate key length.',
    };
  }

  // Step 2: Recover key for each candidate
  const candidates: CrackCandidate[] = [];

  for (const klc of topKeyLengths) {
    const columns: ColumnAnalysis[] = [];
    let key = '';
    let totalColumnLogScore = 0;

    for (let offset = 0; offset < klc.length; offset++) {
      const column = extractColumn(ciphertext, klc.length, offset);
      const { shift, score } = bestShiftForColumn(column);
      const letter = String.fromCharCode(65 + shift);

      columns.push({
        column: offset,
        bestShift: shift,
        bestLetter: letter,
        logScore: score,
      });

      key += letter;
      totalColumnLogScore += score;
    }

    const plaintext = decryptVigenere(ciphertext, key);
    const { score, wordMatches, trigramMatches } = scorePlaintext(plaintext);

    let confidence: 'high' | 'medium' | 'low';
    if (wordMatches >= 5 && trigramMatches >= 15) confidence = 'high';
    else if (wordMatches >= 2 || trigramMatches >= 6) confidence = 'medium';
    else confidence = 'low';

    candidates.push({
      rank: 0,
      keyLength: klc.length,
      key,
      plaintext,
      plaintextFormatted: decryptVigenerePreservingFormat(input, key),
      columns,
      score,
      wordMatches,
      trigramMatches,
      columnLogScore: totalColumnLogScore,
      confidence,
    });
  }

  // Step 3: Deduplicate by key
  const uniqueCandidates: CrackCandidate[] = [];
  const seenKeys = new Set<string>();

  for (const cand of candidates) {
    if (seenKeys.has(cand.key)) continue;
    seenKeys.add(cand.key);
    uniqueCandidates.push(cand);
  }

  // Step 4: Sort & take top N
  uniqueCandidates.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 3) return b.score - a.score;
    if (b.wordMatches !== a.wordMatches) return b.wordMatches - a.wordMatches;
    if (b.trigramMatches !== a.trigramMatches) return b.trigramMatches - a.trigramMatches;
    return b.columnLogScore - a.columnLogScore;
  });

  const topCandidates = uniqueCandidates.slice(0, MAX_CANDIDATES);

  topCandidates.forEach((c, i) => {
    c.rank = i + 1;
  });

  const best = topCandidates[0] ?? null;

  let warning: string | undefined;
  if (lengthHint === 'too-short') {
    warning =
      'Ciphertext is too short (< 50 letters). For reliable Vigenère cracking, provide at least 100-200 letters of English text.';
  } else if (lengthHint === 'marginal') {
    warning =
      'Ciphertext is on the short side (< 100 letters). Results may be unreliable. Try 200+ letters.';
  } else if (!best || best.confidence === 'low') {
    warning =
      'Low confidence. The ciphertext may not be Vigenère, may not use English plaintext, or the key may be too long.';
  }

  return {
    ciphertext,
    totalLetters,
    candidates: topCandidates,
    best,
    keyLengthCandidates: keyLengthCandidates.slice(0, 5),
    lengthHint,
    warning,
  };
}

// ============================================================
// Decrypt helpers
// ============================================================
export function decryptVigenere(ciphertext: string, key: string): string {
  const cleanText = normalizeText(ciphertext);
  const cleanKey = normalizeText(key);
  if (cleanKey.length === 0) return cleanText;

  let result = '';
  for (let i = 0; i < cleanText.length; i++) {
    const c = cleanText.charCodeAt(i) - 65;
    const k = cleanKey.charCodeAt(i % cleanKey.length) - 65;
    const p = ((c - k + 26) % 26) + 65;
    result += String.fromCharCode(p);
  }
  return result;
}

export function decryptVigenerePreservingFormat(
  originalText: string,
  key: string
): string {
  const cleanKey = normalizeText(key);
  if (cleanKey.length === 0) return originalText;

  let keyIndex = 0;
  let result = '';

  for (const ch of originalText) {
    const upper = ch.toUpperCase();
    if (upper >= 'A' && upper <= 'Z') {
      const c = upper.charCodeAt(0) - 65;
      const k = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
      const p = ((c - k + 26) % 26) + 65;
      const plainChar = String.fromCharCode(p);
      result += ch === upper ? plainChar : plainChar.toLowerCase();
      keyIndex++;
    } else {
      result += ch;
    }
  }

  return result;
}