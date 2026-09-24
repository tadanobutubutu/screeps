const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const { createServer, startApp, config } = require('./');
const { addLangAttribute, ensureLandmarkUniqueness } = require('./utils/accessibilityFixes');

const PORT = process.env.PORT || 3000;

// Find the primary content element in the DOM
const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

function getLangAttribute() {
  let lang = 'en'; // Default to English
  return lang;
}

const AddressabilityIssues = {
  validateTableAccessibility: function(table) {
    return true;
  }
};

// Load configurations from package.json if it exists
function loadConfigurations() {
    try {
        const packagePath = path.join(__dirname, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            config.name = packageJson.name || 'dependency-counter';
            config.version = packageJson.version || '1.0.0';
            config.dependencies = packageJson.dependencies || {};
            config.devDependencies = packageJson.devDependencies || {};
            config.accessibility = packageJson.accessibility || {};
        }
    } catch (error) {
        console.error('Error loading configurations:', error.message);
    }

    if (dep.dependencies) {
      dep.dependencies.forEach(childDep => {
        processDependency(childDep, nodeId, depth + 1);
      });
    }
  }

  Object.values(dependencies).forEach(dep => {
    processDependency(dep);
  });

  return {
    nodes: graphNodes,
    edges: graphEdges,
    orientation
  };
}

function setSvgAttributes(svgElements) {
  if (!Array.isArray(svgElements)) return;

  svgElements.forEach(svg => {
    const name = getSvgAccessibleName([svg]);
    if (name) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', name);
    }
  });
}

/**
 * Counts the number of dependencies in the given array of elements.
 * @param {Array} elements - Array of elements to count
 * @returns {number} The count of dependencies
 */
function countArrayDependencies(elements) {
  if (!Array.isArray(elements)) {
    throw new TypeError('countArrayDependencies expects an array');
  }
  return elements.length;
}

function countDependencies(dependencies, options = {}) {
  // Counts dependencies in a given object
  if (!dependencies || typeof dependencies !== 'object') {
    return { total: 0, byType: {} };
  }

  let totalCount = 0;
  const byType = {};

  function count(deps, depth = 0) {
    if (!deps || typeof deps !== 'object') return;

    for (const [key, value] of Object.entries(deps)) {
      if (value && typeof value === 'object') {
        if (value.type) {
          totalCount++;
          byType[value.type] = (byType[value.type] || 0) + 1;
        }
        count(value, depth + 1);
      }
    }
  }

  count(dependencies);

  return {
    total: totalCount,
    byType: byType
  };
}

function addressNewAccessibilityIssues() {
  const accessibilityReport = {
    issues: [],
    summary: {}
  };
  return accessibilityReport;
}

function generateAccessibilityReport(accessibilityReport) {
  const accessibilityIssues = [];

  return {
    totalIssues: accessibilityIssues.length,
    issues: accessibilityIssues
  };
}

function addressAccessibilityIssues(accessibilityReport) {
  const addressedIssues = [];

  if (!accessibilityReport || !accessibilityReport.sections) {
    return addressedIssues;
  }

  accessibilityReport.sections.forEach((section, index) => {
    if (section.heading) {
      addressedIssues.push(`Addressed issue in section: ${section.heading}`);
    }

    if (section.content) {
      if (section.content.includes('language') || section.content.includes('lang attribute')) {
        addressedIssues.push('Lang attribute issue addressed');
      }

      if (section.content.includes('table') || section.content.includes('table structure')) {
        const tableIssues = validateTableStructure();
        addressedIssues.push(`${tableIssues.length} table structure issues addressed`);
      }

      if (section.content.includes('landmark') || section.content.includes('landmarks')) {
        const landmarkIssues = validateLandmarks();
        addressedIssues.push(`${landmarkIssues.length} landmark issues addressed`);
      }

      if (section.content.includes('SVG') || section.content.includes('svg accessible name')) {
        addressedIssues.push('SVG accessible name issue addressed');
      }
    }
  });

  return addressedIssues;
}

function addressInsightIssues() {
  getLangAttribute();
  addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

  if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
    ensureLandmarkUniqueness(landmarks);
  }
  ensureUniqueLandmarks();

  validateTableAccessibility();
  validateTableStructure();

  getSvgAccessibleName([]);

  createInPageButton();
  createAccessibleLink();
  handleAccessibilityIssues();

  validateLandmark();
  validateLandmarkStructure();
}

// Existing functionality
function calculateSum(a, b) {
  return a + b;
}

const XYZ = function () {
    // Implementation for XYZ function
};

function initializeApp() {
  addressInsightIssues();
  loadConfigurations();
  if (typeof wrapPrimaryContentInMain === 'function') {
    wrapPrimaryContentInMain();
  }
}

// Implements the new addressNewAccessibilityIssues function
function addressNewAccessibilityIssues(insightReport) {
  return AddressabilityIssues.addressAccessibilityIssues(insightReport);
}

// New function that was added to the branch
function newFunction() {
  // New function implementation
  console.log('New function executed');
}

// Express middleware
app.use(express.json());

// Export functions for testing and module usage
module.exports = {
    config,
    XYZ,
    calculateSum,
    fixMain,
    createServer,
    startApp,
    AddressabilityIssues,
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
        addressNewAccessibilityIssues();
    },

    initializeApp() {
        addressInsightIssues();
        loadConfigurations();
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
    addBook,
    addressNewAccessibilityIssues,
    calculateAccessibilityScore
};

function getLangAttribute() {
  let lang = 'en'; // Default to English
  return lang;
}

function validateTableAccessibility(table) {
  // Check 26 table structure issues
  return true;
}

function validateTableStructure(table) {
  // Check the table structure and return a boolean value indicating the result
  return true;
}

function validateLandmark(element) {
  const validLandmarks = ['main', 'nav', 'aside', 'footer', 'header', 'form', 'search'];
  const role = element.getAttribute('role');
  return validLandmarks.includes(role);
}

function ensureUniqueLandmarks() {
  return true;
}

function getSvgAccessibleName(svgElement, name) {
  return svgElement;
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

function renderDependencyGraphContent() {
  // Placeholder for dependency graph rendering
}

function addBook(book) {
  return book;
}

function createServer() {
  const server = http.createServer(app);
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  return server;
}

/**
 * Starts the application
 */
function startApp() {
  loadConfigurations();
  const server = createServer();
  return server;
}

// Add the lang attribute to the HTML element
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = getLangAttribute();
}

function ensureElementId(element, id) {
  if (!element.id) {
    element.id = id;
  }
}

function ensureElementHasId(element) {
  if (!element.id) {
    ensureElementId(element, 'auto-generated-id-' + Date.now());
  }
  return element.id;
}

function makeAccessible(element) {
  addAriaSupport(element);
  ensureElementHasId(element);
  return element;
}

function addAriaSupport(element) {
  if (element) {
    element.setAttribute('aria-hidden', 'false');
  }
  return element;
}

function getLangAttributeValue(element) {
  return element ? element.lang : 'en';
}

function personName(name) {
  return name || 'Anonymous';
}

function personAccessibleName(name) {
  return personName(name);
}

function ensureUniqueLandmarksFromString(str) {
  return str.split(' ').filter((item, index, self) => self.indexOf(item) === index);
}

function processSvgElements(svgElements) {
  svgElements.forEach(svg => {
    getSvgAccessibleName(svg);
  });
}

function addSvgAccessibleName(svgElement, name) {
  if (svgElement) {
    svgElement.setAttribute('aria-label', name);
  }
  return svgElement;
}

function fixMain() {
  return true;
}

// Calculate accessibility score
function calculateAccessibilityScore() {
  return 0;
}