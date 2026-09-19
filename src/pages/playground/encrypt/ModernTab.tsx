import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  aesEncrypt,
  aesDecrypt,
  generateAesKey,
} from '../../../crypto/webcrypto/aes';
import {
  rsaEncrypt,
  rsaDecrypt,
  generateRsaKeyPair,
} from '../../../crypto/webcrypto/rsa';
import {
  chacha20Encrypt,
  chacha20Decrypt,
  generateChaCha20Key,
  generateChaCha20Nonce,
} from '../../../crypto/webcrypto/chacha20';
import { hmacSign } from '../../../crypto/webcrypto/hmac';
import { CryptoResult } from '../../../types/crypto';
import { useProgress } from '../../../hooks/useProgress';
import { Button } from '../../../components/common/Button';
import { CardInfoButton } from '../../../components/common/CardInfoButton';
import { AlgorithmInfoPanel } from '../shared/AlgorithmInfoPanel';
import { ExecutionInfo } from '../shared/ExecutionInfo';
import { CryptoPropertiesCard } from '../../../components/playground/CryptoPropertiesCard';

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
  Loader2,
  Play,
  Sparkles,
} from 'lucide-react';

type ModernAlgo = 'aes-gcm' | 'rsa-oaep' | 'chacha20' | 'hmac';

const MODERN_ALGO_INFO: Record<
  ModernAlgo,
  {
    title: string;
    strength: 'Strong' | 'Industry';
    keyspace: string;
    description: string;
    highlights: string[];
  }
> = {
  'aes-gcm': {
    title: 'AES-GCM',
    strength: 'Industry',
    keyspace: '2^128 or 2^256',
    description: 'US federal standard for authenticated symmetric encryption.',
    highlights: ['AEAD cipher', 'Hardware accelerated', 'Nonce must never repeat'],
  },
  'rsa-oaep': {
    title: 'RSA-OAEP',
    strength: 'Strong',
    keyspace: '2^2048 (factoring)',
    description: 'Public-key asymmetric encryption based on prime factorization.',
    highlights: ['Key exchange ready', 'OAEP-padded', 'Quantum-vulnerable'],
  },
  chacha20: {
    title: 'ChaCha20-Poly1305',
    strength: 'Industry',
    keyspace: '2^256',
    description: 'Modern AEAD stream cipher. Constant-time, cache-timing immune.',
    highlights: ['ARX operations', 'Mobile & TLS 1.3', 'AEAD cipher'],
  },
  hmac: {
    title: 'HMAC-SHA256',
    strength: 'Industry',
    keyspace: 'Key length',
    description: 'Keyed message authentication code — integrity + authenticity.',
    highlights: ['Symmetric MAC', 'Immune to length extension', 'Powers JWT & AWS'],
  },
};

interface ModernTabProps {
  initialAlgo?: string;
}

