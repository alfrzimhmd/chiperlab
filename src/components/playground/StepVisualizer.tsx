import { useState } from 'react';
import { TransformationStep } from '../../types/crypto';
import { ArrowDown, Sparkles } from 'lucide-react';

interface StepVisualizerProps {
  plaintext: string;
  ciphertext: string;
  algorithmName: string;
  shiftOrKeyLabel?: string;
  steps?: TransformationStep[];
  mode?: 'encrypt' | 'decrypt';
}

export function StepVisualizer({
  plaintext,
  ciphertext,
  algorithmName,
  shiftOrKeyLabel,
  steps = [],
  mode = 'encrypt',
}: StepVisualizerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  if (!steps || steps.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center text-xs text-[var(--text-secondary)]">
        Step-by-step trace is available for character transformation algorithms (Caesar, Atbash, Vigenère, XOR).
      </div>
    );
  }

  const displaySteps = steps.slice(0, 24);
  const hasMore = steps.length > 24;

  return (
    <div id="step-by-step-visualizer" className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Step-by-Step Transformation Trace
        </h4>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
          {displaySteps.length} of {steps.length} operations
        </span>
      </div>

      {/* Overview flow banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center text-xs">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
            {mode === 'encrypt' ? 'PLAINTEXT' : 'CIPHERTEXT'}
          </span>
          <span className="font-mono font-bold text-[var(--text-primary)] text-sm break-all">
            {plaintext ? (plaintext.length > 24 ? plaintext.slice(0, 24) + '...' : plaintext) : '—'}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-1 sm:py-0 border-y sm:border-y-0 sm:border-x border-[var(--border-main)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
            {algorithmName}
          </span>
          <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
            {shiftOrKeyLabel || (mode === 'encrypt' ? 'Encryption' : 'Decryption')}
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-cyan-400 mt-1" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
            {mode === 'encrypt' ? 'CIPHERTEXT' : 'PLAINTEXT'}
          </span>
          <span className="font-mono font-bold text-emerald-400 text-sm break-all">
            {ciphertext ? (ciphertext.length > 24 ? ciphertext.slice(0, 24) + '...' : ciphertext) : '—'}
          </span>
        </div>
      </div>

      {/* Character steps grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {displaySteps.map((step, idx) => {
          const isSelected = activeStepIndex === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStepIndex(isSelected ? null : idx)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm'
                  : 'bg-[var(--surface-main)] border-[var(--border-main)] hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-2">
                <span>#{idx + 1}</span>
                {step.substeps && <span className="text-cyan-400">details</span>}
              </div>

              <div className="flex items-center justify-center gap-1.5 font-mono">
                <span className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
                  {step.inputChar === ' ' ? '␣' : step.inputChar}
                </span>
                <span className="text-[var(--text-secondary)] text-xs">→</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {step.outputChar === ' ' ? '␣' : step.outputChar}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Details box */}
      {activeStepIndex !== null && displaySteps[activeStepIndex] && (
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs animate-in fade-in duration-150">
          <div className="font-mono font-semibold text-cyan-400 mb-2 flex items-center gap-2">
            <span>Step #{activeStepIndex + 1}:</span>
            <span className="font-mono bg-[var(--surface-main)] px-2 py-0.5 rounded border border-[var(--border-main)] text-[var(--text-primary)]">
              '{displaySteps[activeStepIndex].inputChar}' → '{displaySteps[activeStepIndex].outputChar}'
            </span>
          </div>

          <p className="text-[var(--text-secondary)] mb-2">
            {displaySteps[activeStepIndex].explanation}
          </p>

          {displaySteps[activeStepIndex].substeps && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-cyan-500/20">
              {displaySteps[activeStepIndex].substeps!.map((sub, sIdx) => (
                <div key={sIdx} className="bg-[var(--surface-main)] p-2 rounded-lg border border-[var(--border-main)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                    {sub.label}
                  </span>
                  <span className="font-mono font-bold text-[var(--text-primary)] text-xs">
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasMore && (
        <p className="text-[11px] text-center font-mono text-[var(--text-secondary)] italic">
          + {steps.length - 24} more characters processed with same rule.
        </p>
      )}
    </div>
  );
}