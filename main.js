// main.js
// This file should contain JavaScript code, not HTML
// The HTML content should be moved to a separate file with .html or .jsx extension

// Example JavaScript content that would be appropriate for main.js:
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Add this function to handle SVG accessibility
const makeSvgAccessible = (svgElement) => {
  if (!svgElement) return;

  // If SVG is decorative, add aria-hidden
  if (svgElement.getAttribute('data-decorative') === 'true') {
    svgElement.setAttribute('aria-hidden', 'true');
  }
  // Otherwise add an accessible name
  else if (!svgElement.getAttribute('aria-label') && !svgElement.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = 'Graphic element';
    svgElement.prepend(title);
  }
};

// Initialize the app
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Call this after the app renders to ensure all SVGs are processed
setTimeout(() => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(makeSvgAccessible);
}, 100);