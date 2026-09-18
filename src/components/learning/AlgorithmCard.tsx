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
   Category visual config
============================================================ */
const CATEGORY_CONFIG: Record<
  string,
  {
    label: string;
    badgeVariant: 'neutral' | 'primary' | 'accent' | 'success';
    icon: typeof Key;
    iconColor: string;
    ringColor: string;
    glowColor: string;
    tickColor: string;
    underlineColor: string;
    /** Button hover bg — LIGHT + colored, not dark */
    buttonHoverBg: string;
    /** Button hover text color */
    buttonHoverText: string;
    /** Button default bg (subtle) */
    buttonDefaultBg: string;
  }
> = {
  classical: {
    label: 'Classical',
    badgeVariant: 'neutral',
    icon: Key,
    iconColor: 'text-slate-200',
    ringColor: 'border-slate-400/30',
    glowColor: 'group-hover:shadow-[0_0_40px_-8px_rgba(148,163,184,0.4)]',
    tickColor: 'border-slate-400/40',
    underlineColor: 'bg-slate-400',
    buttonHoverBg: 'hover:bg-slate-500/20',
    buttonHoverText: 'group-hover/btn:text-slate-200',
    buttonDefaultBg: 'bg-slate-500/10',
  },
  modern: {
    label: 'Modern',
    badgeVariant: 'primary',
    icon: Lock,
    iconColor: 'text-cyan-400',
    ringColor: 'border-cyan-500/30',
    glowColor: 'group-hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.5)]',
    tickColor: 'border-cyan-500/40',
    underlineColor: 'bg-cyan-400',
    buttonHoverBg: 'hover:bg-cyan-500/20',
    buttonHoverText: 'group-hover/btn:text-cyan-300',
    buttonDefaultBg: 'bg-cyan-500/10',
  },
  hashing: {
    label: 'Hashing',
    badgeVariant: 'accent',
    icon: Fingerprint,
    iconColor: 'text-purple-400',
    ringColor: 'border-purple-500/30',
    glowColor: 'group-hover:shadow-[0_0_40px_-8px_rgba(168,85,247,0.5)]',
    tickColor: 'border-purple-500/40',
    underlineColor: 'bg-purple-400',
    buttonHoverBg: 'hover:bg-purple-500/20',
    buttonHoverText: 'group-hover/btn:text-purple-300',
    buttonDefaultBg: 'bg-purple-500/10',
  },
  encoding: {
    label: 'Encoding',
    badgeVariant: 'success',
    icon: Code2,
    iconColor: 'text-emerald-400',
    ringColor: 'border-emerald-500/30',
    glowColor: 'group-hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.5)]',
    tickColor: 'border-emerald-500/40',
    underlineColor: 'bg-emerald-400',
    buttonHoverBg: 'hover:bg-emerald-500/20',
    buttonHoverText: 'group-hover/btn:text-emerald-300',
    buttonDefaultBg: 'bg-emerald-500/10',
  },
};

/* ============================================================
   Formula extraction
============================================================ */
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

/* ============================================================
   Corner ticks
============================================================ */
function CornerTicks({ colorClass }: { colorClass: string }) {
  const base = `absolute w-3 h-3 border-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorClass}`;
  return (
    <>
      <span className={`${base} top-2 left-2 border-t-2 border-l-2 rounded-tl`} />
      <span className={`${base} top-2 right-2 border-t-2 border-r-2 rounded-tr`} />
      <span className={`${base} bottom-2 left-2 border-b-2 border-l-2 rounded-bl`} />
      <span className={`${base} bottom-2 right-2 border-b-2 border-r-2 rounded-br`} />
    </>
  );
}

/* ============================================================
   Main Card Component
============================================================ */
export function AlgorithmCard({ algorithm, isExplored = false }: AlgorithmCardProps) {
  const config = CATEGORY_CONFIG[algorithm.category] ?? CATEGORY_CONFIG.classical;
  const CategoryIcon = config.icon;
  const formulaPreview = extractFormulaPreview(algorithm);

  return (
    <div
      id={`algorithm-card-${algorithm.id}`}
      className={`group relative flex flex-col rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-[var(--text-secondary)]/30 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden ${config.glowColor}`}
    >
      {/* Corner ticks */}
      <CornerTicks colorClass={config.tickColor} />

      {/* Content */}
      <div className="flex-1 p-6 sm:p-7">
        {/* TOP SECTION */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-4">
            <div
              className={`absolute inset-0 rounded-2xl border ${config.ringColor} scale-125 opacity-60 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700`}
            />
            <div
              className={`relative w-14 h-14 rounded-2xl border ${config.ringColor} bg-[var(--surface-secondary)] flex items-center justify-center ${config.iconColor} group-hover:scale-110 transition-transform duration-300`}
            >
              <CategoryIcon className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>

          {isExplored && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Explored
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
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
          </div>

          <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors leading-tight mb-2">
            {algorithm.name}
          </h3>

          <div className="flex items-center justify-center gap-1 mb-3">
            <span className={`h-0.5 w-8 ${config.underlineColor} rounded-full`} />
            <span className={`h-0.5 w-2 ${config.underlineColor} rounded-full opacity-60`} />
            <span className={`h-0.5 w-1 ${config.underlineColor} rounded-full opacity-30`} />
          </div>

          <p className="text-xs font-mono font-medium text-cyan-400 leading-relaxed line-clamp-2 mb-3">
            {algorithm.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-5 text-center">
          {algorithm.description}
        </p>

        {/* Formula — Mini terminal */}
        <div className="relative rounded-lg bg-[#0A0C10] border border-[#1E222B] overflow-hidden mb-5">
          <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            <span className="ml-2 text-[9px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
              formula
            </span>
          </div>
          <div className="px-3 pb-2.5 font-mono text-[11px] text-cyan-300 leading-relaxed flex items-start gap-1.5">
            <span className="text-cyan-500/60 shrink-0 select-none">$</span>
            <span className="truncate">{formulaPreview}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-[var(--text-secondary)]">
          <span>{algorithm.estimatedMinutes} min read</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
          <span>{algorithm.sections.length} sections</span>
        </div>
      </div>

      {/* ============================================================
          FOOTER — Review button
          Default: subtle colored bg (10% opacity)
          Hover: stronger colored bg (20% opacity) + text glow
      ============================================================ */}
      <Link
        to={`/learn/algorithms/${algorithm.id}`}
        className={`group/btn relative flex items-center justify-center gap-2 px-6 py-4 border-t border-[var(--border-main)] transition-all duration-300 ${config.buttonDefaultBg} ${config.buttonHoverBg}`}
      >
        {/* Animated arrow indicator */}
        <span
          className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-primary)] ${config.buttonHoverText} transition-colors`}
        >
          Review Algorithm
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  );
}