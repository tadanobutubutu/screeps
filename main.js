const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const { AddressabilityIssues } = require('./accessibility');
const PORT = process.env.PORT || 3000;

app.use(express.json());

const config = {
  port: PORT,
  env: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function getFullLangAttribute() {
  return getLangAttribute();
}

function addLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang || 'en');
  } else if (typeof document !== 'undefined' && document.documentElement) {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
      html.setAttribute('lang', lang || 'en');
    }
  }
}

function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (AddressabilityIssues && typeof AddressabilityIssues.validateLandmark === 'function') {
    return AddressabilityIssues.validateLandmark(element);
  }

  if (!element) {
    issues.push('No element provided');
    return { success: false, issues };
  }

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  if (element.nodeName && element.nodeName.toLowerCase() === 'div' && !element.getAttribute('role')) {
    issues.push('Missing role attribute');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name || typeof document === 'undefined') return svgElement;
  
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;
  
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (!ariaLabelledBy && !svgElement.getAttribute('aria-label')) {
    title.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
    svgElement.setAttribute('aria-labelledby', title.id);
  }
  
  return svgElement;
}

function ensureElementHasId(element) {
  if (!element || typeof document === 'undefined') return;
  const name = element.getAttribute('id');
  if (!name) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 11);
  }
}

function processSvgElements() {
  if (typeof document === 'undefined') return;
  const svgElements = document.querySelectorAll('svg');
  // Process SVG accessibility as needed
}

/**
 * Validates landmark attributes for accessibility
 * @param {Object} landmark - The landmark element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkAttributes(landmark) {
  const issues = [];
  if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
    issues.push('Landmark missing accessible name');
  }
  if (landmark.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(landmark.role)) {
    issues.push('Invalid landmark role: ' + landmark.role);
  }
  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (AddressabilityIssues && typeof AddressabilityIssues.validateTableAccessibility === 'function') {
    return AddressabilityIssues.validateTableAccessibility(table);
  }

  if (!table) return { success: true, issues: [] };

  if (!table.headers && !(table.querySelector && table.querySelector('thead'))) {
    issues.push('Missing headers attribute or thead element');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array|Object} tables - Array of table objects or single table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  if (!tables) return { valid: true, error: null };
  
  const allIssues = [];
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    if (!table) {
      allIssues.push({
        tableIndex: index,
        issues: ['Invalid table element']
      });
      return;
    }

    const rows = (typeof table.querySelectorAll === 'function') ? table.querySelectorAll('tr') : [];
    const cellCount = (rows[0] && typeof rows[0].querySelectorAll === 'function') ? rows[0].querySelectorAll('th, td').length : 0;
    
    rows.forEach((row, rowIndex) => {
      if (typeof row.querySelectorAll !== 'function') return;
      const rowCells = row.querySelectorAll('th, td');
      if (rowCells.length !== cellCount && rowIndex > 0) {
        row.setAttribute('role', 'row');
        const cells = row.querySelectorAll('th, td');
        cells.forEach((cell, cellIndex) => {
          cell.setAttribute('role', cellIndex === 0 ? 'rowheader' : 'cell');
        });
      }
    });

    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }
  });

  return { valid: allIssues.length === 0, error: null, issues: allIssues };
}

function validateLinkAccessibility(link) {
  const issues = [];
  if (!link || !link.href) {
    issues.push('Link missing href attribute');
  }
  if (!link || (!link.textContent && !link.ariaLabel)) {
    issues.push('Link missing accessible name');
  }
  return {
    success: issues.length === 0,
    issues
  };
}

function handleFakeLinks(link) {
  if (link && (link.href === '#' || link.href === 'javascript:void(0)')) {
    return createInPageButton({
      text: link.textContent,
      ariaLabel: link.ariaLabel,
      onClick: link.onClick
    });
  }
  return link;
}

function validateLandmarkElement(element, landmarkType) {
  if (!element) return { valid: false, error: 'No element provided' };
  return { valid: true, error: null };
}

/**
 * Validates the structure of landmark elements
 * @param {Array|Object} landmarks - Array of landmark elements to validate, or container element
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  if (!landmarks) return { valid: true, issues: [] };
  
  const issues = [];
  
  if (AddressabilityIssues && typeof AddressabilityIssues.validateLandmarkStructure === 'function') {
    return AddressabilityIssues.validateLandmarkStructure(landmarks);
  }

  // If landmarks is a container element
  if (typeof landmarks.querySelectorAll === 'function') {
    const allLandmarks = landmarks.querySelectorAll('[role]');
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
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }

    // Check for unique landmarks
    const landmarkSet = new Set();
    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role && !landmarkSet.has(role)) {
        landmarkSet.add(role);
      } else if (role) {
        issues.push(`Duplicate landmark role: ${role}`);
      }
    });

    return { valid: issues.length === 0, issues };
  }

  // If landmarks is an array
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  }

  return { valid: issues.length === 0, issues };
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement || typeof document === 'undefined') return null;
  if (svgElement.ariaLabel) return svgElement.ariaLabel;
  if (svgElement.ariaLabelledby) return svgElement.ariaLabelledby;
  const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  return title ? title.textContent : 'Unnamed SVG';
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array|Object} container - Container element or array of landmarks
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(container) {
  if (typeof document === 'undefined') return { success: true, duplicates: [] };
  
  const names = [];
  const duplicates = [];

  let landmarksToCheck;
  if (container && container.querySelectorAll) {
    landmarksToCheck = container.querySelectorAll('[role="landmark"]');
  } else if (container && typeof container.forEach === 'function') {
    landmarksToCheck = container;
  } else {
    landmarksToCheck = document.querySelectorAll ? document.querySelectorAll('[role="landmark"]') : [];
  }

  landmarksToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || (landmark.getAttribute && landmark.getAttribute('aria-labelledby')) || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs
  const elementsById = {};
  const allLandmarks = document.querySelectorAll ? document.querySelectorAll('[role]') : [];
  allLandmarks.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

function personName(name, linkElement) {
  return name || '';
}

function createInPageButton(options, label) {
  if (typeof options === 'string') {
    return { text: label || options, onClick: () => {} };
  }
  return options || { text: label || '', onClick: () => {} };
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.ariaLabel - Aria label for the button
 * @param {Function} options.onClick - Click handler
 * @returns {Object} Button element object
 */
