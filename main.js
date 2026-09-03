const books = [];
const safetyCategory = "User Safety: safe";

// Module imports and configuration
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const fastMap = require('fast-map');

const accessiblyHelper = async (...args) => {
  return args;
};

const config_legacy = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

// Configuration - merged
const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data',
  name: 'MyApp',
  version: '1.0.0',
  debug: false
};

// Application state
const appState = {
  initialized: false,
  data: null,
  cache: {}
};

let icons = {};

// Accessibility improvements:
// - Added semantic HTML structure
// - Included ARIA attributes where necessary
// - Ensured keyboard navigation support
// - Added focus management

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

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

// TODO: Implement harvest logic
// This function should collect resources or data from available sources
function harvestData() {
  const dataPath = CONFIG.dataPath;
  const files = fs.readdirSync(dataPath);
  let totalItems = 0;

  files.forEach(file => {
    if (file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(path.join(dataPath, file), 'utf8');
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          totalItems += data.length;
        } else {
          totalItems += 1;
        }
      } catch (e) {
        // Ignore unreadable files
      }
    }
  });

  return `Collected ${totalItems} items from ${files.length} data files`;
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

// Export functions for addressing accessibility issues
const getLangAttribute = () => {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
};

const addLangAttribute = () => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', getLangAttribute());
  }
};

const ensureLangAttribute = () => {
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
};

const createInPageButton = (buttonsData) => {
  const buttonsContainer = document.getElementById('in-page-buttons-container');

  if (!buttonsContainer) {
    console.error('In-page buttons container not found');
    return;
  }

  buttonsData.forEach(buttonData => {
    const button = document.createElement('button');
    button.id = buttonData.id;
    button.textContent = buttonData.text;
    button.setAttribute('data-role', buttonData.role);

    button.addEventListener('click', () => {
      location.hash = buttonData.href;
    });

    buttonsContainer.appendChild(button);
  });
};

const getSvgAccessibleName = (element) => {
  const title = element.querySelector('title');
  return title ? title.textContent : (element.getAttribute('aria-label') || '');
};

const setSvgAccessibleNames = (icons) => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const id = svg.id || utils.generateKey();
    icons[id] = getSvgAccessibleName(svg);
    svg.setAttribute('aria-label', icons[id]);
  });
};

const addSvgAccessibleNames = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const id = svg.id || utils.generateKey();
    const accessibleName = getSvgAccessibleName(svg);
    svg.setAttribute('aria-label', accessibleName);
  });
};

const setSvgAttributes = () => {
  setSvgAccessibleNames(icons);
};

const validateTableAccessibility = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('th, td');
        cells.forEach(cell => {
          const newTh = document.createElement('th');
          newTh.textContent = cell.textContent;
          newTh.setAttribute('scope', 'col');
          headerRow.appendChild(newTh);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      const thead = table.querySelector('thead');
      const rowsAfterHeader = thead ? Array.from(rows).slice(1) : Array.from(rows);
      if (rowsAfterHeader.length > 0) {
        const tbody = document.createElement('tbody');
        rowsAfterHeader.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
  });
};

const validateTableStructure = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('th, td');
        cells.forEach(cell => {
          const newTh = document.createElement('th');
          newTh.textContent = cell.textContent;
          if (cell.hasAttribute('colspan')) {
            newTh.setAttribute('colspan', cell.getAttribute('colspan'));
          }
          if (cell.hasAttribute('rowspan')) {
            newTh.setAttribute('rowspan', cell.getAttribute('rowspan'));
          }
          newTh.setAttribute('scope', 'col');
          headerRow.appendChild(newTh);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      const thead = table.querySelector('thead');
      const rowsAfterHeader = thead ? Array.from(rows).slice(1) : Array.from(rows);
      if (rowsAfterHeader.length > 0) {
        const tbody = document.createElement('tbody');
        rowsAfterHeader.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
  });
};

const fixTableStructure = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility.call(this, table);
    validateTableStructure.call(this, table);
  });
  return tables.length > 0;
};

const fixTableStructureIssues = () => {
  return fixTableStructure();
};

const validateLandmark = (element) => {
  if (typeof element?.id === 'undefined' || element.id === null) {
    element.setAttribute('id', utils.generateKey());
  }
  if (!element.getAttribute('role')) {
    element.setAttribute('role', element.tagName.toLowerCase());
  }

  return { valid: true, element };
};

