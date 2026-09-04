const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const { a11y } = require('@accessible/react');

// Configuration
const appConfig = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
};

// Application configuration (alias for CONFIG)
const config = appConfig;

// Import required modules
const utils = require('./utils');
const axeCore = require('axe-core');
const expressApp = express();
const axeConfig = {
  rules: {
    // Add any axe custom rules needed here, like so:
    // 'custom-rule-name': { enabled: true }
  },
};

// Process and filter landmarks
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

function addLandmarkRolesAndFixIssues() {
  addLandmarkRoles();
  fixLandmarkIssues();
  ensureDependencyGraphAriaRole();
}

// Utility Functions
function isValidLandmark(landmark) {
  return landmark &&
    typeof landmark.id !== 'undefined' &&
    landmark.id !== null;
}

function processLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = document.querySelectorAll('[role="region"], [role="navigation"], main, aside');
    const landmarkIds = elements.map(el => el.id || null);
    return Array.from(new Set(landmarkIds));
  }
  return landmarks;
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id !== 'undefined' && landmark.id !== null) {
      if (!seen.has(landmark.id)) {
        seen.add(landmark.id);
        uniqueLandmarks.push(landmark);
      }
    }
  }

  // Additional uniqueness check for landmark roles
  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarksByRole[role]) {
      console.warn('Duplicate landmark role: ' + role);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return uniqueLandmarks;
}

function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption (from origin/main)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute (from HEAD)
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells (from HEAD)
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return { success: issues.length === 0, issues };
}

function validateTableStructure(table) {
  const allIssues = [];

  // Handle both single table element and array of tables
  const tableArray = Array.isArray(table) ? table : [table];

  tableArray.forEach((tableToScan, index) => {
    // Check for rows (from origin/main)
    const rows = tableToScan.querySelectorAll ? tableToScan.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({ tableIndex: index, issues: ['Table has no rows'] });
    }

    // Validate table accessibility (from HEAD)
    const result = validateTableAccessibility(tableToScan);
    if (!result.success) {
      allIssues.push({ tableIndex: index, issues: result.issues });
    }
  });

  return { success: allIssues.length === 0, issues: allIssues };
}

function validateLandmarkStructure(landmarks) {
  const issues = [];

  // If landmarks array is provided, validate each one (from HEAD)
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.valid) {
        issues.push({ landmarkIndex: index, issues: result.issues });
      }
    });
  } else {
    // Otherwise, check for required landmarks in the DOM (from origin/main)
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
  }

  return { success: issues.length === 0, issues };
}

function scanAccessibility(filePaths) {
  const issues = [];

  // Init a11y scanner
  const a11yInstance = a11y({
    ...axeConfig,
    mode: 'none'
  });

  // Set options for the scanner
  const scanOptions = {
    elements: filePaths,
    options: {},
    runOnly: {
      type: 'Func'
    },
  };

  // Validate the HTML elements for accessibility
  a11yInstance.run(scanOptions).then((response) => {
    // Process the results and add any issues found
    response.data.violations.forEach((violation) => {
      issues.push({
        file: scanOptions.elements[violation.id],
        issues: [violation]
      });
    });
  });

  return issues;
}

function checkLandmarkElement(element) {
  if (!element) return false;
  const role = element.getAttribute('role');
  return role === 'region' || role === 'navigation' || role === 'main' || role === 'banner' || role === 'contentinfo' || role === 'complementary';
}

function fixAccessibilityIssues() {
  // Handle accessibility issues
}

// TODO: Implement new features, such as upgrade logic and additional landmark functions

module.exports = {
  config,
  CONFIG: appConfig,
  initialize: initializeApp,
  main: main,
  helperFunction: utils.helper,
  analyzeAccessibility: scanAccessibility,
  analyzeModuleDependencies: utils.dependencyScanner,
  addLangAttribute,
  addStylingForAccessibility,
  createTable: createAccessibleTable,
  fixTableStructure,
  addMainLandmark,
  setSvgAccessibleNames,
  addProperLandmarkRegions,
  addLandmarkRolesAndFixIssues,
  fixLandmarkIssues,
  ensureDependencyGraphAriaRole,
  getAccessibleLinkProps,
  checkLandmarkElement,
  newFocusTrap,
  addressInsightIssues,
  processLandmarkElements,
  getUniqueLandmarks,
  loadLandmarks: utils.loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  validateLinkAccessibility,
  wrapPrimaryContentInMain,
  handleFakeLinks,
  generateAccessibilityReport,
  checkUserSafety,
  checkSafetyCategories,
  addBook,
  announceBookAdded,
  getBooksList,
  createBookForm,
  generateDependencyReport,
  fixAccessibilityIssues,
  checkUpgradeRequired,
  implementUpgrade: upgradeSystem
};