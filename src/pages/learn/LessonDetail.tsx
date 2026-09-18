import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LESSONS } from '../../data/lessons';
import { useProgress } from '../../hooks/useProgress';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ReferencesCard } from '../../components/lesson/ReferencesCard';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  Check,
  AlertCircle,
  Code2,
  Zap,
} from 'lucide-react';

/* ============================================================
   TYPES
============================================================ */
interface LessonSectionShape {
  id: string;
  title: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  keyPoints?: string[];
  callout?: {
    type: 'tip' | 'warning' | 'info';
    title: string;
    content: string;
  };
  example?: string;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isLessonCompleted,
    completeLesson,
    saveExerciseAnswer,
    getExerciseAnswer,
  } = useProgress();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [exerciseFeedback, setExerciseFeedback] = useState<'correct' | 'incorrect' | null>(
    null
  );
  const [textAnswer, setTextAnswer] = useState<string>('');

  const lesson = LESSONS.find(l => l.id === id || l.slug === id);

  /**
   * Reset + load saved answer.
   * CRITICAL: This effect must run whenever `id` changes (lesson switch).
   * We reset ALL state first, then load saved answer if any.
   * This prevents stale state from previous lesson leaking in and causing crashes.
   */
  useEffect(() => {
    // Always reset first — critical for lesson switching
    setSelectedOption(null);
    setExerciseFeedback(null);
    setTextAnswer('');

    // If no lesson or no exercise, nothing more to do
    if (!lesson?.interactiveExercise) return;

    // Try to restore saved answer
    const saved = getExerciseAnswer(lesson.id);
    if (saved) {
      if (typeof saved.answer === 'number') {
        setSelectedOption(saved.answer);
      } else {
        setTextAnswer(String(saved.answer));
      }
      setExerciseFeedback(saved.isCorrect ? 'correct' : 'incorrect');
    }
  }, [id, lesson?.id, lesson?.interactiveExercise, getExerciseAnswer]);

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
  const nextLesson =
    currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const handleOptionSelect = (index: number, optionText: string) => {
    if (!lesson.interactiveExercise) return;
    const isCorrect = optionText === lesson.interactiveExercise.correctAnswer;

    setSelectedOption(index);
    setExerciseFeedback(isCorrect ? 'correct' : 'incorrect');
    saveExerciseAnswer(lesson.id, index, isCorrect);

    if (isCorrect) {
      completeLesson(lesson.id, lesson.xpReward, lesson.title);
    }
  };

  const handleTextSubmit = () => {
    if (!lesson.interactiveExercise || !textAnswer.trim()) return;
    const normalizedAnswer = textAnswer.trim();
    const isCorrect =
      normalizedAnswer.toLowerCase() ===
      lesson.interactiveExercise.correctAnswer.trim().toLowerCase();

    setExerciseFeedback(isCorrect ? 'correct' : 'incorrect');
    saveExerciseAnswer(lesson.id, normalizedAnswer, isCorrect);

    if (isCorrect) {
      completeLesson(lesson.id, lesson.xpReward, lesson.title);
    }
  };

  const handleMarkComplete = () => {
    completeLesson(lesson.id, lesson.xpReward, lesson.title);
  };

  const handleNavigate = (lessonId: string) => {
    // Reset state before navigating to prevent stale state
    setSelectedOption(null);
    setExerciseFeedback(null);
    setTextAnswer('');
    navigate(`/learn/fundamentals/${lessonId}`);
  };

  const hasAnswered = exerciseFeedback !== null;
  const exercise = lesson.interactiveExercise;
  const inputType = exercise?.inputType || 'choice';

  return (
    // KEY={lesson.id} forces React to remount the entire lesson view
    // whenever the lesson changes. This eliminates stale state bugs.
    <div
      key={lesson.id}
      className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 space-y-8 animate-in fade-in duration-200"
    >
      {/* ============================================================
          TOP NAVIGATION BAR
      ============================================================ */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/learn/fundamentals"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Fundamentals
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

      {/* ============================================================
          LESSON HEADER — NO CARD
      ============================================================ */}
      <header className="space-y-4 max-w-5xl">
        <div className="flex flex-wrap items-center gap-2">
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

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.1]">
          {lesson.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          {lesson.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-secondary)] pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} min read
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-amber-400">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            +{lesson.xpReward} XP
          </span>
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
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
      </header>

      {/* ============================================================
          LESSON SECTIONS — Smart Grid Layout
      ============================================================ */}
      <LessonSections sections={lesson.sections} />

      {/* ============================================================
          KEY TAKEAWAYS
      ============================================================ */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <section className="space-y-4">
          <div>
            <span className="font-mono text-xs font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.5} />
              KEY TAKEAWAYS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
              Concepts to Remember
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-main)] border border-amber-500/30 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all duration-200"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {takeaway}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          INTERACTIVE EXERCISE (SEBELUM REFERENSI)
      ============================================================ */}
      {exercise && (
        <section className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border-2 border-cyan-500/40 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Concept Check</h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                Interactive Exercise
              </p>
            </div>
            {hasAnswered && exerciseFeedback === 'correct' && (
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Answered
              </span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-base text-[var(--text-primary)] leading-relaxed font-medium">
              {exercise.question}
            </p>
            <p className="text-xs font-mono text-[var(--text-secondary)]">
              {exercise.instruction}
            </p>
          </div>

          {/* Choice options */}
          {inputType === 'choice' && exercise.options && (
            <div className="space-y-2">
              {exercise.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = option === exercise.correctAnswer;
                const showCorrectHighlight = hasAnswered && isCorrectOption;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx, option)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isSelected && exerciseFeedback === 'correct'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-[var(--text-primary)] font-semibold'
                        : isSelected && exerciseFeedback === 'incorrect'
                        ? 'bg-rose-500/10 border-rose-500/50 text-[var(--text-primary)]'
                        : showCorrectHighlight
                        ? 'bg-emerald-500/5 border-emerald-500/30 text-[var(--text-primary)]'
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
                    {!isSelected && showCorrectHighlight && (
                      <span className="shrink-0 ml-2">
                        <Check className="w-4 h-4 text-emerald-400/60" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Text input */}
          {(inputType === 'text' || inputType === 'number') && (
            <div className="space-y-3">
              <input
                type={inputType === 'number' ? 'number' : 'text'}
                value={textAnswer}
                onChange={e => setTextAnswer(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !hasAnswered) handleTextSubmit();
                }}
                placeholder={
                  inputType === 'number' ? 'Enter a number...' : 'Type your answer...'
                }
                disabled={hasAnswered && exerciseFeedback === 'correct'}
                className={`w-full px-4 py-3 rounded-xl border font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none transition-colors ${
                  exerciseFeedback === 'correct'
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : exerciseFeedback === 'incorrect'
                    ? 'bg-rose-500/10 border-rose-500/50'
                    : 'bg-[var(--surface-secondary)] border-[var(--border-main)] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20'
                }`}
              />
              <Button
                size="md"
                variant="primary"
                onClick={handleTextSubmit}
                disabled={
                  !textAnswer.trim() || (hasAnswered && exerciseFeedback === 'correct')
                }
              >
                {exerciseFeedback === 'correct' ? 'Correct!' : 'Submit Answer'}
              </Button>
            </div>
          )}

          {/* Feedback */}
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
                {exerciseFeedback === 'correct'
                  ? 'Correct! Well done.'
                  : 'Not quite right. Try again!'}
              </span>
              <span className="text-[var(--text-secondary)]">{exercise.explanation}</span>
            </div>
          )}

          {/* Hint */}
          {!hasAnswered && exercise.hint && (
            <div className="p-3.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-2">
              <Lightbulb
                className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0"
                strokeWidth={2.5}
              />
              <p className="text-[11px] font-mono text-[var(--text-secondary)] leading-relaxed">
                <span className="font-bold text-cyan-400">Hint:</span> {exercise.hint}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ============================================================
          REFERENCES — DI PALING BAWAH (setelah quiz)
      ============================================================ */}
      {lesson.references && lesson.references.length > 0 && (
        <ReferencesCard references={lesson.references} />
      )}

      {/* ============================================================
          BOTTOM NAVIGATION
      ============================================================ */}
      <nav className="pt-6 border-t border-[var(--border-main)] flex items-center justify-between gap-4 flex-wrap">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => handleNavigate(prevLesson.id)}
            className="group flex items-center gap-2 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Previous:</span> {prevLesson.title}
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            type="button"
            onClick={() => handleNavigate(nextLesson.id)}
            className="group flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer ml-auto transition-colors"
          >
            <span className="hidden sm:inline">Next:</span> {nextLesson.title}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <Link
            to="/learn/algorithms"
            className="group flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 ml-auto transition-colors"
          >
            Next: Cryptographic Algorithms
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </nav>
    </div>
  );
}

/* ============================================================
   LessonSections — Smart Grid Layout
   
   Rules:
   - Section dengan code snippet → FULL WIDTH (butuh ruang)
   - Section dengan example → FULL WIDTH
   - Section dengan callout → FULL WIDTH
   - Section id 'exercise' → FULL WIDTH (selalu pendek, tidak cocok grid)
   - Section id 'summary' → FULL WIDTH
   - Section dengan content > 400 char → FULL WIDTH
   - Section dengan keyPoints > 3 → FULL WIDTH
   - Sisanya (compact) → di-pair dengan compact berikutnya
============================================================ */
function LessonSections({ sections }: { sections: LessonSectionShape[] }) {
  const isWideSection = (section: LessonSectionShape): boolean => {
    // 1. Rule by ID — selalu full width
    if (section.id === 'exercise') return true;
    if (section.id === 'summary') return true;
    if (section.id === 'example') return true;
    if (section.id === 'visualization') return true;

    // 2. Rule by feature
    if (section.codeSnippet) return true;
    if (section.example) return true;
    if (section.callout) return true;

    // 3. Rule by content length
    if (section.content.length > 400) return true;
    if (section.keyPoints && section.keyPoints.length > 3) return true;

    // 4. Rule by estimated total height
    const estimatedHeight =
      section.content.length +
      (section.keyPoints?.reduce((sum, kp) => sum + kp.length, 0) || 0);
    if (estimatedHeight > 500) return true;

    // Compact
    return false;
  };

  type Row =
    | { type: 'full'; section: LessonSectionShape; index: number }
    | {
        type: 'pair';
        left: LessonSectionShape;
        leftIndex: number;
        right: LessonSectionShape;
        rightIndex: number;
      };

  const rows: Row[] = [];
  let compactBuffer: { section: LessonSectionShape; index: number }[] = [];

  const flushCompact = () => {
    while (compactBuffer.length >= 2) {
      const left = compactBuffer.shift()!;
      const right = compactBuffer.shift()!;
      rows.push({
        type: 'pair',
        left: left.section,
        leftIndex: left.index,
        right: right.section,
        rightIndex: right.index,
      });
    }
    if (compactBuffer.length === 1) {
      const remaining = compactBuffer.shift()!;
      rows.push({
        type: 'full',
        section: remaining.section,
        index: remaining.index,
      });
    }
    compactBuffer = [];
  };

  sections.forEach((section, index) => {
    if (isWideSection(section)) {
      flushCompact();
      rows.push({ type: 'full', section, index });
    } else {
      compactBuffer.push({ section, index });
    }
  });

  flushCompact();

  return (
    <div className="space-y-6">
      {rows.map((row, rowIdx) => {
        if (row.type === 'full') {
          return (
            <SectionCard key={`full-${rowIdx}`} section={row.section} index={row.index} />
          );
        }

        return (
          <div
            key={`pair-${rowIdx}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch"
          >
            <SectionCard section={row.left} index={row.leftIndex} />
            <SectionCard section={row.right} index={row.rightIndex} />
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   SectionCard
============================================================ */
function SectionCard({
  section,
  index,
}: {
  section: LessonSectionShape;
  index: number;
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4 flex flex-col h-full">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight pt-1">
          {section.title}
        </h2>
      </div>

      <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line flex-1">
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
              <Code2 className="w-3.5 h-3.5" strokeWidth={2.5} />
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
          <span className="text-[var(--text-secondary)]">{section.callout.content}</span>
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
  );
}