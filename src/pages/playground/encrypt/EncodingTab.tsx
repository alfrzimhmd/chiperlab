import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base64Encode, base64Decode } from '../../../crypto/encoding/base64';
import { hexEncode, hexDecode } from '../../../crypto/encoding/hex';
import { rot13Encrypt, rot13Decrypt } from '../../../crypto/encoding/rot13';
import { CryptoResult } from '../../../types/crypto';
import { useProgress } from '../../../hooks/useProgress';
import { Button } from '../../../components/common/Button';
import { CardInfoButton } from '../../../components/common/CardInfoButton';
import { StepVisualizer } from '../../../components/playground/StepVisualizer';
import { AlgorithmInfoPanel } from '../shared/AlgorithmInfoPanel';
import { ExecutionInfo } from '../shared/ExecutionInfo';
import {
  Copy,
  Check,
  RotateCcw,
  Lock,
  Unlock,
  Shield,
  Clock,
  ArrowRightLeft,
  AlertTriangle,
} from 'lucide-react';

type EncodingAlgo = 'base64' | 'hex' | 'rot13';

const ENCODING_ALGO_INFO: Record<
  EncodingAlgo,
  {
    title: string;
    strength: 'Educational';
    keyspace: string;
    description: string;
    highlights: string[];
  }
> = {
  base64: {
    title: 'Base64 Encoding',
    strength: 'Educational',
    keyspace: 'No key',
    description: 'Binary-to-text encoding using 64 printable ASCII characters.',
    highlights: ['NOT encryption', '33% overhead', 'Transport-safe'],
  },
  hex: {
    title: 'Hexadecimal Encoding',
    strength: 'Educational',
    keyspace: 'No key',
    description: 'Base-16 representation — 2 chars per byte.',
    highlights: ['NOT encryption', '2× overhead', 'Universal byte display'],
  },
  rot13: {
    title: 'ROT13',
    strength: 'Educational',
    keyspace: 'Fixed shift 13',
    description: 'Self-inverse Caesar shift of 13. Obfuscation, not security.',
    highlights: ['Involution', 'No key', 'Zero confidentiality'],
  },
};

interface EncodingTabProps {
  initialAlgo?: string;
}

