import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CodeBlock } from '../../components/lesson/CodeBlock';
import { LESSONS } from '../../data/lessons';
import { useProgress } from '../../hooks/useProgress';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SectionContent, InlineText } from '../../components/lesson/SectionContent';
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
  Terminal,
  BookOpen,
  ExternalLink,
  FileText,
  Package,
  GraduationCap,
  List,
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

interface LessonReferenceShape {
  title: string;
  author?: string;
  year?: number;
  url?: string;
  type: 'standard' | 'paper' | 'book' | 'article' | 'documentation';
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
  const [activeSection, setActiveSection] = useState<string>('');

  const lesson = LESSONS.find(l => l.id === id || l.slug === id);

  // Reset state when lesson changes
  useEffect(() => {
    setSelectedOption(null);
    setExerciseFeedback(null);
    setTextAnswer('');
    setActiveSection('');

    if (!lesson?.interactiveExercise) return;

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

  // Scroll Spy
  useEffect(() => {
    if (!lesson) return;

    const sectionIds: string[] = [
      ...lesson.sections.map(s => s.id),
      ...(lesson.keyTakeaways && lesson.keyTakeaways.length > 0 ? ['takeaways'] : []),
      ...(lesson.interactiveExercise ? ['exercise'] : []),
    ];

    const elements: { id: string; el: HTMLElement }[] = [];
    sectionIds.forEach(sid => {
      const el = document.getElementById(`section-${sid}`);
      if (el) elements.push({ id: sid, el });
    });

    if (elements.length === 0) return;

    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const sid = entry.target.getAttribute('data-section-id');
          if (!sid) return;

          if (entry.isIntersecting) {
            visibleSections.set(sid, entry.intersectionRatio);
          } else {
            visibleSections.delete(sid);
          }
        });

        if (visibleSections.size > 0) {
          let bestId = '';
          let bestRatio = -1;
          visibleSections.forEach((ratio, sid) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = sid;
            }
          });
          setActiveSection(bestId);
        }
      },
      {
        rootMargin: '-96px 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    );

    elements.forEach(({ id: sid, el }) => {
      el.setAttribute('data-section-id', sid);
      observer.observe(el);
    });

    return () => {
      elements.forEach(({ el }) => {
        el.removeAttribute('data-section-id');
      });
      observer.disconnect();
    };
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-16 text-center space-y-4">
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
    setSelectedOption(null);
    setExerciseFeedback(null);
    setTextAnswer('');
    setActiveSection('');
    navigate(`/learn/fundamentals/${lessonId}`);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      const offset = 96;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const exercise = lesson.interactiveExercise;
  const inputType = exercise?.inputType || 'choice';

  /**
   * FIX: hasAnswered should only be true when answer is CORRECT.
   * This keeps hint visible if user answers wrong — they can try again.
   */
  const isCorrectAnswer = exerciseFeedback === 'correct';
  const showHint = !isCorrectAnswer && exercise?.hint;

  const sectionAnchors = lesson.sections.map((s, idx) => ({
    id: s.id,
    label: `${idx + 1}. ${s.title}`,
  }));

  const completedCount = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  return (
    <div
      key={lesson.id}
      className="max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 animate-in fade-in duration-200"
    >
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
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

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* MAIN CONTENT (LEFT — 3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* LESSON HEADER */}
          <header className="space-y-4 pb-2">
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

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.1]">
              {lesson.title}
            </h1>

            {/* FIX: description now uses InlineText for **bold** */}
            <InlineText
              as="p"
              text={lesson.description}
              className="text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl"
            />

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {lesson.estimatedMinutes} min read
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                +{lesson.xpReward} XP
              </span>
            </div>

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
          </header>

          {/* LESSON SECTIONS */}
          <LessonSections sections={lesson.sections} />

          {/* KEY TAKEAWAYS */}
          {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
            <section
              id="section-takeaways"
              className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-5 scroll-mt-24"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lightbulb className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400 tracking-widest block">
                    KEY TAKEAWAYS
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-0.5">
                    Concepts to Remember
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lesson.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                    </div>
                    {/* FIX: takeaway now uses InlineText */}
                    <InlineText
                      as="p"
                      text={takeaway}
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* INTERACTIVE EXERCISE */}
          {exercise && (
            <section
              id="section-exercise"
              className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border-2 border-cyan-500/40 shadow-xl space-y-5 scroll-mt-24"
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
                    CONCEPT CHECK
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-0.5">
                    Interactive Exercise
                  </h2>
                </div>
                {isCorrectAnswer && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    Answered
                  </span>
                )}
              </div>

              {/* FIX: question + instruction use InlineText */}
              <div className="space-y-2">
                <InlineText
                  as="p"
                  text={exercise.question}
                  className="text-base text-[var(--text-primary)] leading-relaxed font-medium"
                />
                <InlineText
                  as="p"
                  text={exercise.instruction}
                  className="text-xs font-mono text-[var(--text-secondary)]"
                />
              </div>

              {inputType === 'choice' && exercise.options && (
                <div className="space-y-2">
                  {exercise.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectOption = option === exercise.correctAnswer;
                    const showCorrectHighlight = isCorrectAnswer && isCorrectOption;

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
                        {/* FIX: option uses InlineText */}
                        <InlineText text={option} className="leading-relaxed" />
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

              {(inputType === 'text' || inputType === 'number') && (
                <div className="space-y-3">
                  <input
                    type={inputType === 'number' ? 'number' : 'text'}
                    value={textAnswer}
                    onChange={e => setTextAnswer(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !isCorrectAnswer) handleTextSubmit();
                    }}
                    placeholder={
                      inputType === 'number' ? 'Enter a number...' : 'Type your answer...'
                    }
                    disabled={isCorrectAnswer}
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
                    disabled={!textAnswer.trim() || isCorrectAnswer}
                  >
                    {isCorrectAnswer ? 'Correct!' : 'Submit Answer'}
                  </Button>
                </div>
              )}

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
                  {/* FIX: explanation uses InlineText */}
                  <InlineText
                    text={exercise.explanation}
                    className="text-[var(--text-secondary)]"
                  />
                </div>
              )}

              {/* FIX: hint visible when answer is NOT correct */}
              {showHint && (
                <div className="p-3.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-2">
                  <Lightbulb
                    className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0"
                    strokeWidth={2.5}
                  />
                  <div className="text-[11px] font-mono text-[var(--text-secondary)] leading-relaxed">
                    <span className="font-bold text-cyan-400">Hint:</span>{' '}
                    {/* FIX: hint uses InlineText */}
                    <InlineText text={exercise.hint!} />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* BOTTOM NAVIGATION */}
          <nav className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg flex items-center justify-between gap-4 flex-wrap">
            {prevLesson ? (
              <button
                type="button"
                onClick={() => handleNavigate(prevLesson.id)}
                className="group flex flex-col items-start gap-1 text-left cursor-pointer transition-colors max-w-[45%]"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  Previous
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {prevLesson.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <button
                type="button"
                onClick={() => handleNavigate(nextLesson.id)}
                className="group flex flex-col items-end gap-1 text-right cursor-pointer ml-auto transition-colors max-w-[45%]"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  Next
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {nextLesson.title}
                </span>
              </button>
            ) : (
              <Link
                to="/learn/algorithms"
                className="group flex flex-col items-end gap-1 text-right ml-auto transition-colors max-w-[45%]"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  Next
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                  Cryptographic Algorithms
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* SIDEBAR (RIGHT — 1 col) */}
        <aside className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
          {/* LESSON NAVIGATION */}
          <div className="rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg overflow-hidden">
            <div className="p-4 border-b border-[var(--border-main)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <List className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                  Lesson Navigation
                </h3>
              </div>
            </div>

            <div className="p-3">
              <nav className="space-y-0.5">
                {sectionAnchors.map((anchor, idx) => {
                  const isActive = activeSection === anchor.id;
                  return (
                    <button
                      key={anchor.id}
                      type="button"
                      onClick={() => handleScrollToSection(anchor.id)}
                      className={`group w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-400 font-semibold ring-1 ring-cyan-500/40'
                          : 'text-[var(--text-secondary)] hover:text-cyan-400 hover:bg-cyan-500/5'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                          isActive
                            ? 'bg-cyan-500 text-black border-cyan-500'
                            : 'bg-[var(--surface-secondary)] border-[var(--border-main)] group-hover:border-cyan-500/40 group-hover:text-cyan-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate">
                        {anchor.label.replace(/^\d+\.\s*/, '')}
                      </span>
                    </button>
                  );
                })}

                {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleScrollToSection('takeaways')}
                    className={`group w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                      activeSection === 'takeaways'
                        ? 'bg-amber-500/15 text-amber-400 font-semibold ring-1 ring-amber-500/40'
                        : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-amber-500/5'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                        activeSection === 'takeaways'
                          ? 'bg-amber-500 text-black border-amber-500'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      ★
                    </span>
                    <span className="truncate">Key Takeaways</span>
                  </button>
                )}

                {exercise && (
                  <button
                    type="button"
                    onClick={() => handleScrollToSection('exercise')}
                    className={`group w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                      activeSection === 'exercise'
                        ? 'bg-cyan-500/15 text-cyan-400 font-semibold ring-1 ring-cyan-500/40'
                        : 'text-[var(--text-secondary)] hover:text-cyan-400 hover:bg-cyan-500/5'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                        activeSection === 'exercise'
                          ? 'bg-cyan-500 text-black border-cyan-500'
                          : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      }`}
                    >
                      ?
                    </span>
                    <span className="truncate">Concept Check</span>
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* ALL LESSONS */}
          <div className="rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg overflow-hidden">
            <div className="p-4 border-b border-[var(--border-main)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                    All Lessons
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)]">
                  {completedCount}/{LESSONS.length}
                </span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <nav className="p-2 space-y-0.5">
                {LESSONS.map(l => {
                  const done = isLessonCompleted(l.id);
                  const isCurrent = l.id === lesson.id;

                  return (
                    <Link
                      key={l.id}
                      to={`/learn/fundamentals/${l.id}`}
                      className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs truncate transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/15 text-cyan-400 font-semibold ring-1 ring-cyan-500/40'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold ${
                          isCurrent
                            ? 'bg-cyan-500 text-black border-cyan-500'
                            : done
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-[var(--surface-secondary)] border-[var(--border-main)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {done && !isCurrent ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          String(l.order).padStart(2, '0')
                        )}
                      </span>
                      <span className="truncate">{l.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* REFERENCES */}
          {lesson.references && lesson.references.length > 0 && (
            <SidebarReferences references={lesson.references} />
          )}
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
   LessonSections
============================================================ */
function LessonSections({ sections }: { sections: LessonSectionShape[] }) {
  const isWideSection = (section: LessonSectionShape): boolean => {
    if (['exercise', 'summary', 'example', 'visualization'].includes(section.id))
      return true;
    if (section.codeSnippet) return true;
    if (section.example) return true;
    if (section.callout) return true;
    if (section.content.length > 350) return true;
    if (section.keyPoints && section.keyPoints.length > 2) return true;
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
    <div className="space-y-5">
      {rows.map((row, rowIdx) => {
        if (row.type === 'full') {
          return (
            <SectionCard key={`full-${rowIdx}`} section={row.section} index={row.index} />
          );
        }

        return (
          <div
            key={`pair-${rowIdx}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch"
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
    <div
      id={`section-${section.id}`}
      className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4 flex flex-col h-full scroll-mt-24"
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight pt-1">
          {section.title}
        </h2>
      </div>

      <div className="flex-1">
        <SectionContent content={section.content} />
      </div>

      {section.keyPoints && section.keyPoints.length > 0 && (
        <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2.5">
          <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-cyan-400 block">
            Core Highlights
          </span>
          <ul className="space-y-2 text-xs text-[var(--text-primary)]">
            {section.keyPoints.map((kp, kIdx) => (
              <li key={kIdx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                {/* FIX: keyPoint uses InlineText */}
                <InlineText text={kp} className="leading-relaxed" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.codeSnippet && (
        <div className="rounded-xl overflow-hidden border border-[var(--border-main)] bg-[#011627]">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E222B] bg-[#0B2942] text-xs font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Code2 className="w-3.5 h-3.5" strokeWidth={2.5} />
              {section.codeSnippet.caption || 'Code Demonstration'}
            </span>
            <span className="text-[10px] uppercase text-[var(--text-secondary)]">
              {section.codeSnippet.language}
            </span>
          </div>

          {/* Syntax-highlighted code */}
          <CodeBlock
            code={section.codeSnippet.code}
            language={section.codeSnippet.language}
            caption={section.codeSnippet.caption}
          />
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
          {/* FIX: callout content uses InlineText */}
          <InlineText
            text={section.callout.content}
            className="text-[var(--text-secondary)]"
          />
        </div>
      )}

      {section.example && (
        <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold text-[var(--text-secondary)] flex items-center gap-1.5 tracking-wider">
            <Terminal className="w-3 h-3" strokeWidth={2.5} />
            Practical Example
          </span>
          <SectionContent content={section.example} />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SidebarReferences
============================================================ */
const TYPE_CONFIG: Record<
  string,
  { label: string; text: string; bg: string; border: string; Icon: typeof FileText }
> = {
  standard: {
    label: 'Standard',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    Icon: Package,
  },
  paper: {
    label: 'Paper',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    Icon: FileText,
  },
  book: {
    label: 'Book',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    Icon: BookOpen,
  },
  article: {
    label: 'Article',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    Icon: FileText,
  },
  documentation: {
    label: 'Docs',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    Icon: GraduationCap,
  },
};

function SidebarReferences({ references }: { references: LessonReferenceShape[] }) {
  return (
    <div className="rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg overflow-hidden">
      <div className="p-4 border-b border-[var(--border-main)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
            References
          </h3>
        </div>
        <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1.5">
          {references.length} source{references.length > 1 ? 's' : ''} for this lesson
        </p>
      </div>

      <div className="p-2 space-y-1">
        {references.map((ref, idx) => {
          const config = TYPE_CONFIG[ref.type] || TYPE_CONFIG.documentation;
          const TypeIcon = config.Icon;

          const innerContent = (
            <div className="flex items-start gap-2">
              <div
                className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center ${config.bg} ${config.border} ${config.text}`}
              >
                <TypeIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[var(--text-primary)] leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {ref.title}
                </p>
                {ref.author && (
                  <p className="text-[9px] font-mono text-[var(--text-secondary)] mt-0.5 truncate">
                    {ref.author}
                    {ref.year && ` · ${ref.year}`}
                  </p>
                )}
              </div>
              {ref.url && (
                <ExternalLink className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
              )}
            </div>
          );

          if (ref.url) {
            return (
              <a
                key={idx}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="group block p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
              >
                {innerContent}
              </a>
            );
          }

          return (
            <div key={idx} className="p-2">
              {innerContent}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-[var(--border-main)]">
        <p className="text-[9px] font-mono text-[var(--text-secondary)] leading-relaxed italic">
          Content paraphrased for educational clarity.
        </p>
      </div>
    </div>
  );
}