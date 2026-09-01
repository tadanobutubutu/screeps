import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import express from 'express';
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// Accessibility improvements from both branches:
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixTableAccessibility,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  generateAccessibilityReport,
  addressAccessibilityIssues,
  renderDependencyGraphContent,
  createInPageButtons,
  fixUniqueLandmarks
} = require('./accessibility-improvements');

const {
  fixTableStructure,
  fixLandmarks,
  checkLandmarkElements,
  addSvgAccessibleNames: addSvgAccessibleNamesAlt,
  fixFakeLinks: fixFakeLinksAlt,
  replaceButtonIds,
  ensureDependencyGraphAriaRole
} = require('./accessibly-improvements');

const accessiblyHelper = require('./accessibly-helper');

// Configuration - merged from both versions
const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000
};

const CONFIG = config;

// Application configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Accessibility configuration
const ACCESSIBILITY_CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search']
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

// Utilities from the Node.js branch
const { validateInput, processData } = require('./utils/validators');
const { formatResponse } = require('./utils/processor');

// Existing dependency storage
let dependencies = [
  { name: 'lodash', version: '4.17.21' },
  { name: 'express', version: '4.18.2' },
  { name: 'react', version: '18.2.0' }
];

function getDependencies() {
  return dependencies;
}

function addDependency(name, version) {
  dependencies.push({ name, version });
  return dependencies;
}

function removeDependency(name) {
  dependencies = dependencies.filter(dep => dep.name !== name);
  return dependencies;
}

function countDependencies() {
  return dependencies.length;
}

// Book management functions
function addBook(book) {
  const listItem = document.createElement('li');
  listItem.textContent = `${book.title} by ${book.author}`;
  listItem.setAttribute('role', 'option');
  listItem.setAttribute('aria-selected', 'false');
  listItem.setAttribute('tabindex', '-1');
  const bookList = document.getElementById('book-list');
  if (bookList) {
    bookList.appendChild(listItem);
  }
  updateBookListUI();
}

function updateBookListUI() {
  const bookCount = document.getElementById('book-count');
  const bookList = document.getElementById('book-list');
  if (bookCount && bookList) {
    const count = bookList.children.length;
    bookCount.textContent = `Total Books: ${count}`;
  }
}

// Accessibility improvements:
function addKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Handle keyboard events
  });
}

function addAriaLabels() {
  const elements = document.querySelectorAll('[role]');
  elements.forEach(el => {
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', el.getAttribute('role'));
    }
  });
}

function addScreenReaderAnnouncements() {
  const elements = document.querySelectorAll('[data-label]');
  elements.forEach(el => {
    el.setAttribute('aria-label', el.getAttribute('data-label'));
  });
}

function addFocusTrap() {
  const focusableElements = document.querySelectorAll('a, button, input, [tabindex]');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}

function addLangAttribute(html, lang = 'en') {
  if (typeof html !== 'string') return html;
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match;
    return `<html${attrs} lang="${lang}">`;
  });
}

