// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
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

// Call this function when the app loads
document.addEventListener('DOMContentLoaded', () => {
  // Find all SVG elements and make them accessible
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(makeSvgAccessible);
});

// Export any existing functions if they were in the original file
// (Assuming there were exports in the original file)
export { makeSvgAccessible };