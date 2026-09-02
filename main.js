const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000
};

// Application state
let isInitialized = false;
const appData = {};

// App state with accessibility updates
const appState = {
  initialized: false,
  data: null,
  cache: {},
  lang: 'en'
};

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Initialize function
function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

// Initialize app function
function initializeApp() {
  initialize();
  return appState;
}

// Fetch user function
async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Helper function
function someFunction() {
  return 'some value';
}

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Application main entry point
const app = express();

// Helper functions moved to a separate file (preserved references)
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./accessibility-improvements');

// Helper function to validate landmark structure
function getLangAttribute() {
  return document.documentElement.getAttribute('lang');
}

// Helper function to load landmarks
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

// Helper function to process landmarks
function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(validateInput);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// New functions to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Helper functions from both versions
function createInPageButton() {
  // Implementation of createInPageButton function
  const button = document.createElement('button');
  button.textContent = 'Accessibility Info';
  button.setAttribute('aria-label', 'Show accessibility information');
  document.body.appendChild(button);
}

function extractSvgAccessibleName(svgContent) {
  const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
  const title = svgElement.querySelector('title');
  return title ? title.textContent : 'No accessible name found';
}

// IMPLEMENTATION: Upgrade logic for accessibility issues (from one of the changes)
function addressAccessibilityIssues() {
  // Check if axe-core is available and run accessibility audits
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
      
      // Process and categorize the issues
      const violations = results.violations || [];
      const passes = results.passes || [];
      const incomplete = results.incomplete || [];
      
      // Create an accessibility report
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
      
      // Write the report to a file
      writeReport(report);
      
      // Log summary
      console.log(`Accessibility audit completed: ${violations.length} violations found`);
      console.log(`Passes: ${passes.length}, Incomplete checks: ${incomplete.length}`);
      
      // Return the report for further processing
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

// Helper function for module import and execution
function importAndExecute(modulePath, functionName, callback) {
  require(modulePath)[functionName](callback);
}

// Configuration - merged
const config = CONFIG;

// Helper functions from the safe version
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
    
    const key = `${landmark.id}-${landmark.type || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLandmarks.push(landmark);
    }
  }
  
  return uniqueLandmarks;
}

// IMPLEMENTATION: Ensure an element has an ID attribute
function ensureElementHasId(element, id) {
    if (!element.id) {
        element.id = id;
    }
    return element;
}

/**
 * Adds an aria-label to an element if it doesn't have one
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label to add
 * @returns {HTMLElement} The element with aria-label
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
    return element;
}

// IMPLEMENTATION: Function to analyze module dependencies (local version)
function analyzeModuleDependenciesLocal(modules) {
  // Implementation would analyze and return dependency relationships
  console.log('Analyzing dependencies for modules:', modules);
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

// IMPLEMENTATION: Function to visualize module relationships (local version)
function visualizeModuleRelationshipsLocal(modules) {
  // Implementation would create a visual representation of module relationships
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

// Helper functions from the unsafe version
function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

// New function to handle module configuration and version upgrades
function upgradeModule(moduleName, version) {
  const upgrades = {
    'accessibility-improvements': {
      '1.0': {
        description: 'Initial release',
        changes: ['Added basic accessibility checks']
      },
      '2.0': {
        description: 'Enhanced accessibility with improved error handling',
        changes: [
          'Added comprehensive rule checking',
          'Implemented detailed reporting',
          'Improved performance with lazy loading'
        ]
      },
      '3.0': {
        description: 'Major upgrade with advanced accessibility features',
        changes: [
          'Added ARIA label validation',
          'Implemented landmark structure validation',
          'Added support for dynamic content analysis'
        ]
      }
    },
    'main': {
      '1.0': {
        description: 'Initial release',
        changes: ['Added basic application structure']
      },
      '2.0': {
        description: 'Enhanced with accessibility support',
        changes: [
          'Added accessibility audit functions',
          'Implemented upgrade logic',
          'Added comprehensive error handling'
        ]
      }
    }
  };
  
  const moduleUpgrades = upgrades[moduleName] || {};
  const currentVersionInfo = moduleUpgrades[version] || { description: 'Unknown version', changes: [] };
  
  console.log(`Upgrading module: ${moduleName} to version ${version}`);
  console.log(`Changes: ${currentVersionInfo.changes.join(', ')}`);
  
  // Return upgrade information for potential further processing
  return {
    module: moduleName,
    version: version,
    description: currentVersionInfo.description,
    changes: currentVersionInfo.changes,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  initializeApp,
  fetchUser,
  clearCache,
  someFunction,
  loadLandmarks,
  processLandmarks,
  createInPageButton,
  extractSvgAccessibleName,
  addressAccessibilityIssues,
  importAndExecute,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  upgradeModule
};