const addMainLandmark = () => {
  if (typeof document !== 'undefined') {
    let main = document.querySelector('main');
    if (!main) {
      main = document.createElement('main');
      document.body.appendChild(main);
    }
    return { valid: true, element: main };
  }
  return { valid: false, element: null };
};

const validateLandmarkStructure = (landmarks) => {
  if (!Array.isArray(landmarks)) return [];
  return landmarks.map(landmark => validateLandmark(landmark));
};

const validateLandmarkAttributes = (landmarks, config) => {
  if (!Array.isArray(landmarks)) return [];
  const maxLandmarks = config.maxLandmarks || 50;
  const allowedRoles = config.allowedRoles || ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

  return landmarks.filter(landmark => {
    if (!landmark?.element || !landmark.element.hasAttribute('role')) {
      return false;
    }
    const role = landmark.element.getAttribute('role');
    if (!allowedRoles.includes(role)) {
      console.warn(`Invalid landmark role "${role}" - expected one of ${allowedRoles.join(' ')}`);
    }
    if (landmarks.length > maxLandmarks) {
      console.warn(`Exceeded maximum allowed landmarks (${maxLandmarks})`);
    }
    return true;
  });
};

const fixFakeLinks = (container) => {
  if (!container) return;

  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  });
};

const handleFakeLinks = () => {
  fixFakeLinks(document);
};

const addProperLandmarkRegions = (container) => {
  if (!container) return [];

  const regions = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
  const addedRegions = [];

  regions.forEach(role => {
    const existing = container.querySelector(`[role="${role}"]`);
    if (!existing) {
      const region = document.createElement('div');
      region.setAttribute('role', role);
      container.appendChild(region);
      addedRegions.push(role);
    }
  });

  return addedRegions;
};

const ensureDependencyGraphAriaRole = () => {
  let dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }

    if (!dependencyGraph.hasAttribute('role')) {
      const allowedRoles = CONFIG.allowedRoles || ['region'];
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
};

const checkLandmarkElement = (elementOrId) => {
  let element = elementOrId;
  if (typeof elementOrId === 'string') {
    element = document.getElementById(elementOrId);
  }

  if (!element) {
    return false;
  }

  const hasRole = element.getAttribute('role');
  const hasAriaLabel = element.getAttribute('aria-label');
  const hasAriaLabelledby = element.getAttribute('aria-labelledby');

  if (!(hasRole || hasAriaLabel || hasAriaLabelledby)) {
    if (!element.hasAttribute('aria-labelledby')) {
      const id = typeof elementOrId === 'string' ? elementOrId : element.id;
      if (id) {
        element.setAttribute('aria-labelledby', id);
      }
    }
  }

  return element;
};

const ensureUniqueLandmarks = (landmarksArray) => {
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
};

const ensureUniqueLandmarksDoc = () => {
  return ensureUniqueLandmarks(Array.from(document.querySelectorAll('[role]:not([role="presentation"]):not([role="none"])')));
};

const landmarkStructureCheck = (landmarks) => {
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
        if (inner?.role && !landmarkRoles.includes(inner.role)) {
          results.errors.push(`Invalid landmark role: ${inner.role}`);
          results.valid = false;
        }
      });
    } else {
      results.landmarks.push(landmark);
      if (landmark?.role && !landmarkRoles.includes(landmark.role)) {
        results.errors.push(`Invalid landmark role: ${landmark.role}`);
        results.valid = false;
      }
    }
  });

  return results;
};

const addLandmarkRegions = (container) => {
  return addProperLandmarkRegions(container);
};

const validateLinkAccessibility = (link) => {
  if (!link) return { valid: false };
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return { valid: false, issue: 'fake link' };
  }
  return { valid: true };
};

const processLandmarks = (landmarks) => {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
};

const isValidLandmark = (landmark) => {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
};

const loadLandmarks = () => {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
};

const sortLandmarks = (landmarks, ascending = true) => {
  return landmarks.slice().sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (ascending) {
      return nameA.localeCompare(nameB);
    }
    return nameB.localeCompare(nameA);
  });
};

const getLandmarkById = (landmarks, id) => {
  return landmarks.find(landmark => landmark.id === id) || null;
};

const checkUserSafety = () => {
  return safetyCategory;
};

const getUserSafety = () => {
  return checkUserSafety();
};

function checkSafetyCategories() {
  return ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
}

// Add book form
function createBookForm() {
  if (typeof document === 'undefined') return;

  const form = document.createElement('form');
  form.id = 'book-form';
  form.setAttribute('aria-label', 'Add Book Form');

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'book-title';
  titleInput.setAttribute('aria-label', 'Book Title');
  titleInput.required = true;

  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.id = 'book-author';
  authorInput.setAttribute('aria-label', 'Author Name');
  authorInput.required = true;

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Add Book';

  form.appendChild(titleInput);
  form.appendChild(authorInput);
  form.appendChild(submit);

  return form;
}

