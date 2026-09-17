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
  BookOpen,
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Algorithm Not Found</h2>
        <p className="text-xs text-slate-500">The requested algorithm is not in the ChiperLab catalog.</p>
        <Link to="/learn/algorithms">
          <Button size="sm">Back to Algorithms</Button>
        </Link>
      </div>
    );
  }

  const isExplored = isAlgorithmExplored(algorithm.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/learn/algorithms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
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
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Explored (+15 XP)
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {algorithm.name}
        </h1>

        <p className="text-sm sm:text-base font-medium text-sky-600 dark:text-sky-400">
          {algorithm.tagline}
        </p>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {algorithm.overview}
        </p>
      </div>

      {/* Educational Notice */}
      <SecurityNotice
        type={algorithm.category === 'classical' ? 'classical' : 'general'}
      />

      {/* History and Background */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-4 h-4 text-sky-500" />
          History & Cryptographic Origin
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {algorithm.history}
        </p>
      </div>

      {/* How it Works */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FunctionSquare className="w-4 h-4 text-indigo-500" />
          How It Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {algorithm.howItWorks}
        </p>
      </div>

      {/* Mathematical Formulation */}
      <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <FileCode className="w-4 h-4" />
            {algorithm.formula.title}
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">Formal Notation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans mb-1 font-bold">
              Encryption Formula
            </span>
            <div className="text-sky-300 font-semibold">{algorithm.formula.encryption}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans mb-1 font-bold">
              Decryption Formula
            </span>
            <div className="text-emerald-300 font-semibold">{algorithm.formula.decryption}</div>
          </div>
        </div>

        {algorithm.formula.notes && (
          <p className="text-xs text-slate-400 font-mono italic">
            {algorithm.formula.notes}
          </p>
        )}
      </div>

      {/* Practical Example Walkthrough */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Example Walkthrough
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">Input Plaintext</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold break-all">{algorithm.example.plaintext}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">Secret Key / Rule</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold break-all">{algorithm.example.key}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">Output Ciphertext</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold break-all">{algorithm.example.ciphertext}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {algorithm.example.walkthrough}
        </div>
      </div>

      {/* Security Analysis & Vulnerabilities */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          Security Analysis & Cryptanalysis Vulnerabilities
        </h2>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {algorithm.securityNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/learn/algorithms">
          <Button variant="outline" size="sm">
            Explore Other Algorithms
          </Button>
        </Link>
        <Link to={algorithm.playgroundRoute}>
          <Button
            size="md"
            variant="primary"
            icon={<Terminal className="w-4 h-4" />}
          >
            Experiment in Playground Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
