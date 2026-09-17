import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { ThemeMode } from '../../types/progress';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Laptop },
  ];

  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="theme-toggle-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle display theme"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors focus:outline-none cursor-pointer"
      >
        <CurrentIcon className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-mono hidden sm:inline capitalize">
          {theme === 'system' ? 'System' : theme}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          id="theme-dropdown-menu"
          className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-[var(--surface-main)] shadow-2xl border border-[var(--border-main)] py-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map(option => {
            const Icon = option.icon;
            const isSelected = theme === option.mode;
            return (
              <button
                key={option.mode}
                id={`theme-option-${option.mode}`}
                type="button"
                onClick={() => {
                  setTheme(option.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/10 text-cyan-400 font-mono font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : ''}`} />
                <span className="font-mono">{option.label}</span>
                {isSelected && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}