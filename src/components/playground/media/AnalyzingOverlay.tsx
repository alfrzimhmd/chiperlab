import { useEffect, useState } from 'react';
import { Loader2, FileSearch, Activity, Hash, BarChart3 } from 'lucide-react';

interface AnalyzingOverlayProps {
  fileName: string;
  fileSize: string;
  /** Kalau true, overlay akan fade out */
  done?: boolean;
}

const STEPS = [
  { icon: FileSearch, label: 'Reading file bytes…' },
  { icon: Hash, label: 'Parsing header structure…' },
  { icon: BarChart3, label: 'Computing byte statistics…' },
  { icon: Activity, label: 'Measuring Shannon entropy…' },
];

export function AnalyzingOverlay({ fileName, fileSize, done = false }: AnalyzingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle steps every 400ms
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setStepIndex(i => (i + 1) % STEPS.length);
    }, 400);
    return () => clearInterval(t);
  }, [done]);

  // Progress bar animasi 0→95%
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setProgress(p => (p >= 95 ? 95 : p + 3));
    }, 60);
    return () => clearInterval(t);
  }, [done]);

  const CurrentIcon = STEPS[stepIndex].icon;

  return (
    <div
      className={`p-6 rounded-2xl border border-purple-500/30 bg-[var(--surface-main)] shadow-lg transition-opacity duration-300 ${
        done ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner + icon */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <CurrentIcon className="w-5 h-5 text-purple-400" key={stepIndex} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-sm font-mono font-bold text-[var(--text-primary)]">
            Analyzing File
          </p>
          <p className="text-[11px] font-mono text-[var(--text-secondary)] truncate max-w-xs">
            {fileName} · {fileSize}
          </p>
        </div>

        {/* Step label */}
        <p className="text-[10px] font-mono text-purple-400 animate-pulse">
          {STEPS[stepIndex].label}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-sm space-y-1.5">
          <div className="h-1.5 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-[var(--text-secondary)]">
            <span>Processing in browser</span>
            <span className="text-purple-400 font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}