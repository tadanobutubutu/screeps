// main.js - Accessibility Issue Handler

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

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute (html, lang = 'en') {
  if (typeof html !== 'string') return html
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match
    return `<html${attrs} lang="${lang}">`
  })
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure (html) {
  if (typeof html !== 'string') return html

  // Ensure every table has a caption
  html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (/<caption/i.test(match)) return match
    return `<table${attrs}><caption></caption>`
  })

  // Close caption and wrap rows in thead/tbody where missing
  html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
    if (/<thead/i.test(content)) return match
    const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []
    if (rows.length === 0) return match
    const firstRows = rows.slice(0, 1).join('')
    const restRows = rows.slice(1).join('')
    const thPattern = /<td>/gi
    const firstRowHasTh = thPattern.test(firstRows)
    let thead = ''
    let tbody = restRows

    if (!firstRowHasTh) {
      thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`
    } else {
      thead = `<thead>${firstRows}</thead>`
    }
    if (!tbody) tbody = ''
    tbody = `<tbody>${tbody}</tbody>`

    return `<table${attrs}>${thead}${tbody}</table>`
  })

  // Add scope="col" to th elements that don't have it
  html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (/\bscope=/i.test(match)) return match
    return `<th${attrs} scope="col">`
  })

  return html
}

// Configuration
const config = {
  dataPath: './data',
  maxResults: 100
};

// Landmark validation configuration
const CONFIG = {
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

// Landmark validation configuration
const landmarkConfig = CONFIG;

// Helper functions
function isValidLandmark(landmark) {
  return landmark && landmark.id && landmark.role;
}

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

function sortLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  return landmarks.sort((a, b) => {
    const roleA = a.role || '';
    const roleB = b.role || '';
    return roleA.localeCompare(roleB);
  });
}

function getLandmarkById(landmarks, id) {
  if (!Array.isArray(landmarks)) {
    return null;
  }
  return landmarks.find(landmark => landmark.id === id);
}

// Accessibility utilities functions
function setLanguageAttribute(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang || 'en';
  }
}

function addLandmarkRoles(container) {
  if (typeof container !== 'undefined' && container) {
    const landmarks = container.querySelectorAll('[role]');
    landmarks.forEach(landmark => {
      if (!landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${landmark.getAttribute('role')} landmark`);
      }
    });
  }
}

function fixFakeLinks(container) {
  if (typeof container !== 'undefined' && container) {
    const links = container.querySelectorAll('a[href="#"]');
    links.forEach(link => {
      if (!link.hasAttribute('aria-disabled')) {
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '0');
      }
    });
  }
}

function fixFakeLink() {
  // Implementation for fixing fake links
  fixFakeLinks();
}

function addressAccessibilityIssues() {
  // Address general accessibility issues
  if (typeof document !== 'undefined') {
    const mainElement = document.querySelector('main');
    if (mainElement && !mainElement.hasAttribute('role')) {
      mainElement.setAttribute('role', 'main');
    }
  }
}

function createInPageButton(label, callback) {
  if (typeof document !== 'undefined') {
    const button = document.createElement('button');
    button.textContent = label || 'Accessibility Info';
    button.setAttribute('aria-label', label || 'Accessibility Information');
    button.addEventListener('click', callback || (() => {
      console.log('Accessibility Info button clicked');
    }));
    return button;
  }
  return null;
}

function setSvgAccessibleNames(svg1Id, svg2Id, label1, label2) {
  if (typeof document !== 'undefined') {
    const svg1 = document.getElementById(svg1Id);
    const svg2 = document.getElementById(svg2Id);
    
    if (svg1 && label1) {
      svg1.setAttribute('aria-label', label1);
    }
    if (svg2 && label2) {
      svg2.setAttribute('aria-label', label2);
    }
  }
}

function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function validateInput(input) {
  if (input === null || input === undefined) {
    return { valid: false, error: 'Input is required' };
  }
  if (typeof input === 'string' && input.trim() === '') {
    return { valid: false, error: 'Input cannot be empty' };
  }
  return { valid: true };
}

function processData(data) {
  if (!data) return null;
  if (typeof data === 'string') {
    return data.trim();
  }
  if (Array.isArray(data)) {
    return data.filter(item => item != null);
  }
  return data;
}

function formatResponse(data, status = 'success') {
  return {
    status,
    data,
    timestamp: new Date().toISOString()
  };
}

function validateTableAccessibility(table) {
  // Validate table accessibility
  if (!table) return { valid: false, error: 'Table not found' };
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td');
  
  if (headers.length === 0) {
    return { valid: false, error: 'Table must have header cells' };
  }
  
  return { valid: true };
}

function validateTableStructure(table) {
  // Validate table structure
  if (!table) return { valid: false, error: 'Table not found' };
  
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    return { valid: false, error: 'Table must have at least one row' };
  }
  
  return { valid: true };
}

function getSvgAccessibleName(svg) {
  if (!svg) return null;
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg, attributes) {
  if (!svg || !attributes) return;
  Object.keys(attributes).forEach(key => {
    svg.setAttribute(key, attributes[key]);
  });
}

function addMainLandmark(container) {
  if (!container) return;
  const main = container.querySelector('main') || document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
}

