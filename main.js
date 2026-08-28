import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Render the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Ensure the HTML element has a lang attribute
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
});

// Helper function to generate unique landmark IDs
function generateLandmarkId(landmarkType, index) {
  return `${landmarkType}-${index}`;
}

// Accessibility helper for SVGs
function getSvgAccessibleName(svgElement, fallbackName) {
  const titleElement = svgElement.querySelector('title');
  return titleElement ? titleElement.textContent : fallbackName;
}

// Validate that all landmarks are unique
function validateLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    landmarkCounts[landmark] = elements.length;
  });
  
  // Ensure no duplicate landmarks of the same type
  Object.keys(landmarkCounts).forEach(type => {
    if (landmarkCounts[type] > 1) {
      console.warn(`Warning: Multiple ${type} landmarks detected. Consider using aria-label for differentiation.`);
    }
  });
  
  return landmarkCounts;
}

// Export for testing
export { generateLandmarkId, getSvgAccessibleName, validateLandmarks };