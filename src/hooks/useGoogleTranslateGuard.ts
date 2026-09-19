import { useEffect } from 'react';

/**
 * watchForTranslateActivation
 *
 * Detects if Google Translate is active on the page. Uses both class
 * detection (translated-ltr / translated-rtl on <html>) and DOM inspection
 * (<font class="google-src-text"> nodes). MutationObserver catches the
 * activation early, before the user clicks any link.
 */
function watchForTranslateActivation(onChange: (active: boolean) => void): () => void {
  const html = document.documentElement;

  const check = () => {
    const active =
      html.classList.contains('translated-ltr') ||
      html.classList.contains('translated-rtl') ||
      html.querySelector('font.google-src-text') !== null;
    onChange(active);
  };

  check();

  const observer = new MutationObserver(check);
  observer.observe(html, {
    attributes: true,
    attributeFilter: ['class'],
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}

/**
 * useGoogleTranslateGuard
 *
 * Two-layer protection against Google Translate + React crashes on SPA navigation.
 */
export function useGoogleTranslateGuard() {
  useEffect(() => {
    let isTranslated = false;

    const stopWatching = watchForTranslateActivation(active => {
      isTranslated = active;
    });

    // Layer 1 — intercept clicks on <a> before React Router handles them
    const clickHandler = (event: MouseEvent) => {
      if (!isTranslated) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      if (anchor.target === '_blank') return;
      if (href.startsWith('http://') || href.startsWith('https://')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('#')) return;

      event.preventDefault();
      event.stopPropagation();

      const url = new URL(anchor.href, window.location.origin);
      window.location.replace(url.toString());
    };

    document.addEventListener('click', clickHandler, true);

    // Layer 2 — hashchange / popstate watcher (browser back/forward)
    const navHandler = () => {
      if (!isTranslated) return;
      window.location.reload();
    };

    window.addEventListener('hashchange', navHandler);
    window.addEventListener('popstate', navHandler);

    return () => {
      document.removeEventListener('click', clickHandler, true);
      window.removeEventListener('hashchange', navHandler);
      window.removeEventListener('popstate', navHandler);
      stopWatching();
    };
  }, []);
}