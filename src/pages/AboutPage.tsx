import { Link } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Sparkles,
  Zap,
  Github,
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  Heart,
  Target,
  Users,
  Code2,
  Cpu,
  Lock,
  ExternalLink,
  Award,
  Terminal,
  GraduationCap,
  Layers,
  Rocket,
  Compass,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useTypewriter } from '../hooks/useTypewriter';
import { SafeTypewriter } from '../components/common/SafeTypewriter';

export function AboutPage() {
  const headlines = [
    'Built for learners, by a learner.',
    'Learn cryptography the interactive way.',
    'From Caesar shifts to modern AES-GCM.',
    'Understand. Experiment. Solve.',
    'Your journey into secret communication.',
  ];

  const {
    displayText: typedHeadline,
    isTranslateActive,
    fallbackText,
  } = useTypewriter(headlines, 65, 35, 1800);

  // ============ SOCIALS ============
  const socials = [
    {
      label: 'GitHub',
      href: 'https://github.com/alfrzimhmd',
      icon: Github,
      accent: 'text-[var(--text-primary)]',
      accentBg: 'bg-[var(--text-primary)]/10',
      accentBorder: 'border-[var(--text-primary)]/30',
      hover: 'hover:border-[var(--text-primary)]/50',
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/mhmd-alfrzi-80b15334b',
      icon: Linkedin,
      accent: 'text-blue-400',
      accentBg: 'bg-blue-500/10',
      accentBorder: 'border-blue-500/30',
      hover: 'hover:border-blue-500/50',
    },
    {
      label: 'Phone',
      href: 'tel:+6281234567890', // ← Ganti dengan nomor telepon kamu
      icon: Phone,
      accent: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-500/30',
      hover: 'hover:border-emerald-500/50',
    },
    {
      label: 'Email',
      href: 'mailto:mhmdalfrzi.03@gmail.com',
      icon: Mail,
      accent: 'text-cyan-400',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/30',
      hover: 'hover:border-cyan-500/50',
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Structured Learning',
      desc: '12 core fundamentals organized in progressive difficulty, from basic definitions to advanced key exchange.',
      accent: 'cyan' as const,
    },
    {
      icon: Terminal,
      title: 'Interactive Playground',
      desc: 'Encrypt, decrypt, hash, and break ciphers in real time — powered by native Web Crypto API.',
      accent: 'purple' as const,
    },
    {
      icon: Award,
      title: 'Gamified Progress',
      desc: 'Earn XP, unlock achievements, and climb ranks as you master classical and modern cryptography.',
      accent: 'amber' as const,
    },
    {
      icon: Lock,
      title: 'Privacy by Design',
      desc: 'Zero server round-trips. All computations happen locally in your browser. No tracking, no data collection.',
      accent: 'emerald' as const,
    },
  ];

  const techStack = [
    { name: 'React 18', desc: 'UI Framework' },
    { name: 'TypeScript', desc: 'Type Safety' },
    { name: 'Tailwind CSS', desc: 'Styling' },
    { name: 'Vite', desc: 'Build Tool' },
    { name: 'Web Crypto API', desc: 'Native Crypto' },
    { name: 'React Router', desc: 'Navigation' },
  ];

  const ecosystemValues = [
    {
      icon: GraduationCap,
      title: 'Learning First',
      desc: 'Every module is designed around clarity and real understanding — never just surface-level knowledge.',
    },
    {
      icon: Layers,
      title: 'Modular Ecosystem',
      desc: 'Each subject lives as a focused module, contributing to a unified learning experience.',
    },
    {
      icon: Rocket,
      title: 'Accessible to All',
      desc: 'Free, open, and privacy-first. No barriers between curious minds and quality education.',
    },
    {
      icon: Compass,
      title: 'Guided Journeys',
      desc: 'Structured paths that help learners progress from fundamentals to advanced mastery.',
    },
  ];

  const accentMap = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
  };

  // Renders headline with accent words highlighted
  const renderHeadline = (text: string, withCursor: boolean) => (
    <>
      {text.split(' ').map((word, idx) => {
        const isAccent =
          word.toLowerCase().includes('cryptography') ||
          word.toLowerCase().includes('caesar') ||
          word.toLowerCase().includes('aes-gcm') ||
          word.toLowerCase().includes('interactive') ||
          word.toLowerCase().includes('solve') ||
          word.toLowerCase().includes('learn') ||
          word.toLowerCase().includes('experiment') ||
          word.toLowerCase().includes('understand') ||
          word.toLowerCase().includes('secret') ||
          word.toLowerCase().includes('communication');

        return (
          <span key={idx} className={isAccent ? 'text-cyan-400' : ''}>
            {word}{' '}
          </span>
        );
      })}
      {withCursor && (
        <span className="inline-block w-[3px] h-[0.9em] bg-cyan-400 ml-1 align-middle animate-[cursorBlink_1s_steps(2)_infinite]" />
      )}
    </>
  );

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 space-y-14 animate-in fade-in duration-200">
      {/* ============================================================
          HERO — SafeTypewriter + translate fallback
      ============================================================ */}
      <section className="text-center max-w-6xl mx-auto space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span className="tracking-wide uppercase text-xs font-medium">
            About ChiperLab
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15] min-h-[1.4em] sm:min-h-[1.3em] flex items-center justify-center px-4">
          <SafeTypewriter
            fallback={
              <span className="inline-block">
                {renderHeadline(fallbackText, false)}
              </span>
            }
          >
            <span className="inline-block">
              {isTranslateActive
                ? renderHeadline(fallbackText, false)
                : renderHeadline(typedHeadline, true)}
            </span>
          </SafeTypewriter>
        </h1>

        <div className="space-y-5 max-w-6xl mx-auto">
          <p className="text-xl sm:text-2xl text-[var(--text-secondary)] leading-[1.6] font-light">
            ChiperLab is an open educational platform dedicated to making cryptography
            approachable, interactive, and fun — without the steep mathematical barrier.
          </p>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-[1.75]">
            Every concept is brought to life through hands-on experimentation: encrypt real
            messages, watch hash avalanches unfold bit by bit, break classical ciphers with
            brute-force, and explore the modern primitives that protect the internet today.
          </p>
          <p className="text-base text-[var(--text-secondary)]/85 leading-[1.7] max-w-3xl mx-auto italic">
            No prior cryptography experience needed — just curiosity and a browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <Link to="/learn/fundamentals">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Start Learning
            </Button>
          </Link>
          <Link to="/playground">
            <Button variant="outline" size="lg">
              Try Playground
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================
          MISSION + STUDYMATE
      ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col space-y-4">
          <div>
            <span className="font-mono text-sm font-bold text-cyan-400 tracking-widest block">
              01 — THE MISSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
              Why ChiperLab Exists
            </h2>
          </div>

          <div className="flex-1 p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-5 flex flex-col">
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              Cryptography is often taught as a dense academic subject full of mathematical
              notation. Students memorize formulas without ever seeing them in action. ChiperLab
              flips that approach:{' '}
              <strong className="text-[var(--text-primary)]">
                every concept is interactive
              </strong>
              .
            </p>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed flex-1">
              Instead of reading about Caesar ciphers, you shift letters yourself. Instead of
              hearing about the avalanche effect, you watch a single character change destroy an
              entire hash. Instead of trusting that brute-force works, you execute it in 25
              parallel shifts.
            </p>

            <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-3">
              <Target className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                  Our Goal
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Make cryptography feel less like advanced mathematics and more like an exciting
                  puzzle game — while never sacrificing technical accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <span className="font-mono text-sm font-bold text-emerald-400 tracking-widest block">
              02 — PART OF THE ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
              StudyMate Project
            </h2>
          </div>

          <div className="relative flex-1 p-[1px] rounded-2xl bg-gradient-to-br from-emerald-500/40 via-cyan-500/30 to-blue-500/30">
            <div className="relative flex flex-col h-full overflow-hidden p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] space-y-5">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <GraduationCap className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)] flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">StudyMate</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      Learning Platform
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider mt-1.5">
                    Educational Ecosystem
                  </p>
                </div>
              </div>

              <p className="relative text-base text-[var(--text-secondary)] leading-relaxed">
                ChiperLab is a dedicated module within the{' '}
                <strong className="text-emerald-400 font-semibold">StudyMate</strong> educational
                ecosystem — extending the platform's mission to help learners master technical
                subjects through focused, interactive experiences.
              </p>

              <p className="relative text-base text-[var(--text-secondary)] leading-relaxed flex-1">
                Rather than a standalone project, ChiperLab is designed to grow alongside
                StudyMate — contributing a specialized cryptography track to a unified vision of
                accessible, high-quality learning tools for students and self-learners worldwide.
              </p>

              <div className="relative grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border-main)]">
                {ecosystemValues.slice(0, 4).map(v => {
                  const Icon = v.icon;
                  return (
                    <div key={v.title} className="flex items-start gap-2.5">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-center justify-center text-cyan-400 mt-0.5">
                        <Icon className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                          {v.title}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug mt-1">
                          {v.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES
      ============================================================ */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-sm font-bold text-cyan-400 tracking-widest block">
            03 — WHAT MAKES IT DIFFERENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
            Core Principles
          </h2>
          <p className="text-base text-[var(--text-secondary)] mt-3 leading-relaxed">
            Every design decision is rooted in four foundational principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const a = accentMap[f.accent];
            return (
              <div
                key={idx}
                className="flex flex-col p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3.5 h-full"
              >
                <div
                  className={`shrink-0 w-12 h-12 rounded-xl ${a.bg} ${a.border} border flex items-center justify-center ${a.text}`}
                >
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          TECH STACK + AUTHOR
      ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col space-y-4">
          <div>
            <span className="font-mono text-sm font-bold text-cyan-400 tracking-widest block">
              04 — UNDER THE HOOD
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
              Technology Stack
            </h2>
          </div>

          <div className="flex-1 p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-5 flex flex-col">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              ChiperLab is built entirely client-side using modern web technologies. No backend,
              no database, no tracking. Everything runs in your browser.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {techStack.map(t => (
                <div
                  key={t.name}
                  className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]"
                >
                  <p className="text-sm font-mono font-bold text-cyan-400">{t.name}</p>
                  <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-auto p-5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-start gap-3">
              <Cpu className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-sm font-mono font-bold text-[var(--text-primary)] mb-1.5">
                  Web Crypto API — Native & Hardware-Accelerated
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  AES-GCM, RSA-OAEP, SHA-256, and SHA-512 all execute through the browser's native{' '}
                  <code className="text-cyan-300 font-mono">crypto.subtle</code> interface — the
                  same primitives used by banks and governments worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <span className="font-mono text-sm font-bold text-amber-400 tracking-widest block">
              05 — CREATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
              Behind the Project
            </h2>
          </div>

          <div className="flex-1 p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-5 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <Code2 className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Muhammad Alfarizi
                </h3>
                <p className="text-sm font-mono text-[var(--text-secondary)] mt-1">
                  Full-Stack Developer · Security Enthusiast
                </p>
              </div>
            </div>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed flex-1">
              I built ChiperLab because I struggled with cryptography when I first learned it. The
              concepts felt abstract and disconnected from real code. This platform is my attempt
              to bridge that gap — for students, developers, and curious minds who want to truly
              understand how secret communication works.
            </p>

            <div className="mt-auto p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-center gap-2.5 text-sm font-mono text-[var(--text-secondary)]">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
              <span>Built with care during late nights and many cups of coffee.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          REFERENCES CTA
      ============================================================ */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-sm font-bold text-cyan-400 tracking-widest block">
            06 — REFERENCES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
            Academic Sources
          </h2>
          <p className="text-base text-[var(--text-secondary)] mt-3 leading-relaxed">
            All ChiperLab lesson content is written based on authoritative sources — standards,
            academic papers, and reference textbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Standards', count: 15, accent: 'cyan' },
            { label: 'Papers', count: 13, accent: 'purple' },
            { label: 'Books', count: 5, accent: 'amber' },
            { label: 'Documentation', count: 6, accent: 'emerald' },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg text-center"
            >
              <p className="text-3xl font-extrabold font-mono text-cyan-400">{cat.count}</p>
              <p className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mt-2">
                {cat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <Link
          to="/about/references"
          className="group block p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 border border-cyan-500/30 hover:border-cyan-500/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                  View All References
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  30+ academic sources, standards, and textbooks used across all lessons
                </p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 text-black font-mono text-xs font-bold group-hover:bg-cyan-400 transition-colors">
              Explore Sources
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </section>

      {/* ============================================================
          SOCIALS / CONNECT — Clean: Icon + Label only
      ============================================================ */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-sm font-bold text-cyan-400 tracking-widest block">
            07 — CONNECT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1.5">
            Get in Touch
          </h2>
          <p className="text-base text-[var(--text-secondary)] mt-3 leading-relaxed">
            Have feedback, found a bug, or want to collaborate? Reach out through any channel
            below.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {socials.map(social => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target={
                  social.href.startsWith('mailto:') || social.href.startsWith('tel:')
                    ? undefined
                    : '_blank'
                }
                rel="noreferrer"
                className={`group relative overflow-hidden p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] ${social.hover} shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 h-full min-h-[140px]`}
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-2xl ${social.accentBg} ${social.accentBorder} border flex items-center justify-center ${social.accent} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>

                <p
                  className={`text-sm font-bold text-[var(--text-primary)] group-hover:${social.accent} transition-colors`}
                >
                  {social.label}
                </p>

                <ExternalLink className="absolute top-3 right-3 w-3.5 h-3.5 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
              </a>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          CLOSING CTA
      ============================================================ */}
      <section className="p-8 sm:p-14 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 border border-cyan-500/20 text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto">
          <Users className="w-7 h-7" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Ready to explore cryptography?
        </h2>
        <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
          Join thousands of learners mastering the art of secret communication — one lesson at a
          time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-5">
          <Link to="/learn/fundamentals">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Start with Fundamentals
            </Button>
          </Link>
          <Link to="/challenges/quiz">
            <Button variant="outline" size="lg">
              Take the Quiz
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}