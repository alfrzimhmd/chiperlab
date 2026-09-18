import { BookOpen, ExternalLink, FileText, Package, GraduationCap } from 'lucide-react';
import { LessonReference } from '../../types/lesson';

interface ReferencesCardProps {
  references: LessonReference[];
}

const TYPE_CONFIG: Record<
  LessonReference['type'],
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

export function ReferencesCard({ references }: ReferencesCardProps) {
  if (!references || references.length === 0) return null;

  return (
    <section className="relative">
      {/* Section header — di luar card, seperti judul section lain */}
      <div className="mb-4">
        <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} />
          REFERENCES
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
          Sources & Further Reading
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
          {references.length} source{references.length > 1 ? 's' : ''} referenced for this
          lesson. Content is paraphrased for educational clarity — no verbatim copying.
        </p>
      </div>

      {/* References grid — di dalam card dengan gradient border */}
      <div className="p-[1px] rounded-2xl bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-transparent">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {references.map((ref, idx) => {
              const config = TYPE_CONFIG[ref.type];
              const TypeIcon = config.Icon;

              const content = (
                <div className="flex items-start gap-3.5 h-full">
                  {/* Type icon container */}
                  <div
                    className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${config.bg} ${config.border} ${config.text} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <TypeIcon className="w-5 h-5" strokeWidth={2.5} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Badge + external link */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.bg} ${config.border} ${config.text}`}
                      >
                        {config.label}
                      </span>
                      {ref.url && (
                        <ExternalLink className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-cyan-400 transition-colors" />
                      )}
                    </div>

                    {/* Title */}
                    <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-cyan-400 transition-colors">
                      {ref.title}
                    </p>

                    {/* Author / Year */}
                    {(ref.author || ref.year) && (
                      <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-1.5">
                        {ref.author}
                        {ref.author && ref.year && ' · '}
                        {ref.year}
                      </p>
                    )}
                  </div>
                </div>
              );

              if (ref.url) {
                return (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] hover:border-cyan-500/40 hover:bg-[var(--surface-main)] transition-all duration-200 h-full"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] h-full"
                >
                  {content}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-[var(--border-main)] flex items-start gap-2">
            <div className="shrink-0 w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mt-0.5">
              <BookOpen className="w-3 h-3" strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-mono text-[var(--text-secondary)] leading-relaxed">
              All ChiperLab content is{' '}
              <strong className="text-[var(--text-primary)]">original educational material</strong>{' '}
              written in our own words. The sources above were used as references for
              accuracy and technical foundations — not copied verbatim.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}