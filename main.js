/**
 * Main application entry point.
 * Handles initialization and core application logic.
 */

(function () {
  'use strict';

  /**
   * Add proper landmark regions to sections that have headings but lack
   * an ARIA landmark role. This improves accessibility by ensuring
   * screen readers and assistive technologies can navigate the page
   * structure effectively.
   *
   * Iterates through all <section> and <article> elements. For each
   * element that contains a heading (h1-h6) and does not already have
   * an aria-label, aria-labelledby, or role attribute, this function:
   *   1. Sets role="region" on the element
   *   2. Adds aria-labelledby pointing to the heading's generated id
   *   3. Ensures the heading has a unique id
   */
  function addProperLandmarkRegions() {
    if (typeof document === 'undefined' || !document.querySelectorAll) {
      return;
    }

    const landmarkCandidates = document.querySelectorAll('section, article');
    let generatedIdCounter = 0;

    landmarkCandidates.forEach(function (element) {
      // Skip elements that are already properly labeled or have a role.
      if (
        element.hasAttribute('aria-label') ||
        element.hasAttribute('aria-labelledby') ||
        element.hasAttribute('role')
      ) {
        return;
      }

      // Find the first heading within the element.
      const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (!heading) {
        return;
      }

      // Ensure the heading has an id so aria-labelledby can reference it.
      let headingId = heading.id;
      if (!headingId) {
        do {
          generatedIdCounter += 1;
          headingId = 'landmark-heading-' + generatedIdCounter;
        } while (document.getElementById(headingId));
        heading.id = headingId;
      }

      // Apply the landmark region role and labelling.
      element.setAttribute('role', 'region');
      element.setAttribute('aria-labelledby', headingId);
    });
  }

  /**
   * Initialize the application once the DOM is ready.
   */
  function init() {
    addProperLandmarkRegions();
  }

  // Expose functions for testing and external use.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      addProperLandmarkRegions: addProperLandmarkRegions,
      init: init
    };
  } else if (typeof window !== 'undefined') {
    window.addProperLandmarkRegions = addProperLandmarkRegions;
    window.init = init;
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();