import { Trophy, X, ArrowRight } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { ACHIEVEMENTS } from '../../data/achievements';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export function AchievementModal() {
  const { unlockedAchievementPopup, dismissAchievementPopup } = useProgress();

  if (!unlockedAchievementPopup) return null;

  const achievement = ACHIEVEMENTS.find(a => a.id === unlockedAchievementPopup);
  if (!achievement) return null;

  return (
    <div
      id="achievement-unlocked-modal"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300 shadow-2xl"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 block">
                Achievement Unlocked!
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {achievement.title}
              </h4>
            </div>
          </div>
          <button
            onClick={dismissAchievementPopup}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {achievement.description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            +{achievement.xp} XP Earned
          </span>
          <Link
            to="/progress"
            onClick={dismissAchievementPopup}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            View Achievements <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
