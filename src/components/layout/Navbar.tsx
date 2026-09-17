import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Terminal,
  Trophy,
  Activity,
  Menu,
  X,
  ChevronDown,
  Zap,
  Info,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { BrandIcon } from '../common/BrandIcon';
import { useProgress } from '../../hooks/useProgress';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const { progress } = useProgress();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleDropdownEnter = (id: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const dropdowns = {
    learn: {
      label: 'Learn',
      icon: BookOpen,
      to: '/learn',
      accent: 'cyan',
      items: [
        {
          to: '/learn/fundamentals',
          title: 'Fundamentals',
          desc: '12 core concepts & CIA triad',
          icon: BookOpen,
        },
        {
          to: '/learn/algorithms',
          title: 'Algorithms',
          desc: 'Classical & modern ciphers',
          icon: Shield,
        },
        {
          to: '/learn/roadmap',
          title: 'Learning Roadmap',
          desc: 'Level 01 → Level 07 path',
          icon: Sparkles,
        },
      ],
    },
    playground: {
      label: 'Playground',
      icon: Terminal,
      to: '/playground',
      accent: 'purple',
      items: [
        {
          to: '/playground/encrypt',
          title: 'Encrypt / Decrypt',
          desc: 'Caesar, Vigenère, AES, RSA',
          icon: Terminal,
        },
        {
          to: '/playground/hash',
          title: 'Hash Generator',
          desc: 'SHA-256, SHA-512 digests',
          icon: Zap,
        },
        {
          to: '/playground/analyze',
          title: 'Cryptanalysis',
          desc: 'Frequency & Caesar brute-force',
          icon: Shield,
        },
      ],
    },
    challenges: {
      label: 'Challenges',
      icon: Trophy,
      to: '/challenges',
      accent: 'amber',
      items: [
        {
          to: '/challenges/quiz',
          title: 'Interactive Quiz',
          desc: 'Test concepts and earn XP',
          icon: Trophy,
        },
        {
          to: '/challenges/puzzle',
          title: 'Crypto Puzzles',
          desc: 'Decrypt intercepted messages',
          icon: Sparkles,
        },
        {
          to: '/challenges/attack',
          title: 'Attack Simulations',
          desc: 'Hands-on cryptanalysis',
          icon: Shield,
        },
      ],
    },
  };

  const accentMap = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      gradient: 'from-cyan-500 to-blue-500',
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      gradient: 'from-purple-500 to-pink-500',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      gradient: 'from-amber-500 to-orange-500',
    },
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--border-main)] bg-[var(--bg-main)]/90 shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'border-b border-transparent bg-[var(--bg-main)]/60'
      } backdrop-blur-xl`}
    >
      <div className="max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ============ BRAND ============ */}
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0 relative min-w-0"
            aria-label="ChiperLab Home"
          >
            {/* Icon */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/60 transition-all duration-300">
                <BrandIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Brand text — SELALU TAMPIL di semua ukuran */}
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-extrabold text-[13px] sm:text-[15px] tracking-tight text-[var(--text-primary)] leading-tight truncate">
                ChiperLab
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.18em] text-cyan-400/80 leading-tight mt-0.5 sm:mt-1 truncate">
                Cryptography Academy
              </span>
            </div>
          </Link>

          {/* ============ DESKTOP NAV ============ */}
          <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-[var(--surface-secondary)]/50 border border-[var(--border-main)]/60 backdrop-blur-sm">
            <NavTab to="/" active={isActive('/')} label="Dashboard" />

            {(Object.entries(dropdowns) as [keyof typeof dropdowns, typeof dropdowns.learn][]).map(
              ([key, cfg]) => {
                const accent = accentMap[cfg.accent as keyof typeof accentMap];
                const Icon = cfg.icon;
                const isOpen = openDropdown === key;
                const active = isActive(cfg.to);

                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      to={cfg.to}
                      className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        active
                          ? `${accent.text} ${accent.bg}`
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-main)]/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 opacity-80" strokeWidth={2.5} />
                      <span>{cfg.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        strokeWidth={2.5}
                      />
                    </Link>

                    {isOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div
                          className={`relative w-[300px] p-2 bg-[var(--surface-main)] rounded-2xl shadow-2xl border ${accent.border} overflow-hidden`}
                        >
                          <div
                            className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent.gradient}`}
                          />

                          <div
                            className={`absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--surface-main)] border-t border-l ${accent.border} rotate-45 rounded-sm`}
                          />

                          <div className="relative pt-1">
                            {cfg.items.map(item => {
                              const ItemIcon = item.icon;
                              return (
                                <Link
                                  key={item.to}
                                  to={item.to}
                                  className="group/item flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-secondary)] transition-all duration-150"
                                >
                                  <div
                                    className={`shrink-0 w-8 h-8 rounded-lg ${accent.bg} ${accent.border} border flex items-center justify-center ${accent.text} mt-0.5 group-hover/item:scale-110 transition-transform duration-200`}
                                  >
                                    <ItemIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[13px] font-semibold text-[var(--text-primary)] group-hover/item:text-cyan-400 transition-colors block">
                                      {item.title}
                                    </span>
                                    <span className="text-[11px] font-mono text-[var(--text-secondary)] block mt-0.5">
                                      {item.desc}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}

            <NavTab
              to="/progress"
              active={isActive('/progress')}
              label="Progress"
              icon={Activity}
            />
            <NavTab to="/about" active={isActive('/about')} label="About" icon={Info} />
          </nav>

          {/* ============ RIGHT SIDE ============ */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/progress"
              id="navbar-xp-indicator"
              className="group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold hover:border-amber-500/50 hover:from-amber-500/20 transition-all duration-200"
              title="Your learning XP"
            >
              <span className="relative flex items-center">
                <Zap
                  className="w-3.5 h-3.5 fill-amber-400 group-hover:scale-110 transition-transform duration-200"
                  strokeWidth={2.5}
                />
              </span>
              <span className="hidden sm:inline">{progress.totalXp} XP</span>
              <span className="sm:hidden">{progress.totalXp}</span>
            </Link>

            <div className="w-px h-6 bg-[var(--border-main)] hidden sm:block" />

            <ThemeToggle />

            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ============ MOBILE DRAWER ============ */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden border-t border-[var(--border-main)] bg-[var(--bg-main)]/98 backdrop-blur-xl px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <MobileLink to="/" onClick={closeMobile} icon={Shield}>
            Dashboard
          </MobileLink>

          <MobileSection label="Learn" accent="cyan" />
          <MobileLink to="/learn/fundamentals" onClick={closeMobile} indent accent="cyan" icon={BookOpen}>
            Fundamentals
          </MobileLink>
          <MobileLink to="/learn/algorithms" onClick={closeMobile} indent accent="cyan" icon={Shield}>
            Algorithms Catalog
          </MobileLink>
          <MobileLink to="/learn/roadmap" onClick={closeMobile} indent accent="cyan" icon={Sparkles}>
            Learning Roadmap
          </MobileLink>

          <MobileSection label="Playground" accent="purple" />
          <MobileLink to="/playground/encrypt" onClick={closeMobile} indent accent="purple" icon={Terminal}>
            Encrypt / Decrypt
          </MobileLink>
          <MobileLink to="/playground/hash" onClick={closeMobile} indent accent="purple" icon={Zap}>
            Hash Generator
          </MobileLink>
          <MobileLink to="/playground/analyze" onClick={closeMobile} indent accent="purple" icon={Shield}>
            Cryptanalysis Lab
          </MobileLink>

          <MobileSection label="Challenges" accent="amber" />
          <MobileLink to="/challenges/quiz" onClick={closeMobile} indent accent="amber" icon={Trophy}>
            Interactive Quiz
          </MobileLink>
          <MobileLink to="/challenges/puzzle" onClick={closeMobile} indent accent="amber" icon={Sparkles}>
            Crypto Puzzles
          </MobileLink>
          <MobileLink to="/challenges/attack" onClick={closeMobile} indent accent="amber" icon={Shield}>
            Attack Simulations
          </MobileLink>

          <MobileSection label="Other" accent="neutral" />
          <MobileLink to="/progress" onClick={closeMobile} accent="neutral" icon={Activity}>
            My Progress
          </MobileLink>
          <MobileLink to="/about" onClick={closeMobile} accent="neutral" icon={Info}>
            About ChiperLab
          </MobileLink>
        </div>
      )}
    </header>
  );
}

