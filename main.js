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

// Add main landmark functionality for React components
const addMainLandmark = () => {
  const mainElement = document.createElement('main');
  const rootElement = document.getElementById('root');

  if (rootElement && !rootElement.querySelector('main')) {
    // Move all children of root to the main element
    while (rootElement.firstChild) {
      mainElement.appendChild(rootElement.firstChild);
    }
    rootElement.appendChild(mainElement);
  }
};

// Existing code remains unchanged
// ...

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Call the main landmark function after render
setTimeout(addMainLandmark, 0);

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