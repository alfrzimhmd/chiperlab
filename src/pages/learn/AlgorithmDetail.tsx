import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ALGORITHMS } from '../../data/algorithms';
import { useProgress } from '../../hooks/useProgress';
import {
  ArrowLeft,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  ExternalLink,
  FileText,
  Package,
  GraduationCap,
  List,
  Info,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SecurityNotice } from '../../components/common/SecurityNotice';
import { SectionContent, InlineText } from '../../components/lesson/SectionContent';
import { CodeBlock } from '../../components/lesson/CodeBlock';
import { AlgorithmQuiz } from '../../components/learning/AlgorithmQuiz';
import type { AlgorithmReference, AlgorithmSection } from '../../data/algorithms';

/* ============================================================
   TYPE CONFIG for references
============================================================ */
const REF_TYPE_CONFIG: Record<
  string,
  { label: string; text: string; bg: string; border: string; Icon: typeof FileText }
> = {
  standard: {
    label: 'Standard',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    Icon: Package,
  },
  paper: {
    label: 'Paper',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    Icon: FileText,
  },
  book: {
    label: 'Book',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    Icon: BookOpen,
  },
  article: {
    label: 'Article',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    Icon: FileText,
  },
  documentation: {
    label: 'Docs',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    Icon: GraduationCap,
  },
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
export function AlgorithmDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exploreAlgorithm, isAlgorithmExplored } = useProgress();
  const [activeSection, setActiveSection] = useState<string>('');

  const algorithm = ALGORITHMS.find(a => a.id === id);

  // Find prev / next algorithms for bottom navigation
  const currentIndex = algorithm
    ? ALGORITHMS.findIndex(a => a.id === algorithm.id)
    : -1;
  const prevAlgorithm = currentIndex > 0 ? ALGORITHMS[currentIndex - 1] : null;
  const nextAlgorithm =
    currentIndex >= 0 && currentIndex < ALGORITHMS.length - 1
      ? ALGORITHMS[currentIndex + 1]
      : null;

  // Mark algorithm as explored
  useEffect(() => {
    if (algorithm) {
      exploreAlgorithm(algorithm.id);
    }
  }, [algorithm, exploreAlgorithm]);

  // Scroll spy
  useEffect(() => {
    if (!algorithm) return;

    const sectionIds = [
      ...algorithm.sections.map(s => s.id),
      ...(algorithm.keyTakeaways && algorithm.keyTakeaways.length > 0
        ? ['takeaways']
        : []),
      'quiz',
    ];

    const elements: { id: string; el: HTMLElement }[] = [];
    sectionIds.forEach(sid => {
      const el = document.getElementById(`section-${sid}`);
      if (el) elements.push({ id: sid, el });
    });

    if (elements.length === 0) return;

    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const sid = entry.target.getAttribute('data-section-id');
          if (!sid) return;

          if (entry.isIntersecting) {
            visibleSections.set(sid, entry.intersectionRatio);
          } else {
            visibleSections.delete(sid);
          }
        });

        if (visibleSections.size > 0) {
          let bestId = '';
          let bestRatio = -1;
          visibleSections.forEach((ratio, sid) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = sid;
            }
          });
          setActiveSection(bestId);
        }
      },
      {
        rootMargin: '-96px 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    );

    elements.forEach(({ id: sid, el }) => {
      el.setAttribute('data-section-id', sid);
      observer.observe(el);
    });

    return () => {
      elements.forEach(({ el }) => {
        el.removeAttribute('data-section-id');
      });
      observer.disconnect();
    };
  }, [algorithm]);

  // Reset scroll to top when algorithm changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection('');
  }, [id]);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      const offset = 96;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleNavigate = (algoId: string) => {
    setActiveSection('');
    navigate(`/learn/algorithms/${algoId}`);
  };

  // Not found
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
    <div
      key={algorithm.id}
      className="max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 animate-in fade-in duration-200"
    >
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <Link
          to="/learn/algorithms"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Algorithms Catalog
        </Link>

        <div className="flex items-center gap-2">
          {isExplored && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              EXPLORED
            </span>
          )}
          <Link to={algorithm.playgroundRoute}>
            <Button
              variant="primary"
              size="sm"
              icon={<Terminal className="w-3.5 h-3.5" />}
            >
              Launch in Playground
            </Button>
          </Link>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* MAIN CONTENT (LEFT — 3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* ALGORITHM HEADER */}
          <header className="space-y-4 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 uppercase">
                {algorithm.category}
              </span>
              <Badge
                variant={
                  algorithm.difficulty === 'beginner'
                    ? 'success'
                    : algorithm.difficulty === 'intermediate'
                    ? 'primary'
                    : 'warning'
                }
                size="sm"
              >
                {algorithm.difficulty}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5" />
                {algorithm.estimatedMinutes} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.1]">
              {algorithm.name}
            </h1>

            <p className="text-sm sm:text-base font-mono font-medium text-cyan-400">
              {algorithm.tagline}
            </p>

            <InlineText
              as="p"
              text={algorithm.description}
              className="text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl"
            />
          </header>

          {/* SECURITY NOTICE */}
          <SecurityNotice
            type={algorithm.category === 'classical' ? 'classical' : 'general'}
          />

          {/* ALGORITHM SECTIONS */}
          <AlgorithmSections sections={algorithm.sections} />

          {/* KEY TAKEAWAYS */}
          {algorithm.keyTakeaways && algorithm.keyTakeaways.length > 0 && (
            <section
              id="section-takeaways"
              className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-5 scroll-mt-24"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400 tracking-widest block">
                    KEY TAKEAWAYS
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-0.5">
                    Concepts to Remember
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {algorithm.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                    </div>
                    <InlineText
                      as="p"
                      text={takeaway}
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ALGORITHM QUIZ */}
          <AlgorithmQuiz
            algorithmId={algorithm.id}
            algorithmName={algorithm.name}
          />

          {/* BOTTOM NAVIGATION — Prev / Next algorithm */}
          <nav className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg flex items-center justify-between gap-4 flex-wrap">
            {prevAlgorithm ? (
              <button
                type="button"
                onClick={() => handleNavigate(prevAlgorithm.id)}
                className="group flex flex-col items-start gap-1 text-left cursor-pointer transition-colors max-w-[45%]"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  Previous
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {prevAlgorithm.name}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextAlgorithm ? (
              <button
                type="button"
                onClick={() => handleNavigate(nextAlgorithm.id)}
                className="group flex flex-col items-end gap-1 text-right cursor-pointer ml-auto transition-colors max-w-[45%]"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  Next
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {nextAlgorithm.name}
                </span>
              </button>
            ) : (
              <Link
                to="/playground/encrypt"
                className="group flex flex-col items-end gap-1 text-right ml-auto transition-colors max-w-[45%]"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  Next
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                  Open Playground
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* SIDEBAR (RIGHT — 1 col) */}
        <aside className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
          {/* SECTION NAVIGATION */}
          <div className="rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg overflow-hidden">
            <div className="p-4 border-b border-[var(--border-main)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <List className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                  Section Navigation
                </h3>
              </div>
            </div>

            <div className="p-3">
              <nav className="space-y-0.5">
                {algorithm.sections.map((section, idx) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => handleScrollToSection(section.id)}
                      className={`group w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-400 font-semibold ring-1 ring-cyan-500/40'
                          : 'text-[var(--text-secondary)] hover:text-cyan-400 hover:bg-cyan-500/5'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                          isActive
                            ? 'bg-cyan-500 text-black border-cyan-500'
                            : 'bg-[var(--surface-secondary)] border-[var(--border-main)] group-hover:border-cyan-500/40 group-hover:text-cyan-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </button>
                  );
                })}

                {algorithm.keyTakeaways && algorithm.keyTakeaways.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleScrollToSection('takeaways')}
                    className={`group w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                      activeSection === 'takeaways'
                        ? 'bg-amber-500/15 text-amber-400 font-semibold ring-1 ring-amber-500/40'
                        : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-amber-500/5'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                        activeSection === 'takeaways'
                          ? 'bg-amber-500 text-black border-amber-500'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      ★
                    </span>
                    <span className="truncate">Key Takeaways</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleScrollToSection('quiz')}
                  className={`group w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                    activeSection === 'quiz'
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold ring-1 ring-cyan-500/40'
                      : 'text-[var(--text-secondary)] hover:text-cyan-400 hover:bg-cyan-500/5'
                  }`}
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                      activeSection === 'quiz'
                        ? 'bg-cyan-500 text-black border-cyan-500'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    ?
                  </span>
                  <span className="truncate">Algorithm Quiz</span>
                </button>
              </nav>
            </div>
          </div>

          {/* QUICK INFO */}
          <div className="rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg overflow-hidden">
            <div className="p-4 border-b border-[var(--border-main)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                  Quick Info
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[var(--text-secondary)]">Category</span>
                <span className="font-mono font-semibold text-[var(--text-primary)] uppercase">
                  {algorithm.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[var(--text-secondary)]">Difficulty</span>
                <Badge
                  variant={
                    algorithm.difficulty === 'beginner'
                      ? 'success'
                      : algorithm.difficulty === 'intermediate'
                      ? 'primary'
                      : 'warning'
                  }
                  size="sm"
                >
                  {algorithm.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[var(--text-secondary)]">Time</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {algorithm.estimatedMinutes} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[var(--text-secondary)]">Sections</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {algorithm.sections.length}
                </span>
              </div>
            </div>
          </div>

          {/* REFERENCES */}
          {algorithm.references && algorithm.references.length > 0 && (
            <SidebarReferences references={algorithm.references} />
          )}
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
   AlgorithmSections — render all sections
============================================================ */
function AlgorithmSections({ sections }: { sections: AlgorithmSection[] }) {
  return (
    <div className="space-y-5">
      {sections.map((section, idx) => (
        <SectionCard key={section.id} section={section} index={idx} />
      ))}
    </div>
  );
}

/* ============================================================
   SectionCard — render one section
============================================================ */
function SectionCard({
  section,
  index,
}: {
  section: AlgorithmSection;
  index: number;
}) {
  return (
    <div
      id={`section-${section.id}`}
      className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4 scroll-mt-24"
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight pt-1">
          {section.title}
        </h2>
      </div>

      <div className="space-y-4">
        <SectionContent content={section.content} />
      </div>

      {section.keyPoints && section.keyPoints.length > 0 && (
        <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2.5">
          <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-cyan-400 block">
            Key Points
          </span>
          <ul className="space-y-2 text-xs text-[var(--text-primary)]">
            {section.keyPoints.map((kp, kIdx) => (
              <li key={kIdx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <InlineText text={kp} className="leading-relaxed" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.callout && (
        <div
          className={`p-4 rounded-xl text-xs leading-relaxed border ${
            section.callout.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-[var(--text-primary)]'
              : section.callout.type === 'tip'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-[var(--text-primary)]'
              : 'bg-cyan-500/10 border-cyan-500/30 text-[var(--text-primary)]'
          }`}
        >
          <span
            className={`font-mono font-bold block mb-1 text-[11px] uppercase tracking-wider ${
              section.callout.type === 'warning'
                ? 'text-amber-400'
                : section.callout.type === 'tip'
                ? 'text-emerald-400'
                : 'text-cyan-400'
            }`}
          >
            {section.callout.title}
          </span>
          <InlineText
            text={section.callout.content}
            className="text-[var(--text-secondary)]"
          />
        </div>
      )}

      {section.codeSnippet && (
        <div className="rounded-xl overflow-hidden border border-[var(--border-main)] bg-[#011627]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E222B] bg-[#0B2942] text-xs font-mono text-[var(--text-secondary)]">
            <span className="text-cyan-400">
              {section.codeSnippet.caption || 'Code Demonstration'}
            </span>
            <span className="text-[10px] uppercase text-[var(--text-secondary)]">
              {section.codeSnippet.language}
            </span>
          </div>
          <CodeBlock
            code={section.codeSnippet.code}
            language={section.codeSnippet.language}
            caption={section.codeSnippet.caption}
          />
        </div>
      )}

      {section.example && (
        <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold text-[var(--text-secondary)] tracking-wider block">
            Practical Example
          </span>
          <SectionContent content={section.example} />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SidebarReferences — render references
============================================================ */
function SidebarReferences({ references }: { references: AlgorithmReference[] }) {
  return (
    <div className="rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg overflow-hidden">
      <div className="p-4 border-b border-[var(--border-main)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
            References
          </h3>
        </div>
        <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1.5">
          {references.length} source{references.length > 1 ? 's' : ''} for this algorithm
        </p>
      </div>

      <div className="p-2 space-y-1">
        {references.map((ref, idx) => {
          const config = REF_TYPE_CONFIG[ref.type] || REF_TYPE_CONFIG.documentation;
          const TypeIcon = config.Icon;

          const innerContent = (
            <div className="flex items-start gap-2">
              <div
                className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center ${config.bg} ${config.border} ${config.text}`}
              >
                <TypeIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[var(--text-primary)] leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {ref.title}
                </p>
                {ref.author && (
                  <p className="text-[9px] font-mono text-[var(--text-secondary)] mt-0.5 truncate">
                    {ref.author}
                    {ref.year && ` · ${ref.year}`}
                  </p>
                )}
              </div>
              {ref.url && (
                <ExternalLink className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
              )}
            </div>
          );

          if (ref.url) {
            return (
              <a
                key={idx}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="group block p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
              >
                {innerContent}
              </a>
            );
          }

          return (
            <div key={idx} className="p-2">
              {innerContent}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-[var(--border-main)]">
        <p className="text-[9px] font-mono text-[var(--text-secondary)] leading-relaxed italic">
          Content paraphrased for educational clarity.
        </p>
      </div>
    </div>
  );
}