import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  computeSha256,
  computeSha512,
  compareHashes,
} from '../../../crypto/webcrypto/hash';
import { md5Hash } from '../../../crypto/hashing/md5';
import { useProgress } from '../../../hooks/useProgress';
import { SecurityNotice } from '../../../components/common/SecurityNotice';
import { Button } from '../../../components/common/Button';
import { CardInfoButton } from '../../../components/common/CardInfoButton';
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
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

type HashAlgo = 'SHA-256' | 'SHA-512' | 'MD5';

const HASH_ALGO_INFO: Record<
  HashAlgo,
  {
    outputBits: number;
    hexChars: number;
    blockSize: string;
    rounds: number;
    wordSize: string;
    status: 'secure' | 'broken';
    note: string;
  }
> = {
  'SHA-256': {
    outputBits: 256,
    hexChars: 64,
    blockSize: '512 bits',
    rounds: 64,
    wordSize: '32-bit',
    status: 'secure',
    note: 'Collision resistant · Industry standard',
  },
  'SHA-512': {
    outputBits: 512,
    hexChars: 128,
    blockSize: '1024 bits',
    rounds: 80,
    wordSize: '64-bit',
    status: 'secure',
    note: 'High margin · Post-quantum friendly',
  },
  MD5: {
    outputBits: 128,
    hexChars: 32,
    blockSize: '512 bits',
    rounds: 64,
    wordSize: '32-bit',
    status: 'broken',
    note: 'BROKEN since 2004 · Educational only',
  },
};

const DICTIONARY_SHA256: Record<string, string> = {
  password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  '123456': '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  admin: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  hello: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
};

const DICTIONARY_MD5: Record<string, string> = {
  password: '5f4dcc3b5aa765d61d8327deb882cf99',
  '123456': 'e10adc3949ba59abbe56e057f20f883e',
  admin: '21232f297a57a5a743894a0e4a801fc3',
  hello: '5d41402abc4b2a76b9719d911017c592',
};

