import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Key,
  Lock,
  Fingerprint,
  Code2,
} from 'lucide-react';
import { AlgorithmDetail } from '../../data/algorithms';
import { Badge } from '../common/Badge';

interface AlgorithmCardProps {
  key?: any;
  algorithm: AlgorithmDetail;
  isExplored?: boolean;
}

/* ============================================================
   Category-specific visual config
============================================================ */
const CATEGORY_CONFIG: Record<
  string,
  {
    label: string;
    badgeVariant: 'neutral' | 'primary' | 'accent' | 'success';
    icon: typeof Key;
    iconText: string;
    iconBg: string;
    iconBorder: string;
    accentBar: string;
  }
> = {
  classical: {
    label: 'Classical',
    badgeVariant: 'neutral',
    icon: Key,
    iconText: 'text-slate-300',
    iconBg: 'bg-slate-500/10',
    iconBorder: 'border-slate-500/30',
    accentBar: 'bg-slate-400',
  },
  modern: {
    label: 'Modern',
    badgeVariant: 'primary',
    icon: Lock,
    iconText: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    iconBorder: 'border-cyan-500/30',
    accentBar: 'bg-cyan-400',
  },
  hashing: {
    label: 'Hashing',
    badgeVariant: 'accent',
    icon: Fingerprint,
    iconText: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    iconBorder: 'border-purple-500/30',
    accentBar: 'bg-purple-400',
  },
  encoding: {
    label: 'Encoding',
    badgeVariant: 'success',
    icon: Code2,
    iconText: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/30',
    accentBar: 'bg-emerald-400',
  },
};

/**
 * Extract a short formula preview from the algorithm's sections.
 * Looks for the "formula" section and pulls the first bold line
 * containing "=" or "→". Falls back to tagline if not found.
 */
function extractFormulaPreview(algorithm: AlgorithmDetail): string {
  const formulaSection = algorithm.sections.find(s => s.id === 'formula');
  if (!formulaSection) return algorithm.tagline;

  const lines = formulaSection.content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('**') &&
      trimmed.endsWith('**') &&
      (trimmed.includes('=') || trimmed.includes('→'))
    ) {
      return trimmed.replace(/\*\*/g, '').trim();
    }
  }

  const firstLine = lines.find(l => l.trim().length > 0);
  return firstLine?.replace(/\*\*/g, '').trim() || algorithm.tagline;
}

export function AlgorithmCard({ algorithm, isExplored = false }: AlgorithmCardProps) {
  const config =
    CATEGORY_CONFIG[algorithm.category] ?? CATEGORY_CONFIG.classical;
  const CategoryIcon = config.icon;
  const formulaPreview = extractFormulaPreview(algorithm);

  return (
    <div
      id={`algorithm-card-${algorithm.id}`}
      className="group relative flex flex-col rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Category accent bar (left edge) */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentBar} opacity-70 group-hover:opacity-100 transition-opacity`}
      />

      {/* Content */}
      <div className="flex-1 p-6 sm:p-7 pl-7 sm:pl-8">
        {/* Top row: icon + badges */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div
            className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${config.iconBg} ${config.iconBorder} ${config.iconText} group-hover:scale-105 transition-transform duration-300`}
          >
            <CategoryIcon className="w-5 h-5" strokeWidth={2.5} />
          </div>

          {isExplored && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              EXPLORED
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={config.badgeVariant} size="sm">
            {config.label}
          </Badge>
          <Badge
            variant={
              algorithm.difficulty === 'beginner'
                ? 'success'
                : algorithm.difficulty === 'intermediate'
                ? 'primary'
                : 'warning'
            }
            size="sm"
          >
            {algorithm.difficulty}
          </Badge>
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">
            {algorithm.estimatedMinutes} min
          </span>
        </div>

        {/* Title + tagline */}
        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors mb-1.5 leading-tight">
          {algorithm.name}
        </h3>
        <p className="text-xs font-mono font-medium text-cyan-400 mb-3 leading-relaxed line-clamp-2">
          {algorithm.tagline}
        </p>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-5">
          {algorithm.description}
        </p>

        {/* Formula preview */}
        <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] font-mono text-[11px] text-[var(--text-primary)] truncate">
          <span className="text-[var(--text-secondary)] mr-1.5 uppercase text-[10px] tracking-wider">
            Formula:
          </span>
          {formulaPreview}
        </div>
      </div>

      {/* Review button (full-width footer) */}
      <Link
        to={`/learn/algorithms/${algorithm.id}`}
        className="group/btn flex items-center justify-between gap-2 px-6 sm:px-7 py-3.5 border-t border-[var(--border-main)] bg-[var(--surface-secondary)] hover:bg-cyan-500/10 transition-colors text-sm font-mono font-semibold text-[var(--text-primary)] hover:text-cyan-400"
      >
        <span>Review Algorithm</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}