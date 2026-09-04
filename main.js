Here is the resolved version of the 'main.js' file with both changes merged and syntax errors corrected:

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');
const axe = require('axe-core');

// Application state
let isInitialized = false;
const appData = {};

// Configuration
const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  dataPath: './data',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000
};

const LANDMARK_CONFIG = {
  dataPath: './data',
  maxResults: 100
};

// Express server setup
const app = express();
app.use(express.static('public'));

// Module relationships
let dependencyGraph = {};
const modules = [];

// Routes
app.get('/index', (req, res) => {
  res.send(indexContent);
});

app.get('/dependency_graph', (req, res) => {
  res.send(getDependencyGraph());
});

app.get('/graph', (req, res) => {
  const graph = visualizeModuleRelationships(modules);
  res.json(graph);
});

app.post('/analyze', async (req, res) => {
  try {
    const moduleIds = req.body.modules;
    const results = await analyzeModuleDependencies(moduleIds);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during analysis.' });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  initialise();
});

// Module analysis functions
function visualizeModuleRelationships(modules) {
  // Implementation to be added
  return { modules: modules || [] };
}

function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  // Implementation to be added
  return { dependencies: [] };
}

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraph;
}

// Initialization function
function initialise() {
  // Initialisation logic
  isInitialized = true;
}

// Accessibility functions (merged and adapted)
function getLangAttribute() {
  return navigator.language || navigator.userLanguage;
}

function addLangAttribute() {
  const html = document.documentElement;
  html.setAttribute('lang', getLangAttribute());
}

function logCurrentURL() {
  console.log('Current URL: ' + window.location.href);
}

function validateTableAccessibility(table) {
  accessiblyHelper.validateTableAccessibility(table);
  return true;
}

function validateTableStructure(table) {
  accessiblyHelper.validateTableStructure(table);
  return true;
}

function fixTableStructure(table) {
  accessiblyHelper.fixTableStructure(table);
}

function fixTableAccessibility() {
  accessiblyHelper.fixTableAccessibility();
}

function addMainLandmark() {
  accessiblyHelper.addMainLandmark();
}

function validateLandmark(landmark) {
  return accessiblyHelper.validateLandmark(landmark);
}

function validateLandmarkStructure(landmark) {
  return accessiblyHelper.validateLandmarkStructure(landmark);
}

function validateLandmarkAttributes(landmark) {
  return accessiblyHelper.validateLandmarkAttributes(landmark);
}

function isValidLandmark(landmark) {
  return accessiblyHelper.isValidLandmark(landmark);
}

function loadLandmarks() {
  return accessiblyHelper.loadLandmarks();
}

function processLandmarks(landmarks) {
  return accessiblyHelper.processLandmarks(landmarks);
}

function sortLandmarks(landmarks, ascending = true) {
  return accessiblyHelper.sortLandmarks(landmarks, ascending);
}

function findLandmarkById(landmarks, id) {
  return accessiblyHelper.findLandmarkById(landmarks, id);
}

function ensureUniqueLandmarks(landmarks) {
  return accessiblyHelper.ensureUniqueLandmarks(landmarks);
}

// Accessibility report functions
function writeReport(report) {
  accessiblyHelper.writeReport(report);
}

function generateAccessibilityReport() {
  // Replacement for `processAccessibilityReport()`
  const report = accessiblyHelper.scanAccessibility();
  writeReport(report);
  return report;
}

// Additional helper functions
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
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

// Axe-core scanning
function scanAccessibility() {
  // Replacement for `processAccessibilityReport()`
  const results = axe.run();
  return {
    timestamp: new Date().toISOString(),
    issues: results.violations || []
  };
}

// SVG accessibility helpers
function getSvgAccessibleName(svg) {
  return accessiblyHelper.getSvgAccessibleName(svg);
}

function setSvgAttributes(svg, name) {
  accessiblyHelper.setSvgAttributes(svg, name);
}

function getSvgRole(svgElement) {
  return accessiblyHelper.getSvgRole(svgElement);
}

// Link accessibility helpers
function createInPageButton(targetId, text) {
  return accessiblyHelper.createInPageButton(targetId, text);
}

function validateLinkAccessibility(link) {
  return accessiblyHelper.validateLinkAccessibility(link);
}

function handleFakeLinks() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    accessiblyHelper.handleFakeLinks(link);
  });
}

// Landmark regions
function addLandmarkRegions() {
  accessiblyHelper.addLandmarkRegions();
}

function addProperLandmarkRegions() {
  accessiblyHelper.addProperLandmarkRegions();
}

// Improve accessibility
function improveAccessibility() {
  accessiblyHelper.improveAccessibility();
}

async function fetchUser(id) {
  return new Promise((resolve, reject) => {
    const options = {
      url: CONFIG.apiUrl + '/users/' + id,
      timeout: CONFIG.timeout
    };

    if (options.url) {
      resolve({ id, name: 'User ' + id });
    } else {
      reject(new Error('Failed to fetch user: Invalid URL'));
    }
  });
}

function clearCache() {
  // Implement cache clearing logic
}

module.exports = {
  app,
  visualizeModuleRelationships,
  analyzeModuleDependencies,
  getDependencyGraph,
  initialise,
  getLangAttribute,
  addLangAttribute,
  logCurrentURL,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  fixTableAccessibility,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  writeReport,
  generateAccessibilityReport,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addLandmarkRegions,
  addProperLandmarkRegions,
  improveAccessibility,
  fetchUser,
  clearCache
};
```

This resolved version preserves both changes, keeping the new accessibility report functionality based on axe-core, and the module analysis part. A few minor syntax errors were corrected and the code was formatted for better readability.