import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

interface DemoFrame {
  algorithm: string;
  category: 'classical' | 'modern' | 'hashing' | 'encoding';
  input: string;
  output: string;
  label: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

const DEMO_FRAMES: DemoFrame[] = [
  {
    algorithm: 'CAESAR CIPHER',
    category: 'classical',
    input: 'HELLO',
    output: 'KHOOR',
    label: 'shift +3',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
  },
  {
    algorithm: 'XOR STREAM',
    category: 'classical',
    input: 'FLAG',
    output: '0D 09 18 0C',
    label: 'key = "KEY"',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
  },
  {
    algorithm: 'SHA-256 HASH',
    category: 'hashing',
    input: '"abc"',
    output: 'ba7816bf...015ad',
    label: 'one-way digest',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
  },
  {
    algorithm: 'AES-GCM',
    category: 'modern',
    input: 'plaintext',
    output: 'ciphertext + tag',
    label: 'AEAD 256-bit',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
  },
];

const FRAME_DURATION_MS = 3000;

export function AlgorithmsHeroDemo() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % DEMO_FRAMES.length);
    }, FRAME_DURATION_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  const frame = DEMO_FRAMES[frameIndex];

  return (
    <div
      className="rounded-2xl bg-[#0A0C10] border border-[#1E222B] shadow-2xl overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E222B] bg-[#0E1116]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            <Terminal className="w-3 h-3" strokeWidth={2.5} />
            Live Demo
          </span>
        </div>

        <div className="flex items-center gap-1">
          {DEMO_FRAMES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFrameIndex(idx)}
              aria-label={`Show demo ${idx + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                idx === frameIndex ? 'bg-cyan-400' : 'bg-[#2A2F3A] hover:bg-[#3A404D]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-5 sm:p-6 space-y-5 flex flex-col justify-between">
        {/* Algorithm label */}
        <div className="space-y-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-500 ${frame.accentBg} ${frame.accentBorder} ${frame.accentText}`}
          >
            {frame.algorithm}
          </div>

          <div
            className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest inline-block ${frame.accentText} transition-colors duration-500`}
          >
            {frame.category} · {frame.label}
          </div>
        </div>

        {/* Transformation visual */}
        <div
          key={frameIndex}
          className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          {/* Input line */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-[var(--text-secondary)] w-12 shrink-0 uppercase tracking-wider">
              input
            </span>
            <span className="text-[#1E222B]">›</span>
            <span className="text-slate-200 font-bold break-all">{frame.input}</span>
          </div>

          {/* Arrow + process indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono pl-12">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2A2F3A] to-transparent relative">
              <span
                className={`absolute inset-0 bg-gradient-to-r from-transparent ${frame.accentText.replace(
                  'text-',
                  'via-'
                )} to-transparent animate-pulse`}
              />
            </span>
            <span className={`text-[9px] uppercase tracking-widest ${frame.accentText}`}>
              processing
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2A2F3A] to-transparent" />
          </div>

          {/* Output line */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-[var(--text-secondary)] w-12 shrink-0 uppercase tracking-wider">
              output
            </span>
            <span className="text-[#1E222B]">›</span>
            <span
              className={`font-bold break-all ${frame.accentText} transition-colors duration-500`}
            >
              {frame.output}
            </span>
          </div>
        </div>

        {/* Footer status */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1E222B] text-[9px] font-mono text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            {isPaused ? 'paused' : 'auto-playing'}
          </span>
          <span className="tracking-wider">
            {String(frameIndex + 1).padStart(2, '0')} / {String(DEMO_FRAMES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}