import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  computeSha256,
  computeSha512,
  compareHashes,
} from '../../crypto/webcrypto/hash';
import { useProgress } from '../../hooks/useProgress';
import { SecurityNotice } from '../../components/common/SecurityNotice';
import { Button } from '../../components/common/Button';
import {
  Fingerprint,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  Clock,
  Shuffle,
} from 'lucide-react';
import { HashAlgorithm } from '../../types/crypto';

export function HashPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const algoParam = searchParams.get('algo') as HashAlgorithm | null;
  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithm>(
    algoParam === 'SHA-512' ? 'SHA-512' : 'SHA-256'
  );

  // Main Generator State
  const [inputText, setInputText] = useState('ChiperLab');
  const [hashDigest, setHashDigest] = useState('');
  const [execTime, setExecTime] = useState(0);
  const [copied, setCopied] = useState(false);

  // Avalanche Effect Lab State
  const [inputA, setInputA] = useState('Password123');
  const [inputB, setInputB] = useState('Password124');
  const [avalancheResult, setAvalancheResult] = useState<any>(null);

  useEffect(() => {
    exploreAlgorithm(selectedAlgo === 'SHA-256' ? 'sha256' : 'sha512');
  }, [selectedAlgo, exploreAlgorithm]);

  // Compute live hash for main generator
  useEffect(() => {
    async function updateDigest() {
      const res =
        selectedAlgo === 'SHA-256'
          ? await computeSha256(inputText)
          : await computeSha512(inputText);
      setHashDigest(res.output);
      setExecTime(res.executionDurationMs);
    }
    updateDigest();
  }, [inputText, selectedAlgo]);

  // Compute live avalanche comparison
  useEffect(() => {
    async function updateAvalanche() {
      const comp = await compareHashes(inputA, inputB, selectedAlgo);
      setAvalancheResult(comp);
    }
    updateAvalanche();
  }, [inputA, inputB, selectedAlgo]);

  const handleCopy = () => {
    if (!hashDigest) return;
    navigator.clipboard.writeText(hashDigest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAlgo = (algo: HashAlgorithm) => {
    setSelectedAlgo(algo);
    setSearchParams({ algo });
  };

  const presetAvalancheExamples = [
    { label: '1 Digit Change', a: 'Password123', b: 'Password124' },
    { label: '1 Letter Capitalization', a: 'cryptography', b: 'Cryptography' },
    { label: 'Trailing Space', a: 'secure_token', b: 'secure_token ' },
    { label: 'Punctuation mark', a: 'Hello World', b: 'Hello World!' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Fingerprint className="w-3.5 h-3.5" />
          One-Way Cryptographic Functions
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hash Generator & Avalanche Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Cryptographic hash functions are deterministic, strictly one-way mathematical algorithms that convert arbitrary-length input into a fixed-size bit digest.
        </p>
      </div>

      <SecurityNotice type="general" />

      {/* Algorithm Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase shrink-0 mr-1">
          Digest Algorithm:
        </span>
        {(['SHA-256', 'SHA-512'] as const).map(algo => (
          <button
            key={algo}
            type="button"
            onClick={() => handleSelectAlgo(algo)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedAlgo === algo
                ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {algo} {algo === 'SHA-256' ? '(256 bits / 64 hex)' : '(512 bits / 128 hex)'}
          </button>
        ))}
      </div>

      {/* Section 1: Main Real-time Hash Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Input Text / Message Payload
            </label>
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          <textarea
            rows={4}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type any message to hash in real-time..."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Input length: {inputText.length} bytes</span>
            <span>Unkeyed One-Way Function</span>
          </div>
        </div>

        {/* Output Digest Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {selectedAlgo} Digest (Hexadecimal)
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              icon={copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            >
              {copied ? 'Copied' : 'Copy Hash'}
            </Button>
          </div>

          {/* Digest Box */}
          <div className="min-h-[96px] p-3.5 rounded-xl bg-slate-950 text-indigo-400 font-mono text-xs break-all leading-relaxed select-all">
            {hashDigest || <span className="text-slate-600">Computing...</span>}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
            <span>Digest: {hashDigest.length * 4} bits ({hashDigest.length} hex chars)</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Latency: {execTime.toFixed(2)} ms
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: The Avalanche Effect Laboratory */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
            <Zap className="w-4 h-4" />
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              The Avalanche Effect Laboratory
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            A desirable cryptographic property where a minute change in the input (such as flipping a single bit or changing a single letter) triggers a massive, uncorrelated cascade resulting in approximately <strong>50%</strong> of the output bits flipping.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">
            Test Quick Presets:
          </span>
          {presetAvalancheExamples.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputA(ex.a);
                setInputB(ex.b);
              }}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Inputs A and B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sky-600 dark:text-sky-400 block">
              Input Message A:
            </label>
            <input
              type="text"
              value={inputA}
              onChange={e => setInputA(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
              Input Message B (Compare):
            </label>
            <input
              type="text"
              value={inputB}
              onChange={e => setInputB(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Avalanche Metrics Banner */}
        {avalancheResult && (
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">
                Bit Difference (Avalanche Rate)
              </span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {avalancheResult.percentFlipped}%
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs ml-2">
                ({avalancheResult.differentBits} / {avalancheResult.totalBits} bits flipped)
              </span>
            </div>

            <div className="max-w-md text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Ideal cryptographic hashes aim for a <strong>~50% avalanche flip</strong> to ensure attackers cannot use statistical gradient analysis to infer the original message.
            </div>
          </div>
        )}

        {/* Side-by-side Hex comparison highlighting differing characters */}
        {avalancheResult && (
          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block">
                Hash A:
              </span>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 break-all leading-relaxed">
                {avalancheResult.hashA}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block">
                Hash B (Different characters highlighted in Amber):
              </span>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 break-all leading-relaxed">
                {avalancheResult.hashB.split('').map((char: string, idx: number) => {
                  const isDiff = char !== avalancheResult.hashA[idx];
                  return (
                    <span
                      key={idx}
                      className={
                        isDiff
                          ? 'text-amber-400 font-bold bg-amber-950/60 px-0.5 rounded'
                          : 'text-slate-500'
                      }
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
