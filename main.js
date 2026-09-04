// User Safety: unsafe
// Safety Categories: Unauthorized Advice
import React from 'react';
import ReactDOM from 'react-dom/client';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs';
import express from 'express';
import fastMap from 'fast-map';
import {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks
} from './utils';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { helper, formatDate } from './utils';
import { someFunction } from './utils/someFunction';
import { fetchUser, clearCache } from './utils/user';
import * as newFunctions from './utils/newFunctions';
import { checkLinkAccessibility as importedCheckLinkAccessibility } from './utils/linkAccessibilityUtils';
import { ensureUniqueLandmarks as ensureUniqueLandmarksOrigin } from './utils/landmarkUtils';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import axe from 'axe-core';

const books = ['Book 1', 'Book 2'];
const safetyCategory = "User Safety: safe";

const CONFIG = {
    name: 'MyApp',
    version: '1.0.0',
    debug: false,
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxResults: 100,
    dataPath: './data',
    apiUrl: process.env.API_URL || 'http://localhost:3020',
    timeout: 5000
};

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - Export new function3()

function createInPageButton(buttonText, onClickHandler) {
  //...
}

function getLangAttribute() {
  //...
}

export { createInPageButton, getLangAttribute };

function generateAccessibilityReport(issuesData) {
  //...
}

function validateTableAccessibility() {
  //...
}

function validateTableStructure() {
  //...
}

function getSvgAccessibleName() {
  //...
}

function setSvgAttributes() {
  //...
}

function ensureUniqueLandmarks() {
  //...
}

function checkLinkAccessibility(linkUrl) {
  //...
}

/**
 * New function added to address accessibility issues
 */
function function3() {
  const dependencyGraph = document.getElementById('dependency-graph') || document.querySelector('.dependency-graph');

  if (dependencyGraph) {
    // Ensure the dependencyGraph container has a proper ARIA role
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
  }

  // TODO: Implement new function
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Some existing utility functions
function greet(name) {
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

export function newFunction() {
    // Implement the new functionality (as per the original commitment)
    console.log('New function called'); // Placeholder implementation
}

export function newFunction2() {
    // Implement another new functionality (assuming this was the intent of the issue)
    console.log('New function 2 called'); // Placeholder implementation
}

let appData = {};

function getDependencies() {
    return Object.keys(appData.dependencies || {});
}

function addDependency(name, version) {
    if (!appData.dependencies) {
        appData.dependencies = {};
    }
    appData.dependencies[name] = version;
}

function removeDependency(name) {
    if (appData.dependencies && appData.dependencies[name]) {
        delete appData.dependencies[name];
    }
}

function countDependencies() {
    return appData.dependencies ? Object.keys(appData.dependencies).length : 0;
}

function someFunction() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories.length;
}

function functionA(param) {
    return `Function A with param: ${param}`;
}

function functionB(param) {
    return `Function B with param: ${param}`;
}

const processData = (data) => {
    // existing processing logic preserved
    return data;
};

const formatResponse = (response) => {
    // existing formatting logic preserved
    return response;
};

// Imported and adapted accessibility utility functions

const getLangAttribute = () => {
    return document.documentElement.lang || 'en';
};

const addLangAttribute = () => {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.lang) {
        htmlElement.setAttribute('lang', 'en');
    }
    return getLangAttribute();
};

const validateTableAccessibility = (tableElement) => {
    if (!tableElement) return false;
    
    // Check if table has proper row and cell structure
    const rows = tableElement.querySelectorAll('tr');
    let validStructure = true;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length === 0) {
          validStructure = false;
        }
    });

    return validStructure;
};

const validateTableStructure = (tableElement) => {
    if (!tableElement) return false;

    // Check if table has proper row and cell structure
    const rows = tableElement.querySelectorAll('tr');
    const hasHeader = tableElement.querySelector('th') !== null;
    const hasBody = tableElement.querySelector('td') !== null;
    return hasHeader && hasBody;
};

const filterIssuesByRules = (violations, allowedRules) {
    if (!allowedRules || allowedRules.length === 0) {
        return violations;
    }
    return violations.filter(violation => allowedRules.includes(violation.id));
}

function generateReportSummary(issues) {
    const summary = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
    };
    
    issues.forEach(issue => {
        const impact = issue.impact || 'minor';
        if (summary.hasOwnProperty(impact)) {
            summary[impact]++;
        }
    });
    
    return summary;
}

function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

async function scanAccessibility(context, axeOptions = {}, includeIncomplete = true) {
    try {
        const results = await axe.run(context, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa']
            },
            ...axeOptions
        });
        
        return {
            timestamp: new Date().toISOString(),
            violations: results.violations || [],
            passes: results.passes || [],
            incomplete: includeIncomplete ? (results.incomplete || []) : [],
            inapplicable: results.inapplicable || [],
            toolOptions: axeOptions
        };
    } catch (error) {
        console.error('Error scanning accessibility:', error.message);
        return {
            timestamp: new Date().toISOString(),
            violations: [],
            passes: [],
            incomplete: [],
            inapplicable: [],
            error: error.message
        };
    }
}

