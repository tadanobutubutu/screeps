import './styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('__next');
const root = createRoot(container);

root.render(
  <StrictMode>
    {/* Application content is rendered by Next.js */}
  </StrictMode>
);