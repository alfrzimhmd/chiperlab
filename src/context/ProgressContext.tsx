import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  UserProgress,
  ActivityLog,
  ExerciseAnswer,
  AlgorithmQuizAnswer,
} from '../types/progress';
import { getStoredProgress, saveStoredProgress } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/achievements';
import { ALGORITHM_QUIZZES } from '../data/algorithms/quizzes';
import confetti from 'canvas-confetti';

interface ProgressContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string, xp?: number, title?: string) => void;
  exploreAlgorithm: (algoId: string, xp?: number, name?: string) => void;
  completeChallenge: (challengeId: string, xp?: number, title?: string) => void;
  recordQuizScore: (quizId: string, score: number, xp?: number) => void;

  /** Save an interactive exercise answer for a lesson */
  saveExerciseAnswer: (
    lessonId: string,
    answer: string | number,
    isCorrect: boolean
  ) => void;

  /** Retrieve a saved exercise answer */
  getExerciseAnswer: (lessonId: string) => ExerciseAnswer | undefined;

  /** Save an algorithm quiz answer (quizIndex within algorithm) */
  saveAlgorithmQuizAnswer: (
    algoId: string,
    quizIndex: number,
    answer: string | number,
    isCorrect: boolean
  ) => void;

  /** Retrieve all saved quiz answers for an algorithm */
  getAlgorithmQuizAnswers: (algoId: string) => AlgorithmQuizAnswer[];

  /** Check if all quizzes for an algorithm have been answered correctly */
  isAlgorithmQuizComplete: (algoId: string) => boolean;

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
      (current.exploredAlgorithms.includes('sha256') ||
        current.completedLessons.includes('hashing-foundations')) &&
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

  /**
   * Save an interactive exercise answer for a lesson.
   * Only saves the FIRST correct answer or overwrites previous incorrect attempts.
   * If user answers correctly once, we don't let them accidentally overwrite it with wrong answers.
   */
  const saveExerciseAnswer = useCallback(
    (lessonId: string, answer: string | number, isCorrect: boolean) => {
      updateProgressAndCheck(prev => {
        const existing = prev.exerciseAnswers?.[lessonId];

        // If already answered correctly, don't overwrite with a wrong answer
        if (existing?.isCorrect && !isCorrect) {
          return prev;
        }

        const newAnswers = {
          ...(prev.exerciseAnswers || {}),
          [lessonId]: {
            answer,
            isCorrect,
            answeredAt: Date.now(),
          },
        };

        return {
          ...prev,
          exerciseAnswers: newAnswers,
        };
      });
    },
    [updateProgressAndCheck]
  );

  const getExerciseAnswer = useCallback(
    (lessonId: string): ExerciseAnswer | undefined => {
      return progress.exerciseAnswers?.[lessonId];
    },
    [progress.exerciseAnswers]
  );

  /**
   * Save an algorithm quiz answer.
   *
   * Rules:
   *  - Answers are stored as an array per algorithm (keyed by algorithm.id)
   *  - If a quiz was already answered correctly, we do NOT overwrite with a wrong answer
   *  - When ALL quizzes for the algorithm are correct, we mark the algorithm as explored
   */
  const saveAlgorithmQuizAnswer = useCallback(
    (algoId: string, quizIndex: number, answer: string | number, isCorrect: boolean) => {
      updateProgressAndCheck(prev => {
        const existing = prev.algorithmQuizAnswers?.[algoId] || [];
        const existingEntry = existing.find(a => a.quizIndex === quizIndex);

        // Already correct — don't overwrite with a wrong answer
        if (existingEntry?.isCorrect && !isCorrect) {
          return prev;
        }

        const newEntry: AlgorithmQuizAnswer = {
          quizIndex,
          answer,
          isCorrect,
          answeredAt: Date.now(),
        };

        // Replace existing entry for this quizIndex, or append new
        const updatedForAlgo = existing.filter(a => a.quizIndex !== quizIndex);
        updatedForAlgo.push(newEntry);
        updatedForAlgo.sort((a, b) => a.quizIndex - b.quizIndex);

        const newAnswersMap = {
          ...(prev.algorithmQuizAnswers || {}),
          [algoId]: updatedForAlgo,
        };

        const next: UserProgress = {
          ...prev,
          algorithmQuizAnswers: newAnswersMap,
        };

        // Check if this completed all quizzes for the algorithm
        const quizSet = ALGORITHM_QUIZZES[algoId] || [];
        const totalQuizzes = quizSet.length;
        const correctCount = updatedForAlgo.filter(a => a.isCorrect).length;

        if (totalQuizzes > 0 && correctCount === totalQuizzes) {
          // Mark as explored if not already
          if (!next.exploredAlgorithms.includes(algoId)) {
            return pushActivity(
              {
                ...next,
                exploredAlgorithms: [...next.exploredAlgorithms, algoId],
                totalXp: next.totalXp + 15,
              },
              {
                type: 'algorithm-explored',
                label: `Mastered quiz for: ${algoId}`,
                detail: `${totalQuizzes}/${totalQuizzes} correct`,
                xp: 15,
              }
            );
          }
        }

        return next;
      });
    },
    [updateProgressAndCheck]
  );

  const getAlgorithmQuizAnswers = useCallback(
    (algoId: string): AlgorithmQuizAnswer[] => {
      return progress.algorithmQuizAnswers?.[algoId] || [];
    },
    [progress.algorithmQuizAnswers]
  );

  const isAlgorithmQuizComplete = useCallback(
    (algoId: string): boolean => {
      const quizSet = ALGORITHM_QUIZZES[algoId] || [];
      if (quizSet.length === 0) return false;
      const saved = progress.algorithmQuizAnswers?.[algoId] || [];
      const correctCount = saved.filter(a => a.isCorrect).length;
      return correctCount === quizSet.length;
    },
    [progress.algorithmQuizAnswers]
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const isAlgorithmExplored = useCallback(
    (algoId: string) => progress.exploredAlgorithms.includes(algoId),
    [progress.exploredAlgorithms]
  );

  const isChallengeCompleted = useCallback(
    (challengeId: string) => progress.completedChallenges.includes(challengeId),
    [progress.completedChallenges]
  );

  const hasAchievement = useCallback(
    (achievementId: string) => progress.achievements.includes(achievementId),
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
      exerciseAnswers: {},
      algorithmQuizAnswers: {},
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
        saveExerciseAnswer,
        getExerciseAnswer,
        saveAlgorithmQuizAnswer,
        getAlgorithmQuizAnswers,
        isAlgorithmQuizComplete,
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