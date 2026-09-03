// Accessibility Functions for Screeps

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

/**
 * Gets the dependency graph
 * @returns {Object} The dependency graph or a message
 */
function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraph;
}

/**
 * Helper function for accessibility tasks
 * @param {...*} args - Variable arguments
 * @returns {Array} Array of arguments
 */
const accessiblyHelper = async (...args) => {
  return args;
};

/**
 * Gets user safety advice
 * @returns {string} A random safety category
 */
function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

/**
 * Generates an accessibility report
 * @param {Object} issuesData - Optional issues data
 * @returns {Object} Accessibility report
 */
function generateAccessibilityReport(issuesData) {
  let issues;

  if (!issuesData) {
    // Check for images without alt attributes
    const images = document.querySelectorAll ? document.querySelectorAll('img') : [];
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        issues.push({
          type: 'missing-alt',
          element: 'img',
          index: index,
          message: `Image at index ${index} is missing an alt attribute`
        });
      }
    });

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll ? document.querySelectorAll('button') : [];
    buttons.forEach((btn, index) => {
      const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || '';
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'button',
          index: index,
          message: `Button at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for links without accessible names
    const links = document.querySelectorAll ? document.querySelectorAll('a') : [];
    links.forEach((link, index) => {
      const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || '';
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'a',
          index: index,
          message: `Link at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll ? document.querySelectorAll('input') : [];
    inputs.forEach((input, index) => {
      const inputType = input.getAttribute('type');
      if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
        const labelId = input.getAttribute('aria-labelledby');
        const labelText = input.getAttribute('aria-label');
        const hasLabel = labelId || labelText;
        if (!hasLabel) {
          issues.push({
            type: 'missing-label',
            element: 'input',
            index: index,
            message: `Input at index ${index} is missing an associated label`
          });
        }
      }
    });

    // Check for empty headings
    const headings = document.querySelectorAll ? document.querySelectorAll('h1, h2, h3, h4, h5, h6') : [];
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        issues.push({
          type: 'empty-heading',
          element: heading.tagName.toLowerCase(),
          index: index,
          message: `Heading at index ${index} has no text content`
        });
      }
    });
  } else {
    // If data is provided, use the analysis logic
    issues = issuesData;
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };

  return report;
}

/**
 * Gets the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Creates an accessible in-page navigation button
 * @param {string} targetId - The ID of the target element
 * @param {string} label - The accessible label for the button
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(targetId, label) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label);
  button.textContent = label;
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  const hasScope = Array.from(headers).every(th => th.hasAttribute('scope'));
  
  return hasHeaders && hasScope;
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table element is missing');
    return { valid: false, issues };
  }
  
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  
  if (!tbody) issues.push('Missing tbody element');
  if (!thead) issues.push('Missing thead element');
  
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${index} has no cells`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmarks on the page
 * @returns {Array} Array of landmark validation issues
 */
function validateLandmark() {
  const issues = [];
  const landmarks = getLandmarks();
  
  const banner = document.querySelector('[role="banner"]');
  const main = document.querySelector('main, [role="main"]');
  const footer = document.querySelector('[role="contentinfo"]');
  
  if (!banner) issues.push('Missing banner landmark');
  if (!main) issues.push('Missing main landmark');
  if (!footer) issues.push('Missing footer landmark');
  
  return issues;
}

/**
 * Gets all landmarks on the page
 * @returns {Array} Array of landmark elements
 */
function getLandmarks() {
  const landmarkSelectors = [
    'header:not([role])',
    '[role="banner"]',
    'nav',
    '[role="navigation"]',
    'main',
    '[role="main"]',
    'aside',
    '[role="complementary"]',
    'footer:not([role])',
    '[role="contentinfo"]'
  ];
  
  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });
  
  return landmarks;
}

/**
 * Processes landmarks for accessibility
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Array} Processed landmark data
 */
function processLandmarks(landmarks) {
  return landmarks.map(landmark => ({
    element: landmark,
    tagName: landmark.tagName.toLowerCase(),
    role: landmark.getAttribute('role') || null,
    label: landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || null,
    id: landmark.id || null
  }));
}

/**
 * Sorts landmarks by their position in the DOM
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Array} Sorted landmarks
 */
function sortLandmarks(landmarks) {
  return landmarks.sort((a, b) => {
    const positionA = a.element.getBoundingClientRect();
    const positionB = b.element.getBoundingClientRect();
    return positionA.top - positionB.top;
  });
}

/**
 * Gets a landmark by its ID
 * @param {string} id - The landmark ID
 * @returns {HTMLElement|null} The landmark element
 */