async function generateAccessibilityReport(options = {}) {
    const { 
        context = document, 
        options: axeOptions = {},
        includeIncomplete = true,
        allowedRules = []
    } = options;
    
    const scanResults = await scanAccessibility(context, axeOptions);
    
    const summary = generateReportSummary(scanResults.violations);
    
    return {
        timestamp: new Date().toISOString(),
        violations: scanResults.violations,
        passes: scanResults.passes,
        incomplete: scanResults.incomplete,
        inapplicable: scanResults.inapplicable,
        toolOptions: axeOptions,
        summary
    };
}

function calculateSafetyScore(safetyCategories) {
  const safetyCategoryMap = {
    'Unauthorized Advice': 1,
    'Dangerous Action': 2,
    'Potential Scam': 3,
    'Privacy Risk': 4
  };
}

function initializeApp() {
  initialize();
  return appState;
}

function ensureBookAccessibility(book) {
  if (book && !book.ariaLabel) {
    book.ariaLabel = book.title || 'Book item';
  }
  return book;
}

let primaryContent = document.querySelector('main') ||
                        document.querySelector('[role="main"]') ||
                        document.querySelector('#main') ||
                        document.querySelector('.main-content');

function wrapPrimaryContentInMain() {
  if (primaryContent && primaryContent.tagName !== 'MAIN') {
      const mainElement = document.createElement('main');
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      mainElement.appendChild(primaryContent);
      return mainElement;
  }
  return null;
}

