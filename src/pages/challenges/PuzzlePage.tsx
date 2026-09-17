import { useState } from 'react';
import { CRYPTO_PUZZLES } from '../../data/challenges';
import { useProgress } from '../../hooks/useProgress';
import {
  Puzzle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function PuzzlePage() {
  const { completeChallenge, isChallengeCompleted } = useProgress();

  const [activePuzzleId, setActivePuzzleId] = useState(CRYPTO_PUZZLES[0].id);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});

  const currentPuzzle = CRYPTO_PUZZLES.find(p => p.id === activePuzzleId) || CRYPTO_PUZZLES[0];
  const isSolved = isChallengeCompleted(currentPuzzle.id);

  const hintsCount = revealedHints[currentPuzzle.id] || 0;

  const handleRevealNextHint = () => {
    setRevealedHints(prev => ({
      ...prev,
      [currentPuzzle.id]: Math.min((prev[currentPuzzle.id] || 0) + 1, currentPuzzle.hints.length),
    }));
  };

  const handleCheckAnswer = () => {
    const input = (userInputs[currentPuzzle.id] || '').trim().toLowerCase();
    const isCorrect = currentPuzzle.acceptableAnswers.some(
      ans => ans.toLowerCase() === input
    );

    if (isCorrect) {
      setFeedback(prev => ({ ...prev, [currentPuzzle.id]: 'correct' }));
      completeChallenge(currentPuzzle.id, currentPuzzle.xpReward);
    } else {
      setFeedback(prev => ({ ...prev, [currentPuzzle.id]: 'incorrect' }));
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <Puzzle className="w-3.5 h-3.5" />
          Cipher Decryption Puzzles
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Intercepted Dispatch Puzzles
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Put your cryptanalysis skills to work on intercepted transmissions. Decrypt the secret messages and reveal the solutions to earn XP.
        </p>
      </div>

      {/* Puzzle Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CRYPTO_PUZZLES.map((puzzle, idx) => {
          const solved = isChallengeCompleted(puzzle.id);
          const isSelected = puzzle.id === currentPuzzle.id;

          return (
            <button
              key={puzzle.id}
              type="button"
              onClick={() => setActivePuzzleId(puzzle.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white dark:bg-sky-500 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {solved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>#{idx + 1}: {puzzle.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Puzzle Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="neutral">{currentPuzzle.category.toUpperCase()}</Badge>
            <Badge
              variant={
                currentPuzzle.difficulty === 'beginner'
                  ? 'success'
                  : currentPuzzle.difficulty === 'intermediate'
                  ? 'primary'
                  : 'warning'
              }
            >
              {currentPuzzle.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              +{currentPuzzle.xpReward} XP
            </span>
            {isSolved && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {currentPuzzle.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {currentPuzzle.description}
          </p>
        </div>

        {/* Ciphertext Card */}
        <div className="p-5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans tracking-wider">
            Intercepted Ciphertext Payload
          </span>
          <div className="text-sky-300 text-sm font-bold break-all select-all">
            {currentPuzzle.ciphertext}
          </div>
        </div>

        {/* Hints Section */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Cryptanalyst Hints ({hintsCount} of {currentPuzzle.hints.length} revealed)
            </span>

            {hintsCount < currentPuzzle.hints.length && (
              <button
                type="button"
                onClick={handleRevealNextHint}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                + Reveal Next Hint
              </button>
            )}
          </div>

          {hintsCount > 0 ? (
            <div className="space-y-2">
              {currentPuzzle.hints.slice(0, hintsCount).map((hint, hIdx) => (
                <div
                  key={hIdx}
                  className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in"
                >
                  <strong className="block text-amber-950 dark:text-amber-100 mb-0.5">
                    Hint #{hIdx + 1}:
                  </strong>
                  {hint}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Need a nudge? Click 'Reveal Next Hint' to uncover progressive clues.
            </p>
          )}
        </div>

        {/* Answer Submission Form */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Your Deciphered Plaintext Answer:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userInputs[currentPuzzle.id] || ''}
              onChange={e =>
                setUserInputs(prev => ({ ...prev, [currentPuzzle.id]: e.target.value }))
              }
              onKeyDown={e => {
                if (e.key === 'Enter') handleCheckAnswer();
              }}
              placeholder="Enter deciphered message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Button size="md" variant="primary" onClick={handleCheckAnswer}>
              Verify Solution
            </Button>
          </div>

          {feedback[currentPuzzle.id] === 'correct' && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-emerald-950 dark:text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Correct! You broke the cipher! (+{currentPuzzle.xpReward} XP)
              </span>
              <p>{currentPuzzle.explanation}</p>
            </div>
          )}

          {feedback[currentPuzzle.id] === 'incorrect' && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Decryption incorrect. Recheck your shift or use the hints above!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
