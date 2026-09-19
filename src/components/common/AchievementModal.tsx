import { useEffect, useState } from 'react';
import { Trophy, X, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { ACHIEVEMENTS } from '../../data/achievements';
import { Link } from 'react-router-dom';

export function AchievementModal() {
  const { unlockedAchievementPopup, dismissAchievementPopup } = useProgress();

  // ============================================================
  // State untuk kontrol animasi exit
  // ============================================================
  // isVisible = false → trigger exit animation (slide out)
  // Setelah animasi selesai, baru panggil dismissAchievementPopup()
  // ============================================================
  const [isVisible, setIsVisible] = useState(false);

  // Ketika achievement baru muncul → set isVisible = true
  useEffect(() => {
    if (unlockedAchievementPopup) {
      setIsVisible(true);
    }
  }, [unlockedAchievementPopup]);

  // ============================================================
  // AUTO-HIDE setelah 5 detik
  // ============================================================
  // Ketika waktu habis:
  //   1. setIsVisible(false) → trigger animasi slide out
  //   2. Setelah 300ms (durasi animasi), panggil dismiss
  // ============================================================
  useEffect(() => {
    if (!unlockedAchievementPopup) return;

    const hideTimer = setTimeout(() => {
      // Trigger exit animation
      setIsVisible(false);

      // Setelah animasi selesai (300ms), baru hapus dari state
      setTimeout(() => {
        dismissAchievementPopup();
      }, 300);
    }, 5000); // 5 detik

    return () => clearTimeout(hideTimer);
  }, [unlockedAchievementPopup, dismissAchievementPopup]);

  // ============================================================
  // Handler manual dismiss (klik X)
  // ============================================================
  const handleManualDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      dismissAchievementPopup();
    }, 300);
  };

  // Kalau tidak ada achievement, jangan render apa-apa
  if (!unlockedAchievementPopup) return null;

  const achievement = ACHIEVEMENTS.find(a => a.id === unlockedAchievementPopup);
  if (!achievement) return null;

  return (
    <div
      id="achievement-unlocked-modal"
      // ============================================================
      // POSISI + ANIMASI TRANSISI
      // ============================================================
      // - top-6 right-6     → atas kanan
      // - z-50              → di atas konten
      // - max-w-sm w-full   → lebar maksimal 24rem
      // - transition-all    → smooth transition untuk semua property
      // - duration-300      → 300ms durasi animasi
      // - ease-out          → timing function (decelerate)
      //
      // KONDISI:
      // - isVisible = true  → masuk: translate-x-0, opacity-100
      // - isVisible = false → keluar: translate-x-full, opacity-0
      //                       (slide ke kanan = keluar layar)
      //                       Atau translate-x-[-120%] untuk lebih jauh
      // ============================================================
      className={`fixed top-6 right-6 z-50 max-w-sm w-full transition-all duration-300 ease-out ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="relative overflow-hidden bg-[var(--surface-main)] border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl shadow-amber-500/10">
        {/* Dekorasi blur di pojok kanan atas */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* ============================================================
            PROGRESS BAR untuk auto-hide (5 detik)
        ============================================================ */}
        {/* - linear timing → bergerak konstan (bukan ease)
            - 5s duration   → sesuai dengan auto-hide timer
            - from 100% to 0% → menyusut dari kanan ke kiri */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            style={{
              animation: 'achievementProgress 5s linear forwards',
            }}
          />
        </div>

        {/* ============================================================
            HEADER: Icon + Title + Close Button
        ============================================================ */}
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Achievement Unlocked
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {achievement.title}
              </h4>
            </div>
          </div>

          <button
            onClick={handleManualDismiss}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================
            DESCRIPTION
        ============================================================ */}
        <p className="relative text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
          {achievement.description}
        </p>

        {/* ============================================================
            FOOTER: XP + View Achievements link
        ============================================================ */}
        <div className="relative flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-main)]">
          <span className="text-xs font-mono font-bold text-emerald-400">
            +{achievement.xp} XP
          </span>
          <Link
            to="/progress"
            onClick={handleManualDismiss}
            className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View Achievements <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}