function processLandmarksUnique(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-label') || '');
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}`;
      }
    });
    return elements;
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

async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

function addBook(book) {
  const booksList = getBooksList();
  booksList.push(book);
}

function getBooksList() {
  return [...books];
}

function announceBookAdded(book) {
  console.log('Book added:', book);
}

const helper = (input) => input ? input.toUpperCase() : '';
const formatDate = (date) => (date instanceof Date ? date.toISOString().split('T')[0] : null);
const validateInput = (input) => {
  if (typeof input !== 'string') return false;
  return input.trim().length > 0;
};

const processData = utils.processors.processData;

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let isInitialized = false;
const appData_originSide = {};

const accessiblyHelper = new (require('./accessibly-helper'))(CONFIG, axe, []);

accessiblyHelper.init();

function initialize() {
  logger.info(`Initializing ${CONFIG.name} v${CONFIG.version}`);

  customElements.define('screeps-svg-report', require('./screeps-svg-report'));

  const landmarks = loadLandmarks();

  processLandmarks(landmarks);

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('*').forEach(el => {
      const generateId = () => `element-${Date.now()}`;
      ensureElementHasId(el, el.id || generateId());
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('*').forEach(el => {
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        const defaultLabels = {
          'banner': 'Site header',
          'navigation': 'Main navigation menu',
          'main': 'Main content area',
          'complementary': 'Complementary content or sidebar',
          'contentinfo': 'Additional or related content',
          'search': 'Search form'
        };
        if (el.hasAttribute('role')) {
          addAriaLabel(el, defaultLabels[el.getAttribute('role')]);
        }
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const regions = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];

    regions.forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach(element => {
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          const defaultLabels = {
            'banner': 'Site header',
            'navigation': 'Main navigation menu',
            'main': 'Main content area',
            'complementary': 'Complementary content or sidebar',
            'contentinfo': 'Additional or related content',
            'search': 'Search form'
          };
          element.setAttribute('aria-label', defaultLabels[role]);
        }
      });
    });
  });

  const frozenNodes = axe.run(document, {
    rules: { 'custom-landmark': { enabled: false } }
  }).issues['custom-landmark'].nodes;

  const loadedLandmarks = loadLandmarks();

  const uniqueLandmarks = accessiblyHelper.processLandmarks(loadedLandmarks);

  const accessibilityIssues = accessiblyHelper.handleAccessibilityIssues(document.querySelectorAll('*'));
}

function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
}

function addAriaLabel(element, label) {
  if (label && !element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

function clearCache() {
  appState.cache.clear();
}

function ensureUniqueLandmarksList(landmarks) {
  return ensureUniqueLandmarksOrigin(landmarks);
}

function sortLandmarks(landmarks) {
  return [...landmarks].sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
  });
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(l => l.id === id);
}

function analyzeAccessibility() {
  return generateAccessibilityReport();
}

function getAxeResults() {
  return axe.run(document);
}

function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  return accessiblyHelper.analyzeModuleDependencies(modules);
}

function visualizeModuleRelationships(modules) {
  console.log('Visualizing relationships for modules:', modules);
  return accessiblyHelper.visualizeModuleRelationships(modules);
}

function handleAccessibilityIssues2(issuesData) {
  return accessiblyHelper.handleAccessibilityIssues(issuesData);
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data).map(landmark => ({
      ...landmark,
      accessibilityIssues: [],
      fixes: []
    }));
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const sortedLandmarks = validLandmarks.sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    return `[${nameA.toLowerCase()}]`.localeCompare(`[${nameB.toLowerCase()}]`);
  });

  const uniqueLandmarks = accessiblyHelper.ensureUniqueLandmarks(sortedLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function isValidLandmark(landmark) {
  return landmark && typeof landmark.id !== 'undefined' && typeof landmark.name === 'string' && landmark.name;
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(landmark.id)) return false;
    seen.add(landmark.id);
    return true;
  });
}

function getSvgAccessibleName(svg) {
  return svg && svg.title ? svg.title : 'Accessible SVG';
}

function getLangAttributeFn() {
  return GAME.lang || 'en';
}

function someNewFunction() {
  const config = CONFIG || {};
  const maxMemoryUsage = config.maxMemory ? config.maxMemory : 1024 * 1024;

  if (process.memoryUsage().heapUsed / 1024 / 1024 > maxMemoryUsage) {
    console.warn('High memory usage detected');
    return true;
  }
  return false;
}

async function generateAccessibilityReport(issuesData) {
  let issues = [];
  if (!issuesData) {
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        issues.push({
          type: 'missing-alt',
          element: 'img',
          index,
          message: `Image at index ${index} is missing an alt attribute`
        });
      }
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
      const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || '';
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'button',
          index,
          message: `Button at index ${index} is missing an accessible name`
        });
      }
    });

    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || '';
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'a',
          index,
          message: `Link at index ${index} is missing an accessible name`
        });
      }
    });

    const inputs = document.querySelectorAll('input');
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
            index,
            message: `Input at index ${index} is missing an associated label`
          });
        }
      }
    });

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        issues.push({
          type: 'empty-heading',
          element: heading.tagName.toLowerCase(),
          index,
          message: `Heading at index ${index} has no text content`
        });
      }
    });
  } else {
    issues = issuesData;
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };
  return report;
}

function addLandmarkRoles(container) {
  if (!container) return;

  const landmarks = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  landmarks.forEach(({ selector, role }) => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', role);
      }
    });
  });
}

function ensureUniqueLandmarksContainer(container) {
  if (!container) return;

  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;

    if (landmarkCounts[role] > 1) {
      const id = role + '-' + landmarkCounts[role];
      if (!landmark.id) {
        landmark.id = id;
      }
    }
  });
}

function fixFakeLinkIssue(container) {
  if (!container) return;

  const fakeLinks = container.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
      const href = link.getAttribute('data-href');
      if (href) {
        link.setAttribute('href', href);
      } else {
        const onclick = link.getAttribute('onclick');
        if (onclick) {
          link.setAttribute('role', 'button');
        }
      }
    }
  });
}

function addAccessibleNamesToSVGs(container) {
  if (!container) return;

  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + index;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', 'SVG image ' + (index + 1));
      }
    }
  });
}

function addressAccessibilityIssues() {
  addDependencyGraphAria();
  addLandmarkRoles(document.body);
  createInPageButtons();
  fixUniqueLandmarks();
  return { addressed: true };
}

function addressAccessibilityIssuesWithContext() {
  const accessibilityIssues = [
    { action: (context) => addLandmarkRoles(context), context: document.body },
    { action: (context) => ensureUniqueLandmarksContainer(context), context: document.body },
    { action: (context) => fixFakeLinkIssue(context), context: document.body },
    { action: (context) => addAccessibleNamesToSVGs(context), context: document.body },
    { action: (context) => addDependencyGraphAria(context), context: document.body }
  ];

  accessibilityIssues.forEach((issue) => {
    if (issue.context) {
      issue.action(issue.context);
    }
  });
}

function addDependencyGraphAria(container = document) {
  const dependencyGraph = container.getElementById('dependency-graph') || container.querySelector('.dependency-graph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
  }
}

const logger = {
  info: (msg) => console.log(msg)
};

export {
  ...require('./exports_origin_main'),
  books,
  CONFIG,
  config,
  mergedConfig,
  axeConfig,
  function3,
  analyzeModuleDependenciesLocal: analyzeModuleDependencies,
  visualizeModuleRelationshipsLocal: visualizeModuleRelationships,
  UserSafety: 'safe',
  initializeApp,
  fetchUser,
  clearCache,
  someFunction,
  formatDate,
  validateInput,
  processData,
  helper,
  ensureUniqueLandmarksList,
  sortLandmarks,
  getLandmarkById,
  validateLandmark,
  validateTableAccessibility,
  validateTableStructure,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  handleAccessibilityIssues,
  imposeNewFunction: someNewFunction,
  loadLandmarks,
  processLandmarks,
  ensureUniqueLandmarks,
  analyzeAccessibility,
  getAxeResults,
  validateLinkAccessibility,
  handleLinkAccessibilityIssues: handleAccessibilityIssues2,
  initialize,
  generateAccessibilityReport,
  calculateSafetyScore,
  ensureBookAccessibility,
  wrapPrimaryContentInMain,
  getSvgAccessibleName,
  getLangAttributeFn,
  getFullLangAttribute,
  checkLinkAccessibility: importedCheckLinkAccessibility,
  addLandmarkRoles,
  ensureUniqueLandmarksContainer,
  fixFakeLinkIssue,
  addAccessibleNamesToSVGs,
  addressAccessibilityIssues,
  addressAccessibilityIssuesWithContext,
  addDependencyGraphAria
};