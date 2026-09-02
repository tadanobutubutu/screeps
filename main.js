const books = [];
const safetyCategory = "User Safety: safe";

const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');

// Require accessibility utilities at the top for global use
const accessibilityUtilities = require('./AccessibilityUtilities');
const { 
  setLanguageAttribute, 
  addLandmarkRoles, 
  fixFakeLinks, 
  addressAccessibilityIssues, 
  createInPageButton, 
  setSvgAccessibleNames, 
  ensureUniqueLandmarks, 
  fixUniqueLandmarks 
} = accessibilityUtilities;

// Book-related functions
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

// Landmark helper functions
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
  return landmarks.sort((a, b) => a.id.localeCompare(b.id));
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(landmark => landmark.id === id);
}

function isValidLandmark(landmark) {
  return landmark && landmark.id && landmark.name;
}

// Upgrade logic
function upgrade() {
  const currentVersion = appData.version || '1.0.0';
  const targetVersion = '2.0.0';
  
  console.log(`Starting upgrade from version ${currentVersion} to ${targetVersion}...`);
  
  // Perform upgrade tasks
  const upgrades = [];
  
  // Upgrade landmarks
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  upgrades.push({ task: 'processLandmarks', count: processed.length });
  
  // Fix accessibility issues
  addressAccessibilityIssues();
  upgrades.push({ task: 'addressAccessibilityIssues', completed: true });
  
  // Ensure unique landmarks
  fixUniqueLandmarks();
  upgrades.push({ task: 'fixUniqueLandmarks', completed: true });
  
  // Fix fake links
  fixFakeLinks();
  upgrades.push({ task: 'fixFakeLinks', completed: true });
  
  // Update language attribute
  setLanguageAttribute();
  upgrades.push({ task: 'setLanguageAttribute', completed: true });
  
  console.log('Upgrade completed successfully!');
  console.log('Upgrades performed:', upgrades);
  
  return { success: true, upgrades };
}

// Additional accessibility functions from HEAD (not provided by AccessibilityUtilities)
function validateLandmark(landmark) {
  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    const tagElements = document.querySelectorAll(role);
    const totalCount = elements.length + (role === 'main' ? 0 : tagElements.length);
    if (totalCount > 1) {
      issues.push(`REACT_017: Landmark role "${role}" appears ${totalCount} times, should be unique`);
    }
  });
  return { valid: issues.length === 0, issues };
}

function validateLandmarkStructure(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  document.querySelectorAll('header, nav, main, aside, footer').forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    if (role && !validLandmarks.includes(role)) {
      issues.push(`REACT_017: Element at index ${index} has invalid role "${role}"`);
    }
  });
  return { valid: issues.length === 0, issues };
}

function validateLandmarkAttributes(landmark) {
  if (!landmark || !landmark.attributes) {
    return false;
  }
  return true;
}

function addMainLandmark() {
  // Code for adding main landmark
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    const newMain = document.createElement('main');
    document.body.insertBefore(newMain, document.body.firstChild);
  }
}

function validateTableAccessibility(table) {
  const issues = [];
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('REACT_027: Table is missing a caption');
  }
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      issues.push(`REACT_027: Header at index ${index} is missing scope or id attribute`);
    }
  });
  return { valid: issues.length === 0, issues };
}

function validateTableStructure(table) {
  const issues = [];
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  const rows = table.querySelectorAll('tr');
  let cellCount = 0;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const isHeaderRow = row.parentElement.tagName === 'THEAD';
    cells.forEach((cell, cellIndex) => {
      if (cell.tagName === 'TH' && !isHeaderRow) {
        issues.push(`REACT_027: Row ${rowIndex} contains th but is not in thead`);
      }
      if (cell.tagName === 'TD' && isHeaderRow) {
        issues.push(`REACT_027: Row ${rowIndex} in thead contains td instead of th`);
      }
    });
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td, th').length;
      if (cells.length !== prevCells) {
        issues.push(`REACT_027: Row ${rowIndex} has ${cells.length} cells but previous row has ${prevCells}`);
      }
    }
    cellCount += cells.length;
  });
  return { valid: issues.length === 0, issues };
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const validation = validateTableStructure(table);
    if (!validation.valid) {
      // Add missing caption if needed
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Table caption';
        table.insertBefore(caption, table.firstChild);
      }

      // Add scope to headers if needed
      const headers = table.querySelectorAll('th');
      headers.forEach((th, index) => {
        if (!th.getAttribute('scope') && !th.getAttribute('id')) {
          th.setAttribute('scope', 'col');
        }
      });
    }
  });
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return null;
  }
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  return null;
}