function ensureLangAttribute() {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

function setLanguageAttribute() {
  document.documentElement.lang = 'en';
}

function addLangAttributeToHtml() {
  if (!document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', getLangAttribute());
  }
}

// Google Sign-In logic
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: client_id,
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

// DOM Elements
const dependencyGraph = typeof document !== 'undefined' ? document.getElementById('dependencyGraph') : null;

// Helper functions for accessibility
function checkAriaRole() {
  if (dependencyGraph) {
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }
}

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

function checkLinkAccessibility(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(url, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

function checkLandmarkElements() {
  const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
  landmarks.forEach(landmark => {
    const element = document.querySelector(`[role="${landmark}"]`);
    if (element) {
      element.setAttribute('aria-label', `Navigation: ${landmark}`);
    }
  });
}

function ensureMainContainerAccessible(mainContainer) {
  if (mainContainer && !mainContainer.hasAttribute('aria-label')) {
    mainContainer.setAttribute('aria-label', 'Main content area');
  }
}

function fixFakeLink() {
  const fakeLinks = document.querySelectorAll(':not([href])[role="link"]');
  fakeLinks.forEach(link => {
    link.removeAttribute('role');
    link.setAttribute('href', '#');
  });
}

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

// Landmark processing utilities
function ensureUniqueLandmarks() {
  const landmarks = [...document.querySelectorAll('[aria-landmark]')];
  const landmarkIds = landmarks.map(landmark => landmark.getAttribute('aria-landmark'));
  const uniqueIds = new Set(landmarkIds);

  landmarks.forEach((landmark, index) => {
    if (!uniqueIds.has(landmarkIds[index])) {
      landmark.setAttribute('aria-landmark', '');
      uniqueIds.add(landmarkIds[index]);
    }
  });
}

function ensureUniqueLandmarksFor(landmarksToCheck) {
  const uniqueIds = new Set();
  landmarksToCheck.forEach(landmark => {
    const element = document.querySelector(`[role="${landmark}"]`);
    if (element && !uniqueIds.has(element.getAttribute('aria-landmark'))) {
      uniqueIds.add(element.getAttribute('aria-landmark'));
    }
  });

  landmarksToCheck.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    Array.from(elements).forEach(landmarkElement => {
      if (!uniqueIds.has(landmarkElement.getAttribute('aria-landmark'))) {
        landmarkElement.setAttribute('aria-landmark', '');
        uniqueIds.add(landmarkElement.getAttribute('aria-landmark'));
      }
    });
  });
}

function addLandmarkRoles(main, aside) {
  if (main) {
    addMainLandmark(main);
  }
  if (aside) {
    aside.setAttribute('role', 'complementary');
  }
}

function addMainLandmark(mainElement) {
  if (!mainElement.hasAttribute('role') || mainElement.getAttribute('role') !== 'main') {
    mainElement.setAttribute('role', 'main');
  }
  return mainElement;
}

function wrapPrimaryContentInMain(primaryContent) {
  // TODO: Add implementation for wrapping primary content in <main>
}

function isValidLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

// SVG accessibility functions
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

function extractSvgAccessibleName(svgContent) {
  const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
  const title = svgElement.querySelector('title');
  return title ? title.textContent : 'No accessible name found';
}

function setSvgAccessibleNames(id1, id2, label1, label2) {
  // Add accessible names to 2 SVGs
}

// Table accessibility functions
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.insertBefore(caption, table.firstChild);
    }

    const headers = table.querySelectorAll('th');
    const cells = table.querySelectorAll('td, th');

    cells.forEach(cell => {
      if (!cell.hasAttribute('scope') && !cell.hasAttribute('headers')) {
        const isHeader = cell.tagName === 'TH';
        if (isHeader) {
          cell.setAttribute('scope', 'col');
        }
      }
    });
  });
}

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

// Helper functions
function getLangAttribute() {
  return document.documentElement.lang;
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
  if (!landmarks || !Array.isArray(landmarks)) {
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
    return nameB.localeCompare(nameA);
  });
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(landmark => landmark.id === id) || null;
}

// Placeholder validation functions
function validateTableAccessibility() {
  return [];
}

function validateTableStructure() {
  return [];
}

function validateLandmarkStructure() {
  return [];
}

function validateLandmarkAttributes() {
  return [];
}

function getSvgAccessibleName() {
  return [];
}

function validateLinkAccessibility() {
  return [];
}

function analyzeAccessibility(issuesData) {
  return issuesData || [];
}

// General helper functions
function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function validateInputFn(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

function processDataFn(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

function formatResponse(data) {
  return JSON.stringify(data, null, 2);
}

// Local helper functions
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
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      uniqueLandmarks.push(landmark);
    }
  }
  return uniqueLandmarks;
}

function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Accessibility Info';
  button.setAttribute('aria-label', 'Show accessibility information');
  document.body.appendChild(button);
}

function importAndExecute(modulePath, functionName, callback) {
  require(modulePath)[functionName](callback);
}

// New functions for module analysis
function analyzeModuleDependenciesLocal(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

function visualizeModuleRelationshipsLocal(modules) {
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

// New exported function placeholder
function newExportedFunction() {
  // New export logic here...
}

// Accessibility scanning function
async function scanAccessibility(filePaths) {
  const issues = [];

  const langAttribute = getLangAttribute();
  if (!langAttribute) {
    issues.push({
      type: 'REACT_015',
      description: 'HTML element is missing lang attribute',
      severity: 'critical',
      element: 'html'
    });
  }

  const tableAccessibilityIssues = validateTableAccessibility();
  if (tableAccessibilityIssues && tableAccessibilityIssues.length > 0) {
    tableAccessibilityIssues.forEach(function(issue) {
      issues.push({
        file: filePaths && filePaths[0] || 'unknown',
        issues: [issue],
      });
    });
  }

  if (filePaths && Array.isArray(filePaths)) {
    for (const filePath of filePaths) {
      const fileEmitted = path.join(process.cwd(), filePath);
      const { violations } = await axe.analyze(fileEmitted);

      if (violations.length > 0) {
        issues.push({
          file: filePath,
          issues: violations,
        });
      }
    }
  }

  const tableStructureIssues = validateTableStructure();
  if (tableStructureIssues && tableStructureIssues.length > 0) {
    tableStructureIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_027',
        subtype: 'structure',
        description: issue.description || 'Table structure issue',
        severity: issue.severity || 'high',
        element: issue.element,
        table: issue.table
      });
    });
  }

  const landmarkIssues = validateLandmark();
  if (landmarkIssues && landmarkIssues.length > 0) {
    landmarkIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }

  const landmarkStructureIssues = validateLandmarkStructure();
  if (landmarkStructureIssues && landmarkStructureIssues.length > 0) {
    landmarkStructureIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_017',
        structure: true,
        description: issue.description || 'Landmark structure issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }

  const landmarkAttributeIssues = validateLandmarkAttributes();
  if (landmarkAttributeIssues && landmarkAttributeIssues.length > 0) {
    landmarkAttributeIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark attribute issue',
        severity: issue.severity || 'low',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }

  const svgAccessibleNames = getSvgAccessibleName();
  if (svgAccessibleNames && svgAccessibleNames.length > 0) {
    svgAccessibleNames.forEach(function(svg) {
      issues.push({
        type: 'REACT_041',
        description: 'SVG is missing accessible name',
        severity: 'medium',
        svg: svg.element,
        svgId: svg.id
      });
    });
  }

  const uniqueLandmarkIssues = ensureUniqueLandmarks();
  if (uniqueLandmarkIssues && uniqueLandmarkIssues.length > 0) {
    uniqueLandmarkIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_025',
        description: issue.description || 'Duplicate or missing landmark',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }

  const linkIssues = validateLinkAccessibility();
  if (linkIssues && linkIssues.length > 0) {
    linkIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_036',
        description: issue.description || 'Link accessibility issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        link: issue.link
      });
    });
  }

  return {
    timestamp: new Date().toISOString(),
    issues: issues
  };
}

