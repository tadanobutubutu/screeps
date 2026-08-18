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

// New function to handle fake links (hash-only href)
const handleFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('a[href="#"]');

  fakeLinks.forEach(link => {
    // Convert to button if it has an ID that suggests it's an action
    if (link.id && (link.id.includes('rotate') || link.id.includes('back'))) {
      const button = document.createElement('button');
      button.id = link.id;
      button.className = link.className;
      button.textContent = link.textContent;
      button.setAttribute('aria-label', link.textContent || 'Action button');

      // Copy event listeners
      const clone = link.cloneNode(true);
      link.parentNode.replaceChild(button, link);

      // Reattach event listeners
      Array.from(clone.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          button.setAttribute(attr.name, attr.value);
        }
      });

      // Add keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    }
  });
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

      // Handle fake links after render
      handleFakeLinks();
    }, 0);
  }
};

// Export existing functions
export { existingFunction };

// Initialize the app
initApp();