import { useState } from 'react';
import { Info } from 'lucide-react';
import { InfoModal, InfoSection } from './InfoModal';

interface CardInfoButtonProps {
  title: string;
  subtitle?: string;
  sections: InfoSection[];
  /** Optional custom aria-label */
  ariaLabel?: string;
}

export function CardInfoButton({
  title,
  subtitle,
  sections,
  ariaLabel,
}: CardInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="shrink-0 w-6 h-6 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors cursor-pointer"
        aria-label={ariaLabel || `Show info about ${title}`}
        title="Click for details"
      >
        <Info className="w-3 h-3" strokeWidth={2.5} />
      </button>

      <InfoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        subtitle={subtitle}
        sections={sections}
      />
    </>
  );
}