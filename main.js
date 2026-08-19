// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
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

// Existing code remains unchanged
// ...

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// All other existing code remains exactly as is
// ...

// React accessibility fix function for module environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyREACT041Fix: () => {
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
    }
  };
}