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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          Interactive Assessment
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cryptography Fundamentals Quiz
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          10 targeted questions to evaluate your understanding of encryption, hashing, keys, and security principles. Score 80%+ to earn the Top Marks badge.
        </p>
      </div>

      {/* Progress & Status Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500">
            {answeredCount} answered
          </span>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 font-bold">
            <span className="text-slate-600 dark:text-slate-400">Score:</span>
            <span
              className={
                score >= 80
                  ? 'text-emerald-600 dark:text-emerald-400 text-sm'
                  : 'text-amber-600 dark:text-amber-400 text-sm'
              }
            >
              {score}%
            </span>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="primary">{currentQ.category}</Badge>
          <span className="text-[11px] uppercase font-bold text-slate-400">
            Difficulty: {currentQ.difficulty}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map(opt => {
            const isSelected = selectedAnswers[currentQ.id] === opt.id;
            const isCorrect = opt.id === currentQ.correctAnswerId;

            let optionStyle =
              'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

            if (submitted) {
              if (isCorrect) {
                optionStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold';
              } else if (isSelected && !isCorrect) {
                optionStyle =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 line-through';
              }
            } else if (isSelected) {
              optionStyle =
                'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-100 font-semibold';
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                disabled={submitted}
                className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
              >
                <span>{opt.text}</span>
                {submitted && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                )}
                {submitted && isSelected && !isCorrect && (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation shown after quiz submission */}
        {submitted && (
          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs leading-relaxed text-sky-900 dark:text-sky-200">
            <span className="font-bold block mb-1">Explanation:</span>
            {currentQ.explanation}
          </div>
        )}

        {/* Navigation between questions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
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
            <Button size="sm" variant="secondary" onClick={handleResetQuiz} icon={<RotateCcw className="w-3 h-3" />}>
              Retake Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary Box when submitted */}
      {submitted && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 mx-auto flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Quiz Completed! Final Score: {score}%
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {score >= 80
              ? 'Outstanding performance! You have successfully mastered core cryptographic concepts and unlocked the Top Marks achievement.'
              : 'Good effort! Review the explanations above or retake the quiz to improve your score and earn more XP.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button size="sm" variant="outline" onClick={handleResetQuiz}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