export function EncodingTab({ initialAlgo }: EncodingTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const initialEncoding = (
    initialAlgo && ['base64', 'hex', 'rot13'].includes(initialAlgo)
      ? initialAlgo
      : 'base64'
  ) as EncodingAlgo;

  const [selectedAlgo, setSelectedAlgo] = useState<EncodingAlgo>(initialEncoding);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('Hello World');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialAlgo && ['base64', 'hex', 'rot13'].includes(initialAlgo)) {
      setSelectedAlgo(initialAlgo as EncodingAlgo);
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

      if (selectedAlgo === 'base64') {
        res = mode === 'encrypt' ? base64Encode(inputText) : base64Decode(inputText);
      } else if (selectedAlgo === 'hex') {
        res = mode === 'encrypt' ? hexEncode(inputText) : hexDecode(inputText);
      } else {
        // rot13
        res = mode === 'encrypt' ? rot13Encrypt(inputText) : rot13Decrypt(inputText);
      }

      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Encoding operation failed');
      setResult(null);
    }
  }, [selectedAlgo, mode, inputText]);

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

  const handleSelectAlgo = (algo: EncodingAlgo) => {
    setSelectedAlgo(algo);
    setSearchParams({ algo });
    setErrorMessage(null);
  };

  const hasSteps = result?.steps && result.steps.length > 0;
  const algoInfo = ENCODING_ALGO_INFO[selectedAlgo];

  const algorithmPills: { id: EncodingAlgo; label: string }[] = [
    { id: 'base64', label: 'Base64' },
    { id: 'hex', label: 'Hex' },
    { id: 'rot13', label: 'ROT13' },
  ];

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
        </div>
        <div className="pt-0.5">
          <span className="font-bold block text-amber-400 mb-1 font-mono text-[11px] tracking-wider uppercase">
            Encoding ≠ Encryption
          </span>
          <span className="text-[var(--text-secondary)] text-xs leading-relaxed">
            These are <strong>encoding</strong> schemes — no key, no secrecy, no confidentiality.
            Anyone can decode them in milliseconds. Use them for{' '}
            <strong>safe transport</strong>, never for protecting secrets.
          </span>
        </div>
      </div>

      {/* Selector + Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Select Encoding
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {algorithmPills.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectAlgo(item.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedAlgo === item.id
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-emerald-500/40 hover:text-[var(--text-primary)]'
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
            Encode
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
            Decode
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-5">
          {/* Input */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {mode === 'encrypt' ? '01 — Input Text' : '01 — Input Encoded Text'}
              </label>
              <div className="flex items-center gap-2">
                <CardInfoButton
                  title="Input Text"
                  subtitle="What can I type here?"
                  sections={[
                    {
                      heading: 'Text only',
                      body: 'The playground works with UTF-8 text — letters, numbers, spaces, punctuation, and emoji.',
                      icon: 'info',
                    },
                    {
                      heading: 'Decode mode',
                      body: 'When you click "Decode", the input must be a valid encoded string:\n\n• Base64: only A-Z, a-z, 0-9, +, /, and =\n• Hex: only 0-9 and A-F (with optional spaces)\n• ROT13: any text with letters A-Z',
                      icon: 'tip',
                    },
                    {
                      heading: 'Character count',
                      body: 'The counter below shows UTF-8 characters (not bytes). Emoji count as 2+ characters internally.',
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
                  ? 'Enter text to encode...'
                  : selectedAlgo === 'base64'
                  ? 'Paste Base64 string to decode...'
                  : selectedAlgo === 'hex'
                  ? 'Paste hex string (e.g. 48656C6C6F) to decode...'
                  : 'Paste ROT13 text to decode...'
              }
              className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-y"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>{inputText.length} characters</span>
              <span>UTF-8 encoded</span>
            </div>
          </div>

          {/* Config — Info only */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    02 — No Configuration Required
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                    Encoding has no key, no parameters
                  </p>
                </div>
              </div>

              <CardInfoButton
                title={`${algoInfo.title} — How It Works`}
                subtitle="Encoding is NOT encryption"
                sections={[
                  selectedAlgo === 'base64'
                    ? {
                        heading: 'What is Base64?',
                        body: 'Base64 converts every 3 bytes of binary into 4 ASCII characters using the alphabet A-Z, a-z, 0-9, +, /. The output is exactly 33% larger than the input — the price of safe transport across text-only channels.',
                        icon: 'info' as const,
                      }
                    : selectedAlgo === 'hex'
                    ? {
                        heading: 'What is Hex?',
                        body: 'Hex represents every byte as exactly 2 characters (0-9, A-F). The output is exactly 2× the size of the input — twice as long, but trivially readable.',
                        icon: 'info' as const,
                      }
                    : {
                        heading: 'What is ROT13?',
                        body: 'ROT13 shifts every letter by 13 positions. Because 13 + 13 = 26, applying ROT13 twice returns the original. It has no key and provides zero confidentiality.',
                        icon: 'info' as const,
                      },
                  {
                    heading: 'No key required',
                    body: 'Encoding requires no key, no password, no secret. Anyone can decode it in milliseconds — there is nothing to protect. If you need confidentiality, use encryption (AES-GCM, ChaCha20).',
                    icon: 'warning',
                  },
                  {
                    heading: 'When to use encoding?',
                    body: 'Use encoding when you need to safely transmit binary data across text-only protocols (email attachments, JSON payloads, URLs). NEVER use it to hide passwords, API keys, or confidential data.',
                    icon: 'danger',
                  },
                  {
                    heading: 'Real-world uses',
                    body: '• Base64: MIME email attachments, JWT tokens, data URIs\n• Hex: cryptographic hash display, MAC addresses, color codes\n• ROT13: hiding spoilers and puzzle answers (not security)',
                    icon: 'book',
                  },
                ]}
              />
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {selectedAlgo === 'base64' &&
                'Base64 converts every 3 bytes into 4 ASCII characters using the alphabet A-Z, a-z, 0-9, +, /. The output is exactly 33% larger than the input.'}
              {selectedAlgo === 'hex' &&
                'Hex represents every byte as exactly 2 characters (0-9, A-F). The output is exactly 2× the size of the input — twice as long, but trivially readable.'}
              {selectedAlgo === 'rot13' &&
                'ROT13 shifts every letter by 13 positions. Because 13 + 13 = 26, applying ROT13 twice returns the original — it is its own inverse.'}
            </p>
          </div>

          {/* Output */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {mode === 'encrypt' ? '03 — Encoded Output' : '03 — Decoded Text'}
                </span>
                <CardInfoButton
                  title="Output Panel"
                  subtitle="How to read and use the result"
                  sections={[
                    {
                      heading: 'Green text',
                      body: 'The output is displayed in green to signal "valid result". If an error occurs (e.g., invalid Base64), the panel shows a red message instead.',
                      icon: 'info',
                    },
                    {
                      heading: 'Copy button',
                      body: 'Click "Copy" to copy the full output to your clipboard.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Swap button',
                      body: 'Swaps the output into the input field and flips the mode (encode ↔ decode). This lets you verify round-trip correctness in one click.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Execution time',
                      body: 'The bottom-right shows how long the operation took (in milliseconds). Encoding is typically much faster than encryption.',
                      icon: 'info',
                    },
                  ]}
                />
              </div>

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
                  <span className="text-emerald-400 truncate max-w-xs">
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
                shiftOrKeyLabel="Fixed shift 13"
                steps={result!.steps}
                mode={mode}
              />
            </div>
          ) : (
            <AlgorithmInfoPanel
              title={algoInfo.title}
              type="Encoding"
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