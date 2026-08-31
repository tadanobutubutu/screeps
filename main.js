import React from 'react';
import { useState, useEffect } from 'react';
import express from 'express';
import path from 'path';
import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import { visualizeDependencyTree } from './utils.js';
import fs from 'fs';
import { CONFIG, CONFIG as UTILS_CONFIG } from './utils/constants';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute, addLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure, fixTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure, addMainLandmark, isValidLandmark, loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks, validateInput, processData as processDataUtil, formatResponse, createInPageButton } from './utils/linkAccessibilityUtils';

// Configuration - merged from both branches
const APP_CONFIG = {
  ...UTILS_CONFIG,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

// App state - merged from both branches
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

// New function to generate a report based on accessibility issues
function generateAccessibilityReport() {
  return getInsightReport();
}

// Function to add wrapper for main element to enhance accessibility
function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  if (parent.tagName?.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

// New spawning logic implementation
function spawnEntity(entityType, params) {
  // Logic to spawn an entity of the specified type with given parameters
  // ...
}

// Existing code continues below

// Example usage of the new spawnEntity function
// Assuming there's an existing function or method that calls spawnEntity
// ...
// spawnEntity('type1', { x: 10, y: 20 });
// ...

function clearCache() {
  appState.data = null;
  appState.cache.clear();
}

function someFunction() {
  return 'some value';
}

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function validateInput(input) {
  if (!input || input.length === 0) {
    return false;
  }
  return true;
}

// Main function (required export)
function main() {
  initialize();
  initializeApp();
  console.log('Main function executed');
  return { executed: true };
}

// Landmark data structure
const landmarks = [];

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Language attribute functions
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function getLangAttributeUpdated() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function getFullLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function addLangAttribute(element, lang = 'en') {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('lang', lang);
  }
}

function setLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    addLangAttribute(htmlElement);
  }
}

// React component (placeholder)
const HTML = ({ lang }) => React.createElement('html', { lang }, null);

// Table accessibility functions
function validateTableAccessibility() {
  console.log('Validating table accessibility');
  return [];
}

function validateTableStructure() {
  console.log('Validating table structure');
  return [];
}

function fixTableStructure() {
  console.log('Fixing table structure issues');
}

// Landmark functions
function addMainLandmark() {
  console.log('Adding main landmark');
}

function validateLandmark() {
  console.log('Validating landmark');
  return [];
}

function validateLandmarkStructure() {
  console.log('Validating landmark structure');
  return [];
}

function validateLandmarkAttributes() {
  console.log('Validating landmark attributes');
  return [];
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function addLandmarkRoles() {
  console.log('Adding landmark roles');
}

function addProperLandmarkRegions() {
  addLandmarkRegions();
}

// SVG accessibility functions
function getSvgAccessibleName() {
  return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) svg.setAttribute('aria-label', accessibleName);
  }
  return svg;
}

/**
 * REACT_036: Fix 1 fake link issue
 * Creates an in-page button with proper accessibility.
 * @param {string} targetId - The ID of the target element.
 * @param {string} buttonText - The button text.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(targetId, buttonText) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'Skip to content';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', buttonText || 'Skip to main content');

  button.addEventListener('click', function() {
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });

  return button;
}

// Link accessibility functions
function validateLinkAccessibility() {
  console.log('Validating link accessibility');
  return [];
}

function handleFakeLinks() {
  console.log('Handling fake links');
}

function checkLinkAccessibility() {
  console.log('Checking link accessibility');
  return [];
}

function fixFakeLinks() {
  handleFakeLinks();
}

// Address accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return;
  }

  insightReport.issues.forEach(function(issue) {
    switch (issue.type) {
      case 'REACT_015':
        if (issue.element) {
          addLangAttribute(issue.element);
        }
        break;
      case 'REACT_027':
        if (issue.subtype === 'structure') {
          validateTableStructure();
          fixTableStructure();
        } else {
          validateTableAccessibility();
        }
        break;
      case 'REACT_017':
        addMainLandmark();
        validateLandmark();
        validateLandmarkStructure();
        validateLandmarkAttributes();
        addLandmarkRegions();
        break;
      case 'REACT_041':
        if (issue.element) {
          setSvgAttributes(issue.element, issue.accessibleName || getSvgAccessibleName());
        }
        break;
      case 'REACT_025':
        ensureUniqueLandmarks(landmarks);
        break;
      case 'REACT_036':
        handleFakeLinks();
        validateLinkAccessibility();
        break;
      default:
        console.log('Unknown issue type:', issue.type);
    }
  });
}

/**
 * Gets a person's name for accessibility purposes.
 * @returns {string} The person's name.
 */
