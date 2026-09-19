import { useState } from 'react';
import {
  BookOpen,
  Workflow,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Hash,
  Gauge,
  Sparkles,
  Target,
  Zap,
  Lock,
} from 'lucide-react';

export type FeatureGuideTab =
  | 'frequency'
  | 'caesar-brute'
  | 'xor-brute'
  | 'vigenere-crack'
  | 'hash-id';

type AccentKey = 'cyan' | 'rose' | 'amber' | 'emerald' | 'purple';

interface GuideSection {
  id: string;
  icon: typeof BookOpen;
  label: string;
  content: React.ReactNode;
}

interface FeatureGuideProps {
  tab: FeatureGuideTab;
  accent: AccentKey;
}

// ============================================================
// Accent color helper
// ============================================================
const ACCENT: Record<
  AccentKey,
  {
    text: string;
    bg: string;
    border: string;
    dot: string;
    strong: string;
    softBg: string;
    gradient: string;
  }
> = {
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    dot: 'bg-cyan-400',
    strong: 'text-cyan-400',
    softBg: 'bg-cyan-500/5',
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
    strong: 'text-rose-400',
    softBg: 'bg-rose-500/5',
    gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    strong: 'text-amber-400',
    softBg: 'bg-amber-500/5',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    strong: 'text-emerald-400',
    softBg: 'bg-emerald-500/5',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
    strong: 'text-purple-400',
    softBg: 'bg-purple-500/5',
    gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
  },
};

// ============================================================
// Section theme (per-section color for visual variety)
// ============================================================
const SECTION_THEME: Record<
  string,
  { text: string; border: string; softBg: string; dot: string; label: string }
> = {
  what: {
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    softBg: 'bg-blue-500/[0.06]',
    dot: 'bg-blue-400',
    label: 'Concept',
  },
  how: {
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    softBg: 'bg-cyan-500/[0.06]',
    dot: 'bg-cyan-400',
    label: 'Algorithm',
  },
  example: {
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    softBg: 'bg-purple-500/[0.06]',
    dot: 'bg-purple-400',
    label: 'Demonstration',
  },
  limits: {
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    softBg: 'bg-amber-500/[0.06]',
    dot: 'bg-amber-400',
    label: 'Boundaries',
  },
  when: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    softBg: 'bg-emerald-500/[0.06]',
    dot: 'bg-emerald-400',
    label: 'Use Cases',
  },
};

// ============================================================
// Reusable sub-components
// ============================================================
function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 group/step">
      <span className="shrink-0 w-7 h-7 rounded-lg bg-[var(--surface-main)] border-2 border-cyan-500/30 text-[11px] font-mono font-bold flex items-center justify-center text-cyan-400 group-hover/step:scale-110 group-hover/step:border-cyan-500/60 transition-all duration-200">
        {num}
      </span>
      <span className="pt-1 text-[12px]">{children}</span>
    </li>
  );
}

function Bullet({
  children,
  accent = 'default',
}: {
  children: React.ReactNode;
  accent?: 'default' | 'warn' | 'good' | 'bad';
}) {
  const dotClass =
    accent === 'warn'
      ? 'bg-amber-400'
      : accent === 'good'
      ? 'bg-emerald-400'
      : accent === 'bad'
      ? 'bg-rose-400'
      : 'bg-[var(--text-secondary)]';

  return (
    <li className="flex items-start gap-2.5">
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass} mt-2 shrink-0`} />
      <span>{children}</span>
    </li>
  );
}

function HighlightBox({
  children,
  accent,
  icon: Icon,
}: {
  children: React.ReactNode;
  accent: AccentKey;
  icon: typeof Sparkles;
}) {
  const colors = ACCENT[accent];
  return (
    <div
      className={`relative p-3.5 rounded-xl ${colors.softBg} border ${colors.border} overflow-hidden`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} pointer-events-none`}
      />
      <div className="relative flex items-start gap-2.5">
        <div
          className={`shrink-0 w-6 h-6 rounded-lg border ${colors.border} bg-[var(--surface-main)] flex items-center justify-center ${colors.text}`}
        >
          <Icon className="w-3 h-3" strokeWidth={2.5} />
        </div>
        <div className={`text-[12px] leading-relaxed ${colors.text} pt-0.5`}>{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// Section Card wrapper — reusable
// ============================================================
function SectionCard({
  section,
  children,
  tall = false,
}: {
  section: GuideSection;
  children: React.ReactNode;
  tall?: boolean;
}) {
  const Icon = section.icon;
  const theme = SECTION_THEME[section.id] ?? SECTION_THEME.what;

  return (
    <div
      className={`relative rounded-xl border border-[var(--border-main)] bg-[var(--surface-main)] overflow-hidden flex flex-col ${
        tall ? 'h-full' : ''
      }`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.dot}`} />

      {/* Section header */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 ${theme.softBg} border-b border-[var(--border-main)]`}
      >
        <div
          className={`shrink-0 w-8 h-8 rounded-lg border-2 ${theme.border} bg-[var(--surface-main)] flex items-center justify-center ${theme.text}`}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10.5px] font-mono font-bold uppercase tracking-widest ${theme.text}`}
            >
              {section.label}
            </span>
            <span
              className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${theme.softBg} ${theme.text} border ${theme.border}`}
            >
              {theme.label}
            </span>
          </div>
        </div>
      </div>

      {/* Section content */}
      <div className="px-4 py-3.5 pl-5 flex-1">{children}</div>
    </div>
  );
}

