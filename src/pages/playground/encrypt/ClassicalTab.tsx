import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  caesarEncrypt,
  caesarDecrypt,
} from '../../../crypto/classical/caesar';
import {
  atbashEncrypt,
  atbashDecrypt,
} from '../../../crypto/classical/atbash';
import {
  vigenereEncrypt,
  vigenereDecrypt,
} from '../../../crypto/classical/vigenere';
import { xorEncrypt, xorDecrypt } from '../../../crypto/classical/xor';
import { CryptoResult } from '../../../types/crypto';
import { useProgress } from '../../../hooks/useProgress';
import { StepVisualizer } from '../../../components/playground/StepVisualizer';
import { Button } from '../../../components/common/Button';
import { AlgorithmInfoPanel } from '../shared/AlgorithmInfoPanel';
import { ExecutionInfo } from '../shared/ExecutionInfo';
import {
  Copy,
  Check,
  RotateCcw,
  Key,
  Lock,
  Unlock,
  Shield,
  Clock,
  ArrowRightLeft,
  Cpu,
} from 'lucide-react';
import { CardInfoButton } from '@/src/components/common/CardInfoButton';

type ClassicalAlgo = 'caesar' | 'atbash' | 'vigenere' | 'xor';

const CLASSICAL_ALGO_INFO: Record<
  ClassicalAlgo,
  {
    title: string;
    strength: 'Educational' | 'Weak';
    keyspace: string;
    description: string;
    highlights: string[];
  }
> = {
  caesar: {
    title: 'Caesar Cipher',
    strength: 'Educational',
    keyspace: '25 shifts',
    description: 'Ancient monoalphabetic shift cipher used by Julius Caesar.',
    highlights: ['Simple substitution', 'Trivially brute-forced', 'Frequency leaks'],
  },
  atbash: {
    title: 'Atbash Cipher',
    strength: 'Educational',
    keyspace: 'No key (fixed)',
    description: 'Hebrew mirror cipher mapping A↔Z, B↔Y, C↔X.',
    highlights: ['Self-inverting', 'No secret key', 'Zero confidentiality'],
  },
  vigenere: {
    title: 'Vigenère Cipher',
    strength: 'Weak',
    keyspace: '26^(key length)',
    description: 'Polyalphabetic cipher once called "le chiffre indéchiffrable".',
    highlights: ['Keyword-driven', 'Masks frequency', 'Kasiski-vulnerable'],
  },
  xor: {
    title: 'XOR Stream',
    strength: 'Weak',
    keyspace: 'Repeating key',
    description: 'Bitwise exclusive-OR — the primitive of all modern ciphers.',
    highlights: ['Involutory', 'Two-Time Pad vulnerable', 'Foundation of AES'],
  },
};

interface ClassicalTabProps {
  initialAlgo?: string;
}

