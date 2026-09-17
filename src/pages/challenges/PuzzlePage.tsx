import { useState } from 'react';
import { CRYPTO_PUZZLES } from '../../data/challenges';
import { useProgress } from '../../hooks/useProgress';
import {
  Puzzle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Lock,
  Unlock,
  Target,
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
  const solvedCount = CRYPTO_PUZZLES.filter(p => isChallengeCompleted(p.id)).length;

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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <Puzzle className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Cipher Decryption Puzzles
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Intercepted Dispatch Puzzles
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Put your cryptanalysis skills to work on intercepted transmissions. Decrypt the
              secret messages to earn XP.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)]">
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                Solved
              </span>
              <span className="text-lg font-extrabold font-mono text-emerald-400">
                {solvedCount}/{CRYPTO_PUZZLES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Puzzle Selector Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Select Puzzle
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CRYPTO_PUZZLES.map((puzzle, idx) => {
            const solved = isChallengeCompleted(puzzle.id);
            const isSelected = puzzle.id === currentPuzzle.id;

            return (
              <button
                key={puzzle.id}
                type="button"
                onClick={() => setActivePuzzleId(puzzle.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black'
                    : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                {solved ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-emerald-400'}`} />
                ) : (
                  <span
                    className={`w-4 h-4 rounded-full border text-[9px] flex items-center justify-center font-bold ${
                      isSelected
                        ? 'border-black text-black'
                        : 'border-[var(--border-main)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
                <span>{puzzle.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Puzzle Content (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-6">
            {/* Header */}
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

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-amber-400 font-semibold">+{currentPuzzle.xpReward} XP</span>
                {isSolved && (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SOLVED
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {currentPuzzle.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {currentPuzzle.description}
              </p>
            </div>

            {/* Ciphertext */}
            <div className="p-5 rounded-xl bg-[#0A0C10] border border-[#1E222B] space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-secondary)] block">
                Intercepted Ciphertext Payload
              </span>
              <div className="text-cyan-300 text-base font-mono font-bold break-all select-all leading-relaxed">
                {currentPuzzle.ciphertext}
              </div>
            </div>
          </div>

          {/* Hints Card */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Progressive Hints
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {hintsCount} of {currentPuzzle.hints.length} revealed
                  </p>
                </div>
              </div>

              {hintsCount < currentPuzzle.hints.length && (
                <button
                  type="button"
                  onClick={handleRevealNextHint}
                  className="text-[11px] font-mono font-semibold text-amber-400 hover:text-amber-300 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Unlock className="w-3 h-3" /> Reveal Next Hint
                </button>
              )}
            </div>

            {hintsCount > 0 ? (
              <div className="space-y-2">
                {currentPuzzle.hints.slice(0, hintsCount).map((hint, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs animate-in fade-in"
                  >
                    <strong className="block text-amber-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                      Hint #{hIdx + 1}
                    </strong>
                    <span className="text-[var(--text-secondary)] leading-relaxed">{hint}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-xs text-[var(--text-secondary)] italic flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                Need a nudge? Reveal hints one at a time — they won't reduce your XP reward.
              </div>
            )}
          </div>

          {/* Answer Submission */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Submit Deciphered Answer
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Case-insensitive. Whitespace trimmed.
                </p>
              </div>
            </div>

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
                placeholder="Enter deciphered plaintext..."
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              />
              <Button size="md" variant="primary" onClick={handleCheckAnswer}>
                Verify Solution
              </Button>
            </div>

            {feedback[currentPuzzle.id] === 'correct' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
                <span className="font-mono font-bold flex items-center gap-1.5 text-emerald-400 text-[11px] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Correct! Cipher Broken! (+{currentPuzzle.xpReward} XP)
                </span>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {currentPuzzle.explanation}
                </p>
              </div>
            )}

            {feedback[currentPuzzle.id] === 'incorrect' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-[var(--text-secondary)]">
                  Decryption incorrect. Recheck your shift or use the hints above!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Info Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Puzzle Meta */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Puzzle Meta
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)]">Category</span>
                <span className="text-[var(--text-primary)] capitalize">
                  {currentPuzzle.category}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)]">Difficulty</span>
                <span className="text-[var(--text-primary)] capitalize">
                  {currentPuzzle.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)]">Hint Count</span>
                <span className="text-[var(--text-primary)]">
                  {currentPuzzle.hints.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">XP Reward</span>
                <span className="text-amber-400 font-bold">
                  +{currentPuzzle.xpReward}
                </span>
              </div>
            </div>
          </div>

          {/* Strategy Tips */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Strategy Tips
              </h3>
            </div>

            <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Check the puzzle category — classical ciphers have known attacks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Look for word patterns: 3-letter words are often THE, AND, FOR.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Try the Cryptanalysis Lab for frequency or brute-force tools.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Hints reveal progressively more specific clues.</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <a
                href="#/playground/analyze"
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] hover:border-cyan-500/40 transition-colors text-xs"
              >
                <span className="font-mono text-[var(--text-primary)]">Open Cryptanalysis Lab</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </a>
              <a
                href="#/playground/encrypt"
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] hover:border-cyan-500/40 transition-colors text-xs"
              >
                <span className="font-mono text-[var(--text-primary)]">Manual Encrypt / Decrypt</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}