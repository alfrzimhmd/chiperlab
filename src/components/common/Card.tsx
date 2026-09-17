import { ReactNode } from 'react';

interface CardProps {
  id?: string;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  id,
  children,
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  const hoverClasses = hoverable
    ? 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
