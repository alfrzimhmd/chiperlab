import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_TERMS,
} from '../../data/glossary';
import type { GlossaryCategory } from '../../types/encyclopedia';

export function GlossaryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | GlossaryCategory>('all');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      if (activeCategory !== 'all' && term.category !== activeCategory) return false;
      if (activeLetter && !term.term.toUpperCase().startsWith(activeLetter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          term.term.toLowerCase().includes(q) ||
          term.definition.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, activeCategory, activeLetter]);

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    GLOSSARY_TERMS.forEach(t => letters.add(t.term[0].toUpperCase()));
    return Array.from(letters).sort();
  }, []);

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--surface-main)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 font-mono shadow-lg"
          />
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
            }`}
          >
            All
          </button>
          {GLOSSARY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? `${cat.accentBg} ${cat.accentText} border ${cat.accentBorder}`
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* A-Z index */}
      <div className="flex flex-wrap justify-center gap-1">
        <button
          onClick={() => setActiveLetter(null)}
          className={`w-8 h-8 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
            activeLetter === null
              ? 'bg-cyan-500 text-black'
              : 'bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-cyan-400'
          }`}
        >
          ALL
        </button>
        {availableLetters.map(letter => (
          <button
            key={letter}
            onClick={() => setActiveLetter(letter)}
            className={`w-8 h-8 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              activeLetter === letter
                ? 'bg-cyan-500 text-black'
                : 'bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-cyan-400'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-center">
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
          Showing <strong className="text-cyan-400">{filteredTerms.length}</strong> of{' '}
          {GLOSSARY_TERMS.length} terms
        </span>
      </div>

      {/* Terms grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTerms.map(term => {
          const catInfo = GLOSSARY_CATEGORIES.find(c => c.id === term.category)!;
          return (
            <div
              key={term.id}
              className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg hover:border-cyan-500/40 transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${catInfo.accentBg} ${catInfo.accentText} border ${catInfo.accentBorder}`}
                >
                  {catInfo.label}
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 leading-tight">
                {term.term}
              </h3>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 flex-1">
                {term.definition}
              </p>

              {term.example && (
                <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] font-mono text-[10px] text-[var(--text-secondary)] leading-relaxed mb-3">
                  <span className="text-cyan-400">e.g.</span> {term.example}
                </div>
              )}

              {(term.relatedAlgorithms?.length || term.relatedTerms?.length) && (
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--border-main)]">
                  {term.relatedAlgorithms?.slice(0, 2).map(algoId => (
                    <Link
                      key={algoId}
                      to={`/learn/algorithms/${algoId}`}
                      className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    >
                      {algoId} <ArrowRight className="w-2 h-2" />
                    </Link>
                  ))}
                  {term.relatedLessons?.slice(0, 1).map(lessonId => (
                    <Link
                      key={lessonId}
                      to={`/learn/fundamentals/${lessonId}`}
                      className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors"
                    >
                      <BookOpen className="w-2 h-2" /> lesson
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] text-sm font-mono">
          No terms found matching your filter. Try a different search.
        </div>
      )}
    </div>
  );
}