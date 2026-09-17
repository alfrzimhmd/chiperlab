import { useState, useMemo } from 'react';
import { analyzeFrequency } from '../../crypto/analysis/frequency';
import { bruteForceCaesar } from '../../crypto/analysis/caesarBruteForce';
import { FrequencyChart } from '../../components/playground/FrequencyChart';
import { SecurityNotice } from '../../components/common/SecurityNotice';
import {
  Unlock,
  BarChart3,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  Info,
  TrendingUp,
  Target,
} from 'lucide-react';

export function AnalyzePlayground() {
  const [activeTab, setActiveTab] = useState<'frequency' | 'caesar-brute'>('frequency');

  const [freqCiphertext, setFreqCiphertext] = useState(
    'KHOOR ZRUOG WKLV LV DQ HQFUBSWHG PHVVDJH XVLQJ FDHVDU FLSKHU'
  );

  const [bruteCiphertext, setBruteCiphertext] = useState(
    'WKH VHFUHW FRGH LV FKLSVHW'
  );
  const [copiedShift, setCopiedShift] = useState<number | null>(null);

  const freqAnalysis = useMemo(() => analyzeFrequency(freqCiphertext), [freqCiphertext]);
  const bruteCandidates = useMemo(() => bruteForceCaesar(bruteCiphertext), [bruteCiphertext]);

  const handleCopyShift = (text: string, shift: number) => {
    navigator.clipboard.writeText(text);
    setCopiedShift(shift);
    setTimeout(() => setCopiedShift(null), 2000);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-rose-500/30 bg-rose-500/10 text-rose-400">
          <Unlock className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Cryptanalysis & Cipher Cracking
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Cryptanalysis Laboratory
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Cryptanalysis is the art of deciphering encrypted text without prior knowledge of the
          secret key by finding statistical patterns, frequency fingerprints, or searching small
          keyspaces.
        </p>
      </div>

      <SecurityNotice type="classical" />

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] w-fit shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('frequency')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
            activeTab === 'frequency'
              ? 'bg-cyan-500 text-black'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Frequency Analysis
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('caesar-brute')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
            activeTab === 'caesar-brute'
              ? 'bg-rose-500 text-black'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Caesar Brute-Force
        </button>
      </div>

      {/* Tab 1: Frequency Analysis */}
      {activeTab === 'frequency' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main content (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  01 — Input Ciphertext
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFreqCiphertext(
                        'ZHOFRPH WR WKH FBEHUVHFXULWB DFDGHPB RI FKLSHUODE ZKHUH BRX FDQ OHDUQ FUBSWRJUDSKB EHIHFWLYHOB'
                      )
                    }
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    Load Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreqCiphertext('')}
                    className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={freqCiphertext}
                onChange={e => setFreqCiphertext(e.target.value)}
                placeholder="Paste any ciphertext or paragraph here..."
                className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-y"
              />
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    02 — Frequency Distribution
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Ciphertext vs Natural English benchmark
                  </p>
                </div>
              </div>

              <FrequencyChart
                frequencies={freqAnalysis.frequencies}
                totalLetters={freqAnalysis.totalLetters}
                uniqueLetters={freqAnalysis.uniqueLetters}
              />
            </div>
          </div>

          {/* Info Side (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-cyan-500/30 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  How Frequency Attack Works
                </h3>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                In natural English text, letters appear with predictable frequency. The letter{' '}
                <strong className="text-cyan-400">E</strong> appears roughly{' '}
                <strong className="text-[var(--text-primary)]">12.7%</strong> of the time, followed
                by T, A, O, I, N.
              </p>

              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Monoalphabetic ciphers preserve letter distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>The most frequent ciphertext letter likely maps to 'E'</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Look for common bigrams: TH, HE, IN, ER, AN</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Compare your chart to English benchmark bar</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  English Letter Frequencies
                </h3>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono">
                {[
                  ['E', '12.70%'],
                  ['T', '9.06%'],
                  ['A', '8.17%'],
                  ['O', '7.51%'],
                  ['I', '6.97%'],
                  ['N', '6.75%'],
                  ['S', '6.33%'],
                  ['H', '6.09%'],
                ].map(([letter, pct], idx) => (
                  <div
                    key={letter}
                    className="flex items-center justify-between py-1 border-b border-[var(--border-main)] last:border-0"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--text-secondary)] w-4">
                        #{idx + 1}
                      </span>
                      <span className="text-cyan-400 font-bold w-4">{letter}</span>
                    </span>
                    <span className="text-[var(--text-primary)]">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Caesar Brute-Force */}
      {activeTab === 'caesar-brute' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main content (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  01 — Caesar Ciphertext to Crack
                </label>
                <button
                  type="button"
                  onClick={() => setBruteCiphertext('PHHW PH DW WKH IRUXP WRPRUURZ DW GDZQ')}
                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
                >
                  Load Sample
                </button>
              </div>

              <textarea
                rows={4}
                value={bruteCiphertext}
                onChange={e => setBruteCiphertext(e.target.value)}
                placeholder="Enter encrypted text..."
                className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 resize-y"
              />
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    02 — Exhaustive Search (All 25 Shifts)
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Caesar keyspace is tiny — exhaustive search instantly recovers plaintext
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {bruteCandidates.map(c => {
                  const shiftNum = Number(c.key);
                  const isCopied = copiedShift === shiftNum;
                  return (
                    <div
                      key={c.key}
                      className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        c.isLikelyMatch
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : 'bg-[var(--surface-secondary)] border-[var(--border-main)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-[11px] font-bold text-[var(--text-secondary)] w-16">
                          Shift {String(shiftNum).padStart(2, '0')}
                        </span>
                        {c.isLikelyMatch && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Likely Match
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs text-[var(--text-primary)] break-all flex-1 sm:px-3">
                        {c.result}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyShift(c.result, shiftNum)}
                        className="text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 cursor-pointer transition-colors self-end sm:self-center"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Info Side (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-rose-500/30 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Unlock className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Why Brute-Force Works
                </h3>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The Caesar cipher has only <strong className="text-rose-400">25 possible keys</strong>.
                Modern computers can test all 25 shifts in less than a millisecond.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-[var(--border-main)]">
                <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-main)]">
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    Keyspace
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-primary)]">25</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-main)]">
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    Brute-force time
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">&lt; 1 ms</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    Approach
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-primary)]">
                    Try all
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  How to Identify the Answer
                </h3>
              </div>

              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Look for the shift that produces readable English</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Common English words: THE, AND, FOR, YOU</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>If multiple look plausible, look for full sentences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Automated tools score shifts by dictionary match</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}