function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);

  const langAttribute = getLangAttribute();
  if (!langAttribute) {
    analyzedIssues.push({
      type: 'REACT_015',
      description: 'HTML element is missing lang attribute',
      severity: 'critical',
      element: 'html'
    });
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: analyzedIssues,
    conclusions: '',
    issues: analyzedIssues,
    summary: {
      totalIssues: analyzedIssues.length,
      langAttribute: analyzedIssues.filter(function(i) { return i.type === 'REACT_015'; }).length,
      tableIssues: analyzedIssues.filter(function(i) { return i.type === 'REACT_027'; }).length,
      landmarkIssues: analyzedIssues.filter(function(i) { return i.type === 'REACT_017'; }).length,
      svgIssues: analyzedIssues.filter(function(i) { return i.type === 'REACT_041'; }).length,
      uniqueLandmarkIssues: analyzedIssues.filter(function(i) { return i.type === 'REACT_025'; }).length,
      linkIssues: analyzedIssues.filter(function(i) { return i.type === 'REACT_036'; }).length,
      critical: analyzedIssues.filter(function(i) { return i.severity === 'critical'; }).length,
      high: analyzedIssues.filter(function(i) { return i.severity === 'high'; }).length,
      medium: analyzedIssues.filter(function(i) { return i.severity === 'medium'; }).length,
      low: analyzedIssues.filter(function(i) { return i.severity === 'low'; }).length
    },
    timestamp: new Date().toISOString(),
    generatedAt: new Date().toLocaleString()
  };

  writeReport(report);
  return report;
}

function writeReport(report) {
  const reportFile = path.join(__dirname, config.dataPath, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to apply all accessibility improvements
function improveAccessibility() {
  fixTableStructure();
  fixLandmarks();
  checkLandmarkElements();
  addSvgAccessibleNames();
  fixFakeLinks();
  replaceButtonIds();
  ensureDependencyGraphAriaRole();
}

// Initialize function
function initialize() {
  appState.initialized = true;
  console.log('Initializing application...');
  isInitialized = true;
  return true;
}

// Some function - merged implementation
function someFunction() {
  return 'some function';
}

// Application main entry point
const app = express();

app.use((req, res, next) => {
  global.appConfig = config;
  next();
});

app.get('/', (req, res) => {
  initialize();
  res.send('Application initialized');
});

app.listen(PORT, HOST, () => {
  console.log(`SERVER RUNNING on http://${HOST}:${PORT}`);
});

// Export the express app instance and all utility functions
module.exports = Object.assign(app, {
  initializeApp: initialize,
  someFunction,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  createInPageButton,
  extractSvgAccessibleName,
  addressAccessibilityIssues,
  importAndExecute,
  analyzeModuleDependencies: analyzeModuleDependenciesLocal,
  visualizeModuleRelationships: visualizeModuleRelationshipsLocal,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  checkLinkAccessibility,
  newExportedFunction,
  ensureUniqueLandmarksLocal,
  ensureUniqueLandmarks,
  validateLandmark,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureDependencyGraphAriaRole,
  improveAccessibility,
  googleSignIn,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  ensureLangAttribute,
  setLanguageAttribute,
  addLangAttribute,
  addBook,
  updateBookListUI,
  getDependencies,
  addDependency,
  removeDependency,
  countDependencies,
  validateInput: validateInputFn,
  processData: processDataFn,
  formatDate,
  helper,
  config,
  CONFIG,
  ACCESSIBILITY_CONFIG,
  appState,
  appData,
  isInitialized
});