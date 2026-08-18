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

// New function to enhance table accessibility
const enhanceTableAccessibility = () => {
  // Find all tables in the document
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    // Add summary if it doesn't exist
    if (!table.getAttribute('summary')) {
      table.setAttribute('summary', 'Data table');
    }

    // Process headers
    const headers = table.querySelectorAll('th');

    headers.forEach(header => {
      // Add scope if it doesn't exist
      if (!header.getAttribute('scope')) {
        // Determine if it's a column or row header based on position
        const rowIndex = header.parentElement.rowIndex;
        const cellIndex = header.cellIndex;

        // If it's in the first row, assume it's a column header
        if (rowIndex === 0) {
          header.setAttribute('scope', 'col');
        }
        // If it's in the first column, assume it's a row header
        else if (cellIndex === 0) {
          header.setAttribute('scope', 'row');
        }
        // Default to column header if position is unclear
        else {
          header.setAttribute('scope', 'col');
        }
      }

      // Add aria-label if it doesn't exist
      if (!header.getAttribute('aria-label') && header.textContent.trim()) {
        header.setAttribute('aria-label', header.textContent.trim());
      }
    });
  });
};

// Initialize the app
const initApp = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);

    // Make SVGs and tables accessible after render
    setTimeout(() => {
      const svgs = document.querySelectorAll('svg');
      svgs.forEach(makeSvgAccessible);

      enhanceTableAccessibility();
    }, 0);
  }
};

// Export existing functions
export { existingFunction };

// Initialize the app
initApp();