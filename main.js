// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add this function to handle SVG accessibility
function makeSvgAccessible(svgElement) {
  if (svgElement && !svgElement.getAttribute('aria-hidden')) {
    svgElement.setAttribute('aria-hidden', 'true');
  }
}

// Call this function when the app loads to ensure all SVGs are accessible
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(makeSvgAccessible);
});

// Export any existing functions if they exist in the original file
// For example, if there were existing exports:
export { someExistingFunction } from './someModule';