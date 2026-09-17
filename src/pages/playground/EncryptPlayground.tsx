import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  caesarEncrypt,
  caesarDecrypt,
} from '../../crypto/classical/caesar';
import {
  atbashEncrypt,
  atbashDecrypt,
} from '../../crypto/classical/atbash';
import {
  vigenereEncrypt,
  vigenereDecrypt,
} from '../../crypto/classical/vigenere';
import {
  xorEncrypt,
  xorDecrypt,
} from '../../crypto/classical/xor';
import {
  aesEncrypt,
  aesDecrypt,
  generateAesKey,
} from '../../crypto/webcrypto/aes';
import {
  rsaEncrypt,
  rsaDecrypt,
  generateRsaKeyPair,
} from '../../crypto/webcrypto/rsa';
import { CryptoResult } from '../../types/crypto';
import { useProgress } from '../../hooks/useProgress';
import { StepVisualizer } from '../../components/playground/StepVisualizer';
import { SecurityNotice } from '../../components/common/SecurityNotice';
import { Button } from '../../components/common/Button';
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
  Info,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';

type SupportedAlgo = 'caesar' | 'atbash' | 'vigenere' | 'xor' | 'aes-gcm' | 'rsa-oaep';

const ALGO_INFO: Record<
  SupportedAlgo,
  {
    title: string;
    type: 'Classical' | 'Modern';
    strength: 'Educational' | 'Weak' | 'Strong' | 'Industry';
    keyspace: string;
    description: string;
    highlights: string[];
  }
> = {
  caesar: {
    title: 'Caesar Cipher',
    type: 'Classical',
    strength: 'Educational',
    keyspace: '25 shifts',
    description: 'Ancient monoalphabetic shift cipher used by Julius Caesar.',
    highlights: ['Simple substitution', 'Trivially brute-forced', 'Frequency leaks'],
  },
  atbash: {
    title: 'Atbash Cipher',
    type: 'Classical',
    strength: 'Educational',
    keyspace: 'No key (fixed)',
    description: 'Hebrew mirror cipher mapping A↔Z, B↔Y, C↔X.',
    highlights: ['Self-inverting', 'No secret key', 'Zero confidentiality'],
  },
  vigenere: {
    title: 'Vigenère Cipher',
    type: 'Classical',
    strength: 'Weak',
    keyspace: '26^(key length)',
    description: 'Polyalphabetic cipher once called "le chiffre indéchiffrable".',
    highlights: ['Keyword-driven', 'Masks frequency', 'Kasiski-vulnerable'],
  },
  xor: {
    title: 'XOR Stream',
    type: 'Classical',
    strength: 'Weak',
    keyspace: 'Repeating key',
    description: 'Bitwise exclusive-OR — the primitive of all modern ciphers.',
    highlights: ['Involutory', 'Two-Time Pad vulnerable', 'Foundation of AES'],
  },
  'aes-gcm': {
    title: 'AES-GCM',
    type: 'Modern',
    strength: 'Industry',
    keyspace: '2^128 or 2^256',
    description: 'US federal standard for authenticated symmetric encryption.',
    highlights: ['AEAD cipher', 'Hardware accelerated', 'Nonce must never repeat'],
  },
  'rsa-oaep': {
    title: 'RSA-OAEP',
    type: 'Modern',
    strength: 'Strong',
    keyspace: '2^2048 (factoring)',
    description: 'Public-key asymmetric encryption based on prime factorization.',
    highlights: ['Key exchange ready', 'OAEP-padded', 'Quantum-vulnerable'],
  },
};

