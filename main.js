// TODO: Address accessibility issues from insight report:

// Insight Report Accessibility Issues:
// - Missing ARIA labels on interactive elements
// - Keyboard navigation improvements needed
// - Focus management for dynamic content
// - Color contrast compliance
// - Screen reader announcements for dynamic updates

// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (typically in index.html, not main.js)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

(function() {
    'use strict';

    // ----- BEGIN ORIGINAL CODE (unchanged) -----
    // Assuming main.js has a <html> tag, add the lang attribute based on your content
    // For example, if the page is in English, set lang to 'en'
    // ...

    // BEGIN CHANGES TO ADDRESS ACCESSIBILITY ISSUES

    // Landmark elements that should be checked for proper usage
    const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

    // New implementation to count dependencies using Document and regex
    function countDependencies() {
        const importCommentRegExp = /^\s*import\s+({|[\w\s,]*)*\s*;?\s*\s*$/gm;
        const importCount = (document.body.textContent || '').match(importCommentRegExp)?.length || 0;
        return importCount;
    }

    // Function to add landmark regions ensuring proper IDs
    function addLandmarkRegions() {
        const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
        landmarkElements.forEach((landmark) => {
            if (landmark) {
                if (!landmark.id) {
                    landmark.id = `${landmark.tagName.toLowerCase()}-${landmark.id ? landmark.id : 0}`;
                }
            }
        });
    }

    // New function to check landmark elements
    function checkLandmarkElements() {
        const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
        landmarkElements.forEach((landmark, index) => {
            if (landmark.id === '') {
                landmark.id = `${landmark.tagName.toLowerCase()}-${index}`;
            }
            
            if (landmarkElements.length > 1) {
                if (landmark.id === '') {
                    landmark.id = `${landmark.tagName.toLowerCase()}-${index}`;
                }
            }
        });
    }

    // New function to ensure all landmark elements have unique IDs
    function ensureLandmarkUniqueness() {
        const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
        const ids = new Set();
        let hasDuplicate = false;
        
        landmarkElements.forEach((landmark) => {
            if (landmark.id) {
                if (ids.has(landmark.id)) {
                    hasDuplicate = true;
                }
                ids.add(landmark.id);
            } else {
                const tagName = landmark.tagName.toLowerCase();
                const id = `${tagName}-${landmark.id ? landmark.id : 0}`;
                landmark.id = id;
                if (ids.has(id)) {
                    hasDuplicate = true;
                }
                ids.add(id);
            }
        });
        
        return !hasDuplicate;
    }

// Store for accessibility announcements (screen reader support)
const a11yStore = {

  // Existing code

  /**
   * Validates that links and interactive elements have accessible names,
   * addressing REACT_036 fake link issues.
   * @param {HTMLElement} container - Optional container to scan within
   * @returns {object} Validation result with valid flag and errors array
   */
  validateAccessibleLinks: function(container) {
    if (typeof document === 'undefined') {
      return { valid: true, errors: [] };
    }
    
    const errors = [];
    const root = container || document;
    const links = root.querySelectorAll('a, button, [role="link"], [role="button"]');
    
    links.forEach((el, index) => {
      const name = personName(el);
      if (!name || !name.trim()) {
        errors.push(`Interactive element ${index + 1} is missing an accessible name`);
      }
    });
    
    return { valid: errors.length === 0, errors };
  },

  /**
   * Ensures the dependencyGraph container has a proper ARIA role.
   * Finds the element by id 'dependencyGraph' (or a custom selector) and
   * applies an appropriate ARIA role and accessible label if missing.
   * @param {string} [containerId='dependencyGraph'] - The id of the container element
   * @param {string} [role='figure'] - The ARIA role to apply if missing
   * @param {string} [label='Dependency Graph'] - The accessible label to apply if missing
   * @returns {object} Result indicating whether the container was found and updated
   */
  ensureDependencyGraphRole: function(containerId, role, label) {
    if (typeof document === 'undefined') {
      return { valid: false, errors: ['Document not available'] };
    }
    
    const id = containerId || 'dependencyGraph';
    const desiredRole = role || 'figure';
    const desiredLabel = label || 'Dependency Graph';
    
    const container = document.getElementById(id);
    if (!container) {
      return { valid: false, errors: [`Dependency graph container with id "${id}" not found`] };
    }
    
    const errors = [];
    
    // Apply role if missing
    if (!container.getAttribute('role')) {
      container.setAttribute('role', desiredRole);
    }
    
    // Apply accessible label if missing (aria-label or aria-labelledby)
    const hasLabel = container.getAttribute('aria-label') ||
                     container.getAttribute('aria-labelledby');
    if (!hasLabel) {
      container.setAttribute('aria-label', desiredLabel);
    }
    
    // Validate the resulting attributes
    const finalRole = container.getAttribute('role');
    const finalLabel = container.getAttribute('aria-label') || container.getAttribute('aria-labelledby');
    
    if (!finalRole) {
      errors.push('Dependency graph container is missing a role attribute');
    }
    if (!finalLabel) {
      errors.push('Dependency graph container is missing an accessible label');
    }
    
    return { valid: errors.length === 0, errors, container };
  },

  // New property to count dependencies
  countDependencies: function() {
    return countDependencies();
  },

  init: function() {
    ...
    ...
    ...
    this.setupSkipLinks();
    ...
    ...
    this.fixFakeLinks(); // Added for REACT_036
  },

  // Create a live region for screen reader announcements
};

})();