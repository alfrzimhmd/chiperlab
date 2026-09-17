import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
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
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/80 shadow-xs hover:shadow-md transition-all duration-200 text-left"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
              #{String(lesson.order).padStart(2, '0')}
            </span>
            <Badge variant={difficultyVariant} size="sm">
              {lesson.difficulty}
            </Badge>
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.estimatedMinutes}m
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-1.5">
          {lesson.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {lesson.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-amber-600 dark:text-amber-400 font-semibold">
          +{lesson.xpReward} XP
        </span>
        <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          {isCompleted ? 'Review Lesson' : 'Start Lesson'} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
