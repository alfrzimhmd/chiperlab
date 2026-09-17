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
        className="flex items-center gap-1.5 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
      >
        <CurrentIcon className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        <span className="text-xs font-medium hidden sm:inline capitalize">
          {theme === 'system' ? 'System' : theme}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          id="theme-dropdown-menu"
          className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
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
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{option.label}</span>
                {isSelected && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
