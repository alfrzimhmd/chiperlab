import { useState } from 'react';
import { ALGORITHMS } from '../../data/algorithms';
import { AlgorithmCard } from '../../components/learning/AlgorithmCard';
import { useProgress } from '../../hooks/useProgress';
import { Key } from 'lucide-react';
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
      {/* Header */}
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-purple-500/30 bg-purple-500/10 text-purple-400">
          <Key className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Cryptographic Algorithms
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Classical and Modern Ciphers
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          From ancient military transposition and Caesar shifts to quantum-resistant hashing and
          256-bit Galois/Counter Mode authenticated encryption.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] w-fit shadow-lg">
        {(['all', 'classical', 'modern', 'hashing'] as const).map(cat => (
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

      {/* Comparison Table */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
        <div>
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
            03 — COMPARISON MATRIX
          </span>
          <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Quick Cryptographic Comparison
          </h3>
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
                { name: 'SHA-256', family: 'Hash', key: '256-bit', sec: 'Collision resistant', secColor: 'text-emerald-400', purpose: 'Integrity' },
                { name: 'SHA-512', family: 'Hash', key: '512-bit', sec: 'High margin', secColor: 'text-emerald-400', purpose: 'Integrity' },
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