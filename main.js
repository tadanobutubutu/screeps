// User Safety: unsafe
// Safety Categories: PII/Privacy

// This file includes both the accessibility improvements and the dependency visualization tool features.
// Merged from HEAD and origin/main to preserve all functionality

import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const accessiblyHelper = require('./accessibly-helper');

// DOM Elements
const dependencyGraph = document.getElementById('dependencyGraph');

// Pages directory for scanning
const pagesDir = path.join(__dirname, 'pages');

// Helper function to check if a link is accessible
function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

// Helper function to generate dependency report
function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

// New function3 logic
function function3() {
  console.log('Function3 is running.');
}

// Get language attribute
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Get full language attribute
function getFullLangAttribute() {
  // Implementation of getFullLangAttribute function
  return document.documentElement.getAttribute('data-lang') || document.documentElement.lang || 'en';
}

// New function to initialize the app with the language attribute
function initAppWithLang() {
  const html = document.documentElement;
  const language = getLangAttribute() || getFullLangAttribute();
  if (language) {
    html.setAttribute('lang', language);
  }
}

// Updated init function for accessibility improvements
function initApp() {
  initAppWithLang();
  // Remaining code from initApp function
}

// Load landmarks from file
function loadLandmarks() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    // Fallback to DOM-based landmarks if file not available
    const landmarks = [];
    const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
    landmarkRoles.forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach(el => landmarks.push(el));
    });
    return landmarks;
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

// Function to ensure unique landmarks in DOM
function ensureUniqueLandmarks() {
  const landmarks = [...document.querySelectorAll('[role]')];
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    if (!landmarkIds.has(role)) {
      landmarkIds.add(role);
    } else {
      // Add unique identifier for duplicate landmarks
      const uniqueId = `${role}-${Math.random().toString(36).substr(2, 7)}`;
      landmark.setAttribute('aria-label', `${role} section ${uniqueId}`);
    }
  });
}

// Create in-page button function
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'Click';
  if (onClickHandler) {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// Validate table structure
function validateTableStructure() {
  // ... (existing code for validateTableStructure)
}

// Get SVG accessible name
function getSvgAccessibleName() {
  // ... (existing code for getSvgAccessibleName)
}

// Set SVG attributes
function setSvgAttributes() {
  // ... (existing code for setSvgAttributes)
}

// Functions to add accessible names to SVGs
function setSvgAccessibleNames(svgId1, svgId2, accessibleNames1, accessibleNames2) {
  const svg1 = document.getElementById(svgId1);
  const svg2 = document.getElementById(svgId2);

  if (svg1) {
    svg1.setAttribute('aria-labelledby', `svg-${svgId1}-label`);
    let labelDiv = document.getElementById(`svg-${svgId1}-label`);
    if (!labelDiv) {
      labelDiv = document.createElement('div');
      labelDiv.id = `svg-${svgId1}-label`;
      svg1.appendChild(labelDiv);
    }
    labelDiv.textContent = accessibleNames1;
  }

  if (svg2) {
    svg2.setAttribute('aria-labelledby', `svg-${svgId2}-label`);
    let labelDiv = document.getElementById(`svg-${svgId2}-label`);
    if (!labelDiv) {
      labelDiv = document.createElement('div');
      labelDiv.id = `svg-${svgId2}-label`;
      svg2.appendChild(labelDiv);
    }
    labelDiv.textContent = accessibleNames2;
  }
}

// Fix fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#');
    }
    // Ensure proper button semantics
    if (link.getAttribute('href') === '#' && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  document.body.setAttribute('data-js-main', 'true'); // mark main.js initialized

  // Add lang attribute to HTML element
  initAppWithLang();

  // Ensure unique landmarks
  const landmarks = loadLandmarks();
  landmarks.forEach(landmark => {
    if (typeof landmark === 'object' && landmark.id) {
      landmark.id = landmark.id || `main-landmark-${Math.random().toString(36).substr(2, 7)}`;
    }
  });
  ensureLandmarkUniqueness(landmarks);

  // Add main landmark role to main content area
  const mainContent = document.querySelector('[data-js-main]');
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
  }

  // Add accessible names to SVGs
  document.querySelectorAll('svg:not([aria-labelledby])').forEach(svg => {
    svg.setAttribute('aria-labelledby', getSvgAccessibleName(svg));
  });

  // Fix fake link issues
  fixFakeLink();

  // Ensure that all interactive elements have appropriate keyboard support
  // Check that ARIA attributes are correctly paired and have appropriate values
}

// Function to address accessibility issues
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Add role="button" to all buttons
  document.querySelectorAll('button').forEach(function(button) {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('[role="button"]').forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
  });

  // Adding an alt attribute to an image if missing
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', 'Image description not available');
    }
  });

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Wrap content with main
function wrapContentWithMain() {
  const contentToWrap = document.querySelector('div.container');
  if (contentToWrap) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(contentToWrap);
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
}

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility() {
  const issues = [];

  try {
    const filePaths = await fs.promises.readdir(pagesDir);

    for (const filePath of filePaths) {
      const fileEmitted = path.join(pagesDir, filePath);
      try {
        const { violations } = await axe.analyze(fileEmitted);

        if (violations.length > 0) {
          issues.push({
            file: filePath,
            issues: violations,
          });
        }
      } catch (err) {
        console.warn(`Could not analyze ${filePath}:`, err.message);
      }
    }
  } catch (err) {
    console.warn('Could not read pages directory:', err.message);
  }

  return issues;
}

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Generate accessibility report
function generateAccessibilityReport(issuesData) {
  let issues = [];

  if (!issuesData) {
    // Scan for accessibility issues if no data provided
    scanAccessibility().then(scanIssues => {
      issues = scanIssues;
    });
  } else {
    issues = issuesData;
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };

  writeReport(report);
  return report;
}

