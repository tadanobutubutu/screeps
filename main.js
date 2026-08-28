// Import React and its dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by imported components/index.html)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)

// Accessibility Utilities (from origin/main)
import {
  initialize,
  processData,
  validateInput,
  formatOutput,
  calculateSum,
  calculateDifference,
  calculateProduct,
  calculateQuotient,
  isEven,
  getMax,
  getMin,
  enhanceKeyboardAccessibility,
  trapFocus,
  setupSkipLink,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  getLangAttribute,
  wrapPrimaryContentInMain,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  addFixLandmarkIssues,
  getSvgAccessibleName,
  addAriaToFormControls,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  createAccessibleLink
} from './accessibility-utilities';

// Main function
function main() {
  // Initialize the application
  if (!initialize()) {
    console.error('Application failed to initialize');
    return;
  }

  // Create React root and render the App component
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Report web vital metrics
  reportWebVitals();
}

// Ensure interactive elements are keyboard accessible (include imported function)
enhanceKeyboardAccessibility();

// Auto-initialize accessibility features
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupSkipLink();
    });
  } else {
    setupSkipLink();
  }
}

// Export the main function
export default main;