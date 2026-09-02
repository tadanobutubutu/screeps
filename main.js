const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFromUtils
} = require('./utils');

const landmarkSelectors = [
  'main',
  '[role="main"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="search"]',
  'nav',
  '[role="region"]',
  'aside',
  ...require('./utils/landmarkRoles')
];

const books = [];
const safetyCategory = "User Safety: safe";

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let icons = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

const utils = require('./utils');

const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues,
  ...accessibilityUtils
} = require('./accessibility-utils');

// Merged configuration from both branches
const mergedConfig = {
  ...config,
  ...CONFIG,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true
};

// Landmark configuration
const landmarkConfig = {
  main: 'main',
  banner: 'banner',
  contentInfo: 'contentinfo',
  search: 'search',
  navigation: 'navigation',
  region: 'region',
  aside: 'aside',
  header: 'header',
  footer: 'footer'
};

// App data
const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// ===== Utility Functions =====

function getLangAttribute() {
  if (document && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function getFullLangAttribute() {
  return document.documentElement.lang || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
}

function setLanguageAttribute() {
  if (document && document.documentElement) {
    document.documentElement.lang = getLangAttribute();
  }
}

function addLangAttribute(html) {
  if (typeof html !== 'string') return html;

  const landmarkRoles = [...new Set([...landmarkSelectors, ...accessibilityUtils.landmarkRoles])];

  landmarkRoles.forEach(role => {
    const pattern = new RegExp(`role=["']${role}["']`, 'gi');
    const matches = html.match(pattern);
    if (matches && matches.length > 1) {
      let count = 0;
      html = html.replace(pattern, (match) => {
        count++;
        if (count === 1) return match;
        return `role="landmark_${role}_${count}"`;
      });
    }
  });

  const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  html5Landmarks.forEach(tag => {
    const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
    const matches = html.match(pattern);
    if (matches && matches.length > 1) {
      let count = 0;
      html = html.replace(pattern, (match) => {
        count++;
        if (count === 1) return match;
        return match.replace(`<${tag}`, `<${tag} role="region"`);
      });
    }
  });

  return html;
}

// ===== Landmark Functions =====

function validateLandmark(landmark) {
  const errors = [];
  const role = landmark && landmark.role;
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
  if (role && !validLandmarks.includes(role)) {
    errors.push('Invalid landmark role: ' + (role || 'undefined'));
  }
  return errors;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));

  for (const landmark of landmarks) {
    if (!landmark.id && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      return false;
    }
  }

  return true;
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(landmark.id)) {
      return false;
    }
    seen.add(landmark.id);
    return true;
  });
}

function ensureUniqueLandmarksLocal(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      return true;
    }
    return false;
  });
}

function ensureUniqueLandmarksDOM(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(landmark.id)) {
      return false;
    }
    seen.add(landmark.id);
    return true;
  });
}

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = Array.from(document.querySelectorAll(landmarkSelectors.join(',')));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-labelledby'));
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

function isValidLandmark(landmark) {
  return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
}

function validateLandmarkObject(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function ensureLandmarkLabel(landmark) {
  if (landmark.name) {
    return landmark.name.charAt(0).toUpperCase() + landmark.name.slice(1);
  }
  return 'Landmark';
}

function addLandmarkRoles() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach(el => {
      if (!el.id) {
        el.id = `landmark-${role}`;
      }
    });
  });
}

function addLandmarkRolesToContainers() {
  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
    return mainElement;
  }
  return null;
}

// ===== Table Accessibility Functions =====

function validateTableAccessibility(tableElement) {
  if (!tableElement) {
    console.warn('Table missing caption');
    return false;
  }

  const issues = [];
  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && !cell.getAttribute('scope')) {
      issues.push(cell);
    }
  }

  return issues.length === 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('th, td');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.getAttribute('scope')) {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

function fixTableStructure(html) {
  if (typeof html !== 'string') return html;

  const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
  const tables = html.match(tablePattern);

  if (tables) {
    tables.forEach(table => {
      const headerPattern = /<thead[^>]*>[\s\S]*?<\/thead>/i;
      const hasHeader = headerPattern.test(table);

      if (!hasHeader) {
        const firstRowPattern = /<tr[^>]*>[\s\S]*?<\/tr>/i;
        const firstRow = table.match(firstRowPattern)[0];
        const modifiedTable = table.replace(firstRowPattern, `<thead>${firstRow}</thead>\n$&`);
        html = html.replace(table, modifiedTable);
      }
    });
  }

  return html;
}

// ===== SVG Accessibility Functions =====

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent;
  }

  return svgElement.getAttribute('aria-label') || '';
}

function extractSvgAccessibleName(svgContent) {
  const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
  const title = svgElement.querySelector('title');
  return title ? title.textContent : 'No accessible name found';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
  return svg;
}

