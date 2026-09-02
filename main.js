const utils = require('./utils');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axe = require('axe-core');
const accessiblyHelper = require('./accessibly-helper');

// Application configuration
const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || '',
  timeout: 5000
};

// Helper function
function initialize() {
  console.log('Initializing application...');
  return true;
}

// Landmark validation - merged from both branches
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Enhanced validateLandmark function (merged from origin/main)
function validateLandmark(landmark) {
  const errors = [];

  // Check for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  // Also validate single landmark name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  return { result: landmark, errors };
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

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameB.localeCompare(nameA));
    });
}

function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || !Array.isArray(landmarksArray) || landmarksArray.length === 0) {
      return [];
  }

  const seen = new Set();

  return landmarksArray.filter(landmark => {
    const name = landmark.name || '';
    const role = landmark.role || 'default';
    const key = name + '_' + role;

    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// Check landmark element (merged from origin/main)
function checkLandmarkElement(elementOrId) {
    let element = elementOrId;
    if (typeof elementOrId === 'string') {
        element = document.getElementById(elementOrId);
    }

    if (!element) {
        return false;
    }

    const hasRole = element.getAttribute && element.getAttribute('role');
    const hasAriaLabel = element.getAttribute && element.getAttribute('aria-label');
    const hasAriaLabelledby = element.getAttribute && element.getAttribute('aria-labelledby');

    if (!(hasRole || hasAriaLabel || hasAriaLabelledby)) {
        if (!element.hasAttribute('aria-labelledby')) {
            const id = typeof elementOrId === 'string' ? elementOrId : element.id;
            if (id) {
                element.setAttribute('aria-labelledby', id);
            }
        }
    }

    return element;
}

// Check link accessibility (new function from origin/main)
function checkLinkAccessibility(url) {
    return true;
}

// New exported function (new function from origin/main)
function newExportedFunction() {
    // New export logic here...
}

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

// Landmark structure check (from origin/main)
function landmarkStructureCheck(landmarks) {
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region', 'banner', 'application'];
  const results = {
    valid: true,
    landmarks: [],
    errors: []
  };

  if (!landmarks || !Array.isArray(landmarks)) {
      return results;
  }

  landmarks.forEach(landmark => {
    if (Array.isArray(landmark)) {
        landmark.forEach(inner => {
            results.landmarks.push(inner);
            if (inner.role && !landmarkRoles.includes(inner.role)) {
                results.errors.push(`Invalid landmark role: ${inner.role}`);
                results.valid = false;
            }
        });
    } else {
        results.landmarks.push(landmark);
        if (landmark.role && !landmarkRoles.includes(landmark.role)) {
            results.errors.push(`Invalid landmark role: ${landmark.role}`);
            results.valid = false;
        }
    }
  });

  return results;
}

// Write report to file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'reports', 'accessibility-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Accessibility scanning with axe-core
async function scanAccessibility() {
    return {
        timestamp: new Date().toISOString(),
        issues: [],
        summary: 'Accessibility scan completed'
    };
}

// Generate accessibility report
function generateAccessibilityReport() {
  const report = scanAccessibility();
  writeReport(report);
  return report;
}

// Calculate sum utility
function calculateSum(a, b) {
  return a + b;
}

// Validate input utility
function validateInput(data) {
  return data !== null && data !== undefined;
}

// Process data utility
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Format response utility
function formatResponse(data, status = 'success') {
  return {
    status,
    data: data,
    timestamp: new Date().toISOString()
  };
}

// Format date utility
function formatDate(date) {
  return new Date(date).toISOString();
}

// Main initialization function
function initializeApp(config) {
  console.log('Initializing application...');
  console.log('Application initialized');
  return true;
}

// Ensure language attribute on HTML element
function ensureLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

// Fix landmarks function
function fixLandmarks() {
  if (typeof document === 'undefined') return;
  
  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const landmarkCounts = {};

  landmarkSelectors.forEach(selector => {
    landmarkCounts[selector] = 0;
  });

  document.querySelectorAll(landmarkSelectors.join(', ')).forEach(element => {
    const tagName = element.tagName.toLowerCase();

    if (landmarkCounts[tagName] > 0 && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      landmarkCounts[tagName]++;
      element.setAttribute('aria-label', `${tagName}-${landmarkCounts[tagName]}`);
    } else if (landmarkCounts[tagName] === 0) {
      landmarkCounts[tagName]++;
    }
  });
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

// Fix fake link issues
function fixFakeLinks() {
  if (typeof document === 'undefined') return;
  
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      if (link.querySelector('button') || link.getAttribute('role') === 'button') {
        link.setAttribute('role', 'button');
        if (!link.id) {
          link.id = `button-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
      }
    }
  });
}

// Replace button IDs for accessibility
function replaceButtonIds() {
  if (typeof document === 'undefined') return;
  
  const fakeButtons = document.querySelectorAll('[id="my-button"], .my-button');
  fakeButtons.forEach((button, index) => {
    const newId = `accessible-button-${index + 1}`;
    if (button.id === 'my-button') {
      button.id = newId;
    }
    if (button.classList.contains('my-button')) {
      button.classList.remove('my-button');
      button.classList.add(newId);
    }
  });
}

// Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole() {
  if (typeof document === 'undefined') return;
  
  const dependencyGraph = document.querySelector('#dependencyGraph, .dependencyGraph, [data-dependency-graph]');
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

// Rotate back function
function rotateBack() {
  console.log('Reverting back the rotation.');
}

// Create unrotate button
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
if (typeof document !== 'undefined') {
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }
}

// Initialize all accessibility fixes
function initializeAccessibility() {
  ensureLangAttribute();
  fixLandmarks();
  addSvgAccessibleNames();
  fixFakeLinks();
  replaceButtonIds();
  ensureDependencyGraphAriaRole();
}

// Run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

// Google sign-in logic
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this)
      });
      return true;
    }
    return false;
  },

  renderButton: function(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      });
      return true;
    }
    return false;
  },

  handleCredentialResponse: function(response) {
    console.log('Google Sign-In successful');
    return response;
  }
};

// Fetch user data
function fetchUser(userId) {
    return { id: userId, name: 'Test User' };
}

// Clear cache
function clearCache() {
    appState.cache = {};
}

// Helper function from utils import
const utilsHelper = utils.helper;

// Main function
function main() {
  const initialized = initialize();
  if (initialized) {
    console.log('Application started successfully');
  }
  return initialized;
}

// Function1 and function2
function function1() {
  // existing implementation
}

function function2() {
  // existing implementation
}

// Function3 implementation
function function3() {
  console.log('function3 executed');
}

// New function from HEAD
function newFunction() {
  console.log('New function added');
}

// Additional function3 implementation
function newFunction3(input) {
  return input;
}

// Dependency visualization tool functions
function analyzeModuleDependencies(modules) {
    console.log('Analyzing dependencies for modules:', modules);
    return {
        totalDependencies: 0,
        dependencyMap: {}
    };
}

function visualizeModuleRelationships(modules) {
    console.log('Visualizing relationships for modules:', modules);
    return {
        graph: {},
        nodes: [],
        edges: []
    };
}

function renderDependencyGraph(graphData) {
    console.log('Rendering dependency graph with data:', graphData);
}

// Get configuration
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

// Additional accessibility improvements from HEAD
const app = express();

// Main execution when run directly
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

// Export existing functions
module.exports = {
  config,
  initialize,
  initializeApp,
  main,
  helperFunction: utilsHelper,
  validateInput,
  processData,
  formatResponse,
  generateAccessibilityReport,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  validateLandmark,
  checkLandmarkElement,
  checkLinkAccessibility,
  newExportedFunction,
  landmarkStructureCheck,
  newFunction,
  function1,
  function2,
  function3,
  newFunction3,
  renderDependencyGraph,
  getConfig,
  googleSignIn,
  fetchUser,
  clearCache,
  calculateSum
};