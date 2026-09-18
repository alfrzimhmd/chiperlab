export type ThemeMode = 'light' | 'dark' | 'system';

export type ActivityType =
  | 'lesson-complete'
  | 'algorithm-explored'
  | 'challenge-complete'
  | 'quiz-attempt'
  | 'achievement-unlocked';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  label: string;
  detail?: string;
  xp: number;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  category: 'learning' | 'experimentation' | 'challenge' | 'mastery';
  xp: number;
  unlockedAt?: string;
}

/**
 * Saved answer for a lesson's interactive exercise.
 * Keyed by lesson.id in UserProgress.exerciseAnswers.
 */
export interface ExerciseAnswer {
  /** Index of the selected choice, OR the raw text answer */
  answer: string | number;
  /** Whether the saved answer was correct */
  isCorrect: boolean;
  /** Timestamp when the user submitted the answer */
  answeredAt: number;
}

export interface UserProgress {
  completedLessons: string[];
  exploredAlgorithms: string[];
  completedChallenges: string[];
  quizScores: Record<string, number>;
  achievements: string[];
  lastVisitedLesson?: string;
  theme: ThemeMode;
  totalXp: number;
  activityLog?: ActivityLog[];
  /** Per-lesson exercise answers, keyed by lesson.id */
  exerciseAnswers: Record<string, ExerciseAnswer>;
}