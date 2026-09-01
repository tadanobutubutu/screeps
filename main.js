// main.js

/**
 * Adds proper landmark regions to the document for better accessibility.
 * This function should be called after the DOM is fully loaded.
 */
function addProperLandmarkRegions() {
  // Check if the document has a main element
  if (!document.querySelector('main')) {
    console.warn('No main element found in the document. Landmark regions may not be properly set.');
    return;
  }

  // Add ARIA landmark roles to common sections if they exist
  const sections = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'section': 'region'
  };

  Object.entries(sections).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', role);
      }
    });
  });

  // Add ARIA label to main content if not present
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('aria-label')) {
    main.setAttribute('aria-label', 'Main Content');
  }
}

// Export all existing functions and the new one
export {
  addProperLandmarkRegions,
  // ... other existing exports remain unchanged
};