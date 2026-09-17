import { Link } from 'react-router-dom';
import { ROADMAP_LEVELS } from '../../data/roadmap';
import { useProgress } from '../../hooks/useProgress';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Zap,
  Shield,
  Key,
  Fingerprint,
  Terminal,
  Share2,
} from 'lucide-react';
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
      return { status: `In Progress (${completedCount}/${requiredLessonIds.length})`, color: 'primary' as const };
    }
    return { status: 'Available', color: 'neutral' as const };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          Interactive Learning Path
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          7-Level Cryptography Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          A structured, non-overwhelming step-by-step path from fundamental definitions to advanced asymmetric key exchange and cryptanalysis attacks.
        </p>
      </div>

      {/* Roadmap Tree Container */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:hidden sm:before:block">
        {ROADMAP_LEVELS.map((level, idx) => {
          const { status, color } = getLevelStatus(level.requiredLessonIds);
          const isCompleted = status === 'Completed';

          return (
            <div
              key={level.levelCode}
              id={`roadmap-node-${level.levelNumber}`}
              className="relative flex flex-col sm:flex-row items-start gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Level Indicator Pill / Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm z-10 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span className="font-mono">0{level.levelNumber}</span>
                )}
              </div>

              {/* Content Body */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">
                      {level.levelCode}
                    </span>
                    <Badge variant={color} size="sm">
                      {status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {level.estimatedTime}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      +{level.xpReward} XP
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {level.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {level.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {level.description}
                </p>

                {/* Objectives */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Core Learning Objectives:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {level.objectives.map((obj, oIdx) => (
                      <li key={oIdx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-sky-500 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Featured: {level.algorithms.join(', ')}
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
