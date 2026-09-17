import { useState, useEffect, useRef } from 'react';

/**
 * Typewriter hook with browser-translate safety.
 *
 * Detects if the browser is translating the page and gracefully
 * falls back to a static text to prevent React DOM crash.
 */
export function useTypewriter(
  phrases: string[],
  typingSpeed = 70,
  deletingSpeed = 40,
  holdDuration = 1800
) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTranslateActive, setIsTranslateActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- Detect browser translation ----
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectTranslate = () => {
      const html = document.documentElement;
      const body = document.body;

      // Heuristic 1: Google Translate sets a class or attribute
      const googleTranslateActive =
        html.classList.contains('translated-ltr') ||
        html.classList.contains('translated-rtl') ||
        body?.classList.contains('translated-ltr') ||
        body?.classList.contains('translated-rtl');

      // Heuristic 2: <html lang> was changed by translate widget
      const langChanged = html.getAttribute('lang') !== 'en';

      // Heuristic 3: presence of translate-specific elements
      const hasTranslateFrame = !!document.querySelector(
        '.skiptranslate, #goog-gt-tt, iframe.goog-te-banner-frame'
      );

      if (googleTranslateActive || hasTranslateFrame) {
        setIsTranslateActive(true);
      } else if (langChanged) {
        setIsTranslateActive(true);
      }
    };

    detectTranslate();

    // Re-check when class/lang changes
    const observer = new MutationObserver(detectTranslate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'lang'],
    });
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    // Re-check on visibility (translate sometimes triggers late)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') detectTranslate();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ---- Typewriter loop (only when translate is NOT active) ----
  useEffect(() => {
    // If translate is active, freeze animation with full first phrase
    if (isTranslateActive) {
      setDisplayText(phrases[0]);
      return;
    }

    const currentPhrase = phrases[phraseIndex];
    if (!currentPhrase) return;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), holdDuration);
      }
    } else {
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    displayText,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    holdDuration,
    isTranslateActive,
  ]);

  return {
    displayText,
    isTranslateActive,
    /** Full phrase to render as static fallback */
    fallbackText: phrases[0],
  };
}