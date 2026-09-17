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
}