import { Link } from 'react-router-dom';
import { Terminal, Fingerprint, Unlock, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { SecurityNotice } from '../../components/common/SecurityNotice';

export function PlaygroundIndex() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          Interactive Cryptography Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cryptography Playground
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Experiment directly with classical substitution ciphers, native browser Web Crypto API algorithms, cryptographic hashing, and cryptanalysis tools.
        </p>
      </div>

      <SecurityNotice type="general" />

      {/* 3 Main Playground Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/playground/encrypt"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Encryption & Decryption
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Test Caesar, Atbash, Vigenère, XOR, AES-GCM (128/256), and RSA-OAEP (2048). Inspect keys, IV nonces, and step-by-step character transformations.
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span>Launch Ciphers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/playground/hash"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Fingerprint className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Hash Generator & Avalanche Lab
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Compute real-time SHA-256 and SHA-512 cryptographic digests. Experiment with the Avalanche Effect by comparing two similar texts side-by-side.
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Launch Hash Lab</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/playground/analyze"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
              <Unlock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Cryptanalysis Lab
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Analyze statistical letter frequencies in ciphertext against English benchmarks, or crack Caesar substitution across all 25 parallel shifts.
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span>Launch Analysis Tools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Educational Web Crypto API Architecture Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sky-400">
          <Cpu className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Powered by Browser Native Web Crypto API
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Modern cryptographic algorithms in ChiperLab (AES-GCM, RSA-OAEP, SHA-256, SHA-512) are executed using the native browser W3C <code className="text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">window.crypto.subtle</code> interface. All key generation, padding, and authenticated tag checks happen inside hardware-accelerated sandboxed memory.
        </p>
      </div>
    </div>
  );
}
