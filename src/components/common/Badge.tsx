import { ReactNode } from 'react';

interface BadgeProps {
  id?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export function Badge({
  id,
  variant = 'neutral',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-full whitespace-nowrap transition-colors';
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  const variants = {
    primary: 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    accent: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80',
  };

  return (
    <span id={id} className={`${base} ${sizeClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
