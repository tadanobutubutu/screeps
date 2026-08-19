import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Accessibility fix for SVG elements – applied to both layout files
document.querySelectorAll('svg').forEach(svg => {
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
    const title = svg.querySelector('title');
    if (!title) {
      const desc = svg.getAttribute('alt') || 'Graphic';
      title = document.createElement('title');
      title.textContent = desc;
      svg.appendChild(title);
    }
    svg.setAttribute('aria-hidden', 'true');
  }
});

// If this file is used in a module environment, export the fix function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applySVGAccessibilityFix: () => {
      document.querySelectorAll('svg').forEach(svg => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
          let title = svg.querySelector('title');
          if (!title) {
            const desc = svg.getAttribute('alt') || 'Graphic';
            title = document.createElement('title');
            title.textContent = desc;
            svg.appendChild(title);
          }
          svg.setAttribute('aria-hidden', 'true');
        }
      });
    }
  };
}

// Initialize the React root and render the app
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export the React root (for testing) and App component
export { App, root };

console.log("main.js is properly formatted as JavaScript");