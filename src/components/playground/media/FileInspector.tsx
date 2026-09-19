import { useState } from 'react';
import {
  FileSearch,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  Hash,
  Activity,
  Binary,
  Copy,
  Check,
  BookOpen,
  Cpu,
  Fingerprint,
  BarChart3,
} from 'lucide-react';
import { HexViewer } from './HexViewer';
import { CardInfoButton } from '../../common/CardInfoButton';
import { Button } from '../../common/Button';
import {
  InspectResult,
  formatBytes,
} from '../../../crypto/media/inspectFile';

interface FileInspectorProps {
  result: InspectResult;
  fileName: string;
  fileSize: number;
}

export function FileInspector({ result, fileName, fileSize }: FileInspectorProps) {
  const { header, statistics } = result;
  const [copiedNonce, setCopiedNonce] = useState(false);

  const handleCopyNonce = () => {
    if (!header.nonceHex) return;
    navigator.clipboard.writeText(header.nonceHex);
    setCopiedNonce(true);
    setTimeout(() => setCopiedNonce(false), 2000);
  };

  // Determine status color scheme
  const isChiperLab = header.isChiperLabFile;
  const isValid = header.valid;

  const statusColor = isValid
    ? 'emerald'
    : isChiperLab
    ? 'amber'
    : 'rose';

  const statusConfig = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      Icon: ShieldCheck,
      label: 'Valid Encrypted File',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      Icon: AlertTriangle,
      label: 'Partially Valid',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      Icon: ShieldAlert,
      label: 'Not a ChiperLab File',
    },
  }[statusColor];

  const StatusIcon = statusConfig.Icon;

  // Entropy color
  const entropyColor =
    statistics.entropy >= 7.9
      ? 'text-emerald-400'
      : statistics.entropy >= 7.0
      ? 'text-cyan-400'
      : statistics.entropy >= 5.0
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div className="space-y-5">
      {/* ============================================================
          STATUS BANNER
      ============================================================ */}
      <div className={`p-5 rounded-2xl ${statusConfig.bg} border ${statusConfig.border} shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={`shrink-0 w-10 h-10 rounded-xl ${statusConfig.bg} border ${statusConfig.border} flex items-center justify-center ${statusConfig.text}`}>
            <StatusIcon className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`text-sm font-bold ${statusConfig.text}`}>
                {statusConfig.label}
              </h3>
              {isValid && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {header.diagnosis}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          FILE INFO CARD
      ============================================================ */}
      <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileSearch className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                File Information
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                {fileName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Total Size
            </span>
            <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
              {formatBytes(fileSize)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Header
            </span>
            <span className="text-sm font-mono font-bold text-cyan-400">
              19 bytes
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Payload
            </span>
            <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
              {formatBytes(header.payloadSize)}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          HEADER BREAKDOWN
      ============================================================ */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Binary className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Header Breakdown
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                First 19 bytes decoded
              </p>
            </div>
          </div>
          <CardInfoButton
            title="ChiperLab File Header"
            subtitle="Understanding the 19-byte structure"
            sections={[
              {
                heading: 'What is a file header?',
                body: 'Every ChiperLab .encrypted file begins with a 19-byte header that tells the decryption algorithm:\n\n• How to identify the file (magic bytes)\n• Which algorithm was used\n• Which nonce to feed into the cipher\n\nThe rest of the file (after byte 19) is pure ciphertext.',
                icon: 'info',
              },
              {
                heading: 'Byte layout',
                body: 'Byte 0-3: Magic "CLEN" (identifies ChiperLab file)\nByte 4: Version (currently 0x01)\nByte 5: Algorithm (0x01=AES-GCM, 0x02=ChaCha20, 0x03=XOR)\nByte 6: Nonce length (always 0x0C = 12 bytes)\nByte 7-18: Nonce (12 random bytes)\n\nTotal: 19 bytes.',
                icon: 'book',
              },
              {
                heading: 'Why include a magic header?',
                body: 'Without a magic header, the decryption algorithm could not tell:\n\n• If the file is really a ChiperLab file\n• Which algorithm to use (AES vs ChaCha20 vs XOR)\n• What nonce value the cipher expects\n\nThe magic header makes the file self-describing.',
                icon: 'tip',
              },
              {
                heading: 'Can an attacker fake the header?',
                body: 'Yes — the header is not secret and can be crafted by anyone. But this is fine: security depends entirely on the encryption key, not on the header contents. Faking the header just means the decrypt operation will fail with an authentication error.',
                icon: 'warning',
              },
            ]}
          />
        </div>

        <div className="space-y-2">
          {/* Magic */}
          <HeaderRow
            label="Magic Bytes"
            hint="Identifies this as a ChiperLab file"
            value={
              header.magicAscii
                ? `"${header.magicAscii}" (${header.magicHex})`
                : '—'
            }
            valueColor={header.isChiperLabFile ? 'text-emerald-400' : 'text-rose-400'}
            status={header.isChiperLabFile ? 'ok' : 'error'}
            expected="CLEN (43 4C 45 4E)"
          />

          {/* Version */}
          <HeaderRow
            label="Version"
            hint="File format version"
            value={header.version.toString()}
            valueColor={header.version === 1 ? 'text-emerald-400' : 'text-amber-400'}
            status={header.version === 1 ? 'ok' : 'warn'}
            expected="1"
          />

          {/* Algorithm */}
          <HeaderRow
            label="Algorithm"
            hint="Which encryption algorithm was used"
            value={`${header.algorithmLabel} (0x${header.algorithmByte.toString(16).padStart(2, '0')})`}
            valueColor={header.algorithm ? 'text-cyan-400' : 'text-rose-400'}
            status={header.algorithm ? 'ok' : 'error'}
            expected="0x01 AES · 0x02 ChaCha20 · 0x03 XOR"
          />

          {/* Nonce Length */}
          <HeaderRow
            label="Nonce Length"
            hint="Size of the nonce field"
            value={`${header.nonceLength} bytes`}
            valueColor={header.nonceLength === 12 ? 'text-emerald-400' : 'text-rose-400'}
            status={header.nonceLength === 12 ? 'ok' : 'error'}
            expected="12 bytes"
          />

          {/* Nonce Value */}
          {header.nonceHex && (
            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] block">
                    Nonce / IV
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] block truncate">
                    Random 12-byte value, unique per encryption
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNonce}
                  className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {copiedNonce ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-2 rounded-lg bg-[#0A0C10] border border-[#1E222B]">
                <p className="text-[11px] font-mono text-purple-300 break-all leading-relaxed">
                  {header.nonceHex}
                </p>
              </div>
            </div>
          )}

          {/* Payload */}
          <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] block">
                  Ciphertext Payload
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] block truncate">
                  Encrypted data + authentication tag
                </span>
              </div>
              <span className="shrink-0 text-xs font-mono font-bold text-cyan-400">
                {formatBytes(header.payloadSize)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Byte Statistics
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                Entropy + distribution analysis
              </p>
            </div>
          </div>
          <CardInfoButton
            title="Byte Statistics Explained"
            subtitle="How we detect encryption"
            sections={[
              {
                heading: 'Shannon entropy',
                body: 'Entropy measures how unpredictable each byte is, from 0 (completely predictable) to 8 (perfectly random).\n\n• Encrypted files: ~7.9–8.0\n• Compressed files: ~7.5–8.0\n• English text: ~4.0–5.0\n• Source code: ~5.0–6.0\n\nIf the entropy is near 8, the file is almost certainly encrypted or compressed.',
                icon: 'book',
              },
              {
                heading: 'Unique bytes',
                body: 'How many different byte values (0–255) appear in the file. Encrypted files typically have 256 (all possible values), while small text files may have only 60–80 (letters, spaces, punctuation).',
                icon: 'info',
              },
              {
                heading: 'Most common byte',
                body: 'In plaintext, spaces (0x20) and the letter "e" (0x65) dominate. In ciphertext, all bytes are equally likely — no single byte should stand out significantly.',
                icon: 'tip',
              },
              {
                heading: 'Zero bytes',
                body: 'Plaintext often contains many 0x00 bytes (null terminators, padding). Encrypted output has almost none — 0x00 appears with the same frequency as any other byte (~0.4%).',
                icon: 'info',
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Entropy */}
          <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Entropy
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-mono font-bold ${entropyColor}`}>
                {statistics.entropy.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">/ 8.0</span>
            </div>
            <span className="text-[9px] font-mono text-[var(--text-secondary)] leading-tight block mt-1">
              {statistics.entropyLabel}
            </span>
          </div>

          {/* Unique bytes */}
          <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Unique Bytes
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-mono font-bold text-cyan-400">
                {statistics.uniqueBytes}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">/ 256</span>
            </div>
            <span className="text-[9px] font-mono text-[var(--text-secondary)] leading-tight block mt-1">
              {statistics.uniqueBytes >= 250
                ? 'Full coverage ✓'
                : statistics.uniqueBytes >= 150
                ? 'Mostly uniform'
                : 'Limited alphabet'}
            </span>
          </div>

          {/* Most common byte */}
          <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Top Byte
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-mono font-bold text-cyan-400">
                0x{statistics.mostCommonByteHex}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[var(--text-secondary)] leading-tight block mt-1">
              {statistics.mostCommonByteCount}× ({((statistics.mostCommonByteCount / statistics.totalBytes) * 100).toFixed(2)}%)
            </span>
          </div>

          {/* Zero bytes */}
          <div className="p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] col-span-2 sm:col-span-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  Zero Bytes (0x00)
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {statistics.zeroBytesCount} zero bytes ({statistics.zeroBytesPercent}%)
                </span>
              </div>
              <span
                className={`text-xs font-mono font-bold ${
                  statistics.zeroBytesPercent < 1
                    ? 'text-emerald-400'
                    : statistics.zeroBytesPercent < 5
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {statistics.zeroBytesPercent < 1
                  ? '✓ Normal'
                  : statistics.zeroBytesPercent < 5
                  ? '⚠ Slightly high'
                  : '✗ Suspicious'}
              </span>
            </div>
          </div>
        </div>

        {/* Interpretation hint */}
        <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            <span className="font-bold text-cyan-400">Interpretation:</span>{' '}
            {statistics.entropy >= 7.9 && statistics.uniqueBytes >= 250
              ? 'The byte distribution looks near-random. This is exactly what we expect from properly encrypted data.'
              : statistics.entropy >= 7.0
              ? 'High entropy suggests the data is either encrypted or compressed. Typical for ciphertext.'
              : 'Low entropy suggests the file may not be encrypted, or is very small.'}
          </div>
        </div>
      </div>

      {/* ============================================================
          HEX VIEWER
      ============================================================ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Hash className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Hex Viewer
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                Byte-level file content
              </p>
            </div>
          </div>
          <CardInfoButton
            title="Hex Viewer — How to Read"
            subtitle="Understanding hex representation"
            sections={[
              {
                heading: 'What is a hex dump?',
                body: 'A hex viewer shows each byte of a file as two hexadecimal digits, grouped into rows of 16 bytes. The "Offset" column shows the byte position (in hex). The "ASCII" column shows a printable character if the byte is readable, otherwise a dot (.).',
                icon: 'info',
              },
              {
                heading: 'Colored bytes',
                body: '• Cyan: magic bytes "CLEN" (0-3) + version/algo/length (4-6)\n• Purple: nonce (7-18)\n• Gray/white: ciphertext payload (19+)',
                icon: 'tip',
              },
              {
                heading: 'Can I copy the hex?',
                body: 'Yes — click "Copy hex" in the top-right corner to copy the entire file as a space-separated hex string. Useful for pasting into other tools.',
                icon: 'book',
              },
              {
                heading: 'Why does it look random?',
                body: 'After byte 19, every byte appears random. This is the whole point of encryption — the ciphertext must be indistinguishable from random noise. If you saw patterns, the encryption would be weak.',
                icon: 'tip',
              },
            ]}
          />
        </div>

        <HexViewer
          bytes={result.originalBytes}
          headerSize={19}
          maxHeight={420}
          batchSize={200}
        />
      </div>
    </div>
  );
}

/* ============================================================
   HeaderRow — reusable header field row
============================================================ */
interface HeaderRowProps {
  label: string;
  hint: string;
  value: string;
  valueColor: string;
  status: 'ok' | 'warn' | 'error';
  expected: string;
}

function HeaderRow({ label, hint, value, valueColor, status, expected }: HeaderRowProps) {
  const statusStyles = {
    ok: 'text-emerald-400',
    warn: 'text-amber-400',
    error: 'text-rose-400',
  }[status];

  const statusIcon = {
    ok: '✓',
    warn: '⚠',
    error: '✗',
  }[status];

  return (
    <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {label}
            </span>
            <span className={`text-[10px] font-mono font-bold ${statusStyles}`}>
              {statusIcon}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
            {hint}
          </span>
        </div>
        <span className={`text-xs font-mono font-bold text-right ${valueColor} shrink-0`}>
          {value}
        </span>
      </div>
      <div className="text-[9px] font-mono text-[var(--text-secondary)] pt-1 border-t border-[var(--border-main)]">
        Expected: <span className="text-[var(--text-primary)]">{expected}</span>
      </div>
    </div>
  );
}