export function HashPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const algoParam = searchParams.get('algo');
  const initialAlgo: HashAlgo =
    algoParam === 'SHA-512'
      ? 'SHA-512'
      : algoParam === 'MD5'
      ? 'MD5'
      : 'SHA-256';

  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgo>(initialAlgo);

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
    const algoId =
      selectedAlgo === 'SHA-256'
        ? 'sha256'
        : selectedAlgo === 'SHA-512'
        ? 'sha512'
        : 'md5';
    exploreAlgorithm(algoId);
  }, [selectedAlgo, exploreAlgorithm]);

  useEffect(() => {
    async function updateDigest() {
      if (selectedAlgo === 'MD5') {
        const res = md5Hash(inputText);
        setHashDigest(res.output);
        setExecTime(res.meta?.durationMs ?? 0);
      } else {
        const res =
          selectedAlgo === 'SHA-256'
            ? await computeSha256(inputText)
            : await computeSha512(inputText);
        setHashDigest(res.output);
        setExecTime(res.executionDurationMs);
      }
    }
    updateDigest();
  }, [inputText, selectedAlgo]);

  useEffect(() => {
    async function updateAvalanche() {
      if (selectedAlgo === 'MD5') {
        const hashA = md5Hash(inputA).output;
        const hashB = md5Hash(inputB).output;
        const totalBits = 128;
        let differentBits = 0;
        for (let i = 0; i < hashA.length; i += 2) {
          const byteA = parseInt(hashA.substring(i, i + 2), 16) || 0;
          const byteB = parseInt(hashB.substring(i, i + 2), 16) || 0;
          let xor = byteA ^ byteB;
          while (xor > 0) {
            if (xor & 1) differentBits++;
            xor >>= 1;
          }
        }
        let differentChars = 0;
        for (let i = 0; i < hashA.length; i++) {
          if (hashA[i] !== hashB[i]) differentChars++;
        }
        setAvalancheResult({
          hashA,
          hashB,
          differentBits,
          totalBits,
          percentFlipped: Math.round((differentBits / totalBits) * 1000) / 10,
          differentChars,
          totalChars: hashA.length,
        });
      } else {
        const comp = await compareHashes(inputA, inputB, selectedAlgo);
        setAvalancheResult(comp);
      }
    }
    updateAvalanche();
  }, [inputA, inputB, selectedAlgo]);

  const handleCopy = () => {
    if (!hashDigest) return;
    navigator.clipboard.writeText(hashDigest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAlgo = (algo: HashAlgo) => {
    setSelectedAlgo(algo);
    setSearchParams({ algo });
    setAttackTargetHash('');
    setAttackStatus('idle');
    setAttackFound(null);
    setAttackTries(0);
  };

  const handleRunDictionaryAttack = async () => {
    const expectedLength = selectedAlgo === 'MD5' ? 32 : 64;
    if (!attackTargetHash || attackTargetHash.length !== expectedLength) return;
    setAttackStatus('cracking');
    setAttackFound(null);
    setAttackTries(0);

    const dictEntries =
      selectedAlgo === 'MD5'
        ? Object.entries(DICTIONARY_MD5)
        : Object.entries(DICTIONARY_SHA256);
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

  const presetAttackTargets =
    selectedAlgo === 'MD5'
      ? [
          { label: 'Try: "password"', hash: DICTIONARY_MD5['password'] },
          { label: 'Try: "admin"', hash: DICTIONARY_MD5['admin'] },
          {
            label: 'Try: random (fail)',
            hash: 'd41d8cd98f00b204e9800998ecf8427e',
          },
        ]
      : [
          { label: 'Try: "password"', hash: DICTIONARY_SHA256['password'] },
          { label: 'Try: "admin"', hash: DICTIONARY_SHA256['admin'] },
          {
            label: 'Try: random (fail)',
            hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          },
        ];

  const info = HASH_ALGO_INFO[selectedAlgo];
  const isBroken = info.status === 'broken';

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <Link
        to="/playground"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Playground Hub
      </Link>

      {/* ============================================================
          HEADER — Centered
      ============================================================ */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-teal-500/30 bg-teal-500/10 text-teal-400">
          <Fingerprint className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            One-Way Cryptographic Functions
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
          Hash Generator & Avalanche Lab
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Cryptographic hashes are deterministic, strictly one-way functions. Explore SHA-256,
          SHA-512, and MD5 — observe the avalanche effect, simulate dictionary attacks, and
          understand why hashes cannot be reversed.
        </p>

        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] max-w-2xl">
          3 hash algorithms · 2 analytical labs · 100% client-side execution.
        </p>
      </div>

      {/* Algorithm selector */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
          {(['SHA-256', 'SHA-512', 'MD5'] as const).map(algo => (
            <button
              key={algo}
              type="button"
              onClick={() => handleSelectAlgo(algo)}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedAlgo === algo
                  ? algo === 'MD5'
                    ? 'bg-rose-500 text-black'
                    : 'bg-teal-500 text-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              {algo}
              {algo === 'MD5' && (
                <span className="ml-1.5 text-[9px] opacity-70">BROKEN</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MD5 warning banner */}
      {isBroken ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-rose-400" strokeWidth={2.5} />
          </div>
          <div className="pt-0.5">
            <span className="font-bold block text-rose-400 mb-1 font-mono text-[11px] tracking-wider uppercase">
              MD5 is Cryptographically Broken
            </span>
            <span className="text-[var(--text-secondary)] text-xs leading-relaxed">
              Practical collisions can be generated in seconds. MD5 must{' '}
              <strong>never</strong> be used for signatures, certificates, or password
              storage. Included here purely as a cautionary tale.
            </span>
          </div>
        </div>
      ) : (
        <SecurityNotice type="general" />
      )}

      {/* ============================================================
          SECTION 1 — LIVE HASH GENERATOR
      ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-teal-400 tracking-widest">
            01 — LIVE HASH GENERATOR
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Input + Output */}
          <div className="lg:col-span-8 space-y-5">
            {/* Input */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Input Text
                </label>
                <div className="flex items-center gap-2">
                  <CardInfoButton
                    title="Input Text"
                    subtitle="What gets hashed?"
                    sections={[
                      {
                        heading: 'Any UTF-8 text',
                        body: 'The input can be any text — letters, numbers, punctuation, emoji, and non-Latin scripts. The hash function treats it as a byte stream.',
                        icon: 'info',
                      },
                      {
                        heading: 'Byte count, not chars',
                        body: '"Café" is 4 UTF-8 characters but 5 bytes. The byte count below shows the actual size hashed, which is what matters for the algorithm.',
                        icon: 'tip',
                      },
                      {
                        heading: 'Real-time hashing',
                        body: 'The digest updates automatically as you type — there is no "hash" button. This demonstrates the deterministic nature: same input always → same output.',
                        icon: 'info',
                      },
                    ]}
                  />
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
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

            {/* Digest */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {selectedAlgo} Digest
                  </span>
                  <CardInfoButton
                    title={`${selectedAlgo} Digest`}
                    subtitle="What does this output mean?"
                    sections={[
                      {
                        heading: 'Fixed-size fingerprint',
                        body: `No matter how big your input is (1 byte or 1 GB), the ${selectedAlgo} output is always exactly ${info.outputBits} bits — displayed as ${info.hexChars} hexadecimal characters.`,
                        icon: 'info',
                      },
                      {
                        heading: 'One-way',
                        body: 'You cannot "decrypt" this digest to recover the original input. There is no key, no inverse formula. Given the hash, finding the original message is computationally infeasible.',
                        icon: 'warning',
                      },
                      {
                        heading: 'Colored output',
                        body: isBroken
                          ? 'The digest is shown in red because MD5 is broken. This is a visual warning: do not trust this output for security.'
                          : 'The digest is shown in teal because the algorithm is secure. The color helps you distinguish secure vs broken algorithms at a glance.',
                        icon: isBroken ? 'danger' : 'tip',
                      },
                    ]}
                  />
                </div>

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

              <div
                className={`min-h-[100px] p-4 rounded-xl bg-[#0A0C10] border font-mono text-xs break-all leading-relaxed select-all ${
                  isBroken ? 'border-rose-500/30 text-rose-400' : 'border-[#1E222B] text-teal-400'
                }`}
              >
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

          {/* Facts + Use Cases */}
          <div className="lg:col-span-4 space-y-5">
            {/* Facts */}
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${
                      isBroken
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] truncate">
                    {selectedAlgo} Facts
                  </h3>
                </div>
                <CardInfoButton
                  title={`${selectedAlgo} Technical Facts`}
                  subtitle="Behind the parameters"
                  sections={[
                    {
                      heading: 'Output size',
                      body: `The digest length in bits — ${info.outputBits} bits for ${selectedAlgo}. Longer output = more security margin, but slightly slower computation.`,
                      icon: 'info',
                    },
                    {
                      heading: 'Block size',
                      body: `The hash processes input in chunks of ${info.blockSize}. The final chunk is padded to fit. This is an implementation detail most users never need to worry about.`,
                      icon: 'info',
                    },
                    {
                      heading: 'Rounds',
                      body: `Each block passes through ${info.rounds} rounds of transformation. More rounds = stronger diffusion, harder to attack.`,
                      icon: 'tip',
                    },
                    {
                      heading: 'Word size',
                      body: `${info.wordSize} — the size of the internal working unit. SHA-512 uses 64-bit words, making it faster on modern 64-bit CPUs.`,
                      icon: 'book',
                    },
                  ]}
                />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Output size</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {info.outputBits} bits
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Hex chars</span>
                  <span className="font-mono text-[var(--text-primary)]">{info.hexChars}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Block size</span>
                  <span className="font-mono text-[var(--text-primary)]">{info.blockSize}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
                  <span className="font-mono text-[var(--text-secondary)]">Rounds</span>
                  <span className="font-mono text-[var(--text-primary)]">{info.rounds}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-mono text-[var(--text-secondary)]">Word size</span>
                  <span className="font-mono text-[var(--text-primary)]">{info.wordSize}</span>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-lg border text-[10px] font-mono font-semibold ${
                  isBroken
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {info.note}
              </div>
            </div>

            {/* Use Cases */}
            <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] truncate">
                    Common Use Cases
                  </h3>
                </div>
                <CardInfoButton
                  title="Where Are Hashes Used?"
                  subtitle="Real-world applications"
                  sections={[
                    {
                      heading: 'Git version control',
                      body: 'Every commit, tree, and blob is identified by its SHA-1 hash (soon SHA-256). This gives Git its tamper-evident property — changing history changes all downstream hashes.',
                      icon: 'book',
                    },
                    {
                      heading: 'TLS certificates',
                      body: 'Certificate fingerprints use SHA-256. When you pin a certificate, you compare its hash against a known-good value.',
                      icon: 'book',
                    },
                    {
                      heading: 'HMAC authentication',
                      body: 'HMAC-SHA256 combines a hash with a secret key, powering JWT, AWS API signatures, and TLS PRF.',
                      icon: 'book',
                    },
                    {
                      heading: 'File integrity',
                      body: 'Download pages publish SHA-256 checksums. After downloading, you compute the hash and compare — if they match, the file was not corrupted or tampered with.',
                      icon: 'book',
                    },
                  ]}
                />
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

      {/* ============================================================
          SECTION 2 — WHY HASH CANNOT BE REVERSED + DICTIONARY ATTACK
      ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-rose-400 tracking-widest">
            02 — WHY HASH CANNOT BE REVERSED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Explanation */}
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
              no key, no inverse formula, and no mathematical shortcut.
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
                  Infinite input → finite output.
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
                  Every bit affects every bit.
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
                  No decryption key exists.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[11px] text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[var(--text-primary)]">Defense:</strong> Always use a
                slow hash (bcrypt, scrypt, Argon2) with a per-user salt. This makes dictionary
                and rainbow-table attacks thousands of times more expensive.
              </span>
            </div>
          </div>

          {/* Dictionary Attack */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface-main)] border border-amber-500/30 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Dictionary Attack Simulator
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                    Attackers don't reverse hashes. They guess inputs, hash, and compare.
                  </p>
                </div>
              </div>
              <CardInfoButton
                title="Dictionary Attack Simulator"
                subtitle="How hashes are actually cracked"
                sections={[
                  {
                    heading: 'The misconception',
                    body: 'Many beginners think attackers "decrypt" hashes. This is impossible — hashes are one-way. Instead, attackers guess common passwords, hash each guess, and compare with the target.',
                    icon: 'warning',
                  },
                  {
                    heading: 'How this simulator works',
                    body: 'We have a small dictionary of 4 common passwords. The simulator tries each one in order:\n\n1. Hash the guess\n2. Compare with the target hash\n3. If they match → found it!\n4. If not, try the next one',
                    icon: 'info',
                  },
                  {
                    heading: 'Why this matters',
                    body: 'This attack is only fast because users pick weak passwords. The 2012 LinkedIn breach exposed 6.5 million unsalted SHA-1 hashes — most fell within hours because "password", "123456", and "admin" are extremely common.',
                    icon: 'danger',
                  },
                  {
                    heading: 'Real defense',
                    body: 'Use a slow hash (Argon2id, bcrypt) with a unique per-user salt. Even if an attacker steals the database, cracking each password takes 100+ ms instead of nanoseconds — turning a 1-hour attack into a 100-year attack.',
                    icon: 'tip',
                  },
                  {
                    heading: 'Try it yourself',
                    body: 'Click one of the preset sample targets (e.g., "password") and run the attack. Or paste a known hash to test your own dictionary.',
                    icon: 'book',
                  },
                ]}
              />
            </div>

            {/* Sample targets */}
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
                Target {selectedAlgo} Hash
              </label>
              <input
                type="text"
                value={attackTargetHash}
                onChange={e => {
                  setAttackTargetHash(e.target.value);
                  setAttackStatus('idle');
                  setAttackFound(null);
                }}
                placeholder={`Paste ${info.hexChars}-char ${selectedAlgo} hash...`}
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-[11px] text-[var(--text-primary)] focus:outline-none focus:border-amber-500/50"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleRunDictionaryAttack}
                disabled={
                  !attackTargetHash ||
                  attackTargetHash.length !== info.hexChars ||
                  attackStatus === 'cracking'
                }
                icon={<Search className="w-4 h-4" />}
                className="w-full"
              >
                {attackStatus === 'cracking' ? 'Cracking...' : 'Run Dictionary Attack'}
              </Button>
            </div>

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
                  {attackStatus === 'found' && <Check className="w-5 h-5 text-emerald-400" />}
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
                        After testing{' '}
                        <strong className="text-[var(--text-primary)]">{attackTries}</strong>{' '}
                        entries:
                      </p>
                      <div className="inline-block px-3 py-1.5 rounded-lg bg-[#0A0C10] border border-emerald-500/30 font-mono text-sm text-emerald-400">
                        "{attackFound}"
                      </div>
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
                        entries. Strong input likely.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 3 — AVALANCHE EFFECT LAB
      ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-amber-400 tracking-widest">
            03 — AVALANCHE EFFECT LAB
          </span>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
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
            <CardInfoButton
              title="Avalanche Effect Lab"
              subtitle="Why 50% bit flip matters"
              sections={[
                {
                  heading: 'What is the avalanche effect?',
                  body: 'A property of good hash functions: changing even 1 bit of input should change approximately 50% of the output bits, unpredictably. This prevents attackers from finding patterns.',
                  icon: 'info',
                },
                {
                  heading: 'Why 50%?',
                  body: 'If 0% of bits change, the input barely affects the output. If 100% change predictably, attackers can reverse the transformation. 50% random is the sweet spot — maximum entropy while remaining deterministic.',
                  icon: 'tip',
                },
                {
                  heading: 'How this lab works',
                  body: 'Enter two nearly-identical inputs (A and B). The lab hashes both and compares bit-by-bit:\n\n• Different bits highlighted in amber\n• Bit difference % shown above\n• Ideal result: 45–55% for SHA-256/512',
                  icon: 'book',
                },
                {
                  heading: 'Try it yourself',
                  body: 'Use the presets to see the avalanche effect in action:\n\n• "1 Digit Change": Password123 vs Password124\n• "Capitalization": cryptography vs Cryptography\n\nThese differ by 1 character yet produce completely different hashes.',
                  icon: 'book',
                },
                {
                  heading: 'Security implication',
                  body: 'Without avalanche, an attacker could use statistical analysis (gradient descent) to find collisions or preimages. The avalanche effect is what makes SHA-256 resistant to these attacks.',
                  icon: 'warning',
                },
              ]}
            />
          </div>

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
                  analysis.
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