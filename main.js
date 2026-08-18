// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved as-is)
const existingFunction = () => {
  // ... existing implementation ...
};

// New function to handle SVG accessibility
const makeSvgAccessible = (svgElement) => {
  if (!svgElement) return;

  // Add aria-hidden if the SVG is decorative
  if (svgElement.getAttribute('aria-hidden') !== 'true') {
    // Add a title element if it doesn't exist
    if (!svgElement.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'Accessible SVG';
      svgElement.insertBefore(title, svgElement.firstChild);
    }

    // Or add aria-label if preferred
    if (!svgElement.getAttribute('aria-label')) {
      svgElement.setAttribute('aria-label', 'Accessible SVG');
    }
  }
};

// Initialize the app
const initApp = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);

    // Make SVGs accessible after render
    setTimeout(() => {
      const svgs = document.querySelectorAll('svg');
      svgs.forEach(makeSvgAccessible);
    }, 0);
  }
};

// Export existing functions
export { existingFunction };

// Initialize the app
initApp();