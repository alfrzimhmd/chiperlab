import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, Lightbulb, AlertTriangle, ShieldAlert, BookOpen } from 'lucide-react';

export interface InfoSection {
  heading?: string;
  body: string;
  icon?: 'tip' | 'warning' | 'danger' | 'info' | 'book';
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  sections: InfoSection[];
}

const SECTION_ICONS = {
  tip: { Icon: Lightbulb, color: 'text-emerald-400' },
  warning: { Icon: AlertTriangle, color: 'text-amber-400' },
  danger: { Icon: ShieldAlert, color: 'text-rose-400' },
  info: { Icon: Info, color: 'text-cyan-400' },
  book: { Icon: BookOpen, color: 'text-purple-400' },
};

export function InfoModal({
  isOpen,
  onClose,
  title,
  subtitle,
  sections,
}: InfoModalProps) {
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ============================================================
  // RENDER VIA PORTAL — bypasses all stacking contexts / transforms
  // ============================================================
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      {/* Backdrop — full screen */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal container */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* ---------- Header (sticky at top) ---------- */}
        <div className="shrink-0 flex items-start gap-3 p-5 sm:p-6 border-b border-[var(--border-main)] bg-[var(--surface-secondary)]">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Info className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="info-modal-title"
              className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-xs font-mono text-[var(--text-secondary)] mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg hover:bg-[var(--surface-main)] border border-transparent hover:border-[var(--border-main)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Close info modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ---------- Body (scrollable) ---------- */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 custom-modal-scroll">
          {sections.map((section, idx) => {
            const iconConfig = section.icon ? SECTION_ICONS[section.icon] : null;
            const SectionIcon = iconConfig?.Icon;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2"
              >
                {section.heading && (
                  <div className="flex items-center gap-2">
                    {SectionIcon && (
                      <SectionIcon
                        className={`w-3.5 h-3.5 shrink-0 ${iconConfig.color}`}
                        strokeWidth={2.5}
                      />
                    )}
                    <h3
                      className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                        iconConfig ? iconConfig.color : 'text-cyan-400'
                      }`}
                    >
                      {section.heading}
                    </h3>
                  </div>
                )}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* ---------- Footer (sticky at bottom) ---------- */}
        <div className="shrink-0 p-4 border-t border-[var(--border-main)] bg-[var(--surface-secondary)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-lg bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}