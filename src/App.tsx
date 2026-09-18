import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AchievementModal } from './components/common/AchievementModal';

import { Dashboard } from './pages/Dashboard';
import { AboutPage } from './pages/AboutPage';
import { LearnIndex } from './pages/learn/LearnIndex';
import { FundamentalsList } from './pages/learn/FundamentalsList';
import { LessonDetail } from './pages/learn/LessonDetail';
import { AlgorithmsList } from './pages/learn/AlgorithmsList';
import { AlgorithmDetail } from './pages/learn/AlgorithmDetail';
import { RoadmapPage } from './pages/learn/RoadmapPage';
import { PlaygroundIndex } from './pages/playground/PlaygroundIndex';
import { EncryptPlayground } from './pages/playground/EncryptPlayground';
import { HashPlayground } from './pages/playground/HashPlayground';
import { AnalyzePlayground } from './pages/playground/AnalyzePlayground';
import { ChallengesIndex } from './pages/challenges/ChallengesIndex';
import { QuizPage } from './pages/challenges/QuizPage';
import { PuzzlePage } from './pages/challenges/PuzzlePage';
import { AttackSimPage } from './pages/challenges/AttackSimPage';
import { ProgressPage } from './pages/ProgressPage';
import { ReferencesPage } from './pages/learn/ReferencesPage';

export default function App() {
  return (
    <HashRouter>
      <ProgressProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300 relative">
          {/* Global background layers */}
          <div className="fixed inset-0 bg-tech-grid pointer-events-none opacity-40 z-0" />
          <div className="fixed top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />
          <div className="fixed bottom-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />

          <Navbar />
          <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about/references" element={<ReferencesPage />} />

              <Route path="/learn" element={<LearnIndex />} />
              <Route path="/learn/fundamentals" element={<FundamentalsList />} />
              <Route path="/learn/fundamentals/:id" element={<LessonDetail />} />
              <Route path="/learn/algorithms" element={<AlgorithmsList />} />
              <Route path="/learn/algorithms/:id" element={<AlgorithmDetail />} />
              <Route path="/learn/roadmap" element={<RoadmapPage />} />

              <Route path="/playground" element={<PlaygroundIndex />} />
              <Route path="/playground/encrypt" element={<EncryptPlayground />} />
              <Route path="/playground/hash" element={<HashPlayground />} />
              <Route path="/playground/analyze" element={<AnalyzePlayground />} />

              <Route path="/challenges" element={<ChallengesIndex />} />
              <Route path="/challenges/quiz" element={<QuizPage />} />
              <Route path="/challenges/puzzle" element={<PuzzlePage />} />
              <Route path="/challenges/attack" element={<AttackSimPage />} />

              <Route path="/progress" element={<ProgressPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />

          {/* Global Achievement Popup */}
          <AchievementModal />
        </div>
      </ProgressProvider>
    </HashRouter>
  );
}