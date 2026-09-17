interface ProgressBarProps {
  id?: string;
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'success' | 'amber' | 'indigo' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  id,
  value,
  max = 100,
  label,
  showPercent = false,
  color = 'primary',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const barColors = {
    primary: 'bg-cyan-500',
    success: 'bg-emerald-500',
    amber: 'bg-amber-500',
    indigo: 'bg-purple-500',
    teal: 'bg-teal-500',
  };

  return (
    <div id={id} className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-mono text-[var(--text-secondary)] mb-2">
          {label && <span>{label}</span>}
          {showPercent && <span className="text-[var(--text-primary)]">{percentage}%</span>}
        </div>
      )}
      <div
        className={`w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[color]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}