function createInPageButtonAccessible(options) {
  return {
    type: 'button',
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    onClick: options.onClick,
    accessibleName: getSvgAccessibleName({ ariaLabel: options.ariaLabel })
  };
}

/**
 * Creates an accessible link element
 * @param {Object} options - Link options
 * @param {string} options.href - Link URL
 * @param {string} options.text - Link text
 * @param {string} options.ariaLabel - Aria label for the link
 * @returns {Object} Link element object
 */
function createAccessibleLink(options) {
  return {
    type: 'a',
    href: options.href,
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    isFake: false
  };
}

function checkLandmarkElements(response) {
  if (AddressabilityIssues && typeof AddressabilityIssues.checkLandmarkElements === 'function') {
    return AddressabilityIssues.checkLandmarkElements(response);
  }
  return [];
}

function handleCredentialResponse(credentialResponse) {
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return {
      success: false,
      error: 'Invalid credential response format'
    };
  }

  if (!credentialResponse.credential || !credentialResponse.clientDataJSON) {
    return {
      success: false,
      error: 'Missing required credential fields'
    };
  }

  if (typeof window !== 'undefined' && window.location) {
    try {
      const clientData = JSON.parse(atob(credentialResponse.clientDataJSON.split('.')[0]));

      if (window.currentChallenge && clientData.challenge !== window.currentChallenge) {
        return {
          success: false,
          error: 'Challenge verification failed'
        };
      }

      window.storedCredential = credentialResponse;

      return {
        success: true,
        credential: credentialResponse.credential,
        clientData: clientData,
        message: 'Credential successfully processed'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse credential data',
        details: error.message
      };
    }
  }

  return {
    success: true,
    credential: credentialResponse.credential,
    message: 'Credential received'
  };
}

function addBook(bookData) {
  return bookData;
}

function generateAccessibilityReport() {
  return {};
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues) {
  const handled = [];
  const unhandled = [];

  if (!Array.isArray(issues)) {
    return {
      total: 0,
      handled: 0,
      unhandled: 0,
      unhandledIssues: []
    };
  }

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

function addressAccessibilityIssues(insightReport) {
  if (!insightReport) return [];
  const sections = insightReport.sections || (Array.isArray(insightReport) ? insightReport : []);
  const issues = [];
  
  sections.forEach((section, index) => {
    if (!section.heading) {
      issues.push({
        type: 'missing-heading',
        severity: 'high',
        message: 'Section ' + index + ' is missing a heading',
        suggestedFix: 'Add a descriptive heading to each section'
      });
    }

    if (!section.content || section.content.trim() === '') {
      issues.push({
        type: 'empty-content',
        severity: 'medium',
        message: 'Section "' + (section.heading || '') + '" has no content',
        suggestedFix: 'Add meaningful content to the section'
      });
    }

    if (section.content && section.content.toLowerCase().includes('click here')) {
      issues.push({
        type: 'inaccessible-link-text',
        severity: 'low',
        message: 'Section "' + (section.heading || '') + '" contains "click here" text which is not accessible',
        suggestedFix: 'Use descriptive link text instead of "click here"'
      });
    }
  });

  return issues;
}

/**
 * Address new accessibility issues from insight report
 * Applies language attribute and ARIA roles to document elements
 */
function addressNewAccessibilityIssues() {
  // Retrieve the language attribute for the HTML document
  const lang = getLangAttribute();

  // Apply the language attribute to the <html> element if not already present
  if (typeof document !== 'undefined' && document.documentElement) {
    const htmlElement = document.documentElement;
    if (!htmlElement.getAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
    }
  }

  // Ensure the main content area has an appropriate ARIA role
  if (typeof document !== 'undefined' && document.querySelector) {
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('role', 'main');
    }

    // Attach an accessible label to the primary action button
    const submitBtn = document.querySelector('button[type="submit"], button[type="button"]');
    if (submitBtn) {
      submitBtn.setAttribute('aria-label', personName());
    }
  }
}

