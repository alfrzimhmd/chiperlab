import { UserProgress, ThemeMode } from '../types/progress';

export const PROGRESS_STORAGE_KEY = 'chiperlab-progress';
export const THEME_STORAGE_KEY = 'chiperlab-theme';

export const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  exploredAlgorithms: [],
  completedChallenges: [],
  quizScores: {},
  achievements: [],
  theme: 'system',
  totalXp: 0,
  activityLog: [],
  exerciseAnswers: {},
};

export function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      // Ensure nested objects always exist (backward-compat with old storage)
      quizScores: parsed?.quizScores ?? {},
      activityLog: parsed?.activityLog ?? [],
      exerciseAnswers: parsed?.exerciseAnswers ?? {},
    };
  } catch (err) {
    console.warn('Failed to parse chiperlab-progress from localStorage:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveStoredProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save chiperlab-progress to localStorage:', err);
  }
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
    return 'system';
  } catch {
    return 'system';
  }
}

export function saveStoredTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    console.warn('Failed to save chiperlab-theme to localStorage:', err);
  }
}