export type CipherType = 'caesar' | 'atbash' | 'vigenere' | 'xor' | 'aes-gcm' | 'rsa-oaep';
export type HashType = 'SHA-256' | 'SHA-512';
export type HashAlgorithm = HashType;
export type AlgorithmCategory = 'classical' | 'modern' | 'hashing';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TransformationStep {
  index: number;
  inputChar: string;
  outputChar: string;
  explanation: string;
  substeps?: {
    label: string;
    value: string | number;
  }[];
}

export interface CryptoResult {
  output: string;
  steps?: TransformationStep[];
  meta?: {
    algorithm: string;
    mode: 'encrypt' | 'decrypt';
    inputLength: number;
    outputLength: number;
    durationMs?: number;
    keyInfo?: string;
    ivHex?: string;
  };
}

export interface CharFrequency {
  char: string;
  count: number;
  percentage: number;
  expectedEnglish: number;
}

export interface BruteForceResult {
  key: number | string;
  keyLabel: string;
  result: string;
  score: number; // Likelihood score based on common English words/letter frequencies
  isLikelyMatch?: boolean;
}
