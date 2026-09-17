import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import { Dashboard } from './pages/Dashboard';
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

export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Navbar />
          <main className="flex-1 pb-12">
            <Routes>
              {/* Home / Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Learn Section */}
              <Route path="/learn" element={<LearnIndex />} />
              <Route path="/learn/fundamentals" element={<FundamentalsList />} />
              <Route path="/learn/fundamentals/:id" element={<LessonDetail />} />
              <Route path="/learn/algorithms" element={<AlgorithmsList />} />
              <Route path="/learn/algorithms/:id" element={<AlgorithmDetail />} />
              <Route path="/learn/roadmap" element={<RoadmapPage />} />

              {/* Playground Section */}
              <Route path="/playground" element={<PlaygroundIndex />} />
              <Route path="/playground/encrypt" element={<EncryptPlayground />} />
              <Route path="/playground/hash" element={<HashPlayground />} />
              <Route path="/playground/analyze" element={<AnalyzePlayground />} />

              {/* Challenges Section */}
              <Route path="/challenges" element={<ChallengesIndex />} />
              <Route path="/challenges/quiz" element={<QuizPage />} />
              <Route path="/challenges/puzzle" element={<PuzzlePage />} />
              <Route path="/challenges/attack" element={<AttackSimPage />} />

              {/* Progress & Profile */}
              <Route path="/progress" element={<ProgressPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ProgressProvider>
    </BrowserRouter>
  );
}
