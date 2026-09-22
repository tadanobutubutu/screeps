const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./landmark.js'); // Import Landmark module

// Import the new function
const createInPageButton = require('./createInPageButton');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Function to create in-page buttons (from createInPageButton.js)

// Placeholder for the affected SVGs
const icons = {};

function processLandmarks(landmarks) {
  // Ensure all landmarks have valid structure
  const landmarkStructureCheck = (landmark) => {
    // Check landmark properties here
    // ...
    return true; // Add your own check logic
  };

  const validLandmarks = landmarks.filter(landmarkStructureCheck);

  // Ensure the landmarks are unique
  const ensureUniqueLandmarks = (landmarks) => {
    // Add your own unique landmark logic here
    // ...
    return landmarks;
  };

  return ensureUniqueLandmarks(validLandmarks);
}

function addLangAttribute(htmlElement, lang = 'en') {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('Invalid HTML element provided');
    return;
  }

  if (lang) {
    htmlElement.lang = lang; // Default to English if not specified
  }
}

// Function to check if the specified landmark element is in the document.
// @param {string} id - The ID of the landmark element.
// @returns {boolean} Returns true if the element exists; otherwise, false.
function checkLandmarkElement(id) {
  const element = document.querySelector(`#${id}`);
  return element !== null;
}

/**
 * Calculates the sum of an array of numbers.
 * @param {number[]} numbers - The array of numbers to sum.
 * @returns {number} The total sum of the numbers.
 */
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Counts the number of dependencies imported in the current module.
 * It scans the module's source code for `require(...)` and `import ...` statements.
 * @param {string} [source] - Optional source code string. Defaults to the current module's source.
 * @returns {number} The total count of dependencies.
 */
function countDependencies(source) {
  const code = typeof source === 'string' ? source : require('fs').readFileSync(__filename, 'utf8');

  // Match CommonJS require() calls (single-line)
  const requireMatches = code.match(/require\(['"][^'"]+['"]\)/g) || [];

  // Match ES module import statements (single-line and multi-line)
  const importMatches = code.match(/^\s*import\s.+?from\s+['"][^'"]+['"];?/gm) || [];

  // Also match side-effect imports like import './styles.css';
  const sideEffectImports = code.match(/^\s*import\s+['"][^'"]+['"];?/gm) || [];

  // Combine and deduplicate based on the module specifier
  const seen = new Set();

  requireMatches.forEach((match) => {
    const specifier = match.match(/require\(['"]([^'"]+)['"]\)/);
    if (specifier) seen.add(specifier[1]);
  });

  importMatches.forEach((match) => {
    const specifier = match.match(/from\s+['"]([^'"]+)['"]/);
    if (specifier) {
      seen.add(specifier[1]);
    } else {
      const sideEffect = match.match(/import\s+['"]([^'"]+)['"]/);
      if (sideEffect) seen.add(sideEffect[1]);
    }
  });

  sideEffectImports.forEach((match) => {
    const specifier = match.match(/import\s+['"]([^'"]+)['"]/);
    if (specifier) seen.add(specifier[1]);
  });

  return seen.size;
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  countDependencies
};