function initializeAccessibility() {
  // Initialization stub
}

function generateUniqueId(landmark) {
  let uniqueId = (landmark && typeof landmark === 'string') ? landmark : 'landmark';
  let counter = 0;
  if (typeof document !== 'undefined' && document.getElementById) {
    while (document.getElementById(uniqueId)) {
      uniqueId = uniqueId + '-' + counter++;
    }
  }
  return uniqueId;
}

function ensureUniqueIds() {
  if (typeof document === 'undefined' || !document.querySelectorAll) return;
  const landmarks = document.querySelectorAll('[role="landmark"]');
  landmarks.forEach(landmark => {
    if (!landmark.id) {
      landmark.id = generateUniqueId(landmark.textContent || 'landmark');
    }
  });
}

function setDependencyGraphRole() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'application');
  }
}

function fixLandmarkStructure(source) {
  const mainBlockRegex = /<main[^>]*>([\s\S]*?)<\/main>/gi;

  if (!source || typeof source !== 'string') return source;
  
  const matches = source.match(mainBlockRegex);
  if (!matches || matches.length <= 1) {
    return source;
  }
  
  return source;
}

/**
 * A new function to be added
 * This function does a specific functionality
 */
function myNewFunction() {
  // Implement your new functionality here
  return { success: true, message: 'Function executed' };
}

function createServer() {
  return http.createServer(app);
}

function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log('Server running on port ' + config.port);
    setDependencyGraphRole();
    ensureUniqueIds();
    setARIARoleForDependencyGraph();
    if (AddressabilityIssues && typeof AddressabilityIssues.newFunction === 'function') {
      AddressabilityIssues.newFunction();
    }
    if (typeof newFunction === 'function') {
      newFunction();
    }
  });
  return server;
}

function countDependencies() {
  if (AddressabilityIssues && typeof AddressabilityIssues.countDependencies === 'function') {
    return AddressabilityIssues.countDependencies();
  }
  return {};
}

function newFunction() {
  if (AddressabilityIssues && typeof AddressabilityIssues.newFunction === 'function') {
    return AddressabilityIssues.newFunction();
  }
}

function setARIARoleForDependencyGraph() {
  setDependencyGraphRole();
}

function addAriaLabel(element, label) {
  if (element) element.setAttribute('aria-label', label || '');
}

function renderDependencyGraph() {
  // Dependency graph rendering stub
}

if (AddressabilityIssues) {
  AddressabilityIssues.addLangAttribute = addLangAttribute;
  AddressabilityIssues.ensureElementHasId = ensureElementHasId;
  AddressabilityIssues.validateLandmarkStructure = validateLandmarkStructure;
}

// Browser environment exports
if (typeof window !== 'undefined') {
  const functionsToExpose = [
    'getLangAttribute', 'getFullLangAttribute', 'personName', 
    'validateTableAccessibility', 'validateTableStructure', 
    'validateLandmark', 'validateLandmarkStructure',
    'getSvgAccessibleName', 'createInPageButton', 'createInPageButtonAccessible',
    'createAccessibleLink', 'addressNewAccessibilityIssues',
    'handleAccessibilityIssues', 'myNewFunction', 'ensureUniqueLandmarks',
    'addSvgAccessibleName', 'addAriaLabel', 'ensureElementHasId',
    'validateLandmarkAttributes', 'validateLinkAccessibility'
  ];
  functionsToExpose.forEach(functionName => {
    if (!window[functionName]) {
      window[functionName] = eval(functionName);
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createServer,
    startApp,
    config,
    appState,
    validateLandmark,
    countDependencies,
    checkLandmarkElements,
    sampleInsightReport,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkElement,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    validateLinkAccessibility,
    getSvgAccessibleName,
    addSvgAccessibleName,
    ensureUniqueLandmarks,
    personName,
    createInPageButton,
    createInPageButtonAccessible,
    createAccessibleLink,
    newFunction,
    myNewFunction,
    setARIARoleForDependencyGraph,
    AddressabilityIssues,
    fixMainLandmarkIssues: (AddressabilityIssues && AddressabilityIssues.fixMainLandmarkIssues) ? AddressabilityIssues.fixMainLandmarkIssues : function() {},
    fixSemanticMarkup: (AddressabilityIssues && AddressabilityIssues.fixSemanticMarkup) ? AddressabilityIssues.fixSemanticMarkup : function() {},
    addLangAttribute,
    generateAccessibilityReport,
    handleFakeLinks,
    handleCredentialResponse,
    handleAccessibilityIssues,
    addBook,
    addressAccessibilityIssues,
    addressNewAccessibilityIssues,
    initializeAccessibility,
    fixLandmarkStructure,
    ensureUniqueIds,
    generateUniqueId
  };
} else {
  if (typeof require !== 'undefined' && require.main === module) {
    startApp();
  }
}