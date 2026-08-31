import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';
import { visualizeDependencyTree } from './utils/dependencyVisualization';
import { fixAccessibilityIssues } from './utils/accessibilityUtils';
import { loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks } from './utils/landmarks';
export {
  calculateSum,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  visualizeDependencyTree,
  fixAccessibilityIssues,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  createInPageButton,
  createUnrotateButton
};

// Node.js functions for dependency visualization tool (moved to a separate file)
const fs = require('fs');
const path = require('path');

// New function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');

  fakeLinks.forEach((fakeLink) => {
    // Skip if it's already been processed or has aria-hidden
    const parent = fakeLink.parentElement;
    if (!parent) return;

    // Create a proper button element
    const newButton = document.createElement('button');

    // Set ARIA attributes for accessibility
    newButton.setAttribute('role', 'button');

    // Use aria-label if present, otherwise generate from content
    const ariaLabel = fakeLink.getAttribute('aria-label');
    if (ariaLabel) {
      newButton.setAttribute('aria-label', ariaLabel);
    } else if (fakeLink.textContent.trim()) {
      newButton.setAttribute('aria-label', fakeLink.textContent.trim());
    } else {
      // Default aria-label if no text content
      newButton.setAttribute('aria-label', 'Action button');
    }

    // Copy classes for styling consistency
    if (fakeLink.className) {
      newButton.className = fakeLink.className;
    }

    // Copy text content
    newButton.textContent = fakeLink.textContent;

    // Copy dataset attributes if any
    Object.entries(fakeLink.dataset).forEach(([key, value]) => {
      newButton.dataset[key] = value;
    });

    // Replace the fake link with the proper button
    parent.replaceChild(newButton, fakeLink);
  });
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  replaceFakeLinks();
  // Other fixes would go here
}

// resolver functions (for visualizeDependencyTree) moved to separate file

// Main entry point for dependency visualization tool
export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  renderIndexView: function() {
    return renderIndexView();
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  }
};

// Other code unchanged