function setSvgAccessibleNames(id1, id2, label1, label2) {
  const svg1 = document.getElementById(id1);
  const svg2 = document.getElementById(id2);

  if (svg1) {
    svg1.setAttribute('aria-label', label1);
  }
  if (svg2) {
    svg2.setAttribute('aria-label', label2);
  }
}

function addSvgAccessibilityProps(svgElement, label, labelledById) {
  if (!svgElement) return;

  const props = getSvgAccessibilityProps(label, labelledById);

  Object.keys(props).forEach(prop => {
    svgElement.setAttribute(prop, props[prop]);
  });
}

function getSvgAccessibilityProps(label, labelledById) {
  const props = {};
  if (label) {
    props['aria-label'] = label;
  }
  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }
  return props;
}

function addSvgAccessibleNames() {
  // Implementation from utils
}

// ===== Link Accessibility Functions =====

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href]');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function fixFakeLinks(html) {
  if (typeof html !== 'string') return html;

  const fakeLinkPattern = /class="fake-link"[^>]*>/gi;
  return html.replace(fakeLinkPattern, 'role="button" $&');
}

function fixFakeLink() {
  const fakeLink = document.querySelector('.fake-link');
  if (fakeLink) {
    fakeLink.setAttribute('role', 'button');
  }
}

function getAccessibleLinkProps(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

// ===== Button Functions =====

function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'Accessibility Info';
  button.setAttribute('aria-label', 'Show accessibility information');
  if (onClickHandler) {
    button.addEventListener('click', onClickHandler);
  }
  document.body.appendChild(button);
  return button;
}

function createInPageButton(buttonText, onClickHandler) {
  return {
    button: {
      onClick: onClickHandler,
      lang: getLangAttribute(),
      text: buttonText
    }
  };
}

// ===== Accessibility Scanning =====

function addressAccessibilityIssues() {
  if (typeof axe !== 'undefined') {
    const options = {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
        'heading-structure': { enabled: true },
        'landmark-navigation': { enabled: true }
      }
    };

    axe.run(document, options).then(results => {
      console.log('Accessibility audit results:', results);

      const violations = results.violations || [];
      const passes = results.passes || [];
      const incomplete = results.incomplete || [];

      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        violations: violations.map(violation => ({
          id: violation.id,
          description: violation.description,
          help: violation.help,
          impact: violation.impact,
          nodes: violation.nodes.map(node => ({
            html: node.html,
            target: node.target,
            impact: node.impact,
            message: node.message
          }))
        })),
        passes: passes.map(passing => ({
          id: passing.id,
          description: passing.description,
          help: passing.help
        })),
        incomplete: incomplete.map(item => ({
          id: item.id,
          description: item.description,
          help: item.help,
          impact: item.impact
        }))
      };

      writeReport(report);

      console.log(`Accessibility audit completed: ${violations.length} violations found`);
      console.log(`Passes: ${passes.length}, Incomplete checks: ${incomplete.length}`);

      return report;
    }).catch(error => {
      console.error('Accessibility audit failed:', error);
      return null;
    });
  } else {
    console.warn('axe-core is not available. Please install axe-core for accessibility testing.');
    return null;
  }
}

function handleAccessibilityIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(function(table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(function(landmark) {
    validateLandmark(landmark);
  });

  ensureUniqueLandmarks([]);

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(function(svg) {
    getSvgAccessibleName(svg);
  });
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
}

async function scanAccessibilityFilePaths(filePaths) {
  const issues = [];

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

  return issues;
}

function analyzeAccessibility(issuesData) {
  return issuesData;
}

function generateAccessibilityReport(issuesData) {
  const report = {
    introduction: 'Accessibility report for the application',
    data: issuesData,
    conclusions: ''
  };

  writeReport(report);
  return report;
}

function generateAccessibilityReportLocal(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);

  const report = {
    introduction: 'Accessibility report for the application',
    data: analyzedIssues,
    conclusions: ''
  };

  writeReport(report);
  return report;
}

// ===== Dependency Graph Functions =====

function ensureDependencyGraphRole(container) {
  if (!container) return;
  if (container.getAttribute('role') !== 'graph') {
    container.setAttribute('role', 'tree');
  }
  if (!container.getAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Dependency graph');
  }
}

function ensureDependencyGraphAriaRole() {
  const dependencyGraphEl = document.querySelector('#dependencyGraph');
  if (dependencyGraphEl) {
    dependencyGraphEl.setAttribute('role', 'region');
  }
}

function renderDependencyGraphContent() {
  console.log('Rendering dependency graph content');
}

function renderDependencyGraph(data) {
  console.log('Rendering dependency graph with data:', data);
}

function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  return { dependencies: [] };
}

function visualizeModuleRelationships(modules) {
  console.log('Visualizing relationships for modules:', modules);
  return { relationships: [] };
}

// ===== Landmark Loading and Processing =====

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

