import { useState, useMemo, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { analyzeFrequency, ENGLISH_FREQUENCIES } from '../../../crypto/analysis/frequency';
import { bruteForceCaesar } from '../../../crypto/analysis/caesarBruteForce';
import {
  bruteForceSingleByteXor,
  parseXorInput,
} from '../../../crypto/analysis/xorBruteForce';
import {
  crackVigenere,
  decryptVigenerePreservingFormat,
} from '../../../crypto/analysis/vigenereCracker';
import {
  identifyHash,
  HashIdentifierResult,
} from '../../../crypto/analysis/hashIdentifier';
import { FrequencyChart } from '../../../components/playground/FrequencyChart';
import { SecurityNotice } from '../../../components/common/SecurityNotice';
import { CardInfoButton } from '../../../components/common/CardInfoButton';
import { ExecutionInfo } from '../shared/ExecutionInfo';
import { FeatureGuide } from '../../../crypto/analysis/FeatureGuide';
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
  ArrowLeft,
  Layers,
  ShieldAlert,
  History,
  Binary,
  Hash,
  Fingerprint,
  AlertTriangle,
  ShieldCheck,
  KeyRound,
  Sparkles,
} from 'lucide-react';
// ============================================================
// Hash Identifier — Security color configuration
// ============================================================
type SecurityLevel = 'broken' | 'weak' | 'ok' | 'strong';
type ColorKey = 'rose' | 'amber' | 'cyan' | 'emerald';

interface SecurityConfig {
  color: ColorKey;
  label: string;
  icon: typeof ShieldAlert;
}

interface ColorClass {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

const SECURITY_CONFIG: Record<SecurityLevel, SecurityConfig> = {
  broken: { color: 'rose', label: 'BROKEN', icon: ShieldAlert },
  weak: { color: 'amber', label: 'WEAK', icon: AlertTriangle },
  ok: { color: 'cyan', label: 'OK', icon: ShieldCheck },
  strong: { color: 'emerald', label: 'STRONG', icon: ShieldCheck },
};

const COLOR_CLASSES: Record<ColorKey, ColorClass> = {
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
};

type AnalyzeTab = 'frequency' | 'caesar-brute' | 'xor-brute' | 'vigenere-crack' | 'hash-id';

// ============================================================
// Feature Guide — accent mapping per tab
// ============================================================
const FEATURE_ACCENT: Record<
  AnalyzeTab,
  'cyan' | 'rose' | 'amber' | 'emerald' | 'purple'
> = {
  frequency: 'cyan',
  'caesar-brute': 'rose',
  'xor-brute': 'amber',
  'vigenere-crack': 'emerald',
  'hash-id': 'purple',
};

// ============================================================
// Reusable: small stat row
// ============================================================
function StatRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-main)] last:border-0">
      <span className="text-[11px] font-mono text-[var(--text-secondary)]">{label}</span>
      <span className={`text-[11px] font-mono ${valueClass ?? 'text-[var(--text-primary)]'}`}>
        {value}
      </span>
    </div>
  );
}

// ============================================================
// Reusable: Card Info Panel (inline) — untuk card yang tidak punya sidebar
// ============================================================
function InlineInfo({ children, accent }: { children: React.ReactNode; accent: 'cyan' | 'rose' | 'amber' | 'emerald' | 'purple' }) {
  const accentClass = {
    cyan: 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400',
    rose: 'bg-rose-500/5 border-rose-500/20 text-rose-400',
    amber: 'bg-amber-500/5 border-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/5 border-purple-500/20 text-purple-400',
  }[accent];

  return (
    <div className={`p-3 rounded-xl border ${accentClass} flex items-start gap-2`}>
      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{children}</div>
    </div>
  );
}

