import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add this function to handle SVG accessibility
const makeSvgAccessible = (svgElement) => {
  if (!svgElement) return;

  // Check if SVG already has accessibility attributes
  if (svgElement.getAttribute('aria-label') ||
      svgElement.getAttribute('aria-hidden') ||
      svgElement.querySelector('title')) {
    return;
  }

  // If SVG is decorative, mark it as hidden
  if (svgElement.classList.contains('decorative')) {
    svgElement.setAttribute('aria-hidden', 'true');
  } else {
    // Otherwise, add a default accessible name
    svgElement.setAttribute('aria-label', 'Graphic element');
  }
};

// Enhanced render function that checks for SVGs
const renderWithAccessibility = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // After render, check for SVGs and make them accessible
  setTimeout(() => {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(makeSvgAccessible);
  }, 0);
};

// Use the enhanced render function
renderWithAccessibility();