function setSvgAttributes(svgElement, name) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return false;
  }
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');
  if (!name) {
    svgElement.setAttribute('aria-hidden', 'true');
    return true;
  }
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;
  const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  title.setAttribute('id', titleId);
  svgElement.setAttribute('aria-labelledby', titleId);
  svgElement.removeAttribute('aria-hidden');
  return true;
}

function validateLinkAccessibility(link) {
  const issues = [];
  if (!link) {
    return { valid: false, issues: ['Link element is required'] };
  }
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  if (!text && !ariaLabel) {
    issues.push('REACT_036: Link has no accessible name (no text or aria-label)');
  }
  if (text && (text === 'click here' || text === 'read more' || text === 'learn more')) {
    issues.push(`REACT_036: Link text "${text}" is not descriptive`);
  }
  return { valid: issues.length === 0, issues };
}

function handleFakeLinks(container) {
  const issues = [];
  const elements = container ? container.querySelectorAll('a, button') : document.querySelectorAll('a, button');
  elements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'a' && !element.getAttribute('href') && !element.getAttribute('onclick')) {
      issues.push(`REACT_036: Element at index ${index} is an anchor without href or onclick`);
    }
    if (tagName === 'button' && element.querySelector('a')) {
      issues.push(`REACT_036: Button at index ${index} contains an anchor element`);
    }
  });
  return { valid: issues.length === 0, issues };
}

/**
 * Fixes fake links that don't have proper href attributes.
 */
function fixFakeLinks() {
  const container = document.body;
  const result = handleFakeLinks(container);

  if (!result.valid) {
    // Convert fake links to buttons
    const fakeLinks = container.querySelectorAll('a:not([href])');
    fakeLinks.forEach(link => {
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.setAttribute('type', 'button');
      button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);

      // Copy any event listeners
      const clickHandler = link.onclick;
      if (clickHandler) {
        button.addEventListener('click', clickHandler);
      }

      // Replace the link with the button
      link.parentNode.replaceChild(button, link);
    });
  }
}

function addLandmarkRegions() {
  addProperLandmarkRegions();
}

function addProperLandmarkRegions(container) {
  const result = { added: [], issues: [] };
  const root = container || document.body;
  let main = root.querySelector('main, [role="main"]');
  if (!main) {
    main = document.createElement('main');
    const firstChild = root.firstChild;
    if (firstChild) {
      root.insertBefore(main, firstChild);
    } else {
      root.appendChild(main);
    }
    result.added.push('main');
  }
  let header = root.querySelector('header, [role="banner"]');
  if (!header) {
    header = document.createElement('header');
    root.insertBefore(header, root.firstChild);
    result.added.push('header');
  }
  let footer = root.querySelector('footer, [role="contentinfo"]');
  if (!footer) {
    footer = document.createElement('footer');
    root.appendChild(footer);
    result.added.push('footer');
  }
  return result;
}

function processAccessibilityReport(report) {
  const findings = {
    langAttribute: false,
    tableIssues: 0,
    landmarkIssues: 0,
    svgIssues: 0,
    uniqueLandmarkIssues: 0,
    fakeLinkIssues: 0
  };
  if (report) {
    if (report.REACT_015) findings.langAttribute = true;
    if (report.REACT_027) findings.tableIssues = report.REACT_027.count || 0;
    if (report.REACT_017) findings.landmarkIssues = report.REACT_017.count || 0;
    if (report.REACT_041) findings.svgIssues = report.REACT_041.count || 0;
    if (report.REACT_025) findings.uniqueLandmarkIssues = report.REACT_025.count || 0;
    if (report.REACT_036) findings.fakeLinkIssues = report.REACT_036.count || 0;
  }
  return findings;
}

