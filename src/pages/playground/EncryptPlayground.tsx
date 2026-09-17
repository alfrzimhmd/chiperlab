import { useState, useEffect, useTransition } from 'react';
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
  Sparkles,
  Key,
  Lock,
  Unlock,
  Shield,
  Clock,
  ArrowRightLeft,
} from 'lucide-react';

type SupportedAlgo = 'caesar' | 'atbash' | 'vigenere' | 'xor' | 'aes-gcm' | 'rsa-oaep';

export function EncryptPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const algoParam = searchParams.get('algo') as SupportedAlgo | null;
  const [selectedAlgo, setSelectedAlgo] = useState<SupportedAlgo>(algoParam || 'caesar');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Input text
  const [inputText, setInputText] = useState('DEFEND THE EAST WALL');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Algorithm-specific state
  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [vigenereKey, setVigenereKey] = useState<string>('CIPHER');
  const [xorKey, setXorKey] = useState<string>('SECRET');

  // AES state
  const [aesKeyHex, setAesKeyHex] = useState<string>('');
  const [aesIvHex, setAesIvHex] = useState<string>('');
  const [aesBitLength, setAesBitLength] = useState<128 | 256>(256);

  // RSA state
  const [rsaPublicKeyPem, setRsaPublicKeyPem] = useState<string>('');
  const [rsaPrivateKeyPem, setRsaPrivateKeyPem] = useState<string>('');
  const [isGeneratingRsa, setIsGeneratingRsa] = useState(false);

  // Sync with searchParams
  useEffect(() => {
    if (algoParam && ['caesar', 'atbash', 'vigenere', 'xor', 'aes-gcm', 'rsa-oaep'].includes(algoParam)) {
      setSelectedAlgo(algoParam);
    }
  }, [algoParam]);

  // Track algorithm exploration in progress
  useEffect(() => {
    exploreAlgorithm(selectedAlgo);
  }, [selectedAlgo, exploreAlgorithm]);

  // Generate initial AES key on mount
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

  // Main compute handler
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
          res = mode === 'encrypt'
            ? caesarEncrypt(inputText, caesarShift)
            : caesarDecrypt(inputText, caesarShift);
        } else if (selectedAlgo === 'atbash') {
          res = mode === 'encrypt'
            ? atbashEncrypt(inputText)
            : atbashDecrypt(inputText);
        } else if (selectedAlgo === 'vigenere') {
          res = mode === 'encrypt'
            ? vigenereEncrypt(inputText, vigenereKey)
            : vigenereDecrypt(inputText, vigenereKey);
        } else if (selectedAlgo === 'xor') {
          res = mode === 'encrypt'
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

        if (isMounted) {
          setResult(res);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err?.message || 'Cryptographic operation failed');
          setResult(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            Encryption & Decryption Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cryptographic Playground
          </h1>
        </div>

        {/* Mode Toggle: Encrypt vs Decrypt */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit">
          <button
            id="mode-toggle-encrypt"
            type="button"
            onClick={() => setMode('encrypt')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mode === 'encrypt'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Encrypt
          </button>
          <button
            id="mode-toggle-decrypt"
            type="button"
            onClick={() => setMode('decrypt')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mode === 'decrypt'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            Decrypt
          </button>
        </div>
      </div>

      {/* Security Warning Notice */}
      <SecurityNotice type={isClassical ? 'classical' : 'general'} />

      {/* Algorithm Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase shrink-0 mr-1">
          Algorithm:
        </span>
        {[
          { id: 'caesar', label: 'Caesar Cipher', category: 'Classical' },
          { id: 'atbash', label: 'Atbash Cipher', category: 'Classical' },
          { id: 'vigenere', label: 'Vigenère Cipher', category: 'Classical' },
          { id: 'xor', label: 'XOR Cipher', category: 'Classical' },
          { id: 'aes-gcm', label: 'AES-GCM', category: 'Modern' },
          { id: 'rsa-oaep', label: 'RSA-OAEP', category: 'Modern' },
        ].map(item => (
          <button
            key={item.id}
            id={`select-algo-${item.id}`}
            type="button"
            onClick={() => handleSelectAlgo(item.id as SupportedAlgo)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              selectedAlgo === item.id
                ? 'bg-sky-600 text-white dark:bg-sky-500 shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input & Key Controls */}
        <div className="space-y-5">
          {/* Text Input Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="crypto-input-text"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                {mode === 'encrypt' ? 'Input Plaintext' : 'Input Ciphertext'}
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
              id="crypto-input-text"
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                mode === 'encrypt'
                  ? 'Enter secret message to encrypt...'
                  : 'Enter ciphertext (or hex bytes) to decrypt...'
              }
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{inputText.length} characters</span>
              <span>UTF-8 encoded</span>
            </div>
          </div>

          {/* Key & Parameter Controls Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              <Key className="w-4 h-4 text-sky-500" />
              <span>Key & Cipher Configuration</span>
            </div>

            {/* Caesar controls */}
            {selectedAlgo === 'caesar' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    Alphabet Shift Distance: <strong className="font-mono text-sky-600 dark:text-sky-400 font-bold">{caesarShift}</strong>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Modulo 26</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={caesarShift}
                  onChange={e => setCaesarShift(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Shift 1 (A→B)</span>
                  <span>Shift 13 (ROT13)</span>
                  <span>Shift 25 (A→Z)</span>
                </div>
              </div>
            )}

            {/* Atbash controls */}
            {selectedAlgo === 'atbash' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-800">
                <strong>Self-Inverting Involutory Cipher:</strong> Atbash requires no key. It maps the 1st letter of the alphabet to the 26th (A↔Z, B↔Y, C↔X). Running the algorithm twice automatically decrypts the message.
              </div>
            )}

            {/* Vigenère controls */}
            {selectedAlgo === 'vigenere' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block">
                  Alphabetical Secret Keyword:
                </label>
                <input
                  type="text"
                  value={vigenereKey}
                  onChange={e => setVigenereKey(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                  placeholder="e.g. CIPHER"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="flex gap-2 pt-1">
                  {['KEY', 'CIPHER', 'SECRET', 'CRYPTO'].map(kw => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setVigenereKey(kw)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* XOR controls */}
            {selectedAlgo === 'xor' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block">
                  XOR Secret Key String:
                </label>
                <input
                  type="text"
                  value={xorKey}
                  onChange={e => setXorKey(e.target.value)}
                  placeholder="Enter secret key string..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-[11px] text-slate-400">
                  Output is formatted as space-separated Hexadecimal bytes.
                </p>
              </div>
            )}

            {/* AES-GCM controls */}
            {selectedAlgo === 'aes-gcm' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    AES Key ({aesBitLength}-bit):
                  </span>
                  <Button size="sm" variant="outline" onClick={handleGenerateNewAesKey}>
                    Generate Key
                  </Button>
                </div>
                <input
                  type="text"
                  value={aesKeyHex}
                  onChange={e => setAesKeyHex(e.target.value)}
                  placeholder="AES Hex Key..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-900 dark:text-white"
                />

                <div className="space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300 block">
                    12-byte IV Nonce (Hex):
                  </span>
                  <input
                    type="text"
                    value={aesIvHex}
                    onChange={e => setAesIvHex(e.target.value)}
                    placeholder="Auto-generated on encryption..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* RSA-OAEP controls */}
            {selectedAlgo === 'rsa-oaep' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    RSA 2048-bit Key Pair:
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

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Public Key (Used for Encryption)
                    </span>
                    <textarea
                      rows={3}
                      value={rsaPublicKeyPem}
                      onChange={e => setRsaPublicKeyPem(e.target.value)}
                      placeholder="Click 'Generate Keypair' to create RSA keys..."
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-[10px]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Private Key (Used for Decryption)
                    </span>
                    <textarea
                      rows={3}
                      value={rsaPrivateKeyPem}
                      onChange={e => setRsaPrivateKeyPem(e.target.value)}
                      placeholder="Click 'Generate Keypair' to create RSA keys..."
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output & Details */}
        <div className="space-y-5">
          {/* Output Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {mode === 'encrypt' ? 'Ciphertext Output' : 'Decrypted Plaintext Output'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwapOutputToInput}
                  disabled={!result?.output}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                >
                  <ArrowRightLeft className="w-3 h-3" /> Swap to Input
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!result?.output}
                  icon={copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Output Box */}
            <div className="relative min-h-[120px] p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs break-all leading-relaxed select-all">
              {errorMessage ? (
                <div className="text-rose-400 font-sans text-xs flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              ) : isLoading ? (
                <span className="text-slate-500 italic">Processing cryptographic transformation...</span>
              ) : result?.output ? (
                result.output
              ) : (
                <span className="text-slate-600 italic">Output will appear here automatically.</span>
              )}
            </div>

            {/* Metadata Footer */}
            {result && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Latency: {result.meta?.durationMs?.toFixed(2) ?? '0.00'} ms
                </span>

                {result.meta?.keyInfo && (
                  <span className="font-mono text-[10px] text-indigo-500 dark:text-indigo-400 truncate max-w-xs">
                    {result.meta.keyInfo}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Step-by-Step Visualization (for Classical ciphers) */}
          {isClassical && result && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <StepVisualizer
                plaintext={inputText}
                ciphertext={result.output}
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
                steps={result.steps}
                mode={mode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
