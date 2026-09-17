import { Link } from 'react-router-dom';
import {
  Trophy,
  HelpCircle,
  Puzzle,
  ShieldAlert,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Award,
  Lock,
} from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { QUIZ_QUESTIONS, CRYPTO_PUZZLES, ATTACK_SCENARIOS } from '../../data/challenges';

export function ChallengesIndex() {
  const { progress } = useProgress();

  const totalChallenges = QUIZ_QUESTIONS.length + CRYPTO_PUZZLES.length + ATTACK_SCENARIOS.length;
  const completedPuzzles = CRYPTO_PUZZLES.filter(p => progress.completedChallenges.includes(p.id)).length;
  const completedAttacks = ATTACK_SCENARIOS.filter(a => progress.completedChallenges.includes(a.id)).length;
  const quizAttempted = Object.keys(progress.quizScores || {}).length > 0;
  const highestQuizScore = Math.max(0, ...Object.values(progress.quizScores || {}));

  const totalCompleted = completedPuzzles + completedAttacks + (quizAttempted ? 1 : 0);
  const completionPercent = Math.round((totalCompleted / 3) * 100);

  const hubs = [
    {
      to: '/challenges/quiz',
      label: 'Knowledge Quiz',
      desc: '10 multiple-choice questions testing your comprehension of key principles, hashing, ciphers, and encoding.',
      icon: HelpCircle,
      accent: 'amber',
      accentBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-500/30',
      accentText: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
      cta: quizAttempted ? `Retake (Best: ${highestQuizScore}%)` : 'Start 10-Question Quiz',
      count: QUIZ_QUESTIONS.length,
      completed: quizAttempted ? 1 : 0,
    },
    {
      to: '/challenges/puzzle',
      label: 'Crypto Puzzles',
      desc: 'Intercepted dispatches from Roman messengers, mirrored Hebrew scrolls, and Base64 traps. Decipher to earn XP.',
      icon: Puzzle,
      accent: 'cyan',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/30',
      accentText: 'text-cyan-400',
      hoverBorder: 'hover:border-cyan-500/40',
      cta: `${completedPuzzles} / ${CRYPTO_PUZZLES.length} Solved`,
      count: CRYPTO_PUZZLES.length,
      completed: completedPuzzles,
    },
    {
      to: '/challenges/attack',
      label: 'Attack Simulations',
      desc: 'Hands-on cryptanalysis scenarios: Caesar exhaustive brute-force, frequency distribution, and Two-Time Pad XOR reuse.',
      icon: ShieldAlert,
      accent: 'rose',
      accentBg: 'bg-rose-500/10',
      accentBorder: 'border-rose-500/30',
      accentText: 'text-rose-400',
      hoverBorder: 'hover:border-rose-500/40',
      cta: `${completedAttacks} / ${ATTACK_SCENARIOS.length} Exploited`,
      count: ATTACK_SCENARIOS.length,
      completed: completedAttacks,
    },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            ChiperLab Challenge Arena
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Puzzles, Quizzes & Attack Simulations
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Put your cryptographic intuition to the test. Decrypt intercepted scrolls, pass knowledge
          assessments, and practice hands-on cryptanalysis.
        </p>
      </div>

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Total Available
            </span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">
              {totalChallenges}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">items</span>
          </div>
          <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-2">
            {QUIZ_QUESTIONS.length} quiz + {CRYPTO_PUZZLES.length} puzzle + {ATTACK_SCENARIOS.length} attack
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Categories Solved
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-400">{totalCompleted}</span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">/ 3</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--surface-secondary)] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Best Quiz Score
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-400">
              {highestQuizScore}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">%</span>
          </div>
          <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-2">
            {highestQuizScore >= 80 ? 'Top Marks unlocked' : 'Need 80%+ for badge'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              XP Earnable
            </span>
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-400">
              {CRYPTO_PUZZLES.reduce((s, p) => s + p.xpReward, 0) +
                ATTACK_SCENARIOS.reduce((s, a) => s + a.xpReward, 0) +
                50}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">XP</span>
          </div>
          <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-2">
            From all challenges
          </p>
        </div>
      </div>

      {/* Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {hubs.map(hub => {
          const Icon = hub.icon;
          const isComplete = hub.completed === hub.count;
          const isStarted = hub.completed > 0 && !isComplete;

          return (
            <Link
              key={hub.to}
              to={hub.to}
              className={`group p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] ${hub.hoverBorder} shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${hub.accentBg} ${hub.accentBorder} border flex items-center justify-center ${hub.accentText} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                      Progress
                    </span>
                    <span className={`text-lg font-extrabold font-mono ${hub.accentText}`}>
                      {hub.completed}/{hub.count}
                    </span>
                  </div>
                </div>

                <h2 className={`text-lg font-bold text-[var(--text-primary)] group-hover:${hub.accentText} transition-colors`}>
                  {hub.label}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {hub.desc}
                </p>

                {/* Mini progress bar */}
                <div className="h-1 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      hub.accent === 'amber'
                        ? 'bg-amber-500'
                        : hub.accent === 'cyan'
                        ? 'bg-cyan-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${(hub.completed / hub.count) * 100}%` }}
                  />
                </div>
              </div>

              <div
                className={`pt-5 mt-5 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold ${hub.accentText}`}
              >
                <span className="flex items-center gap-1.5">
                  {isComplete && <Trophy className="w-3.5 h-3.5" />}
                  {isStarted && !isComplete && <Zap className="w-3.5 h-3.5" />}
                  {!isStarted && <Lock className="w-3.5 h-3.5" />}
                  {hub.cta}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Difficulty Breakdown */}
        <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Difficulty Distribution
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                Challenges by difficulty level
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Beginner',
                count: [...CRYPTO_PUZZLES, ...ATTACK_SCENARIOS].filter(
                  x => x.difficulty === 'beginner'
                ).length,
                color: 'bg-emerald-500',
                text: 'text-emerald-400',
                total: [...CRYPTO_PUZZLES, ...ATTACK_SCENARIOS].length,
              },
              {
                label: 'Intermediate',
                count: [...CRYPTO_PUZZLES, ...ATTACK_SCENARIOS].filter(
                  x => x.difficulty === 'intermediate'
                ).length,
                color: 'bg-cyan-500',
                text: 'text-cyan-400',
                total: [...CRYPTO_PUZZLES, ...ATTACK_SCENARIOS].length,
              },
              {
                label: 'Advanced',
                count: [...CRYPTO_PUZZLES, ...ATTACK_SCENARIOS].filter(
                  x => x.difficulty === 'advanced'
                ).length,
                color: 'bg-amber-500',
                text: 'text-amber-400',
                total: [...CRYPTO_PUZZLES, ...ATTACK_SCENARIOS].length,
              },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-mono text-[var(--text-secondary)]">{item.label}</span>
                  <span className={`font-mono font-bold ${item.text}`}>{item.count}</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{
                      width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How Challenges Work */}
        <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                How Challenges Work
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                XP, badges, and progression
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-bold text-amber-400 shrink-0">
                1
              </span>
              <span className="leading-relaxed">
                Every solved puzzle, quiz, or attack grants <strong className="text-amber-400">XP</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono text-[10px] font-bold text-cyan-400 shrink-0">
                2
              </span>
              <span className="leading-relaxed">
                Hints are available but reduce no XP — use them freely to learn.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] font-bold text-emerald-400 shrink-0">
                3
              </span>
              <span className="leading-relaxed">
                Score <strong className="text-emerald-400">80%+</strong> on the quiz to unlock the Top Marks badge.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono text-[10px] font-bold text-purple-400 shrink-0">
                4
              </span>
              <span className="leading-relaxed">
                Progress auto-saves to browser local storage — refresh anytime.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}