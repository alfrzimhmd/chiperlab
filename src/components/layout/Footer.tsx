import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Lock,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
} from 'lucide-react';
import { BrandIcon } from '../common/BrandIcon';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    { label: 'GitHub', href: 'https://github.com', icon: Github },
    { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { label: 'Email', href: 'mailto:hello@chiperlab.dev', icon: Mail },
  ];

  const columns = [
    {
      title: 'Learn',
      links: [
        { to: '/learn', label: 'Academy Overview' },
        { to: '/learn/fundamentals', label: '33 Fundamentals' },
        { to: '/learn/algorithms', label: 'Algorithms Catalog' },
        { to: '/learn/encyclopedia', label: 'Crypto Encyclopedia' },
      ],
    },
    {
      title: 'Playground',
      links: [
        { to: '/playground/encrypt', label: 'Encrypt & Decrypt' },
        { to: '/playground/hash', label: 'SHA-256 / SHA-512' },
        { to: '/playground/analyze', label: 'Frequency Analysis' },
        { to: '/playground/analyze', label: 'Caesar Brute-Force' },
      ],
    },
    {
      title: 'Challenges',
      links: [
        { to: '/challenges/quiz', label: 'Cryptography Quiz' },
        { to: '/challenges/puzzle', label: 'Crypto Puzzles' },
        { to: '/challenges/attack', label: 'Attack Simulations' },
        { to: '/progress', label: 'Progress & XP' },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto z-10 bg-[var(--bg-main)] border-t border-[var(--border-main)] overflow-hidden">
      <div className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-[60%] h-32 rounded-full bg-gradient-to-t from-cyan-500/5 to-transparent blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ============ MAIN GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-cyan-500/40 blur-md opacity-50" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <BrandIcon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="font-extrabold text-[15px] tracking-tight text-[var(--text-primary)] leading-tight">
                  ChiperLab
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-cyan-400/80 leading-tight mt-2">
                  Cryptography Academy
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Learn cryptography through interactive experimentation — classical ciphers, modern
              Web Crypto, hashing, and cryptanalysis. All running locally in your browser.
            </p>

            <div className="flex items-center gap-1.5 pt-1">
              {socials.map(social => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)] flex items-center justify-center text-[var(--text-secondary)] hover:text-cyan-400 hover:border-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map(col => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[var(--text-primary)] mb-3.5 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link, idx) => (
                  <li key={`${link.to}-${idx}`}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
                    >
                      <span className="w-0 h-px bg-cyan-400 group-hover:w-3 transition-all duration-200" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Other Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[var(--text-primary)] mb-3.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
              Other
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
                >
                  <span className="w-0 h-px bg-cyan-400 group-hover:w-3 transition-all duration-200" />
                  <span>About ChiperLab</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
                >
                  <span className="w-0 h-px bg-cyan-400 group-hover:w-3 transition-all duration-200" />
                  <span>StudyMate Ecosystem</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/progress"
                  className="group inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
                >
                  <span className="w-0 h-px bg-cyan-400 group-hover:w-3 transition-all duration-200" />
                  <span>Achievements</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
                >
                  <span className="w-0 h-px bg-cyan-400 group-hover:w-3 transition-all duration-200" />
                  <span>Source Code</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ============ STUDY MATE CARD ============ */}
        <div className="relative mb-6 group">
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-purple-500/30">
            <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)]">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-colors duration-500" />
              <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                      <GraduationCap className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)] flex items-center justify-center">
                      <Layers className="w-3 h-3 text-cyan-400" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Part of StudyMate Ecosystem
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        Education
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl">
                      ChiperLab is a dedicated cryptography learning module within the{' '}
                      <strong className="text-cyan-400 font-semibold">StudyMate</strong>{' '}
                      educational ecosystem — extending the platform's mission to support
                      learners through focused, interactive subject modules.
                    </p>
                  </div>
                </div>

                <Link
                  to="/about"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/50 text-xs font-mono font-semibold transition-all duration-200 group/cta"
                >
                  <span>Explore Ecosystem</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============ BOTTOM BAR ============ */}
        <div className="relative pt-5 border-t border-[var(--border-main)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start font-mono text-[var(--text-secondary)]">
            <span>© {currentYear} ChiperLab</span>
            <span className="text-[var(--border-main)]">·</span>
            <span>Educational Cryptography Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-secondary)]">
              <Lock className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
              100% Client-Side
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-secondary)]">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              Made with care
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}