import { useState } from 'react';
import { ATTACK_SCENARIOS } from '../../data/challenges';
import { useProgress } from '../../hooks/useProgress';
import {
  ShieldAlert,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function AttackSimPage() {
  const { completeChallenge, isChallengeCompleted } = useProgress();

  const [activeAttackId, setActiveAttackId] = useState(ATTACK_SCENARIOS[0].id);
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});

  const scenario =
    ATTACK_SCENARIOS.find(a => a.id === activeAttackId) || ATTACK_SCENARIOS[0];
  const isCompleted = isChallengeCompleted(scenario.id);

  const handleVerifyFlag = () => {
    const input = (flagInputs[scenario.id] || '').trim().toUpperCase();
    if (input === scenario.expectedFlag.toUpperCase()) {
      setFeedback(prev => ({ ...prev, [scenario.id]: 'correct' }));
      completeChallenge(scenario.id, scenario.xpReward);
    } else {
      setFeedback(prev => ({ ...prev, [scenario.id]: 'incorrect' }));
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          Interactive Attack Simulations
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cryptanalysis Attack Simulations
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Experience how cryptographic flaws and weak keyspaces are exploited by adversaries. Walk through the mathematical vulnerabilities and submit recovered flags.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {ATTACK_SCENARIOS.map((sc, idx) => {
          const isDone = isChallengeCompleted(sc.id);
          const isSelected = sc.id === scenario.id;

          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setActiveAttackId(sc.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>Attack #{idx + 1}: {sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Attack Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="danger">VULNERABILITY: {scenario.technique.toUpperCase()}</Badge>
            <Badge
              variant={
                scenario.difficulty === 'beginner'
                  ? 'success'
                  : scenario.difficulty === 'intermediate'
                  ? 'primary'
                  : 'warning'
              }
            >
              {scenario.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              +{scenario.xpReward} XP
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5" /> Exploited
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {scenario.title}
          </h2>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mt-1">
            Target Primitive: {scenario.targetCipher}
          </span>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Target Ciphertext Payload */}
        <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans tracking-wider">
            Target Ciphertext / Transmission Capture
          </span>
          <div className="text-rose-300 text-sm font-bold break-all select-all">
            {scenario.sampleCiphertext}
          </div>
        </div>

        {/* Attack Guidance & Methodology */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-500" />
            Attack Methodology & Step-by-Step Guidance
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {scenario.guidance.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-slate-200 dark:border-slate-800">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Submission Form */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Submit Recovered Plaintext / Exploit Flag:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={flagInputs[scenario.id] || ''}
              onChange={e =>
                setFlagInputs(prev => ({ ...prev, [scenario.id]: e.target.value }))
              }
              onKeyDown={e => {
                if (e.key === 'Enter') handleVerifyFlag();
              }}
              placeholder="e.g. THE SECRET CODE IS..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Button size="md" variant="danger" onClick={handleVerifyFlag}>
              Submit Flag
            </Button>
          </div>

          {feedback[scenario.id] === 'correct' && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-emerald-950 dark:text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Exploit Validated! Target Cracked! (+{scenario.xpReward} XP)
              </span>
              <p>You have successfully applied cryptanalysis principles to extract the message.</p>
            </div>
          )}

          {feedback[scenario.id] === 'incorrect' && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Flag incorrect. Tip: Review the guidance or test in the Cryptanalysis Lab!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
