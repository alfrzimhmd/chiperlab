import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ArrowRight,
  Hash,
  ArrowDownUp,
  BookOpen,
  ExternalLink,
  FileText,
  Package,
  GraduationCap,
} from 'lucide-react';
import {
  TIMELINE_ERAS,
  TIMELINE_EVENTS,
  TIMELINE_REFERENCES,
} from '../../data/timeline';
import type { TimelineEra } from '../../types/encyclopedia';

interface TimelineViewProps {
  onTermClick?: (termId: string) => void;
}

type SortOrder = 'newest' | 'oldest';

/* ============================================================
   Reference type config (mirrors AlgorithmDetail styling)
============================================================ */
const REF_TYPE_CONFIG: Record<
  string,
  { label: string; text: string; bg: string; border: string; Icon: typeof FileText }
> = {
  standard: {
    label: 'Standard',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    Icon: Package,
  },
  paper: {
    label: 'Paper',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    Icon: FileText,
  },
  book: {
    label: 'Book',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    Icon: BookOpen,
  },
  article: {
    label: 'Article',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    Icon: FileText,
  },
  documentation: {
    label: 'Docs',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    Icon: GraduationCap,
  },
};

export function TimelineView({ onTermClick }: TimelineViewProps) {
  const [activeEra, setActiveEra] = useState<'all' | TimelineEra>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('oldest');

  /* ------------------------------------------------------------
     Filter + sort events
  ------------------------------------------------------------ */
  const sortedEvents = useMemo(() => {
    const filtered =
      activeEra === 'all'
        ? TIMELINE_EVENTS
        : TIMELINE_EVENTS.filter(e => e.era === activeEra);

    return [...filtered].sort((a, b) =>
      sortOrder === 'oldest' ? a.year - b.year : b.year - a.year
    );
  }, [activeEra, sortOrder]);

  return (
    <div className="space-y-8">
      {/* ============================================================
          FILTER BAR — Era tabs + Sort button
      ============================================================ */}
      <div className="flex flex-col gap-3">
        {/* Era filter */}
        <div className="flex justify-center">
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg justify-center">
            <button
              onClick={() => setActiveEra('all')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                activeEra === 'all'
                  ? 'bg-cyan-500 text-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              All Eras
            </button>
            {TIMELINE_ERAS.map(era => (
              <button
                key={era.id}
                onClick={() => setActiveEra(era.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  activeEra === era.id
                    ? `${era.accentBg} ${era.accentText} border ${era.accentBorder}`
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
                }`}
              >
                {era.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort control */}
        <div className="flex justify-center">
          <button
            onClick={() =>
              setSortOrder(prev => (prev === 'oldest' ? 'newest' : 'oldest'))
            }
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-cyan-400 transition-colors cursor-pointer shadow-lg"
            title="Toggle sort order"
          >
            <ArrowDownUp className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="uppercase tracking-wider">Sort:</span>
            <span className="text-cyan-400 font-bold">
              {sortOrder === 'oldest' ? 'Oldest → Newest' : 'Newest → Oldest'}
            </span>
          </button>
        </div>
      </div>

      {/* Era intro (when specific era selected) */}
      {activeEra !== 'all' && (
        <div
          className={`p-5 rounded-2xl ${TIMELINE_ERAS.find(e => e.id === activeEra)?.accentBg} border ${TIMELINE_ERAS.find(e => e.id === activeEra)?.accentBorder}`}
        >
          {(() => {
            const era = TIMELINE_ERAS.find(e => e.id === activeEra)!;
            return (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${era.accentText}`}>
                    {era.period}
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-1.5 ${era.accentText}`}>
                  {era.label}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {era.description}
                </p>
              </>
            );
          })()}
        </div>
      )}

      {/* Timeline events */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border-main)] to-transparent" />

        <div className="space-y-5">
          {sortedEvents.map(event => {
            const era = TIMELINE_ERAS.find(e => e.id === event.era)!;

            return (
              <div key={event.id} className="relative flex gap-5 sm:gap-6">
                {/* Dot + era icon */}
                <div className="relative flex flex-col items-center shrink-0 z-10">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${era.accentBg} border-2 ${era.accentBorder} flex items-center justify-center`}
                  >
                    <Calendar
                      className={`w-5 h-5 ${era.accentText}`}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                {/* Event card */}
                <div className="flex-1 p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg hover:border-cyan-500/40 transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${era.accentBg} ${era.accentText} border ${era.accentBorder}`}
                    >
                      {event.yearLabel}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                      {era.label}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[var(--text-primary)] mb-2 leading-tight">
                    {event.title}
                  </h4>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                    {event.description}
                  </p>

                  {/* People */}
                  {event.people && event.people.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Users className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                        {event.people.join(' · ')}
                      </span>
                    </div>
                  )}

                  {/* Related algorithms */}
                  {event.relatedAlgorithms && event.relatedAlgorithms.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-3 mt-3 border-t border-[var(--border-main)]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
                        Related:
                      </span>
                      {event.relatedAlgorithms.map(algoId => (
                        <Link
                          key={algoId}
                          to={`/learn/algorithms/${algoId}`}
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                        >
                          {algoId} <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Related terms */}
                  {event.relatedTerms && event.relatedTerms.length > 0 && onTermClick && (
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      <Hash className="w-3 h-3 text-[var(--text-secondary)]" />
                      {event.relatedTerms.map(termId => (
                        <button
                          key={termId}
                          onClick={() => onTermClick(termId)}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors cursor-pointer"
                        >
                          {termId}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {sortedEvents.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] text-sm font-mono">
          No events found for this era.
        </div>
      )}

      {/* ============================================================
          MASTER REFERENCES SECTION (at the very bottom)
      ============================================================ */}
      <div className="pt-8 border-t border-[var(--border-main)]">
        <div className="text-center space-y-2 mb-6">
          <span className="font-mono text-xs font-bold text-amber-400 tracking-widest block">
            SOURCES & REFERENCES
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Historical Sources
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-2xl mx-auto">
            All timeline events are drawn from the following primary sources — books,
            peer-reviewed papers, NIST standards, and IETF RFCs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {TIMELINE_REFERENCES.map(ref => {
            const config =
              REF_TYPE_CONFIG[ref.type] || REF_TYPE_CONFIG.documentation;
            const TypeIcon = config.Icon;

            const inner = (
              <div className="flex items-start gap-3">
                <div
                  className={`shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${config.bg} ${config.border} ${config.text}`}
                >
                  <TypeIcon className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[var(--text-primary)] leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 mb-1">
                    {ref.title}
                  </p>
                  {ref.author && (
                    <p className="text-[10px] font-mono text-[var(--text-secondary)] leading-snug truncate">
                      {ref.author}
                      {ref.year && ` · ${ref.year}`}
                    </p>
                  )}
                </div>
                {ref.url && (
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
                )}
              </div>
            );

            if (ref.url) {
              return (
                <a
                  key={ref.id}
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block p-3.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 transition-colors shadow-lg"
                >
                  {inner}
                </a>
              );
            }

            return (
              <div
                key={ref.id}
                className="p-3.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg"
              >
                {inner}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono text-[var(--text-secondary)] italic">
            {TIMELINE_REFERENCES.length} sources · Content paraphrased for educational clarity.
          </p>
        </div>
      </div>
    </div>
  );
}