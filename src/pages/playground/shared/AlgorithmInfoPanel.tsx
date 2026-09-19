import { Info, ShieldCheck, Zap } from 'lucide-react';

interface AlgorithmInfoPanelProps {
  title: string;
  type: 'Classical' | 'Modern' | 'Encoding';
  strength: 'Educational' | 'Weak' | 'Strong' | 'Industry';
  keyspace: string;
  description: string;
  highlights: string[];
}

export function AlgorithmInfoPanel({
  title,
  type,
  strength,
  keyspace,
  description,
  highlights,
}: AlgorithmInfoPanelProps) {
  const strengthColor = {
    Educational: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Weak: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    Strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Industry: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  }[strength];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Algorithm Profile
          </h3>
          <p className="text-[10px] font-mono text-[var(--text-secondary)]">
            {type === 'Classical' && 'No step-by-step trace available'}
            {type === 'Modern' && 'Executed via Web Crypto API'}
            {type === 'Encoding' && 'Reversible without a key'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-bold text-[var(--text-primary)]">{title}</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Family
          </span>
          <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
            {type}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Security
          </span>
          <span
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${strengthColor}`}
          >
            {strength}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Keyspace
          </span>
          <span className="text-xs font-mono text-[var(--text-primary)]">{keyspace}</span>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-[var(--border-main)]">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
          Key Characteristics
        </span>
        <ul className="space-y-1.5">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
              <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {type === 'Modern' && (
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Executes via hardware-accelerated{' '}
            <code className="text-cyan-300 font-mono">crypto.subtle</code>.
          </span>
        </div>
      )}

      {type === 'Classical' && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Educational only. Step-by-step trace appears when you enter input text.
          </span>
        </div>
      )}

      {type === 'Encoding' && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            NOT encryption. Provides zero confidentiality.
          </span>
        </div>
      )}
    </div>
  );
}