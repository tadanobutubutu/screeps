const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const axe = require('axe-core');

const config = require('./config');
const logger = require('./utils/logger');
const accessiblyHelper = require('./accessibly-helper');
const { registerSW } = require('effector-sw');

import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import App from './App';
import * as newFunctions from './newFunctions';

require('./styles.css');
require('./styles.less');

// Utility imports - merged from both branches
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFn,
  addLangAttribute: addLangAttributeFn,
  getLangAttribute: getLangAttributeFn,
  validateTableAccessibility: validateTableAccessibilityFn,
  validateTableStructure: validateTableStructureFn,
  validateLandmarkStructure: validateLandmarkStructureFn,
  validateLinkAccessibility: validateLinkAccessibilityFn,
  handleFakeLinks: handleFakeLinksFn,
  someFunction: someFunctionFn,
  fetchUser: fetchUserFn,
  clearCache: clearCacheFn,
  calculateSum,
  getSvgAccessibleName,
  setSvgAttributes,
  fixTableStructure,
  fixTableHeaderScope,
  addProperLandmarkRegions,
  createAccessibleLink,
  fixFakeLinkIssues
} = require('./utils');

const {
  sortByTitle: sortByTitleLocal,
  sortByAuthor: sortByAuthorLocal,
  generateKey: generateKeyLocal,
  BookItem: BookItemLocal,
  addBook: addBookLocal,
  getLangAttribute: getLangAttributeLocal,
  createInPageButton: createInPageButtonLocal,
  validateTableAccessibility: validateTableAccessibilityLocal,
  validateLandmarkStructure: validateLandmarkStructureLocal,
  getSvgAccessibleName: getSvgAccessibleNameLocal,
  setSvgAttributes: setSvgAttributesLocal,
  ensureUniqueLandmarks: ensureUniqueLandmarksLocal,
  addProperLandmarkRegions: addProperLandmarkRegionsLocal,
  validateLinkAccessibility: validateLinkAccessibilityLocal,
  handleFakeLinks: handleFakeLinksLocal,
  someFunction: someFunctionLocal,
  fetchUser: fetchUserLocal,
  clearCache: clearCacheLocal,
  landmarkStructureCheck
} = require('./somemodule');

const {
  sortByTitle: sortByTitleFn,
  sortByAuthor: sortByAuthorFn,
  generateKey: generateKeyFn,
  BookItem: BookItemFn,
  addBook: addBookFn,
  ...otherBookFunctions
} = require('./bookFunctions');

const {
  setDependencyGraph,
  ...otherReduxActions
} = require('./redux/actions');

const { calculateSum: calculateSumUtil } = require('./utils');
const { getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility: validateTableAccessibilityUtil, validateTableStructure: validateTableStructureUtil } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure: validateLandmarkStructureUtil } = require('./utils/landmarkUtils');
const { getSvgAccessibleName: getSvgAccessibleNameUtil, setSvgAttributes: setSvgAttributesUtil } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility: validateLinkAccessibilityUtil, handleFakeLinks: handleFakeLinksUtil } = require('./utils/linkAccessibilityUtils');
const { checkLinkAccessibility: checkLinkAccessibilityUtil } = require('./utils/linkAccessibilityUtils');
const { CONFIG: CONFIG_CONSTANTS } = require('./utils/constants');

// Configuration - merged
const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    ...CONFIG_CONSTANTS
};

// Application state
const appState = {
    initialized: false,
    data: null,
    cache: {}
};

let isInitialized = false;
let dependencyGraph = null;
const books = [];

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'section:not([role])'
];

const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

const sortByTitle = sortByTitleLocal || sortByTitleFn;
const sortByAuthor = sortByAuthorLocal || sortByAuthorFn;

// Core application initialization
function initializeApp() {
    logger.info('Application starting...');
    appState.initialized = true;
    appState.data = config || {};
    return appState;
}

// User Safety: unsafe
// Safety Categories: PII/Privacy

// This file includes both the accessibility improvements and the dependency visualization tool features.

// REACT_015: Add lang attribute to document
function ensureLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    const lang = document.documentElement.lang || 'en';
    if (!document.documentElement.hasAttribute('lang')) {
      document.documentElement.setAttribute('lang', lang);
    }
  }
}

function addLangAttribute() {
  ensureLangAttribute();
}

function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang || 'en';
  }
  return 'en';
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

function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
    return [];
  }

  const seen = new Set();
  return landmarksArray.map((landmark) => {
    const key = landmark.id + '_' + (landmark.role || 'default');
    if (!seen.has(key)) {
      seen.add(key);
      landmark.id = landmark.id || key;
      landmark = ensureElementHasId(landmark, landmark.id);
      if (!landmark.attributes || !landmark.attributes.aria) {
        landmark.attributes = landmark.attributes || {};
        landmark.attributes.aria = {};
      }
      landmark.attributes.aria.label = ensureLandmarkLabel(landmark);
      return landmark;
    }
    return null;
  }).filter(Boolean);
}