function NavTab({
  to,
  active,
  label,
  icon: Icon,
}: {
  to: string;
  active: boolean;
  label: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <Link
      to={to}
      className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
        active
          ? 'text-cyan-400 bg-cyan-500/10'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-main)]/60'
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 opacity-80" strokeWidth={2.5} />}
      <span>{label}</span>
      {active && (
        <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
      )}
    </Link>
  );
}

const mobileAccent = {
  cyan: {
    section: 'text-cyan-400',
    icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    hover: 'hover:bg-cyan-500/5',
  },
  purple: {
    section: 'text-purple-400',
    icon: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    hover: 'hover:bg-purple-500/5',
  },
  amber: {
    section: 'text-amber-400',
    icon: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    hover: 'hover:bg-amber-500/5',
  },
  neutral: {
    section: 'text-[var(--text-secondary)]',
    icon: 'text-[var(--text-secondary)] bg-[var(--surface-secondary)] border-[var(--border-main)]',
    hover: 'hover:bg-[var(--surface-secondary)]',
  },
};

function MobileSection({
  label,
  accent = 'neutral',
}: {
  label: string;
  accent?: keyof typeof mobileAccent;
}) {
  const a = mobileAccent[accent];
  return (
    <div
      className={`pt-4 pb-1 text-[10px] font-mono font-bold uppercase tracking-[0.15em] px-3 flex items-center gap-2 ${a.section}`}
    >
      <span className="w-3 h-px bg-current opacity-40" />
      {label}
    </div>
  );
}

function MobileLink({
  to,
  onClick,
  children,
  indent,
  icon: Icon,
  accent = 'neutral',
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
  indent?: boolean;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent?: keyof typeof mobileAccent;
}) {
  const a = mobileAccent[accent];
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] ${a.hover} transition-colors ${
        indent ? 'pl-4' : ''
      }`}
    >
      {Icon && (
        <span
          className={`shrink-0 w-7 h-7 rounded-lg ${a.icon} border flex items-center justify-center`}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
      )}
      <span>{children}</span>
    </Link>
  );
}