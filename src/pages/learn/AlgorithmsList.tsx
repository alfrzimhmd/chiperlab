import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALGORITHMS } from '../../data/algorithms';
import { AlgorithmCard } from '../../components/learning/AlgorithmCard';
import { useProgress } from '../../hooks/useProgress';
import { Key, ArrowLeft } from 'lucide-react';
import { AlgorithmCategory } from '../../types/crypto';

export function AlgorithmsList() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AlgorithmCategory>('all');
  const { isAlgorithmExplored } = useProgress();

  const filteredAlgorithms = ALGORITHMS.filter(algo => {
    if (selectedCategory === 'all') return true;
    return algo.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Back Button */}
      <Link
        to="/learn"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Learn Hub
      </Link>

      {/* Header — Centered */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-purple-500/30 bg-purple-500/10 text-purple-400">
          <Key className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Cryptographic Algorithms
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Classical and Modern Ciphers
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          A complete catalog of 14 cryptographic algorithms spanning four families — classical
          substitution ciphers, modern authenticated encryption, cryptographic hash functions,
          and universal encoding schemes.
        </p>
        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] max-w-2xl">
          Each algorithm includes mathematical formulation, historical origin, security analysis,
          and an interactive playground where you can experiment with real encryption in your
          browser.
        </p>
      </div>

      {/* Category Tabs — Centered */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg flex-wrap justify-center">
          {(['all', 'classical', 'modern', 'hashing', 'encoding'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold capitalize transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              {cat === 'all' ? 'All Algorithms' : `${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {filteredAlgorithms.length > 0 && (
        <div className="text-center">
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">
            Showing {filteredAlgorithms.length} of {ALGORITHMS.length} algorithms
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAlgorithms.map(algo => (
          <AlgorithmCard
            key={algo.id}
            algorithm={algo}
            isExplored={isAlgorithmExplored(algo.id)}
          />
        ))}
      </div>

      {filteredAlgorithms.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] text-sm font-mono max-w-4xl mx-auto">
          No algorithms found in this category.
        </div>
      )}

      {/* Comparison Table */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
        <div className="text-center space-y-1">
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
            03 — COMPARISON MATRIX
          </span>
          <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
            Quick Cryptographic Comparison
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-2xl mx-auto">
            Side-by-side overview of all 14 algorithms — family classification, key requirements,
            security strength, and primary purpose.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-main)] text-[var(--text-secondary)] font-mono">
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Algorithm</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Family</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Key / Digest</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Security</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-main)] text-[var(--text-primary)]">
              {[
                { name: 'Caesar', family: 'Monoalphabetic', key: '1–25 shift', sec: 'Insecure', secColor: 'text-rose-400', purpose: 'Education' },
                { name: 'Atbash', family: 'Inversion', key: 'Fixed mirror', sec: 'Zero confidentiality', secColor: 'text-rose-400', purpose: 'Historic' },
                { name: 'Vigenère', family: 'Polyalphabetic', key: 'Keyword length', sec: 'Weak', secColor: 'text-amber-400', purpose: 'Historic' },
                { name: 'XOR', family: 'Stream / Bitwise', key: 'Variable bytes', sec: 'Unbreakable if OTP', secColor: 'text-emerald-400', purpose: 'Primitive' },
                { name: 'AES-GCM', family: 'Symmetric Block', key: '128 / 256 bits', sec: 'NSA Standard', secColor: 'text-emerald-400', purpose: 'Bulk encryption' },
                { name: 'RSA-OAEP', family: 'Asymmetric', key: '2048 / 4096 bits', sec: 'Industry PKI', secColor: 'text-emerald-400', purpose: 'Key exchange' },
                { name: 'ChaCha20', family: 'Stream AEAD', key: '256-bit', sec: 'Modern AEAD', secColor: 'text-emerald-400', purpose: 'Mobile / TLS' },
                { name: 'HMAC-SHA256', family: 'MAC', key: 'Symmetric key', sec: 'Industry standard', secColor: 'text-emerald-400', purpose: 'Authentication' },
                { name: 'SHA-256', family: 'Hash', key: '256-bit', sec: 'Collision resistant', secColor: 'text-emerald-400', purpose: 'Integrity' },
                { name: 'SHA-512', family: 'Hash', key: '512-bit', sec: 'High margin', secColor: 'text-emerald-400', purpose: 'Integrity' },
                { name: 'MD5', family: 'Hash (Broken)', key: '128-bit', sec: 'Broken (2004)', secColor: 'text-rose-400', purpose: 'Legacy checksum' },
                { name: 'Base64', family: 'Encoding', key: 'None', sec: 'Zero confidentiality', secColor: 'text-slate-400', purpose: 'Transport' },
                { name: 'Hex', family: 'Encoding', key: 'None', sec: 'Zero confidentiality', secColor: 'text-slate-400', purpose: 'Byte display' },
                { name: 'ROT13', family: 'Encoding / Caesar', key: 'Fixed shift 13', sec: 'Zero confidentiality', secColor: 'text-slate-400', purpose: 'Obfuscation' },
              ].map(row => (
                <tr key={row.name} className="hover:bg-[var(--surface-secondary)] transition-colors">
                  <td className="py-3 font-bold font-mono text-cyan-400">{row.name}</td>
                  <td className="py-3 font-mono text-[var(--text-secondary)]">{row.family}</td>
                  <td className="py-3 font-mono">{row.key}</td>
                  <td className={`py-3 font-mono font-medium ${row.secColor}`}>{row.sec}</td>
                  <td className="py-3 font-mono text-[var(--text-secondary)]">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}