export function ClassicalTab({ initialAlgo }: ClassicalTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const initialClassical = (
    initialAlgo && ['caesar', 'atbash', 'vigenere', 'xor'].includes(initialAlgo)
      ? initialAlgo
      : 'caesar'
  ) as ClassicalAlgo;

  const [selectedAlgo, setSelectedAlgo] = useState<ClassicalAlgo>(initialClassical);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('DEFEND THE EAST WALL');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [vigenereKey, setVigenereKey] = useState<string>('CIPHER');
  const [xorKey, setXorKey] = useState<string>('SECRET');

  useEffect(() => {
    if (initialAlgo && ['caesar', 'atbash', 'vigenere', 'xor'].includes(initialAlgo)) {
      setSelectedAlgo(initialAlgo as ClassicalAlgo);
    }
  }, [initialAlgo]);

  useEffect(() => {
    exploreAlgorithm(selectedAlgo);
  }, [selectedAlgo, exploreAlgorithm]);

  useEffect(() => {
    setErrorMessage(null);
    if (!inputText) {
      setResult(null);
      return;
    }

    try {
      let res: CryptoResult;

      if (selectedAlgo === 'caesar') {
        res =
          mode === 'encrypt'
            ? caesarEncrypt(inputText, caesarShift)
            : caesarDecrypt(inputText, caesarShift);
      } else if (selectedAlgo === 'atbash') {
        res = mode === 'encrypt' ? atbashEncrypt(inputText) : atbashDecrypt(inputText);
      } else if (selectedAlgo === 'vigenere') {
        res =
          mode === 'encrypt'
            ? vigenereEncrypt(inputText, vigenereKey)
            : vigenereDecrypt(inputText, vigenereKey);
      } else {
        // xor
        res =
          mode === 'encrypt'
            ? xorEncrypt(inputText, xorKey, 'hex')
            : xorDecrypt(inputText, xorKey, 'hex');
      }

      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Cryptographic operation failed');
      setResult(null);
    }
  }, [selectedAlgo, mode, inputText, caesarShift, vigenereKey, xorKey]);

  const handleCopy = () => {
    if (!result?.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwapOutputToInput = () => {
    if (!result?.output) return;
    setInputText(result.output);
    setMode(prev => (prev === 'encrypt' ? 'decrypt' : 'encrypt'));
  };

  const handleSelectAlgo = (algo: ClassicalAlgo) => {
    setSelectedAlgo(algo);
    setSearchParams({ algo });
    setErrorMessage(null);
  };

  const hasSteps = result?.steps && result.steps.length > 0;
  const algoInfo = CLASSICAL_ALGO_INFO[selectedAlgo];

  const algorithmPills: { id: ClassicalAlgo; label: string }[] = [
    { id: 'caesar', label: 'Caesar' },
    { id: 'atbash', label: 'Atbash' },
    { id: 'vigenere', label: 'Vigenère' },
    { id: 'xor', label: 'XOR' },
  ];

  return (
    <div className="space-y-6">
      {/* Selector + Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Select Algorithm
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {algorithmPills.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectAlgo(item.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedAlgo === item.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-amber-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] w-fit">
          <button
            type="button"
            onClick={() => setMode('encrypt')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              mode === 'encrypt'
                ? 'bg-cyan-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Encrypt
          </button>
          <button
            type="button"
            onClick={() => setMode('decrypt')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              mode === 'decrypt'
                ? 'bg-emerald-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            Decrypt
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-5">
          {/* Input */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {mode === 'encrypt' ? '01 — Input Plaintext' : '01 — Input Ciphertext'}
            </label>
            <div className="flex items-center gap-2">
                <CardInfoButton
                title="Input Text"
                subtitle="What can I type here?"
                sections={[
                    {
                    heading: 'Text only',
                    body: 'The playground works with UTF-8 text — including letters, numbers, spaces, punctuation, and emoji. Binary data must be encoded first (use the Encoding tab).',
                    icon: 'info',
                    },
                    {
                    heading: 'Case preservation',
                    body: 'Classical ciphers (Caesar, Vigenère) preserve uppercase/lowercase. This is done for readability — cryptographically, letter case carries no information.',
                    icon: 'tip',
                    },
                    {
                    heading: 'Character count',
                    body: 'The character count below the input shows how many UTF-8 characters you have typed. This is different from byte count for emoji and non-ASCII characters.',
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
              placeholder={
                mode === 'encrypt'
                  ? 'Enter secret message to encrypt...'
                  : 'Enter ciphertext (or hex bytes) to decrypt...'
              }
              className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-y"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>{inputText.length} characters</span>
              <span>UTF-8 encoded</span>
            </div>
          </div>

          {/* Config */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Key className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    02 — Configuration
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                    {selectedAlgo === 'caesar' && 'Shift parameter'}
                    {selectedAlgo === 'atbash' && 'Self-inverting, no key required'}
                    {selectedAlgo === 'vigenere' && 'Alphabetical keyword'}
                    {selectedAlgo === 'xor' && 'XOR secret key'}
                </p>
                </div>
            </div>

            {/* Info button — dynamic per algorithm */}
            {selectedAlgo === 'caesar' && (
                <CardInfoButton
                title="Caesar Cipher — Shift Key"
                subtitle="How the shift parameter works"
                sections={[
                    {
                    heading: 'What is the shift?',
                    body: 'The shift is how many positions each letter moves forward in the alphabet. Shift = 3 means A → D, B → E, and so on.',
                    icon: 'info',
                    },
                    {
                    heading: 'Keyspace = 25',
                    body: 'Shift can be 1–25. Shift 0 leaves the text unchanged, and shift 26 wraps back to shift 0. So there are only 25 meaningful keys — trivially brute-forceable.',
                    icon: 'warning',
                    },
                    {
                    heading: 'ROT13 = Shift 13',
                    body: 'Shift 13 is special: because 13 + 13 = 26, applying it twice returns the original. This is ROT13 — a self-inverse cipher.',
                    icon: 'tip',
                    },
                ]}
                />
            )}

            {selectedAlgo === 'vigenere' && (
                <CardInfoButton
                title="Vigenère Cipher — Keyword"
                subtitle="Why we need a keyword"
                sections={[
                    {
                    heading: 'What is the keyword?',
                    body: 'The keyword determines how much each letter shifts. If the keyword is "KEY", the first letter shifts by K=10, the second by E=4, the third by Y=24 — and then it repeats.',
                    icon: 'info',
                    },
                    {
                    heading: 'Why not use a single shift?',
                    body: 'A single shift (Caesar) preserves letter frequency, so it falls to frequency analysis. A keyword changes the shift per letter, obscuring the frequency distribution.',
                    icon: 'tip',
                    },
                    {
                    heading: 'Vulnerability',
                    body: 'Because the keyword repeats, an attacker can use Kasiski examination to find the key length. Then each Caesar sub-cipher can be broken independently.',
                    icon: 'warning',
                    },
                ]}
                />
            )}

            {selectedAlgo === 'xor' && (
                <CardInfoButton
                title="XOR Cipher — Secret Key"
                subtitle="Why XOR requires a key"
                sections={[
                    {
                    heading: 'What is the XOR key?',
                    body: 'The XOR key is a string of characters. Each byte of plaintext is XORed with each byte of the key (repeated as needed) to produce the ciphertext.',
                    icon: 'info',
                    },
                    {
                    heading: 'Why hex output?',
                    body: 'XOR often produces non-printable bytes. Hex format (e.g., 0D 09 18 0C) makes the output readable and easy to copy.',
                    icon: 'tip',
                    },
                    {
                    heading: 'Never reuse the key',
                    body: 'If you XOR two ciphertexts encrypted with the same key, the key cancels out: C₁ ⊕ C₂ = P₁ ⊕ P₂. This is the Two-Time Pad attack.',
                    icon: 'danger',
                    },
                ]}
                />
            )}

            {selectedAlgo === 'atbash' && (
                <CardInfoButton
                title="Atbash — No Key Required"
                subtitle="A keyless mirror cipher"
                sections={[
                    {
                    heading: 'What is Atbash?',
                    body: 'Atbash maps the first letter of the alphabet to the last (A↔Z), the second to the second-to-last (B↔Y), and so on. It requires no key — the mapping is completely fixed.',
                    icon: 'info',
                    },
                    {
                    heading: 'Self-inverting',
                    body: 'Atbash is an involution: applying it twice returns the original. The same function both encrypts and decrypts.',
                    icon: 'tip',
                    },
                    {
                    heading: 'Zero security',
                    body: 'Because there is no key, anyone who knows the algorithm can decode it instantly. Frequency analysis works trivially.',
                    icon: 'danger',
                    },
                ]}
                />
            )}
            </div>

            {selectedAlgo === 'caesar' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">
                    Shift: <strong className="text-amber-400 font-bold">{caesarShift}</strong>
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Modulo 26</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={caesarShift}
                  onChange={e => setCaesarShift(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <span>Shift 1 (A→B)</span>
                  <span>Shift 13 (ROT13)</span>
                  <span>Shift 25 (A→Z)</span>
                </div>
              </div>
            )}

            {selectedAlgo === 'atbash' && (
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-xs text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-[var(--text-primary)]">
                  Self-Inverting Involutory Cipher:
                </strong>{' '}
                Atbash requires no key. It maps the 1st letter of the alphabet to the 26th (A↔Z,
                B↔Y, C↔X). Running the algorithm twice automatically decrypts the message.
              </div>
            )}

            {selectedAlgo === 'vigenere' && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-[var(--text-secondary)] block">
                  Alphabetical Secret Keyword
                </label>
                <input
                  type="text"
                  value={vigenereKey}
                  onChange={e =>
                    setVigenereKey(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())
                  }
                  placeholder="e.g. CIPHER"
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm uppercase tracking-wider text-[var(--text-primary)] focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
                <div className="flex flex-wrap gap-2">
                  {['KEY', 'CIPHER', 'SECRET', 'CRYPTO'].map(kw => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setVigenereKey(kw)}
                      className="px-2.5 py-1 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[10px] font-mono text-[var(--text-secondary)] hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedAlgo === 'xor' && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-[var(--text-secondary)] block">
                  XOR Secret Key String
                </label>
                <input
                  type="text"
                  value={xorKey}
                  onChange={e => setXorKey(e.target.value)}
                  placeholder="Enter secret key string..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  Output is formatted as space-separated Hexadecimal bytes.
                </p>
              </div>
            )}
          </div>

          {/* Output */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {mode === 'encrypt' ? '03 — Ciphertext Output' : '03 — Decrypted Plaintext'}
              </span>
                <CardInfoButton
                title="Output Panel"
                subtitle="How to read and use the result"
                sections={[
                    {
                    heading: 'Green text',
                    body: 'The output is displayed in green to signal "valid result". If an error occurs, the panel shows a red message with a shield icon instead.',
                    icon: 'info',
                    },
                    {
                    heading: 'Copy button',
                    body: 'Click "Copy" to copy the full output to your clipboard. Useful for pasting into another tool, or into the Swap button to test the reverse operation.',
                    icon: 'tip',
                    },
                    {
                    heading: 'Swap button',
                    body: 'Swaps the output into the input field and flips the mode (encrypt ↔ decrypt). This lets you verify round-trip correctness in one click.',
                    icon: 'tip',
                    },
                    {
                    heading: 'Execution time',
                    body: 'The bottom-right shows how long the operation took (in milliseconds). Useful for comparing performance between algorithms.',
                    icon: 'info',
                    },
                ]}
                />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwapOutputToInput}
                  disabled={!result?.output}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3" /> Swap
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!result?.output}
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
            </div>

            <div className="relative min-h-[140px] p-5 rounded-xl bg-[#0A0C10] border border-[#1E222B] font-mono text-sm break-all leading-relaxed select-all">
              {errorMessage ? (
                <div className="text-rose-400 font-sans text-xs flex items-start gap-2">
                  <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              ) : result?.output ? (
                <span className="text-emerald-400">{result.output}</span>
              ) : (
                <span className="text-[var(--text-secondary)] italic text-xs">
                  Output will appear here automatically.
                </span>
              )}
            </div>

            {result && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-main)] text-[11px] font-mono text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {result.meta?.durationMs?.toFixed(2) ?? '0.00'} ms
                </span>
                {result.meta?.keyInfo && (
                  <span className="text-amber-400 truncate max-w-xs">
                    {result.meta.keyInfo}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24 lg:self-start">
          {hasSteps ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
              <StepVisualizer
                plaintext={inputText}
                ciphertext={result!.output}
                algorithmName={selectedAlgo.toUpperCase()}
                shiftOrKeyLabel={
                  selectedAlgo === 'caesar'
                    ? `Shift +${caesarShift}`
                    : selectedAlgo === 'vigenere'
                    ? `Keyword: ${vigenereKey}`
                    : selectedAlgo === 'xor'
                    ? `XOR Key: ${xorKey}`
                    : 'Mirror Inversion'
                }
                steps={result!.steps}
                mode={mode}
              />
            </div>
          ) : (
            <AlgorithmInfoPanel
              title={algoInfo.title}
              type="Classical"
              strength={algoInfo.strength}
              keyspace={algoInfo.keyspace}
              description={algoInfo.description}
              highlights={algoInfo.highlights}
            />
          )}

          <ExecutionInfo />
        </div>
      </div>
    </div>
  );
}