const landmarkSelectors = [
  'main',
  '[role="main"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="search"]',
  'nav',
  '[role="region"]',
  'aside'
];

const books = [];
const safetyCategory = "User Safety: safe";

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000,
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

let config = CONFIG;

let isInitialized = false;
let appData_origin = {};
let appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let dependencyGraph = null;

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const headers = tableElement.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const rows = tableElement.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const utils = require('./utils');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  externalFixFakeLinks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues,
  scanAccessibility
} = utils;

const accessiblyHelper = async (...args) => {
  return args;
};

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000,
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

let config = CONFIG;

const bookObject = {};

const addBook(title, author) {
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

// Harvest data function
function harvestData() {
  // Add your own implementation here.
  // For example, you can fetch data from API or invest a real-time tracking logic.
  return 'Example data collected';
}

// Main function that applies all accessibility fixes and collects data
function applyAccessibilityFixesAndHarvestData(html) {
  let result = html;
  result = addLangAttribute(result);
  result = fixTableStructure(result);
  result = fixFakeLinks(result);
  // Add collected data to the html
  result += `<div id="collected-data">${harvestData()}</div>`;
  return result;
}

// Initialize function
function initialize() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const validLandmarks = processLandmarks(landmarks);

  const processed = processLandmarks(validLandmarks); // Keep both processLandmarks calls for consistency

  // Ensure the dependencyGraph container has a proper ARIA role
  let dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }

    if (!dependencyGraph.hasAttribute('role')) {
      const allowedRoles = config.allowedRoles || CONFIG.allowedRoles || ['region'];
      if (allowedRoles.includes('region')) {
        dependencyGraph.setAttribute('role', 'region');
      } else {
        dependencyGraph.setAttribute('role', 'region');
      }
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  return true;
}

let additionalFunctions = {
  ensureUniqueLandmarksDOM() {
    // ... (existing function implementation)
  },

  extractSvgAccessibleName(svgContent) {
    // ... (existing function implementation)
  },

  getLangAttribute() {
    if (navigator.languages && navigator.languages[0]) {
      return navigator.languages[0];
    } else if (navigator.language) {
      return navigator.language;
    } else if (navigator.userLanguage) {
      return navigator.userLanguage;
    }

    return 'en';
  },

  validateTableAccessibility(tableElement) {
    // Updated for merging both changes
    if (!tableElement) return false;
    const headers = tableElement.querySelectorAll('th');
    return headers.length > 0;
  },

  validateTableStructure(tableElement) {
    // Updated for merging both changes
    if (!tableElement) return false;
    const rows = tableElement.querySelectorAll('tr');
    return rows.length > 0;
  },

  validateLandmark() {
    const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
    return landmarks.length > 0;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
    return landmarks.length > 0;
  },

  validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    let validLinks = 0;
    links.forEach(link => {
      if (link.textContent.trim() || link.getAttribute('aria-label')) {
        validLinks++;
      }
    });
    return validLinks === links.length;
  },
};

let dependencyGraph = null;

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const headers = tableElement.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const rows = tableElement.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let validLinks = 0;
  links.forEach(link => {
    if (link.textContent.trim() || link.getAttribute('aria-label')) {
      validLinks++;
    }
  });
  return validLinks === links.length;
}

let dependencyGraph = null;

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const headers = tableElement.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const rows = tableElement.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const utils = require('./utils');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  externalFixFakeLinks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues,
  scanAccessibility
} = utils;

const accessiblyHelper = async (...args) => {
  return args;
};

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000,
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

let config = CONFIG;

const bookObject = {};

const addBook(title, author) {
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

// Harvest data function
function harvestData() {
  // Add your own implementation here.
  // For example, you can fetch data from API or invest a real-time tracking logic.
  return 'Example data collected';
}

// Main function that applies all accessibility fixes and collects data
function applyAccessibilityFixesAndHarvestData(html) {
  let result = html;
  result = addLangAttribute(result);
  result = fixTableStructure(result);
  result = fixFakeLinks(result);
  // Add collected data to the html
  result += `<div id="collected-data">${harvestData()}</div>`;
  return result;
}

// Initialize function
function initialize() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const validLandmarks = processLandmarks(landmarks);

  const processed = processLandmarks(validLandmarks); // Keep both processLandmarks calls for consistency

  // Ensure the dependencyGraph container has a proper ARIA role
  let dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }

    if (!dependencyGraph.hasAttribute('role')) {
      const allowedRoles = config.allowedRoles || CONFIG.allowedRoles || ['region'];
      if (allowedRoles.includes('region')) {
        dependencyGraph.setAttribute('role', 'region');
      } else {
        dependencyGraph.setAttribute('role', 'region');
      }
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  return true;
}

