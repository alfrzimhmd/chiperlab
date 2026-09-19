import { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Loader2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  /**
   * Max number of automatic reload attempts before showing the fallback UI.
   * Default: 1
   *
   * How it works:
   *  - When an error is caught, we increment a counter in sessionStorage.
   *  - If counter < maxAutoRetries → reload the page (transient error recovery).
   *  - If counter >= maxAutoRetries → show fallback UI.
   *  - On successful render, the counter is reset.
   */
  maxAutoRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

const STORAGE_KEY = '__error_boundary_retry__';

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    retryCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('[ErrorBoundary]', error, info);

    const maxRetries = this.props.maxAutoRetries ?? 1;
    const retryCountRaw = sessionStorage.getItem(STORAGE_KEY);
    const retryCount = retryCountRaw ? parseInt(retryCountRaw, 10) : 0;

    if (retryCount < maxRetries) {
      // Increment retry counter and reload
      sessionStorage.setItem(STORAGE_KEY, String(retryCount + 1));

      // Small delay so React can commit the "reloading" UI briefly
      setTimeout(() => {
        window.location.reload();
      }, 150);
    } else {
      // Max retries exceeded → show fallback
      this.setState({ retryCount });
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  handleGoHome = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      // Successful render → reset retry counter
      sessionStorage.removeItem(STORAGE_KEY);
      return this.props.children;
    }

    // Check if we're still in auto-retry mode
    const maxRetries = this.props.maxAutoRetries ?? 1;
    const retryCountRaw = sessionStorage.getItem(STORAGE_KEY);
    const retryCount = retryCountRaw ? parseInt(retryCountRaw, 10) : 0;

    // If still auto-retrying → show minimal "reloading" state (no fallback UI)
    if (retryCount < maxRetries) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface-main)] p-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-mono">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Recovering…</span>
          </div>
        </div>
      );
    }

    // Fallback UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-main)] p-6">
        <div className="max-w-lg w-full p-6 rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-400" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-400">
                Something went wrong
              </h1>
              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                The page encountered an unexpected error
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              This often happens when a browser translation extension (Google
              Translate, etc.) modifies the page structure while React is running.
            </p>
            <p>
              Try reloading the page, or disable auto-translate for this site.
            </p>
          </div>

          {/* Technical details */}
          {this.state.error && (
            <details className="text-[11px] font-mono">
              <summary className="cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] select-none">
                Show technical details
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-[#0A0C10] border border-[#1E222B] text-rose-300 overflow-auto text-[10px] leading-relaxed max-h-40">
                {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
            <button
              type="button"
              onClick={this.handleReload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reload Page
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}