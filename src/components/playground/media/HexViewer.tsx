import { useMemo, useState, useEffect } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';
import { buildHexLines, HexLine } from '../../../crypto/media/inspectFile';

interface HexViewerProps {
  bytes: Uint8Array;
  /** How many bytes per row (default 16) */
  bytesPerLine?: number;
  /** Highlight the first N bytes as "header" */
  headerSize?: number;
  /** Tinggi maksimum area scroll (default 420px) */
  maxHeight?: number;
  /** Baris yang dirender per batch (default 200) */
  batchSize?: number;
}

export function HexViewer({
  bytes,
  bytesPerLine = 16,
  headerSize = 19,
  maxHeight = 420,
  batchSize = 200,
}: HexViewerProps) {
  const [copied, setCopied] = useState(false);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [isBuilding, setIsBuilding] = useState(true);

  const allLines = useMemo<HexLine[]>(
    () => buildHexLines(bytes, bytesPerLine, undefined, headerSize),
    [bytes, bytesPerLine, headerSize]
  );

  useEffect(() => {
    setIsBuilding(true);
    const t = setTimeout(() => setIsBuilding(false), 0);
    return () => clearTimeout(t);
  }, [allLines]);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [bytes, batchSize]);

  const totalLines = allLines.length;
  const visibleLines = allLines.slice(0, visibleCount);
  const hasMore = visibleCount < totalLines;

  const handleCopy = () => {
    const fullHex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
    navigator.clipboard.writeText(fullHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowMore = () => {
    setVisibleCount(v => Math.min(v + batchSize, totalLines));
  };

  return (
    <div className="rounded-xl border border-[var(--border-main)] bg-[#0A0C10] overflow-hidden">
      {/* ============ Header bar ============ */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E222B] bg-[#0E1116]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Hex View
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            {bytes.length.toLocaleString()} bytes
          </span>
          {!isBuilding && (
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              · {totalLines.toLocaleString()} lines
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={isBuilding}
          className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Copy full file as hex"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy hex
            </>
          )}
        </button>
      </div>

      {/* ============ Hex content ============ */}
      <div className="overflow-auto" style={{ maxHeight: `${maxHeight}px` }}>
        {isBuilding ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
            <span className="text-[12px] font-mono text-[var(--text-secondary)]">
              Building hex view…
            </span>
          </div>
        ) : (
          <table
            className="w-full border-collapse font-mono text-[13px] leading-[1.7]"
            style={{ fontVariantLigatures: 'none' }}
          >
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-[#1E222B] bg-[#0E1116]">
                <th className="text-left pl-5 pr-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] font-normal w-[110px]">
                  Offset
                </th>
                <th className="text-left pl-10 pr-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] font-normal">
                  Hex Bytes
                </th>
                <th className="text-left pl-10 pr-5 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] font-normal w-[180px]">
                  ASCII
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleLines.map(line => {
                // Kelompokkan byte menjadi grup 2-byte (seperti xxd)
                // Contoh: [43 4c] [45 4e] [01 01] ...
                const groups: {
                  bytes: { hex: string; offset: number; isPadding: boolean }[];
                }[] = [];

                for (let i = 0; i < line.hexBytes.length; i += 2) {
                  const groupBytes = [];
                  for (let j = 0; j < 2; j++) {
                    const idx = i + j;
                    const hex = line.hexBytes[idx];
                    const isPadding = hex === '  ';
                    groupBytes.push({
                      hex,
                      offset: line.offset + idx,
                      isPadding,
                    });
                  }
                  groups.push({ bytes: groupBytes });
                }

                return (
                  <tr
                    key={line.offset}
                    className={`border-b border-[#12151B] ${
                      line.isHeader ? 'bg-cyan-500/[0.04]' : ''
                    }`}
                  >
                    {/* Offset — dengan titik dua seperti xxd */}
                    <td className="pl-5 pr-3 py-1.5 text-slate-500 whitespace-nowrap align-top tabular-nums">
                      {line.offsetHex}:
                    </td>

                    {/* Hex bytes — grup 2-byte, digeser ke tengah */}
                    <td className="pl-10 pr-3 py-1.5 whitespace-nowrap align-top">
                      {groups.map((group, gIdx) => (
                        <span key={gIdx}>
                          {group.bytes.map((b, bIdx) => {
                            if (b.isPadding) {
                              return (
                                <span
                                  key={bIdx}
                                  className="text-transparent select-none"
                                >
                                  --
                                </span>
                              );
                            }

                            const isHeaderByte = b.offset < headerSize;
                            const isNonceByte =
                              b.offset >= 7 && b.offset < 7 + 12;

                            let colorClass = 'text-slate-300';
                            if (isHeaderByte) {
                              colorClass = isNonceByte
                                ? 'text-purple-300'
                                : 'text-cyan-300';
                            }

                            return (
                              <span
                                key={bIdx}
                                className={colorClass}
                                title={`Offset ${b.offset} (0x${b.offset
                                  .toString(16)
                                  .padStart(4, '0')})`}
                              >
                                {b.hex}
                              </span>
                            );
                          })}
                          {/* Spasi antar grup (2 byte) */}
                          {gIdx < groups.length - 1 && (
                            <span className="select-none">&nbsp;</span>
                          )}
                        </span>
                      ))}
                    </td>

                    {/* ASCII */}
                    <td className="pl-10 pr-5 py-1.5 text-slate-400 whitespace-nowrap align-top">
                      {line.ascii}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ============ Footer / load more ============ */}
      {!isBuilding && hasMore && (
        <div className="flex items-center justify-center py-2.5 border-t border-[#1E222B] bg-[#0E1116]">
          <button
            type="button"
            onClick={handleShowMore}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Load more ({(totalLines - visibleCount).toLocaleString()} lines remaining)
          </button>
        </div>
      )}

      {/* ============ Legend ============ */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 border-t border-[#1E222B] bg-[#0E1116] text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-300" />
          <span className="text-[var(--text-secondary)]">Magic (4B)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-300/60" />
          <span className="text-[var(--text-secondary)]">Version/Algo/Len (3B)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-300" />
          <span className="text-[var(--text-secondary)]">Nonce (12B)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
          <span className="text-[var(--text-secondary)]">Ciphertext</span>
        </div>
      </div>
    </div>
  );
}