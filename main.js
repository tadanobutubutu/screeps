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
  fixFakeLinks as externalFixFakeLinks,
  ensureUniqueLandmarks as externalEnsureUniqueLandmarks,
  addLandmarkRoles as externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons
} = require('./accessibility-improvements');

const config = {
  dataPath: 'data',
  maxResults: 100
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

const pagesDir = 'pages';
let dependencyGraph = null;

// DOM-based unique landmarks
function ensureUniqueLandmarksDOM() {
  const seenIds = new Set();
  const seenRoles = new Map();

  const landmarks = document.querySelectorAll(...landmarkSelectors);

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();

    // Ensure unique ID
    if (!landmark.id) {
      let id = role;
      let counter = 1;
      while (seenIds.has(id)) {
        id = `${role}-${counter++}`;
      }
      landmark.id = id;
      seenIds.add(id);
    } else {
      seenIds.add(landmark.id);
    }

    // Track roles for uniqueness
    if (!seenRoles.has(role)) {
      seenRoles.set(role, []);
    }
    seenRoles.get(role).push(landmark);
  });

  // Ensure only one main landmark
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length > 1) {
    for (let i = 1; i < mainLandmarks.length; i++) {
      mainLandmarks[i].setAttribute('aria-hidden', 'true');
    }
  }
}

// Helper function to extract SVG accessible names
function extractSvgAccessibleName(svgContent) {
  const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
  const title = svgElement.querySelector('title');
  return title ? title.textContent : 'No accessible name found';
}

// Function to get the language attribute value
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Function to validate table accessibility
function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  // ... (existing function implementation)
}

// Function to validate table structure
function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  // ... (existing function implementation)
}

function validateLandmark() {
  // Implementation for landmark validation
}

function validateLandmarkStructure() {
  // DOM-specific landmark structure validation
}

function validateLinkAccessibility() {
  // Link accessibility validation
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

function personName() {
  // Person name accessibility handling
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

// Function to address accessibility issues
function addressAccessibilityIssues() {
  ensureUniqueLandmarksDOM();

  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }

  const tables = document.querySelectorAll('table');
  tables.forEach(table => validateTableAccessibility(table));
  tables.forEach(table => validateTableStructure(table));

  validateLandmark();
  validateLandmarkStructure();

  validateLinkAccessibility();

  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = extractSvgAccessibleName(svg.outerHTML);
    if (accessibleName) {
      setSvgAttributes(svg, accessibleName);
    }
  });

  personName();
  handleFakeLinks();
  if (typeof handleAccessibilityIssues === 'function') {
    handleAccessibilityIssues();
  }
}

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility() {
  const filePaths = await fs.promises.readdir(pagesDir);
  const issues = [];

  for (const filePath of filePaths) {
    const fullPath = path.join(pagesDir, filePath);
    const { violations } = await axe.analyze(fullPath);

    if (violations.length > 0) {
      issues.push({
        file: filePath,
        issues: violations,
      });
    }
  }

  return issues;
}

// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphRole(container) {
  if (!container) return;
  if (!container.hasAttribute('role')) {
    container.setAttribute('role', 'graphics-document');
  }
  if (!container.hasAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Dependency graph');
  }
}

async function renderFunction1() {
  // Existing functionality
  const moduleAReturnValue = await accessiblyHelper();
  const moduleBReturnValue = await anotherHelper();

  // Function to create in-page buttons
  function createInPageButton(buttonText, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.onclick = onClickHandler;
    return button;
  }

  // Example usage (if needed):
  // const btn = createInPageButton('Click Me', () => console.log('Clicked'));
  // ...
}

async function renderFunction2() {
  // Existing functionality
  const moduleAReturnValue = await accessiblyHelper();
  const moduleBReturnValue = await anotherHelper();

  // Helper functions moved to a separate file (preserved references)
  // ... (additional helper function calls if needed)
}

async function harvest() {
  // TODO: Implement harvest logic
  try {
    const report = await scanAccessibility();
    const harvestedData = {
      timestamp: new Date().toISOString(),
      pagesScanned: report.length,
      totalIssues: report.reduce((acc, curr) => acc + curr.issues.length, 0),
      details: report
    };

    // Store harvested data for potential upgrades
    const harvestFile = path.join(__dirname, 'harvest_data.json');
    fs.writeFileSync(harvestFile, JSON.stringify(harvestedData, null, 2));

    return harvestedData;
  } catch (error) {
    console.error('Harvest failed:', error);
    throw error;
  }
}

async function upgrade(harvestedData) {
  // TODO: Implement upgrade logic
  try {
    const data = harvestedData || (() => {
      const harvestFile = path.join(__dirname, 'harvest_data.json');
      if (fs.existsSync(harvestFile)) {
        return JSON.parse(fs.readFileSync(harvestFile, 'utf8'));
      }
      return null;
    })();

    if (!data) {
      throw new Error('No harvested data available for upgrade');
    }

    // Analyze harvested issues and create upgrade recommendations
    const upgradePlan = { improvements: [] };
    if (data.details && data.details.length > 0) {
      data.details.forEach(page => {
        page.issues.forEach(violation => {
          upgradePlan.improvements.push({
            file: page.file,
            rule: violation.id,
            impact: violation.impact,
            description: violation.description,
            recommendation: `Fix ${violation.id} issue in ${page.file}`
          });
        });
      });
    }

    // ... (remaining upgrade logic)
    return upgradePlan;
  } catch (error) {
    console.error('Upgrade failed:', error);
    throw error;
  }
}

// Combined harvest and upgrade workflow
async function harvestAndUpgrade() {
  // TODO: Implement harvest and upgrade logic
  const harvested = await harvest();
  const upgraded = await upgrade(harvested);
  return { harvested, upgraded };
}

