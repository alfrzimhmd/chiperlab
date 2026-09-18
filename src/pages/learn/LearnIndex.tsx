import { Link } from 'react-router-dom';
import { BookOpen, Key, Compass, ArrowRight, Library } from 'lucide-react';
import { LESSONS } from '../../data/lessons';
import { ALGORITHMS } from '../../data/algorithms';
import { LessonCard } from '../../components/learning/LessonCard';
import { AlgorithmCard } from '../../components/learning/AlgorithmCard';
import { useProgress } from '../../hooks/useProgress';

export function LearnIndex() {
  const { isLessonCompleted, isAlgorithmExplored } = useProgress();

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* ============================================================
          HEADER — Centered
      ============================================================ */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            ChiperLab Academy
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
          Master Modern and Classical Cryptography
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          Structured learning designed to turn cryptographic theory into practical intuition —
          from ancient Caesar shifts and monoalphabetic substitutions to modern authenticated
          encryption, elliptic curve cryptography, post-quantum lattice standards, and
          decentralized blockchain trust systems.
        </p>

        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] max-w-4xl">
          Three tracks: <strong className="text-cyan-400">33 lessons</strong> covering 2,000 years of cryptographic
          evolution, <strong className="text-purple-400">14 algorithms</strong> with mathematical deep dives,
          and hands-on quizzes that save your progress.
        </p>
      </div>

      {/* ============================================================
          ACADEMY NAVIGATION CARDS
      ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Fundamentals Card */}
        <Link
          to="/learn/fundamentals"
          className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors mb-2">
              33 Fundamentals
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Three-track curriculum: beginner (what crypto is), intermediate (algorithm internals),
              and advanced (real-world attacks and protocols). Interactive quizzes with saved progress.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold text-cyan-400">
            <span>Explore 33 Lessons</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Algorithms Card */}
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
              Deep dive into 14 algorithms — Caesar, Atbash, Vigenère, XOR, AES-GCM, RSA-OAEP,
              ChaCha20, HMAC, SHA-256, SHA-512, MD5, Base64, Hex, and ROT13.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold text-purple-400">
            <span>View 14 Algorithms</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/learn/encyclopedia"
          className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-amber-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Library className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-amber-400 transition-colors mb-2">
              Crypto Encyclopedia
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Explore 2,500 years of cryptographic evolution on an interactive timeline, and browse
              60+ terms in a searchable glossary with cross-links to lessons and algorithms.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold text-amber-400">
            <span>Open Encyclopedia</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* ============================================================
          FEATURED FUNDAMENTALS
      ============================================================ */}
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
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
            VIEW ALL 33 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LESSONS.slice(0, 6).map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={isLessonCompleted(lesson.id)}
            />
          ))}
        </div>
      </div>

      {/* ============================================================
          FEATURED ALGORITHMS
      ============================================================ */}
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="font-mono text-xs font-bold text-purple-400 tracking-widest block">
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
            className="text-[11px] font-mono font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 whitespace-nowrap"
          >
            VIEW ALL 14 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALGORITHMS.slice(0, 3).map(algo => (
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