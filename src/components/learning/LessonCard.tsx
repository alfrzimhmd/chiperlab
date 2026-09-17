import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Lesson } from '../../types/lesson';
import { Badge } from '../common/Badge';

interface LessonCardProps {
  key?: any;
  lesson: Lesson;
  isCompleted?: boolean;
}

export function LessonCard({ lesson, isCompleted = false }: LessonCardProps) {
  const difficultyVariant =
    lesson.difficulty === 'beginner'
      ? 'success'
      : lesson.difficulty === 'intermediate'
      ? 'primary'
      : 'warning';

  return (
    <Link
      to={`/learn/fundamentals/${lesson.id}`}
      id={`lesson-card-${lesson.id}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] hover:border-cyan-500/40 shadow-lg hover:shadow-xl transition-all duration-300 text-left"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">
              #{String(lesson.order).padStart(2, '0')}
            </span>
            <Badge variant={difficultyVariant} size="sm">
              {lesson.difficulty}
            </Badge>
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              DONE
            </span>
          ) : (
            <span className="text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.estimatedMinutes}m
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors mb-2">
          {lesson.title}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
          {lesson.description}
        </p>
      </div>

      <div className="pt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs">
        <span className="text-amber-400 font-mono font-semibold flex items-center gap-1">
          <Zap className="w-3 h-3 fill-amber-400" />
          +{lesson.xpReward} XP
        </span>
        <span className="text-cyan-400 font-mono font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          {isCompleted ? 'Review' : 'Start'} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}