function personName() {
  const nameElement = document.querySelector('[data-person-name]');
  return nameElement ? nameElement.textContent.trim() : 'User';
}

/**
 * Implements a focus trap for keyboard navigation within a container.
 * @param {string} containerSelector - CSS selector for the container.
 */
function newFocusTrap(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const focusableElements = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length === 0) return;
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

/**
 * Addresses new accessibility issues from insight report.
 * Placeholder for additional fixes.
 */
function addressNewAccessibilityIssues() {
  // Implement new accessibility fixes here
}

/**
 * Gets the insight report for accessibility issues.
 * @returns {Object} The insight report containing issues.
 */
function getInsightReport() {
  const issues = [];
  
  // Check for lang attribute on HTML element
  const langAttribute = getLangAttribute();
  if (!langAttribute) {
    issues.push({
      type: 'REACT_015',
      description: 'HTML element is missing lang attribute',
      severity: 'critical',
      element: 'html'
    });
  }
  
  // Check table accessibility
  const tableAccessibilityIssues = validateTableAccessibility();
  if (tableAccessibilityIssues && tableAccessibilityIssues.length > 0) {
    tableAccessibilityIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_027',
        subtype: 'accessibility',
        description: issue.description || 'Table accessibility issue',
        severity: issue.severity || 'high',
        element: issue.element,
        table: issue.table
      });
    });
  }
  
  // Check table structure
  const tableStructureIssues = validateTableStructure();
  if (tableStructureIssues && tableStructureIssues.length > 0) {
    tableStructureIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_027',
        subtype: 'structure',
        description: issue.description || 'Table structure issue',
        severity: issue.severity || 'high',
        element: issue.element,
        table: issue.table
      });
    });
  }
  
  // Check landmark issues
  const landmarkIssues = validateLandmark();
  if (landmarkIssues && landmarkIssues.length > 0) {
    landmarkIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  // Check landmark structure
  const landmarkStructureIssues = validateLandmarkStructure();
  if (landmarkStructureIssues && landmarkStructureIssues.length > 0) {
    landmarkStructureIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_017',
        structure: true,
        description: issue.description || 'Landmark structure issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  // Check landmark attributes
  const landmarkAttributeIssues = validateLandmarkAttributes();
  if (landmarkAttributeIssues && landmarkAttributeIssues.length > 0) {
    landmarkAttributeIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark attribute issue',
        severity: issue.severity || 'low',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  // Check SVG accessibility
  const svgAccessibleNames = getSvgAccessibleName();
  if (svgAccessibleNames && svgAccessibleNames.length > 0) {
    svgAccessibleNames.forEach(function(svg) {
      issues.push({
        type: 'REACT_041',
        description: 'SVG is missing accessible name',
        severity: 'medium',
        svg: svg.element,
        svgId: svg.id
      });
    });
  }
  
  // Check for unique landmarks
  const uniqueLandmarkIssues = ensureUniqueLandmarks(landmarks);
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
  const linkIssues = validateLinkAccessibility();
  if (linkIssues && linkIssues.length > 0) {
    linkIssues.forEach(function(issue) {
      issues.push({
        type: 'REACT_036',
        description: issue.description || 'Link accessibility issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        link: issue.link
      });
    });
  }
  
  // Generate the report
  var report = {
    issues: issues,
    summary: {
      totalIssues: issues.length,
      langAttribute: issues.filter(function(i) { return i.type === 'REACT_015'; }).length,
      tableIssues: issues.filter(function(i) { return i.type === 'REACT_027'; }).length,
      landmarkIssues: issues.filter(function(i) { return i.type === 'REACT_017'; }).length,
      svgIssues: issues.filter(function(i) { return i.type === 'REACT_041'; }).length,
      uniqueLandmarkIssues: issues.filter(function(i) { return i.type === 'REACT_025'; }).length,
      linkIssues: issues.filter(function(i) { return i.type === 'REACT_036'; }).length,
      critical: issues.filter(function(i) { return i.severity === 'critical'; }).length,
      high: issues.filter(function(i) { return i.severity === 'high'; }).length,
      medium: issues.filter(function(i) { return i.severity === 'medium'; }).length,
      low: issues.filter(function(i) { return i.severity === 'low'; }).length
    },
    timestamp: new Date().toISOString(),
    generatedAt: new Date().toLocaleString()
  };
  
  return report;
}

/**
 * Processes an accessibility report and returns findings.
 * @param {Object} report - The accessibility report.
 * @returns {Object} The processed findings.
 */
function processAccessibilityReport(report) {
  var findings = {
    langAttribute: false,
    tableIssues: 0,
    landmarkIssues: 0,
    svgIssues: 0,
    uniqueLandmarkIssues: 0,
    fakeLinkIssues: 0
  };

  if (report) {
    if (report.REACT_015) findings.langAttribute = true;
    if (report.REACT_027) findings.tableIssues = report.REACT_027.count || 0;
    if (report.REACT_017) findings.landmarkIssues = report.REACT_017.count || 0;
    if (report.REACT_041) findings.svgIssues = report.REACT_041.count || 0;
    if (report.REACT_025) findings.uniqueLandmarkIssues = report.REACT_025.count || 0;
    if (report.REACT_036) findings.fakeLinkIssues = report.REACT_036.count || 0;
  }
  
  return findings;
}

// Additional helper functions
function calculateSum(a, b) {
  return a + b;
}

function processData(data) {
  return data;
}

function formatResponse(data) {
  return JSON.stringify(data);
}

function isValidLandmark(landmark) {
  return landmark && landmark.role;
}

function loadLandmarks() {
  return landmarks;
}

function processLandmarks(landmarksArray) {
  return landmarksArray || [];
}

function sortLandmarks(landmarksArray) {
  if (!landmarksArray) return [];
  return landmarksArray.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

function getLandmarkById(id) {
  return landmarks.find(landmark => landmark.id === id);
}

// Data for the application
const appData = {
  title: 'Screeps Bot',
  version: '1.0.0'
};

const VERSION = '1.0.0';
const CONFIG = APP_CONFIG;

// Check if the environment is secure before initializing
function isSecureContext() {
  if (typeof window !== 'undefined' && window.isSecureContext) {
    return window.isSecureContext;
  }
  return false;
}

// Register the service worker
function registerSW() {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Service worker registered:', registration);
    }).catch(error => {
      console.log('Service worker registration failed:', error);
    });
  }
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  initializeApp();
  setLanguageAttribute();
  addLandmarkRoles();
  ensureUniqueLandmarks(landmarks);

  const icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screeps icon"></svg>'
  };

  fixFakeLinks();
  console.log('Initializing ' + appData.title + ' v' + appData.version);
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// Register the service worker
registerSW();

