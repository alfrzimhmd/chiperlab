import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Cpu,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  FileSearch,
  Info,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { CardInfoButton } from '../../../components/common/CardInfoButton';
import { FileDropzone } from '../../../components/playground/media/FileDropzone';
import { FilePreview } from '../../../components/playground/media/FilePreview';
import { FileResultCard } from '../../../components/playground/media/FileResultCard';
import { FileInspector } from '../../../components/playground/media/FileInspector';
import { AnalyzingOverlay } from '../../../components/playground/media/AnalyzingOverlay';
import { useProgress } from '../../../hooks/useProgress';
import {
  encryptFile,
  decryptFile,
  generateMediaKey,
  readFileAsBytes,
  MediaAlgorithm,
  getAlgorithmLabel,
} from '../../../crypto/media/fileEncryption';
import { inspectFile, InspectResult } from '../../../crypto/media/inspectFile';

type MediaMode = 'encrypt' | 'decrypt' | 'analyze';

const MEDIA_ALGORITHMS: {
  id: MediaAlgorithm;
  label: string;
  desc: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  activeBg: string;
}[] = [
  {
    id: 'aes-gcm',
    label: 'AES-GCM',
    desc: '256-bit AEAD · Industry standard',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    activeBg: 'bg-cyan-500',
  },
  {
    id: 'chacha20',
    label: 'ChaCha20',
    desc: '256-bit AEAD · Mobile-friendly',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
    activeBg: 'bg-purple-500',
  },
  {
    id: 'xor',
    label: 'XOR Stream',
    desc: 'SHA-256 derived keystream',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
    activeBg: 'bg-amber-500',
  },
];

