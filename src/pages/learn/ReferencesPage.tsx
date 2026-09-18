import { Link } from 'react-router-dom';
import {
  BookOpen,
  ExternalLink,
  ArrowLeft,
  FileText,
  Package,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { REFERENCES_GROUPS } from '../../data/references';

const TYPE_ICONS = {
  standard: Package,
  paper: FileText,
  book: BookOpen,
  article: FileText,
  documentation: GraduationCap,
};

const TYPE_COLORS = {
  standard: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  paper: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  book: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  article: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  documentation: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
};

export function ReferencesPage() {
  const totalItems = REFERENCES_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <div className="space-y-5">
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to About
        </Link>

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase text-[11px] font-medium">
              Academic References
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
            Sources & Further Reading
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            ChiperLab lesson content is written based on these authoritative sources.
            All material is <strong className="text-[var(--text-primary)]">paraphrased for educational clarity</strong>{' '}
            — no verbatim copying.
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)]">
              <span className="text-xs font-mono text-[var(--text-secondary)]">Total</span>
              <span className="text-sm font-bold text-cyan-400">{totalItems}</span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">sources</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)]">
              <span className="text-xs font-mono text-[var(--text-secondary)]">Categories</span>
              <span className="text-sm font-bold text-cyan-400">{REFERENCES_GROUPS.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          REFERENCES GROUPS
      ============================================================ */}
      {REFERENCES_GROUPS.map(group => {
        const Icon = TYPE_ICONS[group.type];
        const color = TYPE_COLORS[group.type];

        return (
          <section key={group.title} className="space-y-5">
            {/* Group header */}
            <div className="flex items-start gap-3">
              <div
                className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${color.bg} ${color.border} ${color.text}`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    {group.title}
                  </h2>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${color.bg} ${color.border} ${color.text}`}
                  >
                    {group.items.length} items
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {group.description}
                </p>
              </div>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.items.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-4 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 shadow-sm hover:shadow-lg transition-all duration-200 flex items-start gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors leading-snug">
                      {ref.title}
                    </p>
                    {(ref.author || ref.year) && (
                      <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-1.5">
                        {ref.author}
                        {ref.author && ref.year && ' · '}
                        {ref.year}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </section>
        );
      })}

      {/* ============================================================
          CLOSING NOTE
      ============================================================ */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 border border-cyan-500/20 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto">
          <BookOpen className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          Open Educational Content
        </h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          ChiperLab content is <strong className="text-[var(--text-primary)]">original educational material</strong>{' '}
          written in our own words. The sources above were used as references
          for accuracy and technical foundations — not copied verbatim.
        </p>
        <Link
          to="/learn/fundamentals"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors pt-1"
        >
          Back to Learning Fundamentals →
        </Link>
      </div>
    </div>
  );
}