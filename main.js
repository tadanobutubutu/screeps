// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Existing code (preserved)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle SVG accessibility
const makeSvgAccessible = (svgElement, label) => {
  if (!svgElement) return;

  // Add aria-label if not already present
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', label);
  }

  // Ensure there's a title element for screen readers
  if (!svgElement.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = label;
    svgElement.prepend(title);
  }
};

// Function to initialize accessibility for all SVGs
const initSvgAccessibility = () => {
  // Find all SVGs in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    // Skip if already accessible
    if (svg.getAttribute('aria-hidden') === 'true') return;

    // Determine appropriate label based on context
    let label = 'Graphic element';

    // Check if this is a favicon SVG
    if (svg.closest('link[rel="icon"]')) {
      label = 'Website favicon';
    }
    // Check if this is in the metadata
    else if (svg.closest('head')) {
      label = 'Metadata graphic';
    }

    makeSvgAccessible(svg, label);
  });
};

// Run accessibility initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSvgAccessibility);
} else {
  initSvgAccessibility();
}

// Export all existing functions if they exist
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Preserve any existing exports
    ...(module.exports || {}),
    // Add new exports if needed
    makeSvgAccessible,
    initSvgAccessibility
  };
}