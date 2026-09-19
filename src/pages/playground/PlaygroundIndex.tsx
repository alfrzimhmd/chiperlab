import { Link } from 'react-router-dom';
import {
  Terminal,
  Fingerprint,
  Unlock,
  ArrowRight,
  Cpu,
  Zap,
  BookOpen,
  Target,
  Library,
  Atom,
  Key,
  ShieldCheck,
  Wand2,
  AlertTriangle,
  Server,
  GitBranch,
  Microscope,
  Repeat,
  FileLock,
} from 'lucide-react';
import { SecurityNotice } from '../../components/common/SecurityNotice';

export function PlaygroundIndex() {
  const hubs = [
    {
      to: '/playground/encrypt',
      label: 'Encryption & Decryption',
      desc: 'Test 11 ciphers and encoders — Caesar, Atbash, Vigenère, XOR, AES-GCM, RSA-OAEP, ChaCha20, HMAC, Base64, Hex, and ROT13.',
      icon: Terminal,
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/30',
      accentText: 'text-cyan-400',
      hoverBorder: 'hover:border-cyan-500/40',
      cta: 'Launch Ciphers',
      categories: [
        { label: 'Classical', count: 4, color: 'text-amber-400' },
        { label: 'Modern', count: 4, color: 'text-cyan-400' },
        { label: 'Encoding', count: 3, color: 'text-emerald-400' },
      ],
    },
    {
      to: '/playground/encrypt?algo=media',
      label: 'Media File Encryption',
      desc: 'Encrypt and decrypt any file type with AES-GCM, ChaCha20-Poly1305, or XOR. Supports images, PDFs, audio, video, archives up to 20 MB. 100% client-side.',
      icon: FileLock,
      accentBg: 'bg-pink-500/10',
      accentBorder: 'border-pink-500/30',
      accentText: 'text-pink-400',
      hoverBorder: 'hover:border-pink-500/40',
      cta: 'Launch Media Lab',
      categories: [
        { label: 'AES-GCM', count: 1, color: 'text-cyan-400' },
        { label: 'ChaCha20', count: 1, color: 'text-purple-400' },
        { label: 'XOR', count: 1, color: 'text-amber-400' },
      ],
    },
    {
      to: '/playground/hash',
      label: 'Hash Generator & Avalanche Lab',
      desc: 'Compute SHA-256, SHA-512, and MD5 cryptographic digests. Experiment with the Avalanche Effect and simulate dictionary attacks.',
      icon: Fingerprint,
      accentBg: 'bg-teal-500/10',
      accentBorder: 'border-teal-500/30',
      accentText: 'text-teal-400',
      hoverBorder: 'hover:border-teal-500/40',
      cta: 'Launch Hash Lab',
      categories: [
        { label: 'SHA-256', count: 1, color: 'text-teal-400' },
        { label: 'SHA-512', count: 1, color: 'text-teal-400' },
        { label: 'MD5', count: 1, color: 'text-rose-400' },
      ],
    },
    {
      to: '/playground/analyze',
      label: 'Cryptanalysis Lab',
      desc: 'Analyze statistical letter frequencies in ciphertext against English benchmarks, or crack Caesar substitution across all 25 parallel shifts.',
      icon: Unlock,
      accentBg: 'bg-rose-500/10',
      accentBorder: 'border-rose-500/30',
      accentText: 'text-rose-400',
      hoverBorder: 'hover:border-rose-500/40',
      cta: 'Launch Analysis Tools',
      categories: [
        { label: 'Frequency', count: 1, color: 'text-rose-400' },
        { label: 'Caesar Brute-Force', count: 1, color: 'text-rose-400' },
      ],
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      {/* ============================================================
          HEADER — Centered
      ============================================================ */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Interactive Cryptography Lab
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
          Cryptography Playground
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          A hands-on laboratory with <strong className="text-cyan-400">4 interactive hubs</strong> —{' '}
          encrypt text across 11 ciphers, protect real files with modern AEAD ciphers, generate
          cryptographic hashes with avalanche analysis, or simulate real cryptanalytic attacks on
          classical ciphers.
        </p>

        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] max-w-2xl">
          Every algorithm executes locally in your browser via the W3C Web Crypto API. No data
          leaves your device. Zero network round-trips. Full source transparency.
        </p>
      </div>

      <SecurityNotice type="general" />

      {/* ============================================================
          4 MAIN HUBS
      ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {hubs.map(hub => {
          const Icon = hub.icon;
          return (
            <Link
              key={hub.to}
              to={hub.to}
              className={`group p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] ${hub.hoverBorder} shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-xl ${hub.accentBg} ${hub.accentBorder} border flex items-center justify-center ${hub.accentText} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h2
                  className={`text-lg font-bold text-[var(--text-primary)] group-hover:${hub.accentText} transition-colors`}
                >
                  {hub.label}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {hub.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {hub.categories.map(c => (
                    <span
                      key={c.label}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${hub.accentBg} ${hub.accentBorder} ${c.color}`}
                    >
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`pt-5 mt-5 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-mono font-semibold ${hub.accentText}`}
              >
                <span>{hub.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ============================================================
          SUGGESTED LEARNING PATH
      ============================================================ */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Suggested Learning Path
            </h3>
            <p className="text-[10px] font-mono text-[var(--text-secondary)]">
              Recommended order for beginners
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Learn Basics', desc: 'Read fundamentals', link: '/learn/fundamentals' },
            { step: '02', title: 'Try Ciphers', desc: 'Encrypt classics', link: '/playground/encrypt' },
            { step: '03', title: 'Encrypt Files', desc: 'Protect real files', link: '/playground/encrypt?algo=media' },
            { step: '04', title: 'Explore Hashing', desc: 'SHA & avalanche', link: '/playground/hash' },
            { step: '05', title: 'Break Ciphers', desc: 'Cryptanalysis', link: '/playground/analyze' },
          ].map(s => (
            <Link
              key={s.step}
              to={s.link}
              className="group relative p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono text-[10px] font-bold text-cyan-400">
                  {s.step}
                </span>
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                  {s.title}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ============================================================
          WHAT YOU CAN DO — 4 Summary Cards
      ============================================================ */}
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
            WHAT YOU CAN DO
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Four Interactive Hubs
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            Each hub focuses on a different aspect of cryptographic practice — from text
            transformation to file protection and analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card 1: Transform */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-cyan-500/30 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wand2 className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-cyan-400 tracking-widest block mb-1">
                01 — TRANSFORM
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                Encrypt Text
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Transform plaintext using 11 algorithms. Inspect step-by-step character traces
                and compare classical vs modern security.
              </p>
            </div>
            <Link
              to="/playground/encrypt"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Try it <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2: Protect Files */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-pink-500/30 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <FileLock className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-pink-400 tracking-widest block mb-1">
                02 — PROTECT
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                Encrypt Real Files
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Encrypt any file — images, PDFs, audio, video, archives up to 20 MB. Using
                AES-GCM, ChaCha20-Poly1305, or XOR. Nothing is uploaded.
              </p>
            </div>
            <Link
              to="/playground/encrypt?algo=media"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-pink-400 hover:text-pink-300 transition-colors"
            >
              Try it <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Digest */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-teal-500/30 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Repeat className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-teal-400 tracking-widest block mb-1">
                03 — DIGEST
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                Hash & Verify
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Generate SHA-256, SHA-512, and MD5 digests. Observe the avalanche effect and
                understand why MD5 is broken.
              </p>
            </div>
            <Link
              to="/playground/hash"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
              Try it <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 4: Analyze */}
          <div className="p-6 rounded-2xl bg-[var(--surface-main)] border border-rose-500/30 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Microscope className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-rose-400 tracking-widest block mb-1">
                04 — ANALYZE
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                Cryptanalyze
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Break ciphers without the key. Frequency analysis or Caesar brute-force across
                all 25 shifts.
              </p>
            </div>
            <Link
              to="/playground/analyze"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Try it <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
          UNDER THE HOOD
      ============================================================ */}
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs font-bold text-purple-400 tracking-widest block">
            UNDER THE HOOD
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Technology & Transparency
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            Every algorithm executes locally. No server, no tracking, no shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Native Web Crypto */}
          <div className="p-6 rounded-2xl bg-[#0A0C10] border border-cyan-500/30 shadow-lg space-y-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                W3C Web Crypto API
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                AES-GCM, RSA-OAEP, ChaCha20-Poly1305, HMAC-SHA256, SHA-256, and SHA-512 execute
                via{' '}
                <code className="text-cyan-300 bg-[#12151B] px-1.5 py-0.5 rounded border border-[#1E222B] font-mono text-[10px]">
                  crypto.subtle
                </code>{' '}
                — sandboxed, hardware-accelerated, and standardized by the W3C.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 pt-2 border-t border-[#1E222B]">
              <ShieldCheck className="w-3 h-3" />
              Hardware-accelerated AES-NI
            </div>
          </div>

          {/* Zero Network */}
          <div className="p-6 rounded-2xl bg-[#0A0C10] border border-emerald-500/30 shadow-lg space-y-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                100% Client-Side
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Nothing you type or upload is ever sent to a server. Files, keys, and plaintext
                stay in browser memory and are discarded on tab close.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-2 border-t border-[#1E222B]">
              <ShieldCheck className="w-3 h-3" />
              Zero network round-trips
            </div>
          </div>

          {/* Educational */}
          <div className="p-6 rounded-2xl bg-[#0A0C10] border border-amber-500/30 shadow-lg space-y-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                Educational Use Only
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                This playground is for learning, not for protecting real secrets. Always use
                audited cryptographic libraries and follow OWASP guidelines in production.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 pt-2 border-t border-[#1E222B]">
              <GitBranch className="w-3 h-3" />
              Educational use only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}