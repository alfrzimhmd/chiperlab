import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LESSONS } from '../../data/lessons';
import { useProgress } from '../../hooks/useProgress';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Check,
  AlertCircle,
  Code2,
} from 'lucide-react';

export function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLessonCompleted, completeLesson } = useProgress();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [exerciseFeedback, setExerciseFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const lesson = LESSONS.find(l => l.id === id || l.slug === id);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Lesson Not Found</h1>
        <p className="text-sm text-slate-500">The lesson you requested does not exist or has moved.</p>
        <Link to="/learn/fundamentals" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline text-sm">
          Return to All Fundamentals
        </Link>
      </div>
    );
  }

  const isCompleted = isLessonCompleted(lesson.id);

  // Find previous and next lessons
  const currentIndex = LESSONS.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const handleOptionSelect = (index: number, optionText: string) => {
    setSelectedOption(index);
    if (lesson.interactiveExercise) {
      if (optionText === lesson.interactiveExercise.correctAnswer) {
        setExerciseFeedback('correct');
        completeLesson(lesson.id, lesson.xpReward);
      } else {
        setExerciseFeedback('incorrect');
      }
    }
  };

  const handleMarkComplete = () => {
    completeLesson(lesson.id, lesson.xpReward);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/learn/fundamentals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to 12 Fundamentals
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lesson Completed
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkComplete}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Mark Completed (+{lesson.xpReward} XP)
            </Button>
          )}
        </div>
      </div>

      {/* Lesson Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800/80">
              Module #{String(lesson.order).padStart(2, '0')}
            </span>
            <Badge
              variant={
                lesson.difficulty === 'beginner'
                  ? 'success'
                  : lesson.difficulty === 'intermediate'
                  ? 'primary'
                  : 'warning'
              }
              size="sm"
            >
              {lesson.difficulty}
            </Badge>
            <Badge variant="neutral" size="sm">
              {lesson.category}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lesson.estimatedMinutes} min read
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {lesson.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {lesson.description}
        </p>

        {/* Tags if available */}
        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {lesson.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lesson Body: Sections */}
      <div className="space-y-6">
        {lesson.sections.map((section, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              {section.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>

            {/* Key bullet points if present */}
            {section.keyPoints && section.keyPoints.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-sky-600 dark:text-sky-400 block">
                  Core Highlights
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {section.keyPoints.map((kp, kIdx) => (
                    <li key={kIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Code Snippet if present */}
            {section.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-sky-400" />
                    {section.codeSnippet.caption || 'Code Demonstration'}
                  </span>
                  <span className="text-[10px] uppercase">{section.codeSnippet.language}</span>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-400 leading-relaxed">
                  <code>{section.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {section.callout && (
              <div
                className={`p-4 rounded-xl text-xs leading-relaxed border ${
                  section.callout.type === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200'
                    : section.callout.type === 'tip'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200'
                    : 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800/70 text-sky-900 dark:text-sky-200'
                }`}
              >
                <span className="font-bold block mb-0.5">{section.callout.title}</span>
                {section.callout.content}
              </div>
            )}

            {section.example && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">
                  Practical Example
                </span>
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {section.example}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Takeaways Card */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 dark:from-slate-900 dark:to-sky-950/30 border border-sky-100 dark:border-sky-900/50 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Key Concept Takeaways
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Concept Check Exercise */}
      {lesson.interactiveExercise && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Concept Check: {lesson.interactiveExercise.question}
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lesson.interactiveExercise.instruction}
          </p>

          <div className="space-y-2">
            {lesson.interactiveExercise.options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(idx, option)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-150 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? exerciseFeedback === 'correct'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-100 font-semibold'
                        : 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-100'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && (
                    <span>
                      {exerciseFeedback === 'correct' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {exerciseFeedback && (
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed animate-in fade-in duration-150 ${
                exerciseFeedback === 'correct'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <span className="font-bold block mb-0.5">
                {exerciseFeedback === 'correct' ? 'Correct! Well done.' : 'Not quite right. Try again!'}
              </span>
              {lesson.interactiveExercise.explanation}
            </div>
          )}
        </div>
      )}

      {/* Bottom Previous / Next Lesson Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => {
              setSelectedOption(null);
              setExerciseFeedback(null);
              navigate(`/learn/fundamentals/${prevLesson.id}`);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous:</span> {prevLesson.title}
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            type="button"
            onClick={() => {
              setSelectedOption(null);
              setExerciseFeedback(null);
              navigate(`/learn/fundamentals/${nextLesson.id}`);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer ml-auto"
          >
            <span className="hidden sm:inline">Next:</span> {nextLesson.title}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to="/learn/algorithms"
            className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer ml-auto"
          >
            Next: Cryptographic Algorithms
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
