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
  Zap,
  Clock,
  Info,
  ShieldAlert,
  Search,
  Lock,
  FileText,
  Server,
  KeyRound,
  GitBranch,
} from 'lucide-react';
import { HashAlgorithm } from '../../types/crypto';

const DICTIONARY_SHA256: Record<string, string> = {
  password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  '123456': '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  admin: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  hello: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
};

export function HashPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const algoParam = searchParams.get('algo') as HashAlgorithm | null;
  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithm>(
    algoParam === 'SHA-512' ? 'SHA-512' : 'SHA-256'
  );

  const [inputText, setInputText] = useState('ChiperLab');
  const [hashDigest, setHashDigest] = useState('');
  const [execTime, setExecTime] = useState(0);
  const [copied, setCopied] = useState(false);

  const [inputA, setInputA] = useState('Password123');
  const [inputB, setInputB] = useState('Password124');
  const [avalancheResult, setAvalancheResult] = useState<any>(null);

  const [attackTargetHash, setAttackTargetHash] = useState('');
  const [attackStatus, setAttackStatus] = useState<'idle' | 'cracking' | 'found' | 'notfound'>('idle');
  const [attackFound, setAttackFound] = useState<string | null>(null);
  const [attackTries, setAttackTries] = useState(0);

  useEffect(() => {
    exploreAlgorithm(selectedAlgo === 'SHA-256' ? 'sha256' : 'sha512');
  }, [selectedAlgo, exploreAlgorithm]);

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

  const handleRunDictionaryAttack = async () => {
    if (!attackTargetHash || attackTargetHash.length !== 64) return;
    setAttackStatus('cracking');
    setAttackFound(null);
    setAttackTries(0);

    const dictEntries = Object.entries(DICTIONARY_SHA256);
    let tries = 0;

    for (const [word, hash] of dictEntries) {
      tries++;
      setAttackTries(tries);
      await new Promise(r => setTimeout(r, 400));

      if (hash === attackTargetHash.toLowerCase()) {
        setAttackFound(word);
        setAttackStatus('found');
        return;
      }
    }

    setAttackStatus('notfound');
  };

  const presetAvalancheExamples = [
    { label: '1 Digit Change', a: 'Password123', b: 'Password124' },
    { label: '1 Letter Capitalization', a: 'cryptography', b: 'Cryptography' },
    { label: 'Trailing Space', a: 'secure_token', b: 'secure_token ' },
    { label: 'Punctuation mark', a: 'Hello World', b: 'Hello World!' },
  ];

  const presetAttackTargets = [
    { label: 'Try: "password"', hash: DICTIONARY_SHA256['password'] },
    { label: 'Try: "admin"', hash: DICTIONARY_SHA256['admin'] },
    {
      label: 'Try: random (fail)',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-teal-500/30 bg-teal-500/10 text-teal-400">
          <Fingerprint className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            One-Way Cryptographic Functions
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Hash Generator & Avalanche Lab
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Cryptographic hashes are deterministic, strictly one-way functions. Explore SHA-256,
              SHA-512, the avalanche effect, and why hashes cannot be reversed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['SHA-256', 'SHA-512'] as const).map(algo => (
              <button
                key={algo}
                type="button"
                onClick={() => handleSelectAlgo(algo)}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedAlgo === algo
                    ? 'bg-teal-500 text-black'
                    : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-teal-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SecurityNotice type="general" />

      {/* Section 1: Live Hash Generator + Info Side */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-teal-400 tracking-widest">
            01 — LIVE HASH GENERATOR
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Input + Output (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Input Text
                </label>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>

              <textarea
                rows={4}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type any message to hash in real-time..."
                className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 resize-y"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>{inputText.length} bytes</span>
                <span>Unkeyed one-way function</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {selectedAlgo} Digest
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  icon={
                    copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )
                  }
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>

              <div className="min-h-[100px] p-4 rounded-xl bg-[#0A0C10] border border-[#1E222B] font-mono text-xs text-teal-400 break-all leading-relaxed select-all">
                {hashDigest || (
                  <span className="text-[var(--text-secondary)]">Computing...</span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] pt-1">
                <span>
                  {hashDigest.length * 4} bits · {hashDigest.length} hex chars
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {execTime.toFixed(2)} ms
                </span>
              </div>
            </div>
          </div>

          {/* Info Side (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  {selectedAlgo} Facts
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Output size</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {selectedAlgo === 'SHA-256' ? '256 bits' : '512 bits'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Hex chars</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {selectedAlgo === 'SHA-256' ? '64' : '128'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Block size</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {selectedAlgo === 'SHA-256' ? '512 bits' : '1024 bits'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Rounds</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {selectedAlgo === 'SHA-256' ? '64' : '80'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-mono text-[var(--text-secondary)]">Word size</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {selectedAlgo === 'SHA-256' ? '32-bit' : '64-bit'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Server className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Common Use Cases
                </h3>
              </div>

              <ul className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <GitBranch className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Git commit object IDs</span>
                </li>
                <li className="flex items-start gap-2">
                  <KeyRound className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                  <span>TLS certificate fingerprints</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                  <span>HMAC message authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                  <span>File integrity verification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Why Hash Cannot Be Reversed */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-rose-400 tracking-widest">
            02 — WHY HASH CANNOT BE REVERSED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Explanation (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--surface-main)] border border-rose-500/30 shadow-lg space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                One-Way Function — No Inverse Exists
              </h2>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Unlike encryption (which uses a secret key to make decryption possible),
              cryptographic hashes are{' '}
              <strong className="text-[var(--text-primary)]">strictly one-way</strong>. There is
              no key, no inverse formula, and no mathematical shortcut. Given a SHA-256 digest, it
              is computationally infeasible to recover the original input.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    Compression
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Infinite input → finite output. Many inputs map to same digest.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Diffusion
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Every input bit affects every output bit. No gradient.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    No Key
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  No "decryption key" unlocks the digest. It's a dead end.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[11px] text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[var(--text-primary)]">Defense:</strong> Always use a
                slow hash (bcrypt, scrypt, Argon2) with a per-user salt. This makes dictionary and
                rainbow-table attacks thousands of times more expensive.
              </span>
            </div>
          </div>

          {/* Dictionary Attack (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface-main)] border border-amber-500/30 shadow-lg space-y-4">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Dictionary Attack Simulator
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Attackers don't reverse hashes. They guess inputs, hash, and compare.
                </p>
              </div>
            </div>

            {/* Preset targets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                Sample Targets
              </span>
              <div className="flex flex-wrap gap-2">
                {presetAttackTargets.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAttackTargetHash(t.hash);
                      setAttackStatus('idle');
                      setAttackFound(null);
                      setAttackTries(0);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[10px] font-mono text-[var(--text-secondary)] hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target hash input */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                Target SHA-256 Hash
              </label>
              <input
                type="text"
                value={attackTargetHash}
                onChange={e => {
                  setAttackTargetHash(e.target.value);
                  setAttackStatus('idle');
                  setAttackFound(null);
                }}
                placeholder="Paste 64-char SHA-256 hash..."
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-[11px] text-[var(--text-primary)] focus:outline-none focus:border-amber-500/50"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleRunDictionaryAttack}
                disabled={
                  !attackTargetHash ||
                  attackTargetHash.length !== 64 ||
                  attackStatus === 'cracking'
                }
                icon={<Search className="w-4 h-4" />}
                className="w-full"
              >
                {attackStatus === 'cracking' ? 'Cracking...' : 'Run Dictionary Attack'}
              </Button>
            </div>

            {/* Attack status */}
            {attackStatus !== 'idle' && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  attackStatus === 'found'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : attackStatus === 'notfound'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {attackStatus === 'cracking' && (
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {attackStatus === 'found' && (
                    <Check className="w-5 h-5 text-emerald-400" />
                  )}
                  {attackStatus === 'notfound' && (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {attackStatus === 'cracking' && (
                    <div>
                      <p className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                        Cracking in progress...
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Testing dictionary entry #{attackTries}...
                      </p>
                    </div>
                  )}

                  {attackStatus === 'found' && attackFound && (
                    <div>
                      <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        Hash Cracked!
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mb-2">
                        After testing <strong className="text-[var(--text-primary)]">{attackTries}</strong>{' '}
                        entries, original input found:
                      </p>
                      <div className="inline-block px-3 py-1.5 rounded-lg bg-[#0A0C10] border border-emerald-500/30 font-mono text-sm text-emerald-400">
                        "{attackFound}"
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-2 italic">
                        Works only because password was in a small dictionary. A random
                        32-char password requires 2^256 guesses.
                      </p>
                    </div>
                  )}

                  {attackStatus === 'notfound' && (
                    <div>
                      <p className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
                        Not in Dictionary
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Tested all{' '}
                        <strong className="text-[var(--text-primary)]">{attackTries}</strong>{' '}
                        entries. This hash likely corresponds to a strong input.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Avalanche Effect */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-amber-400 tracking-widest">
            03 — AVALANCHE EFFECT LAB
          </span>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Zap className="w-4 h-4 fill-amber-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
                Bit Flipping Analysis
              </h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              A desirable cryptographic property where a minute change in the input triggers a
              massive cascade resulting in approximately{' '}
              <strong className="text-[var(--text-primary)]">50%</strong> of the output bits
              flipping.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              Quick Presets:
            </span>
            {presetAvalancheExamples.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputA(ex.a);
                  setInputB(ex.b);
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-xs font-mono text-[var(--text-secondary)] hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer"
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* Inputs A & B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-cyan-400 block uppercase tracking-wider">
                Input A
              </label>
              <input
                type="text"
                value={inputA}
                onChange={e => setInputA(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-amber-400 block uppercase tracking-wider">
                Input B
              </label>
              <input
                type="text"
                value={inputB}
                onChange={e => setInputB(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Metrics + Comparison */}
          {avalancheResult && (
            <>
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Bit Difference (Avalanche Rate)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-400">
                      {avalancheResult.percentFlipped}%
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                      ({avalancheResult.differentBits} / {avalancheResult.totalBits} bits)
                    </span>
                  </div>
                </div>

                <div className="max-w-md text-xs text-[var(--text-secondary)] leading-relaxed">
                  Ideal hashes aim for ~50% avalanche flip to prevent statistical gradient
                  analysis from inferring the original message.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 font-mono text-xs">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                    Hash A
                  </span>
                  <div className="p-4 rounded-xl bg-[#0A0C10] border border-[#1E222B] text-[var(--text-secondary)] break-all leading-relaxed">
                    {avalancheResult.hashA}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                    Hash B — differing chars highlighted
                  </span>
                  <div className="p-4 rounded-xl bg-[#0A0C10] border border-[#1E222B] break-all leading-relaxed">
                    {avalancheResult.hashB.split('').map((char: string, idx: number) => {
                      const isDiff = char !== avalancheResult.hashA[idx];
                      return (
                        <span
                          key={idx}
                          className={
                            isDiff
                              ? 'text-amber-400 font-bold bg-amber-500/20 px-0.5 rounded'
                              : 'text-[var(--text-secondary)]'
                          }
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}