import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

const isDev = import.meta.env.DEV;

createRoot(document.getElementById('root')!).render(
  isDev ? (
    <StrictMode>
      <ErrorBoundary maxAutoRetries={1}>
        <App />
      </ErrorBoundary>
    </StrictMode>
  ) : (
    <ErrorBoundary maxAutoRetries={2}>
      <App />
    </ErrorBoundary>
  )
);