export function EncryptPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const algoParam = searchParams.get('algo') as SupportedAlgo | null;
  const [selectedAlgo, setSelectedAlgo] = useState<SupportedAlgo>(algoParam || 'caesar');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const [inputText, setInputText] = useState('DEFEND THE EAST WALL');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [vigenereKey, setVigenereKey] = useState<string>('CIPHER');
  const [xorKey, setXorKey] = useState<string>('SECRET');

  const [aesKeyHex, setAesKeyHex] = useState<string>('');
  const [aesIvHex, setAesIvHex] = useState<string>('');
  const [aesBitLength, setAesBitLength] = useState<128 | 256>(256);

  const [rsaPublicKeyPem, setRsaPublicKeyPem] = useState<string>('');
  const [rsaPrivateKeyPem, setRsaPrivateKeyPem] = useState<string>('');
  const [isGeneratingRsa, setIsGeneratingRsa] = useState(false);

  useEffect(() => {
    if (
      algoParam &&
      ['caesar', 'atbash', 'vigenere', 'xor', 'aes-gcm', 'rsa-oaep'].includes(algoParam)
    ) {
      setSelectedAlgo(algoParam);
    }
  }, [algoParam]);

  useEffect(() => {
    exploreAlgorithm(selectedAlgo);
  }, [selectedAlgo, exploreAlgorithm]);

  useEffect(() => {
    async function initAes() {
      try {
        const { keyHex } = await generateAesKey(aesBitLength);
        setAesKeyHex(keyHex);
      } catch {
        // ignore
      }
    }
    if (selectedAlgo === 'aes-gcm' && !aesKeyHex) {
      initAes();
    }
  }, [selectedAlgo, aesBitLength, aesKeyHex]);

  useEffect(() => {
    let isMounted = true;

    async function runCrypto() {
      setErrorMessage(null);
      if (!inputText) {
        setResult(null);
        return;
      }

      setIsLoading(true);
      try {
        let res: CryptoResult;

        if (selectedAlgo === 'caesar') {
          res =
            mode === 'encrypt'
              ? caesarEncrypt(inputText, caesarShift)
              : caesarDecrypt(inputText, caesarShift);
        } else if (selectedAlgo === 'atbash') {
          res =
            mode === 'encrypt'
              ? atbashEncrypt(inputText)
              : atbashDecrypt(inputText);
        } else if (selectedAlgo === 'vigenere') {
          res =
            mode === 'encrypt'
              ? vigenereEncrypt(inputText, vigenereKey)
              : vigenereDecrypt(inputText, vigenereKey);
        } else if (selectedAlgo === 'xor') {
          res =
            mode === 'encrypt'
              ? xorEncrypt(inputText, xorKey, 'hex')
              : xorDecrypt(inputText, xorKey, 'hex');
        } else if (selectedAlgo === 'aes-gcm') {
          if (!aesKeyHex) {
            setErrorMessage('Please generate or provide an AES hex key.');
            setIsLoading(false);
            return;
          }
          if (mode === 'encrypt') {
            res = await aesEncrypt(inputText, aesKeyHex, aesIvHex || undefined);
            if (isMounted && res.meta?.ivHex) setAesIvHex(res.meta.ivHex);
          } else {
            if (!aesIvHex) {
              setErrorMessage('Decryption in AES-GCM requires the 12-byte IV nonce.');
              setIsLoading(false);
              return;
            }
            res = await aesDecrypt(inputText, aesKeyHex, aesIvHex);
          }
        } else if (selectedAlgo === 'rsa-oaep') {
          if (mode === 'encrypt') {
            if (!rsaPublicKeyPem) {
              setErrorMessage('Please generate or provide an RSA Public Key.');
              setIsLoading(false);
              return;
            }
            res = await rsaEncrypt(inputText, rsaPublicKeyPem);
          } else {
            if (!rsaPrivateKeyPem) {
              setErrorMessage('Please generate or provide an RSA Private Key.');
              setIsLoading(false);
              return;
            }
            res = await rsaDecrypt(inputText, rsaPrivateKeyPem);
          }
        } else {
          return;
        }

        if (isMounted) setResult(res);
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err?.message || 'Cryptographic operation failed');
          setResult(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    runCrypto();
    return () => {
      isMounted = false;
    };
  }, [
    selectedAlgo,
    mode,
    inputText,
    caesarShift,
    vigenereKey,
    xorKey,
    aesKeyHex,
    aesIvHex,
    rsaPublicKeyPem,
    rsaPrivateKeyPem,
  ]);

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

  const handleGenerateNewAesKey = async () => {
    try {
      const { keyHex } = await generateAesKey(aesBitLength);
      setAesKeyHex(keyHex);
      setAesIvHex('');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleGenerateRsaKeyPair = async () => {
    setIsGeneratingRsa(true);
    try {
      const pair = await generateRsaKeyPair(2048);
      setRsaPublicKeyPem(pair.publicKeyPem);
      setRsaPrivateKeyPem(pair.privateKeyPem);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsGeneratingRsa(false);
    }
  };

  const handleSelectAlgo = (algo: SupportedAlgo) => {
    setSelectedAlgo(algo);
    setSearchParams({ algo });
    setErrorMessage(null);
  };

  const isClassical = ['caesar', 'atbash', 'vigenere', 'xor'].includes(selectedAlgo);
  const hasSteps = isClassical && result && result.steps && result.steps.length > 0;
  const algoInfo = ALGO_INFO[selectedAlgo];

  const algorithmPills = [
    { id: 'caesar', label: 'Caesar' },
    { id: 'atbash', label: 'Atbash' },
    { id: 'vigenere', label: 'Vigenère' },
    { id: 'xor', label: 'XOR' },
    { id: 'aes-gcm', label: 'AES-GCM' },
    { id: 'rsa-oaep', label: 'RSA-OAEP' },
  ] as const;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <Lock className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Encryption & Decryption Engine
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Cryptographic Playground
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Test 6 ciphers — from ancient Caesar shifts to modern Web Crypto authenticated
              encryption.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] w-fit">
            <button
              id="mode-toggle-encrypt"
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
              id="mode-toggle-decrypt"
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
      </div>

      <SecurityNotice type={isClassical ? 'classical' : 'general'} />

      {/* ============================================================
          ALGORITHM SELECTOR
      ============================================================ */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Select Algorithm
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {algorithmPills.map(item => (
            <button
              key={item.id}
              id={`select-algo-${item.id}`}
              type="button"
              onClick={() => handleSelectAlgo(item.id as SupportedAlgo)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedAlgo === item.id
                  ? 'bg-cyan-500 text-black'
                  : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
          MAIN GRID
          LEFT (7 cols):  Input → Config → Output
          RIGHT (5 cols): Step Visualizer (sticky)
      ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================
            LEFT COLUMN: Input + Config + Output
        ============================================================ */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. INPUT */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="crypto-input-text"
                className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                {mode === 'encrypt' ? '01 — Input Plaintext' : '01 — Input Ciphertext'}
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
              id="crypto-input-text"
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                mode === 'encrypt'
                  ? 'Enter secret message to encrypt...'
                  : 'Enter ciphertext (or hex bytes) to decrypt...'
              }
              className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-y"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>{inputText.length} characters</span>
              <span>UTF-8 encoded</span>
            </div>
          </div>

          {/* 2. CONFIG */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  02 — Configuration
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {selectedAlgo === 'caesar' && 'Shift parameter'}
                  {selectedAlgo === 'atbash' && 'Self-inverting, no key required'}
                  {selectedAlgo === 'vigenere' && 'Alphabetical keyword'}
                  {selectedAlgo === 'xor' && 'XOR secret key'}
                  {selectedAlgo === 'aes-gcm' && 'AES symmetric key + IV nonce'}
                  {selectedAlgo === 'rsa-oaep' && 'RSA public/private key pair'}
                </p>
              </div>
            </div>

            {/* Caesar */}
            {selectedAlgo === 'caesar' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">
                    Shift: <strong className="text-cyan-400 font-bold">{caesarShift}</strong>
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Modulo 26</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={caesarShift}
                  onChange={e => setCaesarShift(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <span>Shift 1 (A→B)</span>
                  <span>Shift 13 (ROT13)</span>
                  <span>Shift 25 (A→Z)</span>
                </div>
              </div>
            )}

            {/* Atbash */}
            {selectedAlgo === 'atbash' && (
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-xs text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-[var(--text-primary)]">
                  Self-Inverting Involutory Cipher:
                </strong>{' '}
                Atbash requires no key. It maps the 1st letter of the alphabet to the 26th (A↔Z,
                B↔Y, C↔X). Running the algorithm twice automatically decrypts the message.
              </div>
            )}

            {/* Vigenère */}
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
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm uppercase tracking-wider text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                />
                <div className="flex flex-wrap gap-2">
                  {['KEY', 'CIPHER', 'SECRET', 'CRYPTO'].map(kw => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setVigenereKey(kw)}
                      className="px-2.5 py-1 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-main)] text-[10px] font-mono text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* XOR */}
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
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                />
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  Output is formatted as space-separated Hexadecimal bytes.
                </p>
              </div>
            )}

            {/* AES-GCM */}
            {selectedAlgo === 'aes-gcm' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-[var(--text-secondary)]">
                    AES Key ({aesBitLength}-bit)
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center p-0.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
                      <button
                        type="button"
                        onClick={() => setAesBitLength(128)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                          aesBitLength === 128
                            ? 'bg-cyan-500 text-black'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        128
                      </button>
                      <button
                        type="button"
                        onClick={() => setAesBitLength(256)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                          aesBitLength === 256
                            ? 'bg-cyan-500 text-black'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        256
                      </button>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleGenerateNewAesKey}>
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    Hex Key
                  </label>
                  <input
                    type="text"
                    value={aesKeyHex}
                    onChange={e => setAesKeyHex(e.target.value)}
                    placeholder="AES Hex Key..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-[11px] text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    12-byte IV Nonce (Hex)
                  </label>
                  <input
                    type="text"
                    value={aesIvHex}
                    onChange={e => setAesIvHex(e.target.value)}
                    placeholder="Auto-generated on encryption..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-[11px] text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            )}

            {/* RSA-OAEP */}
            {selectedAlgo === 'rsa-oaep' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-[var(--text-secondary)]">
                    RSA 2048-bit Key Pair
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateRsaKeyPair}
                    disabled={isGeneratingRsa}
                  >
                    {isGeneratingRsa ? 'Generating...' : 'Generate Keypair'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1.5">
                      Public Key (Encrypt)
                    </span>
                    <textarea
                      rows={3}
                      value={rsaPublicKeyPem}
                      onChange={e => setRsaPublicKeyPem(e.target.value)}
                      placeholder="Click 'Generate Keypair'..."
                      className="w-full p-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-[10px] text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 resize-y"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
                      Private Key (Decrypt)
                    </span>
                    <textarea
                      rows={3}
                      value={rsaPrivateKeyPem}
                      onChange={e => setRsaPrivateKeyPem(e.target.value)}
                      placeholder="Click 'Generate Keypair'..."
                      className="w-full p-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-[10px] text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 resize-y"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. OUTPUT */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {mode === 'encrypt' ? '03 — Ciphertext Output' : '03 — Decrypted Plaintext'}
              </span>

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
              ) : isLoading ? (
                <span className="text-[var(--text-secondary)] italic text-xs">
                  Processing cryptographic transformation...
                </span>
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
                  <span className="text-cyan-400 truncate max-w-xs">
                    {result.meta.keyInfo}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: Step Visualizer (sticky) OR Algorithm Info Panel
        ============================================================ */}
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
            <AlgorithmInfoPanel algoInfo={algoInfo} selectedAlgo={selectedAlgo} />
          )}

          {/* Bottom info card always */}
          <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Execution Environment
              </h3>
            </div>
            <div className="space-y-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-main)]">
                <span>Runtime</span>
                <span className="text-[var(--text-primary)]">Browser Web Crypto</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-main)]">
                <span>Location</span>
                <span className="text-[var(--text-primary)]">Client-side only</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Round-trips</span>
                <span className="text-emerald-400">0 (offline capable)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Algorithm Info Panel (untuk non-classical / saat belum ada steps)
============================================================ */
interface AlgorithmInfoPanelProps {
  algoInfo: typeof ALGO_INFO[keyof typeof ALGO_INFO];
  selectedAlgo: SupportedAlgo;
}

function AlgorithmInfoPanel({ algoInfo, selectedAlgo }: AlgorithmInfoPanelProps) {
  const strengthColor = {
    Educational: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Weak: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    Strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Industry: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  }[algoInfo.strength];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Algorithm Profile
          </h3>
          <p className="text-[10px] font-mono text-[var(--text-secondary)]">
            No step-by-step trace for {algoInfo.type.toLowerCase()} ciphers
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-bold text-[var(--text-primary)]">{algoInfo.title}</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {algoInfo.description}
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Family
          </span>
          <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
            {algoInfo.type}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Security
          </span>
          <span
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${strengthColor}`}
          >
            {algoInfo.strength}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-[var(--border-main)]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Keyspace
          </span>
          <span className="text-xs font-mono text-[var(--text-primary)]">
            {algoInfo.keyspace}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-[var(--border-main)]">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
          Key Characteristics
        </span>
        <ul className="space-y-1.5">
          {algoInfo.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
              <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {algoInfo.type === 'Modern' && (
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            This algorithm executes via hardware-accelerated{' '}
            <code className="text-cyan-300 font-mono">crypto.subtle</code>.
          </span>
        </div>
      )}

      {algoInfo.type === 'Classical' && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Educational only. Step-by-step trace appears when you enter input text.
          </span>
        </div>
      )}
    </div>
  );
}