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
  RotateCcw,
  CheckCircle2,
  Lock,
  Award,
  AlertTriangle,
  TrendingUp,
  Target,
  Activity,
  Sparkles,
  Clock,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';

export function ProgressPage() {
  const { progress, hasAchievement, resetProgress } = useProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalLessons = LESSONS.length;
  const totalAlgos = ALGORITHMS.length;
  const totalChallenges = 12;

  const getRank = (xp: number) => {
    if (xp >= 500)
      return { title: 'Grandmaster Cryptographer', level: 5, color: 'text-amber-400', next: 600 };
    if (xp >= 300)
      return { title: 'Security Cryptanalyst', level: 4, color: 'text-purple-400', next: 500 };
    if (xp >= 150)
      return { title: 'Cipher Specialist', level: 3, color: 'text-cyan-400', next: 300 };
    if (xp >= 50)
      return { title: 'Academy Scholar', level: 2, color: 'text-emerald-400', next: 150 };
    return { title: 'Initiate Apprentice', level: 1, color: 'text-[var(--text-secondary)]', next: 50 };
  };

  const rank = getRank(progress.totalXp);
  const xpToNext = rank.next - progress.totalXp;
  const xpProgressPercent = Math.min(100, Math.round((progress.totalXp / rank.next) * 100));

  // XP breakdown
  const xpFromLessons = LESSONS.filter(l =>
    progress.completedLessons.includes(l.id)
  ).reduce((s, l) => s + l.xpReward, 0);
  const xpFromAlgos = progress.exploredAlgorithms.length * 15;
  const xpFromChallenges = Math.max(0, progress.totalXp - xpFromLessons - xpFromAlgos);

  // Activity log
  const activities = (progress.activityLog || []).slice(0, 8);

  const formatTimeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase text-[11px] font-medium">
              Academy Transcript & Profile
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            My Learning Progress
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Track your cryptographic journey — lessons completed, algorithms explored, badges
            unlocked, and recent activity. Everything is stored locally in your browser.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowResetConfirm(true)}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-rose-400 hover:text-rose-300 hover:border-rose-500/40 whitespace-nowrap"
        >
          Reset Progress
        </Button>
      </div>

      {/* Rank Hero — compact */}
      <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Rank Info */}
          <div className="lg:col-span-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                Level 0{rank.level} Rank
              </span>
              <h2 className={`text-xl sm:text-2xl font-extrabold ${rank.color} truncate`}>
                {rank.title}
              </h2>
            </div>
          </div>

          {/* XP Progress */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[var(--text-secondary)]">XP to next rank</span>
              <span className="text-amber-400 font-bold">
                {progress.totalXp} / {rank.next}
              </span>
            </div>
            <div className="h-2 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-[var(--text-secondary)]">
              {xpToNext > 0 ? `${xpToNext} XP away from next level` : 'Max level reached'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                Total XP
              </span>
              <span className="text-xl font-extrabold font-mono text-amber-400">
                {progress.totalXp}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                Badges
              </span>
              <span className="text-xl font-extrabold font-mono text-cyan-400">
                {progress.achievements.length}
                <span className="text-[10px] text-[var(--text-secondary)] font-normal">
                  /{ACHIEVEMENTS.length}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Metrics + XP Breakdown) + Right (Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: 7 cols */}
        <div className="lg:col-span-7 space-y-5">
          {/* Metrics — 3 compact cards in 1 row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Lessons
                </span>
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-cyan-400">
                  {progress.completedLessons.length}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  / {totalLessons}
                </span>
              </div>
              <ProgressBar
                value={progress.completedLessons.length}
                max={totalLessons}
                color="primary"
                size="sm"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Algorithms
                </span>
                <Key className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-purple-400">
                  {progress.exploredAlgorithms.length}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  / {totalAlgos}
                </span>
              </div>
              <ProgressBar
                value={progress.exploredAlgorithms.length}
                max={totalAlgos}
                color="indigo"
                size="sm"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Challenges
                </span>
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-amber-400">
                  {progress.completedChallenges.length}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  / {totalChallenges}
                </span>
              </div>
              <ProgressBar
                value={progress.completedChallenges.length}
                max={totalChallenges}
                color="amber"
                size="sm"
              />
            </div>
          </div>

          {/* XP Breakdown */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  XP Breakdown
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  How you earned your total
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center">
                <BookOpen className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
                <div className="text-lg font-extrabold font-mono text-cyan-400">
                  {xpFromLessons}
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Lessons
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center">
                <Key className="w-4 h-4 text-purple-400 mx-auto mb-1.5" />
                <div className="text-lg font-extrabold font-mono text-purple-400">
                  {xpFromAlgos}
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Algorithms
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center">
                <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
                <div className="text-lg font-extrabold font-mono text-amber-400">
                  {xpFromChallenges}
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Challenges
                </span>
              </div>
            </div>

            {/* Visual bar */}
            {progress.totalXp > 0 && (
              <div className="space-y-2 pt-2 border-t border-[var(--border-main)]">
                <div className="flex h-2.5 rounded-full overflow-hidden bg-[var(--surface-secondary)]">
                  <div
                    className="bg-cyan-500 transition-all duration-700"
                    style={{ width: `${(xpFromLessons / progress.totalXp) * 100}%` }}
                    title={`Lessons: ${xpFromLessons} XP`}
                  />
                  <div
                    className="bg-purple-500 transition-all duration-700"
                    style={{ width: `${(xpFromAlgos / progress.totalXp) * 100}%` }}
                    title={`Algorithms: ${xpFromAlgos} XP`}
                  />
                  <div
                    className="bg-amber-500 transition-all duration-700"
                    style={{ width: `${(xpFromChallenges / progress.totalXp) * 100}%` }}
                    title={`Challenges: ${xpFromChallenges} XP`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-cyan-500" /> Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-purple-500" /> Algos
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-amber-500" /> Challenges
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Learning Milestones */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Next Milestones
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Suggested goals to unlock
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  done: progress.completedLessons.length >= 5,
                  label: 'Complete 5 fundamentals lessons',
                  progress: `${progress.completedLessons.length}/5`,
                  href: '/learn/fundamentals',
                },
                {
                  done: progress.exploredAlgorithms.length >= 5,
                  label: 'Explore 5 cryptographic algorithms',
                  progress: `${progress.exploredAlgorithms.length}/5`,
                  href: '/learn/algorithms',
                },
                {
                  done: progress.completedChallenges.length >= 3,
                  label: 'Solve 3 puzzles or challenges',
                  progress: `${progress.completedChallenges.length}/3`,
                  href: '/challenges',
                },
                {
                  done: (progress.quizScores['crypto-fundamentals-quiz'] || 0) >= 80,
                  label: 'Score 80%+ on the fundamentals quiz',
                  progress: `${progress.quizScores['crypto-fundamentals-quiz'] || 0}%`,
                  href: '/challenges/quiz',
                },
              ].map((m, idx) => (
                <a
                  key={idx}
                  href={`#${m.href}`}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    m.done
                      ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                      : 'bg-[var(--surface-secondary)] border-[var(--border-main)] hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        m.done
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[var(--surface-main)] text-[var(--text-secondary)] border border-[var(--border-main)]'
                      }`}
                    >
                      {m.done ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                    </span>
                    <span
                      className={`text-xs ${
                        m.done
                          ? 'text-[var(--text-secondary)] line-through'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {m.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold shrink-0 ml-2 ${
                      m.done ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    {m.progress}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: 5 cols */}
        <div className="lg:col-span-5 space-y-5">
          {/* Recent Activity */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Recent Activity
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Your last {activities.length} actions
                  </p>
                </div>
              </div>
            </div>

            {activities.length > 0 ? (
              <div className="space-y-1.5">
                {activities.map(a => {
                  const icon =
                    a.type === 'lesson-complete' ? (
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    ) : a.type === 'algorithm-explored' ? (
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                    ) : a.type === 'challenge-complete' ? (
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    ) : a.type === 'quiz-attempt' ? (
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                    );

                  const accent =
                    a.type === 'lesson-complete'
                      ? 'border-cyan-500/30 bg-cyan-500/5'
                      : a.type === 'algorithm-explored'
                      ? 'border-purple-500/30 bg-purple-500/5'
                      : a.type === 'challenge-complete'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : a.type === 'quiz-attempt'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-emerald-500/30 bg-emerald-500/5';

                  return (
                    <div
                      key={a.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${accent} transition-colors`}
                    >
                      <span className="w-7 h-7 rounded-md bg-[var(--surface-main)] border border-[var(--border-main)] flex items-center justify-center shrink-0">
                        {icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
                          {a.label}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimeAgo(a.timestamp)}
                          </span>
                          {a.detail && (
                            <>
                              <span>•</span>
                              <span className="truncate">{a.detail}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {a.xp > 0 && (
                        <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">
                          +{a.xp}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-[var(--surface-secondary)] border border-dashed border-[var(--border-main)] text-center space-y-2">
                <Sparkles className="w-6 h-6 text-cyan-400 mx-auto" />
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  No activity yet. Complete a lesson or explore an algorithm to see your progress
                  log here.
                </p>
                <a
                  href="#/learn/fundamentals"
                  className="inline-block text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Start Learning →
                </a>
              </div>
            )}
          </div>

          {/* Quick Stats Summary */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Overall Completion
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Aggregate across all tracks
                </p>
              </div>
            </div>

            {(() => {
              const totalItems = totalLessons + totalAlgos + totalChallenges;
              const completedItems =
                progress.completedLessons.length +
                progress.exploredAlgorithms.length +
                progress.completedChallenges.length;
              const pct = Math.round((completedItems / totalItems) * 100);

              return (
                <>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold font-mono text-emerald-400">
                      {pct}%
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                      {completedItems} / {totalItems} items
                    </span>
                  </div>
                  <ProgressBar value={completedItems} max={totalItems} color="success" size="md" />
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Achievements Grid — Full width, compact */}
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              ACHIEVEMENTS
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1">
              Badges & Honors
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Unlock special honors as you master cryptographic algorithms and complete challenges.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 whitespace-nowrap">
            {progress.achievements.length} / {ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = hasAchievement(ach.id);

            return (
              <div
                key={ach.id}
                className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-[var(--surface-main)] border-amber-500/40 shadow-lg'
                    : 'bg-[var(--surface-main)] border-[var(--border-main)] opacity-60'
                }`}
              >
                {isUnlocked && (
                  <div className="absolute -top-8 -right-8 w-20 h-20 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
                          : 'bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isUnlocked ? 'text-amber-400' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      +{ach.xp} XP
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{ach.title}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="relative pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[var(--text-secondary)]">Badge: {ach.badge}</span>
                  {isUnlocked && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--surface-main)] border border-rose-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Reset All Learning Progress?
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              This will clear all completed lessons, explored algorithms, challenge scores,
              activity log, and achievements from your browser local storage. This action cannot
              be undone.
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