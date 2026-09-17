import { Link } from 'react-router-dom';
import { ROADMAP_LEVELS } from '../../data/roadmap';
import { useProgress } from '../../hooks/useProgress';
import { Compass, CheckCircle2, ArrowRight, Clock, Zap } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export function RoadmapPage() {
  const { progress } = useProgress();

  const getLevelStatus = (requiredLessonIds: string[]) => {
    const completedCount = requiredLessonIds.filter(id =>
      progress.completedLessons.includes(id)
    ).length;

    if (completedCount === requiredLessonIds.length) {
      return { status: 'Completed', color: 'success' as const };
    }
    if (completedCount > 0) {
      return {
        status: `In Progress (${completedCount}/${requiredLessonIds.length})`,
        color: 'primary' as const,
      };
    }
    return { status: 'Available', color: 'neutral' as const };
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Compass className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Interactive Learning Path
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          7-Level Cryptography Roadmap
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          A structured, non-overwhelming step-by-step path from fundamental definitions to
          advanced asymmetric key exchange and cryptanalysis attacks.
        </p>
      </div>

      {/* Roadmap Tree */}
      <div className="relative space-y-5 before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-[var(--border-main)] before:hidden sm:before:block">
        {ROADMAP_LEVELS.map(level => {
          const { status, color } = getLevelStatus(level.requiredLessonIds);
          const isCompleted = status === 'Completed';

          return (
            <div
              key={level.levelCode}
              id={`roadmap-node-${level.levelNumber}`}
              className="relative flex flex-col sm:flex-row items-start gap-5 p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Level Indicator */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm z-10 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border-main)]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span className="font-mono">
                    {String(level.levelNumber).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
                      {level.levelCode}
                    </span>
                    <Badge variant={color} size="sm">
                      {status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {level.estimatedTime}
                    </span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-400" />
                      +{level.xpReward} XP
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    {level.title}
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
                    {level.subtitle}
                  </p>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {level.description}
                </p>

                {/* Objectives */}
                <div className="space-y-2 pt-3 border-t border-[var(--border-main)]">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                    Core Learning Objectives
                  </span>
                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    {level.objectives.map((obj, oIdx) => (
                      <li key={oIdx} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="pt-3 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {level.algorithms.join(' · ')}
                  </span>
                  <Link to={level.route}>
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'primary'}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                    >
                      {isCompleted ? 'Review Level' : 'Enter Level'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}