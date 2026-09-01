const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000
};

// Application state
let isInitialized = false;
const appData = {};
const appState = {
  initialized: false,
  data: null,
  cache: {},
  lang: 'en'
};

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
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

// Initialize function
function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

// Initialize app function
function initializeApp() {
  initialize();
  return appState;
}

// Fetch user function
async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Helper function
function someFunction() {
  return 'some value';
}

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Application main entry point
const app = express();

// Helper functions moved to a separate file (preserved references)
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  validateLandmark
} = require('./accessibility-improvements');

// Helper function to validate landmark structure
function getLangAttribute() {
  return document.documentElement.getAttribute('lang');
}

// Helper function to load landmarks
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

// Helper function to process landmarks
function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(validateInput);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// New functions to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Helper functions from the safe version
function ensureUniqueLandmarksLocal(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }
    return element;
}

// TODO: Address accessibility issues from insight report:

// New code or changes requested in the issue

/**
 * Ensures an element has an ID attribute
 * @param {HTMLElement} element - The element to check
 * @param {string} id - The ID to set if missing
 * @returns {HTMLElement} The element with ensured ID
 */
function ensureElementHasId(element, id) {
    if (!element.id) {
        element.id = id;
    }
    return element;
}

/**
 * Adds an aria-label to an element if it doesn't have one
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label to add
 * @returns {HTMLElement} The element with aria-label
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
    return element;
}

// New function to analyze module dependencies
function analyzeModuleDependenciesLocal(modules) {
  // Implementation would analyze and return dependency relationships
  console.log('Analyzing dependencies for modules:', modules);
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

// New function to visualize module relationships
function visualizeModuleRelationshipsLocal(modules) {
  // Implementation would create a visual representation of module relationships
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

// Helper functions from the unsafe version
function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

// New functions added at line 237 as requested in the issue
/**
 * Creates a new accessibility report with the current state of the application.
 * @returns {Object} The accessibility report containing findings and recommendations.
 */
function createAccessibilityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    findings: processAccessibilityReport(),
    recommendations: []
  };

  // Add recommendations based on findings
  if (!report.findings.langAttribute) {
    report.recommendations.push('Add lang attribute to HTML element');
  }

  if (report.findings.tableIssues > 0) {
    report.recommendations.push(`Fix ${report.findings.tableIssues} table structure issues`);
  }

  if (report.findings.landmarkIssues > 0) {
    report.recommendations.push(`Fix ${report.findings.landmarkIssues} landmark issues`);
  }

  if (report.findings.svgIssues > 0) {
    report.recommendations.push(`Add accessible names to ${report.findings.svgIssues} SVGs`);
  }

  if (report.findings.uniqueLandmarkIssues > 0) {
    report.recommendations.push(`Ensure ${report.findings.uniqueLandmarkIssues} landmarks are unique`);
  }

  if (report.findings.fakeLinkIssues > 0) {
    report.recommendations.push(`Fix ${report.findings.fakeLinkIssues} fake link issues`);
  }

  return report;
}

/**
 * Applies all accessibility fixes to the document.
 */
function applyAllAccessibilityFixes() {
  // Apply all accessibility fixes
  setLanguageAttribute();
  addLandmarkRoles();
  ensureUniqueLandmarks(landmarks);
  fixTableStructure();
  fixFakeLinks();

  // Add proper landmark regions
  addProperLandmarkRegions();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    setSvgAttributes(svg, name);
  });
}

/**
 * Gets the current accessibility score based on the report.
 * @returns {number} The accessibility score between 0 and 100.
 */
function getAccessibilityScore() {
  const report = createAccessibilityReport();
  const totalIssues = report.findings.tableIssues +
                     report.findings.landmarkIssues +
                     report.findings.svgIssues +
                     report.findings.uniqueLandmarkIssues +
                     report.findings.fakeLinkIssues;

  // Simple scoring: 100 points minus 10 points per issue
  const score = Math.max(0, 100 - (totalIssues * 10));
  return score;
}

/**
 * Logs the current accessibility status to the console.
 */
function logAccessibilityStatus() {
  const score = getAccessibilityScore();
  const report = createAccessibilityReport();

  console.log(`Accessibility Score: ${score}/100`);
  console.log('Recommendations:');
  report.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
}

module.exports = {
  initializeApp,
  fetchUser,
  clearCache,
  someFunction,
  loadLandmarks,
  processLandmarks,
  createInPageButton,
  extractSvgAccessibleName,
  addressAccessibilityIssues,
  importAndExecute,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  ensureElementHasId,
  addAriaLabel,
  CONFIG: {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
  },
  helper: function(input) {
    return input ? input.toUpperCase() : '';
  },
  formatDate: function(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toISOString().split('T')[0];
  },
  // Accessibility Functions
  addProperLandmarkRegions,
  // New functions added at line 237
  createAccessibilityReport,
  applyAllAccessibilityFixes,
  getAccessibilityScore,
  logAccessibilityStatus
};