// ============================================================
// Section resolver helper — ambil section by id
// ============================================================
function getSection(sections: GuideSection[], id: string): GuideSection | undefined {
  return sections.find(s => s.id === id);
}

// ============================================================
// Data per tab
// ============================================================
const GUIDES: Record<
  FeatureGuideTab,
  { title: string; subtitle: string; sections: GuideSection[] }
> = {
  frequency: {
    title: 'Frequency Analysis',
    subtitle: 'Understanding letter distribution in ciphertext',
    sections: [
      {
        id: 'what',
        icon: BookOpen,
        label: 'What it is',
        content: (
          <div className="space-y-3 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            <p>
              <strong className="text-cyan-400">Frequency Analysis</strong> is the oldest
              cryptanalytic technique in the world. It was invented by{' '}
              <strong className="text-[var(--text-primary)]">Al-Kindi</strong>, a 9th-century
              Arab polymath, in his manuscript "A Manuscript on Deciphering Cryptographic
              Messages" (around 850 AD). For over a thousand years, this technique was the
              single most powerful weapon against classical ciphers.
            </p>
            <p>
              The core idea is simple but powerful:{' '}
              <strong className="text-[var(--text-primary)]">
                every language has a distinctive "fingerprint" of letter frequencies.
              </strong>{' '}
              In English, the letter <strong>E</strong> appears roughly 12.7% of the time,
              followed by <strong>T</strong> (9.06%), <strong>A</strong> (8.17%), and{' '}
              <strong>O</strong> (7.51%). This distribution is remarkably stable across any
              large body of English text — newspapers, novels, technical manuals, emails.
            </p>
            <p>
              When a monoalphabetic cipher (Caesar, Atbash, or simple substitution) encrypts
              a message, it <strong className="text-[var(--text-primary)]">preserves the
              frequency pattern</strong>. Each plaintext letter is substituted with a different
              ciphertext letter, but the <em>proportions stay the same</em>. So if the letter{' '}
              <code className="text-cyan-300">H</code> appears most frequently in your
              ciphertext, it is very likely that <code className="text-cyan-300">H</code> is
              the encrypted form of <code className="text-cyan-300">E</code>.
            </p>
            <HighlightBox accent="cyan" icon={Sparkles}>
              By aligning the ciphertext's frequency peaks with English's known peaks,
              cryptanalysts can recover the substitution mapping and decrypt the entire
              message — <strong>without ever knowing the key</strong>.
            </HighlightBox>
          </div>
        ),
      },
      {
        id: 'how',
        icon: Workflow,
        label: 'How it works',
        content: (
          <ol className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Step num={1}>Input is normalized — only letters A–Z, uppercased</Step>
            <Step num={2}>Count the frequency of every letter A–Z</Step>
            <Step num={3}>Convert counts to percentages (% of total letters)</Step>
            <Step num={4}>Compare against the English benchmark (cyan bar vs gray bar)</Step>
            <Step num={5}>Extract top bigrams (pairs of letters that appear often)</Step>
          </ol>
        ),
      },
      {
        id: 'example',
        icon: Lightbulb,
        label: 'Example',
        content: (
          <div className="space-y-2.5 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <p className="font-mono text-[10.5px] p-2.5 rounded-lg bg-[#0A0C10] border border-[#1E222B] text-cyan-400 break-all">
              KHOOR ZRUOG WKLV LV DQ HQFUBSWHG PHVVDJH
            </p>
            <p>
              Ciphertext frequency: <code className="text-cyan-300">H</code> is the most common
              letter (5 times). English benchmark: <code className="text-cyan-300">E</code> is
              the most common (12.7%).
            </p>
            <p>
              Therefore <strong className="text-[var(--text-primary)]">H likely maps to E</strong>.
              Position difference: H (7) − E (4) ={' '}
              <strong className="text-cyan-400">shift 3</strong>. This matches a Caesar cipher
              with shift 3.
            </p>
          </div>
        ),
      },
      {
        id: 'limits',
        icon: AlertTriangle,
        label: 'Limitations',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="warn">
              <strong className="text-amber-400">Not for Vigenère</strong> — the distribution is
              flat and cannot be compared.
            </Bullet>
            <Bullet accent="warn">
              <strong className="text-amber-400">Needs longer text</strong> — minimum ~50 letters
              for the pattern to stabilize.
            </Bullet>
            <Bullet accent="warn">
              <strong className="text-amber-400">English only</strong> — Indonesian has a
              different letter distribution.
            </Bullet>
            <Bullet accent="warn">
              <strong className="text-amber-400">Not auto-decrypt</strong> — this is an analysis
              tool.
            </Bullet>
          </ul>
        ),
      },
      {
        id: 'when',
        icon: CheckCircle2,
        label: 'When to use',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="good">
              Ciphertext with a{' '}
              <strong className="text-emerald-400">non-flat letter distribution</strong>.
            </Bullet>
            <Bullet accent="good">
              Suspected <strong className="text-emerald-400">Caesar, Atbash, or simple
              substitution</strong> cipher.
            </Bullet>
            <Bullet accent="good">Learning the fundamentals of classical cryptanalysis.</Bullet>
          </ul>
        ),
      },
    ],
  },

  'caesar-brute': {
    title: 'Caesar Brute-Force',
    subtitle: 'Exhaustive search across all 25 possible shifts',
    sections: [
      {
        id: 'what',
        icon: BookOpen,
        label: 'What it is',
        content: (
          <div className="space-y-3 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            <p>
              <strong className="text-rose-400">Caesar Brute-Force</strong> is an{' '}
              <strong className="text-[var(--text-primary)]">exhaustive search</strong> attack —
              a systematic trial of every possible key. The Caesar cipher, famously used by
              Julius Caesar for military correspondence, shifts every letter by a fixed amount.
              The entire keyspace consists of only <strong>25 possible shifts</strong> (shift 0
              leaves the text unchanged).
            </p>
            <p>
              This tiny keyspace makes Caesar ciphers <strong className="text-[var(--text-primary)]">
              completely insecure</strong> by modern standards. Even a 1970s pocket calculator
              could try all 25 shifts in a fraction of a second. A modern CPU does it in
              microseconds.
            </p>
            <p>
              The insight of brute-force cryptanalysis is that{' '}
              <strong className="text-[var(--text-primary)]">
                trying every possibility is often cheaper than finding a clever attack.
              </strong>{' '}
              Once we have all 25 candidate plaintexts, we can score each one automatically:
              the correct shift will contain common English words like <em>THE</em>, <em>AND</em>,
              and <em>YOU</em>, while wrong shifts produce gibberish.
            </p>
            <HighlightBox accent="rose" icon={Zap}>
              Keyspace size matters. A 25-key cipher is trivially broken; a 2²⁵⁶-key cipher
              (like AES-256) is mathematically impossible to brute-force.
            </HighlightBox>
          </div>
        ),
      },
      {
        id: 'how',
        icon: Workflow,
        label: 'How it works',
        content: (
          <ol className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Step num={1}>For each shift 1–25, decrypt the ciphertext</Step>
            <Step num={2}>
              Score the result by counting matches against ~50 common English words
            </Step>
            <Step num={3}>Sort results: highest score = likely correct shift</Step>
            <Step num={4}>Highlight top-3 results in green</Step>
          </ol>
        ),
      },
      {
        id: 'example',
        icon: Lightbulb,
        label: 'Example',
        content: (
          <div className="space-y-2.5 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <p className="font-mono text-[10.5px] p-2.5 rounded-lg bg-[#0A0C10] border border-[#1E222B] text-rose-400 break-all">
              PHHW PH DW WKH IRUXP WRPRUURZ DW GDZQ
            </p>
            <div className="space-y-1 font-mono text-[10.5px]">
              <div className="flex items-center gap-2 p-1.5 rounded border border-[var(--border-main)] bg-[var(--surface-secondary)]">
                <span className="text-[var(--text-secondary)] w-12 shrink-0">Shift 1</span>
                <span className="truncate">OGGV OG CV VJG HQTWO VQOQQTVY CV FCYP</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded border border-[var(--border-main)] bg-[var(--surface-secondary)]">
                <span className="text-[var(--text-secondary)] w-12 shrink-0">Shift 2</span>
                <span className="truncate">NFFU NF BU UIF GPSVN UPNPPSTX BU EBXO</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded border border-emerald-500/40 bg-emerald-500/10">
                <span className="text-emerald-400 font-bold w-12 shrink-0">Shift 3</span>
                <span className="truncate text-emerald-400 font-bold">
                  MEET ME AT THE FORUM TOMORROW AT DAWN
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'limits',
        icon: AlertTriangle,
        label: 'Limitations',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="warn">
              <strong className="text-amber-400">Caesar only</strong> — if the ciphertext uses a
              different cipher, no shift will produce readable output.
            </Bullet>
            <Bullet accent="warn">
              <strong className="text-amber-400">False positives possible</strong> — sometimes a
              wrong shift happens to contain short words like IS or AT.
            </Bullet>
          </ul>
        ),
      },
      {
        id: 'when',
        icon: CheckCircle2,
        label: 'When to use',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="good">Ciphertext strongly suspected to be Caesar cipher.</Bullet>
            <Bullet accent="good">Quick decryption without computing the shift manually.</Bullet>
            <Bullet accent="good">
              Learning why a <strong className="text-emerald-400">small keyspace</strong> makes
              a cipher weak.
            </Bullet>
          </ul>
        ),
      },
    ],
  },

  'xor-brute': {
    title: 'XOR Brute-Force',
    subtitle: 'Single-byte XOR cracker using chi-squared scoring',
    sections: [
      {
        id: 'what',
        icon: BookOpen,
        label: 'What it is',
        content: (
          <div className="space-y-3 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            <p>
              <strong className="text-amber-400">Single-byte XOR</strong> is a cipher where
              every plaintext byte is combined with{' '}
              <strong className="text-[var(--text-primary)]">the same single key byte</strong>{' '}
              using the XOR (exclusive-OR) operation. XOR is a bitwise operation that returns
              1 when bits differ and 0 when they match. It has a beautiful property:{' '}
              <code className="text-amber-300">A XOR B XOR B = A</code> — so encrypting twice
              with the same key restores the original.
            </p>
            <p>
              Despite its simplicity, XOR is{' '}
              <strong className="text-[var(--text-primary)]">not a toy</strong>. It is a
              fundamental building block inside AES, ChaCha20, and many modern ciphers — but
              always combined with other operations (substitution, permutation, rotation) to
              add cryptographic strength. Raw XOR alone, with a single-byte key, is trivially
              breakable.
            </p>
            <p>
              The attack is analogous to Caesar brute-force: since a byte has only{' '}
              <strong>256 possible values</strong>, we try them all. But instead of scoring
              plaintext by word matches, we use{' '}
              <strong className="text-[var(--text-primary)]">chi-squared statistical
              scoring</strong> — measuring how closely each candidate's byte distribution
              matches English text.
            </p>
            <HighlightBox accent="amber" icon={Target}>
              This exact problem is <strong>Cryptopals Challenge 3</strong> — the third
              exercise in the famous "Matasano Crypto Challenges".
            </HighlightBox>
          </div>
        ),
      },
      {
        id: 'how',
        icon: Workflow,
        label: 'How it works',
        content: (
          <ol className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Step num={1}>Parse input into bytes (hex or raw text)</Step>
            <Step num={2}>For each candidate key byte 0x00–0xFF, XOR every byte</Step>
            <Step num={3}>
              Score the result: chi-squared against English letter frequency + bonus for
              printable characters
            </Step>
            <Step num={4}>Sort results: highest score = most likely key</Step>
          </ol>
        ),
      },
      {
        id: 'example',
        icon: Lightbulb,
        label: 'Example',
        content: (
          <div className="space-y-2.5 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <p className="font-mono text-[10.5px] p-2.5 rounded-lg bg-[#0A0C10] border border-[#1E222B] text-amber-400 break-all">
              1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736
            </p>
            <p>
              Try key <code className="text-amber-300">0x58</code> ('X'):
            </p>
            <ul className="font-mono text-[10.5px] space-y-0.5 pl-2">
              <li>0x1b XOR 0x58 = 0x43 = <span className="text-emerald-400">'C'</span></li>
              <li>0x37 XOR 0x58 = 0x6f = <span className="text-emerald-400">'o'</span></li>
              <li>0x37 XOR 0x58 = 0x6f = <span className="text-emerald-400">'o'</span></li>
              <li>0x33 XOR 0x58 = 0x6b = <span className="text-emerald-400">'k'</span></li>
            </ul>
            <p className="text-emerald-400 font-mono text-[11px]">
              Result: "Cooking MC's like a pound of bacon"
            </p>
          </div>
        ),
      },
      {
        id: 'limits',
        icon: AlertTriangle,
        label: 'Limitations',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="warn">
              <strong className="text-amber-400">Single-byte key only</strong> — fails against
              repeating-key XOR (multi-byte).
            </Bullet>
            <Bullet accent="warn">
              Needs ciphertext of at least 20 bytes for reliable scoring.
            </Bullet>
            <Bullet accent="warn">
              Only works for <strong className="text-amber-400">English plaintext</strong>.
            </Bullet>
          </ul>
        ),
      },
      {
        id: 'when',
        icon: CheckCircle2,
        label: 'When to use',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="good">
              Facing a <strong className="text-emerald-400">CTF crypto challenge</strong>.
            </Bullet>
            <Bullet accent="good">Ciphertext suspected to be simple XOR.</Bullet>
            <Bullet accent="good">
              Learning <strong className="text-emerald-400">statistical scoring</strong> in
              cryptanalysis.
            </Bullet>
          </ul>
        ),
      },
    ],
  },

  'vigenere-crack': {
    title: 'Vigenère Cracker',
    subtitle: 'Recover polyalphabetic key using IoC and frequency analysis',
    sections: [
      {
        id: 'what',
        icon: BookOpen,
        label: 'What it is',
        content: (
          <div className="space-y-3 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            <p>
              <strong className="text-emerald-400">Vigenère Cipher</strong> is a polyalphabetic
              cipher — it uses a repeating <strong className="text-[var(--text-primary)]">keyword</strong>,
              and each plaintext letter is shifted by a different letter of that keyword. For
              example, with key <code className="text-emerald-300">LEON</code>, the first letter
              shifts by L (11), the second by E (4), the third by O (14), the fourth by N (13),
              then the cycle repeats.
            </p>
            <p>
              For over 300 years, Vigenère was called{' '}
              <em className="text-emerald-300">"le chiffre indéchiffrable"</em> — the unbreakable
              cipher. It defeated simple frequency analysis because the ciphertext's letter
              distribution is deliberately flattened: no single letter dominates, since each
              plaintext letter can map to many different ciphertext letters.
            </p>
            <p>
              The breakthrough came in 1863, when Friedrich Kasiski published a general attack.
              The key insight: <strong className="text-[var(--text-primary)]">
              the ciphertext can be split into N independent Caesar ciphers</strong>, where N is
              the key length. Each "column" of the ciphertext is a plain Caesar cipher with its
              own shift — vulnerable to the very frequency analysis Vigenère was designed to
              defeat.
            </p>
            <HighlightBox accent="emerald" icon={Lock}>
              This cracker works as a <strong>ciphertext-only attack</strong>. It recovers the
              key and the plaintext <em>without ever knowing either</em> — using only statistics
              from the ciphertext.
            </HighlightBox>
          </div>
        ),
      },
      {
        id: 'how',
        icon: Workflow,
        label: 'How it works',
        content: (
          <ol className="space-y-3 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Step num={1}>
              <div className="font-bold text-emerald-400 mb-1 text-[11.5px]">Estimate key length</div>
              <p>
                Try lengths 2–20. For each length N, split the ciphertext into N columns and
                compute the average Index of Coincidence.
              </p>
            </Step>
            <Step num={2}>
              <div className="font-bold text-emerald-400 mb-1 text-[11.5px]">Recover key per column</div>
              <p>
                Each column is a Caesar cipher with one shift. Try all 26 shifts, pick the
                most English-like.
              </p>
            </Step>
            <Step num={3}>
              <div className="font-bold text-emerald-400 mb-1 text-[11.5px]">Score plaintext</div>
              <p>
                Decrypt, count matches against ~80 common words and ~30 trigrams.
              </p>
            </Step>
            <Step num={4}>
              <div className="font-bold text-emerald-400 mb-1 text-[11.5px]">Rank and display</div>
              <p>Sort candidates and show top-5.</p>
            </Step>
          </ol>
        ),
      },
      {
        id: 'example',
        icon: Lightbulb,
        label: 'Example',
        content: (
          <div className="space-y-2.5 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <p className="font-mono text-[10.5px] p-2.5 rounded-lg bg-[#0A0C10] border border-[#1E222B] text-emerald-400 break-all">
              LXFOPVEFRNHRLXFOPVEFRNHRLXFOPVEFRNHR...
            </p>
            <p>Key length = 4. Recover each column:</p>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { col: 0, shift: 11, letter: 'L' },
                { col: 1, shift: 4, letter: 'E' },
                { col: 2, shift: 14, letter: 'O' },
                { col: 3, shift: 13, letter: 'N' },
              ].map(({ col, shift, letter }) => (
                <div
                  key={col}
                  className="p-2 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center"
                >
                  <div className="text-[8px] font-mono uppercase text-[var(--text-secondary)]">
                    Col {col + 1}
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-secondary)]">
                    sh {shift}
                  </div>
                  <div className="text-base font-mono font-bold text-emerald-400">{letter}</div>
                </div>
              ))}
            </div>
            <p className="text-emerald-400 font-mono text-center pt-1 text-[11.5px]">
              Recovered key = "LEON"
            </p>
          </div>
        ),
      },
      {
        id: 'limits',
        icon: AlertTriangle,
        label: 'Important limitations',
        content: (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border-2 border-rose-500/40 space-y-2">
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
                  <Gauge className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <span className="text-[11.5px] font-bold text-rose-400">
                  Ciphertext length drives accuracy
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Use <strong>200+ letters</strong> for good results, ideally{' '}
                <strong>300–500</strong>. Below 100 letters, results are often wrong.
              </p>
              <div className="grid grid-cols-4 gap-1">
                <div className="p-1.5 rounded bg-rose-500/15 border border-rose-500/30 text-center">
                  <div className="text-[8px] font-mono uppercase text-rose-400 font-bold">&lt; 50</div>
                  <div className="text-[7px] font-mono text-[var(--text-secondary)]">Too short</div>
                </div>
                <div className="p-1.5 rounded bg-amber-500/15 border border-amber-500/30 text-center">
                  <div className="text-[8px] font-mono uppercase text-amber-400 font-bold">50–99</div>
                  <div className="text-[7px] font-mono text-[var(--text-secondary)]">Marginal</div>
                </div>
                <div className="p-1.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-center">
                  <div className="text-[8px] font-mono uppercase text-cyan-400 font-bold">100–199</div>
                  <div className="text-[7px] font-mono text-[var(--text-secondary)]">Good</div>
                </div>
                <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-center">
                  <div className="text-[8px] font-mono uppercase text-emerald-400 font-bold">200+</div>
                  <div className="text-[7px] font-mono text-[var(--text-secondary)]">Excellent</div>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-[11.5px] leading-relaxed text-[var(--text-secondary)]">
              <Bullet accent="warn">English plaintext only.</Bullet>
              <Bullet accent="warn">Key length must be ≤ 20 to be detected.</Bullet>
              <Bullet accent="warn">Classic Vigenère only (not Autokey variants).</Bullet>
              <Bullet accent="warn">
                IoC can peak at multiples of the true length (6 → 12 also looks promising).
              </Bullet>
            </ul>
          </div>
        ),
      },
      {
        id: 'when',
        icon: CheckCircle2,
        label: 'When to use',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="good">
              Ciphertext is <strong className="text-emerald-400">long</strong> (200+ letters).
            </Bullet>
            <Bullet accent="good">Plaintext is English, suspected Vigenère.</Bullet>
            <Bullet accent="good">CTF challenge or learning classical cryptanalysis.</Bullet>
            <Bullet accent="bad">
              <strong className="text-rose-400">Not</strong> for modern ciphers (AES, ChaCha20).
            </Bullet>
          </ul>
        ),
      },
    ],
  },

  'hash-id': {
    title: 'Hash Identifier',
    subtitle: 'Detect the hash algorithm from length and format',
    sections: [
      {
        id: 'what',
        icon: BookOpen,
        label: 'What it is',
        content: (
          <div className="space-y-3 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            <p>
              A <strong className="text-purple-400">cryptographic hash function</strong> takes
              any input — a single character, a 10 GB file, or an entire database — and produces
              a fixed-size "fingerprint" called a digest. The same input always produces the
              same digest, but any tiny change produces a completely different one. This makes
              hashes ideal for verifying data integrity and storing passwords.
            </p>
            <p>
              The <strong className="text-purple-400">Hash Identifier</strong> is a forensic
              tool: given a string that <em>looks like</em> a hash, it answers the question{' '}
              <strong className="text-[var(--text-primary)]">"which algorithm produced this?"</strong>.
              It does this by analyzing two things: the <strong>length</strong> of the string
              (MD5 is always 32 hex chars, SHA-256 is 64, SHA-512 is 128) and the{' '}
              <strong>format</strong> (bcrypt starts with <code>$2a$</code>, Argon2 with{' '}
              <code>$argon2</code>).
            </p>
            <p>
              This is often the <strong className="text-[var(--text-primary)]">first step in
              a security audit</strong> or a CTF challenge. Before you can attempt to crack a
              hash, you need to know what algorithm you are dealing with — because the cracking
              tool (hashcat, john the ripper) and the time required differ enormously between
              algorithms.
            </p>
            <HighlightBox accent="purple" icon={Info}>
              This tool <strong>does not crack</strong> hashes — it only identifies the
              algorithm. To actually recover the input, use hashcat with the appropriate mode.
            </HighlightBox>
          </div>
        ),
      },
      {
        id: 'how',
        icon: Workflow,
        label: 'How it works',
        content: (
          <ol className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Step num={1}>
              Detect charset: <strong>hex</strong>, <strong>base64</strong>,{' '}
              <strong>bcrypt</strong>, or <strong>Argon2</strong>
            </Step>
            <Step num={2}>
              Match length against known hash patterns (32 hex = MD5, 64 hex = SHA-256)
            </Step>
            <Step num={3}>
              Match special prefixes like <code>$2a$</code> or <code>$argon2</code>
            </Step>
            <Step num={4}>Return all candidates with security level and notes</Step>
          </ol>
        ),
      },
      {
        id: 'example',
        icon: Lightbulb,
        label: 'Example',
        content: (
          <div className="space-y-2.5 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <p className="font-mono text-[10.5px] p-2.5 rounded-lg bg-[#0A0C10] border border-[#1E222B] text-purple-400 break-all">
              5d41402abc4b2a76b9719d911017c592
            </p>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-purple-400" />
                <span className="text-[12px] font-bold text-purple-400">MD5</span>
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-rose-500/40 text-rose-400 bg-rose-500/10">
                  BROKEN
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                128-bit cryptographic hash (RFC 1321). Collisions found in 2004 — trivial to
                forge.
              </p>
            </div>
            <p className="text-[11px] pt-1">
              <strong className="text-[var(--text-primary)]">Length:</strong> 32 hex ·{' '}
              <strong className="text-[var(--text-primary)]">Confidence:</strong> high
            </p>
          </div>
        ),
      },
      {
        id: 'limits',
        icon: AlertTriangle,
        label: 'Limitations',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="warn">
              <strong className="text-amber-400">Does not crack hashes</strong> — only
              identifies the algorithm.
            </Bullet>
            <Bullet accent="warn">
              <strong className="text-amber-400">False positives</strong> — 64 hex could be
              SHA-256, SHA3-256, or BLAKE2s.
            </Bullet>
            <Bullet accent="warn">
              <strong className="text-amber-400">Salt is invisible</strong> — the tool still
              only sees the format.
            </Bullet>
            <Bullet accent="warn">
              <strong className="text-amber-400">Not proof</strong> — length alone is never
              sufficient.
            </Bullet>
          </ul>
        ),
      },
      {
        id: 'when',
        icon: CheckCircle2,
        label: 'When to use',
        content: (
          <ul className="space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <Bullet accent="good">
              Found a hash in a database dump and don't know the algorithm.
            </Bullet>
            <Bullet accent="good">Facing a CTF challenge that provides a hash.</Bullet>
            <Bullet accent="good">
              Security audit — checking whether a system uses weak algorithms.
            </Bullet>
            <Bullet accent="good">Learning the differences between hash functions.</Bullet>
          </ul>
        ),
      },
    ],
  },
};

