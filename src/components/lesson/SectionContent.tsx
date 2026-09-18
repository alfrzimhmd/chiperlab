import React from 'react';

/* ============================================================
   InlineText — render **bold** and `code` in any string.
   Reusable across paragraphs, list items, table cells, etc.
============================================================ */
interface InlineTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

export function InlineText({ text, className = '', as = 'span' }: InlineTextProps) {
  const rendered = renderInline(text);
  const Tag = as as any;

  if (as === 'span') {
    return <span className={className}>{rendered}</span>;
  }
  return <Tag className={className}>{rendered}</Tag>;
}

/**
 * Process inline formatting:
 * - **bold** → <strong>
 * - `code` → <code>
 * - *italic* → <em> (optional, single asterisk)
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return text;

  // Split by `code` first (highest priority)
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, partIdx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code
          key={`code-${partIdx}`}
          className="px-1.5 py-0.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-main)] font-mono text-[0.9em] text-cyan-400"
        >
          {code}
        </code>
      );
    }

    // Process bold (**text**) and italic (*text*) inside non-code segments
    return processBoldItalic(part, partIdx);
  });
}

function processBoldItalic(text: string, partIdx: number): React.ReactNode {
  // Match **bold** first (greedy safe), then *italic*
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((boldPart, boldIdx) => {
    if (boldPart.startsWith('**') && boldPart.endsWith('**') && boldPart.length > 4) {
      return (
        <strong
          key={`bold-${partIdx}-${boldIdx}`}
          className="font-semibold text-[var(--text-primary)]"
        >
          {boldPart.slice(2, -2)}
        </strong>
      );
    }

    // Process italic (*text*) inside remaining
    return processItalic(boldPart, `${partIdx}-${boldIdx}`);
  });
}

function processItalic(text: string, keyPrefix: string): React.ReactNode {
  const italicParts = text.split(/(\*[^*]+\*)/g);

  return italicParts.map((italicPart, italicIdx) => {
    if (
      italicPart.startsWith('*') &&
      italicPart.endsWith('*') &&
      !italicPart.startsWith('**') &&
      italicPart.length > 2
    ) {
      return (
        <em
          key={`italic-${keyPrefix}-${italicIdx}`}
          className="italic text-[var(--text-secondary)]"
        >
          {italicPart.slice(1, -1)}
        </em>
      );
    }
    return (
      <React.Fragment key={`text-${keyPrefix}-${italicIdx}`}>
        {italicPart}
      </React.Fragment>
    );
  });
}

/* ============================================================
   SectionContent — full parser for content with tables
============================================================ */
interface SectionContentProps {
  content: string;
}

/**
 * Parses simple Markdown-style content:
 * - Tables (| a | b |)
 * - Bold (**text**)
 * - Italic (*text*)
 * - Inline code (`code`)
 * - Line breaks (\n)
 */
export function SectionContent({ content }: SectionContentProps) {
  // Split by lines
  const lines = content.split('\n');

  type Block =
    | { type: 'paragraph'; lines: string[] }
    | { type: 'table'; rows: string[][] };

  const blocks: Block[] = [];
  let buffer: string[] = [];
  let tableBuffer: string[] = [];

  const flushParagraph = () => {
    if (buffer.length > 0) {
      blocks.push({ type: 'paragraph', lines: buffer });
      buffer = [];
    }
  };

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      const rows: string[][] = [];

      tableBuffer.forEach(line => {
        // Skip the separator line (| --- | --- |)
        if (/^\s*\|[\s\-:|]+\|\s*$/.test(line)) {
          return;
        }

        const cells = line
          .split('|')
          .slice(1, -1)
          .map(c => c.trim());

        if (cells.length > 0) {
          rows.push(cells);
        }
      });

      if (rows.length > 0) {
        blocks.push({ type: 'table', rows });
      }
      tableBuffer = [];
    }
  };

  lines.forEach(line => {
    const trimmed = line.trim();
    const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');

    if (isTableRow) {
      flushParagraph();
      tableBuffer.push(line);
    } else {
      flushTable();
      buffer.push(line);
    }
  });

  flushParagraph();
  flushTable();

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIdx) => {
        if (block.type === 'paragraph') {
          const text = block.lines.join('\n');
          return (
            <p
              key={blockIdx}
              className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"
            >
              {renderInline(text)}
            </p>
          );
        }

        const [header, ...body] = block.rows;
        return (
          <div key={blockIdx} className="overflow-x-auto -mx-1 px-1 my-4">
            <table className="w-full text-xs sm:text-sm border-collapse rounded-xl overflow-hidden border border-[var(--border-main)]">
              <thead>
                <tr className="bg-[var(--surface-secondary)]">
                  {header.map((cell, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2.5 text-left font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-[var(--border-main)]"
                    >
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={
                      rowIdx !== body.length - 1
                        ? 'border-b border-[var(--border-main)]'
                        : ''
                    }
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-3 py-2.5 text-[var(--text-secondary)] leading-relaxed align-top"
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}