import { useEffect, useState } from 'react';
import {
  Key,
  Hash,
  Layers,
  ShieldCheck,
  Zap,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { CardInfoButton } from '../../components/common/CardInfoButton';

type ModernAlgo = 'aes-gcm' | 'rsa-oaep' | 'chacha20' | 'hmac';

interface CryptoPropertiesCardProps {
  algorithm: ModernAlgo;
}

interface PropertyRow {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}

interface AlgoProps {
  title: string;
  subtitle: string;
  rows: PropertyRow[];
  notes: string[];
}

const PROPS: Record<ModernAlgo, AlgoProps> = {
  'aes-gcm': {
    title: 'AES-GCM Properties',
    subtitle: 'Symmetric AEAD · Block cipher in CTR mode',
    rows: [
      { icon: Key, label: 'Key size', value: '128 / 256 bits', accent: 'text-cyan-400' },
      { icon: Hash, label: 'Block size', value: '128 bits (16 bytes)', accent: 'text-cyan-400' },
      { icon: Layers, label: 'Nonce / IV', value: '96 bits (12 bytes)', accent: 'text-purple-400' },
      { icon: ShieldCheck, label: 'Auth tag', value: '128 bits (16 bytes)', accent: 'text-emerald-400' },
      { icon: Zap, label: 'Speed', value: '~1–5 GB/s (AES-NI)', accent: 'text-amber-400' },
      { icon: AlertTriangle, label: 'Weakness', value: 'Nonce reuse = total break', accent: 'text-rose-400' },
    ],
    notes: [
      'AEAD: confidentiality + integrity in one pass.',
      'Hardware-accelerated via AES-NI on modern CPUs.',
      'Standard for TLS 1.3, IPsec, disk encryption.',
    ],
  },
  'rsa-oaep': {
    title: 'RSA-OAEP Properties',
    subtitle: 'Asymmetric public-key encryption',
    rows: [
      { icon: Key, label: 'Key size', value: '2048 / 3072 / 4096 bits', accent: 'text-cyan-400' },
      { icon: Hash, label: 'Hash function', value: 'SHA-256 (in OAEP)', accent: 'text-cyan-400' },
      { icon: Layers, label: 'Max plaintext', value: '~190 bytes (2048-bit)', accent: 'text-purple-400' },
      { icon: ShieldCheck, label: 'Padding', value: 'OAEP (probabilistic)', accent: 'text-emerald-400' },
      { icon: Zap, label: 'Speed', value: '~1000× slower than AES', accent: 'text-amber-400' },
      { icon: AlertTriangle, label: 'Weakness', value: 'Quantum-vulnerable (Shor)', accent: 'text-rose-400' },
    ],
    notes: [
      'Encrypt with public key, decrypt with private key.',
      'OAEP padding prevents chosen-ciphertext attacks.',
      'Used for key exchange — bulk data via AES.',
    ],
  },
  chacha20: {
    title: 'ChaCha20-Poly1305 Properties',
    subtitle: 'Symmetric AEAD · ARX stream cipher',
    rows: [
      { icon: Key, label: 'Key size', value: '256 bits (32 bytes)', accent: 'text-cyan-400' },
      { icon: Hash, label: 'Block size', value: '512 bits (64 bytes)', accent: 'text-cyan-400' },
      { icon: Layers, label: 'Nonce / IV', value: '96 bits (12 bytes)', accent: 'text-purple-400' },
      { icon: ShieldCheck, label: 'Auth tag', value: '128 bits (16 bytes)', accent: 'text-emerald-400' },
      { icon: Zap, label: 'Speed', value: '~1–3 GB/s (software)', accent: 'text-amber-400' },
      { icon: AlertTriangle, label: 'Weakness', value: 'Nonce reuse = total break', accent: 'text-rose-400' },
    ],
    notes: [
      'ARX: only Add-Rotate-XOR — no S-box, immune to cache timing.',
      'Preferred on mobile / IoT without AES hardware.',
      'Default cipher in TLS 1.3 alongside AES-GCM.',
    ],
  },
  hmac: {
    title: 'HMAC-SHA256 Properties',
    subtitle: 'Symmetric message authentication code',
    rows: [
      { icon: Key, label: 'Key size', value: 'Any (≥ 32 bytes recommended)', accent: 'text-cyan-400' },
      { icon: Hash, label: 'Hash function', value: 'SHA-256', accent: 'text-cyan-400' },
      { icon: Layers, label: 'Output size', value: '256 bits (32 bytes)', accent: 'text-purple-400' },
      { icon: ShieldCheck, label: 'Purpose', value: 'Integrity + authenticity', accent: 'text-emerald-400' },
      { icon: Zap, label: 'Speed', value: '~1–2 GB/s', accent: 'text-amber-400' },
      { icon: AlertTriangle, label: 'Weakness', value: 'No confidentiality (not encrypted)', accent: 'text-rose-400' },
    ],
    notes: [
      'Immune to length-extension attacks (unlike raw SHA-256).',
      'Used in JWT (HS256), AWS SigV4, Stripe webhooks.',
      'Verify with constant-time comparison, never ===.',
    ],
  },
};

export function CryptoPropertiesCard({ algorithm }: CryptoPropertiesCardProps) {
  const [visible, setVisible] = useState(false);
  const props = PROPS[algorithm];

  // Fade-in saat algo berubah
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [algorithm]);

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {props.title}
            </h3>
            <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
              {props.subtitle}
            </p>
          </div>
        </div>
        <CardInfoButton
          title={props.title}
          subtitle={props.subtitle}
          sections={[
            {
              heading: 'Technical parameters',
              body: props.rows.map(r => `• ${r.label}: ${r.value}`).join('\n'),
              icon: 'info',
            },
            {
              heading: 'Why these values?',
              body: 'These parameters are chosen to balance security, performance, and interoperability. Deviating (e.g. shorter nonce) can weaken or break the cipher.',
              icon: 'tip',
            },
            {
              heading: 'Security notes',
              body: props.notes.map(n => `• ${n}`).join('\n'),
              icon: 'book',
            },
          ]}
        />
      </div>

      {/* Property rows */}
      <div className="space-y-2">
        {props.rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${row.accent}`} />
                <span className="text-[11px] font-mono text-[var(--text-secondary)] truncate">
                  {row.label}
                </span>
              </div>
              <span className={`text-[11px] font-mono font-bold shrink-0 ${row.accent}`}>
                {row.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="pt-3 border-t border-[var(--border-main)] space-y-1.5">
        {props.notes.map((note, i) => (
          <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
            <span className="shrink-0 w-1 h-1 rounded-full bg-amber-400 mt-1.5" />
            <span>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}