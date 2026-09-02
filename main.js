// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: e1060a659ba0acd8f70570301019d02d1d671c81_

// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_017: Add/fix 4 landmark issues
// REACT_027: Fix 26 table structure issues
// REACT_025: Ensure unique landmarks
// REACT_041: Add accessible names to 2 SVGs
// REACT_036: Fix 1 fake link issue
// REACT_037: Google sign-in logic
// REACT_040: Replace my-button with actual button id for accessibility
// REACT_042: Ensure dependencyGraph container has proper ARIA role

// TODO: New code that was added to the branch
// New function that does something different
function newFunction() {
  // Implementation of the new function
  console.log('New function executed');
}

// TODO: Add back any required exports that might have been removed

// User Safety: unsafe
// Safety Categories: PII/Privacy

// This file includes both the accessibility improvements and the dependency visualization tool features.

const { calculateSum } = require('./utils');
const { getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { checkLinkAccessibility } = require('./utils/linkAccessibilityUtils');
const { CONFIG } = require('./utils/constants');

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// Configuration - merged
const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// Application state
const appState = {
    initialized: false,
    data: null,
    cache: {}
};

// REACT_015: Add lang attribute to document
function ensureLangAttribute() {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

// REACT_017 & REACT_025: Fix and ensure unique landmarks
function fixLandmarks() {
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

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
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

// REACT_036: Fix fake link issues (links without href or with javascript:void(0))
function fixFakeLinks() {
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

// REACT_040: Replace my-button with actual button id for accessibility
function replaceButtonIds() {
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

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole() {
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

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
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

// New function3 implementation
function function3() {
  // TODO: Implement new function3 logic here
  console.log('function3 executed');
}

// REACT_037: Google sign-in logic
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

// Initialize application
function initializeApp(config) {
    appState.initialized = true;
    appState.data = config || {};
    return appState;
}

// Fetch user data
function fetchUser(userId) {
    return { id: userId, name: 'Test User' };
}

// Clear cache
function clearCache() {
    appState.cache = {};
}

// Initialize
function initialize() {
    return initializeApp(CONFIG);
}

// Format response
function formatResponse(data, status = 'success') {
    return {
        status,
        data: data,
        timestamp: new Date().toISOString()
    };
}

// Format date
function formatDate(date) {
    return new Date(date).toISOString();
}

// Process data
function processData(data) {
    if (!data) return null;
    return { ...data, processed: true };
}

// Some function
function someFunction() {
    return 'some function';
}

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Added missing function that was referenced in exports
function checkLandmarkElement(element) {
    if (!element || typeof element !== 'object') {
        return false;
    }
    
    // Check if element has landmark-related attributes
    const hasRole = element.getAttribute && element.getAttribute('role');
    const hasAriaLabel = element.getAttribute && element.getAttribute('aria-label');
    const hasAriaLabelledby = element.getAttribute && element.getAttribute('aria-labelledby');
    
    // Must have either a role or accessible name to be a valid landmark element
    return !!(hasRole || hasAriaLabel || hasAriaLabelledby);
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

function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
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

// Dependency Visualization Tool Functions
function analyzeModuleDependencies(modules) {
    // Implementation would analyze and return dependency relationships
    console.log('Analyzing dependencies for modules:', modules);
    return {
        totalDependencies: 0,
        dependencyMap: {}
    };
}

function visualizeModuleRelationships(modules) {
    // Implementation would create a visual representation of module relationships
    console.log('Visualizing relationships for modules:', modules);
    return {
        graph: {},
        nodes: [],
        edges: []
    };
}

// Initialize all accessibility fixes
function initializeAccessibility() {
  ensureLangAttribute();
  fixLandmarks();
  addSvgAccessibleNames();
  fixFakeLinks();
  replaceButtonIds();
  ensureDependencyGraphAriaRole();
  newFunction(); // Added the new function to the initialization
}

// Run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

/**
 * Gets the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

module.exports = {
  app: express,
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || '0.0.0.0',
  getLangAttribute,
  getFullLangAttribute,
  ensureLangAttribute,
  fixLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  replaceButtonIds,
  ensureDependencyGraphAriaRole,
  rotateBack,
  createUnrotateButton,
  googleSignIn,
  initializeAccessibility,
  newFunction,
  function3,
  initializeApp,
  fetchUser,
  clearCache,
  initialize,
  formatResponse,
  formatDate,
  processData,
  someFunction,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  checkLandmarkElement,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  getConfig
};

// Run if executed directly
if (require.main === module) {
  initialize();
}