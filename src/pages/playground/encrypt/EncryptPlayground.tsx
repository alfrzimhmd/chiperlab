import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Key, Terminal, Library, Atom, FileLock } from 'lucide-react';
import { SecurityNotice } from '../../../components/common/SecurityNotice';
import { ClassicalTab } from './ClassicalTab';
import { ModernTab } from './ModernTab';
import { EncodingTab } from './EncodingTab';
import { MediaTab } from './MediaTab';

export type CipherCategory = 'classical' | 'modern' | 'encoding' | 'media';

export interface CipherTabProps {
  initialAlgo?: string;
}

export function EncryptPlayground() {
  const [searchParams] = useSearchParams();
  const algoParam = searchParams.get('algo');

  const getCategoryFromAlgo = (algo: string | null): CipherCategory => {
    if (!algo) return 'classical';
    if (['caesar', 'atbash', 'vigenere', 'xor'].includes(algo)) return 'classical';
    if (['aes-gcm', 'rsa-oaep', 'chacha20', 'hmac'].includes(algo)) return 'modern';
    if (['base64', 'hex', 'rot13'].includes(algo)) return 'encoding';
    if (['media', 'file', 'media-encryption'].includes(algo)) return 'media';
    return 'classical';
  };

  const [activeTab, setActiveTab] = useState<CipherCategory>(() =>
    getCategoryFromAlgo(algoParam)
  );

  useEffect(() => {
    if (algoParam) {
      setActiveTab(getCategoryFromAlgo(algoParam));
    }
  }, [algoParam]);

  const TABS: {
    id: CipherCategory;
    label: string;
    desc: string;
    detail: string;
    icon: typeof Key;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    activeBg: string;
    count: number;
    examples: string;
  }[] = [
    {
      id: 'classical',
      label: 'Classical',
      desc: 'Historical substitution ciphers',
      detail: 'From ancient Rome to 19th-century telegraphy',
      icon: Key,
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-500/30',
      activeBg: 'bg-amber-500',
      count: 4,
      examples: 'Caesar · Atbash · Vigenère · XOR',
    },
    {
      id: 'modern',
      label: 'Modern',
      desc: 'Production-grade cryptography',
      detail: 'Powers TLS 1.3, VPNs, and secure messaging',
      icon: Atom,
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/30',
      activeBg: 'bg-cyan-500',
      count: 4,
      examples: 'AES-GCM · RSA-OAEP · ChaCha20 · HMAC',
    },
    {
      id: 'encoding',
      label: 'Encoding',
      desc: 'NOT encryption — transport formats',
      detail: 'Safe transport and universal byte display',
      icon: Library,
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-500/30',
      activeBg: 'bg-emerald-500',
      count: 3,
      examples: 'Base64 · Hex · ROT13',
    },
    {
      id: 'media',
      label: 'Media',
      desc: 'Encrypt any file type',
      detail: 'Images · PDFs · Audio · Video · Archives',
      icon: FileLock,
      accentText: 'text-pink-400',
      accentBg: 'bg-pink-500/10',
      accentBorder: 'border-pink-500/30',
      activeBg: 'bg-pink-500',
      count: 3,
      examples: 'AES-GCM · ChaCha20 · XOR',
    },
  ];

  const isClassical = activeTab === 'classical';
  const isMedia = activeTab === 'media';

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Back */}
      <Link
        to="/playground"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Playground Hub
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Encryption & Decryption Engine
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
          Cryptographic Playground
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Test <strong className="text-cyan-400">11 ciphers and encoders</strong> across three
          families — or encrypt <strong className="text-pink-400">any file type</strong> with
          modern byte-level algorithms.
        </p>

        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] max-w-2xl">
          Every algorithm executes locally in your browser. Compare security levels, inspect
          step-by-step transformations, and encrypt real files without ever leaving your device.
        </p>
      </div>

      {!isMedia && <SecurityNotice type={isClassical ? 'classical' : 'general'} />}

      {isMedia && (
        <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
            <FileLock className="w-4 h-4 text-pink-400" strokeWidth={2.5} />
          </div>
          <div className="pt-0.5">
            <span className="font-bold block text-pink-400 mb-1 font-mono text-[11px] tracking-wider uppercase">
              File Encryption — Client-Side Only
            </span>
            <span className="text-[var(--text-secondary)] text-xs leading-relaxed">
              Encrypt any file type with AES-GCM, ChaCha20-Poly1305, or XOR. Files are read
              into browser memory, encrypted locally, and downloaded back.{' '}
              <strong className="text-[var(--text-primary)]">Nothing is ever uploaded</strong> to
              a server. Max 20 MB per file.
            </span>
          </div>
        </div>
      )}

      {/* Category tabs — 4 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TABS.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left overflow-hidden ${
                isActive
                  ? `${tab.accentBg} ${tab.accentBorder} shadow-xl scale-[1.02]`
                  : 'bg-[var(--surface-main)] border-[var(--border-main)] hover:border-cyan-500/30 hover:shadow-lg'
              }`}
            >
              {/* Top-right count badge */}
              <span
                className={`absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-colors ${
                  isActive
                    ? `${tab.activeBg} text-black`
                    : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-main)]'
                }`}
              >
                {tab.count}
              </span>

              {/* Icon */}
              <div
                className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? `${tab.accentBg} ${tab.accentBorder} ${tab.accentText} scale-110`
                    : 'bg-[var(--surface-secondary)] border-[var(--border-main)] text-[var(--text-secondary)] group-hover:scale-105'
                }`}
              >
                <TabIcon className="w-6 h-6" strokeWidth={2.5} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <h3
                  className={`text-base font-bold transition-colors leading-tight ${
                    isActive ? tab.accentText : 'text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </h3>

                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {tab.desc}
                </p>

                <p className="text-[10px] font-mono text-[var(--text-secondary)] leading-relaxed italic">
                  {tab.detail}
                </p>

                <div
                  className={`pt-2 mt-2 border-t text-[10px] font-mono tracking-wide ${
                    isActive
                      ? `${tab.accentBorder} ${tab.accentText}`
                      : 'border-[var(--border-main)] text-[var(--text-secondary)]'
                  }`}
                >
                  {tab.examples}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'classical' && <ClassicalTab initialAlgo={algoParam || undefined} />}
        {activeTab === 'modern' && <ModernTab initialAlgo={algoParam || undefined} />}
        {activeTab === 'encoding' && <EncodingTab initialAlgo={algoParam || undefined} />}
        {activeTab === 'media' && <MediaTab />}
      </div>
    </div>
  );
}