const processLandmarksLocal = (landmarks) => {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarksLocal(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
};

function getLandmarkById(landmarks, id) {
  return landmarks.find(landmark => landmark.id === id) || null;
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

// ===== Sorting Functions =====

const sortByTitle = (a, b) => {
  const titleA = a.title ? a.title.toLowerCase() : '';
  const titleB = b.title ? b.title.toLowerCase() : '';
  return titleA.localeCompare(titleB);
};

const sortByAuthor = (a, b) => {
  const authorA = a.author ? a.author.toLowerCase() : '';
  const authorB = b.author ? b.author.toLowerCase() : '';
  return authorA.localeCompare(authorB);
};

// ===== Application State and Initialization =====

function initialize() {
  console.log('Initializing application...');

  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;

    const appData = {
      title: 'Screeps',
      version: CONFIG.version || '1.0.0'
    };

    setLanguageAttribute();
    wrapPrimaryContentInMain();
    addLandmarkRolesToContainers();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    addLandmarkRoles();
    handleFakeLinks();

    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    if (dependencyGraph) {
      if (!dependencyGraph.id) {
        dependencyGraph.id = 'dependencyGraph';
      }
      if (!dependencyGraph.hasAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
      if (!dependencyGraph.hasAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
      }
    }
  }
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

// ===== Report Writing =====

function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// ===== User Safety and Books =====

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

// ===== Data Harvesting =====

function harvestData() {
  return 'Example data collected';
}

async function harvest() {
  return harvestData();
}

async function upgrade(harvestedData) {
  return harvestedData;
}

async function harvestAndUpgrade() {
  const data = await harvest();
  return await upgrade(data);
}

function applyAccessibilityFixes(html) {
  let result = html;
  result = addLangAttribute(result);
  result = fixTableStructure(result);
  result = fixFakeLinks(result);
  result += `<div id="collected-data">${harvestData()}</div>`;
  return result;
}

// ===== Module Import Helper =====

function importAndExecute(modulePath, functionName, callback) {
  require(modulePath)[functionName](callback);
}

// ===== ARIA Helpers =====

function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// ===== User and Cache Functions =====

function fetchUser(userId) {
  return { id: userId, name: 'User' };
}

function clearCache() {
  appState.cache.clear();
}

function someFunction() {
  return 'some value';
}

async function accessiblyHelper(...args) {
  return args;
}

// ===== Exports =====

module.exports = {
  // Configuration
  CONFIG,
  config: mergedConfig,
  appState,
  appData,
  landmarkConfig,
  landmarkSelectors,
  landmarkRoles,

  // Language functions
  getLangAttribute,
  getFullLangAttribute,
  setLanguageAttribute,
  addLangAttribute,

  // Landmark functions
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  ensureUniqueLandmarksLocal,
  ensureUniqueLandmarksDOM,
  getUniqueLandmarks,
  isValidLandmark,
  validateLandmarkObject,
  checkLandmarkElement,
  ensureElementHasId,
  ensureLandmarkLabel,
  addLandmarkRoles,
  addLandmarkRolesToContainers,
  addLandmarkRegions,
  wrapPrimaryContentInMain,

  // Table functions
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,

  // SVG functions
  getSvgAccessibleName,
  extractSvgAccessibleName,
  setSvgAttributes,
  setSvgAccessibleNames,
  addSvgAccessibilityProps,
  getSvgAccessibilityProps,

  // Link functions
  validateLinkAccessibility,
  handleFakeLinks,
  fixFakeLinks,
  fixFakeLink,
  getAccessibleLinkProps,
  createAccessibleLink,

  // Button functions
  createInPageButton,

  // Accessibility scanning
  addressAccessibilityIssues,
  handleAccessibilityIssues,
  scanAccessibility,
  scanAccessibilityFilePaths,
  analyzeAccessibility,
  generateAccessibilityReport,
  generateAccessibilityReportLocal,

  // Dependency graph
  ensureDependencyGraphRole,
  ensureDependencyGraphAriaRole,
  renderDependencyGraphContent,
  renderDependencyGraph,
  analyzeModuleDependencies,
  visualizeModuleRelationships,

  // Landmark loading
  loadLandmarks,
  processLandmarks,
  processLandmarksLocal,
  getLandmarkById,
  sortLandmarks,

  // Sorting
  sortByTitle,
  sortByAuthor,

  // Initialization
  initialize,
  initializeApp,
  getConfig,
  validateInput,
  processData,

  // Reports
  writeReport,

  // User safety and books
  getUserSafetyAdvice,
  addBook,
  announceBookAdded,
  getBooksList,

  // Data harvesting
  harvestData,
  harvest,
  upgrade,
  harvestAndUpgrade,
  applyAccessibilityFixes,

  // Module helper
  importAndExecute,

  // ARIA helpers
  addAriaLabel,

  // User and cache
  fetchUser,
  clearCache,
  someFunction,
  accessiblyHelper
};