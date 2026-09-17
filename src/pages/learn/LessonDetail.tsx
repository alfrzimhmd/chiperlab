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
  Zap,
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
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Lesson Not Found</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          The lesson you requested does not exist or has moved.
        </p>
        <Link
          to="/learn/fundamentals"
          className="text-cyan-400 font-mono font-semibold hover:underline text-sm"
        >
          Return to All Fundamentals
        </Link>
      </div>
    );
  }

  const isCompleted = isLessonCompleted(lesson.id);

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
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/learn/fundamentals"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to 12 Fundamentals
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              COMPLETED
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
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              MODULE #{String(lesson.order).padStart(2, '0')}
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

          <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lesson.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {lesson.title}
        </h1>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          {lesson.description}
        </p>

        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {lesson.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[var(--text-secondary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lesson Body: Sections */}
      <div className="space-y-5">
        {lesson.sections.map((section, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4"
          >
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              {section.title}
            </h2>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {section.content}
            </p>

            {section.keyPoints && section.keyPoints.length > 0 && (
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2.5">
                <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-cyan-400 block">
                  Core Highlights
                </span>
                <ul className="space-y-2 text-xs text-[var(--text-primary)]">
                  {section.keyPoints.map((kp, kIdx) => (
                    <li key={kIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-[var(--border-main)] bg-[#0A0C10]">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E222B] bg-[#12151B] text-xs font-mono text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Code2 className="w-3.5 h-3.5" />
                    {section.codeSnippet.caption || 'Code Demonstration'}
                  </span>
                  <span className="text-[10px] uppercase text-[var(--text-secondary)]">
                    {section.codeSnippet.language}
                  </span>
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
                    ? 'bg-amber-500/10 border-amber-500/30 text-[var(--text-primary)]'
                    : section.callout.type === 'tip'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-[var(--text-primary)]'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-[var(--text-primary)]'
                }`}
              >
                <span
                  className={`font-mono font-bold block mb-1 text-[11px] uppercase tracking-wider ${
                    section.callout.type === 'warning'
                      ? 'text-amber-400'
                      : section.callout.type === 'tip'
                      ? 'text-emerald-400'
                      : 'text-cyan-400'
                  }`}
                >
                  {section.callout.title}
                </span>
                <span className="text-[var(--text-secondary)]">
                  {section.callout.content}
                </span>
              </div>
            )}

            {section.example && (
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-[var(--text-secondary)] block tracking-wider">
                  Practical Example
                </span>
                <p className="text-xs font-mono text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {section.example}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Takeaways */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-amber-500/30 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Key Concept Takeaways
          </h3>
          <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Exercise */}
      {lesson.interactiveExercise && (
        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border-2 border-cyan-500/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Concept Check
            </h3>
          </div>

          <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium">
            {lesson.interactiveExercise.question}
          </p>

          <p className="text-xs font-mono text-[var(--text-secondary)]">
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
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-150 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? exerciseFeedback === 'correct'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-[var(--text-primary)] font-semibold'
                        : 'bg-rose-500/10 border-rose-500/50 text-[var(--text-primary)]'
                      : 'bg-[var(--surface-secondary)] border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="leading-relaxed">{option}</span>
                  {isSelected && (
                    <span className="shrink-0 ml-2">
                      {exerciseFeedback === 'correct' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {exerciseFeedback && (
            <div
              className={`p-4 rounded-xl text-xs leading-relaxed animate-in fade-in duration-150 border ${
                exerciseFeedback === 'correct'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <span
                className={`font-mono font-bold block mb-1 text-[11px] uppercase tracking-wider ${
                  exerciseFeedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {exerciseFeedback === 'correct' ? 'Correct! Well done.' : 'Not quite right. Try again!'}
              </span>
              <span className="text-[var(--text-secondary)]">
                {lesson.interactiveExercise.explanation}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="pt-6 border-t border-[var(--border-main)] flex items-center justify-between gap-4 flex-wrap">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => {
              setSelectedOption(null);
              setExerciseFeedback(null);
              navigate(`/learn/fundamentals/${prevLesson.id}`);
            }}
            className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 cursor-pointer transition-colors"
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
            className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer ml-auto transition-colors"
          >
            <span className="hidden sm:inline">Next:</span> {nextLesson.title}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to="/learn/algorithms"
            className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 ml-auto transition-colors"
          >
            Next: Cryptographic Algorithms
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}