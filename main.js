// main.js - Accessibility-focused implementation

const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');

const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// Existing functionality
function calculateSum(a, b) {
  return a + b;
}

const XYZ = function () {
    // Implementation for XYZ function
};

module.exports = {
    config,
    XYZ,
    calculateSum,

    addLangAttribute(element) {
        // Adds lang attribute to the given HTML element
        if (element && typeof element.setAttribute === 'function') {
            element.setAttribute('lang', 'en');
        }
        return element;
    },

    ensureLandmarkUniqueness: function (elements) {
        if (!Array.isArray(elements)) {
            return [];
        }

        const uniqueElements = [];
        const seen = new Map();

        elements.forEach(element => {
            const key = element.id || element.name || JSON.stringify(element);
            if (!seen.has(key)) {
                seen.set(key, true);
                uniqueElements.push(element);
            }
        });

        return uniqueElements;
    },

    addressInsightIssues() {
        getLangAttribute();
        addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

        if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
            ensureLandmarkUniqueness(landmarks);
        }
        ensureUniqueLandmarks();

        validateTableAccessibility();
        validateTableStructure();

        getSvgAccessibleName();

        createInPageButton();
        createAccessibleLink();
        handleAccessibilityIssues();

        validateLandmark();
        validateLandmarkStructure();
    },

    initializeApp() {
        addressInsightIssues();
        if (typeof wrapPrimaryContentInMain === 'function') {
            wrapPrimaryContentInMain();
        }
    },

    // Utility functions
    getLangAttribute,
    getLangAttributeValue,
    personName,
    personAccessibleName,
    ensureUniqueLandmarks,
    ensureUniqueLandmarksFromString,
    createInPageButton,
    makeAccessible,
    addAriaSupport,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    addSvgAccessibleName,
    processSvgElements,
    ensureElementHasId,
    ensureElementId,
    addAriaLabel,
    handleAccessibilityIssues,
    fixFakeLinkIssue,
    renderDependencyGraphContent,
    addBook
};

function getLangAttribute() {
  let lang = 'en'; // Default to English
  return lang;
}

// REACT_015: Get lang attribute value from HTML element
function getLangAttributeValue(element) {
  if (!element) {
    return 'en';
  }
  const lang = element.getAttribute ? element.getAttribute('lang') : null;
  return lang || element.lang || 'en';
}

// REACT_015: Get person's name for accessibility
function personName(person) {
  if (!person) {
    return '';
  }
  if (typeof person === 'string') {
    return person;
  }
  return person.name || person.fullName || person.displayName || '';
}

// REACT_015: Get accessible name for person element
function personAccessibleName(person, element) {
  const name = personName(person);
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('aria-label', name);
    element.setAttribute('aria-labelledby', name);
  }
  return name;
}

function validateTableAccessibility(table) {
  // Check 26 table structure issues
  if (!table) {
    return false;
  }
  
  const issues = [];
  
  // Check if table has proper structure
  if (!table.getAttribute('role') && !isSemanticTable(table)) {
    issues.push('table-missing-role');
  }
  
  // Check for th elements with scope attributes
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      issues.push(`th-missing-scope-${index}`);
    }
  });
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('table-missing-caption');
  }
  
  // Check for thead/tbody structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (!thead) {
    issues.push('table-missing-thead');
  }
  if (!tbody) {
    issues.push('table-missing-tbody');
  }
  
  return issues.length === 0;
}

function isSemanticTable(table) {
  const tagName = table.tagName ? table.tagName.toLowerCase() : '';
  return tagName === 'table';
}

function validateTableStructure(table) {
  // Check the table structure and return a boolean value indicating the result
  if (!table) {
    return false;
  }
  
  const rows = table.rows;
  if (!rows || rows.length === 0) {
    return false;
  }
  
  // Check for consistent column counts
  let firstRowColCount = null;
  let hasConsistentStructure = true;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cellCount = row.cells ? row.cells.length : 0;
    
    if (firstRowColCount === null) {
      firstRowColCount = cellCount;
    } else if (cellCount !== firstRowColCount) {
      hasConsistentStructure = false;
      break;
    }
  }
  
  return hasConsistentStructure;
}

