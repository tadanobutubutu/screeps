import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(
  document.documentElement.setAttribute('lang', 'en'),
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add this function to handle SVG accessibility
function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  // Check if SVG already has an accessible name
  if (svgElement.getAttribute('aria-label') ||
      svgElement.querySelector('title') ||
      svgElement.getAttribute('aria-hidden') === 'true') {
    return;
  }

  // If decorative, mark as hidden
  if (svgElement.getAttribute('role') === 'presentation') {
    svgElement.setAttribute('aria-hidden', 'true');
  } else {
    // Otherwise provide a default accessible name
    svgElement.setAttribute('aria-label', 'Application icon');
  }
}

// Run accessibility check when the app loads
document.addEventListener('DOMContentLoaded', () => {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    makeSvgAccessible(svg);
  });
});