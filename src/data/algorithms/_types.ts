import { AlgorithmCategory, DifficultyLevel } from '../../types/crypto';

export interface AlgorithmSection {
  id:
    | 'introduction'
    | 'history'
    | 'how-it-works'
    | 'formula'
    | 'example'
    | 'security'
    | 'comparison'
    | 'lab'
    | 'summary';
  title: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  keyPoints?: string[];
  callout?: {
    type: 'tip' | 'warning' | 'info';
    title: string;
    content: string;
  };
  example?: string;
}

export interface AlgorithmReference {
  title: string;
  author?: string;
  year?: number;
  url?: string;
  type: 'standard' | 'paper' | 'book' | 'article' | 'documentation';
}

/**
 * A single quiz question for an algorithm.
 * Algorithms can have 2-3 quizzes to test different aspects
 * of the algorithm (history, mechanics, security, application).
 */
export interface AlgorithmQuiz {
  /** Question text (supports **bold** markdown) */
  question: string;
  /** Instruction/hint about the format of the answer */
  instruction: string;
  /** Choice = radio buttons; Text = free input; Number = numeric input */
  inputType?: 'text' | 'choice' | 'number';
  /** For choice input type */
  options?: string[];
  /** The correct answer (exact match, or index for choice) */
  correctAnswer: string;
  /** Hint shown after a wrong answer */
  hint: string;
  /** Explanation shown after a correct or incorrect answer */
  explanation: string;
}

export interface AlgorithmDetail {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: DifficultyLevel;
  tagline: string;
  description: string;
  estimatedMinutes: number;
  references: AlgorithmReference[];
  keyTakeaways?: string[];
  sections: AlgorithmSection[];
  playgroundRoute: string;
  defaultDemoKey: string;
  defaultDemoInput: string;
  labEnabled: boolean;
}