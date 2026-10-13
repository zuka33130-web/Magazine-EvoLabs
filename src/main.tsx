import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { EvoErrorBoundary } from './components/common/EvoErrorBoundary';
import { EvoAuthProvider } from './auth/EvoAuthProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EvoErrorBoundary>
      <EvoAuthProvider>
        <App />
      </EvoAuthProvider>
    </EvoErrorBoundary>
  </StrictMode>,
);

