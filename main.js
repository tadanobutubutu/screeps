// Assuming main.js is the entry point for the React application and contains imports and setup code.
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Adjust the path to the actual App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  ...
);

// Below is the updated code for the affected files, which would be included in the main.js or in separate components.

// Example of how to update the icons in app/layout.tsx and dashboard/app/layout.tsx
const icons = {
  icon: ... ... viewBox="0 0 100 100" aria-label="Screeps ... Dashboard</title><text y="0.9em" ...
  apple: ... ... viewBox="0 0 100 100" aria-label="Screeps Dashboard Apple Icon"><title>Screeps Dashboard Apple Icon</title><text y="0.9em" ...
};

// ... rest of the code in main.js

/**
 * Extracts the accessible name from an SVG element.
 * Priority: aria-label attribute > title element content
 * 
 * @param {string|Element} svgContent - The SVG string or DOM element
 * @returns {string|null} The accessible name or null if not found
 */
export function getSvgAccessibleName(svgContent) {
  let element = svgContent;
  
  // If input is a string, parse it to create a DOM element
  if (typeof svgContent === 'string') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    element = doc.documentElement;
  }
  
  if (!element) {
    return null;
  }
  
  // First check for aria-label attribute
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }
  
  // Fall back to title element content
  const titleElement = element.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }
  
  return null;
}