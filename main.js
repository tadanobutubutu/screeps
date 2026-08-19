// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Function to ensure only one main landmark exists in the document
const ensureSingleMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Convert all but the first main to section elements
    for (let i = 1; i < mainElements.length; i++) {
      const section = document.createElement('section');
      // Copy all attributes from main to section
      Array.from(mainElements[i].attributes).forEach(attr => {
        section.setAttribute(attr.name, attr.value);
      });
      // Move all children from main to section
      while (mainElements[i].firstChild) {
        section.appendChild(mainElements[i].firstChild);
      }
      // Replace main with section
      mainElements[i].parentNode.replaceChild(section, mainElements[i]);
    }
  }
};

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

// Call the function to ensure single main landmark after render
root.render(
  <React.StrictMode>
    <App />
    <script>
      {`(${ensureSingleMainLandmark.toString()})()`}
    </script>
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
    },
    ensureSingleMainLandmark: ensureSingleMainLandmark
  };
}