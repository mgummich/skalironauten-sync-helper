import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from './modules/ui/AppShell';
import { initMoodLibrary } from './modules/mood/moodLibrary';
import './index.css';

// Uploaded mood images need their object URLs before the first render, so that
// getMoodImageUrl() stays synchronous everywhere else.
initMoodLibrary().finally(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppShell />
    </StrictMode>
  )
);
