// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Add accessible name to SVG in layout.tsx
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="32"
    height="32"
  >
    <title>Application Favicon</title>
    <circle cx="50" cy="50" r="40" fill="#61DAFB" />
  </svg>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions and components
export { FaviconSVG };
export default App;