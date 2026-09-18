import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language?: string;
  caption?: string;
  /** Optional background color override. Default: '#0A0C10' */
  background?: string;
}

/**
 * Languages that should NOT use syntax highlighting.
 * These will be rendered as plain text with white color.
 */
const PLAIN_TEXT_LANGUAGES = new Set([
  'text',
  'txt',
  'plain',
  'plaintext',
  '',
]);

/**
 * Normalize language identifiers to what prism-react-renderer expects.
 */
function normalizeLanguage(lang: string): string {
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    bash: 'bash',
    yaml: 'yaml',
    yml: 'yaml',
    json: 'json',
    html: 'markup',
    xml: 'markup',
  };
  return map[lang.toLowerCase()] || lang.toLowerCase();
}

/**
 * Check if language should be rendered as plain text (no syntax highlighting).
 */
function isPlainText(lang: string): boolean {
  return PLAIN_TEXT_LANGUAGES.has(lang.toLowerCase().trim());
}

/**
 * CodeBlock with syntax highlighting.
 *
 * - Plain text (text, txt, plain) → rendered as plain white text
 * - Recognized languages (ts, js, bash, python) → syntax highlighted
 * - Background always matches ChiperLab theme (#0A0C10)
 */
export function CodeBlock({
  code,
  language = 'text',
  background = '#0A0C10',
}: CodeBlockProps) {
  const trimmedCode = code.trim();

    // ============================================================
    // PLAIN TEXT MODE — no highlighting, just white monospace
    // ============================================================
    if (isPlainText(language)) {
    return (
        <pre
        className="p-4 text-[11px] sm:text-xs font-mono overflow-x-auto text-slate-200"
        style={{
            backgroundColor: background,
            margin: 0,
            // Paksa font mono eksplisit + tab size 2 + line-height lega
            fontFamily:
            "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            tabSize: 2,
            lineHeight: 1.6,
            whiteSpace: 'pre',
            // Mencegah box-drawing char collapse
            fontVariantLigatures: 'none',
        }}
        >
        <code className="block">{trimmedCode}</code>
        </pre>
    );
    }

  // ============================================================
  // SYNTAX HIGHLIGHTED MODE
  // ============================================================
  const normalizedLang = normalizeLanguage(language);

  return (
    <Highlight theme={themes.vsDark} code={trimmedCode} language={normalizedLang}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre
          className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"
          style={{
            backgroundColor: background,
            margin: 0,
          }}
        >
          <code className="block">
            {tokens.map((line, lineIdx) => {
              const lineProps = getLineProps({ line });
              return (
                <div key={lineIdx} {...lineProps} className="table-row">
                  <span className="table-cell pr-4 select-none text-right text-[10px] text-slate-600 w-8">
                    {lineIdx + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, tokenIdx) => (
                      <span key={tokenIdx} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      )}
    </Highlight>
  );
}