import { Link } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Terminal,
  Trophy,
  Zap,
  ArrowRight,
  Lock,
  Unlock,
  Key,
  Compass,
  CheckCircle2,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { LESSONS } from '../data/lessons';
import { ALGORITHMS } from '../data/algorithms';
import { ROADMAP_LEVELS } from '../data/roadmap';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export function Dashboard() {
  const { progress } = useProgress();

  const totalLessons = LESSONS.length;
  const completedLessonsCount = progress.completedLessons.length;
  const exploredAlgosCount = progress.exploredAlgorithms.length;
  const totalAlgos = ALGORITHMS.length;
  const completedChallengesCount = progress.completedChallenges.length;

  const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

  // Next suggested lesson
  const nextLesson =
    LESSONS.find(l => !progress.completedLessons.includes(l.id)) || LESSONS[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Cybersecurity Academy
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome to <span className="text-sky-400">ChiperLab</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Learn Cryptography by <strong className="text-white">Understanding</strong>,{' '}
            <strong className="text-white">Experimenting</strong>, and{' '}
            <strong className="text-white">Solving</strong>. Transform plaintext into ciphertext,
            inspect bitwise XOR streams, simulate brute-force attacks, and leverage native Web Crypto APIs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to={`/learn/fundamentals/${nextLesson.id}`}>
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                {completedLessonsCount === 0 ? 'Start Learning' : 'Continue Next Lesson'}
              </Button>
            </Link>
            <Link to="/playground">
              <Button variant="outline" size="md" className="text-white border-slate-700 hover:bg-slate-800">
                Launch Playground
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Lessons Completed</span>
            <BookOpen className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedLessonsCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {totalLessons}</span>
          </div>
          <ProgressBar value={completedLessonsCount} max={totalLessons} size="sm" className="mt-3" />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Algorithms Explored</span>
            <Key className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {exploredAlgosCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {totalAlgos}</span>
          </div>
          <ProgressBar value={exploredAlgosCount} max={totalAlgos} color="indigo" size="sm" className="mt-3" />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Challenges Solved</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedChallengesCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">Completed</span>
          </div>
          <ProgressBar value={completedChallengesCount} max={10} color="amber" size="sm" className="mt-3" />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Academy XP</span>
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {progress.totalXp}
            </span>
            <span className="text-xs text-slate-400 font-mono">Total XP</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">
            {progress.totalXp >= 400
              ? 'Rank: Master Cryptographer'
              : progress.totalXp >= 150
              ? 'Rank: Security Scholar'
              : 'Rank: Cryptography Apprentice'}
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Next Step & Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggested Next Lesson & Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Recommended Next Step
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Lesson #{nextLesson.order}: {nextLesson.title}
                </h2>
              </div>
              <Badge variant="primary">{nextLesson.difficulty}</Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {nextLesson.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Estimated time: {nextLesson.estimatedMinutes} mins • Reward: +{nextLesson.xpReward} XP
              </span>
              <Link to={`/learn/fundamentals/${nextLesson.id}`}>
                <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                  Start Lesson
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Hub Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/playground"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Interactive Playground
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Encrypt and decrypt with Caesar, Atbash, Vigenère, XOR, AES-GCM, and RSA-OAEP.
              </p>
            </Link>

            <Link
              to="/playground/hash"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Cryptographic Hashing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Generate SHA-256 and SHA-512 digests and observe the live Avalanche Effect.
              </p>
            </Link>

            <Link
              to="/challenges/quiz"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Knowledge Quiz & Puzzles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Test your understanding with 10 interactive questions and intercepted cipher puzzles.
              </p>
            </Link>

            <Link
              to="/playground/analyze"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3 group-hover:scale-105 transition-transform">
                <Unlock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Cryptanalysis Lab
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Perform statistical frequency analysis and crack Caesar ciphers in 25 parallel shifts.
              </p>
            </Link>
          </div>
        </div>

        {/* Sidebar: Security Spotlight & Learning Roadmap Snippet */}
        <div className="space-y-6">
          {/* Security Spotlight Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
              Core Security Concept
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-500" />
              Kerckhoffs's Principle (1883)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              "A cryptographic system should be secure even if everything about the system, except the key, is public knowledge."
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Modern security strictly forbids <em>"security through obscurity"</em>. Open mathematical scrutiny is what keeps AES and RSA robust.
            </p>
          </div>

          {/* Roadmap Snapshot */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-500" />
                Learning Path (7 Levels)
              </h3>
              <Link to="/learn/roadmap" className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {ROADMAP_LEVELS.slice(0, 4).map(lvl => (
                <Link
                  key={lvl.levelCode}
                  to={lvl.route}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      L0{lvl.levelNumber}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {lvl.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                    +{lvl.xpReward} XP
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
