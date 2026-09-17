import { Link } from 'react-router-dom';
import { BookOpen, Key, Compass, ArrowRight } from 'lucide-react';
import { LESSONS } from '../../data/lessons';
import { ALGORITHMS } from '../../data/algorithms';
import { LessonCard } from '../../components/learning/LessonCard';
import { AlgorithmCard } from '../../components/learning/AlgorithmCard';
import { useProgress } from '../../hooks/useProgress';

export function LearnIndex() {
  const { isLessonCompleted, isAlgorithmExplored } = useProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            ChiperLab Academy
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
          Master Modern and Classical Cryptography
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Structured learning designed to turn cryptographic theory into practical intuition.
          Start with the 12 core security fundamentals, dive into algorithm mechanics, or follow
          the 7-level learning roadmap.
        </p>
      </div>

      {/* Academy Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/learn/fundamentals"
          className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors mb-2">
              12 Fundamentals
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Plaintext vs ciphertext, encryption vs encoding, symmetric vs asymmetric keys,
              hashing, and the CIA triad.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold text-cyan-400">
            <span>Explore 12 Lessons</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/learn/algorithms"
          className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-purple-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors mb-2">
              Algorithms Catalog
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Deep dive into Caesar, Atbash, Vigenère, XOR, AES-GCM, RSA-OAEP, SHA-256, and
              SHA-512 mathematical architectures.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold text-purple-400">
            <span>View 8 Algorithms</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/learn/roadmap"
          className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-amber-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-amber-400 transition-colors mb-2">
              Learning Roadmap
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Step through 7 curated learning levels from beginner fundamentals to cryptanalysis
              and cipher breaking.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold text-amber-400">
            <span>Follow the 7-Level Path</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Featured Fundamentals */}
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
              01 — FUNDAMENTALS
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1">
              Cryptography Fundamentals
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Core concepts every cybersecurity practitioner should master.
            </p>
          </div>
          <Link
            to="/learn/fundamentals"
            className="text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 whitespace-nowrap"
          >
            VIEW ALL 12 <ArrowRight className="w-3 h-3" />
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

      {/* Featured Algorithms */}
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
              02 — ALGORITHMS
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1">
              Featured Algorithms
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Classical ciphers and modern authenticated encryption protocols.
            </p>
          </div>
          <Link
            to="/learn/algorithms"
            className="text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 whitespace-nowrap"
          >
            VIEW ALL 8 <ArrowRight className="w-3 h-3" />
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