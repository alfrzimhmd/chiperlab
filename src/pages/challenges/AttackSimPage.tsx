import { useState } from 'react';
import { ATTACK_SCENARIOS } from '../../data/challenges';
import { useProgress } from '../../hooks/useProgress';
import {
  ShieldAlert,
  Terminal,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Zap,
  Target,
  Info,
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
  const completedCount = ATTACK_SCENARIOS.filter(a => isChallengeCompleted(a.id)).length;

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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-rose-500/30 bg-rose-500/10 text-rose-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Interactive Attack Simulations
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Cryptanalysis Attack Simulations
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Experience how cryptographic flaws and weak keyspaces are exploited by adversaries.
              Submit recovered flags to earn XP.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)]">
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                Exploited
              </span>
              <span className="text-lg font-extrabold font-mono text-emerald-400">
                {completedCount}/{ATTACK_SCENARIOS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Select Scenario
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ATTACK_SCENARIOS.map((sc, idx) => {
            const isDone = isChallengeCompleted(sc.id);
            const isSelected = sc.id === scenario.id;

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveAttackId(sc.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-black'
                    : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-rose-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                {isDone ? (
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
                <span>{sc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Scenario Content (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-rose-500/30 shadow-lg space-y-6">
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

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-amber-400 font-semibold">+{scenario.xpReward} XP</span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> EXPLOITED
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {scenario.title}
              </h2>
              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                Target Primitive: <span className="text-rose-400">{scenario.targetCipher}</span>
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {scenario.description}
              </p>
            </div>

            {/* Ciphertext */}
            <div className="p-5 rounded-xl bg-[#0A0C10] border border-[#1E222B] space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-secondary)] block">
                Target Ciphertext / Intercept
              </span>
              <div className="text-rose-300 text-sm font-mono font-bold break-all select-all leading-relaxed">
                {scenario.sampleCiphertext}
              </div>
            </div>
          </div>

          {/* Attack Methodology */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Attack Methodology
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Step-by-step guidance
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              {scenario.guidance.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-main)] text-cyan-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Submit Recovered Plaintext
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Case-insensitive. Whitespace trimmed.
                </p>
              </div>
            </div>

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
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
              />
              <Button size="md" variant="danger" onClick={handleVerifyFlag}>
                Submit Flag
              </Button>
            </div>

            {feedback[scenario.id] === 'correct' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
                <span className="font-mono font-bold flex items-center gap-1.5 text-emerald-400 text-[11px] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Exploit Validated! (+{scenario.xpReward} XP)
                </span>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  You have successfully applied cryptanalysis principles to extract the message.
                </p>
              </div>
            )}

            {feedback[scenario.id] === 'incorrect' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-[var(--text-secondary)]">
                  Flag incorrect. Review the methodology above or test in the Cryptanalysis Lab!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Info Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Scenario Meta */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Scenario Details
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)]">Technique</span>
                <span className="text-[var(--text-primary)] capitalize">{scenario.technique}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)]">Difficulty</span>
                <span className="text-[var(--text-primary)] capitalize">
                  {scenario.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)]">Steps</span>
                <span className="text-[var(--text-primary)]">{scenario.guidance.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">XP Reward</span>
                <span className="text-amber-400 font-bold">+{scenario.xpReward}</span>
              </div>
            </div>
          </div>

          {/* Vulnerability Explainer */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Why This Fails
              </h3>
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {scenario.technique === 'brute-force' &&
                'The Caesar keyspace has only 25 possibilities. A computer can test all shifts in microseconds, then detect readable English output.'}
              {scenario.technique === 'frequency-analysis' &&
                'Monoalphabetic substitution preserves the statistical fingerprint of natural language. E always appears ~12.7% — directly mapping it to the ciphertext peak reveals the shift.'}
              {scenario.technique === 'xor-reuse' &&
                'When the same XOR key encrypts two messages, C1 ⊕ C2 = P1 ⊕ P2. The secret keystream cancels entirely, exposing both plaintexts.'}
            </p>
          </div>

          {/* Tips */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Tips
              </h3>
            </div>

            <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Follow the guidance steps in order.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Use the Cryptanalysis Lab for practice tools.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Flags are full plaintext sentences, not single words.</span>
              </li>
            </ul>

            <a
              href="#/playground/analyze"
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] hover:border-cyan-500/40 transition-colors text-xs mt-2"
            >
              <span className="font-mono text-[var(--text-primary)]">Open Lab</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}