const MAX_FILE_SIZE_MB = 20;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaTab() {
  const [searchParams] = useSearchParams();
  const { exploreAlgorithm } = useProgress();

  const algoParam = searchParams.get('algo');
  const modeParam = searchParams.get('mode') as MediaMode | null;

  const initialAlgo: MediaAlgorithm =
    algoParam === 'chacha20' ? 'chacha20' : algoParam === 'xor' ? 'xor' : 'aes-gcm';

  const [selectedAlgo, setSelectedAlgo] = useState<MediaAlgorithm>(initialAlgo);
  const [mode, setMode] = useState<MediaMode>(
    modeParam === 'decrypt' ? 'decrypt' : modeParam === 'analyze' ? 'analyze' : 'encrypt'
  );

  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);

  const [keyHex, setKeyHex] = useState<string>('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // <-- khusus analyze
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultMeta, setResultMeta] = useState<{
    durationMs: number;
    inputSize: number;
    nonceHex: string;
  } | null>(null);

  const [inspectResult, setInspectResult] = useState<InspectResult | null>(null);

  // Track algorithm exploration
  useEffect(() => {
    exploreAlgorithm(
      selectedAlgo === 'aes-gcm' ? 'aes' : selectedAlgo === 'chacha20' ? 'chacha20' : 'xor'
    );
  }, [selectedAlgo, exploreAlgorithm]);

  // Auto-generate key when algorithm changes (skip in analyze mode)
  useEffect(() => {
    if (mode === 'analyze') return;
    async function initKey() {
      try {
        const { keyHex: newKey } = await generateMediaKey(selectedAlgo);
        setKeyHex(newKey);
      } catch {
        setKeyHex('');
      }
    }
    initKey();
  }, [selectedAlgo, mode]);

  // Reset result when file or mode changes
  useEffect(() => {
    setResultBytes(null);
    setResultMeta(null);
    setInspectResult(null);
    setErrorMessage(null);
  }, [file, mode, selectedAlgo]);

  const handleFileSelected = async (f: File) => {
    setErrorMessage(null);
    setFile(f);
    setResultBytes(null);
    setResultMeta(null);
    setInspectResult(null);
    setProgress(0);

    try {
      const bytes = await readFileAsBytes(f, pct => setProgress(pct));
      setFileBytes(bytes);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to read file.');
      setFileBytes(null);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setFileBytes(null);
    setResultBytes(null);
    setResultMeta(null);
    setInspectResult(null);
    setErrorMessage(null);
    setProgress(0);
  };

  const handleRegenerateKey = async () => {
    try {
      const { keyHex: newKey } = await generateMediaKey(selectedAlgo);
      setKeyHex(newKey);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleProcess = async () => {
    // ---------- ANALYZE MODE ----------
    if (mode === 'analyze') {
      if (!fileBytes || !file) return;

      setIsAnalyzing(true);
      setErrorMessage(null);
      setInspectResult(null);

      // Delay agar overlay loading tampil dulu sebelum main thread diblok
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        // inspectFile() synchronous — beri kesempatan UI paint dulu
        const result = inspectFile(fileBytes);
        setInspectResult(result);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Analysis failed.');
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    // ---------- ENCRYPT / DECRYPT ----------
    if (!fileBytes) {
      setErrorMessage('Please select a file first.');
      return;
    }
    if (!keyHex || keyHex.length < 32) {
      setErrorMessage('Please provide a valid key (at least 32 hex characters).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setResultBytes(null);
    setResultMeta(null);

    try {
      if (mode === 'encrypt') {
        const res = await encryptFile(fileBytes, selectedAlgo, keyHex);
        setResultBytes(res.output);
        setResultMeta({
          durationMs: res.durationMs,
          inputSize: fileBytes.length,
          nonceHex: res.nonceHex,
        });
      } else {
        const res = await decryptFile(fileBytes, keyHex);
        setResultBytes(res.output);
        setResultMeta({
          durationMs: res.durationMs,
          inputSize: fileBytes.length,
          nonceHex: '',
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Operation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResultBytes(null);
    setResultMeta(null);
    setInspectResult(null);
    setErrorMessage(null);
  };

  const currentAlgo = MEDIA_ALGORITHMS.find(a => a.id === selectedAlgo)!;
  const isEncrypt = mode === 'encrypt';
  const isDecrypt = mode === 'decrypt';
  const isAnalyze = mode === 'analyze';

  const canProcess =
    fileBytes !== null && !isProcessing && !isAnalyzing && (isAnalyze || keyHex.length >= 32);

  return (
    <div className="space-y-6">
      {/* ============================================================
          MODE TOGGLE
      ============================================================ */}
      <div className="flex justify-center">
        <div className="flex items-center p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] w-fit overflow-x-auto">
          <button
            type="button"
            onClick={() => setMode('encrypt')}
            disabled={isProcessing || isAnalyzing}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === 'encrypt'
                ? 'bg-cyan-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Encrypt File
          </button>

          <button
            type="button"
            onClick={() => setMode('decrypt')}
            disabled={isProcessing || isAnalyzing}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === 'decrypt'
                ? 'bg-emerald-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            Decrypt File
          </button>

          <button
            type="button"
            onClick={() => setMode('analyze')}
            disabled={isProcessing || isAnalyzing}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === 'analyze'
                ? 'bg-purple-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            Analyze File
          </button>
        </div>
      </div>

      {/* ============================================================
          ALGORITHM SELECTOR
      ============================================================ */}
      {!isAnalyze && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              01 — Choose Algorithm
            </span>
            <CardInfoButton
              title="Media Encryption Algorithms"
              subtitle="Why only 3 algorithms for files?"
              sections={[
                {
                  heading: 'Letter-based ciphers cannot handle files',
                  body: 'Caesar, Atbash, and Vigenère only transform A–Z characters. A binary file (image, PDF, ZIP) contains bytes from 0–255, so these ciphers would corrupt the data. Files require byte-level algorithms.',
                  icon: 'warning',
                },
                {
                  heading: 'AES-GCM (Recommended)',
                  body: 'US federal standard. Hardware-accelerated (AES-NI) on modern CPUs, so it is the fastest option for large files. AEAD — detects any tampering via 16-byte tag.',
                  icon: 'tip',
                },
                {
                  heading: 'ChaCha20-Poly1305',
                  body: 'Modern stream cipher from Daniel J. Bernstein. Uses only ARX operations (Add-Rotate-XOR), so it is constant-time and immune to cache-timing attacks. Preferred on mobile devices without AES hardware.',
                  icon: 'tip',
                },
                {
                  heading: 'XOR Stream',
                  body: 'Educational primitive. The SHA-256-derived keystream is our safer variant — it avoids the classic Two-Time Pad vulnerability of raw XOR by ensuring each file uses a fresh nonce. NOT for production use.',
                  icon: 'danger',
                },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MEDIA_ALGORITHMS.map(algo => {
              const isActive = selectedAlgo === algo.id;
              return (
                <button
                  key={algo.id}
                  type="button"
                  onClick={() => setSelectedAlgo(algo.id)}
                  disabled={isProcessing || isAnalyzing}
                  className={`group relative flex flex-col gap-2 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActive
                      ? `${algo.accentBg} ${algo.accentBorder} shadow-lg`
                      : 'bg-[var(--surface-main)] border-[var(--border-main)] hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold transition-colors ${
                        isActive ? algo.accentText : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {algo.label}
                    </span>
                    {isActive && (
                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${algo.activeBg} text-black`}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] leading-relaxed">
                    {algo.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          FILE DROPZONE
      ============================================================ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {isAnalyze ? '01' : '02'} — Select File (Max {MAX_FILE_SIZE_MB} MB)
          </span>
          <CardInfoButton
            title={isAnalyze ? 'Inspect Any File' : 'File Selection & Limits'}
            subtitle={isAnalyze ? 'What can I analyze?' : `Why ${MAX_FILE_SIZE_MB} MB?`}
            sections={
              isAnalyze
                ? [
                    {
                      heading: 'What can be analyzed?',
                      body: 'Any file can be inspected. If it is a ChiperLab .encrypted file, the header will be parsed. If not, only general byte statistics are shown.',
                      icon: 'info',
                    },
                    {
                      heading: 'Read-only inspection',
                      body: 'The inspector never modifies your file. It reads bytes, parses headers, and computes statistics — all in memory.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Use cases',
                      body: '• Verify a .encrypted file is valid before sharing\n• Understand what algorithm was used\n• Learn the structure of encrypted files\n• Debug decryption failures',
                      icon: 'book',
                    },
                  ]
                : [
                    {
                      heading: 'Browser memory limit',
                      body: `Files up to ${MAX_FILE_SIZE_MB} MB are processed entirely in browser memory. This works on all modern devices. Larger files may cause the browser to hang on low-RAM devices.`,
                      icon: 'info',
                    },
                    {
                      heading: 'What file types work?',
                      body: 'Any file type: images, documents, archives, audio, video, and anything else. The algorithm operates on raw bytes.',
                      icon: 'tip',
                    },
                    {
                      heading: 'Never uploaded',
                      body: 'All processing happens locally. Your file is never sent to any server.',
                      icon: 'tip',
                    },
                  ]
            }
          />
        </div>

        <FileDropzone
          onFileSelected={handleFileSelected}
          onClear={handleClearFile}
          selectedFile={file}
          maxSizeMB={MAX_FILE_SIZE_MB}
          disabled={isProcessing || isAnalyzing}
        />

        {file && !isAnalyze && <FilePreview file={file} onRemove={handleClearFile} />}
      </div>

      {/* ============================================================
          KEY CONFIGURATION
      ============================================================ */}
      {!isAnalyze && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${currentAlgo.accentBg} ${currentAlgo.accentBorder} ${currentAlgo.accentText}`}
              >
                <Key className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  03 — Key Configuration
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                  {getAlgorithmLabel(selectedAlgo)}
                </p>
              </div>
            </div>

            <CardInfoButton
              title="Media Key Configuration"
              subtitle="How the key protects your file"
              sections={[
                {
                  heading: 'Auto-generated 256-bit key',
                  body: 'The playground generates a cryptographically random 256-bit key when you select an algorithm. Brute-forcing it would take longer than the age of the universe.',
                  icon: 'info',
                },
                {
                  heading: 'Save this key!',
                  body: 'If you lose the key, you cannot decrypt the file. There is no recovery — that is the point of encryption.',
                  icon: 'warning',
                },
                {
                  heading: 'Custom key (optional)',
                  body: 'You can paste your own 64-character hex key. Recommended: use the auto-generated one.',
                  icon: 'tip',
                },
                {
                  heading: 'The nonce is automatic',
                  body: 'The nonce (IV) is embedded inside the .encrypted file. The decrypt operation reads it automatically.',
                  icon: 'book',
                },
              ]}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {selectedAlgo === 'xor' ? 'XOR Key (64 hex chars)' : 'Hex Key (64 hex chars)'}
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRegenerateKey}
                icon={<Sparkles className="w-3 h-3" />}
                disabled={isProcessing || isAnalyzing}
              >
                Regenerate
              </Button>
            </div>

            <input
              type="text"
              value={keyHex}
              onChange={e => setKeyHex(e.target.value)}
              placeholder="Auto-generated 256-bit key..."
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--surface-secondary)] font-mono text-[11px] text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 break-all"
              disabled={isProcessing || isAnalyzing}
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
              <span>{keyHex.length} / 64 hex characters</span>
              <span
                className={
                  keyHex.length === 64
                    ? 'text-emerald-400 font-bold'
                    : keyHex.length > 0
                    ? 'text-amber-400 font-bold'
                    : 'text-rose-400 font-bold'
                }
              >
                {keyHex.length === 64
                  ? '✓ Valid'
                  : keyHex.length > 0
                  ? '⚠ Incomplete'
                  : '✗ Empty'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          ERROR MESSAGE
      ============================================================ */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-rose-400" strokeWidth={2.5} />
          </div>
          <div className="pt-0.5">
            <span className="font-bold block text-rose-400 mb-1 font-mono text-[11px] tracking-wider uppercase">
              {isEncrypt
                ? 'Encryption Error'
                : isDecrypt
                ? 'Decryption Error'
                : 'Analysis Error'}
            </span>
            <span className="text-[var(--text-secondary)] text-xs leading-relaxed">
              {errorMessage}
            </span>
          </div>
        </div>
      )}

      {/* ============================================================
          PROCESS BUTTON
      ============================================================ */}
      {isAnalyze ? (
        fileBytes && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleProcess}
              disabled={!canProcess}
              icon={
                isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSearch className="w-4 h-4" />
                )
              }
              className="w-full sm:flex-1"
            >
              {isAnalyzing ? 'Analyzing…' : 'Analyze File'}
            </Button>
            {inspectResult && !isAnalyzing && (
              <Button
                variant="outline"
                size="md"
                onClick={handleReset}
                icon={<RotateCcw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Reset
              </Button>
            )}
          </div>
        )
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleProcess}
            disabled={!canProcess}
            icon={
              isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEncrypt ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )
            }
            className="w-full sm:flex-1"
          >
            {isProcessing
              ? isEncrypt
                ? 'Encrypting...'
                : 'Decrypting...'
              : isEncrypt
              ? `Encrypt with ${currentAlgo.label}`
              : `Decrypt with ${currentAlgo.label}`}
          </Button>

          {(file || resultBytes) && (
            <Button
              variant="outline"
              size="md"
              onClick={handleReset}
              icon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto"
              disabled={isProcessing || isAnalyzing}
            >
              Reset Result
            </Button>
          )}
        </div>
      )}

      {/* ============================================================
          ANALYZING OVERLAY — animasi saat analyze
      ============================================================ */}
      {isAnalyzing && file && (
        <AnalyzingOverlay
          fileName={file.name}
          fileSize={formatBytes(file.size)}
        />
      )}

      {/* ============================================================
          PROGRESS BAR — encrypt/decrypt
      ============================================================ */}
      {isProcessing && (
        <div className="space-y-2 p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              {isEncrypt ? 'Encrypting file...' : 'Decrypting file...'}
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-[var(--surface-main)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ============================================================
          RESULT CARD
      ============================================================ */}
      {!isAnalyze && resultBytes && resultMeta && (
        <FileResultCard
          outputBytes={resultBytes}
          originalFileName={file?.name || 'file'}
          mode={isEncrypt ? 'encrypt' : 'decrypt'}
          inputSize={resultMeta.inputSize}
          durationMs={resultMeta.durationMs}
          algorithmLabel={getAlgorithmLabel(selectedAlgo)}
          nonceHex={isEncrypt ? resultMeta.nonceHex : undefined}
        />
      )}

      {/* ============================================================
          INSPECTOR RESULT
      ============================================================ */}
      {isAnalyze && !isAnalyzing && inspectResult && file && (
        <FileInspector
          result={inspectResult}
          fileName={file.name}
          fileSize={file.size}
        />
      )}

      {/* ============================================================
          INFO CARD
      ============================================================ */}
      {isAnalyze ? (
        <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileSearch className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              What Does the Inspector Show?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                Header
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Magic bytes, version, algorithm, nonce — all decoded.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block">
                Statistics
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Shannon entropy, unique bytes, byte distribution.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                Hex Viewer
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Byte-by-byte view with color-coded sections.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                Diagnosis
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Auto-verdict: valid, corrupted, or unknown.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-purple-400">Read-only.</strong> The inspector never
              modifies your file. All parsing happens in browser memory.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              What Happens to Your File?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                1. Read
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                File bytes are read into browser memory via{' '}
                <code className="text-cyan-300 font-mono text-[10px]">FileReader</code>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                2. Transform
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Every byte is {isDecrypt ? 'decrypted' : 'encrypted'} by {currentAlgo.label}.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                3. Download
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Output wrapped in a <code className="text-cyan-300 font-mono text-[10px]">Blob</code>{' '}
                and downloaded.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-cyan-400">100% client-side.</strong> Your file never leaves
              your browser. Zero network round-trips.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}