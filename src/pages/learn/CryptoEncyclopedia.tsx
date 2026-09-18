import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Library, ArrowLeft, Calendar, BookMarked } from 'lucide-react';
import { TimelineView } from '../../components/encyclopedia/TimelineView';
import { GlossaryView } from '../../components/encyclopedia/GlossaryView';
import { TIMELINE_EVENTS } from '../../data/timeline';
import { GLOSSARY_TERMS } from '../../data/glossary';

type Tab = 'timeline' | 'glossary';

export function CryptoEncyclopedia() {
  const [activeTab, setActiveTab] = useState<Tab>('timeline');

  const handleTermClick = (termId: string) => {
    setActiveTab('glossary');
    // Scroll to top after switching
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <Link
        to="/learn"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Learn Hub
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Library className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            Crypto Encyclopedia
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
          History & Glossary of Cryptography
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Explore 2,500 years of cryptographic evolution on an interactive timeline, and browse{' '}
          <strong className="text-amber-400">{GLOSSARY_TERMS.length} terms</strong> in a searchable glossary — from
          Spartan scytales to post-quantum lattice cryptography.
        </p>

        <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] max-w-2xl">
          {TIMELINE_EVENTS.length} historical events · {GLOSSARY_TERMS.length} glossary terms ·
          cross-linked to lessons and algorithms.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-cyan-500 text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" strokeWidth={2.5} />
            Glossary
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'timeline' && (
          <TimelineView onTermClick={handleTermClick} />
        )}
        {activeTab === 'glossary' && <GlossaryView />}
      </div>
    </div>
  );
}