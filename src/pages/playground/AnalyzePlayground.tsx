import { useState, useMemo } from 'react';
import { analyzeFrequency } from '../../crypto/analysis/frequency';
import { bruteForceCaesar } from '../../crypto/analysis/caesarBruteForce';
import { FrequencyChart } from '../../components/playground/FrequencyChart';
import { SecurityNotice } from '../../components/common/SecurityNotice';
import { Button } from '../../components/common/Button';
import {
  Unlock,
  BarChart3,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';

export function AnalyzePlayground() {
  const [activeTab, setActiveTab] = useState<'frequency' | 'caesar-brute'>('frequency');

  // Frequency analysis state
  const [freqCiphertext, setFreqCiphertext] = useState(
    'KHOOR ZRUOG WKLV LV DQ HQFUBSWHG PHVVDJH XVLQJ FDHVDU FLSKHU'
  );

  // Caesar Brute-Force state
  const [bruteCiphertext, setBruteCiphertext] = useState(
    'WKH VHFUHW FRGH LV FKLSVHW'
  );
  const [copiedShift, setCopiedShift] = useState<number | null>(null);

  // Compute Frequency analysis
  const freqAnalysis = useMemo(() => {
    return analyzeFrequency(freqCiphertext);
  }, [freqCiphertext]);

  // Compute Caesar Brute-Force
  const bruteCandidates = useMemo(() => {
    return bruteForceCaesar(bruteCiphertext);
  }, [bruteCiphertext]);

  const handleCopyShift = (text: string, shift: number) => {
    navigator.clipboard.writeText(text);
    setCopiedShift(shift);
    setTimeout(() => setCopiedShift(null), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <Unlock className="w-3.5 h-3.5" />
          Cryptanalysis & Cipher Cracking
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cryptanalysis Laboratory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Cryptanalysis is the art of deciphering encrypted text without prior knowledge of the secret key by finding statistical patterns, frequency fingerprints, or searching small keyspaces.
        </p>
      </div>

      <SecurityNotice type="classical" />

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('frequency')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'frequency'
              ? 'bg-sky-600 text-white dark:bg-sky-500 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Character Frequency Analysis
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('caesar-brute')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'caesar-brute'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Unlock className="w-4 h-4" />
          Caesar 25-Shift Brute-Force Cracker
        </button>
      </div>

      {/* Tab 1: Character Frequency Analysis */}
      {activeTab === 'frequency' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Input Ciphertext for Statistical Frequency Inspection
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFreqCiphertext(
                      'ZHOFRPH WR WKH FBEHUVHFXULWB DFDGHPB RI FKLSHUODE ZKHUH BRX FDQ OHDUQ FUBSWRJUDSKB EHIHFWLYHOB'
                    )
                  }
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Load Sample
                </button>
                <button
                  type="button"
                  onClick={() => setFreqCiphertext('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={freqCiphertext}
              onChange={e => setFreqCiphertext(e.target.value)}
              placeholder="Paste any ciphertext or paragraph here..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Chart Display */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" />
              Observed Frequency Distribution vs Natural English Benchmark
            </h3>

            <FrequencyChart
              frequencies={freqAnalysis.frequencies}
              totalLetters={freqAnalysis.totalLetters}
              uniqueLetters={freqAnalysis.uniqueLetters}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Caesar Brute-Force Cracker */}
      {activeTab === 'caesar-brute' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Enter Caesar Ciphertext to Crack
              </label>
              <button
                type="button"
                onClick={() => setBruteCiphertext('PHHW PH DW WKH IRUXM WRPRUURZ DW GDZQ')}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Load Roman Intercept Sample
              </button>
            </div>

            <textarea
              rows={3}
              value={bruteCiphertext}
              onChange={e => setBruteCiphertext(e.target.value)}
              placeholder="Enter encrypted text..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Exhaustive 25 Candidates List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-rose-500" />
                  Exhaustive Keyspace Search (All 25 Shifts)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Because the Caesar keyspace contains only 25 shifts, an exhaustive search instantly recovers the original message.
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
                    className={`p-3 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      c.isLikelyMatch
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 w-16">
                        Shift {shiftNum < 10 ? `0${shiftNum}` : shiftNum}
                      </span>
                      {c.isLikelyMatch && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="w-3 h-3" /> Likely Match
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all flex-1 px-2">
                      {c.result}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyShift(c.result, shiftNum)}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-center"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied
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
      )}
    </div>
  );
}
