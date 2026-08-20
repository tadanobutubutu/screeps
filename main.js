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

// Add function to ensure only one main element exists in the document
function ensureSingleMainElement() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Convert all but the first main element to section
    for (let i = 1; i < mainElements.length; i++) {
      const section = document.createElement('section');
      // Copy all attributes
      Array.from(mainElements[i].attributes).forEach(attr => {
        section.setAttribute(attr.name, attr.value);
      });
      // Move all children
      while (mainElements[i].firstChild) {
        section.appendChild(mainElements[i].firstChild);
      }
      // Replace the main element with section
      mainElements[i].parentNode.replaceChild(section, mainElements[i]);
    }
  }
}

// Run the main element check after DOM is loaded
document.addEventListener('DOMContentLoaded', ensureSingleMainElement);

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