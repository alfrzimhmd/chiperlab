import { Trophy, X, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { ACHIEVEMENTS } from '../../data/achievements';
import { Link } from 'react-router-dom';

export function AchievementModal() {
  const { unlockedAchievementPopup, dismissAchievementPopup } = useProgress();

  if (!unlockedAchievementPopup) return null;

  const achievement = ACHIEVEMENTS.find(a => a.id === unlockedAchievementPopup);
  if (!achievement) return null;

  return (
    <div
      id="achievement-unlocked-modal"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="relative overflow-hidden bg-[var(--surface-main)] border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl shadow-amber-500/10">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Achievement Unlocked
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {achievement.title}
              </h4>
            </div>
          </div>
          <button
            onClick={dismissAchievementPopup}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="relative text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
          {achievement.description}
        </p>

        <div className="relative flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-main)]">
          <span className="text-xs font-mono font-bold text-emerald-400">
            +{achievement.xp} XP
          </span>
          <Link
            to="/progress"
            onClick={dismissAchievementPopup}
            className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View Achievements <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}