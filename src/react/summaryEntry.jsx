import React from 'react';
import { createRoot } from 'react-dom/client';
import Summary from './Summary.jsx';

const rootElement = document.getElementById('summary-root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Summary />
    </React.StrictMode>
  );
}
