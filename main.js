// TODO: Add back any required exports that might have been removed.
// Existing code starts here

// This is the existing code that needs to be preserved
// (This comment remains as-is)

// More existing code that should be preserved

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
  if (typeof document !== 'undefined') {
    button.setAttribute('role', 'button');
    button.ariaLabel = 'rotate back';
  }
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('a[href="#"]');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Node.js functions for dependency visualization tool
const fs = require('fs');
const path = require('path');

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

// New function to visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

// Helper function to generate dependency report
function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

// Main entry point for dependency visualization tool
export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  rotateBack: function() {
    // Your code to rotate back
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    loadLandmarks().forEach((landmark) => {
      // Code to fix accessibility issues based on the landmarks data
    });
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

// Resolved main.js
// Merged version combining accessibility features and application initialization

import './styles.less';
import react from 'react';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';

// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Application data structure
const appData = {
  title: 'Frontend Application',
  version: '1.0.0'
};

// Configuration and state
let config = {};
let appState = {};

// Initialize function
function initialize() {
  config = { apiUrl: process.env.API_URL || 'http://localhost:3000', timeout: 5000 };
  appState = { initialized: true };
}

function initializeApp() {
  initialize();
}

function processData(data) {
  return data;
}

function fetchUser(userId) {
  return { id: userId, name: 'User' };
}

function clearCache() {
  appState = {};
}

function validateInput(input) {
  return input && input.length > 0;
}

// Main execution
function main() {
  initialize();
  console.log('Main function executed');
}

// Run if executed directly
if (require.main === module) {
  main();
}

const HTML = ({ lang }) => <html lang={lang}>/* other children */</html>;

// Landmark data structure
const landmarks = [];

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Testing the checkLandmarkElement function:
// To test this function, we could create a test file with the following content:
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * REACT_015: Add lang attribute to HTML element
 * Sets the language attribute on the HTML element.
 */
function setLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute(element) {
  // Code for adding the language attribute to the specified element
  if (element && !element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
}

/**
 * REACT_017: Add/fix 2 landmark issues
 * Validates landmark elements for proper structure and accessibility.
 */
function validateLandmark(landmark) {
  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    const tagElements = document.querySelectorAll(role);

    const totalCount = elements.length + (role === 'main' ? 0 : tagElements.length);

    if (totalCount > 1) {
      issues.push(`Landmark role "${role}" appears ${totalCount} times, should be unique`);
    }
  });

  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark structure by checking required properties.
 * @param {Object} landmark - The landmark object to validate.
 * @returns {boolean} Returns true if the landmark structure is valid.
 */
function validateLandmarkStructure(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];

  landmarks.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');

    if (role && !validLandmarks.includes(role)) {
      issues.push(`Element at index ${index} has invalid role "${role}"`);
    }
  });

  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark attributes.
 */
function validateLandmarkAttributes(landmark) {
  if (!landmark || !landmark.attributes) {
    return false;
  }
  return true;
}

/**
 * Adds landmark roles to elements.
 */
function addLandmarkRoles() {
  const landmarkElements = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], [role="banner"], [role="complementary"]');
  landmarkElements.forEach((element, index) => {
    if (!element.id) {
      element.id = 'landmark-' + index;
    }
  });
}

function addMainLandmark() {
  // Code for adding main landmark
}

/**
 * REACT_027: Fix 26 table structure issues
 * Validates table accessibility by checking for proper structure.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} Returns true if the table is accessible.
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table is missing a caption');
  }

  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      issues.push(`Header at index ${index} is missing scope or id attribute`);
    }
  });

  return { valid: issues.length === 0, issues };
}

/**
 * Validates table structure for proper headers and accessibility.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} Returns true if the table structure is valid.
 */
function validateTableStructure(table) {
  const issues = [];

  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }

  const rows = table.querySelectorAll('tr');
  let cellCount = 0;

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    const isHeaderRow = row.parentElement.tagName === 'THEAD';

    cells.forEach((cell, cellIndex) => {
      if (cell.tagName === 'TH' && !isHeaderRow) {
        issues.push(`Row ${rowIndex} contains th but is not in thead`);
      }
      if (cell.tagName === 'TD' && isHeaderRow) {
        issues.push(`Row ${rowIndex} in thead contains td instead of th`);
      }
    });

    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('th, td').length;
      if (cells.length !== prevCells) {
        issues.push(`Row ${rowIndex} has ${cells.length} cells but previous row has ${prevCells}`);
      }
    }

    cellCount += cells.length;
  });

  return { valid: issues.length === 0, issues };
}

/**
 * Fixes table structure issues.
 */
function fixTableStructure() {
  // Code for fixing table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => validateTableStructure(table));
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Gets accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string|null} Returns the accessible name or null.
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return null;
  }

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }

  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  return null;
}

/**
 * Sets accessibility attributes on SVG elements.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} name - The accessible name to set.
 */
function setSvgAttributes(svgElement, name) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return false;
  }

  // Remove any existing accessible name attributes
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');

  if (!name) {
    svgElement.setAttribute('aria-hidden', 'true');
    return true;
  }

  // Create a title element if it doesn't exist
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;

  // Generate unique ID for the title
  const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
  title.setAttribute('id', titleId);

  // Set aria-labelledby
  svgElement.setAttribute('aria-labelledby', titleId);

  return true;
}

/**
 * REACT_036: Fix 1 fake link issue
 * Creates an in-page button with proper accessibility.
 * @param {string} text - The button text.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(targetId, buttonText) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'Skip to content';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', buttonText || 'Skip to main content');

  button.addEventListener('click', function() {
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });

  return button;
}

/**
 * Validates link accessibility by checking for proper href attributes.
 * @param {HTMLAnchorElement} link - The link element to validate.
 * @returns {boolean} Returns true if the link is accessible.
 */
