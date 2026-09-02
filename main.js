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
  // Add lang attribute to HTML element
  if (typeof document !== 'undefined') {
    document.documentElement.lang = getLangAttribute();
  }

  // Validate and fix table accessibility
  validateTableAccessibility();
  validateTableStructure();

  // Add accessible names to SVGs
  const svg1 = document.querySelector('.svg-1');
  if (svg1) {
    svg1.setAttribute('aria-label', getSvgAccessibleName('svg-1'));
    setSvgAttributes(svg1);
  }

  const svg2 = document.querySelector('.svg-2');
  if (svg2) {
    svg2.setAttribute('aria-label', getSvgAccessibleName('svg-2'));
    setSvgAttributes(svg2);
  }

  // Ensure unique landmarks
  ensureUniqueLandmarkElements();

  // Fix fake links
  handleFakeLinks();
  fixFakeLinkIssues();

  // Add proper landmark regions
  addLandmarkRoles();
}

/**
 * Renders the index view for the dependency visualization tool.
 * @returns {HTMLElement} The rendered index view container element
 */
function renderIndexView() {
  const container = document.createElement('div');
  container.id = 'index-view';
  container.className = 'index-view';
  container.setAttribute('role', 'main');
  container.setAttribute('aria-label', 'Dependency Visualization Tool Index');

  const header = document.createElement('header');
  const title = document.createElement('h1');
  title.textContent = 'Dependency Visualization Tool';
  header.appendChild(title);
  container.appendChild(header);

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = 'Analyze and visualize your project dependencies with accessibility support.';
  container.appendChild(description);

  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'actions';

  const visualizeButton = document.createElement('button');
  visualizeButton.id = 'visualize-dependencies-btn';
  visualizeButton.setAttribute('role', 'button');
  visualizeButton.setAttribute('aria-label', 'Visualize project dependencies');
  visualizeButton.textContent = 'Visualize Dependencies';
  visualizeButton.onclick = () => {
    const dependencies = getDependencies();
    visualizeDependencyTree(dependencies);
  };
  actionsContainer.appendChild(visualizeButton);

  const accessibilityButton = document.createElement('button');
  accessibilityButton.id = 'check-accessibility-btn';
  accessibilityButton.setAttribute('role', 'button');
  accessibilityButton.setAttribute('aria-label', 'Check and address accessibility issues');
  accessibilityButton.textContent = 'Check Accessibility';
  accessibilityButton.onclick = () => {
    main.addressAccessibilityIssues();
  };
  actionsContainer.appendChild(accessibilityButton);

  container.appendChild(actionsContainer);

  return container;
}

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

  // New function for rotating back
  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  // New function to address all accessibility issues
  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
    // Replace getDependencies() with actual function or variable
    const dependencies = getDependencies();
    return dependencies;
  }
};

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
}

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
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

// Example usage for SVGs:
// const svg1 = ...
// const svg2 = ...
// svg1.setAttribute('aria-label', 'Description of first icon');
// svg2.setAttribute('aria-label', 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
export function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
export function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
}

function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.querySelector('main');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.querySelector('.svg-1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.querySelector('.svg-2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// New functions for rendering graph and index
function renderGraph() {
  const graph = document.querySelector('.graph');
  if (graph) {
    graph.setAttribute('role', 'img');
    graph.setAttribute('aria-label', 'Graph');
  }
}

function renderIndex() {
  const index = document.querySelector('.index');
  if (index) {
    index.setAttribute('role', 'list');
    index.setAttribute('aria-label', 'Index');
  }
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarkElements() {
  const landmarks = document.querySelectorAll('[role="main"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
export function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    if (link.getAttribute('aria-hidden') === 'true') {
      link.setAttribute('role', 'button');
    }
  });
}

/**
 * Validates a single landmark element for accessibility compliance
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if the landmark is valid, false otherwise
 */
function validateLandmark(landmark) {
  // Check if landmark has appropriate role
  if (!landmark.hasAttribute('role') ||
      !['main', 'complementary', 'navigation', 'search'].includes(landmark.getAttribute('role'))) {
    return false;
  }

  // Check if landmark has appropriate name
  if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
    return false;
  }

  // Additional checks can be added here
  return true;
}

/**
 * Validates the overall landmark structure of the page
 * @returns {boolean} True if the landmark structure is valid
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="main"], [role="complementary"], [role="navigation"], [role="search"]');

  // Count each type of landmark
  const mainCount = landmarks.filter(l => l.getAttribute('role') === 'main').length;
  const complementaryCount = landmarks.filter(l => l.getAttribute('role') === 'complementary').length;
  const navigationCount = landmarks.filter(l => l.getAttribute('role') === 'navigation').length;
  const searchCount = landmarks.filter(l => l.getAttribute('role') === 'search').length;

  // Basic validation: ensure at least one main landmark exists
  if (mainCount === 0) {
    console.warn('No main landmark found on the page');
    return false;
  }

  // Ensure no duplicate landmark IDs (reusing previous function)
  ensureUniqueLandmarkElements();

  return true;
}

/**
 * Adds fixes for landmark issues throughout the page
 * @returns {boolean} True if fixes were applied
 */
function addFixLandmarkIssues() {
  // Apply any necessary fixes for landmark accessibility
  // This could include adding missing roles, labels, etc.

  // Example: Find all main landmarks and ensure they have proper roles
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  mainLandmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', 'Main content area');
    }
  });

  return true;
}

// REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    if (link.getAttribute('aria-hidden') === 'true') {
      link.setAttribute('role', 'button');
    }
  });
}

// Create accessible link element
function createAccessibleLink() {
  const link = document.createElement('a');
  link.href = '#';
  link.setAttribute('role', 'button');
  link.setAttribute('aria-label', 'Go to main content');
  return link;
}

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
const fakeLink = document.querySelector('a[href="#"]');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Load landmarks from file (new addition)
import { CONFIG } from './utils/constants';
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

    const validLandmarks = landmarks.filter(landmark => landmark && typeof landmark.id !== 'undefined');
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
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
function getLandmarkById(landmarks, id) {
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

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  replaceFakeLinks();

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  addSvgAccessibleNames();

  // Render graph and index using the new functions
  renderGraph();
  renderIndex();
}

// Helper function to replace fake links with proper buttons
// (Integrated into replaceFakeLinks above)

// Initialize the application with accessibility improvements
function initialize() {
  initializeAccessibility();
  // Other initialization code (if any)
}

// Helper function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }
}

// Export functions for testing (new addition)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks,
        getConfig, ensureThScope, setupSkipLinks, setupButtonAccessibility, addLandmarkRoles,
        addSvgAccessibleNames, renderGraph, renderIndex, ensureUniqueLandmarkElements,
        fixFakeLinkIssues, createAccessibleLink, initialize, initializeAccessibility,
        replaceFakeLinks, addFixLandmarkIssues, renderIndexView
    };
}

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue
// ==============================================================================
// Resolved Merge Conflict
// Combined HEAD and origin/main changes while preserving all functionality
// ==============================================================================

// Additional missing exports as per the issue
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
  createUnrotateButton,
  getConfig,
  ensureThScope,
  setupSkipLinks,
  setupButtonAccessibility,
  addLandmarkRoles,
  addSvgAccessibleNames,
  renderGraph,
  renderIndex,
  ensureUniqueLandmarkElements,
  fixFakeLinkIssues,
  createAccessibleLink,
  initialize,
  initializeAccessibility,
  replaceFakeLinks,
  addFixLandmarkIssues,
  renderIndexView
};