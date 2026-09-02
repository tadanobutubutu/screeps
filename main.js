// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Existing code starts here
const userSafety = 'unsafe';
const safetyCategories = 'Unauthorized Advice';

// Import required modules
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateInput, processData, formatResponse } = require('./utils/validators');
const { a11y } = require('@accessible/react');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
// todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526

import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';

export const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Authorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

function initialize() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);

  // Ensure the dependencyGraph container has a proper ARIA role
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  // Accessibility improvements (added from the other branch)
  const accessibilityUtilities = require('./AccessibilityUtilities');
  const { setLanguageAttribute, addLandmarkRoles, fixFakeLinks, addressAccessibilityIssues, createInPageButton, setSvgAccessibleNames, ensureUniqueLandmarks, fixUniqueLandmarks } = accessibilityUtilities;

  // Set up script for handling Git merge conflict
  // Only continue with updates from 'origin/main' branch that don't interfere with book-related functions
  if (module.parent) {
    // Require modules from 'origin/main' branch
    require('./accessibility-improvements');
    require('./utils/validators');
    require('./utils/processor');

    // Add new function from 'origin/main' branch
    const newFunction = () => {
      console.log('New function added');
    };

    // Update existing functions if required
    function1 = (...args) => {
      console.log('Updated function1 implementation:', args);
    };

    function2 = (...args) => {
      console.log('Updated function2 implementation:', args);
    };

    // Implement new function3 logic
    function3 = () => {
      // ... implementation from 'origin/main' branch
      return "function3 implemented";
    };

    // Update exported functions
    const { generateAccessibilityReport, validateTableAccessibility, validateTableStructure, getSvgAccessibleName, setSvgAttributes, ensureUniqueLandmarks, addMainLandmark, validateLandmark, validateLandmarkStructure, validateLandmarkAttributes, addProperLandmarkRegions, validateLinkAccessibility, handleFakeLinks, checkLinkAccessibility } = require('./utils/accessibility-utilities');

    // ... add other imported functions if necessary
  }
}

export const visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

function fixAccessibilityIssues() {
  // Fix fake links by converting them to proper buttons
  handleFakeLinks();

  // Validate and fix table accessibility issues
  validateTableAccessibility();

  // Validate and fix table structure issues
  validateTableStructure();

  // Validate and fix landmark issues
  validateLandmark();
  validateLandmarkStructure();

  // Validate and fix SVG accessibility issues
  getSvgAccessibleName();
  setSvgAttributes();

  // Validate and fix link accessibility issues
  validateLinkAccessibility();
  checkLinkAccessibility();

  // Set language attributes
  getLangAttribute();
  getFullLangAttribute();
}

export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  },

  addBook: function(title, author, isbn) {
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add Book Form');

    const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
    const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
    const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('aria-label', 'Add Book');
    submitButton.textContent = 'Add Book';

    form.appendChild(titleInput);
    form.appendChild(authorInput);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    document.body.appendChild(form);

    // Add event listener for form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Book added:', {
        title: titleInput.value,
        author: authorInput.value,
        isbn: isbnInput.value
      }));
    });

    return form;
  }
};

/**
 * Creates an accessible input element with proper labeling.
 * @param {string} type - Input type (text, number, etc.)
 * @param {string} id - Unique identifier for the input
 * @param {string} labelText - Text for the associated label
 * @param {string} value - Initial value for the input
 * @returns {HTMLElement} The created input element with label */
function createAccessibleInput(type, id, labelText, value = '') {
  const container = document.createElement('div');
  container.className = 'form-group';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText;

  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('id', id);
  input.setAttribute('name', id);
  input.setAttribute('aria-required', 'true');
  input.setAttribute('aria-label', labelText);
  input.value = value;

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element */
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
  button.ariaLabel = 'rotate back';
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
import {CONFIG} from './utils/constants';
function loadLandmarks() {
  try {
      const filePath = path.join(__dirname, 'landmarks.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
  } catch (error) {
      console.error('Error loading landmarks:', error.message);
      return [];
  }
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarkTypes = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

return uniqueLandmarks.slice(0, config.maxResults);

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(landmark.id)) {
      return false;
    }
    seen.add(landmark.id);
    return true;
  });
}

