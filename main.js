const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  const warnings = [];
  const foundLandmarks = {};

  LANDMARK_ELEMENTS.forEach(landmark => {
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  // Add new checks for ARIA roles, labels, and unique IDs
  Object.keys(foundLandmarks).forEach(landmark => {
    const element = document.querySelector(landmark);
    if (element) {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        warnings.push(`Missing aria-label or aria-labelledby on ${landmark} landmark`);
      }

      if (!element.hasAttribute('role')) {
        warnings.push(`Missing 'role' attribute on ${landmark} landmark`);
      }

      if (element.id === '') {
        warnings.push(`Missing an ID on ${landmark} landmark`);
      }
    }
  });

  const landmarkIdSet = new Set();
  const landmarks = document.querySelectorAll('[role="landmark"], main, nav, header, footer, aside');
  landmarks.forEach(el => {
    const id = el.id;
    if (id) {
      if (landmarkIdSet.has(id)) {
        warnings.push('Duplicate landmark ID found:', id);
      } else {
        landmarkIdSet.add(id);
      }
    }
  });

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * ... (Leave the rest of the functions unchanged)
 */

export {
  checkLandmarkElements,
  createInPageButton,
  countDependencies,
  a11yStore,
  addLandmarkRegions,
  // Add the new functions here
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks
};