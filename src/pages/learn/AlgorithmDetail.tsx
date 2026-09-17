import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALGORITHMS } from '../../data/algorithms';
import { useProgress } from '../../hooks/useProgress';
import {
  ArrowLeft,
  Terminal,
  ShieldAlert,
  History,
  FunctionSquare,
  CheckCircle2,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SecurityNotice } from '../../components/common/SecurityNotice';

export function AlgorithmDetail() {
  const { id } = useParams<{ id: string }>();
  const { exploreAlgorithm, isAlgorithmExplored } = useProgress();

  const algorithm = ALGORITHMS.find(a => a.id === id);

  useEffect(() => {
    if (algorithm) {
      exploreAlgorithm(algorithm.id);
    }
  }, [algorithm, exploreAlgorithm]);

  if (!algorithm) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Algorithm Not Found</h2>
        <p className="text-xs font-mono text-[var(--text-secondary)]">
          The requested algorithm is not in the ChiperLab catalog.
        </p>
        <Link to="/learn/algorithms">
          <Button size="sm">Back to Algorithms</Button>
        </Link>
      </div>
    );
  }

  const isExplored = isAlgorithmExplored(algorithm.id);

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/learn/algorithms"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Algorithms Catalog
        </Link>

        <Link to={algorithm.playgroundRoute}>
          <Button
            size="sm"
            variant="primary"
            icon={<Terminal className="w-3.5 h-3.5" />}
          >
            Launch in Playground
          </Button>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="neutral">{algorithm.category.toUpperCase()}</Badge>
          <Badge
            variant={
              algorithm.difficulty === 'beginner'
                ? 'success'
                : algorithm.difficulty === 'intermediate'
                ? 'primary'
                : 'warning'
            }
          >
            {algorithm.difficulty}
          </Badge>
          {isExplored && (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              EXPLORED
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {algorithm.name}
        </h1>

        <p className="text-sm sm:text-base font-mono font-medium text-cyan-400">
          {algorithm.tagline}
        </p>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          {algorithm.overview}
        </p>
      </div>

      {/* Security Notice */}
      <SecurityNotice type={algorithm.category === 'classical' ? 'classical' : 'general'} />

      {/* History */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
        <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <History className="w-4 h-4" />
          </div>
          History & Cryptographic Origin
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
          {algorithm.history}
        </p>
      </div>

      {/* How it Works */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-3">
        <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FunctionSquare className="w-4 h-4" />
          </div>
          How It Works
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
          {algorithm.howItWorks}
        </p>
      </div>

      {/* Mathematical Formulation */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0A0C10] border border-[var(--border-main)] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <FileCode className="w-4 h-4" />
            {algorithm.formula.title}
          </h2>
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">Formal Notation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#12151B] border border-[#1E222B]">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-sans mb-1.5 font-bold">
              Encryption
            </span>
            <div className="text-cyan-300 font-semibold text-sm">
              {algorithm.formula.encryption}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#12151B] border border-[#1E222B]">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-sans mb-1.5 font-bold">
              Decryption
            </span>
            <div className="text-emerald-300 font-semibold text-sm">
              {algorithm.formula.decryption}
            </div>
          </div>
        </div>

        {algorithm.formula.notes && (
          <p className="text-xs text-[var(--text-secondary)] font-mono italic">
            {algorithm.formula.notes}
          </p>
        )}
      </div>

      {/* Example Walkthrough */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
        <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          Example Walkthrough
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[10px] text-[var(--text-secondary)] block font-sans uppercase font-bold mb-1">
              Plaintext Input
            </span>
            <span className="text-[var(--text-primary)] font-bold break-all">
              {algorithm.example.plaintext}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[10px] text-[var(--text-secondary)] block font-sans uppercase font-bold mb-1">
              Key / Rule
            </span>
            <span className="text-cyan-400 font-bold break-all">
              {algorithm.example.key}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)]">
            <span className="text-[10px] text-[var(--text-secondary)] block font-sans uppercase font-bold mb-1">
              Ciphertext Output
            </span>
            <span className="text-emerald-400 font-bold break-all">
              {algorithm.example.ciphertext}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-xs font-mono text-[var(--text-primary)] whitespace-pre-line leading-relaxed">
          {algorithm.example.walkthrough}
        </div>
      </div>

      {/* Security Analysis */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-rose-500/30 shadow-lg space-y-3">
        <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          Security Analysis & Vulnerabilities
        </h2>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {algorithm.securityNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/learn/algorithms">
          <Button variant="outline" size="sm">
            Explore Other Algorithms
          </Button>
        </Link>
        <Link to={algorithm.playgroundRoute}>
          <Button size="md" variant="primary" icon={<Terminal className="w-4 h-4" />}>
            Experiment in Playground
          </Button>
        </Link>
      </div>
    </div>
  );
}