// REACT_017: Validate landmark element
function validateLandmark(element) {
  const validLandmarks = ['main', 'nav', 'aside', 'footer', 'header', 'form', 'search'];
  const role = element.getAttribute('role');
  return validLandmarks.includes(role);
}

// REACT_017: Validate landmark structure for accessibility
function validateLandmarkStructure(landmarks) {
  if (!Array.isArray(landmarks)) {
    return { valid: false, issues: ['landmarks must be an array'] };
  }
  
  const issues = [];
  const seen = new Map();
  
  // Check for exactly one main landmark
  const mainLandmarks = landmarks.filter(l => 
    (l.tagName && l.tagName.toLowerCase() === 'main') || 
    l.getAttribute('role') === 'main'
  );
  if (mainLandmarks.length === 0) {
    issues.push('missing-main-landmark');
  } else if (mainLandmarks.length > 1) {
    issues.push('multiple-main-landmarks');
  }
  
  // Check for landmark uniqueness
  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute ? landmark.getAttribute('role') : '';
    const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
    const key = role || tagName;
    
    if (key && key !== 'main') {
      if (seen.has(key)) {
        issues.push(`duplicate-landmark-${key}`);
      } else {
        seen.set(key, index);
      }
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

function ensureUniqueLandmarks() {
  return true;
}

// REACT_017: Ensure unique landmarks from string array
function ensureUniqueLandmarksFromString(landmarkStrings) {
  if (!Array.isArray(landmarkStrings)) {
    return [];
  }
  
  const uniqueLandmarks = [];
  const seen = new Set();
  
  landmarkStrings.forEach(landmark => {
    const normalized = (landmark || '').toString().trim().toLowerCase();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      uniqueLandmarks.push(landmark);
    }
  });
  
  return uniqueLandmarks;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement, name) {
  if (!svgElement) {
    return null;
  }
  
  // Check for existing title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  // Return provided name or generate one
  if (name) {
    return name;
  }
  
  // Generate accessible name from aria-label or id
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const id = svgElement.getAttribute('id');
  if (id) {
    return id;
  }
  
  return null;
}

// REACT_041: Add accessible name to SVG element
function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || typeof svgElement.setAttribute !== 'function') {
    return svgElement;
  }
  
  // Add aria-label
  if (name) {
    svgElement.setAttribute('aria-label', name);
  }
  
  // Add title element if not present
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name || '';
  
  // Ensure SVG has an id
  if (!svgElement.id) {
    svgElement.id = `svg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Link title to SVG with aria-labelledby
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-labelledby', title.id || `svg-title-${svgElement.id}`);
  if (title.id) {
    title.id = `svg-title-${svgElement.id}`;
  }
  
  return svgElement;
}

// REACT_041: Process SVG elements for accessibility
function processSvgElements(svgElements) {
  if (!Array.isArray(svgElements)) {
    return [];
  }
  
  const processed = [];
  
  svgElements.forEach((svg, index) => {
    if (svg && typeof svg.setAttribute === 'function') {
      // Add accessible name if missing
      const currentName = getSvgAccessibleName(svg);
      if (!currentName) {
        const generatedName = `SVG ${index + 1}`;
        addSvgAccessibleName(svg, generatedName);
        processed.push({
          element: svg,
          name: generatedName,
          added: true
        });
      } else {
        processed.push({
          element: svg,
          name: currentName,
          added: false
        });
      }
    }
  });
  
  return processed;
}

function createInPageButton(text) {
  return {};
}

function createAccessibleLink(href, text) {
  return {};
}

function handleAccessibilityIssues() {
}

function addAriaLabel(element, label) {
  if (!element.ariaLabel) {
    element.ariaLabel = label;
  }
  return element;
}

// REACT_017: Add ARIA support to element
function addAriaSupport(element, options) {
  if (!element || typeof element.setAttribute !== 'function') {
    return element;
  }
  
  options = options || {};
  
  if (options.role) {
    element.setAttribute('role', options.role);
  }
  if (options.label) {
    element.setAttribute('aria-label', options.label);
  }
  if (options.labelledBy) {
    element.setAttribute('aria-labelledby', options.labelledBy);
  }
  if (options.describedBy) {
    element.setAttribute('aria-describedby', options.describedBy);
  }
  if (options.hidden !== undefined) {
    element.setAttribute('aria-hidden', options.hidden ? 'true' : 'false');
  }
  if (options.disabled !== undefined) {
    element.setAttribute('aria-disabled', options.disabled ? 'true' : 'false');
  }
  if (options.expanded !== undefined) {
    element.setAttribute('aria-expanded', options.expanded ? 'true' : 'false');
  }
  if (options.selected !== undefined) {
    element.setAttribute('aria-selected', options.selected ? 'true' : 'false');
  }
  if (options.haspopup !== undefined) {
    element.setAttribute('aria-haspopup', options.haspopup);
  }
  
  return element;
}

function checkElementAccessibility(element) {
  return true;
}

function setupHandlers() {
  console.log('Setting up event handlers...');
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
}

function countDependencies() {
  return {};
}

function createServer() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  return app;
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  return server;
}

// Add the lang attribute to the HTML element
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = getLangAttribute();
}

// REACT_041: Ensure element has an ID for accessibility references
function ensureElementHasId(element, prefix) {
  if (!element) {
    return null;
  }
  
  let id = element.id;
  
  if (!id) {
    prefix = prefix || 'element';
    id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (typeof element.setAttribute === 'function') {
      element.setAttribute('id', id);
    } else if (element.id !== undefined) {
      element.id = id;
    }
  }
  
  return id;
}

function ensureElementId(element, id) {
  if (!element) {
    return null;
  }
  
  if (typeof element.setAttribute === 'function') {
    if (!element.id) {
      element.setAttribute('id', id);
    }
    return element.id;
  }
  
  if (!element.id) {
    element.id = id;
  }
  return element.id;
}

const AddressabilityIssues = {
  validateTableAccessibility: function(table) {
    return true;
  }
};

function calculateAccessibilityScore(fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return 0;
  }

  const scorePoints = {
    'color-contrast': 5,
    'missing-alt-text': 3,
    'missing-aria-label': 5,
    'heading-order': 2,
    'other': 1
  };

  return fixedIssues.reduce((total, issue) => {
    const points = scorePoints[issue.type] || scorePoints.other;
    return total + points;
  }, 0);
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  if (typeof document === 'undefined') {
    return;
  }
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  if (typeof renderDependencyGraph === 'function') {
    renderDependencyGraph(container);
  }
  if (typeof renderIndexView === 'function') {
    renderIndexView(container);
  }
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue(doc) {
  if (typeof doc === 'undefined' || !doc.querySelectorAll) {
    return;
  }
  const clickableElements = doc.querySelectorAll('[role="link"]:not(a), [onclick]');
  let count = 0;

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.hasAttribute('href');

    if (tagName !== 'a' && !hasHref) {
      const isInteractive = element.getAttribute('role') === 'link' ||
                             (element.hasAttribute('onclick') && element.onclick && element.onclick.toString().includes('window.location'));

      if (isInteractive && !element.hasAttribute('aria-label')) {
        const text = element.textContent.trim();
        if (text) {
          element.setAttribute('aria-label', text);
        }
      }
      count++;
    }
  });

  return count;
}

// Utility function for making elements accessible
function makeAccessible(element, type) {
  if (!element) {
    return element;
  }
  
  switch (type) {
    case 'button':
      if (typeof element.setAttribute === 'function') {
        element.setAttribute('role', 'button');
      }
      break;
    case 'link':
      if (typeof element.setAttribute === 'function') {
        element.setAttribute('role', 'link');
      }
      break;
    case 'img':
      if (typeof element.setAttribute === 'function' && !element.hasAttribute('alt')) {
        element.setAttribute('alt', '');
      }
      break;
  }
  
  return element;
}

// Utility function for adding books
function addBook(book) {
  const books = [];
  if (book && typeof book === 'object') {
    books.push(book);
  }
  return books;
}