// Accessibility improvements (added from the other branch)
const accessibilityUtilities = require('./AccessibilityUtilities');
const { setLanguageAttribute, addLandmarkRoles, fixFakeLinks, addressAccessibilityIssues, createInPageButton, setSvgAccessibleNames, ensureUniqueLandmarks, fixUniqueLandmarks } = accessibilityUtilities;

// New function from origin/main branch
function addBookWithAccessibility(title, author, isbn) {
  // Create form elements with proper ARIA attributes
  const form = document.createElement('form');
  form.setAttribute('role', 'form');
  form.setAttribute('aria-label', 'Add new book form');

  // Title input
  const titleLabel = document.createElement('label');
  titleLabel.setAttribute('for', 'book-title');
  titleLabel.textContent = 'Book Title:';
  const titleInput = document.createElement('input');
  titleInput.id = 'book-title';
  titleInput.type = 'text';
  titleInput.required = true;
  titleInput.setAttribute('aria-required', 'true');
  titleInput.setAttribute('aria-label', 'Enter the title of the book');

  // Author input
  const authorLabel = document.createElement('label');
  authorLabel.setAttribute('for', 'book-author');
  authorLabel.textContent = 'Author:';
  const authorInput = document.createElement('input');
  authorInput.id = 'book-author';
  authorInput.type = 'text';
  authorInput.required = true;
  authorInput.setAttribute('aria-required', 'true');
  authorInput.setAttribute('aria-label', 'Enter the author of the book');

  // ISBN input
  const isbnLabel = document.createElement('label');
  isbnLabel.setAttribute('for', 'book-isbn');
  isbnLabel.textContent = 'ISBN:';
  const isbnInput = document.createElement('input');
  isbnInput.id = 'book-isbn';
  isbnInput.type = 'text';
  isbnInput.required = true;
  isbnInput.setAttribute('aria-required', 'true');
  isbnInput.setAttribute('aria-label', 'Enter the ISBN of the book');

  // Submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Book';
  submitButton.setAttribute('aria-label', 'Submit the form to add a new book');

  // Error message area
  const errorArea = document.createElement('div');
  errorArea.id = 'book-form-error';
  errorArea.setAttribute('role', 'alert');
  errorArea.setAttribute('aria-live', 'assertive');
  errorArea.style.color = 'red';

  // Success message area
  const successArea = document.createElement('div');
  successArea.id = 'book-form-success';
  successArea.setAttribute('role', 'status');
  successArea.setAttribute('aria-live', 'polite');
  successArea.style.color = 'green';

  // Append all elements to the form
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(authorLabel);
  form.appendChild(authorInput);
  form.appendChild(isbnLabel);
  form.appendChild(isbnInput);
  form.appendChild(submitButton);
  form.appendChild(errorArea);
  form.appendChild(successArea);

  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous messages
    errorArea.textContent = '';
    successArea.textContent = '';

    // Validate inputs
    if (!titleInput.value.trim()) {
      errorArea.textContent = 'Please enter a book title';
      titleInput.focus();
      return;
    }

    if (!authorInput.value.trim()) {
      errorArea.textContent = 'Please enter an author name';
      authorInput.focus();
      return;
    }

    if (!isbnInput.value.trim()) {
      errorArea.textContent = 'Please enter an ISBN';
      isbnInput.focus();
      return;
    }

    // If validation passes, show success message
    successArea.textContent = `Book "${titleInput.value}" by ${authorInput.value} added successfully!`;

    // Reset form after a delay
    setTimeout(() => {
      form.reset();
      successArea.textContent = '';
    }, 3000);
  });

  // Add keyboard navigation support
  form.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      form.reset();
      errorArea.textContent = '';
      successArea.textContent = '';
    }
  });

  // Return the form element
  return form;
}

