import { useState } from 'react';
import { LESSONS } from '../../data/lessons';
import { LessonCard } from '../../components/learning/LessonCard';
import { useProgress } from '../../hooks/useProgress';
import { Search, Filter, BookOpen } from 'lucide-react';
import { DifficultyLevel } from '../../types/crypto';

export function FundamentalsList() {
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isLessonCompleted } = useProgress();

  const filteredLessons = LESSONS.filter(lesson => {
    const matchesDifficulty = filterDifficulty === 'all' || lesson.difficulty === filterDifficulty;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.tags && lesson.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          12 Core Fundamentals
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cryptography Fundamentals
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
          A foundational curriculum covering core concepts from basic ciphertext transformation to public key exchange and the CIA security triad.
        </p>
      </div>

      {/* Controls: Search and Difficulty Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons or topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Difficulty buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                filterDifficulty === diff
                  ? 'bg-sky-600 text-white dark:bg-sky-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
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
        <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
          No lessons found matching "{searchQuery}". Try adjusting your search query or filter.
        </div>
      )}
    </div>
  );
}