export function ModernTab({ initialAlgo }: ModernTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const initialModern = (
    initialAlgo && ['aes-gcm', 'rsa-oaep', 'chacha20', 'hmac'].includes(initialAlgo)
      ? initialAlgo
      : 'aes-gcm'
  ) as ModernAlgo;

  const [selectedAlgo, setSelectedAlgo] = useState<ModernAlgo>(initialModern);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('Top secret authorization token');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [justFinished, setJustFinished] = useState(false);

  // AES
  const [aesKeyHex, setAesKeyHex] = useState<string>('');
  const [aesIvHex, setAesIvHex] = useState<string>('');
  const [aesBitLength, setAesBitLength] = useState<128 | 256>(256);

  // RSA
  const [rsaPublicKeyPem, setRsaPublicKeyPem] = useState<string>('');
  const [rsaPrivateKeyPem, setRsaPrivateKeyPem] = useState<string>('');
  const [isGeneratingRsa, setIsGeneratingRsa] = useState(false);

  // ChaCha20
  const [chachaKeyHex, setChachaKeyHex] = useState<string>('');
  const [chachaNonceHex, setChachaNonceHex] = useState<string>('');
  const [isGeneratingChacha, setIsGeneratingChacha] = useState(false);

  // HMAC
  const [hmacKey, setHmacKey] = useState<string>('shared_secret_key');

  useEffect(() => {
    if (
      initialAlgo &&
      ['aes-gcm', 'rsa-oaep', 'chacha20', 'hmac'].includes(initialAlgo)
    ) {
      setSelectedAlgo(initialAlgo as ModernAlgo);
    }
  }, [initialAlgo]);

  useEffect(() => {
    exploreAlgorithm(selectedAlgo);
  }, [selectedAlgo, exploreAlgorithm]);

  // Init AES key
  useEffect(() => {
    async function initAes() {
      try {
        const { keyHex } = await generateAesKey(aesBitLength);
        setAesKeyHex(keyHex);
      } catch {
        /* ignore */
      }
    }
    if (selectedAlgo === 'aes-gcm' && !aesKeyHex) initAes();
  }, [selectedAlgo, aesBitLength, aesKeyHex]);

  // Init ChaCha20 key + nonce
  useEffect(() => {
    async function initChacha() {
      try {
        const [key, nonce] = await Promise.all([
          generateChaCha20Key(),
          generateChaCha20Nonce(),
        ]);
        setChachaKeyHex(key);
        setChachaNonceHex(nonce);
      } catch {
        /* ignore */
      }
    }
    if (selectedAlgo === 'chacha20' && !chachaKeyHex) initChacha();
  }, [selectedAlgo, chachaKeyHex]);

  // Reset result when algo or mode changes
  useEffect(() => {
    setResult(null);
    setErrorMessage(null);
    setJustFinished(false);
  }, [selectedAlgo, mode]);

  const handleRun = async () => {
    setErrorMessage(null);
    setResult(null);
    setJustFinished(false);

    if (!inputText) {
      setErrorMessage('Please enter some text first.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 250));

    try {
      let res: CryptoResult;

      if (selectedAlgo === 'aes-gcm') {
        if (!aesKeyHex) {
          throw new Error('Please generate or provide an AES hex key.');
        }
        if (mode === 'encrypt') {
          res = await aesEncrypt(inputText, aesKeyHex, aesIvHex || undefined);
          if (res.meta?.ivHex) setAesIvHex(res.meta.ivHex);
        } else {
          if (!aesIvHex) {
            throw new Error('Decryption in AES-GCM requires the 12-byte IV nonce.');
          }
          res = await aesDecrypt(inputText, aesKeyHex, aesIvHex);
        }
      } else if (selectedAlgo === 'rsa-oaep') {
        if (mode === 'encrypt') {
          if (!rsaPublicKeyPem) {
            throw new Error('Please generate or provide an RSA Public Key.');
          }
          res = await rsaEncrypt(inputText, rsaPublicKeyPem);
        } else {
          if (!rsaPrivateKeyPem) {
            throw new Error('Please generate or provide an RSA Private Key.');
          }
          res = await rsaDecrypt(inputText, rsaPrivateKeyPem);
        }
      } else if (selectedAlgo === 'chacha20') {
        if (!chachaKeyHex) {
          throw new Error('Please generate or provide a ChaCha20 hex key.');
        }
        if (mode === 'encrypt') {
          res = await chacha20Encrypt(inputText, chachaKeyHex, chachaNonceHex);
          if (res.meta?.ivHex) setChachaNonceHex(res.meta.ivHex);
        } else {
          res = await chacha20Decrypt(inputText, chachaKeyHex);
        }
      } else {
        if (!hmacKey) {
          throw new Error('Please provide an HMAC secret key.');
        }
        res = await hmacSign(inputText, hmacKey);
      }

      setResult(res);
      setJustFinished(true);
      setTimeout(() => setJustFinished(false), 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Cryptographic operation failed');
    } finally {
      setIsLoading(false);
    }
  };

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
    setResult(null);
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

  const handleGenerateNewAesKey = async () => {
    try {
      const { keyHex } = await generateAesKey(aesBitLength);
      setAesKeyHex(keyHex);
      setAesIvHex('');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleGenerateChachaKeys = async () => {
    setIsGeneratingChacha(true);
    try {
      const [key, nonce] = await Promise.all([
        generateChaCha20Key(),
        generateChaCha20Nonce(),
      ]);
      setChachaKeyHex(key);
      setChachaNonceHex(nonce);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsGeneratingChacha(false);
    }
  };

  const handleSelectAlgo = (algo: ModernAlgo) => {
    setSelectedAlgo(algo);
    setSearchParams({ algo });
    setErrorMessage(null);
    setResult(null);
  };

  const algoInfo = MODERN_ALGO_INFO[selectedAlgo];

  const algorithmPills: { id: ModernAlgo; label: string }[] = [
    { id: 'aes-gcm', label: 'AES-GCM' },
    { id: 'rsa-oaep', label: 'RSA-OAEP' },
    { id: 'chacha20', label: 'ChaCha20' },
    { id: 'hmac', label: 'HMAC-SHA256' },
  ];

  const showModeToggle = selectedAlgo !== 'hmac';
  const isRsa = selectedAlgo === 'rsa-oaep';

  const runButtonLabel = (() => {
    if (isLoading) {
      if (selectedAlgo === 'hmac') return 'Computing HMAC…';
      return mode === 'encrypt' ? 'Encrypting…' : 'Decrypting…';
    }
    if (selectedAlgo === 'hmac') return 'Compute HMAC';
    return mode === 'encrypt' ? 'Encrypt' : 'Decrypt';
  })();

  return (
    <div className="space-y-6">
      {/* ============================================================
          Selector + Mode Toggle
      ============================================================ */}
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
                    ? 'bg-cyan-500 text-black'
                    : 'bg-[var(--surface-main)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {showModeToggle && (
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
        )}
      </div>

      {/* ============================================================
          Main grid
      ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================
            LEFT COLUMN
        ======================================================== */}
        <div className="lg:col-span-7 space-y-7">
          {/* ======================================================
              01 — INPUT
          ====================================================== */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {selectedAlgo === 'hmac'
                  ? '01 — Message to Authenticate'
                  : mode === 'encrypt'
                  ? '01 — Input Plaintext'
                  : '01 — Input Ciphertext'}
              </label>
              <div className="flex items-center gap-2">
                <CardInfoButton
                  title="Input Text"
                  subtitle="What can I type here?"
                  sections={[
                    {
                      heading: 'Text only',
                      body: 'The playground works with UTF-8 text — letters, numbers, spaces, punctuation, and emoji. Modern ciphers operate on bytes, so any UTF-8 string is valid input.',
                      icon: 'info',
                    },
                    {
                      heading: 'Binary data?',
                      body: 'For binary files (images, PDFs), first convert to Base64 or Hex using the Encoding tab, then encrypt the resulting text. Real-world apps handle bytes directly.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Max size',
                      body: 'RSA-OAEP can only encrypt ~214 bytes per operation (padding overhead). AES-GCM, ChaCha20, and HMAC have no practical limit.',
                      icon: 'warning',
                    },
                  ]}
                />
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setResult(null);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>

            <textarea
              rows={7}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                selectedAlgo === 'hmac'
                  ? 'Enter a message to compute HMAC tag...'
                  : mode === 'encrypt'
                  ? 'Enter secret message to encrypt...'
                  : 'Paste ciphertext to decrypt...'
              }
              className="w-full p-4 rounded-xl border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-y transition-colors"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>{inputText.length} characters</span>
              <span>UTF-8 encoded</span>
            </div>
          </div>

          {/* ======================================================
              02 — CONFIGURATION
          ====================================================== */}
          <div
            className={`rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg ${
              isRsa ? 'p-5 sm:p-6 space-y-4' : 'p-6 sm:p-7 space-y-5'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Key className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    02 — Configuration
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                    {selectedAlgo === 'aes-gcm' && 'AES symmetric key + IV nonce'}
                    {selectedAlgo === 'rsa-oaep' && 'RSA public/private key pair'}
                    {selectedAlgo === 'chacha20' && 'ChaCha20 key + nonce'}
                    {selectedAlgo === 'hmac' && 'Shared secret key'}
                  </p>
                </div>
              </div>

              {/* Info button — dynamic per algorithm */}
              {selectedAlgo === 'aes-gcm' && (
                <CardInfoButton
                  title="AES-GCM Configuration"
                  subtitle="Understanding the key and nonce"
                  sections={[
                    {
                      heading: 'Hex Key',
                      body: 'The AES symmetric key is a random 128-bit or 256-bit value, displayed as a hex string (32 or 64 hex characters).\n\nBoth sender and receiver must share this exact key. The same key encrypts and decrypts.',
                      icon: 'info',
                    },
                    {
                      heading: 'IV / Nonce (12 bytes)',
                      body: 'The Initialization Vector (IV), also called a nonce, is a random 96-bit (12-byte) value UNIQUE per encryption.\n\nPurpose: ensure the same plaintext encrypts to DIFFERENT ciphertexts. Without it, an attacker could detect repeated messages.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Why auto-regenerated?',
                      body: 'When you delete the key, the playground generates a fresh random key automatically — real-world apps never let users pick weak keys.\n\nTo test a specific key, paste your own hex string (must be 32 or 64 hex characters).',
                      icon: 'warning',
                    },
                    {
                      heading: 'CRITICAL — Never reuse the IV',
                      body: 'Reusing the same IV with the same key breaks BOTH confidentiality and integrity in AES-GCM. Always generate a fresh random IV for every message.',
                      icon: 'danger',
                    },
                  ]}
                />
              )}

              {selectedAlgo === 'rsa-oaep' && (
                <CardInfoButton
                  title="RSA-OAEP Configuration"
                  subtitle="Public and Private Keys Explained"
                  sections={[
                    {
                      heading: 'Public Key (Encrypt)',
                      body: 'The public key can be shared with anyone. It is used to ENCRYPT messages that only the private key holder can read. It is safe to publish.',
                      icon: 'info',
                    },
                    {
                      heading: 'Private Key (Decrypt)',
                      body: 'The private key must be kept secret. It is used to DECRYPT messages encrypted with the public key. Never share it.',
                      icon: 'danger',
                    },
                    {
                      heading: 'Why generate a pair?',
                      body: 'RSA-2048 keys are mathematically linked: what the public key encrypts, only the private key can decrypt. Generating 2048-bit keys takes 100–500 ms in the browser.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Why RSA-OAEP?',
                      body: 'Textbook RSA is deterministic and malleable. OAEP (Optimal Asymmetric Encryption Padding) adds random padding that makes RSA provably secure against chosen-ciphertext attacks.',
                      icon: 'book',
                    },
                  ]}
                />
              )}

              {selectedAlgo === 'chacha20' && (
                <CardInfoButton
                  title="ChaCha20-Poly1305 Configuration"
                  subtitle="Modern AEAD stream cipher"
                  sections={[
                    {
                      heading: '256-bit Key',
                      body: 'A secret 256-bit (32-byte) random key, displayed as 64 hex characters. Shared between sender and receiver — same key for both directions.',
                      icon: 'info',
                    },
                    {
                      heading: '96-bit Nonce',
                      body: 'A 12-byte (96-bit) random value, unique per encryption. Like AES-GCM, nonce reuse is catastrophic — it breaks confidentiality AND integrity.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Why ChaCha20?',
                      body: 'ChaCha20 uses only Add-Rotate-XOR (ARX) operations — no S-box table lookups. This makes it immune to cache-timing attacks, and fast on any CPU (including mobile devices without AES hardware).',
                      icon: 'book',
                    },
                    {
                      heading: 'AEAD = Authenticated Encryption',
                      body: 'ChaCha20-Poly1305 provides both confidentiality (ChaCha20) and integrity (Poly1305 MAC) in a single pass. Any tampering is detected instantly.',
                      icon: 'tip',
                    },
                  ]}
                />
              )}

              {selectedAlgo === 'hmac' && (
                <CardInfoButton
                  title="HMAC-SHA256 Configuration"
                  subtitle="Keyed message authentication"
                  sections={[
                    {
                      heading: 'Shared Secret Key',
                      body: 'A string used by BOTH sender and receiver. Unlike RSA, there is no public/private split — both parties must have the exact same key.',
                      icon: 'info',
                    },
                    {
                      heading: 'Purpose',
                      body: 'HMAC provides integrity (data unchanged) AND authenticity (sender holds the key). It does NOT provide confidentiality — the message is not encrypted.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Output = 32 bytes',
                      body: 'The HMAC-SHA256 output is always a fixed 256-bit (64 hex characters) tag, regardless of input size.',
                      icon: 'info',
                    },
                    {
                      heading: 'Where is HMAC used?',
                      body: 'JWT authentication (HS256), AWS API signatures, Stripe webhooks, and the TLS PRF. Anytime you need to prove "this message came from someone with the key".',
                      icon: 'book',
                    },
                  ]}
                />
              )}
            </div>

            {/* AES */}
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
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
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
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* RSA — tetap ramping */}
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
                    icon={
                      isGeneratingRsa ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : undefined
                    }
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
                      rows={4}
                      value={rsaPublicKeyPem}
                      onChange={e => setRsaPublicKeyPem(e.target.value)}
                      placeholder="Click 'Generate Keypair'..."
                      className="w-full p-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-y transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
                      Private Key (Decrypt)
                    </span>
                    <textarea
                      rows={4}
                      value={rsaPrivateKeyPem}
                      onChange={e => setRsaPrivateKeyPem(e.target.value)}
                      placeholder="Click 'Generate Keypair'..."
                      className="w-full p-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-y transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ChaCha20 */}
            {selectedAlgo === 'chacha20' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-[var(--text-secondary)]">
                    ChaCha20-Poly1305 Key
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateChachaKeys}
                    disabled={isGeneratingChacha}
                    icon={
                      isGeneratingChacha ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : undefined
                    }
                  >
                    {isGeneratingChacha ? 'Generating...' : 'Regenerate'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    256-bit Hex Key
                  </label>
                  <input
                    type="text"
                    value={chachaKeyHex}
                    onChange={e => setChachaKeyHex(e.target.value)}
                    placeholder="ChaCha20 hex key..."
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    96-bit Nonce (Hex)
                  </label>
                  <input
                    type="text"
                    value={chachaNonceHex}
                    onChange={e => setChachaNonceHex(e.target.value)}
                    placeholder="Auto-generated on encryption..."
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* HMAC */}
            {selectedAlgo === 'hmac' && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-[var(--text-secondary)] block">
                  Shared Secret Key
                </label>
                <input
                  type="text"
                  value={hmacKey}
                  onChange={e => setHmacKey(e.target.value)}
                  placeholder="e.g. shared_secret_key_12345"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  HMAC provides integrity + authenticity. Output is a 32-byte (64 hex char) tag.
                </p>
              </div>
            )}
          </div>

          {/* ======================================================
              ACTION BUTTON
          ====================================================== */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleRun}
              disabled={isLoading || !inputText}
              icon={
                isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )
              }
              className="w-full sm:flex-1"
            >
              {runButtonLabel}
            </Button>
            {(result || errorMessage) && (
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setResult(null);
                  setErrorMessage(null);
                }}
                icon={<RotateCcw className="w-4 h-4" />}
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                Reset
              </Button>
            )}
          </div>

          {/* ======================================================
              03 — OUTPUT
          ====================================================== */}
          <div
            className={`p-7 sm:p-8 rounded-2xl bg-[var(--surface-main)] border shadow-lg space-y-5 transition-all duration-500 ${
              justFinished
                ? 'border-emerald-500/50 shadow-emerald-500/10'
                : 'border-[var(--border-main)]'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {selectedAlgo === 'hmac'
                    ? '03 — HMAC Tag'
                    : mode === 'encrypt'
                    ? '03 — Ciphertext Output'
                    : '03 — Decrypted Plaintext'}
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
                      body: 'Click "Copy" to copy the full output to your clipboard. Useful for pasting into another tool or verifying manually.',
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
              </div>

              <div className="flex items-center gap-2">
                {selectedAlgo !== 'hmac' && (
                  <button
                    type="button"
                    onClick={handleSwapOutputToInput}
                    disabled={!result?.output || isLoading}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ArrowRightLeft className="w-3 h-3" /> Swap
                  </button>
                )}
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

            <div className="relative min-h-[190px] p-5 rounded-xl bg-[#0A0C10] border border-[#1E222B] font-mono text-sm break-all leading-relaxed select-all overflow-hidden">
              {/* Shimmer loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.06] to-transparent animate-[shimmer_1.5s_infinite] pointer-events-none" />
              )}

              {errorMessage ? (
                <div className="text-rose-400 font-sans text-xs flex items-start gap-2 animate-[fadeIn_0.3s_ease-out]">
                  <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              ) : isLoading ? (
                <div className="flex items-center gap-2 text-[var(--text-secondary)] italic text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Processing cryptographic transformation…</span>
                </div>
              ) : result?.output ? (
                <span className="text-emerald-400 animate-[fadeIn_0.4s_ease-out] block">
                  {result.output}
                </span>
              ) : (
                <div className="flex items-center gap-2 text-[var(--text-secondary)] italic text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Click the button above to run the operation.</span>
                </div>
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

        {/* ========================================================
            RIGHT COLUMN
        ======================================================== */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <AlgorithmInfoPanel
            title={algoInfo.title}
            type="Modern"
            strength={algoInfo.strength}
            keyspace={algoInfo.keyspace}
            description={algoInfo.description}
            highlights={algoInfo.highlights}
          />
          <ExecutionInfo />
          <CryptoPropertiesCard algorithm={selectedAlgo} />
        </div>
      </div>

      {/* ============================================================
          Keyframes
      ============================================================ */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}