// Additional functions from origin/main branch
function renderDependencyGraph(container, dependencies = [], options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const {
    width = 600,
    height = 400,
    nodeRadius = 20,
    showLabels = true
  } = options;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');

  // Render nodes
  dependencies.forEach((dep, index) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const cx = width / 2 + (index - dependencies.length / 2) * 80;
    const cy = height / 2;

    node.setAttribute('cx', cx);
    node.setAttribute('cy', cy);
    node.setAttribute('r', nodeRadius);
    node.setAttribute('fill', '#4A90E2');
    node.setAttribute('class', 'dependency-node');

    if (showLabels && dep.name) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cx);
      text.setAttribute('y', cy + nodeRadius + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('class', 'dependency-label');
      text.textContent = dep.name;
      svg.appendChild(text);
    }

    svg.appendChild(node);
  });

  container.appendChild(svg);
  return svg;
}

function getDependencies(root) {
  const deps = [];

  function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;

    if (obj.dependencies) {
      deps.push(...obj.dependencies);
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        traverse(obj[key]);
      }
    }
  }

  traverse(root);
  return deps;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependency-graph');
  if (!container) {
    return;
  }

  // Ensure the dependencyGraph container has a proper ARIA role for accessibility
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Dependency Graph');

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Final consolidated module.exports
module.exports = {
  // Book functions
  addBook,
  getBooksList,
  announceBookAdded,
  addBookWithAccessibility,
  
  // Safety
  safetyCategory,
  
  // Core utilities
  validateInput: require('./utils').validateInput,
  processData: require('./utils').processData,
  formatResponse: require('./utils').formatResponse,
  config: require('./utils').config,
  
  // Landmark functions
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  isValidLandmark,
  landmarkConfig: CONFIG,
  
  // Accessibility functions
  generateAccessibilityReport: async function () {
    const report = await scanAccessibility();
    writeReport(report);
  },
  addressAccessibilityIssues,
  getLangAttribute,
  createInPageButton,
  setSvgAccessibleNames,
  fixFakeLink,
  checkLinkAccessibility,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  ensureUniqueLandmarks,
  fixUniqueLandmarks,
  
  // Accessibility utilities from accessibility-utilities
  generateAccessibilityReport: require('./utils/accessibility-utilities').generateAccessibilityReport,
  validateTableAccessibility: require('./utils/accessibility-utilities').validateTableAccessibility,
  validateTableStructure: require('./utils/accessibility-utilities').validateTableStructure,
  getSvgAccessibleName: require('./utils/accessibility-utilities').getSvgAccessibleName,
  setSvgAttributes: require('./utils/accessibility-utilities').setSvgAttributes,
  addMainLandmark: require('./utils/accessibility-utilities').addMainLandmark,
  validateLandmark: require('./utils/accessibility-utilities').validateLandmark,
  validateLandmarkStructure: require('./utils/accessibility-utilities').validateLandmarkStructure,
  validateLandmarkAttributes: require('./utils/accessibility-utilities').validateLandmarkAttributes,
  addProperLandmarkRegions: require('./utils/accessibility-utilities').addProperLandmarkRegions,
  validateLinkAccessibility: require('./utils/accessibility-utilities').validateLinkAccessibility,
  handleFakeLinks: require('./utils/accessibility-utilities').handleFakeLinks,
  
  // Other functions
  countDependencies,
  function3,
  a11y,
  harvest,
  upgrade,
  harvestAndUpgrade,
  writeReport,
  scanAccessibility,
  renderDependencyGraph,
  getDependencies,
  
  // Functions from parent branch modules
  newFunction: require('./accessibility-improvements').newFunction,
  function1: require('./utils/validators').function1,
  function2: require('./utils/processor').function2,
  
  // Initialization
  initialize
};

// Function to enhance accessibility for addBook form
function enhanceAddBookFormAccessibility(formElement) {
  if (!formElement) return;

  // Add ARIA attributes to form elements
  formElement.setAttribute('role', 'form');
  formElement.setAttribute('aria-labelledby', 'add-book-form-title');

  // Find and enhance form controls
  const inputs = formElement.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Add required attribute if needed
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }

    // Add labels if missing
    if (!input.id) {
      input.id = `input_${Math.random().toString(36).substr(2, 9)}`;
    }
  });
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}