// ============================================================
// Layout renderers — per tab, eksplisit
// ============================================================

/**
 * Layout default (Frequency, Caesar, XOR, Hash):
 *   - what   : full width
 *   - how    : kolom kiri baris 1
 *   - example: kolom kanan baris 1
 *   - limits : kolom kiri baris 2
 *   - when   : kolom kanan baris 2
 */
function DefaultLayout({ sections }: { sections: GuideSection[] }) {
  const what = getSection(sections, 'what');
  const how = getSection(sections, 'how');
  const example = getSection(sections, 'example');
  const limits = getSection(sections, 'limits');
  const when = getSection(sections, 'when');

  return (
    <div className="space-y-3">
      {what && <SectionCard section={what}>{what.content}</SectionCard>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {how && (
          <SectionCard section={how} tall>
            {how.content}
          </SectionCard>
        )}
        {example && (
          <SectionCard section={example} tall>
            {example.content}
          </SectionCard>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {limits && (
          <SectionCard section={limits} tall>
            {limits.content}
          </SectionCard>
        )}
        {when && (
          <SectionCard section={when} tall>
            {when.content}
          </SectionCard>
        )}
      </div>
    </div>
  );
}

/**
 * Layout Vigenère Cracker:
 *   - what   : full width
 *   - how    : full width (kontennya panjang, 4 step dengan sub-judul)
 *   - example: kolom kiri
 *   - limits : kolom kanan (warning box + bullets)
 *   - when   : full width di bawah
 */
function VigenereLayout({ sections }: { sections: GuideSection[] }) {
  const what = getSection(sections, 'what');
  const how = getSection(sections, 'how');
  const example = getSection(sections, 'example');
  const limits = getSection(sections, 'limits');
  const when = getSection(sections, 'when');

  return (
    <div className="space-y-3">
      {what && <SectionCard section={what}>{what.content}</SectionCard>}

      {how && <SectionCard section={how}>{how.content}</SectionCard>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {example && (
          <SectionCard section={example} tall>
            {example.content}
          </SectionCard>
        )}
        {limits && (
          <SectionCard section={limits} tall>
            {limits.content}
          </SectionCard>
        )}
      </div>

      {when && <SectionCard section={when}>{when.content}</SectionCard>}
    </div>
  );
}

// ============================================================
// Main component
// ============================================================
export function FeatureGuide({ tab, accent }: FeatureGuideProps) {
  const [open, setOpen] = useState(true);
  const guide = GUIDES[tab];
  const colors = ACCENT[accent];

  return (
    <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--surface-main)] overflow-hidden shadow-xl">
      {/* ============================================================
          HEADER — Bold, colorful, prominent
      ============================================================ */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="relative w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer transition-colors hover:bg-[var(--surface-secondary)]/50"
      >
        {/* Gradient background overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} pointer-events-none`}
        />

        <div className="relative flex items-center gap-4 min-w-0 flex-1">
          {/* Icon box — bigger, colored */}
          <div
            className={`shrink-0 w-14 h-14 rounded-2xl ${colors.bg} border-2 ${colors.border} flex items-center justify-center ${colors.text} shadow-lg`}
          >
            <Info className="w-7 h-7" strokeWidth={2.5} />
          </div>

          {/* Title + subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Feature Guide
              </span>
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                Interactive
              </span>
            </div>
            <h3 className={`text-lg font-bold ${colors.text} leading-tight`}>
              {guide.title}
            </h3>
            <p className="text-[11.5px] font-mono text-[var(--text-secondary)] truncate">
              {guide.subtitle}
            </p>
          </div>
        </div>

        {/* Toggle button */}
        <div className="relative shrink-0 flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hidden sm:inline">
            {open ? 'Hide' : 'Show'}
          </span>
          <div
            className={`w-10 h-10 rounded-xl ${colors.bg} border-2 ${colors.border} flex items-center justify-center ${colors.text} transition-transform duration-300 ${
              open ? 'rotate-0' : 'rotate-180'
            }`}
          >
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* ============================================================
          SECTIONS — Layout per tab
      ============================================================ */}
      {open && (
        <div className="p-4 bg-[var(--surface-secondary)]/30">
          {tab === 'vigenere-crack' ? (
            <VigenereLayout sections={guide.sections} />
          ) : (
            <DefaultLayout sections={guide.sections} />
          )}
        </div>
      )}
    </div>
  );
}