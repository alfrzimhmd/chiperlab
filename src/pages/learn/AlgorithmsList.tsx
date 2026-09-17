import { useState } from 'react';
import { ALGORITHMS } from '../../data/algorithms';
import { AlgorithmCard } from '../../components/learning/AlgorithmCard';
import { useProgress } from '../../hooks/useProgress';
import { Key, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AlgorithmCategory } from '../../types/crypto';

export function AlgorithmsList() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AlgorithmCategory>('all');
  const { isAlgorithmExplored } = useProgress();

  const filteredAlgorithms = ALGORITHMS.filter(algo => {
    if (selectedCategory === 'all') return true;
    return algo.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Key className="w-3.5 h-3.5" />
          Cryptographic Algorithms Catalog
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Classical and Modern Ciphers
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          From ancient military transposition and Caesar shifts to quantum-resistant hashing and 256-bit Galois/Counter Mode authenticated encryption.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        {(['all', 'classical', 'modern', 'hashing'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white dark:bg-sky-500 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Algorithms' : `${cat} Ciphers`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredAlgorithms.map(algo => (
          <AlgorithmCard
            key={algo.id}
            algorithm={algo}
            isExplored={isAlgorithmExplored(algo.id)}
          />
        ))}
      </div>

      {/* Comparison Reference Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Quick Cryptographic Comparison Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-2 font-mono">ALGORITHM</th>
                <th className="pb-2">FAMILY</th>
                <th className="pb-2">KEY SIZE / DIGEST</th>
                <th className="pb-2">SECURITY STATUS</th>
                <th className="pb-2">PRIMARY PURPOSE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">Caesar</td>
                <td className="py-2.5">Classical Monoalphabetic</td>
                <td className="py-2.5 font-mono">1–25 shift</td>
                <td className="py-2.5 text-rose-600 dark:text-rose-400 font-medium">Insecure (Brute-force)</td>
                <td className="py-2.5">Education / Puzzle</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">Atbash</td>
                <td className="py-2.5">Classical Inversion</td>
                <td className="py-2.5 font-mono">None (Fixed mirror)</td>
                <td className="py-2.5 text-rose-600 dark:text-rose-400 font-medium">Zero confidentiality</td>
                <td className="py-2.5">Biblical / Historic</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">Vigenère</td>
                <td className="py-2.5">Polyalphabetic</td>
                <td className="py-2.5 font-mono">Keyword length</td>
                <td className="py-2.5 text-amber-600 dark:text-amber-400 font-medium">Weak (Kasiski analysis)</td>
                <td className="py-2.5">Historic diplomacy</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">XOR</td>
                <td className="py-2.5">Stream / Bitwise</td>
                <td className="py-2.5 font-mono">Variable bytes</td>
                <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Unbreakable if OTP, else weak</td>
                <td className="py-2.5">Primitive building block</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">AES-GCM</td>
                <td className="py-2.5">Modern Symmetric Block</td>
                <td className="py-2.5 font-mono">128 / 256 bits</td>
                <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">NSA Top Secret Standard</td>
                <td className="py-2.5">Disk & TLS payload confidentiality</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">RSA-OAEP</td>
                <td className="py-2.5">Modern Asymmetric</td>
                <td className="py-2.5 font-mono">2048 / 4096 bits</td>
                <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Industry Standard PKI</td>
                <td className="py-2.5">Key exchange & digital signatures</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">SHA-256</td>
                <td className="py-2.5">Cryptographic Hash</td>
                <td className="py-2.5 font-mono">256-bit fixed digest</td>
                <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Collision resistant</td>
                <td className="py-2.5">Integrity verification & blockchain</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">SHA-512</td>
                <td className="py-2.5">Cryptographic Hash</td>
                <td className="py-2.5 font-mono">512-bit fixed digest</td>
                <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">High-security margin</td>
                <td className="py-2.5">64-bit architecture hashing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
