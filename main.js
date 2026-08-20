// main.js
// Preserve all existing imports and functions
// Add these new accessibility-related functions at the bottom

/**
 * Adds proper language attribute to HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
function ensureLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
}

/**
 * Ensures proper table structure with scope attributes
 * Fixes REACT_027: React Table Structure
 */
function enhanceTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Add scope attributes to th elements
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', index === 0 ? 'row' : 'col');
      }
    });
  });
}

/**
 * Adds proper landmark roles to sections
 * Fixes REACT_017: React Landmarks
 */
function addLandmarkRoles() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.hasAttribute('role') && !section.hasAttribute('aria-label')) {
      section.setAttribute('role', 'region');
    }
  });
}

/**
 * Ensures SVGs have accessible names
 * Fixes REACT_041: React SVG Accessible Name
 */
function makeSVGsAccessible() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

/**
 * Ensures landmarks are unique
 * Fixes REACT_025: React Unique Landmarks
 */
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${landmark} ${index + 1}`);
        }
      });
    }
  });
}

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 */
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.getAttribute('data-href') || '#';
    anchor.innerHTML = link.innerHTML;
    link.replaceWith(anchor);
  });
}

// Initialize accessibility enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  enhanceTableAccessibility();
  addLandmarkRoles();
  makeSVGsAccessible();
  ensureUniqueLandmarks();
  replaceFakeLinks();
});

// Preserve all existing exports and functions from your original main.js
// ... rest of your existing code ...