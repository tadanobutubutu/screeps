// main.js
// REACT_017 Fix: Ensure primary content is wrapped in <main> landmarks for accessibility

/**
 * Wraps the primary content of the page in a <main> landmark
 * to ensure keyboard and screen reader users can navigate to it easily.
 */
function ensureMainLandmark() {
  // Check if a <main> element already exists
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create a <main> element and wrap the primary content
  const main = document.createElement('main');
  
  // Move primary content into <main>
  // Target the primary content areas for the affected files
  const tableRotated = document.getElementById('table-rotated');
  const container = document.querySelector('.container');
  
  if (tableRotated) {
    // For docs/dependency-graph.html
    main.appendChild(tableRotated);
    document.body.appendChild(main);
  } else if (container) {
    // For docs/index.html
    main.appendChild(container);
    document.body.appendChild(main);
  }

  return main;
}

/**
 * Applies the <main> landmark fix to the document.
 * This addresses the REACT_017 accessibility rule.
 */
function applyMainLandmarkFix() {
  if (typeof document === 'undefined') {
    return;
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureMainLandmark);
  } else {
    ensureMainLandmark();
  }
}

// Apply the fix
applyMainLandmarkFix();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ensureMainLandmark,
    applyMainLandmarkFix,
  };
}