export function AnalyzePlayground() {
  const [activeTab, setActiveTab] = useState<AnalyzeTab>('frequency');

  // Frequency tab
  const [freqCiphertext, setFreqCiphertext] = useState(
    'KHOOR ZRUOG WKLV LV DQ HQFUBSWHG PHVVDJH XVLQJ FDHVDU FLSKHU'
  );
  const deferredFreq = useDeferredValue(freqCiphertext);

  // Caesar tab
  const [bruteCiphertext, setBruteCiphertext] = useState('WKH VHFUHW FRGH LV FKLSVHW');
  const [copiedShift, setCopiedShift] = useState<number | null>(null);
  const [caesarSortBy, setCaesarSortBy] = useState<'shift' | 'score'>('shift');

  // XOR tab
  const [xorInput, setXorInput] = useState(
    '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736'
  );
  const [copiedXorKey, setCopiedXorKey] = useState<number | null>(null);
  const [xorShowTopOnly, setXorShowTopOnly] = useState(true);

  // Vigenère tab
  const [vigenereInput, setVigenereInput] = useState(
    'LXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHR'
  );
  const [copiedVigenere, setCopiedVigenere] = useState(false);
  const [vigenereManualKey, setVigenereManualKey] = useState('');

  // Hash tab
  const [hashInput, setHashInput] = useState('5d41402abc4b2a76b9719d911017c592');

  // ============================================================
  // Memoized computations
  // ============================================================
  const freqAnalysis = useMemo(() => analyzeFrequency(deferredFreq), [deferredFreq]);

  const bruteCandidates = useMemo(
    () => bruteForceCaesar(bruteCiphertext),
    [bruteCiphertext]
  );

  const sortedCaesarCandidates = useMemo(() => {
    if (caesarSortBy === 'shift') return bruteCandidates;
    return [...bruteCandidates].sort((a, b) => {
      if (a.isLikelyMatch !== b.isLikelyMatch) return a.isLikelyMatch ? -1 : 1;
      return Number(a.key) - Number(b.key);
    });
  }, [bruteCandidates, caesarSortBy]);

  const xorBytes = useMemo(() => parseXorInput(xorInput), [xorInput]);
  const xorCandidates = useMemo(() => bruteForceSingleByteXor(xorBytes), [xorBytes]);

  const xorDisplayCandidates = useMemo(() => {
    if (xorShowTopOnly) {
      return [...xorCandidates].sort((a, b) => b.score - a.score).slice(0, 10);
    }
    return xorCandidates;
  }, [xorCandidates, xorShowTopOnly]);

  const vigenereResult = useMemo(() => {
    if (!vigenereInput.trim()) return null;
    return crackVigenere(vigenereInput);
  }, [vigenereInput]);

  const hashResult: HashIdentifierResult | null = useMemo(() => {
    if (!hashInput.trim()) return null;
    return identifyHash(hashInput);
  }, [hashInput]);

  // ============================================================
  // Handlers
  // ============================================================
  const handleCopyShift = (text: string, shift: number) => {
    navigator.clipboard.writeText(text);
    setCopiedShift(shift);
    setTimeout(() => setCopiedShift(null), 2000);
  };

  const handleCopyXor = (text: string, key: number) => {
    navigator.clipboard.writeText(text);
    setCopiedXorKey(key);
    setTimeout(() => setCopiedXorKey(null), 2000);
  };

  const handleCopyVigenere = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVigenere(true);
    setTimeout(() => setCopiedVigenere(false), 2000);
  };

  // ============================================================
  // Tabs config
  // ============================================================
  const TABS: {
    id: AnalyzeTab;
    label: string;
    short: string;
    icon: typeof BarChart3;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    activeBg: string;
  }[] = [
    {
      id: 'frequency',
      label: 'Frequency Analysis',
      short: 'Frequency',
      icon: BarChart3,
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/30',
      activeBg: 'bg-cyan-500',
    },
    {
      id: 'caesar-brute',
      label: 'Caesar Brute-Force',
      short: 'Caesar',
      icon: Unlock,
      accentText: 'text-rose-400',
      accentBg: 'bg-rose-500/10',
      accentBorder: 'border-rose-500/30',
      activeBg: 'bg-rose-500',
    },
    {
      id: 'xor-brute',
      label: 'XOR Brute-Force',
      short: 'XOR',
      icon: Binary,
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-500/30',
      activeBg: 'bg-amber-500',
    },
    {
      id: 'vigenere-crack',
      label: 'Vigenère Cracker',
      short: 'Vigenère',
      icon: KeyRound,
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-500/30',
      activeBg: 'bg-emerald-500',
    },
    {
      id: 'hash-id',
      label: 'Hash Identifier',
      short: 'Hash ID',
      icon: Fingerprint,
      accentText: 'text-purple-400',
      accentBg: 'bg-purple-500/10',
      accentBorder: 'border-purple-500/30',
      activeBg: 'bg-purple-500',
    },
  ];

  const activeTabConfig = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* BACK */}
      <Link
        to="/playground"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Playground Hub
      </Link>

      {/* HEADER */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-rose-500/30 bg-rose-500/10 text-rose-400">
          <Unlock className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Cryptanalysis & Cipher Cracking
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
          Cryptanalysis Laboratory
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Cryptanalysis is the art of{' '}
          <strong className="text-rose-400">deciphering encrypted text without the key</strong>.
          Instead of guessing passwords, cryptanalysts exploit statistical patterns, structural
          weaknesses, or the sheer smallness of a keyspace.
        </p>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Five hands-on tools: frequency analysis, Caesar brute-force, single-byte XOR cracker,
          Vigenère key recovery, and hash identification.
        </p>

        <p className="text-[11px] sm:text-xs font-mono text-[var(--text-secondary)]">
          5 analysis tools · 100% client-side · Historical + modern techniques
        </p>
      </div>

      {/* TAB NAVIGATION — Segmented Control */}
      <div className="flex justify-center">
        <div className="relative inline-flex p-1.5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-main)] shadow-lg overflow-x-auto max-w-full">
          {TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `${tab.activeBg} text-black shadow-md`
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-main)]'
                }`}
              >
                <TabIcon
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                  strokeWidth={2.5}
                />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Header */}
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl border ${activeTabConfig.accentBg} ${activeTabConfig.accentBorder}`}
      >
        <div
          className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${activeTabConfig.accentBg} ${activeTabConfig.accentBorder} ${activeTabConfig.accentText}`}
        >
          <activeTabConfig.icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h2 className={`text-base font-bold ${activeTabConfig.accentText}`}>
            {activeTabConfig.label}
          </h2>
          <p className="text-[11px] font-mono text-[var(--text-secondary)]">
            {activeTab === 'frequency' && 'Compare ciphertext statistics against natural English'}
            {activeTab === 'caesar-brute' && 'Try all 25 possible Caesar shifts instantly'}
            {activeTab === 'xor-brute' && 'Crack single-byte XOR with chi-squared scoring'}
            {activeTab === 'vigenere-crack' && 'Recover polyalphabetic key via IoC + Kasiski'}
            {activeTab === 'hash-id' && 'Detect hash algorithm from length and format'}
          </p>
        </div>
      </div>

      <SecurityNotice type="classical" />

      {/* ============================================================
          FEATURE GUIDE — per-tab explanation
      ============================================================ */}
      <FeatureGuide tab={activeTab} accent={FEATURE_ACCENT[activeTab]} />

      {/* ============================================================
          TAB 1 — FREQUENCY ANALYSIS
      ============================================================ */}
      {activeTab === 'frequency' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            {/* 01 Input */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    01 — Input Ciphertext
                  </label>
                  <CardInfoButton
                    title="Input Ciphertext"
                    subtitle="What can I analyze here?"
                    sections={[
                      { heading: 'Best input type', body: 'Paste any ciphertext created by a monoalphabetic substitution cipher. Longer text works better: 100+ characters is ideal.', icon: 'info' },
                      { heading: 'Pure letters work best', body: 'Spaces and punctuation are ignored during analysis.', icon: 'tip' },
                      { heading: 'Try the sample', body: 'Click "Load Sample" to see a Caesar-encrypted paragraph.', icon: 'book' },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFreqCiphertext(
                        'ZHOFRPH WR WKH FBEHUVHFXULWB DFDGHPB RI FKLSHUODE ZKHUH BRX FDQ OHDUQ FUBSWRJUDSKB EHIHFWLYHOY'
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

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>{freqCiphertext.length} characters</span>
                <span>UTF-8 encoded</span>
              </div>

              <InlineInfo accent="cyan">
                <strong className="text-cyan-400">Tujuan:</strong> menghitung seberapa sering setiap huruf (A–Z) muncul di ciphertext. Ini langkah pertama untuk memecahkan substitution cipher.
              </InlineInfo>
            </div>

            {/* 02 Frequency Distribution */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      02 — Frequency Distribution
                    </h3>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                      Ciphertext vs Natural English benchmark
                    </p>
                  </div>
                </div>
                <CardInfoButton
                  title="Frequency Distribution Chart"
                  subtitle="How to read the bars"
                  sections={[
                    { heading: 'Two bars per letter', body: 'Cyan: your ciphertext. Gray: natural English. Aligning them reveals the shift.', icon: 'info' },
                    { heading: 'The E → X pattern', body: "If your most common ciphertext letter is 'X', it likely maps to English's 'E'.", icon: 'tip' },
                    { heading: 'Total letters analyzed', body: 'Fewer than 50 letters makes analysis unreliable.', icon: 'warning' },
                  ]}
                />
              </div>

              {freqAnalysis.totalLetters === 0 ? (
                <div className="py-12 text-center">
                  <Info className="w-6 h-6 mx-auto mb-2 text-[var(--text-secondary)]" />
                  <p className="text-xs font-mono text-[var(--text-secondary)]">
                    Enter some text above to see the frequency distribution.
                  </p>
                </div>
              ) : (
                <>
                  <FrequencyChart
                    frequencies={freqAnalysis.frequencies}
                    totalLetters={freqAnalysis.totalLetters}
                    uniqueLetters={freqAnalysis.uniqueLetters}
                  />
                  <InlineInfo accent="cyan">
                    <strong className="text-cyan-400">Cara membaca:</strong> Bandingkan puncak
                    tertinggi ciphertext (bar cyan) dengan puncak English (bar abu-abu). Selisih
                    posisi = shift Caesar. Contoh: kalau puncak ciphertext di huruf X (posisi 23),
                    dan English di E (posisi 4), maka shift = 23 − 4 = 19.
                  </InlineInfo>
                </>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
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
                <strong className="text-[var(--text-primary)]">12.7%</strong> of the time.
              </p>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" /><span>Monoalphabetic ciphers preserve letter distribution</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" /><span>The most frequent ciphertext letter likely maps to 'E'</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" /><span>Look for common bigrams: TH, HE, IN, ER, AN</span></li>
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
                {ENGLISH_FREQUENCIES.slice(0, 8).map(({ letter, pct }, idx) => (
                  <div key={letter} className="flex items-center justify-between py-1 border-b border-[var(--border-main)] last:border-0">
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--text-secondary)] w-4">#{idx + 1}</span>
                      <span className="text-cyan-400 font-bold w-4">{letter}</span>
                    </span>
                    <span className="text-[var(--text-primary)]">{pct.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {freqAnalysis.topBigrams && freqAnalysis.topBigrams.length > 0 && (
              <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] truncate">
                      Top Bigrams
                    </h3>
                  </div>
                  <CardInfoButton
                    title="Top Bigrams"
                    subtitle="What are bigrams and why they matter"
                    sections={[
                      { heading: 'What is a bigram?', body: 'A bigram is a pair of consecutive letters (e.g., TH, HE, IN). Bigrams are more distinctive than single letters because English has strong bigram patterns.', icon: 'info' },
                      { heading: 'Common English bigrams', body: 'The most frequent English bigrams: TH, HE, IN, ER, AN, RE, ON, AT, EN, ND.', icon: 'tip' },
                      { heading: 'How to use them', body: 'If your ciphertext has "XY" appearing many times, and "TH" is the most common English bigram, then X→T and Y→H. This helps crack substitution ciphers.', icon: 'book' },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {freqAnalysis.topBigrams.map(({ bigram, count }) => (
                    <div key={bigram} className="p-2 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center">
                      <div className="text-[13px] font-mono font-bold text-purple-400">{bigram}</div>
                      <div className="text-[9px] font-mono text-[var(--text-secondary)]">×{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] truncate">
                    Attack Models
                  </h3>
                </div>
                <CardInfoButton
                  title="Cryptanalytic Attack Models"
                  subtitle="How attackers break ciphers"
                  sections={[
                    { heading: '1. Ciphertext-only', body: 'Attacker only sees ciphertext. Hardest — works on classical ciphers using statistics.', icon: 'info' },
                    { heading: '2. Known-plaintext', body: 'Attacker knows some plaintext–ciphertext pairs.', icon: 'book' },
                    { heading: '3. Chosen-plaintext', body: 'Attacker requests encryptions. Modern ciphers must resist IND-CPA.', icon: 'warning' },
                    { heading: '4. Chosen-ciphertext', body: 'Strongest model. AEAD ciphers must resist IND-CCA2.', icon: 'danger' },
                  ]}
                />
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                {[
                  ['1', 'Ciphertext-only', 'statistical analysis'],
                  ['2', 'Known-plaintext', 'known pairs'],
                  ['3', 'Chosen-plaintext', 'arbitrary encryption'],
                  ['4', 'Chosen-ciphertext', 'strongest threat'],
                ].map(([n, name, hint]) => (
                  <li key={n} className="flex items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-purple-400 w-3 shrink-0">{n}</span>
                    <span><strong className="text-[var(--text-primary)]">{name}</strong> — {hint}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ExecutionInfo />
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2 — CAESAR BRUTE-FORCE
      ============================================================ */}
      {activeTab === 'caesar-brute' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            {/* 01 Input */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    01 — Caesar Ciphertext to Crack
                  </label>
                  <CardInfoButton
                    title="Caesar Ciphertext to Crack"
                    subtitle="What can I decrypt?"
                    sections={[
                      { heading: 'Caesar-encrypted text only', body: 'This tool specifically breaks Caesar ciphertext (monoalphabetic shift).', icon: 'warning' },
                      { heading: 'Short input works', body: 'Even a few words are enough.', icon: 'tip' },
                      { heading: 'Try the sample', body: 'Correct shift will be highlighted in green.', icon: 'book' },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBruteCiphertext('PHHW PH DW WKH IRUXP WRPRUURZ DW GDZQ')}
                    className="text-[11px] font-mono text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
                  >
                    Load Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setBruteCiphertext('')}
                    className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={bruteCiphertext}
                onChange={e => setBruteCiphertext(e.target.value)}
                placeholder="Enter encrypted text..."
                className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 resize-y"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>{bruteCiphertext.length} characters</span>
                <span>25 possible shifts</span>
              </div>

              <InlineInfo accent="rose">
                <strong className="text-rose-400">Tujuan:</strong> mencoba semua 25 kemungkinan
                shift Caesar, lalu memilih yang paling "English". Cukup andal untuk ciphertext
                pendek karena keyspace sangat kecil.
              </InlineInfo>
            </div>

            {/* 02 Exhaustive Search */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      02 — Exhaustive Search (All 25 Shifts)
                    </h3>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                      Caesar keyspace is tiny — brute-force instantly recovers plaintext
                    </p>
                  </div>
                </div>
                <CardInfoButton
                  title="Exhaustive Search Results"
                  subtitle="How to spot the correct shift"
                  sections={[
                    { heading: 'Why 25 shifts?', body: 'Shift 0 = no change, so 25 meaningful shifts.', icon: 'info' },
                    { heading: 'Green highlight = likely match', body: 'Automated scoring based on common English words.', icon: 'tip' },
                    { heading: 'The scoring algorithm', body: 'Count matches against ~50 common English words.', icon: 'book' },
                    { heading: 'No guaranteed match?', body: "If input wasn't Caesar, no shift will look readable.", icon: 'warning' },
                  ]}
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 px-1">
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  <strong className="text-rose-400">{bruteCandidates.length}</strong> shifts ·{' '}
                  {bruteCandidates.filter(c => c.isLikelyMatch).length} likely
                </span>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
                  <button
                    type="button"
                    onClick={() => setCaesarSortBy('shift')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                      caesarSortBy === 'shift' ? 'bg-rose-500 text-black' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    By Shift
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaesarSortBy('score')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                      caesarSortBy === 'score' ? 'bg-rose-500 text-black' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    By Score
                  </button>
                </div>
              </div>

              {bruteCandidates.length === 0 ? (
                <div className="py-12 text-center">
                  <Info className="w-6 h-6 mx-auto mb-2 text-[var(--text-secondary)]" />
                  <p className="text-xs font-mono text-[var(--text-secondary)]">
                    Enter Caesar ciphertext above to see all 25 shifts.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 custom-modal-scroll">
                  {sortedCaesarCandidates.map(c => {
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
                          aria-label={`Copy plaintext for shift ${shiftNum}`}
                          className="text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 cursor-pointer transition-colors self-end sm:self-center"
                        >
                          {isCopied ? (<><Check className="w-3 h-3 text-emerald-400" /> Copied</>) : (<><Copy className="w-3 h-3" /> Copy</>)}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <InlineInfo accent="rose">
                <strong className="text-rose-400">Cara memilih:</strong> Cari baris dengan highlight
                hijau (hasil scoring otomatis) atau baris yang plaintext-nya terbaca sebagai
                kalimat English. Klik <em>Copy</em> untuk menyalin plaintext dari shift tersebut.
              </InlineInfo>

              <div className="pt-3 border-t border-[var(--border-main)] flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
                <Info className="w-3 h-3 text-rose-400 shrink-0" />
                <span>Scroll untuk melihat semua 25 shifts. Hijau = automated scoring mendeteksi English.</span>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
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
                The Caesar cipher has only <strong className="text-rose-400">25 possible keys</strong>. Modern computers can test all 25 shifts in less than a millisecond.
              </p>
              <div className="space-y-0 pt-2 border-t border-[var(--border-main)]">
                <StatRow label="Keyspace" value="25" />
                <StatRow label="Brute-force time" value="< 1 ms" valueClass="text-emerald-400" />
                <StatRow label="Approach" value="Try all" />
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
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" /><span>Look for the shift that produces readable English</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" /><span>Common English words: THE, AND, FOR, YOU</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" /><span>Automated tools score shifts by dictionary match</span></li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <History className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] truncate">
                    Real-World Impact
                  </h3>
                </div>
                <CardInfoButton
                  title="Why Cryptanalysis Matters"
                  subtitle="Historical breakthroughs"
                  sections={[
                    { heading: 'Al-Kindi (9th century)', body: 'Invented frequency analysis c. 850 AD.', icon: 'book' },
                    { heading: 'Bletchley Park (WWII)', body: 'Breaking Enigma shortened WWII by ~2 years.', icon: 'book' },
                    { heading: 'Modern implications', body: 'DES (1999), MD5 (2004), SHA-1 (2017) all broken.', icon: 'warning' },
                  ]}
                />
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                {[
                  ['850 AD', 'Al-Kindi invents frequency analysis'],
                  ['1939', 'Turing breaks Enigma at Bletchley Park'],
                  ['2004', 'MD5 collision demonstrated'],
                  ['2017', 'SHA-1 collision ("SHAttered")'],
                ].map(([year, event]) => (
                  <li key={year} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong className="text-[var(--text-primary)]">{year}</strong> — {event}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ExecutionInfo />
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3 — XOR BRUTE-FORCE
      ============================================================ */}
      {activeTab === 'xor-brute' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            {/* 01 Input */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    01 — XOR Ciphertext (Hex)
                  </label>
                  <CardInfoButton
                    title="Single-byte XOR Input"
                    subtitle="Hex or raw text?"
                    sections={[
                      { heading: 'Hex input (recommended)', body: 'Paste hex like "1b37373331363f78..." — spaces and 0x prefixes are ignored.', icon: 'info' },
                      { heading: 'Raw text fallback', body: 'If input is not valid hex, it is treated as UTF-8 bytes.', icon: 'tip' },
                      { heading: 'Classic CTF challenge', body: 'This is the famous Cryptopals Set 1 Challenge 3.', icon: 'book' },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setXorInput(
                        '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736'
                      )
                    }
                    className="text-[11px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer transition-colors"
                  >
                    Load Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setXorInput('')}
                    className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={xorInput}
                onChange={e => setXorInput(e.target.value)}
                placeholder="Paste hex (e.g. 1b37373331363f78) or raw text..."
                className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-y"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>{xorBytes.length} bytes · {xorInput.length} chars</span>
                <span>256 possible keys</span>
              </div>

              <InlineInfo accent="amber">
                <strong className="text-amber-400">Tujuan:</strong> ciphertext XOR di-decode
                dengan setiap kemungkinan key byte (0x00–0xFF), lalu hasilnya di-score
                berdasarkan seberapa "English" hasilnya. Input bisa berupa hex atau teks biasa.
              </InlineInfo>
            </div>

            {/* 02 Results */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Binary className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      02 — XOR Brute-Force Results
                    </h3>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                      All 256 byte keys scored by English frequency
                    </p>
                  </div>
                </div>
                <CardInfoButton
                  title="XOR Brute-Force Results"
                  subtitle="How scoring works"
                  sections={[
                    { heading: 'What is single-byte XOR?', body: 'Each byte of plaintext XORed with the SAME key byte.', icon: 'info' },
                    { heading: 'Chi-squared scoring', body: 'Lower chi-squared = more English-like. Higher score = better.', icon: 'tip' },
                    { heading: 'Why it works', body: 'English text has a distinctive letter distribution.', icon: 'book' },
                  ]}
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 px-1">
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Showing <strong className="text-amber-400">{xorDisplayCandidates.length}</strong> of {xorCandidates.length} keys
                </span>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
                  <button
                    type="button"
                    onClick={() => setXorShowTopOnly(true)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                      xorShowTopOnly ? 'bg-amber-500 text-black' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Top 10
                  </button>
                  <button
                    type="button"
                    onClick={() => setXorShowTopOnly(false)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                      !xorShowTopOnly ? 'bg-amber-500 text-black' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    All 256
                  </button>
                </div>
              </div>

              {xorCandidates.length === 0 ? (
                <div className="py-12 text-center">
                  <Info className="w-6 h-6 mx-auto mb-2 text-[var(--text-secondary)]" />
                  <p className="text-xs font-mono text-[var(--text-secondary)]">
                    Enter XOR ciphertext above.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 custom-modal-scroll">
                  {xorDisplayCandidates.map(c => {
                    const isCopied = copiedXorKey === c.key;
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
                          <span className="font-mono text-[11px] font-bold text-amber-400 w-14">{c.keyHex}</span>
                          <span className="font-mono text-[11px] text-[var(--text-secondary)] w-6">'{c.keyChar}'</span>
                          {c.isLikelyMatch && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> {c.score.toFixed(1)}
                            </span>
                          )}
                        </div>

                        <div className="font-mono text-xs text-[var(--text-primary)] break-all flex-1 sm:px-3">
                          {c.result}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyXor(c.result, c.key)}
                          aria-label={`Copy decrypted text for key ${c.keyHex}`}
                          className="text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 cursor-pointer transition-colors self-end sm:self-center"
                        >
                          {isCopied ? (<><Check className="w-3 h-3 text-emerald-400" /> Copied</>) : (<><Copy className="w-3 h-3" /> Copy</>)}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <InlineInfo accent="amber">
                <strong className="text-amber-400">Cara membaca:</strong> Setiap baris menampilkan
                key byte (contoh: <code>0x2a</code>), karakter printable-nya (<code>'*'</code>),
                dan hasil dekripsi. Baris hijau = skor tertinggi = paling mungkin adalah key yang
                benar. Klik <em>Copy</em> untuk menyalin plaintext.
              </InlineInfo>

              <div className="pt-3 border-t border-[var(--border-main)] flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
                <Info className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Hijau = chi-squared score ≥ 60. Semakin tinggi = semakin English-like.</span>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-amber-500/30 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Binary className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  How XOR Brute-Force Works
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Single-byte XOR uses the <strong className="text-amber-400">same key byte</strong> for every plaintext byte. With only 256 possible keys, we can try them all.
              </p>
              <div className="p-3 rounded-lg bg-[#0A0C10] border border-[#1E222B] font-mono text-[10px] text-[var(--text-secondary)] space-y-1">
                <div><span className="text-cyan-400">plaintext</span>  ⊕ key = ciphertext</div>
                <div><span className="text-amber-400">ciphertext</span> ⊕ key = plaintext</div>
                <div className="text-[9px] pt-1 border-t border-[#1E222B]">Try key ∈ [0x00, 0xFF]</div>
              </div>
              <div className="space-y-0 pt-2 border-t border-[var(--border-main)]">
                <StatRow label="Keyspace" value="256" />
                <StatRow label="Brute-force time" value="< 5 ms" valueClass="text-emerald-400" />
                <StatRow label="Approach" value="Try all + score" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Real-World Warning
                </h3>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Raw single-byte XOR is <strong className="text-rose-400">not encryption</strong>. It is a toy. Any ciphertext longer than ~30 bytes falls instantly.
              </p>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" /><span>Never use raw XOR for real secrets</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" /><span>Use AES-GCM or ChaCha20 instead</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" /><span>XOR is still used inside real ciphers</span></li>
              </ul>
            </div>

            <ExecutionInfo />
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4 — VIGENÈRE CRACKER
      ============================================================ */}
      {activeTab === 'vigenere-crack' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* KONTEN KIRI */}
          <div className="lg:col-span-8 space-y-5">
            {/* 01 Input */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    01 — Vigenère Ciphertext
                  </label>
                  <CardInfoButton
                    title="Vigenère Ciphertext Input"
                    subtitle="How to crack a polyalphabetic cipher"
                    sections={[
                      { heading: 'What is Vigenère?', body: 'Unlike Caesar (1 key), Vigenère uses a KEYWORD that repeats. Each letter shifts by a different amount.', icon: 'info' },
                      { heading: 'Longer input = better', body: 'You need at least 100 letters for reliable key recovery. 200+ is ideal.', icon: 'warning' },
                      { heading: 'How it works', body: '1. Estimate key length via Index of Coincidence\n2. Split into N columns\n3. Frequency analysis per column\n4. Combine to recover keyword\n5. Rank candidates by English-likeness', icon: 'book' },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setVigenereInput(
                        'LXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHR'
                      )
                    }
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors"
                  >
                    Load Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setVigenereInput('')}
                    className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={vigenereInput}
                onChange={e => setVigenereInput(e.target.value)}
                placeholder="Paste Vigenère ciphertext (letters only will be analyzed)..."
                className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-y"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>{vigenereInput.length} characters</span>
                {vigenereResult && <span>{vigenereResult.totalLetters} letters (A–Z)</span>}
              </div>

              {/* ⚠️ INFO PANJANG — highlight penting */}
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Rekomendasi Panjang Ciphertext
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Vigenère Cracker bekerja dengan <strong className="text-emerald-400">analisis statistik</strong>.
                  Semakin panjang ciphertext, semakin akurat hasilnya. Untuk hasil yang baik, gunakan
                  ciphertext minimal <strong className="text-emerald-400">200 huruf</strong>, idealnya{' '}
                  <strong className="text-emerald-400">300–500 huruf</strong>. Ciphertext pendek (&lt; 100 huruf)
                  sering menghasilkan key yang salah.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center">
                    <div className="text-[9px] font-mono uppercase text-rose-400 font-bold">&lt; 50</div>
                    <div className="text-[9px] font-mono text-[var(--text-secondary)]">Too short</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                    <div className="text-[9px] font-mono uppercase text-amber-400 font-bold">50–99</div>
                    <div className="text-[9px] font-mono text-[var(--text-secondary)]">Marginal</div>
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
                    <div className="text-[9px] font-mono uppercase text-cyan-400 font-bold">100–199</div>
                    <div className="text-[9px] font-mono text-[var(--text-secondary)]">Good</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <div className="text-[9px] font-mono uppercase text-emerald-400 font-bold">200+</div>
                    <div className="text-[9px] font-mono text-[var(--text-secondary)]">Excellent</div>
                  </div>
                </div>
              </div>

              {/* Length hint dinamis */}
              {vigenereResult && vigenereResult.totalLetters > 0 && (
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono border ${
                    vigenereResult.lengthHint === 'excellent'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : vigenereResult.lengthHint === 'good'
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      : vigenereResult.lengthHint === 'marginal'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {vigenereResult.lengthHint === 'excellent' && (
                      <>Panjang ciphertext: <strong>{vigenereResult.totalLetters} huruf</strong> — Excellent. Hasil cracker seharusnya akurat.</>
                    )}
                    {vigenereResult.lengthHint === 'good' && (
                      <>Panjang ciphertext: <strong>{vigenereResult.totalLetters} huruf</strong> — Good. Cracker seharusnya bekerja dengan baik.</>
                    )}
                    {vigenereResult.lengthHint === 'marginal' && (
                      <>Panjang ciphertext: <strong>{vigenereResult.totalLetters} huruf</strong> — Marginal. Hasil mungkin kurang akurat. Gunakan 200+ huruf.</>
                    )}
                    {vigenereResult.lengthHint === 'too-short' && (
                      <>Panjang ciphertext: <strong>{vigenereResult.totalLetters} huruf</strong> — Terlalu pendek. Butuh minimal 100 huruf untuk hasil yang baik.</>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* 02 Results */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      02 — Top {vigenereResult?.candidates.length ?? 0} Candidates
                    </h3>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                      Multiple key hypotheses — ranked by English-likeness
                    </p>
                  </div>
                </div>
                <CardInfoButton
                  title="Why Multiple Candidates?"
                  subtitle="Cracking is a hypothesis test"
                  sections={[
                    { heading: 'No single "correct" answer', body: 'Cracking Vigenère is a statistical process. IoC gives a strong hint, but not certainty. The right approach is to generate top-N candidates and rank them.', icon: 'info' },
                    { heading: 'How ranking works', body: 'Each candidate is scored by:\n1. Common English words found (60% weight)\n2. Common trigrams found (40% weight)\n\nHigher score = more likely correct.', icon: 'tip' },
                    { heading: 'Pick the readable one', body: 'Look at all candidates. The correct one will be the one that produces readable English. If none are readable, the ciphertext may not be Vigenère, or it may not use English plaintext.', icon: 'book' },
                  ]}
                />
              </div>

              {!vigenereResult || vigenereResult.totalLetters === 0 ? (
                <div className="py-12 text-center">
                  <KeyRound className="w-6 h-6 mx-auto mb-2 text-[var(--text-secondary)]" />
                  <p className="text-xs font-mono text-[var(--text-secondary)]">
                    Paste Vigenère ciphertext above to see top candidates.
                  </p>
                </div>
              ) : vigenereResult.totalLetters < 20 ? (
                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-400 mb-1">Not enough data</p>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{vigenereResult.warning}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Key length candidates */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        Key Length Estimation (by IoC)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {vigenereResult.keyLengthCandidates.map(c => (
                        <div
                          key={c.length}
                          className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center"
                        >
                          <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
                            {c.length}
                          </div>
                          <div className="text-[9px] font-mono text-[var(--text-secondary)]">
                            IoC {(c.ioc * 100).toFixed(2)}%
                          </div>
                          <div
                            className={`text-[9px] font-mono uppercase tracking-wider mt-0.5 ${
                              c.confidence === 'high'
                                ? 'text-emerald-400'
                                : c.confidence === 'medium'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {c.confidence}
                          </div>
                        </div>
                      ))}
                    </div>
                    <InlineInfo accent="emerald">
                      <strong className="text-emerald-400">Apa ini?</strong> Estimasi panjang key
                      berdasarkan Index of Coincidence. Setiap angka = kemungkinan panjang key.
                      IoC lebih tinggi = lebih mungkin panjang key yang benar. Cracker akan mencoba
                      semua kandidat ini dan memilih yang plaintext-nya paling English.
                    </InlineInfo>
                  </div>

                  {/* Candidates list */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block px-1">
                      Candidate Keys (ranked)
                    </span>
                    {vigenereResult.candidates.map((cand, idx) => {
                      const isBest = idx === 0;
                      const confidenceColor = {
                        high: { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' },
                        medium: { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10' },
                        low: { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10' },
                      }[cand.confidence];

                      return (
                        <div
                          key={idx}
                          className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                            isBest
                              ? 'border-emerald-500/60 bg-emerald-500/[0.06] shadow-lg shadow-emerald-500/10'
                              : 'border-[var(--border-main)] bg-[var(--surface-secondary)]'
                          }`}
                        >
                          {/* Header row */}
                          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-base ${
                                  isBest
                                    ? 'bg-emerald-500 text-black border-emerald-500'
                                    : 'bg-[var(--surface-main)] border-[var(--border-main)] text-[var(--text-primary)]'
                                }`}
                              >
                                #{cand.rank}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                                    Key:
                                  </span>
                                  <span className="font-mono text-lg font-bold text-emerald-400 tracking-[0.2em]">
                                    {cand.key}
                                  </span>
                                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                                    (length {cand.keyLength})
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${confidenceColor.border} ${confidenceColor.text} ${confidenceColor.bg}`}>
                                    {cand.confidence}
                                  </span>
                                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                                    Score: <strong className="text-[var(--text-primary)]">{cand.score.toFixed(1)}</strong>
                                  </span>
                                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                                    Words: <strong className="text-[var(--text-primary)]">{cand.wordMatches}</strong>
                                  </span>
                                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                                    Trigrams: <strong className="text-[var(--text-primary)]">{cand.trigramMatches}</strong>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyVigenere(cand.plaintextFormatted)}
                              aria-label={`Copy plaintext for key ${cand.key}`}
                              className="text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                            >
                              {copiedVigenere ? (
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

                          {/* Plaintext preview */}
                          <div className="p-3 rounded-lg bg-[#0A0C10] border border-[#1E222B] font-mono text-xs text-emerald-400 break-all leading-relaxed select-all max-h-32 overflow-y-auto">
                            {cand.plaintextFormatted}
                          </div>

                          {/* Column breakdown (collapsible — hanya untuk best) */}
                          {isBest && (
                            <details className="mt-3">
                              <summary className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                                Show per-column analysis ({cand.columns.length} columns)
                              </summary>
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
                                {cand.columns.map(col => (
                                  <div
                                    key={col.column}
                                    className="p-2 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)] flex items-center justify-between gap-1.5"
                                  >
                                    <div className="min-w-0">
                                      <div className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                                        Col {col.column + 1}
                                      </div>
                                      <div className="text-[9px] font-mono text-[var(--text-secondary)]">
                                        shift {col.bestShift}
                                      </div>
                                    </div>
                                    <div className="text-lg font-mono font-bold text-emerald-400">
                                      {col.bestLetter}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Manual Key Verification */}
                  <div className="p-5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-3">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        Manual Key Verification
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      Punya key yang ingin diverifikasi? Masukkan di bawah ini untuk melihat
                      hasil dekripsi manual. Berguna kalau Anda ingin membandingkan dengan
                      kandidat yang dihasilkan cracker.
                    </p>
                    <input
                      type="text"
                      value={vigenereManualKey}
                      onChange={e => setVigenereManualKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      placeholder="Enter key (letters only)"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--surface-main)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                    {vigenereManualKey.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                          Decrypted with key "{vigenereManualKey}":
                        </div>
                        <div className="p-3 rounded-lg bg-[#0A0C10] border border-[#1E222B] font-mono text-xs text-emerald-400 break-all leading-relaxed select-all max-h-32 overflow-y-auto">
                          {decryptVigenerePreservingFormat(vigenereInput, vigenereManualKey)}
                        </div>
                      </div>
                    )}
                  </div>

                  {vigenereResult.warning && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {vigenereResult.warning}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-emerald-500/30 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  How Candidates Are Ranked
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Each candidate is a <strong className="text-emerald-400">hypothesis</strong> about the key.
                We score them by how "English" the resulting plaintext looks.
              </p>
              <div className="space-y-0 pt-2 border-t border-[var(--border-main)]">
                <StatRow label="Word match weight" value="60%" valueClass="text-emerald-400" />
                <StatRow label="Trigram weight" value="40%" valueClass="text-emerald-400" />
                <StatRow label="Max candidates" value="5" />
              </div>
              <ul className="space-y-1.5 text-[11px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-main)]">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong className="text-emerald-400">Rank #1</strong> = highest score (best guess)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong className="text-amber-400">Rank #2–#5</strong> = alternative hypotheses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span><strong className="text-cyan-400">Read the plaintext</strong> — pick the readable one</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  How to Pick the Right One
                </h3>
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Read each plaintext — one will be readable English</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Higher score & word matches = more likely correct</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Kalau semua salah, coba ciphertext lebih panjang</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Look for common words like THE, AND, OF, TO</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <History className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] truncate">
                    Historical Context
                  </h3>
                </div>
                <CardInfoButton
                  title="Vigenère History"
                  subtitle="300 years of false security"
                  sections={[
                    { heading: '1553 — Vigenère publishes his cipher', body: 'It was considered "le chiffre indéchiffrable" (the unbreakable cipher).', icon: 'book' },
                    { heading: '1863 — Kasiski breaks it', body: 'Friedrich Kasiski published the first general attack. Charles Babbage had independently broken it earlier (~1854).', icon: 'book' },
                    { heading: 'Lesson', body: 'For 300 years, Vigenère was thought secure. It was not. This is why modern crypto relies on proofs, not intuition.', icon: 'warning' },
                  ]}
                />
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                {[
                  ['1553', 'Vigenère published (unbreakable!)'],
                  ['1854', 'Babbage secretly cracks it'],
                  ['1863', 'Kasiski publishes the attack'],
                  ['Today', 'Falls in < 50 ms in your browser'],
                ].map(([year, event]) => (
                  <li key={year} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong className="text-[var(--text-primary)]">{year}</strong> — {event}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ExecutionInfo />
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 5 — HASH IDENTIFIER
      ============================================================ */}
      {activeTab === 'hash-id' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            {/* 01 Input */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    01 — Paste a Hash
                  </label>
                  <CardInfoButton
                    title="Hash Identifier Input"
                    subtitle="What can I identify?"
                    sections={[
                      { heading: 'Common hash formats', body: 'MD5, SHA-1, SHA-256, SHA-512, bcrypt, Argon2, and more.', icon: 'info' },
                      { heading: 'Multiple candidates', body: 'Same length → multiple possible algorithms. Context is needed for certainty.', icon: 'warning' },
                      { heading: 'Not a decrypter', body: 'This tool only identifies the algorithm — it does NOT crack the hash.', icon: 'danger' },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setHashInput('5d41402abc4b2a76b9719d911017c592')}
                    className="text-[11px] font-mono text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                  >
                    MD5
                  </button>
                  <button
                    type="button"
                    onClick={() => setHashInput('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae')}
                    className="text-[11px] font-mono text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                  >
                    SHA-256
                  </button>
                  <button
                    type="button"
                    onClick={() => setHashInput('$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqLqKQeW2')}
                    className="text-[11px] font-mono text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                  >
                    bcrypt
                  </button>
                  <button
                    type="button"
                    onClick={() => setHashInput('')}
                    className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={hashInput}
                onChange={e => setHashInput(e.target.value)}
                placeholder="Paste a hash (MD5, SHA-1, SHA-256, bcrypt, Argon2, ...)"
                className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-y break-all"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>{hashInput.trim().length} characters</span>
                {hashResult && <span>charset: <strong className="text-purple-400">{hashResult.charset}</strong></span>}
              </div>

              <InlineInfo accent="purple">
                <strong className="text-purple-400">Tujuan:</strong> mengidentifikasi tipe hash
                berdasarkan panjang dan format. Tool ini <strong>tidak</strong> memecahkan hash —
                hanya memberi tahu algoritma yang kemungkinan dipakai.
              </InlineInfo>
            </div>

            {/* 02 Results */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    02 — Detection Results
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                    {hashResult
                      ? `${hashResult.matches.length} possible match${hashResult.matches.length !== 1 ? 'es' : ''}`
                      : 'Paste a hash to see matches'}
                  </p>
                </div>
              </div>

              {!hashResult || hashResult.length === 0 ? (
                <div className="py-12 text-center">
                  <Fingerprint className="w-6 h-6 mx-auto mb-2 text-[var(--text-secondary)]" />
                  <p className="text-xs font-mono text-[var(--text-secondary)]">
                    Paste a hash above to identify its algorithm.
                  </p>
                </div>
              ) : hashResult.matches.length === 0 ? (
                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-400 mb-1">No match found</p>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{hashResult.warning}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {hashResult.matches.map((m, i) => {
                    const securityConfig = SECURITY_CONFIG[m.security];
                    const colorClass = COLOR_CLASSES[securityConfig.color];
                    const SecurityIcon = securityConfig.icon;

                    return (
                      <div
                        key={i}
                        className={`p-5 rounded-xl border ${colorClass.border} ${colorClass.bg} space-y-3`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`shrink-0 w-9 h-9 rounded-lg border ${colorClass.border} ${colorClass.bg} flex items-center justify-center ${colorClass.text}`}>
                              <SecurityIcon className="w-4 h-4" strokeWidth={2.5} />
                            </div>
                            <div>
                              <h4 className={`text-base font-bold ${colorClass.text}`}>{m.name}</h4>
                              <p className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                                Confidence: {m.confidence}
                              </p>
                            </div>
                          </div>
                          <span className={`shrink-0 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded border ${colorClass.border} ${colorClass.text}`}>
                            {securityConfig.label}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{m.description}</p>

                        {m.notes.length > 0 && (
                          <ul className="space-y-1.5 pt-2 border-t border-[var(--border-main)]">
                            {m.notes.map((note, ni) => (
                              <li key={ni} className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)]">
                                <span className={`w-1 h-1 rounded-full ${colorClass.dot} mt-1.5 shrink-0`} />
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-purple-500/30 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Hash className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Hash Length Cheatsheet
                </h3>
              </div>
              <div className="space-y-0">
                <StatRow label="32 hex" value="MD5, NTLM" />
                <StatRow label="40 hex" value="SHA-1, RIPEMD-160" />
                <StatRow label="56 hex" value="SHA-224" />
                <StatRow label="64 hex" value="SHA-256" />
                <StatRow label="96 hex" value="SHA-384" />
                <StatRow label="128 hex" value="SHA-512" />
                <StatRow label="$2a$..." value="bcrypt" />
                <StatRow label="$argon2..." value="Argon2" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Recommended Hashes
                </h3>
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" /><span><strong className="text-emerald-400">Passwords:</strong> Argon2id, bcrypt, scrypt</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" /><span><strong className="text-emerald-400">Integrity:</strong> SHA-256, SHA-512, BLAKE3</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" /><span><strong className="text-rose-400">Avoid:</strong> MD5, SHA-1, raw SHA-256 for passwords</span></li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Tips
                </h3>
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" /><span>Multiple matches = context needed to disambiguate</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" /><span>Never rely on length alone for critical systems</span></li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" /><span>If unsure, use hashcat --identify for deeper analysis</span></li>
              </ul>
            </div>

            <ExecutionInfo />
          </div>
        </div>
      )}
    </div>
  );
}