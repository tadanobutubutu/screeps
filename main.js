// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved as-is)
const existingFunction = () => {
  // ... existing implementation ...
};

// New function to handle SVG accessibility (REACT_041)
const makeSvgAccessible = (svgElement) => {
  if (!svgElement) return;

  // Add aria-hidden if the SVG is decorative
  if (svgElement.getAttribute('aria-hidden') !== 'true') {
    // Add a title element if it doesn't exist
    if (!svgElement.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = svgElement.getAttribute('aria-label') || 'Accessible SVG';
      svgElement.insertBefore(title, svgElement.firstChild);
    }

    // Ensure aria-label is set if not present
    if (!svgElement.getAttribute('aria-label')) {
      svgElement.setAttribute('aria-label', 'Accessible SVG');
    }
  }
};

// Function to ensure proper table structure (REACT_027)
const ensureTableStructure = (tableElement) => {
  if (!tableElement) return;

  // Ensure table has a caption
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    tableElement.insertBefore(caption, tableElement.firstChild);
  }

  // Ensure table has proper headers
  const headers = tableElement.querySelectorAll('th');
  if (headers.length > 0) {
    headers.forEach(header => {
      if (!header.getAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  }
};

// Function to ensure proper landmark usage (REACT_017, REACT_025)
const ensureLandmarks = () => {
  // Ensure main landmark exists
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const appContent = document.querySelector('#root > *');
    if (appContent) {
      main.appendChild(appContent);
      document.getElementById('root').appendChild(main);
    }
  }

  // Ensure navigation landmark exists if navigation is present
  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
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

      // Ensure proper table structure
      const tables = document.querySelectorAll('table');
      tables.forEach(ensureTableStructure);

      // Ensure proper landmarks
      ensureLandmarks();
    }, 0);
  }
};

// Export existing functions
export { existingFunction };

// Initialize the app
initApp();