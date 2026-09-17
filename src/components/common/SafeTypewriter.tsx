import React, { ReactNode } from 'react';

interface SafeTypewriterProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface SafeTypewriterState {
  hasError: boolean;
}

/**
 * Error Boundary khusus untuk typewriter.
 * Kalau animation crash (mis. karena browser translate),
 * render fallback text statis.
 */
export class SafeTypewriter extends React.Component<
  SafeTypewriterProps,
  SafeTypewriterState
> {
  constructor(props: SafeTypewriterProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SafeTypewriterState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log ringan, tidak spam console
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SafeTypewriter] caught error, using fallback:', error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}