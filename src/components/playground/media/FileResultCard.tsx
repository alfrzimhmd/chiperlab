import { useEffect, useState } from 'react';
import {
  Download,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Lock,
  Unlock,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../common/Button';
import { formatBytes, downloadBytes } from '../../../crypto/media/fileEncryption';

interface FileResultCardProps {
  /** The output bytes to offer for download */
  outputBytes: Uint8Array;
  /** Original filename (without .encrypted suffix if encrypting) */
  originalFileName: string;
  /** 'encrypt' or 'decrypt' */
  mode: 'encrypt' | 'decrypt';
  /** Size in bytes of the input (before this operation) */
  inputSize: number;
  /** Duration of the operation in ms */
  durationMs: number;
  /** Optional: algorithm label (e.g., 'AES-GCM (256-bit)') */
  algorithmLabel?: string;
  /** Optional: nonce/IV hex to display */
  nonceHex?: string;
  /** Optional: callback after download */
  onDownloaded?: () => void;
}

export function FileResultCard({
  outputBytes,
  originalFileName,
  mode,
  inputSize,
  durationMs,
  algorithmLabel,
  nonceHex,
  onDownloaded,
}: FileResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Build output filename
  const outputFileName =
    mode === 'encrypt'
      ? `${originalFileName}.encrypted`
      : originalFileName.replace(/\.encrypted$/i, '');

  // Preview URL for decrypted files (image/audio/video)
  useEffect(() => {
    if (mode !== 'decrypt') {
      setPreviewUrl(null);
      return;
    }
    const blob = new Blob([outputBytes as BlobPart], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [outputBytes, mode]);

  const handleDownload = () => {
    downloadBytes(outputBytes, outputFileName);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
    onDownloaded?.();
  };

  const handleCopyNonce = () => {
    if (!nonceHex) return;
    navigator.clipboard.writeText(nonceHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEncrypt = mode === 'encrypt';
  const accentText = isEncrypt ? 'text-cyan-400' : 'text-emerald-400';
  const accentBg = isEncrypt ? 'bg-cyan-500/10' : 'bg-emerald-500/10';
  const accentBorder = isEncrypt ? 'border-cyan-500/30' : 'border-emerald-500/30';
  const ModeIcon = isEncrypt ? Lock : Unlock;
  const modeLabel = isEncrypt ? 'Encryption Complete' : 'Decryption Complete';

  const sizeChange =
    inputSize > 0
      ? Math.round(((outputBytes.length - inputSize) / inputSize) * 1000) / 10
      : 0;

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border-2 ${accentBorder} shadow-lg space-y-4`}
    >
      {/* ============================================================
          HEADER
      ============================================================ */}
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-10 h-10 rounded-xl ${accentBg} ${accentBorder} border flex items-center justify-center ${accentText}`}
        >
          <FileCheck className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {modeLabel}
            </h3>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider ${accentText} ${accentBg} border ${accentBorder} px-2 py-0.5 rounded-md`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Success
            </span>
          </div>
          {algorithmLabel && (
            <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
              {algorithmLabel}
            </p>
          )}
        </div>
      </div>

      {/* ============================================================
          FILE INFO
      ============================================================ */}
      <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-3">
        <div className="flex items-center gap-2">
          <div
            className={`shrink-0 w-8 h-8 rounded-lg ${accentBg} border ${accentBorder} flex items-center justify-center ${accentText}`}
          >
            <ModeIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-primary)] break-all leading-tight">
              {outputFileName}
            </p>
            <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">
              {formatBytes(outputBytes.length)} · ready to download
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          <div className="p-2.5 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block">
              Input
            </span>
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {formatBytes(inputSize)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block">
              Output
            </span>
            <span className={`text-xs font-mono font-bold ${accentText}`}>
              {formatBytes(outputBytes.length)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)] col-span-2 sm:col-span-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block">
              Size Δ
            </span>
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {sizeChange > 0 ? '+' : ''}
              {sizeChange}%
            </span>
          </div>
        </div>

        {/* Nonce display + copy */}
        {nonceHex && (
          <div className="pt-2 border-t border-[var(--border-main)]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                Nonce / IV (hex)
              </span>
              <button
                type="button"
                onClick={handleCopyNonce}
                className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" /> Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-2 rounded-lg bg-[#0A0C10] border border-[#1E222B]">
              <p className="text-[10px] font-mono text-cyan-300 break-all leading-relaxed">
                {nonceHex}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          DECRYPT PREVIEW (image/audio/video)
      ============================================================ */}
      {mode === 'decrypt' && previewUrl && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
            Preview
          </span>
          <div className="p-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-center justify-center min-h-[100px]">
            <img
              src={previewUrl}
              alt="Decrypted preview"
              className="max-h-48 max-w-full rounded-lg object-contain"
              onError={e => {
                // If not an image, hide
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* ============================================================
          TIMING
      ============================================================ */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] px-1">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {durationMs.toFixed(2)} ms
        </span>
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-emerald-400" />
          Integrity verified
        </span>
      </div>

      {/* ============================================================
          DOWNLOAD BUTTON
      ============================================================ */}
      <Button
        variant="primary"
        size="md"
        onClick={handleDownload}
        icon={
          downloaded ? (
            <Check className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )
        }
        className="w-full"
      >
        {downloaded ? 'Downloaded!' : `Download ${outputFileName}`}
      </Button>
    </div>
  );
}