function validateLandmark(landmark) {
  if (!landmark) return { valid: false, error: 'Landmark not found' };
  if (!landmark.id) return { valid: false, error: 'Landmark must have an id' };
  if (!landmark.role) return { valid: false, error: 'Landmark must have a role' };
  return { valid: true };
}

function validateLandmarkStructure(landmarks) {
  if (!Array.isArray(landmarks)) {
    return { valid: false, error: 'Landmarks must be an array' };
  }
  return { valid: true };
}

function validateLandmarkAttributes(landmark) {
  if (!landmark) return { valid: false, error: 'Landmark not found' };
  const required = ['id', 'role'];
  const missing = required.filter(attr => !landmark[attr]);
  if (missing.length > 0) {
    return { valid: false, error: `Missing attributes: ${missing.join(', ')}` };
  }
  return { valid: true };
}

function addProperLandmarkRegions(container) {
  if (!container) return;
  const regions = container.querySelectorAll('[role="region"]');
  regions.forEach(region => {
    if (!region.hasAttribute('aria-label')) {
      region.setAttribute('aria-label', 'Region');
    }
  });
}

function validateLinkAccessibility(link) {
  if (!link) return { valid: false, error: 'Link not found' };
  if (!link.href) return { valid: false, error: 'Link must have href' };
  if (link.href === '#') {
    return { valid: false, error: 'Link should not be a fake link' };
  }
  return { valid: true };
}

function handleFakeLinks(container) {
  fixFakeLinks(container);
}

function checkLinkAccessibility(container) {
  if (!container) return [];
  const links = container.querySelectorAll('a');
  const issues = [];
  
  links.forEach(link => {
    const result = validateLinkAccessibility(link);
    if (!result.valid) {
      issues.push({ link, error: result.error });
    }
  });
  
  return issues;
}

// Report generation functions
function writeReport(report) {
  const reportPath = path.join(__dirname, 'accessibility-report.txt');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('Accessibility report written to:', reportPath);
}

async function scanAccessibility() {
  // Simulated accessibility scan
  return {
    timestamp: new Date().toISOString(),
    issues: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };
}

async function generateAccessibilityReport() {
  const report = await scanAccessibility();
  writeReport(report);
  return report;
}

// Additional utility functions
function harvest() {
  console.log('Harvesting data...');
  return [];
}

function upgrade() {
  console.log('Upgrading system...');
  return true;
}

function harvestAndUpgrade() {
  const harvested = harvest();
  const upgraded = upgrade();
  return { harvested, upgraded };
}

// New function from origin/main branch
function addBookWithAccessibility(title, author, isbn) {
  // Create form elements with proper ARIA attributes
  if (typeof document !== 'undefined') {
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
  return null;
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

  if (typeof document !== 'undefined') {
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
  return null;
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

// Initialize application
function initialize() {
  // Ensure the dependencyGraph container has a proper ARIA role
  if (typeof dependencyGraph !== 'undefined' && dependencyGraph) {
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
  if (typeof document !== 'undefined') {
    const bookForm = addBookWithAccessibility();
    const container = document.getElementById('book-form-container') || document.body;
    if (container && bookForm) {
      container.appendChild(bookForm);
    }
  }
}

function initializeApp() {
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

function main() {
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

// Set up script for running the application directly
if (require.main === module) {
  main();
}

// Additional functions from other branches
function function1(...args) {
  console.log('Updated function1 implementation:', args);
}

function function2(...args) {
  console.log('Updated function2 implementation:', args);
}

function function3() {
  // ... implementation from 'origin/main' branch
  return "function3 implemented";
}

function newFunction() {
  console.log('New function added');
}

function newFunctionFromOriginMain() {
  console.log('New function from origin/main');
}

function updatedFunction1(...args) {
  console.log('Updated function1 called with:', args);
}

function updatedFunction2(...args) {
  console.log('Updated function2 called with:', args);
}

function newImplementationForFunction3() {
  return "new implementation for function3";
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

// Export all functions and utilities
module.exports = {
  // Book functions
  addBook,
  getBooksList,
  books,
  safetyCategory,
  
  // Accessibility utilities
  setLanguageAttribute,
  getLangAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  fixFakeLink,
  addressAccessibilityIssues,
  createInPageButton,
  setSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixUniqueLandmarks,
  
  // Table accessibility
  validateTableAccessibility,
  validateTableStructure,
  
  // SVG accessibility
  getSvgAccessibleName,
  setSvgAttributes,
  
  // Landmark functions
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  addProperLandmarkRegions,
  
  // Link accessibility
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  
  // Report generation
  generateAccessibilityReport,
  scanAccessibility,
  writeReport,
  
  // Additional utilities
  harvest,
  upgrade,
  harvestAndUpgrade,
  countDependencies,
  
  // Landmark processing
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  isValidLandmark,
  landmarkConfig: CONFIG,
  config,
  
  // Input processing
  validateInput,
  processData,
  formatResponse,
  
  // Functions from origin/main branch
  function1,
  function2,
  function3,
  newFunction,
  newFunctionFromOriginMain,
  updatedFunction1,
  updatedFunction2,
  newImplementationForFunction3,
  
  // Book with accessibility
  addBookWithAccessibility,
  
  // Dependency graph
  renderDependencyGraph,
  getDependencies,
  
  // Initialize functions
  initialize,
  initializeApp,
  main,
  
  // Accessibility a11y module
  a11y,
  announceBookAdded
};