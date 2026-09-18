import { DifficultyLevel } from './crypto';

export interface Checkpoint {
  id: string;
  title: string;
  isComplete: boolean;
}

/**
 * Reference to a source used for a lesson.
 * Displayed in the "References" section at the bottom of each lesson.
 */
export interface LessonReference {
  /** Title of the source (standard, paper, or book title) */
  title: string;
  /** Optional author(s) */
  author?: string;
  /** Optional year */
  year?: number;
  /** Optional URL to the source */
  url?: string;
  /** Type of source */
  type: 'standard' | 'paper' | 'book' | 'article' | 'documentation';
}

export interface LessonSection {
  id:
    | 'introduction'
    | 'concept'
    | 'example'
    | 'visualization'
    | 'takeaways'
    | 'exercise'
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

export interface InteractiveExercise {
  question: string;
  instruction: string;
  defaultInput?: string;
  correctAnswer: string;
  hint: string;
  explanation: string;
  inputType?: 'text' | 'choice' | 'number';
  options?: string[];
}

export interface Lesson {
  id: string;
  slug: string;
  order: number;
  title: string;
  category: 'foundations' | 'mechanisms' | 'modern' | 'security';
  description: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  xpReward: number;
  sections: LessonSection[];
  interactiveExercise: InteractiveExercise;
  tags?: string[];
  keyTakeaways?: string[];
  /** Sources used for this lesson (displayed at bottom) */
  references?: LessonReference[];
}