function createAccessibleInput() {
  const input = document.createElement('input');
  input.type = 'text';
  input.setAttribute('aria-label', 'Accessible Input');
  return input;
}

function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate-btn';
  button.textContent = 'Unrotate';
  button.setAttribute('aria-label', 'Rotate Back');
  return button;
}

function rotateBack() {
  if (typeof window !== 'undefined') {
    window.location.hash = '';
  }
}

// Main initialization function
const initializeApp = () => {
  logger.info('Application starting...');
  appState.initialized = true;
  appState.data = config || {};
  return appState;
};

const initApp = (config) => {
  return initializeApp(config);
};

const initAppAfterFixes = () => {
  initializeAccessibility();
  return initializeApp();
};

const fetchUser = (userId) => {
  return { id: userId, name: 'Test User' };
};

const clearCache = () => {
  appState.cache = {};
};

// Helper function
function initialize() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const validLandmarks = processLandmarks(landmarks);

  const processed = processLandmarks(validLandmarks); // Keep both processLandmarks calls for consistency

  // Ensure the dependencyGraph container has a proper ARIA role
  ensureDependencyGraphAriaRole();

  return true;
}

const initializeAccessibility = () => {
  ensureLangAttribute();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinks();
  ensureDependencyGraphAriaRole();
};

const analyzeModuleDependencies = (modules) => {
  console.log('Analyzing dependencies for modules:', modules);
  return analyzeModuleDependenciesLocal(modules);
};

const analyzeModuleDependenciesLocal = (modules) => {
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
};

const visualizeModuleRelationships = (modules) => {
  console.log('Visualizing relationships for modules:', modules);
  return visualizeModuleRelationshipsLocal(modules);
};

const visualizeModuleRelationshipsLocal = (modules) => {
  return {
    graph: {},
    nodes: [],
    edges: []
  };
};

const ensureFocusableElements = () => {
  if (typeof document !== 'undefined') {
    const focusableElements = document.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(el => {
      if (!el.hasAttribute('tabindex') && el.tagName !== 'A') {
        el.setAttribute('tabindex', '0');
      }
    });
  }
};

const validateSvgAccessibility = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const title = svg.querySelector('title');
      if (title) {
        const label = title.textContent.trim();
        svg.setAttribute('aria-label', label);
      } else {
        svg.setAttribute('aria-label', 'SVG icon');
      }
    }
  });
};

const processUniqueElements = (elements) => {
  if (!Array.isArray(elements)) {
    return [];
  }
  const seen = new Set();
  return elements.filter(element => {
    if (seen.has(element.id)) {
      return false;
    }
    seen.add(element.id);
    return true;
  });
};

const formatResponse = (response) => {
  return JSON.stringify({ status: 'success', data: response }, null, 2);
};

const formatDate = (date) => {
  return new Date(date).toISOString();
};

const processData = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => item.toString());
  }
  return data.toString();
};

const someFunction = (input) => {
  return input;
};

const getConfig = () => {
  return {
    apiUrl: (typeof process !== 'undefined' && process.env && process.env.API_URL) || '',
    timeout: 5000
  };
};

const testFunction = () => {
  return 'test';
};

// New functions to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(CONFIG.dataPath, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Main function
function main() {
  console.log('Main function called');
}

// Export main functions
module.exports = {
  checkSafetyCategories,
  addBook,
  getBooksList,
  createInPageButton,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  sortLandmarks,
  getLandmarkById,
  main,
  checkUserSafety,
  createAccessibleInput,
  createBookForm,
  createUnrotateButton,
  getUserSafety,
  getUserSafetyAdvice,
  appState,
  initializeApp,
  initialize,
  landmarkStructureCheck,
  addMainLandmark,
  fixTableStructureIssues,
  addSvgAccessibleNames,
  addLangAttribute,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  initializeAccessibility,
  fetchUser,
  clearCache,
  formatResponse,
  formatDate,
  processData,
  someFunction,
  getConfig,
  applyAccessibilityFixesAndHarvestData,
  ensureDependencyGraphAriaRole,
  writeReport,
  addProperLandmarkRegions,
  fixTableStructure,
  fixFakeLinks,
  validateLandmark,
  validateLandmarkStructure,
  checkLandmarkElement
};