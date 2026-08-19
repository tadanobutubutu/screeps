// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
document.addEventListener('DOMContentLoaded', () => {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const desc = svg.getAttribute('alt') || 'Graphic';
      const newTitle = document.createElement('title');
      newTitle.textContent = desc;
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
    svg.setAttribute('aria-hidden', 'true');
  });
});

// Add function to handle the fake link issue
function handleFakeLinkClick(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href').substring(1);
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.click();
  }
}

// Apply the fix to all hash-only links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', handleFakeLinkClick);
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
});

// Existing code remains unchanged
// ...

const container = document.getElementById('root');
const root = createRoot(container);
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
      const svgElements = document.querySelectorAll('svg');
      svgElements.forEach(svg => {
        const title = svg.querySelector('title');
        if (!title) {
          const desc = svg.getAttribute('alt') || 'Graphic';
          const newTitle = document.createElement('title');
          newTitle.textContent = desc;
          svg.insertBefore(newTitle, svg.firstChild);
          svg.setAttribute('role', 'img');
        }
        svg.setAttribute('aria-hidden', 'true');
      });
    }
  };
}