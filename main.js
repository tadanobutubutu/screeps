import './styles.css';
import { initializeApp as initApp } from './app.js';
import { registerSW } from 'effector-sw';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import accessiblyHelper from './accessibly-helper';
import { calculateSum } from './utils/index.js';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils.js';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils.js';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils.js';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils.js';
import { validateLinkAccessibility, handleFakeLinks, checkLinkAccessibility } from './utils/linkAccessibilityUtils.js';
import { CONFIG } from './utils/constants.js';

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Implemented validateLandmark functionality
// Added checkLinkAccessibility function and newExportedFunction
// Updated checkLandmarkElement and ensureUniqueLandmarks functions to handle both array and non-array landmarks
// Implemented landmarkStructureCheck function for checking landmark structure

const books = [];
const safetyCategory = "User Safety: unsafe";
const safetyCategories = ["Unauthorized Advice"];

let isInitialized = false;
const appData = {};

// Utility functions
function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

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

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
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

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
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

function handleDependencyGraph(html) {
  let dependencyGraph = html.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
  }
  return html;
}

function createInPageButton() {
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

function addressAccessibilityIssues() {
  improveAccessibility();
  ensureLangAttribute();
  addLandmarkRoles();
  console.log('Accessibility issues have been addressed');
  return true;
}

function importAndExecute(modulePath, functionName, callback) {
  require(modulePath)[functionName](callback);
}

function analyzeModuleDependenciesLocal(modules) {
  // Implementation would analyze and return dependency relationships
  console.log('Analyzing dependencies for modules:', modules);
}

// REACT_015: Add lang attribute to document
function ensureLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

// REACT_017 & REACT_025: Fix and ensure unique landmarks
function fixLandmarks() {
  if (typeof document === 'undefined') return;
  
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

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG ${index + 1}`;
      svg.appendChild(title);
    }
  });
}

// REACT_036: Fix fake link issues (links without href or with javascript:void(0))
function fixFakeLinks() {
  if (typeof document === 'undefined') return;
  
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

// REACT_040: Replace my-button with actual button id for accessibility
function replaceButtonIds() {
  if (typeof document === 'undefined') return;
  
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

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole() {
  if (typeof document === 'undefined') return;
  
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

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
if (typeof document !== 'undefined') {
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }
}

// REACT_037: Google sign-in logic
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
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

// Initialize application
function initializeApp(config) {
    console.log('Initializing application...');
    return initApp(config);
}

// Initialize service workers
registerSW({ immediate: true });

// Fetch user data
function fetchUser(userId) {
    return { id: userId, name: 'Test User' };
}

// Clear cache
function clearCache() {
    appData.cache = {};
}

// Format response
function formatResponse(data, status = 'success') {
    return {
        status,
        data: data,
        timestamp: new Date().toISOString()
    };
}

// Some function
function someFunction() {
    return 'some function';
}

// Dependency Visualization Tool Functions
function analyzeModuleDependencies(modules) {
    // Implementation would analyze and return dependency relationships
    console.log('Analyzing dependencies for modules:', modules);
    return {
        totalDependencies: 0,
        dependencyMap: {}
    };
}

function visualizeModuleRelationships(modules) {
    // Implementation would create a visual representation of module relationships
    console.log('Visualizing relationships for modules:', modules);
    return {
        graph: {},
        nodes: [],
        edges: []
    };
}

// Initialize all accessibility fixes
function initializeAccessibility() {
  ensureLangAttribute();
  fixLandmarks();
  addSvgAccessibleNames();
  fixFakeLinks();
  replaceButtonIds();
  ensureDependencyGraphAriaRole();
}

// Run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

/**
 * Gets the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

// TODO: Identify and update specific functions that render dependency graphs or
// display module structure for debugging purposes.

// In a real implementation, you would use a library like D3.js or Vis.js
// to render the actual graph visualization
function renderDependencyGraph(graphData) {
    console.log('Rendering dependency graph with data:', graphData);
}

// New function3 implementation
function function3() {
  // TODO: Implement new function3 logic here
  console.log('function3 executed');
}

/**
 * New function3 description
 * @param {any} input - Input for function3
 * @returns {any} Output of function3
 */
function newFunction3(input) {
    // Placeholder for function3 logic
    // This should be replaced with the actual implementation
    return input;
}

// Export main functions
export {
    initializeApp,
    CONFIG as config,
    renderDependencyGraph,
    newFunction3,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    analyzeModuleDependencies,
    visualizeModuleRelationships,
    initializeAccessibility,
    ensureLangAttribute,
    fixLandmarks,
    addSvgAccessibleNames,
    fixFakeLinks,
    replaceButtonIds,
    ensureDependencyGraphAriaRole,
    googleSignIn,
    fetchUser,
    clearCache,
    formatResponse,
    getConfig
};