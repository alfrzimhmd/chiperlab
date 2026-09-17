import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/challenges';
import { useProgress } from '../../hooks/useProgress';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function QuizPage() {
  const { recordQuizScore, progress } = useProgress();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerId) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    setSubmitted(true);
    recordQuizScore('crypto-fundamentals-quiz', score, 50);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const score = calculateScore();
  const answeredCount = Object.keys(selectedAnswers).length;
  const bestScore = progress.quizScores['crypto-fundamentals-quiz'] || 0;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Interactive Assessment
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Cryptography Fundamentals Quiz
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          10 targeted questions to evaluate your understanding of encryption, hashing, keys, and
          security principles. Score 80%+ to earn the Top Marks badge.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Quiz Card (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Progress Header */}
          <div className="p-4 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[var(--text-secondary)]">
                Q {currentQuestionIndex + 1} / {totalQuestions}
              </span>
              <span className="text-[var(--border-main)]">•</span>
              <span className="font-mono text-[var(--text-secondary)]">
                {answeredCount} answered
              </span>
            </div>

            {submitted && (
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[var(--text-secondary)]">Final:</span>
                <span
                  className={`text-base font-bold ${
                    score >= 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {score}%
                </span>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge variant="primary">{currentQ.category}</Badge>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                const isCorrect = opt.id === currentQ.correctAnswerId;

                let optionStyle =
                  'border-[var(--border-main)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]';

                if (submitted) {
                  if (isCorrect) {
                    optionStyle =
                      'border-emerald-500/50 bg-emerald-500/10 text-[var(--text-primary)]';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-500/50 bg-rose-500/10 text-[var(--text-primary)]';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-cyan-500/50 bg-cyan-500/10 text-[var(--text-primary)]';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-xl border text-sm leading-relaxed transition-all cursor-pointer flex items-center gap-3 ${optionStyle} ${
                      submitted ? 'cursor-default' : ''
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                        isSelected || (submitted && isCorrect)
                          ? isCorrect && submitted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isSelected && submitted && !isCorrect
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {submitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs leading-relaxed space-y-1.5">
                <span className="font-mono font-bold text-cyan-400 text-[10px] uppercase tracking-wider block">
                  Explanation
                </span>
                <p className="text-[var(--text-secondary)]">{currentQ.explanation}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-main)] flex-wrap gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                icon={<ArrowLeft className="w-3 h-3" />}
              >
                Previous
              </Button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  icon={<ArrowRight className="w-3 h-3" />}
                  iconPosition="right"
                >
                  Next Question
                </Button>
              ) : !submitted ? (
                <Button
                  size="sm"
                  variant="success"
                  onClick={handleSubmitQuiz}
                  disabled={answeredCount === 0}
                >
                  Submit Quiz ({answeredCount}/{totalQuestions})
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleResetQuiz}
                  icon={<RotateCcw className="w-3 h-3" />}
                >
                  Retake
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {submitted && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-amber-500/30 shadow-lg space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Quiz Complete — Score: {score}%
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                {score >= 80
                  ? 'Outstanding performance! You have mastered core cryptographic concepts and unlocked the Top Marks achievement.'
                  : 'Good effort! Review the explanations above or retake the quiz to improve your score.'}
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button size="sm" variant="outline" onClick={handleResetQuiz}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Navigator & Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Question Navigator */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Question Navigator
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Jump to any question
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const isAnswered = !!selectedAnswers[q.id];
                const isCurrent = idx === currentQuestionIndex;
                const isRight = submitted && selectedAnswers[q.id] === q.correctAnswerId;

                let dotStyle =
                  'bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[var(--text-secondary)]';

                if (isCurrent) {
                  dotStyle = 'bg-cyan-500 text-black border border-cyan-500';
                } else if (submitted && isRight) {
                  dotStyle = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
                } else if (submitted && isAnswered && !isRight) {
                  dotStyle = 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
                } else if (isAnswered) {
                  dotStyle = 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`aspect-square rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${dotStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[var(--border-main)] space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Answered</span>
                <span className="text-[var(--text-primary)]">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              {submitted && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Correct</span>
                  <span className="text-emerald-400">
                    {Object.keys(selectedAnswers).filter(
                      qId => selectedAnswers[qId] === QUIZ_QUESTIONS.find(x => x.id === qId)?.correctAnswerId
                    ).length}{' '}
                    / {totalQuestions}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Best Score */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Your Best Score
              </h3>
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold font-mono ${
                  bestScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {bestScore}
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">/ 100</span>
            </div>

            <div className="h-1.5 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  bestScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${bestScore}%` }}
              />
            </div>

            <p className="text-[11px] font-mono text-[var(--text-secondary)]">
              {bestScore >= 80
                ? 'Top Marks badge unlocked'
                : `Need ${80 - bestScore}% more to unlock Top Marks`}
            </p>
          </div>

          {/* Tips */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Quiz Tips
              </h3>
            </div>

            <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>You can navigate between questions freely before submitting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>Explanations reveal after submission — read them to learn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>Only your highest score counts for badges.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>Use the Learn section to brush up before retaking.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}