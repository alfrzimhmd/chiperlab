import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProgress, ActivityLog, ActivityType } from '../types/progress';
import { getStoredProgress, saveStoredProgress } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/achievements';
import confetti from 'canvas-confetti';

interface ProgressContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string, xp?: number, title?: string) => void;
  exploreAlgorithm: (algoId: string, xp?: number, name?: string) => void;
  completeChallenge: (challengeId: string, xp?: number, title?: string) => void;
  recordQuizScore: (quizId: string, score: number, xp?: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isAlgorithmExplored: (algoId: string) => boolean;
  isChallengeCompleted: (challengeId: string) => boolean;
  hasAchievement: (achievementId: string) => boolean;
  resetProgress: () => void;
  unlockedAchievementPopup: string | null;
  dismissAchievementPopup: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const MAX_ACTIVITY_ENTRIES = 20;

function pushActivity(
  prev: UserProgress,
  entry: Omit<ActivityLog, 'id' | 'timestamp'>
): UserProgress {
  const newEntry: ActivityLog = {
    ...entry,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
  const existing = prev.activityLog || [];
  const updated = [newEntry, ...existing].slice(0, MAX_ACTIVITY_ENTRIES);
  return { ...prev, activityLog: updated };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState<UserProgress>(() => getStoredProgress());
  const [unlockedAchievementPopup, setUnlockedAchievementPopup] = useState<string | null>(null);

  const checkAchievements = useCallback((current: UserProgress): string[] => {
    const newlyUnlocked: string[] = [];

    if (current.completedLessons.length >= 1 && !current.achievements.includes('first-steps')) {
      newlyUnlocked.push('first-steps');
    }
    if (current.exploredAlgorithms.length >= 5 && !current.achievements.includes('crypto-explorer')) {
      newlyUnlocked.push('crypto-explorer');
    }
    if (current.completedChallenges.length >= 1 && !current.achievements.includes('puzzle-solver')) {
      newlyUnlocked.push('puzzle-solver');
    }
    if (
      (current.exploredAlgorithms.includes('sha256') || current.completedLessons.includes('hashing-foundations')) &&
      !current.achievements.includes('hash-master')
    ) {
      newlyUnlocked.push('hash-master');
    }
    if (
      current.completedChallenges.some(c => c.startsWith('attack-')) &&
      !current.achievements.includes('cipher-breaker')
    ) {
      newlyUnlocked.push('cipher-breaker');
    }
    const highestQuizScore = Math.max(0, ...Object.values(current.quizScores || {}));
    if (highestQuizScore >= 80 && !current.achievements.includes('perfect-quiz')) {
      newlyUnlocked.push('perfect-quiz');
    }
    if (
      (current.exploredAlgorithms.includes('aes') || current.exploredAlgorithms.includes('rsa')) &&
      !current.achievements.includes('modern-cryptographer')
    ) {
      newlyUnlocked.push('modern-cryptographer');
    }
    if (current.totalXp >= 400 && !current.achievements.includes('grand-master')) {
      newlyUnlocked.push('grand-master');
    }

    return newlyUnlocked;
  }, []);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // safe fallback
    }
  }, []);

  const updateProgressAndCheck = useCallback(
    (updater: (prev: UserProgress) => UserProgress) => {
      setProgressState(prev => {
        const updated = updater(prev);
        const newAchievements = checkAchievements(updated);

        if (newAchievements.length > 0) {
          let addedXp = 0;
          newAchievements.forEach(achId => {
            const found = ACHIEVEMENTS.find(a => a.id === achId);
            if (found) addedXp += found.xp;
          });

          let withAchievements: UserProgress = {
            ...updated,
            achievements: [...updated.achievements, ...newAchievements],
            totalXp: updated.totalXp + addedXp,
          };

          // Log achievement unlock activity
          newAchievements.forEach(achId => {
            const found = ACHIEVEMENTS.find(a => a.id === achId);
            if (found) {
              withAchievements = pushActivity(withAchievements, {
                type: 'achievement-unlocked',
                label: `Unlocked: ${found.title}`,
                detail: found.badge,
                xp: found.xp,
              });
            }
          });

          saveStoredProgress(withAchievements);
          setUnlockedAchievementPopup(newAchievements[0]);
          triggerCelebration();
          return withAchievements;
        }

        saveStoredProgress(updated);
        return updated;
      });
    },
    [checkAchievements, triggerCelebration]
  );

  const completeLesson = useCallback(
    (lessonId: string, xp = 30, title?: string) => {
      updateProgressAndCheck(prev => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        const base: UserProgress = {
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId],
          totalXp: prev.totalXp + xp,
          lastVisitedLesson: lessonId,
        };
        return pushActivity(base, {
          type: 'lesson-complete',
          label: title ? `Completed: ${title}` : `Lesson completed`,
          xp,
        });
      });
    },
    [updateProgressAndCheck]
  );

  const exploreAlgorithm = useCallback(
    (algoId: string, xp = 15, name?: string) => {
      updateProgressAndCheck(prev => {
        if (prev.exploredAlgorithms.includes(algoId)) return prev;
        const base: UserProgress = {
          ...prev,
          exploredAlgorithms: [...prev.exploredAlgorithms, algoId],
          totalXp: prev.totalXp + xp,
        };
        return pushActivity(base, {
          type: 'algorithm-explored',
          label: name ? `Explored: ${name}` : `Algorithm explored`,
          xp,
        });
      });
    },
    [updateProgressAndCheck]
  );

  const completeChallenge = useCallback(
    (challengeId: string, xp = 50, title?: string) => {
      updateProgressAndCheck(prev => {
        if (prev.completedChallenges.includes(challengeId)) return prev;
        triggerCelebration();
        const base: UserProgress = {
          ...prev,
          completedChallenges: [...prev.completedChallenges, challengeId],
          totalXp: prev.totalXp + xp,
        };
        return pushActivity(base, {
          type: 'challenge-complete',
          label: title ? `Solved: ${title}` : `Challenge completed`,
          xp,
        });
      });
    },
    [updateProgressAndCheck, triggerCelebration]
  );

  const recordQuizScore = useCallback(
    (quizId: string, score: number, xp = 40) => {
      updateProgressAndCheck(prev => {
        const prevScore = prev.quizScores[quizId] || 0;
        const isNewHigh = score > prevScore;
        const addedXp = isNewHigh ? xp : 0;
        const base: UserProgress = {
          ...prev,
          quizScores: {
            ...prev.quizScores,
            [quizId]: Math.max(prevScore, score),
          },
          totalXp: prev.totalXp + addedXp,
        };
        return pushActivity(base, {
          type: 'quiz-attempt',
          label: `Quiz: ${score}%`,
          detail: isNewHigh ? 'New personal best!' : `Best: ${Math.max(prevScore, score)}%`,
          xp: addedXp,
        });
      });
    },
    [updateProgressAndCheck]
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return progress.completedLessons.includes(lessonId);
    },
    [progress.completedLessons]
  );

  const isAlgorithmExplored = useCallback(
    (algoId: string) => {
      return progress.exploredAlgorithms.includes(algoId);
    },
    [progress.exploredAlgorithms]
  );

  const isChallengeCompleted = useCallback(
    (challengeId: string) => {
      return progress.completedChallenges.includes(challengeId);
    },
    [progress.completedChallenges]
  );

  const hasAchievement = useCallback(
    (achievementId: string) => {
      return progress.achievements.includes(achievementId);
    },
    [progress.achievements]
  );

  const resetProgress = useCallback(() => {
    const emptyProgress: UserProgress = {
      completedLessons: [],
      exploredAlgorithms: [],
      completedChallenges: [],
      quizScores: {},
      achievements: [],
      theme: progress.theme,
      totalXp: 0,
      activityLog: [],
    };
    setProgressState(emptyProgress);
    saveStoredProgress(emptyProgress);
  }, [progress.theme]);

  const dismissAchievementPopup = useCallback(() => {
    setUnlockedAchievementPopup(null);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLesson,
        exploreAlgorithm,
        completeChallenge,
        recordQuizScore,
        isLessonCompleted,
        isAlgorithmExplored,
        isChallengeCompleted,
        hasAchievement,
        resetProgress,
        unlockedAchievementPopup,
        dismissAchievementPopup,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}