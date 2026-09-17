import { ShieldAlert, Info } from 'lucide-react';

interface SecurityNoticeProps {
  id?: string;
  type?: 'general' | 'classical';
  className?: string;
}

export function SecurityNotice({
  id = 'security-notice-banner',
  type = 'general',
  className = '',
}: SecurityNoticeProps) {
  if (type === 'classical') {
    return (
      <div
        id={id}
        className={`flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-[var(--text-primary)] leading-relaxed animate-in fade-in duration-300 ${className}`}
      >
        <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
        </div>
        <div className="pt-0.5">
          <span className="font-bold block text-amber-400 mb-1 font-mono text-[11px] tracking-wider uppercase">
            Educational Cryptography Notice
          </span>
          <span className="text-[var(--text-secondary)]">
            Classical ciphers (Caesar, Atbash, Vigenère, simple XOR) are strictly educational
            and should never be used to protect sensitive real-world applications or production secrets.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-[var(--text-primary)] leading-relaxed animate-in fade-in duration-300 ${className}`}
    >
      <div className="shrink-0 w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
        <Info className="w-4 h-4 text-cyan-400" />
      </div>
      <div className="pt-0.5">
        <span className="font-bold block text-cyan-400 mb-1 font-mono text-[11px] tracking-wider uppercase">
          Educational Use Only
        </span>
        <span className="text-[var(--text-secondary)]">
          ChiperLab is designed for learning and experimentation. All computations execute
          locally in your browser memory. Do not use this playground to protect real-world
          confidential passwords, private keys, or production data.
        </span>
      </div>
    </div>
  );
}