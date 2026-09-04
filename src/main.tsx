import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initMoodLibrary } from './modules/mood/moodLibrary';
import './index.css';

// Uploaded mood images need their object URLs before the first render, so that
// getMoodImageUrl() stays synchronous everywhere else.
initMoodLibrary().finally(() =>
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
);
