import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProgress } from '../types/progress';
import { getStoredProgress, saveStoredProgress } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/achievements';
import confetti from 'canvas-confetti';

interface ProgressContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string, xp?: number) => void;
  exploreAlgorithm: (algoId: string, xp?: number) => void;
  completeChallenge: (challengeId: string, xp?: number) => void;
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

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState<UserProgress>(() => getStoredProgress());
  const [unlockedAchievementPopup, setUnlockedAchievementPopup] = useState<string | null>(null);

  const checkAchievements = useCallback((current: UserProgress): string[] => {
    const newlyUnlocked: string[] = [];

    // 1. First Steps: 1 lesson
    if (current.completedLessons.length >= 1 && !current.achievements.includes('first-steps')) {
      newlyUnlocked.push('first-steps');
    }
    // 2. Crypto Explorer: 5 algorithms
    if (current.exploredAlgorithms.length >= 5 && !current.achievements.includes('crypto-explorer')) {
      newlyUnlocked.push('crypto-explorer');
    }
    // 3. Puzzle Solver: 1 challenge/puzzle
    if (current.completedChallenges.length >= 1 && !current.achievements.includes('puzzle-solver')) {
      newlyUnlocked.push('puzzle-solver');
    }
    // 4. Hash Master: explored sha256 or completed hashing lesson
    if (
      (current.exploredAlgorithms.includes('sha256') || current.completedLessons.includes('hashing-foundations')) &&
      !current.achievements.includes('hash-master')
    ) {
      newlyUnlocked.push('hash-master');
    }
    // 5. Cipher Breaker: completed an attack challenge
    if (
      current.completedChallenges.some(c => c.startsWith('attack-')) &&
      !current.achievements.includes('cipher-breaker')
    ) {
      newlyUnlocked.push('cipher-breaker');
    }
    // 6. Top Marks: quiz score >= 80%
    const highestQuizScore = Math.max(0, ...Object.values(current.quizScores || {}));
    if (highestQuizScore >= 80 && !current.achievements.includes('perfect-quiz')) {
      newlyUnlocked.push('perfect-quiz');
    }
    // 7. Modern Cryptographer: aes or rsa explored
    if (
      (current.exploredAlgorithms.includes('aes') || current.exploredAlgorithms.includes('rsa')) &&
      !current.achievements.includes('modern-cryptographer')
    ) {
      newlyUnlocked.push('modern-cryptographer');
    }
    // 8. Grand Master: totalXp >= 400
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

  const updateProgressAndCheck = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgressState(prev => {
      const updated = updater(prev);
      const newAchievements = checkAchievements(updated);

      if (newAchievements.length > 0) {
        let addedXp = 0;
        newAchievements.forEach(achId => {
          const found = ACHIEVEMENTS.find(a => a.id === achId);
          if (found) addedXp += found.xp;
        });

        const withAchievements: UserProgress = {
          ...updated,
          achievements: [...updated.achievements, ...newAchievements],
          totalXp: updated.totalXp + addedXp,
        };

        saveStoredProgress(withAchievements);
        setUnlockedAchievementPopup(newAchievements[0]);
        triggerCelebration();
        return withAchievements;
      }

      saveStoredProgress(updated);
      return updated;
    });
  }, [checkAchievements, triggerCelebration]);

  const completeLesson = useCallback((lessonId: string, xp = 30) => {
    updateProgressAndCheck(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalXp: prev.totalXp + xp,
        lastVisitedLesson: lessonId,
      };
    });
  }, [updateProgressAndCheck]);

  const exploreAlgorithm = useCallback((algoId: string, xp = 15) => {
    updateProgressAndCheck(prev => {
      if (prev.exploredAlgorithms.includes(algoId)) return prev;
      return {
        ...prev,
        exploredAlgorithms: [...prev.exploredAlgorithms, algoId],
        totalXp: prev.totalXp + xp,
      };
    });
  }, [updateProgressAndCheck]);

  const completeChallenge = useCallback((challengeId: string, xp = 50) => {
    updateProgressAndCheck(prev => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      triggerCelebration();
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        totalXp: prev.totalXp + xp,
      };
    });
  }, [updateProgressAndCheck, triggerCelebration]);

  const recordQuizScore = useCallback((quizId: string, score: number, xp = 40) => {
    updateProgressAndCheck(prev => {
      const prevScore = prev.quizScores[quizId] || 0;
      const isNewHigh = score > prevScore;
      const addedXp = isNewHigh ? xp : 0;
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizId]: Math.max(prevScore, score),
        },
        totalXp: prev.totalXp + addedXp,
      };
    });
  }, [updateProgressAndCheck]);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const isAlgorithmExplored = useCallback((algoId: string) => {
    return progress.exploredAlgorithms.includes(algoId);
  }, [progress.exploredAlgorithms]);

  const isChallengeCompleted = useCallback((challengeId: string) => {
    return progress.completedChallenges.includes(challengeId);
  }, [progress.completedChallenges]);

  const hasAchievement = useCallback((achievementId: string) => {
    return progress.achievements.includes(achievementId);
  }, [progress.achievements]);

  const resetProgress = useCallback(() => {
    const emptyProgress: UserProgress = {
      completedLessons: [],
      exploredAlgorithms: [],
      completedChallenges: [],
      quizScores: {},
      achievements: [],
      theme: progress.theme,
      totalXp: 0,
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
