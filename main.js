import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibility';
import { validateLandmark, validateLandmarkStructure, ensureUniqueLandmarks } from './utils/landmarkUtils';
import { getSvgAccessibleName, createInPageButton } from './utils/svgUtils';
import { createAccessibleLink, handleAccessibilityIssues } from './utils/linkUtils';

// Set the lang attribute on the HTML element (REACT_015)
const setLangAttribute = () => {
  const htmlElement = document.documentElement;
  const lang = htmlElement.getAttribute('lang') || 'en';
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
};

// Accessibility validation function
const validateAccessibility = () => {
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
  handleAccessibilityIssues();
};

// Initialize the application
const initApp = () => {
  setLangAttribute();
  validateAccessibility();
  
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
};

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export functions for testing and external use
export {
  setLangAttribute,
  validateAccessibility,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  initApp
};

export default App;