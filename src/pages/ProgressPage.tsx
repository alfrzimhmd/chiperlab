import { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { ACHIEVEMENTS } from '../data/achievements';
import { LESSONS } from '../data/lessons';
import { ALGORITHMS } from '../data/algorithms';
import {
  Trophy,
  Zap,
  BookOpen,
  Key,
  Shield,
  RotateCcw,
  CheckCircle2,
  Lock,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export function ProgressPage() {
  const { progress, hasAchievement, resetProgress } = useProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalLessons = LESSONS.length;
  const totalAlgos = ALGORITHMS.length;

  const getRank = (xp: number) => {
    if (xp >= 500) return { title: 'Grandmaster Cryptographer', level: 5, color: 'text-amber-500' };
    if (xp >= 300) return { title: 'Security Cryptanalyst', level: 4, color: 'text-indigo-500' };
    if (xp >= 150) return { title: 'Cipher Specialist', level: 3, color: 'text-sky-500' };
    if (xp >= 50) return { title: 'Academy Scholar', level: 2, color: 'text-emerald-500' };
    return { title: 'Initiate Apprentice', level: 1, color: 'text-slate-400' };
  };

  const rank = getRank(progress.totalXp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            Academy Transcript & Profile
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Learning Progress
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowResetConfirm(true)}
          icon={<RotateCcw className="w-3.5 h-3.5 text-rose-500" />}
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
        >
          Reset All Progress
        </Button>
      </div>

      {/* Rank & XP Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block">
              Level 0{rank.level} Rank
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {rank.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Earn XP by completing lessons, solving puzzles, and experimenting with ciphers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total XP</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {progress.totalXp}
            </span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Badges</span>
            <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
              {progress.achievements.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Breakdown Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Lessons Completed</span>
            <BookOpen className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {progress.completedLessons.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {totalLessons}</span>
          </div>
          <ProgressBar
            value={progress.completedLessons.length}
            max={totalLessons}
            size="sm"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Algorithms Explored</span>
            <Key className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {progress.exploredAlgorithms.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {totalAlgos}</span>
          </div>
          <ProgressBar
            value={progress.exploredAlgorithms.length}
            max={totalAlgos}
            color="indigo"
            size="sm"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Challenges & Puzzles Solved</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {progress.completedChallenges.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">Completed</span>
          </div>
          <ProgressBar
            value={progress.completedChallenges.length}
            max={10}
            color="amber"
            size="sm"
          />
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Academy Achievements & Badges
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unlock special honors as you master cryptographic algorithms and complete hands-on challenges.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono">
            {progress.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = hasAchievement(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      +{ach.xp} XP
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ach.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Badge: {ach.badge}
                  </span>
                  {isUnlocked && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset All Learning Progress?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will clear all completed lessons, explored algorithms, challenge scores, and achievements from your browser local storage. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
              >
                Yes, Reset Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
