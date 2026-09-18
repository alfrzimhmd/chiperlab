import { Link } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Terminal,
  Trophy,
  Zap,
  ArrowRight,
  Key,
  Target,
  Lock,
  Hash,
  Puzzle,
  BookMarked,
  Calendar,
  Library,
  Award,
  FileText,
  Activity,
} from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useTypewriter } from '../hooks/useTypewriter';
import { SafeTypewriter } from '../components/common/SafeTypewriter';
import { LESSONS } from '../data/lessons';
import { ALGORITHMS } from '../data/algorithms';
import { ACHIEVEMENTS } from '../data/achievements';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function Dashboard() {
  const { progress } = useProgress();

  const headlines = [
    'Welcome to ChiperLab',
    'Learn Cryptography Interactively',
    'From Caesar to Modern AES',
    'Understand. Experiment. Solve.',
    'Your Journey Begins Here',
  ];

  const {
    displayText: typedHeadline,
    isTranslateActive,
    fallbackText,
  } = useTypewriter(headlines, 65, 35, 1800);

  const totalLessons = LESSONS.length;
  const completedLessonsCount = progress.completedLessons.length;
  const exploredAlgosCount = progress.exploredAlgorithms.length;
  const totalAlgos = ALGORITHMS.length;
  const completedChallengesCount = progress.completedChallenges.length;

  const nextLesson =
    LESSONS.find(l => !progress.completedLessons.includes(l.id)) || LESSONS[0];
  const nextLessonNumber = nextLesson.order;
  const lessonProgressPercent = Math.round(
    (completedLessonsCount / totalLessons) * 100
  );

  // XP progress toward next rank
  const xpTargets = [
    { min: 0, target: 150, label: 'Cryptography Apprentice', color: 'text-teal-400' },
    { min: 150, target: 400, label: 'Security Scholar', color: 'text-cyan-400' },
    { min: 400, target: 400, label: 'Master Cryptographer', color: 'text-amber-400' },
  ];
  const xpRank =
    progress.totalXp >= 400
      ? xpTargets[2]
      : progress.totalXp >= 150
      ? xpTargets[1]
      : xpTargets[0];
  const xpProgressPercent = Math.min(
    100,
    Math.round((progress.totalXp / xpRank.target) * 100)
  );

  // Latest achievement
  const unlockedAchievements = progress.achievements || [];
  const latestAchievementId = unlockedAchievements[unlockedAchievements.length - 1];
  const latestAchievement = ACHIEVEMENTS.find(a => a.id === latestAchievementId);

  const highlightWords = [
    'ChiperLab',
    'Cryptography',
    'Caesar',
    'AES',
    'Understand',
    'Experiment',
    'Solve',
    'Journey',
  ];

  const renderHeadline = (text: string, withCursor: boolean) => (
    <>
      {text.split(' ').map((word, idx) => {
        const isAccent = highlightWords.some(hw =>
          word.toLowerCase().includes(hw.toLowerCase())
        );
        return (
          <span key={idx} className={isAccent ? 'text-cyan-400' : ''}>
            {word}{' '}
          </span>
        );
      })}
      {withCursor && (
        <span className="inline-block w-[3px] h-[0.9em] bg-cyan-400 ml-1 align-middle animate-[cursorBlink_1s_steps(2)_infinite]" />
      )}
    </>
  );

  return (
    <div className="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="fixed inset-0 bg-tech-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* ============================================================
            HERO
        ============================================================ */}
        <section className="text-center max-w-6xl mx-auto space-y-7 pb-16 sm:pb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] font-medium">
              Interactive Cryptography Academy
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15] min-h-[1.4em] sm:min-h-[1.3em] flex items-center justify-center">
            <SafeTypewriter
              fallback={
                <span className="inline-block">
                  {renderHeadline(fallbackText, false)}
                </span>
              }
            >
              <span className="inline-block">
                {isTranslateActive
                  ? renderHeadline(fallbackText, false)
                  : renderHeadline(typedHeadline, true)}
              </span>
            </SafeTypewriter>
          </h1>

          {/* Description */}
          <div className="space-y-5 max-w-7xl mx-auto">
            <p className="text-xl sm:text-2xl text-[var(--text-secondary)] leading-[1.6] font-light">
              Learn Cryptography by{' '}
              <strong className="text-[var(--text-primary)] font-semibold">Understanding</strong>,{' '}
              <strong className="text-[var(--text-primary)] font-semibold">Experimenting</strong>, and{' '}
              <strong className="text-[var(--text-primary)] font-semibold">Solving</strong> —
              all in one interactive academy.
            </p>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-[1.75]">
              From ancient Caesar shifts to modern AES-GCM and RSA-OAEP — explore how secret
              communication evolved across millennia, and why it still matters today. Every
              concept is brought to life through hands-on tools: transform plaintext into
              ciphertext, inspect bitwise XOR streams character by character, simulate
              brute-force attacks in real time, perform statistical frequency analysis, and
              leverage the same native Web Crypto APIs that protect the modern internet.
            </p>

            <p className="text-base text-[var(--text-secondary)]/85 leading-[1.7] italic">
              No prior mathematics or cryptography background required — just curiosity, a
              browser, and the willingness to break a few codes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link to={`/learn/fundamentals/${nextLesson.id}`}>
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                {completedLessonsCount === 0 ? 'Start Learning' : 'Continue Next Lesson'}
              </Button>
            </Link>
            <Link to="/playground">
              <Button variant="outline" size="md">
                Launch Playground
              </Button>
            </Link>
          </div>

          {/* Feature highlights row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 px-5 py-5 rounded-xl border border-[var(--border-main)] bg-[var(--surface-main)]/60 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Lock className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-[var(--text-primary)]">
                  {ALGORITHMS.length} Algorithms
                </p>
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  Classical → Modern
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-5 rounded-xl border border-[var(--border-main)] bg-[var(--surface-main)]/60 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-[var(--text-primary)]">
                  {LESSONS.length} Lessons
                </p>
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  Three Tracks
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-5 rounded-xl border border-[var(--border-main)] bg-[var(--surface-main)]/60 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Trophy className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-[var(--text-primary)]">
                  Interactive Lab
                </p>
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  100% Client-Side
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            STATS
        ============================================================ */}
        <section className="space-y-5 mb-14">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
                01 — YOUR JOURNEY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1">
                Learning Overview
              </h2>
            </div>
            <Link
              to="/progress"
              className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
            >
              VIEW DETAILS →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="LESSONS"
              sublabel="Completed"
              value={completedLessonsCount}
              total={totalLessons}
              icon={<BookOpen className="w-5 h-5" />}
              accent="cyan"
              progress={completedLessonsCount}
              progressMax={totalLessons}
            />
            <StatCard
              label="ALGORITHMS"
              sublabel="Explored"
              value={exploredAlgosCount}
              total={totalAlgos}
              icon={<Key className="w-5 h-5" />}
              accent="teal"
              progress={exploredAlgosCount}
              progressMax={totalAlgos}
            />
            <StatCard
              label="CHALLENGES"
              sublabel="Solved"
              value={completedChallengesCount}
              icon={<Trophy className="w-5 h-5" />}
              accent="amber"
              progress={completedChallengesCount}
              progressMax={10}
            />
            <StatCard
              label="ACADEMY"
              sublabel="Total XP"
              value={progress.totalXp}
              icon={<Zap className="w-5 h-5" />}
              accent="amber"
              progress={progress.totalXp}
              progressMax={xpRank.target}
              customFooter={xpRank.label}
              customFooterColor={xpRank.color}
            />
          </div>
        </section>

        {/* ============================================================
            MAIN GRID
        ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Your Path */}
            <section className="space-y-5">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    02 — RECOMMENDED
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1">
                    Continue Your Path
                  </h2>
                </div>
                <Badge variant="primary">{nextLesson.difficulty}</Badge>
              </div>

              <div className="relative rounded-2xl border border-[var(--border-main)] bg-[var(--surface-main)] p-6 sm:p-7 shadow-lg hover:border-cyan-500/40 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <BookOpen className="w-6 h-6" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[var(--text-secondary)] tracking-wider">
                        LESSON #{String(nextLesson.order).padStart(2, '0')}
                      </span>
                      <span className="text-[var(--border-main)]">•</span>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {nextLesson.estimatedMinutes} min
                      </span>
                      <span className="text-[var(--border-main)]">•</span>
                      <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-400" />
                        {nextLesson.xpReward} XP
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                      {nextLesson.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                      {nextLesson.description}
                    </p>

                    <div className="mb-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[var(--text-secondary)]">
                          Lesson <strong className="text-cyan-400">{nextLessonNumber}</strong> of{' '}
                          {totalLessons}
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          {lessonProgressPercent}% complete
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-700"
                          style={{ width: `${lessonProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    <Link to={`/learn/fundamentals/${nextLesson.id}`}>
                      <Button
                        size="md"
                        icon={<ArrowRight className="w-4 h-4" />}
                        iconPosition="right"
                      >
                        Start Lesson
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Launch — 6 cards */}
            <section className="space-y-5">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest block">
                  03 — EXPLORE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1">
                  Quick Launch
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  Jump straight into hands-on experimentation and challenge yourself.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-fr">
                <QuickCard
                  to="/playground"
                  title="Interactive Playground"
                  desc="Encrypt and decrypt with Caesar, Atbash, Vigenère, XOR, AES-GCM, and RSA-OAEP — all in real time."
                  icon={<Terminal className="w-6 h-6" strokeWidth={2.5} />}
                  accent="cyan"
                />
                <QuickCard
                  to="/playground/hash"
                  title="Cryptographic Hashing"
                  desc="Generate SHA-256 and SHA-512 digests and observe the Avalanche Effect live."
                  icon={<Hash className="w-6 h-6" strokeWidth={2.5} />}
                  accent="teal"
                />
                <QuickCard
                  to="/challenges/quiz"
                  title="Knowledge Quiz"
                  desc="Test your understanding with interactive questions across all cryptography topics."
                  icon={<Trophy className="w-6 h-6" strokeWidth={2.5} />}
                  accent="amber"
                />
                <QuickCard
                  to="/challenges/puzzle"
                  title="Cipher Puzzles"
                  desc="Decrypt intercepted messages using classical ciphers, XOR, and hash challenges."
                  icon={<Puzzle className="w-6 h-6" strokeWidth={2.5} />}
                  accent="purple"
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Did You Know */}
            <section className="space-y-4">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest block">
                  04 — DID YOU KNOW?
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mt-1">
                  Core Security Concept
                </h2>
              </div>

              <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--surface-main)] p-6 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                      Kerckhoffs's Principle
                    </h3>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">
                      ESTABLISHED 1883
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic mb-3">
                  "A cryptographic system should be secure even if everything about the system,
                  except the key, is public knowledge."
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Modern security strictly forbids{' '}
                  <em className="text-[var(--text-primary)]">security through obscurity</em>.
                  Open mathematical scrutiny is what keeps AES and RSA robust against attacks.
                </p>
              </div>
            </section>

            {/* Latest Achievement — FIXED */}
            <section className="space-y-4">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400 tracking-widest block">
                  05 — LATEST ACHIEVEMENT
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mt-1">
                  Milestone Unlocked
                </h2>
              </div>

              <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--surface-main)] p-5 shadow-lg">
                {latestAchievement ? (
                  <div className="flex items-start gap-3">
                    {/* FIX: pakai Award icon, bukan teks badge */}
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Award className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight mb-1">
                        {latestAchievement.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
                        {latestAchievement.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400">
                        <Zap className="w-2.5 h-2.5 fill-amber-400" />+{latestAchievement.xp} XP
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-center justify-center text-[var(--text-secondary)]">
                      <Award className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight mb-1">
                        No achievement yet
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                        Complete your first lesson to unlock the "First Steps" achievement.
                      </p>
                      <Link to={`/learn/fundamentals/${nextLesson.id}`}>
                        <Button size="sm" variant="outline">
                          Start Learning
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Encyclopedia — 4 links */}
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
                    <Library className="w-3.5 h-3.5" />
                    06 — LIBRARY
                  </span>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mt-1">
                    Reference & Resources
                  </h2>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--surface-main)] shadow-lg overflow-hidden">
                {/* Timeline */}
                <Link
                  to="/learn/encyclopedia"
                  className="group flex items-center justify-between p-4 hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Calendar className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-amber-400 transition-colors block">
                        Interactive Timeline
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                        25 events · 2,500 years
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Link>

                {/* Glossary */}
                <Link
                  to="/learn/encyclopedia"
                  className="group flex items-center justify-between p-4 border-t border-[var(--border-main)] hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <BookMarked className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-cyan-400 transition-colors block">
                        Searchable Glossary
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                        100+ terms · 8 categories
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Link>

                {/* ← BARU: References */}
                <Link
                  to="/about/references"
                  className="group flex items-center justify-between p-4 border-t border-[var(--border-main)] hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-indigo-400 transition-colors block">
                        Master References
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                        NIST · RFC · Papers · Books
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Link>

                {/* ← BARU: Progress */}
                <Link
                  to="/progress"
                  className="group flex items-center justify-between p-4 border-t border-[var(--border-main)] hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Activity className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-emerald-400 transition-colors block">
                        My Progress & XP
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                        Achievements · Stats
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   StatCard
============================================================ */
interface StatCardProps {
  label: string;
  sublabel: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
  accent: 'cyan' | 'teal' | 'amber';
  progress?: number;
  progressMax?: number;
  customFooter?: string;
  customFooterColor?: string;
}

function StatCard({
  label,
  sublabel,
  value,
  total,
  icon,
  accent,
  progress,
  progressMax,
  customFooter,
  customFooterColor,
}: StatCardProps) {
  const accents = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      bar: 'bg-cyan-400',
      hover: 'hover:border-cyan-500/40',
    },
    teal: {
      text: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
      bar: 'bg-teal-400',
      hover: 'hover:border-teal-500/40',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      bar: 'bg-amber-400',
      hover: 'hover:border-amber-500/40',
    },
  };
  const a = accents[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[var(--border-main)] bg-[var(--surface-main)] p-6 shadow-lg ${a.hover} transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            {label}
          </p>
          <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
            {sublabel}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${a.bg} ${a.border} border flex items-center justify-center ${a.text} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-4xl font-extrabold tracking-tight ${a.text}`}>{value}</span>
        {total !== undefined && (
          <span className="text-sm text-[var(--text-secondary)] font-mono">/ {total}</span>
        )}
      </div>
      <div className="mt-auto">
        {progress !== undefined && progressMax !== undefined && (
          <div className="h-2 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden mb-3">
            <div
              className={`h-full ${a.bar} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(100, (progress / progressMax) * 100)}%` }}
            />
          </div>
        )}
        {customFooter && (
          <p className={`text-xs font-mono font-bold ${customFooterColor || a.text}`}>
            {customFooter}
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   QuickCard
============================================================ */
interface QuickCardProps {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: 'cyan' | 'teal' | 'amber' | 'purple' | 'rose';
}

function QuickCard({ to, title, desc, icon, accent }: QuickCardProps) {
  const accents = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      hover: 'hover:border-cyan-500/40',
      hoverText: 'group-hover:text-cyan-400',
    },
    teal: {
      text: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
      hover: 'hover:border-teal-500/40',
      hoverText: 'group-hover:text-teal-400',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      hover: 'hover:border-amber-500/40',
      hoverText: 'group-hover:text-amber-400',
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      hover: 'hover:border-purple-500/40',
      hoverText: 'group-hover:text-purple-400',
    },
    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      hover: 'hover:border-rose-500/40',
      hoverText: 'group-hover:text-rose-400',
    },
  };
  const a = accents[accent];

  return (
    <Link
      to={to}
      className={`group rounded-2xl border border-[var(--border-main)] bg-[var(--surface-main)] p-6 shadow-lg ${a.hover} transition-all duration-300 flex flex-col h-full`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${a.bg} ${a.border} border flex items-center justify-center ${a.text} mb-5 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3
        className={`text-base font-bold text-[var(--text-primary)] ${a.hoverText} transition-colors mb-2`}
      >
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">{desc}</p>
    </Link>
  );
}