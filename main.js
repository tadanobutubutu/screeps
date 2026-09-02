const books = [];
const safetyCategory = "User Safety: safe";

const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');

function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);

  announceBookAdded(title, author);

  return bookObject;
}

function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

function getBooksList() {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
}

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

  // Rest of the code remains the same as before the merge conflict
  // ...

  // Accessibility improvements
  addressAccessibilityIssues();

  // Create the in-page button
  createInPageButton('Accessibility Info', () => {
    console.log('Accessibility Info button clicked');
  });

  // Add accessible names to 2 SVGs
  setSvgAccessibleNames('svg1Id', 'svg2Id', ' aria-label for SVG1', ' aria-label for SVG2');

  // Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Fix 1 fake link issue
  fixFakeLink();

  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }

  // Initialize application logic and infrastructure
  const server = express();
  server.use(express.static(__dirname));
  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  server.listen(3001, () => {
    console.log('Server started on port 3001');
  });
}

// Set up script for running the application directly
if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    console.log('First landmark:', sorted[0]);
  }
}

// Helper functions
function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
}

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

function countDependencies() {
  // Implementation of countDependencies function
  // Placeholder implementation for demonstration purposes
  console.log('Counting dependencies...');
  // You would implement the actual dependency counting logic here
  return 0;
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

// Initialize on DOM ready
function initialize() {
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

  // Address accessibility issues
  addressAccessibilityIssues();

  // Create the in-page button
  createInPageButton();

  // Add accessible names to 2 SVGs
  setSvgAccessibleNames('svg1Id', 'svg2Id', ' aria-label for SVG1', ' aria-label for SVG2');

  // Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Fix 1 fake link issue
  fixFakeLink();

  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }

  // Add the book form to the page
  const bookForm = addBookWithAccessibility();
  const container = document.getElementById('book-form-container') || document.body;
  container.appendChild(bookForm);
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}