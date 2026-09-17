import { DifficultyLevel } from './crypto';

export interface Checkpoint {
  id: string;
  title: string;
  isComplete: boolean;
}

export interface LessonSection {
  id: 'introduction' | 'concept' | 'example' | 'visualization' | 'takeaways' | 'exercise' | 'summary';
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
}
