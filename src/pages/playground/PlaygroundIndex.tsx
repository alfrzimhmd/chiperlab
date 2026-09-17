import { Link } from 'react-router-dom';
import { Terminal, Fingerprint, Unlock, ArrowRight, Cpu, Zap, BookOpen, Target } from 'lucide-react';
import { SecurityNotice } from '../../components/common/SecurityNotice';

export function PlaygroundIndex() {
  const hubs = [
    {
      to: '/playground/encrypt',
      label: 'Encryption & Decryption',
      desc: 'Test Caesar, Atbash, Vigenère, XOR, AES-GCM (128/256), and RSA-OAEP (2048). Inspect keys, IV nonces, and step-by-step character transformations.',
      icon: Terminal,
      accent: 'cyan',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/30',
      accentText: 'text-cyan-400',
      hoverBorder: 'hover:border-cyan-500/40',
      cta: 'Launch Ciphers',
      algorithms: ['Caesar', 'Atbash', 'Vigenère', 'XOR', 'AES-GCM', 'RSA-OAEP'],
    },
    {
      to: '/playground/hash',
      label: 'Hash Generator & Avalanche Lab',
      desc: 'Compute real-time SHA-256 and SHA-512 cryptographic digests. Experiment with the Avalanche Effect by comparing two similar texts side-by-side.',
      icon: Fingerprint,
      accent: 'teal',
      accentBg: 'bg-teal-500/10',
      accentBorder: 'border-teal-500/30',
      accentText: 'text-teal-400',
      hoverBorder: 'hover:border-teal-500/40',
      cta: 'Launch Hash Lab',
      algorithms: ['SHA-256', 'SHA-512'],
    },
    {
      to: '/playground/analyze',
      label: 'Cryptanalysis Lab',
      desc: 'Analyze statistical letter frequencies in ciphertext against English benchmarks, or crack Caesar substitution across all 25 parallel shifts.',
      icon: Unlock,
      accent: 'rose',
      accentBg: 'bg-rose-500/10',
      accentBorder: 'border-rose-500/30',
      accentText: 'text-rose-400',
      hoverBorder: 'hover:border-rose-500/40',
      cta: 'Launch Analysis Tools',
      algorithms: ['Frequency Analysis', 'Caesar Brute-Force'],
    },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Interactive Cryptography Lab
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Cryptography Playground
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Experiment directly with classical substitution ciphers, native browser Web Crypto API
          algorithms, cryptographic hashing, and cryptanalysis tools.
        </p>
      </div>

      <SecurityNotice type="general" />

      {/* 3 Main Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  <Icon className="w-6 h-6" />
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
                  {hub.algorithms.map(a => (
                    <span
                      key={a}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${hub.accentBg} ${hub.accentBorder} border ${hub.accentText}`}
                    >
                      {a}
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

      {/* Learning Path Strip */}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { step: '01', title: 'Learn Basics', desc: 'Read the 12 fundamentals', link: '/learn/fundamentals' },
            { step: '02', title: 'Try Ciphers', desc: 'Encrypt & decrypt classics', link: '/playground/encrypt' },
            { step: '03', title: 'Explore Hashing', desc: 'SHA-256 & avalanche lab', link: '/playground/hash' },
            { step: '04', title: 'Break Ciphers', desc: 'Cryptanalysis & puzzles', link: '/playground/analyze' },
          ].map((s, i) => (
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

      {/* Web Crypto Info Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0A0C10] border border-[var(--border-main)] shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                Powered by Browser Native Web Crypto API
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Modern cryptographic algorithms in ChiperLab (AES-GCM, RSA-OAEP, SHA-256, SHA-512)
              are executed using the native browser W3C{' '}
              <code className="text-cyan-300 bg-[#12151B] px-2 py-0.5 rounded border border-[#1E222B] font-mono text-xs">
                window.crypto.subtle
              </code>{' '}
              interface. All key generation, padding, and authenticated tag checks happen inside
              hardware-accelerated sandboxed memory.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Zero network round-trips</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hardware-accelerated AES-NI</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sandboxed memory isolation</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>W3C standardized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}