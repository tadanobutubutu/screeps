const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const { a11y } = require('@accessible/react');
const mapCache = new Map();

const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  externalFixFakeLinks,
  externalEnsureUniqueLandmarks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues: addressAccessibilityIssuesFromModule,
  scanAccessibility: scanAccessibilityFromModule,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFromFile,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./accessibility-improvements');

const VALID_LANDMARK_ROLES = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];

// Constants
const safetyCategories = ["Unauthorized Advice", "Dangerous Action", "Potential Scam", "Privacy Risk"];
const books = [];
const safetyCategory = "User Safety: safe";

const landmarkSelectors = [
  'main',
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="contentinfo"]',
  '[role="form"]',
  '[role="search"]',
  'nav',
  '[role="region"]',
  'aside',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'section:not([role])'
].map((selector, index) => ({ selector, priority: index }));

// Configuration
const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data'
};

const accessiblyHelper = async (html, config) => {
  if (typeof axe === 'undefined') {
    throw new Error('axe-core is not loaded. Please include axe-core before running this function.');
  }

  try {
    const options = {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      },
      rules: {
        'color-contrast': { enabled: true },
        'heading-order': { enabled: true },
        'link-name': { enabled: true },
        'button-name': { enabled: true },
        'image-alt': { enabled: true },
        'form-field': { enabled: true },
        'keyboard-access': { enabled: true },
        'focus-order': { enabled: true },
        'region': { enabled: true },
        'page-has-main-content': { enabled: true }
      },
      resultTypes: {
        violations: true,
        passes: true,
        incomplete: true,
        inapplicable: true
      }
    };

    const results = await axe.run(html, options);

    const report = {
      timestamp: new Date().toISOString(),
      url: config.apiUrl || 'unknown',
      violations: results.violations.map(violation => ({
        id: violation.id,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
          impact: node.impact
        }))
      })),
      passes: results.passes.map(pass => ({
        id: pass.id,
        description: pass.description,
        help: pass.help,
        helpUrl: pass.helpUrl,
        nodes: pass.nodes.map(node => ({
          target: node.target,
          html: node.html
        }))
      })),
      incomplete: results.incomplete.map(incomplete => ({
        id: incomplete.id,
        description: incomplete.description,
        help: incomplete.help,
        helpUrl: incomplete.helpUrl,
        nodes: incomplete.nodes.map(node => ({
          target: node.target,
          html: node.html
        }))
      })),
      inapplicable: results.inapplicable.map(inapplicable => ({
        id: inapplicable.id,
        description: inapplicable.description,
        help: inapplicable.help,
        helpUrl: inapplicable.helpUrl
      })),
      testEngine: results.testEngine,
      testRunner: results.testRunner,
      testEnvironmentInfo: results.testEnvironmentInfo,
      summary: {
        violations: results.violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
        total: results.violations.length + results.passes.length + results.incomplete.length + results.inapplicable.length
      },
      config
    };

    return report;
  } catch (error) {
    console.error('Error scanning accessibility:', error);
    return {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

function validateConfig(cfg) {
  const errors = [];
  const role = cfg && cfg.allowedRoles && Array.isArray(cfg.allowedRoles) && cfg.allowedRoles.find(r => r === 'main');
  if (!role) {
    errors.push('Missing "main" role in allowedRoles');
  }
  if (!cfg) {
    errors.push('Configuration is null or undefined');
  }
  if (typeof cfg !== 'object') {
    errors.push('Configuration must be an object');
  }
  return errors;
}

function isValidLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('lang');
  }
  return null;
}

function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

function validateTableAccessibility() { return []; }
function validateTableStructure() { return []; }
function validateLandmarkStructure() { return []; }
function validateLandmarkAttributes() { return []; }
function getSvgAccessibleName() { return []; }
function validateLinkAccessibility() { return []; }
function analyzeAccessibility(issuesData) { return issuesData || []; }
function setLanguageAttribute() { addLangAttribute(); }

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
  const uniqueLandmarks = ensureUniqueLandmarksFromFile(validLandmarks);

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

function handleCredentialResponse(response) {
  if (!response) {
    console.error('No credential response received');
    return null;
  }
  const credential = JSON.parse(response.credential);

  if (!credential || !credential.credential || !credential.clientId) {
    throw new Error('Invalid credential response structure');
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('authCredential', JSON.stringify({
      token: credential.credential,
      clientId: credential.clientId,
      timestamp: Date.now()
    }));
  }

  return credential;
}

// Main initialization function
const initializeApp = () => {
  console.log('Application initialized');

  // Ensure the app is accessible
  if (typeof document !== 'undefined') {
    const mainContent = document.querySelector('[role="main"]') || document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('aria-label', 'Main content area');
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
  }

  // Call accessibility helper functions
  addLangAttribute();
  addLandmarkRoles();
  fixFakeLinks();

  addressAccessibilityIssuesFromModule();

  createInPageButtons();
  addSvgAccessibleNames();

  externalEnsureUniqueLandmarks([]);

  if (a11y && a11y.init) {
    a11y.init();
  }
};

// Scan accessibility using axe-core
async function scanAccessibility(filePaths) {
  const issues = [];

  // Check for lang attribute on HTML element
  addLangAttribute();
  if (typeof document !== 'undefined' && !document.documentElement.getAttribute('lang')) {
    issues.push({
      type: 'REACT_015',
      description: 'HTML element is missing lang attribute',
      severity: 'critical',
      element: 'html'
    });
  }

  const landmarkIssues = validateLandmark();
  if (landmarkIssues && landmarkIssues.errors && landmarkIssues.errors.length > 0) {
    issues.push({
      type: 'REACT_017',
      description: 'Landmark issue',
      severity: 'medium',
      errors: landmarkIssues.errors
    });
  }

  // Check for unique landmarks
  const uniqueLandmarkIssues = ensureUniqueLandmarksFromFile([]);
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

  // Check link accessibility
  const linkIssues = checkLinkAccessibility();
  if (linkIssues) {
    issues.push({
      type: 'REACT_036',
      description: 'Link accessibility issue',
      severity: 'medium'
    });
  }

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

// Generate accessibility report
function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);

  // Check for lang attribute on HTML element
  if (typeof document !== 'undefined' && !document.documentElement.getAttribute('lang')) {
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

// Write report to file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Utility function
const formatResponse = (data) => {
  return JSON.stringify(data, null, 2);
};

const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');

// Express app
const app = express();

app.get('/landmarks', (req, res) => {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  res.json(sorted);
});

// Main function
function main() {
  const initialized = initializeApp();
  if (initialized) {
    console.log('Application started successfully');
  }
  return initialized;
}

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

module.exports = {
  accessiblyHelper,
  validateConfig,
  isValidLandmark,
  scanAccessibility,
  generateAccessibilityReport,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  validateLandmark,
  checkLinkAccessibility,
  ensureDependencyGraphRole,
  handleCredentialResponse,
  initializeApp,
  harvest,
  upgrade,
  harvestAndUpgrade,
  addLangAttribute,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  externalFixFakeLinks,
  externalEnsureUniqueLandmarks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues: addressAccessibilityIssuesFromModule,
  scanAccessibility: scanAccessibilityFromModule,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFromFile,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  VALID_LANDMARK_ROLES,
  config,
  landmarkSelectors,
  safetyCategories,
  books,
  safetyCategory,
  appState: {
    initialized: false,
    data: null,
    cache: {}
  },
  mapCache,
  configRef: config,
  mergedConfig: config,
  config_: config,
  dependencyGraph: null,
  icons: {},
  formatResponse,
  app,
  main,
  utils,
  axe,
  fastMap,
  a11y
};