import { useState, useEffect } from 'react';
import {
  HelpCircle,
  Lightbulb,
  Check,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Zap,
} from 'lucide-react';
import { Button } from '../common/Button';
import { InlineText } from '../lesson/SectionContent';
import { useProgress } from '../../hooks/useProgress';
import { ALGORITHM_QUIZZES } from '../../data/algorithms/quizzes';
import type { AlgorithmQuiz as AlgorithmQuizType } from '../../data/algorithms/_types';

interface AlgorithmQuizProps {
  algorithmId: string;
  algorithmName: string;
}

/* ============================================================
   Single Quiz Card — one quiz question
============================================================ */
function QuizQuestionCard({
  quiz,
  quizIndex,
  totalQuizzes,
  algorithmId,
}: {
  quiz: AlgorithmQuizType;
  quizIndex: number;
  totalQuizzes: number;
  algorithmId: string;
}) {
  const { saveAlgorithmQuizAnswer, getAlgorithmQuizAnswers } = useProgress();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Restore saved answer when component mounts or algorithmId changes
  useEffect(() => {
    const saved = getAlgorithmQuizAnswers(algorithmId);
    const entry = saved.find(a => a.quizIndex === quizIndex);

    if (entry) {
      if (quiz.inputType === 'choice' && typeof entry.answer === 'number') {
        setSelectedOption(entry.answer);
      } else if (typeof entry.answer === 'string') {
        setTextAnswer(entry.answer);
      } else if (typeof entry.answer === 'number') {
        setTextAnswer(String(entry.answer));
      }
      setFeedback(entry.isCorrect ? 'correct' : 'incorrect');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmId, quizIndex]);

  const inputType = quiz.inputType || 'choice';
  const isCorrectAnswer = feedback === 'correct';
  const showHint = !isCorrectAnswer && feedback !== null; // Only show hint AFTER a wrong attempt

  const handleOptionSelect = (idx: number, optionText: string) => {
    if (isCorrectAnswer) return; // Already correct, don't allow change
    const isCorrect = optionText === quiz.correctAnswer;
    setSelectedOption(idx);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    saveAlgorithmQuizAnswer(algorithmId, quizIndex, idx, isCorrect);
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim() || isCorrectAnswer) return;
    const normalized = textAnswer.trim();
    const isCorrect =
      normalized.toLowerCase() === quiz.correctAnswer.trim().toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    saveAlgorithmQuizAnswer(algorithmId, quizIndex, normalized, isCorrect);
  };

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border-2 space-y-5 transition-colors ${
        isCorrectAnswer
          ? 'bg-emerald-500/5 border-emerald-500/40'
          : feedback === 'incorrect'
          ? 'bg-rose-500/5 border-rose-500/30'
          : 'bg-[var(--surface-main)] border-[var(--border-main)]'
      }`}
    >
      {/* Quiz header */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <span className="text-xs font-mono font-bold">{quizIndex + 1}</span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          Quiz {quizIndex + 1} / {totalQuizzes}
        </span>
        {isCorrectAnswer && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            Correct
          </span>
        )}
      </div>

      {/* Question */}
      <div className="space-y-1.5">
        <InlineText
          as="p"
          text={quiz.question}
          className="text-base text-[var(--text-primary)] leading-relaxed font-medium"
        />
        <InlineText
          as="p"
          text={quiz.instruction}
          className="text-xs font-mono text-[var(--text-secondary)]"
        />
      </div>

      {/* Options (choice) */}
      {inputType === 'choice' && quiz.options && (
        <div className="space-y-2">
          {quiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = option === quiz.correctAnswer;
            const showCorrectHighlight = isCorrectAnswer && isCorrectOption;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionSelect(idx, option)}
                disabled={isCorrectAnswer}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-150 flex items-center justify-between ${
                  isCorrectAnswer ? 'cursor-default' : 'cursor-pointer'
                } ${
                  isSelected && feedback === 'correct'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-[var(--text-primary)] font-semibold'
                    : isSelected && feedback === 'incorrect'
                    ? 'bg-rose-500/10 border-rose-500/50 text-[var(--text-primary)]'
                    : showCorrectHighlight
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-[var(--text-primary)]'
                    : 'bg-[var(--surface-secondary)] border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                <InlineText text={option} className="leading-relaxed" />
                {isSelected && (
                  <span className="shrink-0 ml-2">
                    {feedback === 'correct' ? (
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

      {/* Text / Number input */}
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
              feedback === 'correct'
                ? 'bg-emerald-500/10 border-emerald-500/50'
                : feedback === 'incorrect'
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

      {/* Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs leading-relaxed border animate-in fade-in duration-150 ${
            feedback === 'correct'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-rose-500/10 border-rose-500/30'
          }`}
        >
          <span
            className={`font-mono font-bold block mb-1 text-[11px] uppercase tracking-wider ${
              feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {feedback === 'correct' ? 'Correct!' : 'Not quite right. Try again!'}
          </span>
          <InlineText
            text={quiz.explanation}
            className="text-[var(--text-secondary)]"
          />
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="p-3.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-2">
          <Lightbulb
            className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0"
            strokeWidth={2.5}
          />
          <div className="text-[11px] font-mono text-[var(--text-secondary)] leading-relaxed">
            <span className="font-bold text-cyan-400">Hint:</span>{' '}
            <InlineText text={quiz.hint} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   AlgorithmQuiz — Main exported component
   Renders all quizzes for an algorithm + progress summary
============================================================ */
export function AlgorithmQuiz({ algorithmId, algorithmName }: AlgorithmQuizProps) {
  const { getAlgorithmQuizAnswers, isAlgorithmQuizComplete } = useProgress();

  const quizzes = ALGORITHM_QUIZZES[algorithmId] || [];
  const savedAnswers = getAlgorithmQuizAnswers(algorithmId);
  const isComplete = isAlgorithmQuizComplete(algorithmId);

  const correctCount = savedAnswers.filter(a => a.isCorrect).length;
  const totalQuizzes = quizzes.length;

  if (totalQuizzes === 0) return null;

  return (
    <section
      id="section-quiz"
      className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border-2 border-cyan-500/40 shadow-xl space-y-5 scroll-mt-24"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <div>
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
            KNOWLEDGE CHECK
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-0.5">
            Algorithm Quiz
          </h2>
        </div>

        {/* Progress indicator */}
        <div className="ml-auto flex items-center gap-2">
          {isComplete ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              <Trophy className="w-3.5 h-3.5" />
              Mastered
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[var(--text-secondary)] bg-[var(--surface-secondary)] border border-[var(--border-main)] px-2.5 py-1 rounded-md">
              <Zap className="w-3.5 h-3.5" />
              {correctCount}/{totalQuizzes} correct
            </span>
          )}
        </div>
      </div>

      {/* Intro text */}
      <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
        Test your understanding of <strong className="text-cyan-400">{algorithmName}</strong> with
        the questions below. Your answers are saved automatically — you can come back later.
      </p>

      {/* All quizzes */}
      <div className="space-y-4">
        {quizzes.map((quiz, idx) => (
          <QuizQuestionCard
            key={idx}
            quiz={quiz}
            quizIndex={idx}
            totalQuizzes={totalQuizzes}
            algorithmId={algorithmId}
          />
        ))}
      </div>

      {/* Completion message */}
      {isComplete && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
          <Trophy className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <span className="font-mono font-bold text-emerald-400 text-xs uppercase tracking-wider block mb-0.5">
              Algorithm Mastered
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              You have answered all {totalQuizzes} quizzes correctly. This algorithm is now marked
              as <strong className="text-emerald-400">explored</strong> in your progress.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}