function getLandmarkById(id) {
  const element = document.getElementById(id);
  if (!element) return null;
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  
  const isLandmark = landmarkRoles.includes(role) ||
    ['header', 'nav', 'main', 'aside', 'footer'].includes(tagName);
  
  return isLandmark ? element : null;
}

/**
 * Gets accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    return titleElement ? titleElement.textContent : '';
  }
  
  return '';
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  if (!svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  }
  
  svg.setAttribute('role', 'img');
  if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

/**
 * Ensures all landmarks have unique identifiers
 * @returns {Array} Array of issues found
 */
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarks = getLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);
  
  const ids = new Set();
  
  sorted.forEach(landmark => {
    if (landmark.id) {
      if (ids.has(landmark.id)) {
        issues.push(`Duplicate landmark ID: ${landmark.id}`);
      } else {
        ids.add(landmark.id);
      }
    }
  });

  return issues;
}

/**
 * Handles fake links (elements that look like links but aren't)
 * @returns {Array} Array of fake links found
 */
function handleFakeLinks() {
  const fakeLinks = [];
  const clickableElements = document.querySelectorAll('[onclick], [role="button"]');
  
  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    if (tagName !== 'a' && tagName !== 'button') {
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', 'button');
      }
      if (!element.textContent && !element.getAttribute('aria-label')) {
        fakeLinks.push({
          element,
          issue: 'Fake link has no accessible name'
        });
      }
    }
  });
  
  return fakeLinks;
}

/**
 * Function to get the language attribute for HTML element (duplicate removed)
 */

/**
 * Full accessibility report generation (merged with generateAccessibilityReport above)
 */

async function renderFunction1() {
  // Existing functionality
  const moduleAReturnValue = await accessiblyHelper();

  // Ensure the dependencyGraph container has a proper ARIA role
  function ensureDependencyGraphRole(container) {
    if (!container) return;
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'img');
    }
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency graph');
    }
  }

  // Application data structure
  const appData = {
    title: 'Screeps',
    version: '1.0.0'
  };

  return { moduleAReturnValue, appData };
}

async function renderFunction2() {
  // Existing functionality
  const moduleBReturnValue = await accessiblyHelper();
  return { moduleBReturnValue };
}

function function3() {
  const dependencyGraph = document.getElementById('dependency-graph') || document.querySelector('.dependency-graph');

  if (dependencyGraph) {
    // Ensure the dependencyGraph container has a proper ARIA role
    dependencyGraph.setAttribute('role', 'region');

    // Add new property to set the aria-label
    // This property will be used by the test
    dependencyGraph.setAttribute('data-test-id', 'dependency-graph');

  }
}

async function function4() {
  // Implement new function
  //...
}

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: 5000
};

const config = CONFIG;

// Application state
let isInitialized = false;
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en' // Added lang property
};

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Landmark validation from HEAD
function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

function validateLandmark(landmark) {
  if (!landmark) return false;
  if (landmark.id == null || landmark.id === '') return false;
  return true;
}

function validateLandmarkStructure(landmark) {
  if (!landmark) return false;
  // Check for required properties
  const hasId = landmark.id != null && typeof landmark.id === 'string';
  const hasName = landmark.name != null && typeof landmark.name === 'string';
  const hasDescription = landmark.description != null && typeof landmark.description === 'string';
  return hasId && hasName && hasDescription;
}

function addFixLandmarkIssues(landmarks) {
  // Find duplicate IDs and mark them for removal or fix
  const seenIds = new Set();
  const fixedLandmarks = [];
  const duplicates = [];

  for (const landmark of landmarks) {
    if (seenIds.has(landmark.id)) {
      duplicates.push(landmark);
    } else {
      seenIds.add(landmark.id);
      fixedLandmarks.push(landmark);
    }
  }

  return { fixedLandmarks, duplicates };
}

function clearCache() {
  appState.cache.clear();
}

function someFunction() {
  return 'some value';
}

function newFunction1() {
  // New function added as per issue
  return "Hello";
}

function newFunction2() {
  // Another new function added as per issue
  return "World";
}

// TODO: Add new functions below this line

module.exports = {
  getDependencyGraph,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  getLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  handleFakeLinks,
  accessiblyHelper,
  getUserSafetyAdvice,
  generateAccessibilityReport,
  renderFunction1,
  renderFunction2,
  function3,
  function4,
  CONFIG,
  config,
  appState,
  helper,
  formatDate,
  validateInput,
  processData,
  isValidLandmark,
  loadLandmarks,
  validateLandmarkStructure,
  addFixLandmarkIssues,
  clearCache,
  someFunction,
  newFunction1,
  newFunction2
};