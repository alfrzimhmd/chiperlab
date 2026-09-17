export type ThemeMode = 'light' | 'dark' | 'system';

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

export interface UserProgress {
  completedLessons: string[];
  exploredAlgorithms: string[];
  completedChallenges: string[];
  quizScores: Record<string, number>;
  achievements: string[];
  lastVisitedLesson?: string;
  theme: ThemeMode;
  totalXp: number;
}
