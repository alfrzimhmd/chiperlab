import { ReactNode } from 'react';

interface CardProps {
  id?: string;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  id,
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const hoverClasses = hoverable
    ? 'hover:border-cyan-500/40 hover:shadow-xl transition-all duration-300 cursor-pointer'
    : '';

  const variantClasses = {
    default:
      'bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg',
    elevated:
      'bg-[var(--surface-main)] border border-[var(--border-main)] shadow-2xl',
    subtle:
      'bg-[var(--surface-secondary)] border border-[var(--border-main)]',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}