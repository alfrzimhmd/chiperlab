import { ReactNode } from 'react';

interface BadgeProps {
  id?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({
  id,
  variant = 'neutral',
  size = 'sm',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  const base =
    'inline-flex items-center gap-1.5 font-mono font-semibold rounded-md whitespace-nowrap transition-colors';
  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variants = {
    primary: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    neutral:
      'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-main)]',
    accent: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
  };

  const dotColors = {
    primary: 'bg-cyan-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    neutral: 'bg-[var(--text-secondary)]',
    accent: 'bg-purple-400',
  };

  return (
    <span id={id} className={`${base} ${sizeClasses} ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}