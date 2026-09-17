import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AlgorithmDetail } from '../../data/algorithms';
import { Badge } from '../common/Badge';

interface AlgorithmCardProps {
  key?: any;
  algorithm: AlgorithmDetail;
  isExplored?: boolean;
}

export function AlgorithmCard({ algorithm, isExplored = false }: AlgorithmCardProps) {
  const categoryBadge = {
    classical: { label: 'Classical', variant: 'neutral' as const },
    modern: { label: 'Modern', variant: 'primary' as const },
    hashing: { label: 'Hashing', variant: 'accent' as const },
  }[algorithm.category];

  return (
    <div
      id={`algorithm-card-${algorithm.id}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 shadow-lg hover:shadow-xl transition-all duration-300 text-left"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={categoryBadge.variant} size="sm">
              {categoryBadge.label}
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
          {isExplored && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              EXPLORED
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors mb-1.5">
          {algorithm.name}
        </h3>
        <p className="text-xs font-mono font-medium text-cyan-400 mb-2">
          {algorithm.tagline}
        </p>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
          {algorithm.description}
        </p>

        <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] font-mono text-[11px] text-[var(--text-primary)] truncate mb-4">
          <span className="text-[var(--text-secondary)] mr-1.5">ENC:</span>
          {algorithm.formula.encryption}
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs">
        <Link
          to={`/learn/algorithms/${algorithm.id}`}
          className="text-[var(--text-primary)] hover:text-cyan-400 font-mono font-semibold transition-colors"
        >
          Details
        </Link>
        <Link
          to={algorithm.playgroundRoute}
          className="text-cyan-400 font-mono font-semibold flex items-center gap-1 hover:text-cyan-300"
        >
          Try <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}