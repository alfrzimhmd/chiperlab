import { Link } from 'react-router-dom';
import { Trophy, HelpCircle, Puzzle, ShieldAlert, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { QUIZ_QUESTIONS, CRYPTO_PUZZLES, ATTACK_SCENARIOS } from '../../data/challenges';

export function ChallengesIndex() {
  const { progress } = useProgress();

  const totalChallenges = QUIZ_QUESTIONS.length + CRYPTO_PUZZLES.length + ATTACK_SCENARIOS.length;
  const completedPuzzles = CRYPTO_PUZZLES.filter(p => progress.completedChallenges.includes(p.id)).length;
  const completedAttacks = ATTACK_SCENARIOS.filter(a => progress.completedChallenges.includes(a.id)).length;
  const quizAttempted = Object.keys(progress.quizScores || {}).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          ChiperLab Challenge Arena
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Puzzles, Quizzes & Attack Simulations
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Put your cryptographic intuition to the test. Decrypt intercepted scrolls, pass knowledge assessments, and practice hands-on cryptanalysis.
        </p>
      </div>

      {/* Arena Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/challenges/quiz"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Knowledge Quiz
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              10 multiple-choice questions testing your comprehension of key principles, hashing, ciphers, and encoding.
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>{quizAttempted ? 'Retake Quiz' : 'Start 10-Question Quiz'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/challenges/puzzle"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
              <Puzzle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Crypto Puzzles
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Intercepted dispatches from Roman messengers, mirrored Hebrew scrolls, and Base64 traps. Decipher to earn XP.
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span>Solved: {completedPuzzles} / {CRYPTO_PUZZLES.length}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/challenges/attack"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Attack Simulations
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Hands-on cryptanalysis scenarios: Caesar exhaustive brute-force, frequency distribution, and Two-Time Pad XOR reuse.
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span>Completed: {completedAttacks} / {ATTACK_SCENARIOS.length}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