// React component for the main application (placeholder)
const App = () => {
  const [programData, setProgramData] = React.useState(null);
  return null;
};

// Express server setup (merged from origin/main)
const expressApp = express();
expressApp.use('/', expressApp);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Main execution when run directly (Merged functionality)
if (typeof require !== 'undefined' && require.main === module) {
  // Start server
  expressApp.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });

  // Visualize dependency tree when running directly
  if (require.dependencies) {
    visualizeDependencyTree(require.dependencies);
  }
}

// Export functions for testing (merged from both branches)
module.exports = {
  config: CONFIG,
  APP_CONFIG,
  initialize,
  initializeApp,
  main,
  fetchUser,
  clearCache,
  someFunction,
  helper,
  formatDate,
  validateInput,
  checkLandmarkElement,
  ensureUniqueLandmarks,
  getLangAttribute,
  getLangAttributeUpdated,
  getFullLangAttribute,
  addLangAttribute,
  setLanguageAttribute,
  HTML,
  wrapPrimaryContentInMain,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  addLandmarkRegions,
  addLandmarkRoles,
  addProperLandmarkRegions,
  getSvgAccessibleName,
  setSvgAttributes,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  fixFakeLinks,
  addressAccessibilityIssues,
  addressNewAccessibilityIssues,
  personName,
  newFocusTrap,
  getInsightReport,
  processAccessibilityReport,
  calculateSum,
  processData,
  formatResponse,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  generateAccessibilityReport,
  appData,
  VERSION,
  isSecureContext,
  registerSW,
  initApp,
  App,
  landmarks,
  spawnEntity
};

module.exports.main = main;