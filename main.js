// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved as-is)
export function existingFunction() {
  // ... existing implementation
}

// New function to handle SVG accessibility
export function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  // Check if SVG already has accessibility attributes
  if (svgElement.getAttribute('aria-label') ||
      svgElement.getAttribute('aria-hidden') ||
      svgElement.querySelector('title')) {
    return;
  }

  // Add aria-hidden if decorative, or aria-label if functional
  if (svgElement.dataset.decorative === 'true') {
    svgElement.setAttribute('aria-hidden', 'true');
  } else {
    svgElement.setAttribute('aria-label', 'Application icon');
  }
}

// Initialize the app
export function initApp() {
  const container = document.getElementById('root');
  if (!container) return;

  const root = createRoot(container);
  root.render(<App />);

  // Make sure SVGs are accessible after render
  setTimeout(() => {
    document.querySelectorAll('svg').forEach(makeSvgAccessible);
  }, 0);
}

// Existing App component (preserved as-is)
function App() {
  return (
    <div className="app">
      {/* ... existing content */}
    </div>
  );
}

// Export all existing exports
export * from './existing-exports';