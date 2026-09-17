import { Link } from 'react-router-dom';
import { BookOpen, Key, Compass, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { LESSONS } from '../../data/lessons';
import { ALGORITHMS } from '../../data/algorithms';
import { ROADMAP_LEVELS } from '../../data/roadmap';
import { LessonCard } from '../../components/learning/LessonCard';
import { AlgorithmCard } from '../../components/learning/AlgorithmCard';
import { useProgress } from '../../hooks/useProgress';

export function LearnIndex() {
  const { isLessonCompleted, isAlgorithmExplored } = useProgress();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          ChiperLab Interactive Academy
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Master Modern and Classical Cryptography
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Structured learning designed to turn cryptographic theory into practical intuition. Start with the 12 core security fundamentals, dive into algorithm mechanics, or follow the 7-level learning roadmap.
        </p>
      </div>

      {/* Academy Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/learn/fundamentals"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              12 Fundamentals
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Plaintext vs ciphertext, encryption vs encoding, symmetric vs asymmetric keys, hashing, and the CIA triad.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span>Explore 12 Lessons</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/learn/algorithms"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Algorithms Catalog
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Deep dive into Caesar, Atbash, Vigenère, XOR, AES-GCM, RSA-OAEP, SHA-256, and SHA-512 mathematical architectures.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>View 8 Algorithms</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/learn/roadmap"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Learning Roadmap
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Step through 7 curated learning levels from beginner fundamentals to cryptanalysis and cipher breaking.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Follow the 7-Level Path</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Featured Fundamentals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Cryptography Fundamentals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Core concepts every cybersecurity practitioner and developer should master.
            </p>
          </div>
          <Link
            to="/learn/fundamentals"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            View all 12 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.slice(0, 6).map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={isLessonCompleted(lesson.id)}
            />
          ))}
        </div>
      </div>

      {/* Featured Algorithms Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Featured Algorithms
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore classical ciphers and modern authenticated encryption protocols.
            </p>
          </div>
          <Link
            to="/learn/algorithms"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            View all 8 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALGORITHMS.slice(0, 4).map(algo => (
            <AlgorithmCard
              key={algo.id}
              algorithm={algo}
              isExplored={isAlgorithmExplored(algo.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
