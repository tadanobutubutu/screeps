const books = [];
const safetyCategory = "User Safety: safe";
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

const safetyCategories = ["Unauthorized Advice"];
const utils = require('./utils');

const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxResults: 100,
  dataPath: './data',
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

let isInitialized = false;
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const primaryContent = typeof document !== 'undefined'
  ? (document.querySelector('.primary-content') ||
     document.querySelector('[role="main"]') ||
     document.getElementById('main'))
  : null;

function helpler(input) {
  return input ? input.toUpperCase() : '';
}

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  return document.documentElement.lang || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function validateLandmark(landmark) {
  const errors = [];
  const role = landmark && landmark.role;
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
  if (role && !validLandmarks.includes(role)) {
    errors.push('Invalid landmark role: ' + (role || 'undefined'));
  }
  return errors;
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const HTML = ({ lang }) => `<html lang="${lang}">{/* other children */}</html>`;

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    return document.documentElement.lang || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells
  const headerCells = table.querySelectorAll ? table.querySelectorAll('th') : [];
  headerCells.forEach(cell => {
    if (!cell.getAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

function validateTableStructure(tableElement) {
  const rows = tableElement && tableElement.rows;
  if (!rows || rows.length === 0) {
    console.warn('Table has no rows');
    return false;
  }
  return true;
}

function validateLandmarkStructure(landmarks) {
  const issues = [];
  let hasMain = false;
  let hasNavigation = false;

  // If landmarks array is provided, validate each one
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmarkSingle(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
      const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });
  } else {
    // Otherwise, check for required landmarks in the DOM
    const allLandmarks = document.querySelectorAll ? document.querySelectorAll('header, nav, main, aside, footer, section, article') : [];
    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });
  }

  if (!hasMain) console.warn('Missing main landmark');
  if (!hasNavigation) console.warn('Missing navigation landmark');

  return {
    success: hasMain && hasNavigation && issues.length === 0,
    issues
  };
}

function validateLandmarkSingle(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push('Invalid landmark: ' + element.tagName);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function validateLandmarkStructure(landmarks) {
  const issues = [];
  let hasMain = false;
  let hasNavigation = false;

  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmarkSingle(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
      const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });
  } else {
    const allLandmarks = document.querySelectorAll ? document.querySelectorAll('header, nav, main, aside, footer, section, article') : [];
    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });
  }

  if (!hasMain) console.warn('Missing main landmark');
  if (!hasNavigation) console.warn('Missing navigation landmark');

  return {
    success: hasMain && hasNavigation && issues.length === 0,
    issues
  };
}

function addMainLandmark() {
  console.log('Adding landmark regions');
}

function addLandmarkRegions() {
  // Implementation from utils
}

function addProperLandmarkRegions() {
  // Implementation for adding proper landmark regions
}

function addSvgAccessibility() {
  // Add accessibility attributes to SVGs
}

function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
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

function ensureLangAttribute() {
  // Ensure the lang attribute is set on the HTML element
  if (typeof document !== 'undefined') {
    const lang = getLangAttribute();
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }
}

function addSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  const ariaLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;

  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
  return svg;
}

function ensureUniqueLandmarks(landmarksArg) {
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  
  const seenIds = new Set();
  const seenRoles = new Set();
  const uniqueLandmarks = [];
  const duplicates = [];

  // Track seen items
  landmarks.forEach((landmark, index) => {
    const id = landmark.id;
    const role = landmark && (landmark.getAttribute ? landmark.getAttribute('role') : landmark.role);

    // Skip if duplicate ID
    if (id && seenIds.has(id)) {
      duplicates.push(`Duplicate ID: ${id}`);
      return;
    }
    seenIds.add(id);

    // Skip if duplicate role
    if (role) {
      if (seenRoles.has(role)) {
        duplicates.push(`Duplicate role: ${role}`);
        return;
      }
      seenRoles.add(role);
    }

    uniqueLandmarks.push(landmark);
  });

  return uniqueLandmarks;
}

// Helper functions moved to a separate file (preserved references)
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks as ensureUniqueLandmarksFromFile,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./accessibility-improvements');

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const HTML = ({ lang }) => `<html lang="${lang}">{/* other children */}</html>`;

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function addLandmarkRegionsFromUtils() {
  // Implementation from utils
}

function addProperLandmarkRegions() {
  // Implementation for adding proper landmark regions
}

function addSvgAccessibility() {
  // Add accessibility attributes to SVGs
}

function createAccessibleLinks() {
  // Create accessible link variants
}

function function3() {
  // Implementation for function3
}

function functionA() {
  return {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ'
  };
}

function functionB() {
  return {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ'
  };
}

function functionC() {
  // Placeholder for function3 if it was meant to be renamed
  return {};
}

function existingFunction1() {
  // Existing function 1
}

function existingFunction2() {
  // Existing function 2
}

function functionA() {
  return {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ'
  };
}

function functionB() {
  return {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ'
  };
}

function someFunction() {
  // Some function implementation
}

function someNewFunction() {
  // Some new function implementation
}

function newFunction() {
  // New function implementation
}

function newFunction2() {
  // New function 2 implementation
}

function getUserSafety() {
  // Implementation to get user safety
}

function getSafetyCategories() {
  // Implementation to get safety categories
}

function calculateDiscount() {
  // Implementation to calculate discount
}

function analyzeContentSafety() {
  // Analyze content safety
  return { safe: true };
}

function addressAccessibilityIssues() {
  improveAccessibility();
  ensureLangAttribute();
  addLandmarkRoles();
  createInPageButton();
  addSvgAccessibleNames();
  handleDependencyGraph();
  console.log('Accessibility issues have been addressed');
  return true;
}

function addLandmarkRolesFromUtils() {
  // Add landmark roles using utils
}

function applyAccessibilityFixes() {
  // Apply all accessibility fixes
}

function setDependencyGraphAriaRole() {
  // Set ARIA role on dependency graph
}

function ensureUniqueLandmarksCombined(landmarks) {
  // Combined implementation with ID and role checking
  const elementsById = {};
  const duplicates = [];
  const names = [];

  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (name && names.includes(name)) {
      duplicates.push('Duplicate accessible name: ' + name);
    } else if (name) {
      names.push(name);
    }
  });

  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push('Duplicate ID: ' + landmark.id);
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
  }

  const landmarksByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark && (landmark.getAttribute ? landmark.getAttribute('role') : landmark.role);
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push('Duplicate landmark role: ' + role);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return landmarks;
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

function isValidLandmark(landmark) {
  return landmark && landmark.name;
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  button.setAttribute('aria-label', text);
  return button;
}

function createInPageButtonEmpty() {
  return createInPageButton('Button', null);
}

function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
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

function ensureLangAttribute() {
  // Ensure the lang attribute is set on the HTML element
  if (typeof document !== 'undefined') {
    const lang = getLangAttribute();
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }
}

function addSvgAccessibleName(svgContent) {
  const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
  const title = svgElement.querySelector('title');
  return title ? title.textContent : 'No accessible name found';
}

function addressAccessibilityIssues() {
  improveAccessibility();
  ensureLangAttribute();
  addLandmarkRoles();
  createInPageButton();
  addSvgAccessibleNames();
  handleDependencyGraph();
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

module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkSingle,
    addLandmarkRegions,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    addLandmarkRegions,
    setSvgAttributes,
    ensureUniqueLandmarks,
    handleDependencyGraph,
    extractSvgAccessibleName,
    addressAccessibilityIssues,
    importAndExecute,
    analyzeModuleDependenciesLocal
};