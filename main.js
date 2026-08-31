const fs = require('fs');
const path = require('path');

// Import accessibility utilities
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility
} = require('./utils/accessibilityUtils');

const { CONFIG } = require('./utils/constants');

// Language utility functions
const { getLangAttribute: getLangAttr, setLanguageAttribute } = require('./lang-utility');

// Dependency visualization functions
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

// Accessibility fix function
function fixAccessibilityIssues() {
  // Fix table accessibility issues
  const tableResults = validateTableAccessibility();
  const tableStructureResults = validateTableStructure();
  
  // Fix landmark accessibility issues
  const landmarkResults = validateLandmark();
  const landmarkStructureResults = validateLandmarkStructure();
  
  // Fix link accessibility issues
  const linkResults = validateLinkAccessibility();
  handleFakeLinks();
  
  // Return summary of fixes applied
  return {
    tables: tableResults,
    tableStructure: tableStructureResults,
    landmarks: landmarkResults,
    landmarkStructure: landmarkStructureResults,
    links: linkResults
  };
}

// Landmark handling functions (from origin/main, more robust)
function loadLandmarks() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
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

  const validLandmarks = landmarks.filter(function(landmark) {
    return landmark && landmark.name;
  });
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return sortLandmarks(uniqueLandmarks).slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
  return landmarks.slice().sort(function(a, b) {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (ascending) {
      return nameA.localeCompare(nameB);
    }
    return nameB.localeCompare(nameA);
  });
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(function(landmark) { return landmark.id === id; }) || null;
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
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

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// Rotate back function
function rotateBack() {
  console.log('Reverting back the rotation.');
}

/**
 * Creates an unrotate button to replace fake links.
 * @returns {HTMLElement} The created button element
 */
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons (from origin/main, handles multiple)
function handleFakeLinksInDocument() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(function(fakeLink) {
    if (fakeLink && fakeLink.tagName === 'A') {
      const parent = fakeLink.parentElement;
      const newButton = createUnrotateButton();
      if (parent) {
        parent.replaceChild(newButton, fakeLink);
      }
    }
  });
}

/**
 * Renders the index view for the dependency visualization tool.
 * @returns {HTMLElement} The rendered index view container element
 */
function renderIndexView() {
  const container = document.createElement('div');
  container.id = 'index-view';
  container.className = 'index-view';
  container.setAttribute('role', 'main');
  container.setAttribute('aria-label', 'Dependency Visualization Tool Index');
  return container;
}

// Main application object for dependency visualization tool
const visualizationMain = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  renderIndexView: function() {
    return renderIndexView();
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    const results = fixAccessibilityIssues();
    const dependencies = getDependencies();
    return {
      accessibilityFixes: results,
      dependencies: dependencies
    };
  }
};

// Screeps bot main functions
let config = {};
let appState = {};

function initialize() {
  config = { apiUrl: process.env.API_URL || 'http://localhost:3000', timeout: 5000 };
  appState = { initialized: true };
}

function initializeApp() {
  initialize();
}

function fetchUser(userId) {
  return { id: userId, name: 'User' };
}

function clearCache() {
  appState = {};
}

// Main function (required export)
function main() {
  initialize();
  initializeApp();
  mainExecution();
  console.log('Main function executed');
  return { executed: true };
}

// Placeholder for main execution logic
function mainExecution() {
  // Screeps bot main loop would go here
}

// Landmark data structure
const landmarks = [];

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Application data structure
const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// Helper to get dependencies (placeholder)
function getDependencies() {
  return [];
}

// Export all required items
module.exports = {
  appData,
  config,
  appState,
  getLangAttribute: getLangAttr,
  setLanguageAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  visualizeDependencyTree,
  generateDependencyReport,
  fixAccessibilityIssues,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  createInPageButton,
  createUnrotateButton,
  handleFakeLinksInDocument,
  rotateBack,
  checkLandmarkElement,
  main,
  initialize,
  initializeApp,
  fetchUser,
  clearCache,
  visualizationMain,
  formatResponse: (data, status = 'success') => {
    return { status, data, timestamp: new Date().toISOString() };
  }
};

// Run if executed directly
if (require.main === module) {
  main();
}