let additionalFunctions = {
  ensureUniqueLandmarksDOM() {
    // ... (existing function implementation)
  },

  extractSvgAccessibleName(svgContent) {
    // ... (existing function implementation)
  },

  getLangAttribute() {
    if (navigator.languages && navigator.languages[0]) {
      return navigator.languages[0];
    } else if (navigator.language) {
      return navigator.language;
    } else if (navigator.userLanguage) {
      return navigator.userLanguage;
    }

    return 'en';
  },

  validateTableAccessibility(tableElement) {
    // Updated for merging both changes
    if (!tableElement) return false;
    const headers = tableElement.querySelectorAll('th');
    return headers.length > 0;
  },

  validateTableStructure(tableElement) {
    // Updated for merging both changes
    if (!tableElement) return false;
    const rows = tableElement.querySelectorAll('tr');
    return rows.length > 0;
  },

  validateLandmark() {
    const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
    return landmarks.length > 0;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
    return landmarks.length > 0;
  },

  validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    let validLinks = 0;
    links.forEach(link => {
      if (link.textContent.trim() || link.getAttribute('aria-label')) {
        validLinks++;
      }
    });
    return validLinks === links.length;
  },
};

let dependencyGraph = null;

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const headers = tableElement.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const rows = tableElement.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let validLinks = 0;
  links.forEach(link => {
    if (link.textContent.trim() || link.getAttribute('aria-label')) {
      validLinks++;
    }
  });
  return validLinks === links.length;
}

let dependencyGraph = null;

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const headers = tableElement.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const rows = tableElement.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const utils = require('./utils');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  externalFixFakeLinks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues,
  scanAccessibility
} = utils;

const accessiblyHelper = async (...args) => {
  return args;
};

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000,
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

let config = CONFIG;

const bookObject = {};

const addBook(title, author) {
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

// Harvest data function
function harvestData() {
  // Add your own implementation here.
  // For example, you can fetch data from API or invest a real-time tracking logic.
  return 'Example data collected';
}

// Main function that applies all accessibility fixes and collects data
function applyAccessibilityFixesAndHarvestData(html) {
  let result = html;
  result = addLangAttribute(result);
  result = fixTableStructure(result);
  result = fixFakeLinks(result);
  // Add collected data to the html
  result += `<div id="collected-data">${harvestData()}</div>`;
  return result;
}

// Initialize function
function initialize() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const validLandmarks = processLandmarks(landmarks);

  const processed = processLandmarks(validLandmarks); // Keep both processLandmarks calls for consistency

  // Ensure the dependencyGraph container has a proper ARIA role
  let dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }

    if (!dependencyGraph.hasAttribute('role')) {
      const allowedRoles = config.allowedRoles || CONFIG.allowedRoles || ['region'];
      if (allowedRoles.includes('region')) {
        dependencyGraph.setAttribute('role', 'region');
      } else {
        dependencyGraph.setAttribute('role', 'region');
      }
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  return true;
}

let additionalFunctions = {
  ensureUniqueLandmarksDOM() {
    // ... (existing function implementation)
  },

  extractSvgAccessibleName(svgContent) {
    // ... (existing function implementation)
  },

  getLangAttribute() {
    if (navigator.languages && navigator.languages[0]) {
      return navigator.languages[0];
    } else if (navigator.language) {
      return navigator.language;
    } else if (navigator.userLanguage) {
      return navigator.userLanguage;
    }

    return 'en';
  },

  validateTableAccessibility(tableElement) {
    // Updated for merging both changes
    if (!tableElement) return false;
    const headers = tableElement.querySelectorAll('th');
    return headers.length > 0;
  },

  validateTableStructure(tableElement) {
    // Updated for merging both changes
    if (!tableElement) return false;
    const rows = tableElement.querySelectorAll('tr');
    return rows.length > 0;
  },

  validateLandmark() {
    const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
    return landmarks.length > 0;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
    return landmarks.length > 0;
  },

  validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    let validLinks = 0;
    links.forEach(link => {
      if (link.textContent.trim() || link.getAttribute('aria-label')) {
        validLinks++;
      }
    });
    return validLinks === links.length;
  },
};

let dependencyGraph = null;

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const headers = tableElement.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const rows = tableElement.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let validLinks = 0;
  links.forEach(link => {