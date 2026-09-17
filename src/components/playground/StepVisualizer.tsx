import { useState } from 'react';
import { TransformationStep } from '../../types/crypto';
import { ArrowDown, ChevronRight, Eye, Sparkles } from 'lucide-react';

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
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        Step-by-step trace is available for character transformation algorithms (Caesar, Atbash, Vigenère, XOR).
      </div>
    );
  }

  // Display up to 24 steps to avoid excessive DOM length, with pagination / expansion indicator
  const displaySteps = steps.slice(0, 24);
  const hasMore = steps.length > 24;

  return (
    <div id="step-by-step-visualizer" className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          Step-by-Step Transformation Trace
        </h4>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Showing {displaySteps.length} of {steps.length} character operations
        </span>
      </div>

      {/* Overview flow banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
            {mode === 'encrypt' ? 'PLAINTEXT INPUT' : 'CIPHERTEXT INPUT'}
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm break-all">
            {plaintext ? (plaintext.length > 24 ? plaintext.slice(0, 24) + '...' : plaintext) : '—'}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-1 sm:py-0 border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 block mb-0.5">
            {algorithmName}
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {shiftOrKeyLabel || (mode === 'encrypt' ? 'Encryption Transformation' : 'Decryption Inversion')}
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-sky-500 mt-1" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
            {mode === 'encrypt' ? 'CIPHERTEXT OUTPUT' : 'DECRYPTED PLAINTEXT'}
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm break-all">
            {ciphertext ? (ciphertext.length > 24 ? ciphertext.slice(0, 24) + '...' : ciphertext) : '—'}
          </span>
        </div>
      </div>

      {/* Individual Character Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {displaySteps.map((step, idx) => {
          const isSelected = activeStepIndex === idx;
          const isAlpha = /[a-zA-Z0-9]/.test(step.inputChar);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStepIndex(isSelected ? null : idx)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-1 font-mono">
                <span>#{idx + 1}</span>
                {step.substeps && <span className="text-sky-500 text-[9px]">details</span>}
              </div>

              <div className="flex items-center justify-center gap-1.5 font-mono py-1">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-200">
                  {step.inputChar === ' ' ? '␣' : step.inputChar}
                </span>
                <span className="text-slate-400 text-xs">→</span>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {step.outputChar === ' ' ? '␣' : step.outputChar}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Details Box when a character step is selected */}
      {activeStepIndex !== null && displaySteps[activeStepIndex] && (
        <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs animate-in fade-in duration-150">
          <div className="font-semibold text-sky-900 dark:text-sky-200 mb-1.5 flex items-center gap-2">
            <span>Character Step #{activeStepIndex + 1}:</span>
            <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800 text-slate-800 dark:text-slate-200">
              '{displaySteps[activeStepIndex].inputChar}' → '{displaySteps[activeStepIndex].outputChar}'
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 mb-2">
            {displaySteps[activeStepIndex].explanation}
          </p>

          {displaySteps[activeStepIndex].substeps && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-sky-200/60 dark:border-sky-800/50">
              {displaySteps[activeStepIndex].substeps!.map((sub, sIdx) => (
                <div key={sIdx} className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-sky-100 dark:border-sky-900/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    {sub.label}
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasMore && (
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 italic">
          + {steps.length - 24} more characters processed using the same mathematical rule.
        </p>
      )}
    </div>
  );
}
