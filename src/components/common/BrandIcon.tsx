import { SVGProps } from 'react';

interface BrandIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * ChiperLab brand icon.
 * Matches the favicon: shield outline + center vertical line + dot.
 */
export function BrandIcon({ className = 'w-4.5 h-4.5', ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Shield outline */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      {/* Center vertical line */}
      <path d="M12 8v4" />
      {/* Dot */}
      <path d="M12 16h.01" />
    </svg>
  );
}