function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return;
  }
  insightReport.issues.forEach((issue) => {
    switch (issue.type) {
      case 'REACT_015':
        if (issue.element) {
          addLangAttribute(issue.element);
        } else {
          setLanguageAttribute();
        }
        break;
      case 'REACT_027':
        if (issue.table) {
          validateTableStructure(issue.table);
          fixTableStructure();
        } else {
          const tables = document.querySelectorAll('table');
          tables.forEach(table => {
            validateTableAccessibility(table);
            fixTableStructure();
          });
        }
        break;
      case 'REACT_017':
        if (issue.landmark) {
          validateLandmarkStructure(issue.landmark);
        } else {
          validateLandmark();
        }
        addLandmarkRegions();
        break;
      case 'REACT_041':
        if (issue.svg) {
          const accessibleName = getSvgAccessibleName(issue.svg);
          setSvgAttributes(issue.svg, accessibleName);
        } else {
          // Handle all SVGs in the document
          const svgs = document.querySelectorAll('svg');
          svgs.forEach(svg => {
            const name = getSvgAccessibleName(svg);
            setSvgAttributes(svg, name || 'Graphic');
          });
        }
        break;
      case 'REACT_025':
        ensureUniqueLandmarks(landmarks);
        break;
      case 'REACT_036':
        handleFakeLinks();
        createInPageButton('main-content', 'Skip to main content');
        break;
      default:
        break;
    }
  });
}

function createAccessibleBookForm(container) {
  const form = document.createElement('form');
  form.setAttribute('role', 'form');
  form.setAttribute('aria-labelledby', 'add-book-form-title');
  const title = document.createElement('h2');
  title.id = 'add-book-form-title';
  title.textContent = 'Add New Book';
  form.appendChild(title);
  const fields = [
    { id: 'book-title', label: 'Title', type: 'text', required: true },
    { id: 'book-author', label: 'Author', type: 'text', required: true },
    { id: 'book-isbn', label: 'ISBN', type: 'text', required: false },
    { id: 'book-published', label: 'Published Date', type: 'date', required: false }
  ];
  fields.forEach(field => {
    const fieldset = document.createElement('div');
    fieldset.className = 'form-field';
    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;
    fieldset.appendChild(label);
    const input = document.createElement('input');
    input.id = field.id;
    input.type = field.type;
    input.required = field.required;
    input.setAttribute('aria-required', field.required.toString());
    fieldset.appendChild(input);
    form.appendChild(fieldset);
  });
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Book';
  submitButton.setAttribute('aria-label', 'Submit the book form');
  form.appendChild(submitButton);
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');
  });
  if (container) {
    container.appendChild(form);
  }
  return form;
}

