// This file includes both the accessibility improvements and the dependency visualization tool features.

import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';

// Node.js functions for dependency visualization tool
const fs = require('fs');
const path = require('path');

// New function to visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  const results = [];
  
  // Validate and fix table accessibility
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const tableValidation = validateTableAccessibility(table);
    if (tableValidation && tableValidation.issues) {
      results.push(...tableValidation.issues);
    }
  });
  
  // Validate and fix landmark accessibility
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
  landmarks.forEach(landmark => {
    const landmarkValidation = validateLandmark(landmark);
    if (landmarkValidation && landmarkValidation.issues) {
      results.push(...landmarkValidation.issues);
    }
  });
  
  // Validate and fix link accessibility
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const linkValidation = validateLinkAccessibility(link);
    if (linkValidation && linkValidation.issues) {
      results.push(...linkValidation.issues);
    }
  });
  
  // Handle fake links (links with href="#")
  handleFakeLinks();
  
  // Check for missing lang attribute
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    results.push({
      type: 'lang-missing',
      message: 'HTML element is missing lang attribute',
      element: htmlElement,
      severity: 'critical'
    });
  }
  
  // Check for duplicate IDs that may affect accessibility
  const ids = [];
  const duplicateIds = [];
  document.querySelectorAll('[id]').forEach(el => {
    if (ids.includes(el.id)) {
      duplicateIds.push(el.id);
    } else {
      ids.push(el.id);
    }
  });
  
  if (duplicateIds.length > 0) {
    results.push({
      type: 'duplicate-ids',
      message: 'Duplicate IDs found: ' + duplicateIds.join(', '),
      duplicateIds: duplicateIds,
      severity: 'error'
    });
  }
  
  return results;
}

// Main entry point for dependency visualization tool
export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  // New function for rotating back
  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  // New function to address all accessibility issues
  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  }
};

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLinks = document.querySelectorAll('a[href="#"]');
fakeLinks.forEach(fakeLink => {
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    if (parent) {
      parent.replaceChild(newButton, fakeLink);
    }
  }
});

// Load landmarks from file (new addition)
import {CONFIG} from './utils/constants';
function loadLandmarks() {
  try {
      const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
  } catch (error) {
      console.error('Error loading landmarks:', error.message);
      return [];
  }
}

// Process and filter landmarks (new addition)
function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(l => l && l.name);
    const uniqueLandmarks = [...new Set(validLandmarks.map(l => l.id))].map(id => validLandmarks.find(l => l.id === id));

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// Sort landmarks by name (new addition)
function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

// Get landmark by ID (new addition)
function getLandmarkById(id) {
    const landmarks = loadLandmarks();
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Ensure unique landmarks by ID (new addition)
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seen = new Set();
    const uniqueLandmarks = [];

    for (const landmark of landmarks) {
        if (!landmark || typeof landmark.id === 'undefined') {
            continue;
        }

        const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

// Export functions for testing (new addition)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks, fixAccessibilityIssues
    };
}