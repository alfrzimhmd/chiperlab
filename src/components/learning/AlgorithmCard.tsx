import { Link } from 'react-router-dom';
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
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
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all duration-200 text-left"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
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
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Explored
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-1">
          {algorithm.name}
        </h3>
        <p className="text-xs font-medium text-sky-600 dark:text-sky-400 mb-2">
          {algorithm.tagline}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {algorithm.description}
        </p>

        {/* Formula preview */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate mb-4">
          <span className="text-slate-400 dark:text-slate-500 mr-1.5">ENC:</span>
          {algorithm.formula.encryption}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <Link
          to={`/learn/algorithms/${algorithm.id}`}
          className="text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-semibold"
        >
          Algorithm Details
        </Link>
        <Link
          to={algorithm.playgroundRoute}
          className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 hover:underline"
        >
          Try in Playground <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
