import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '../../data/lessons';
import { LessonCard } from '../../components/learning/LessonCard';
import { useProgress } from '../../hooks/useProgress';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import { DifficultyLevel } from '../../types/crypto';

export function FundamentalsList() {
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isLessonCompleted } = useProgress();

  const filteredLessons = LESSONS.filter(lesson => {
    const matchesDifficulty =
      filterDifficulty === 'all' || lesson.difficulty === filterDifficulty;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.tags &&
        lesson.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Back Button */}
      <Link
        to="/learn"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Learn Hub
      </Link>

      {/* Header — Centered */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            33 Comprehensive Lessons
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Cryptography Fundamentals
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          A structured three-track curriculum covering 2,000 years of cryptographic evolution —
          from ancient Caesar shifts and monoalphabetic substitutions to modern authenticated
          encryption, elliptic curves, post-quantum lattice cryptography, and decentralized
          blockchain trust systems.
        </p>
        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] max-w-2xl">
          Beginner track builds the vocabulary. Intermediate track explores algorithm internals.
          Advanced track dissects real-world attacks, protocols, and cutting-edge research.
        </p>
      </div>

      {/* Controls — Compact width, centered */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search lessons or topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  filterDifficulty === diff
                    ? 'bg-cyan-500 text-black'
                    : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-main)] hover:text-[var(--text-primary)] border border-[var(--border-main)]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {filteredLessons.length > 0 && (
        <div className="text-center">
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">
            Showing {filteredLessons.length} of {LESSONS.length} lessons
          </span>
        </div>
      )}

      {/* Lessons Grid — 3 columns max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isCompleted={isLessonCompleted(lesson.id)}
          />
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] text-sm font-mono max-w-4xl mx-auto">
          No lessons found matching "{searchQuery}". Try adjusting your search.
        </div>
      )}
    </div>
  );
}