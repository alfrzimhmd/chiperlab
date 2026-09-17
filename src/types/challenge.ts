import { DifficultyLevel } from './crypto';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
  category: string;
  difficulty: DifficultyLevel;
}

export interface CryptoPuzzle {
  id: string;
  title: string;
  category: 'classical' | 'modern' | 'encoding' | 'hash';
  difficulty: DifficultyLevel;
  description: string;
  ciphertext: string;
  hints: string[];
  solution: string;
  acceptableAnswers: string[]; // Variations (case-insensitive, trimmed)
  explanation: string;
  xpReward: number;
}

export interface AttackScenario {
  id: string;
  title: string;
  targetCipher: string;
  difficulty: DifficultyLevel;
  description: string;
  sampleCiphertext: string;
  technique: 'brute-force' | 'frequency-analysis' | 'known-plaintext' | 'xor-reuse';
  guidance: string[];
  objective: string;
  expectedFlag: string;
  xpReward: number;
}