function enhanceFormAccessibility(form) {
  if (!form) return;
  form.setAttribute('role', 'form');
  form.setAttribute('aria-labelledby', 'form-title');
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
      input.id = id;
      const label = form.querySelector(`label[for="${id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', label.id);
      } else {
        const type = input.type || 'text';
        input.setAttribute('aria-label', `${type} input`);
      }
    }
  });
  const buttons = form.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent.trim() || 'Submit button');
    }
  });
}

function addLangAttribute(element) {
  if (element && !element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Initialize application and apply accessibility fixes
const initApp = () => {
  initializeApp();
  setLanguageAttribute();
  addLandmarkRoles();
  ensureUniqueLandmarks(landmarks);
  const icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screeps icon"></svg>'
  };
  fixFakeLinks();
  console.log('Initializing ' + appData.title + ' v' + appData.version);
};

if (typeof isSecureContext !== 'undefined' && isSecureContext()) {
  initApp();
} else if (typeof console !== 'undefined') {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// New function from origin/main branch
function addBookWithAccessibility(title, author, isbn) {
  const form = document.createElement('form');
  form.setAttribute('role', 'form');
  form.setAttribute('aria-label', 'Add new book form');
  const titleLabel = document.createElement('label');
  titleLabel.setAttribute('for', 'book-title');
  titleLabel.textContent = 'Book Title:';
  const titleInput = document.createElement('input');
  titleInput.id = 'book-title';
  titleInput.type = 'text';
  titleInput.required = true;
  titleInput.setAttribute('aria-required', 'true');
  titleInput.setAttribute('aria-label', 'Enter the title of the book');
  const authorLabel = document.createElement('label');
  authorLabel.setAttribute('for', 'book-author');
  authorLabel.textContent = 'Author:';
  const authorInput = document.createElement('input');
  authorInput.id = 'book-author';
  authorInput.type = 'text';
  authorInput.required = true;
  authorInput.setAttribute('aria-required', 'true');
  authorInput.setAttribute('aria-label', 'Enter the author of the book');
  const isbnLabel = document.createElement('label');
  isbnLabel.setAttribute('for', 'book-isbn');
  isbnLabel.textContent = 'ISBN:';
  const isbnInput = document.createElement('input');
  isbnInput.id = 'book-isbn';
  isbnInput.type = 'text';
  isbnInput.required = true;
  isbnInput.setAttribute('aria-required', 'true');
  isbnInput.setAttribute('aria-label', 'Enter the ISBN of the book');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Book';
  submitButton.setAttribute('aria-label', 'Submit the form to add a new book');
  const errorArea = document.createElement('div');
  errorArea.id = 'book-form-error';
  errorArea.setAttribute('role', 'alert');
  errorArea.setAttribute('aria-live', 'assertive');
  errorArea.style.color = 'red';
  const successArea = document.createElement('div');
  successArea.id = 'book-form-success';
  successArea.setAttribute('role', 'status');
  successArea.setAttribute('aria-live', 'polite');
  successArea.style.color = 'green';
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(authorLabel);
  form.appendChild(authorInput);
  form.appendChild(isbnLabel);
  form.appendChild(isbnInput);
  form.appendChild(submitButton);
  form.appendChild(errorArea);
  form.appendChild(successArea);
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    errorArea.textContent = '';
    successArea.textContent = '';
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
    successArea.textContent = `Book "${titleInput.value}" by ${authorInput.value} added successfully!`;
    setTimeout(() => {
      form.reset();
      successArea.textContent = '';
    }, 3000);
  });
  form.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      form.reset();
      errorArea.textContent = '';
      successArea.textContent = '';
    }
  });
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
  console.log('Counting dependencies...');
  return 0;
}

// Initialize on DOM ready
function initialize() {
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
  addressAccessibilityIssues();
  createInPageButton();
  setSvgAccessibleNames('svg1Id', 'svg2Id', ' aria-label for SVG1', ' aria-label for SVG2');
  ensureUniqueLandmarks();
  fixFakeLinks();
  if (a11y && a11y.init) {
    a11y.init();
  }
  const bookForm = addBookWithAccessibility();
  const container = document.getElementById('book-form-container') || document.body;
  container.appendChild(bookForm);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
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

// Main initialize function for Node.js environment
function initializeApp() {
  // ... existing initialization code remains
  const initialize = () => {
    console.log('Initializing application...');
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
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
  };
  initialize();
  const server = express();
  server.use(express.static(__dirname));
  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  server.listen(3001, () => {
    console.log('Server started on port 3001');
  });
}

// Export all functions and constants
module.exports = {
  // Book functions
  addBook,
  getBooksList,
  announceBookAdded,
  safetyCategory,
  // Landmark functions
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  // Accessibility utilities from module
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  addressAccessibilityIssues,
  createInPageButton,
  setSvgAccessibleNames,
  fixUniqueLandmarks,
  // Additional accessibility functions
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  addMainLandmark,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  addLandmarkRegions,
  addProperLandmarkRegions,
  processAccessibilityReport,
  createAccessibleBookForm,
  enhanceFormAccessibility,
  addLangAttribute,
  getLangAttribute,
  addBookWithAccessibility,
  renderDependencyGraph,
  getDependencies,
  countDependencies,
  upgrade,
  initialize,
  initializeApp,
  // Other exports
  config,
  a11y,
  utils,
  axe,
  express,
  fs,
  path
};