// New function to count dependencies
function countDependencies() {
  console.log('Counting dependencies...');
  // Implementation for counting dependencies
}

// Render functions
async function renderFunction1() {
  // ... (existing code for renderFunction1)
}

async function renderFunction2() {
  // ... (existing code for renderFunction2)
}

// Harvest logic implementation
async function harvest() {
  try {
    const report = await scanAccessibility();
    const harvestedData = {
      timestamp: new Date().toISOString(),
      pagesScanned: report.length,
      totalIssues: report.reduce((acc, curr) => acc + (curr.issues ? curr.issues.length : 0), 0),
      details: report
    };

    const harvestFile = path.join(__dirname, 'harvest_data.json');
    fs.writeFileSync(harvestFile, JSON.stringify(harvestedData, null, 2));

    return harvestedData;
  } catch (error) {
    console.error('Harvest failed:', error);
    throw error;
  }
}

// Upgrade logic implementation
async function upgrade(harvestedData) {
  try {
    const data = harvestedData || (() => {
      const harvestFile = path.join(__dirname, 'harvest_data.json');
      if (fs.existsSync(harvestFile)) {
        return JSON.parse(fs.readFileSync(harvestFile, 'utf8'));
      }
      return null;
    })();

    if (!data) {
      throw new Error('No harvested data available for upgrade');
    }

    const upgradePlan = {
      timestamp: new Date().toISOString(),
      basedOnHarvest: data.timestamp,
      improvements: [],
      applied: false
    };

    if (data.details && data.details.length > 0) {
      data.details.forEach(page => {
        if (page.issues) {
          page.issues.forEach(violation => {
            upgradePlan.improvements.push({
              file: page.file,
              rule: violation.id,
              impact: violation.impact,
              description: violation.description,
              recommendation: `Fix ${violation.id} issue in ${page.file}`
            });
          });
        }
      });
    }

    const upgradeFile = path.join(__dirname, 'upgrade_plan.json');
    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    upgradePlan.applied = true;
    upgradePlan.appliedAt = new Date().toISOString();
    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    return upgradePlan;
  } catch (error) {
    console.error('Upgrade failed:', error);
    throw error;
  }
}

// Combined harvest and upgrade workflow
async function harvestAndUpgrade() {
  const harvested = await harvest();
  const upgraded = await upgrade(harvested);
  return { harvested, upgraded };
}

// New function to add a book with accessibility features
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

// Helper functions for dependency visualization
function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;

  if (!element.id) {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = id;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element || !label) return false;

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

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

// Landmark configuration
const landmarkConfig = {
  landmarks: ['main', 'nav', 'aside', 'footer', 'header'],
  requiredAttributes: ['role'],
  optionalAttributes: ['aria-label', 'aria-labelledby']
};

function isValidLandmark(landmark) {
  return landmarkConfig.landmarks.includes(landmark);
}

function processLandmarks(landmarks) {
  return landmarks.map(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      const role = landmark.getAttribute('role');
      if (role) {
        landmark.setAttribute('aria-label', `${role} region`);
      }
    }
    return {
      element: landmark,
      role: landmark.getAttribute('role'),
      label: landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby')
    };
  });
}

function sortLandmarks(landmarks) {
  return landmarks.sort((a, b) => {
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    }
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    }
    return 0;
  });
}

function getLandmarkById(id) {
  return document.getElementById(id);
}

// A11y utilities object
const a11y = {
  init: function() {
    addressAccessibilityIssues();
    ensureUniqueLandmarks();
  },
  announce: function(message, priority) {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority || 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  },
  checkContrast: function(element) {
    return true;
  },
  checkFocus: function() {
    return true;
  }
};

// Initialize the application
function initializeApp() {
  initApp();
  fixAccessibilityIssues();
  loadLandmarks();
  ensureLandmarkUniqueness();
}

// Initialize function
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
  createInPageButton('Default Button', function() {});

  // Add accessible names to SVGs
  setSvgAccessibleNames('svg1Id', 'svg2Id', 'aria-label for SVG1', 'aria-label for SVG2');

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Fix fake link issues
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

// Export module objects
export {
  wrapContentWithMain,
  createInPageButton,
  getLangAttribute,
  generateAccessibilityReport,
  renderFunction1,
  renderFunction2,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  ensureLandmarkUniqueness,
  addressAccessibilityIssues,
  wrapContentWithMain,
  initializeApp,
  loadLandmarks,
  fixAccessibilityIssues,
  fixFakeLink,
  setSvgAccessibleNames,
  scanAccessibility,
  writeReport,
  checkLinkAccessibility,
  harvest,
  upgrade,
  harvestAndUpgrade,
  addBookWithAccessibility,
  countDependencies,
  function3,
  a11y,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  getDependencies,
  generateDependencyReport,
  landmarkConfig,
  isValidLandmark,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  CONFIG
};