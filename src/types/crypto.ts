export type CipherType =
  | 'caesar'
  | 'atbash'
  | 'vigenere'
  | 'xor'
  | 'aes-gcm'
  | 'rsa-oaep'
  | 'base64'
  | 'hex'
  | 'rot13'
  | 'chacha20'
  | 'hmac'
  | 'md5';

export type HashType = 'SHA-256' | 'SHA-512';
export type HashAlgorithm = HashType;

export type AlgorithmCategory = 'classical' | 'modern' | 'hashing' | 'encoding';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Supported algorithm identifiers used in playground and query params.
 * Extends CipherType to make intent clearer at call sites.
 */
export type SupportedAlgo = CipherType;

/**
 * Attacker techniques used in cryptanalysis attack simulation.
 */
export type AttackerTechnique =
  | 'brute-force'
  | 'frequency-analysis'
  | 'known-plaintext'
  | 'xor-reuse';

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
  score: number;
  isLikelyMatch?: boolean;
}