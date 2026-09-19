import { Cpu } from 'lucide-react';

export function ExecutionInfo() {
  return (
    <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Cpu className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Execution Environment
        </h3>
      </div>
      <div className="space-y-2 text-[11px] font-mono text-[var(--text-secondary)]">
        <div className="flex items-center justify-between py-1 border-b border-[var(--border-main)]">
          <span>Runtime</span>
          <span className="text-[var(--text-primary)]">Browser Web Crypto</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-[var(--border-main)]">
          <span>Location</span>
          <span className="text-[var(--text-primary)]">Client-side only</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span>Round-trips</span>
          <span className="text-emerald-400">0 (offline capable)</span>
        </div>
      </div>
    </div>
  );
}