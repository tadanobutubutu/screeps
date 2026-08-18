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

// Function to ensure only one main element exists
const ensureSingleMainElement = () => {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Convert all but the first main to section elements
    for (let i = 1; i < mainElements.length; i++) {
      const section = document.createElement('section');
      // Copy all attributes from main to section
      Array.from(mainElements[i].attributes).forEach(attr => {
        section.setAttribute(attr.name, attr.value);
      });
      // Move all children to the new section
      while (mainElements[i].firstChild) {
        section.appendChild(mainElements[i].firstChild);
      }
      // Replace main with section
      mainElements[i].parentNode.replaceChild(section, mainElements[i]);
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

      // Ensure only one main element exists
      ensureSingleMainElement();
    }, 0);
  }
};

// Export existing functions
export { existingFunction };

// Initialize the app
initApp();