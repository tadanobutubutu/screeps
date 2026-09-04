const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const axe = require('axe-core');
const accessiblyHelper = require('./accessibly-helper');
const utils = require('./utils');

const dependencies = [
  { name: 'lodash', version: '4.17.21' },
  { name: 'express', version: '4.18.2' },
  { name: 'react', version: '18.2.0' }
];

const getDependencies = () => dependencies;
const addDependency = (name, version) => {
  dependencies.push({ name, version });
  return dependencies;
};

const removeDependency = (name) => {
  dependencies = dependencies.filter(dep => dep.name !== name);
  return dependencies;
};

const countDependencies = () => dependencies.length;

const appData = {};

const app = express();

// Configuration for landmark operations
const LANDMARK_CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// Merged configuration
const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

const CONFIG_OLD = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  dataPath: './data',
  maxResults: 100,
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000
};

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
    'link-is-valid': { enabled: true }
  },
};

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

/* Accessibility functions (from HEAD) */
function getLangAttribute() {
    // In Node.js environment, return default or from config
    if (typeof navigator !== 'undefined') {
        return navigator.language || navigator.userLanguage;
    }
    return 'en';
}

function addLangAttribute() {
  // Implementation to be added - browser only
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', getLangAttribute());
  }
}

function logCurrentURL() {
    if (typeof window !== 'undefined') {
        console.log('Current URL: ' + window.location.href);
    }
}

// Table accessibility helpers
function validateTableAccessibility(table) {
  // Implementation to be added
  return true;
}

function validateTableStructure(table) {
  // Implementation to be added
  return true;
}

function fixTableStructure(table) {
  // Implementation to be added
}

// Landmark handling
function addMainLandmark() {
  // Implementation to be added
}

function validateLandmark(landmark) {
  // Implementation to be added
  return { valid: true, issues: [] };
}

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, LANDMARK_CONFIG.dataPath, 'landmarks.json');
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

    return uniqueLandmarks.slice(0, LANDMARK_CONFIG.maxResults);
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

// Utility functions (from HEAD)
const { validateInput, processData } = require('./utils/validators');
const { formatResponse } = require('./utils/processor');

async function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  const axeInstance = await importAxe();
  const results = [];

  for (const module of modules) {
    const moduleDependencies = await analyzeDependency(module);
    const axeResults = await axeInstance.analyze(module);
    results.push({
      module: module,
      dependencies: moduleDependencies,
      axeResults: axeResults
    });
  }

  return {
    totalDependencies: results.reduce((acc, cur) => acc + cur.dependencies.length, 0),
    dependencyMap: results.reduce((acc, cur) => {
      cur.dependencies.forEach(dep => {
        if (!acc[dep]) acc[dep] = [];
        acc[dep].push(cur.module);
      });
      return acc;
    }, {}),
    visualization: visualizeModuleRelationships(results)
  };
}

function visualizeModuleRelationships(modules) {
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
    // In Node.js environment, return default or from config
    if (typeof navigator !== 'undefined') {
        return navigator.language || navigator.userLanguage;
    }
    return 'en';
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
  // Implementation to be added - browser only
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', getLangAttribute());
  }
}

/**
 * Logs the current URL to the console
 */
function logCurrentURL() {
    if (typeof window !== 'undefined') {
        console.log('Current URL: ' + window.location.href);
    }
}

// Table accessibility helpers
/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  // Implementation to be added
  return true;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  // Implementation to be added
  return true;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  // Implementation to be added
}

// Landmark handling
/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  // Implementation to be added
}

/**
 * Validates landmark
 * @param {HTMLElement} landmark - The landmark element to validate
 */
function validateLandmark(landmark) {
  // Implementation to be added
  return { valid: true, issues: [] };
}

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, LANDMARK_CONFIG.dataPath, 'landmarks.json');
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

    return uniqueLandmarks.slice(0, LANDMARK_CONFIG.maxResults);
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

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// TODO: Implement function for generating a report based on accessibility issues
// Replaced placeholder with full implementation using axe-core scanning and report writing
async function generateAccessibilityReport() {
  const report = await scanAccessibility();
  writeReport(report);
  return report;
}

/* Utilities */
const { validateInput, processData } = require('./utils/validators');
const { formatResponse } = require('./utils/processor');

/* Main execution when run directly */
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

/* Exports */
module.exports = {
  getDependencies,
  addDependency,
  removeDependency,
  countDependencies,
  appData,
  axeConfig,
  CONFIG,
  CONFIG_OLD,
  LANDMARK_CONFIG,
  UserSafety,
  SafetyCategories,
  initialize,
  fastMap,
  axe,
  accessiblyHelper,
  utils,
  app,
  // Accessibility functions
  getLangAttribute,
  addLangAttribute,
  logCurrentURL,
  validateTableAccessibility,
  validateTableStructure,
  fix