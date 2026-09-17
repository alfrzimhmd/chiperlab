import { useState } from 'react';
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
  Sparkles,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useProgress } from '../../hooks/useProgress';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnDropdown, setLearnDropdown] = useState(false);
  const [playDropdown, setPlayDropdown] = useState(false);
  const [challengeDropdown, setChallengeDropdown] = useState(false);

  const location = useLocation();
  const { progress } = useProgress();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setLearnDropdown(false);
    setPlayDropdown(false);
    setChallengeDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="ChiperLab Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-150">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                ChiperLab
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Academy
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </Link>

            {/* Learn Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setLearnDropdown(true)}
              onMouseLeave={() => setLearnDropdown(false)}
            >
              <Link
                to="/learn"
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/learn')
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4 opacity-70" />
                <span>Learn</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>
              {learnDropdown && (
                <div className="absolute top-full left-0 w-52 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    to="/learn/fundamentals"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Fundamentals</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">12 core concepts & CIA triad</span>
                  </Link>
                  <Link
                    to="/learn/algorithms"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Algorithms</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Classical & modern ciphers</span>
                  </Link>
                  <Link
                    to="/learn/roadmap"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Learning Roadmap</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Level 01 to Level 07 path</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Playground Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPlayDropdown(true)}
              onMouseLeave={() => setPlayDropdown(false)}
            >
              <Link
                to="/playground"
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/playground')
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Terminal className="w-4 h-4 opacity-70" />
                <span>Playground</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>
              {playDropdown && (
                <div className="absolute top-full left-0 w-52 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    to="/playground/encrypt"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Encrypt / Decrypt</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Caesar, Vigenère, AES, RSA</span>
                  </Link>
                  <Link
                    to="/playground/hash"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Hash Generator</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">SHA-256, SHA-512 digests</span>
                  </Link>
                  <Link
                    to="/playground/analyze"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Cryptanalysis Tools</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Frequency & Caesar Brute Force</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Challenges Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setChallengeDropdown(true)}
              onMouseLeave={() => setChallengeDropdown(false)}
            >
              <Link
                to="/challenges"
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/challenges')
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Trophy className="w-4 h-4 opacity-70" />
                <span>Challenges</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>
              {challengeDropdown && (
                <div className="absolute top-full left-0 w-52 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    to="/challenges/quiz"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Interactive Quiz</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Test concepts and earn XP</span>
                  </Link>
                  <Link
                    to="/challenges/puzzle"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Crypto Puzzles</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Decrypt intercepted messages</span>
                  </Link>
                  <Link
                    to="/challenges/attack"
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Attack Simulations</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Caesar crack & frequency attack</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/progress"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/progress')
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 opacity-70" />
              <span>Progress</span>
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* XP Badge */}
            <Link
              to="/progress"
              id="navbar-xp-indicator"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              title="Your learning XP"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{progress.totalXp} XP</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top duration-150"
        >
          <Link
            to="/"
            onClick={closeMobile}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Dashboard
          </Link>

          <div className="pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Learn
          </div>
          <Link
            to="/learn/fundamentals"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Fundamentals (12 Lessons)
          </Link>
          <Link
            to="/learn/algorithms"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Algorithms (Classical & Modern)
          </Link>
          <Link
            to="/learn/roadmap"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Learning Roadmap (Levels 1-7)
          </Link>

          <div className="pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Playground
          </div>
          <Link
            to="/playground/encrypt"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Encrypt / Decrypt Tool
          </Link>
          <Link
            to="/playground/hash"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Hash Generator (SHA-256/512)
          </Link>
          <Link
            to="/playground/analyze"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cryptanalysis (Frequency & Brute Force)
          </Link>

          <div className="pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Challenges
          </div>
          <Link
            to="/challenges/quiz"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Interactive Quiz
          </Link>
          <Link
            to="/challenges/puzzle"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Crypto Puzzles
          </Link>
          <Link
            to="/challenges/attack"
            onClick={closeMobile}
            className="block px-3 py-2 pl-5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Attack Simulations
          </Link>

          <div className="pt-2">
            <Link
              to="/progress"
              onClick={closeMobile}
              className="block px-3 py-2 rounded-xl text-base font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50"
            >
              My Progress & Achievements
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
