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
        className={`flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed ${className}`}
      >
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-amber-950 dark:text-amber-100">
            Educational Cryptography Notice
          </span>
          Classical ciphers (Caesar, Atbash, Vigenère, simple XOR) are strictly educational and should never be used to protect sensitive real-world applications or production secrets.
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`flex items-start gap-3 p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs text-sky-900 dark:text-sky-200 leading-relaxed ${className}`}
    >
      <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold block text-sky-950 dark:text-sky-100">
          Educational Use Only
        </span>
        ChiperLab is designed for learning and experimentation. All computations execute locally in your browser memory. Do not use this playground to protect real-world confidential passwords, private keys, or production data.
      </div>
    </div>
  );
}