function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function ensureLandmarkLabel(landmark) {
  if (landmark.name) {
    return landmark.name;
  }
  if (landmark.role) {
    return landmark.role.charAt(0).toUpperCase() + landmark.role.slice(1) + ' Landmark';
  }
  return 'Unnamed Landmark';
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  
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

  const ariaLabel = svgElement.getAttribute('aria-label') || '';
  return ariaLabel;
}

function setSvgAttributes(svgElement, label, labelledById) {
  if (!svgElement) return;

  const props = getAriaProps(label, labelledById);

  Object.keys(props).forEach(prop => {
    svgElement.setAttribute(prop, props[prop]);
  });
}

function getAriaProps(label, labelledById) {
  const props = {};
  if (label) {
    props['aria-label'] = label;
  }
  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }
  return props;
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

function handleFakeLinks() {
  if (typeof document === 'undefined') return;
  
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.href) {
      link.setAttribute('role', 'button');
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

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && cell.tagName === 'TH') {
      return false;
    }
  }
  return true;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      if (cell.tagName === 'TH') {
        hasHeader = true;
        if (!cell.id) {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

function validateLinkAccessibility() {
  if (typeof document === 'undefined') return true;
  
  const links = document.querySelectorAll('a');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

export const checkLinkAccessibility = (url) => {
  if (!url) {
    return false;
  }
  return true;
};

export const validateLandmark = (landmark) => {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude !== undefined && landmark.longitude !== undefined) {
    if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
      errors.push('Landmark latitude must be a number');
    } else if (landmark.latitude < -90 || landmark.latitude > 90) {
      errors.push('Landmark latitude must be between -90 and 90');
    }

    if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
      errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
      errors.push('Landmark longitude must be between -180 and 180');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

function validateLandmarkStructure() {
  if (typeof document === 'undefined') return true;
  
  const landmarks = document.querySelectorAll('[role]');

  for (const landmark of landmarks) {
    if (!landmark.id && landmark.getAttribute('role')) {
      return false;
    }
  }
  return true;
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

function ensureDependencyGraphAccessibility() {
  ensureDependencyGraphAriaRole();
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
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

function loadLandmarks() {
  try {
    const dataPath = CONFIG.dataPath || './data';
    const filePath = path.join(dataPath, 'landmarks.json');
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

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults || 100);
}

function checkLandmarkElement(id) {
  if (typeof document === 'undefined') return false;
  const element = document.getElementById(id);
  return element !== null;
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
  if (typeof document === 'undefined') return null;
  
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
    if (parent && newButton) {
      parent.replaceChild(newButton, fakeLink);
    }
  }
}

// New function3 implementation
function function3() {
  // TODO: Implement new function3 logic here
  console.log('function3 executed');
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
    if (typeof document === 'undefined') return false;
    
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

// Fetch user data
function fetchUser(userId) {
    return { id: userId, name: 'Test User' };
}

// Clear cache
function clearCache() {
    appState.cache = {};
}

// Initialize
function initialize() {
    return initializeApp(CONFIG);
}

// Format response
function formatResponse(data, status = 'success') {
    return {
        status,
        data: data,
        timestamp: new Date().toISOString()
    };
}

// Format date
function formatDate(date) {
    return new Date(date).toISOString();
}

// Process data
function processData(data) {
    if (!data) return null;
    return { ...data, processed: true };
}

// Some function
function someFunction() {
    return 'some function';
}

export const newExportedFunction = () => {
  return { success: true };
};

// Added missing function that was referenced in exports
function checkLandmarkElement(element) {
    if (!element || typeof element !== 'object') {
        return false;
    }
    
    // Check if element has landmark-related attributes
    const hasRole = element.getAttribute && element.getAttribute('role');
    const hasAriaLabel = element.getAttribute && element.getAttribute('aria-label');
    const hasAriaLabelledby = element.getAttribute && element.getAttribute('aria-labelledby');
    
    // Must have either a role or accessible name to be a valid landmark element
    return !!(hasRole || hasAriaLabel || hasAriaLabelledby);
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
  newFunction(); // Added the new function to the initialization
}

function newFunction() {
  console.log('New function executed during accessibility initialization');
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

// TODO: Implement new function3 logic here

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
module.exports = {
    initializeApp,
    config,
    renderDependencyGraph,
    newFunction3,
    // Accessibility functions
    ensureLangAttribute,
    fixLandmarks,
    addSvgAccessibleNames,
    fixFakeLinks,
    replaceButtonIds,
    ensureDependencyGraphAriaRole,
    validateTableAccessibility,
    validateTableStructure,
    validateLinkAccessibility,
    handleFakeLinks,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    getLangAttribute,
    addLangAttribute,
    createInPageButton,
    // Landmark functions
    loadLandmarks,
    processLandmarks,
    checkLandmarkElement,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    isValidLandmark,
    // Google sign-in
    googleSignIn,
    fetchUser,
    clearCache,
    initialize,
    formatResponse,
    formatDate,
    processData,
    someFunction,
    checkLinkAccessibility,
    newExportedFunction,
    // Dependency visualization
    analyzeModuleDependencies,
    visualizeModuleRelationships,
    // Scan accessibility
    scanAccessibility,
    // New functions
    function3,
    newFunction,
    getConfig,
    // App state
    appState,
    CONFIG
};

// Start application if run directly
if (require.main === module) {
    initializeApp();
}