// New function to add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Validation functions
const validateLandmarkStructure = (landmarks) => {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];

  landmarks.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');

    if (role && !validLandmarks.includes(role)) {
      issues.push(`Element at index ${index} has invalid role "${role}"`);
    }
  });

  return { valid: issues.length === 0, issues };
};

const validateLandmarkAttributes = (landmark) => {
  if (!landmark || !landmark.attributes) {
    return false;
  }
  return true;
};

const addMainLandmark = () => {
  // Code for adding main landmark
};

// Additional utility functions
const renderDependencyGraphContent = () => {
  // Render dependency graph content
};

const createInPageButtons = () => {
  // Create multiple in-page buttons
};

const generateAccessibilityReport = (issuesData) => {
  // Generate accessibility report
  // Implementation would go here
};

// Landmark processing utilities
const isValidLandmark = landmark => landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;

const loadLandmarks = () => {
  try {
    const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
};

const processLandmarks = (landmarks) => {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = externalEnsureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
};

const ensureUniqueLandmarks = (landmarks) => {
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
};

// Function to set language attribute on the document
const setLanguageAttribute = () => {
  document.documentElement.lang = 'en';
};

// Function to add landmark roles to main containers
const addLandmarkRoles = () => {
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }
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

// Application state
appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

// Helper function
const initialize = () => {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);

  // Ensure the dependencyGraph container has a proper ARIA role
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

  // Set up keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Call accessibility helper functions
  setLanguageAttribute();
  addLandmarkRoles();
  externalFixFakeLinks();

  // Address accessibility issues
  addressAccessibilityIssues();

  // Create the in-page button
  createInPageButton('Default Button', () => {});

  // Add accessible names to 2 SVGs
  addSvgAccessibleNames('svg1Id', 'svg2Id', 'Label for SVG1', 'Label for SVG2');

  // Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks(landmarks);

  // Fix 1 fake link issue
  fixFakeLinks();

  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }

  appState.initialized = true;
};

/**
 * Validates link accessibility by checking for accessible names
 * @param {string} text - Link text
 * @param {string} ariaLabel - aria-label attribute
 * @returns {Object} Validation result with valid flag and issues array
 */
function validateLinkAccessibility(text, ariaLabel) {
  const issues = [];

  if (!text && !ariaLabel) {
    issues.push('Link has no accessible name (no text or aria-label)');
  }

  // Check for meaningful text
  if (text && (text === 'click here' || text === 'read more' || text === 'learn more')) {
    issues.push(`Link text "${text}" is not descriptive`);
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Handles fake links by converting them to proper buttons or adding accessibility attributes.
 */
function handleFakeLinks(container) {
  const issues = [];
  const elements = container ? container.querySelectorAll('a:not([href]), button') : document.querySelectorAll('a:not([href]), button');

  elements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'a' && !element.getAttribute('href') && !element.getAttribute('onclick')) {
      issues.push(`Element at index ${index} is an anchor without href or onclick`);
    }

    if (tagName === 'button' && element.querySelector('a')) {
      issues.push(`Button at index ${index} contains an anchor element`);
    }
  });

  return issues;
}

/**
 * Generates an accessibility report based on axe-core scanning results
 * @param {Object} axeResults - Results from axe-core scan
 * @returns {string} Formatted accessibility report
 */
function generateAccessibilityReport(axeResults) {
  if (!axeResults || !axeResults.violations) {
    return 'No accessibility issues found or invalid results format';
  }

  let report = `Accessibility Report\n`;
  report += `====================\n\n`;
  report += `Total violations: ${axeResults.violations.length}\n\n`;

  axeResults.violations.forEach((violation, index) => {
    report += `Violation ${index + 1}: ${violation.id}\n`;
    report += `Description: ${violation.description}\n`;
    report += `Impact: ${violation.impact}\n`;
    report += `Elements affected: ${violation.nodes.length}\n`;

    if (violation.nodes.length > 0) {
      report += `Sample affected elements:\n`;
      violation.nodes.slice(0, 3).forEach(node => {
        report += `- ${node.target.join(' > ')}\n`;
      });

      if (violation.nodes.length > 3) {
        report += `- ...and ${violation.nodes.length - 3} more\n`;
      }
    }

    report += `Help: ${violation.help}\n`;
    report += `Help URL: ${violation.helpUrl}\n\n`;
  });

  return report;
}

/**
 * Writes accessibility report to a file
 * @param {string} report - The accessibility report content
 * @param {string} filePath - Path to save the report
 */
function writeAccessibilityReport(report, filePath = 'accessibility-report.txt') {
  try {
    fs.writeFileSync(filePath, report, 'utf8');
    console.log(`Accessibility report successfully written to ${filePath}`);
  } catch (error) {
    console.error('Error writing accessibility report:', error.message);
  }
}

// Export all functions that need to be available
module.exports = {
  appState,
  initialize,
  scanAccessibility,
  writeReport: generateAccessibilityReport,
  renderDependencyGraph: renderDependencyGraphContent,
  checkLandmarkElement: validateLandmarkAttributes,
  landmarkStructureCheck: validateLandmarkStructure,
  wrapPrimaryContentInMain: addMainLandmark,
  main: initialize,
  generateAccessibilityReport,
  processLandmarks,
  loadLandmarks,
  harvest,
  upgrade,
  harvestAndUpgrade,
  ensureUniqueLandmarksDOM,
  extractSvgAccessibleName,
  addressAccessibilityIssues,
  ensureDependencyGraphRole,
  validateLinkAccessibility,
  handleFakeLinks,
  writeAccessibilityReport
};