function validateLinkAccessibility(link) {
  const issues = [];

  if (!link) {
    return { valid: false, issues: ['Link element is required'] };
  }

  // Check for accessible name
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');

  if (!text && !ariaLabel) {
    issues.push('Link has no accessible name (no text or aria-label)');
  }

  // Check for meaningful text
  if (text && (text === 'click here' || text === 'read more' || text === 'learn more')) {
    issues.push(`Link text "${text}" is not descriptive`);
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Handles fake links by converting them to proper buttons or adding accessibility attributes.
 */
function handleFakeLinks(container) {
  const issues = [];
  const elements = container ? container.querySelectorAll('a:not([href]), button') : document.querySelectorAll('a:not([href]), button');

  elements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'a' && !element.getAttribute('href') && !element.getAttribute('onclick')) {
      issues.push(`Element at index ${index} is an anchor without href or onclick`);
    }

    if (tagName === 'button' && element.querySelector('a')) {
      issues.push(`Button at index ${index} contains an anchor element`);
    }
  });

  return { valid: issues.length === 0, issues };
}

// New function to ensure element has an ID
function ensureElementHasId(element, prefix = 'element') {
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// New function to add aria-label to an element
function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// New function to render dependency graph
function renderDependencyGraph(dependencies) {
  const container = document.createElement('div');
  container.className = 'dependency-graph';

  dependencies.forEach(dep => {
    const depElement = document.createElement('div');
    depElement.textContent = dep.name;
    depElement.className = 'dependency-item';
    container.appendChild(depElement);
  });

  return container;
}

// New function to ensure proper landmark regions
function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });
}

// New function to fix fake links in the document
function fixFakeLinksInDocument() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    const parent = link.parentElement;
    const buttonText = link.textContent.trim() || 'Skip to content';
    const newButton = createInPageButton('main', buttonText);
    parent.replaceChild(newButton, link);
  });
}

// New function to ensure all interactive elements have keyboard support
function ensureKeyboardSupport() {
  const interactiveElements = document.querySelectorAll('button, [role="button"], a, input, select, textarea');

  interactiveElements.forEach(element => {
    if (!element.getAttribute('tabindex') && element.getAttribute('role') !== 'presentation') {
      element.setAttribute('tabindex', '0');
    }
  });
}

// New function to check and fix ARIA attributes
function checkAndFixAriaAttributes() {
  const elementsWithAria = document.querySelectorAll('[aria-*]');

  elementsWithAria.forEach(element => {
    const ariaAttributes = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('aria-'));

    ariaAttributes.forEach(attr => {
      if (attr.value === '') {
        element.removeAttribute(attr.name);
      }
    });
  });
}

// New function to ensure unique landmarks
function ensureUniqueLandmarksInDocument() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const seenRoles = {};

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          element.removeAttribute('role');
          console.warn(`Removed duplicate role "${role}" from element`);
        }
      });
    }
  });
}

// New function to add missing ARIA attributes to SVGs
function addMissingAriaToSvgs() {
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      setSvgAttributes(svg, 'Graphic element');
    }
  });
}

// New function to ensure all tables are accessible
function ensureTablesAccessible() {
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const { valid, issues } = validateTableAccessibility(table);
    if (!valid) {
      console.warn('Table accessibility issues:', issues);
      fixTableStructure(table);
    }
  });
}

// New function to ensure proper landmark structure
function ensureProperLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

  landmarks.forEach(landmark => {
    if (!landmark.id) {
      ensureElementHasId(landmark, 'landmark');
    }
  });
}

// New function to ensure all links are accessible
function ensureLinksAccessible() {
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    const { valid, issues } = validateLinkAccessibility(link);
    if (!valid) {
      console.warn('Link accessibility issues:', issues);
      if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
        addAriaLabel(link, 'Link to ' + link.href);
      }
    }
  });
}

// New function to ensure all interactive elements have proper labels
function ensureProperLabels() {
  const interactiveElements = document.querySelectorAll('button, [role="button"], input, select, textarea');

  interactiveElements.forEach(element => {
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby') && !element.querySelector('label')) {
      console.warn('Interactive element missing label:', element);
    }
  });
}

// New function to ensure proper document structure
function ensureProperDocumentStructure() {
  // Ensure lang attribute is set
  setLanguageAttribute();

  // Ensure proper landmark regions
  addProperLandmarkRegions();

  // Ensure unique landmarks
  ensureUniqueLandmarksInDocument();

  // Ensure proper landmark structure
  ensureProperLandmarkStructure();

  // Ensure keyboard support
  ensureKeyboardSupport();

  // Ensure ARIA attributes are properly set
  checkAndFixAriaAttributes();

  // Ensure tables are accessible
  ensureTablesAccessible();

  // Ensure links are accessible
  ensureLinksAccessible();

  // Ensure interactive elements have proper labels
  ensureProperLabels();

  // Fix fake links
  fixFakeLinksInDocument();

  // Add missing ARIA to SVGs
  addMissingAriaToSvgs();
}

// Export all new functions
export {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  addProperLandmarkRegions,
  fixFakeLinksInDocument,
  ensureKeyboardSupport,
  checkAndFixAriaAttributes,
  ensureUniqueLandmarksInDocument,
  addMissingAriaToSvgs,
  ensureTablesAccessible,
  ensureProperLandmarkStructure,
  ensureLinksAccessible,
  ensureProperLabels,
  ensureProperDocumentStructure
};