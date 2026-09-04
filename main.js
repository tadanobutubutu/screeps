const { spawn } = require('child_process');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const config = CONFIG;

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

const { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } = require('./mainAdapted');
const { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure, initialize: initializeAdapted } = require('./mainAccessibility');

const { calculateSum, UserSafety, getSafetyCategory, getSafetyCategoryDetailed, getUserSafetyInfo, isUserSafetyUnsafe, hasSafetyCategory, loadUserSafetyInfo, main, renderDependencyGraph, renderIndexView, renderDependencyGraphContent } = require('./userSafety');

// Application state
let isInitialized = false;
const appData_originSide = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let dependencyGraph = {};

const requiredModule1 = require('required-module-1');
const requiredModule2 = require('required-module-2');

// Accessibility utilities from the new commit
const a11y = {
  init: function () {
    addressAccessibilityIssues();
    ensureUniqueLandmarksDom();
    // Initialize accessibility features from a11y utilities
    if (a11yImport && a11yImport.init) {
      a11yImport.init();
    }
  },
  checkContrast: function (element) {
    // Check color contrast
  },
};

const a11yImport = a11y;

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return dependencyGraph;
}

function importAndExecute(modulePath, functionName, callback) {
  require(modulePath)[functionName](callback);
}

// Landmark validation
function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
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

function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);
    return uniqueLandmarks;
}

// Ensure unique landmarks list
function ensureUniqueLandmarksList(landmarks) {
    const seen = new Map();
    return landmarks.map(landmark => {
        const tag = landmark.tagName?.toLowerCase() || landmark.type;
        if (seen.has(tag)) {
            landmark.ariaLabel = `${tag}-${seen.get(tag)}`;
            seen.set(tag, seen.get(tag) + 1);
        } else {
            seen.set(tag, 1);
        }
        return landmark;
    });
}

// Ensure unique landmarks in DOM
function ensureUniqueLandmarksDom() {
    const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
    const seen = new Map();
    
    landmarks.forEach(landmark => {
        const tag = landmark.tagName.toLowerCase();
        if (seen.has(tag)) {
            landmark.setAttribute('aria-label', `${tag}-${seen.get(tag)}`);
            seen.set(tag, seen.get(tag) + 1);
        } else {
            seen.set(tag, 1);
        }
    });
}

function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
    const seen = new Map();
    
    landmarks.forEach(landmark => {
        const tag = landmark.tagName.toLowerCase();
        if (seen.has(tag)) {
            landmark.setAttribute('aria-label', `${tag}-${seen.get(tag)}`);
            seen.set(tag, seen.get(tag) + 1);
        } else {
            seen.set(tag, 1);
        }
    });
}

// REACT_015: Add lang attribute
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

function getLangAttribute() {
    return 'en';
}

// TODO: Implement checkLandmarkElements
function checkLandmarkElements() {
    console.log('Checking landmark elements...');
}

// New function to validate table accessibility
function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  // Check if table has a caption
  const hasCaption = tableElement.querySelector('caption') !== null;

  // Check if table has proper headers
  const hasHeaders = tableElement.querySelector('thead') !== null ||
                    tableElement.querySelector('th') !== null;

  // Check if table has proper scope attributes for headers
  const headers = tableElement.querySelectorAll('th');
  let hasScope = true;
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      hasScope = false;
    }
  });

  return hasCaption && hasHeaders && hasScope;
}

// New function to validate table structure
function validateTableStructure(table) {
  if (!table || !table.tagName || table.tagName.toLowerCase() !== 'table') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  
  const errors = [];
  const rows = table.querySelectorAll('tr');
  
  if (rows.length === 0) {
    errors.push('Table has no rows');
  }
  
  return { valid: errors.length === 0, errors };
}

// New function to validate landmark
function validateLandmark(landmarkElement) {
  if (!landmarkElement) return false;

  // Check if landmark has proper role
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  const role = landmarkElement.getAttribute('role');

  return validRoles.includes(role);
}

// New function to validate landmark structure
function validateLandmarkStructure(landmarkElement) {
  if (!landmarkElement) return false;

  // Check if landmark has proper heading
  const heading = landmarkElement.querySelector('h1, h2, h3, h4, h5, h6');
  return heading !== null;
}

// New function to get SVG accessible name (DOM-based, enhanced)
function getSvgAccessibleNameEnhanced(svgElement) {
  if (!svgElement) return '';
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');
  if (title) return title.textContent;
  if (desc) return desc.textContent;
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    return labelElement ? labelElement.textContent : '';
  }
  return '';
}

// Function to set SVG attributes (DOM-based, enhanced)
function setSvgAttributesEnhanced(svgElement, name) {
  if (!svgElement || !name) return;
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

// New function to set SVG attributes with options
function setSvgAttributesWithOptions(svgElement, options = {}) {
  if (!svgElement) return;
  if (options.label) {
    svgElement.setAttribute('aria-label', options.label);
  }
  if (options.role) {
    svgElement.setAttribute('role', options.role);
  }
}

// Function to set SVG attributes (combined approach)
function setSvgAttributesCombined(svgElement, name) {
  if (!svgElement || !name) return;
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

// Function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  return svgElement.getAttribute('aria-label') || 
         svgElement.getAttribute('aria-labelledby') || 
         svgElement.querySelector('title')?.textContent || 
         '';
}

// New function to set SVG attributes
function setSvgAttributes(svgElement, options = {}) {
  if (!svgElement) return;
  
  if (options.label) {
    svgElement.setAttribute('aria-label', options.label);
  }
  if (options.role) {
    svgElement.setAttribute('role', options.role);
  }
}

// New function to set SVG attributes (DOM-based)
function setSvgAttributesDOM(svgElement, name) {
  if (!svgElement || !name) return;

  // Set aria-label if not already set
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }

  // Set role if not already set
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

// Function to set SVG attributes (combined approach)
function setSvgAttributesCombined(svgElement, name) {
  if (!svgElement || !name) return;
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = addMainLandmark(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

// Placeholder for external functions from imported modules
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;
    return html;
}

function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;
    return html;
}

function fixTableStructureIssues() {
    console.log('Fixing table structure issues...');
}

function fixTableHeaderCellScope() {
    console.log('Fixing table header cell scope...');
}

function fixAccessibilityIssues() {
  // Fix accessibility issues
}

function createInPageButton() {
  // Create accessibility button
}

/**
 * Spawns a child process with the given command and arguments.
 * @param {string} command - The command to execute.
 * @param {string[]} args - Array of arguments to pass to the command.
 * @param {Object} options - Optional spawn options.
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            cwd: process.cwd(),
            env: process.env,
            shell: true,
            timeout: 30000
        };

        const spawnOptions = { ...defaultOptions, ...options };
        let stdout = '';
        let stderr = '';
        let timeoutId;

        const child = spawn(command, args, spawnOptions);

        if (spawnOptions.timeout) {
            timeoutId = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error(`Process timed out after ${spawnOptions.timeout}ms`));
            }, spawnOptions.timeout);
        }

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            if (timeoutId) clearTimeout(timeoutId);
            reject(error);
        });

        child.on('close', (exitCode) => {
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ stdout, stderr, exitCode });
        });
    });
}

/**
 * Spawns multiple processes concurrently with a limit on concurrency.
 * @param {Array<{command: string, args?: string[], options?: Object}>} tasks - Array of tasks to spawn.
 * @param {number} concurrency - Maximum number of concurrent processes.
 * @returns {Promise<Array<{stdout: string, stderr: string, exitCode: number}>>}
 */
async function spawnConcurrent(tasks, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const promise = spawnProcess(task.command, task.args, task.options)
            .then((result) => {
                results.push({ success: true, ...result });
                return result;
            })
            .catch((error) => {
                results.push({ success: false, error: error.message });
                throw error;
            });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            executing.splice(executing.findIndex(p => p === promise), 1);
        }
    }

    return Promise.all(executing).then(() => results);
}

async function accessiblyHelper(data) {
    if (data) {
        return data;
    }
    return [];
}

async function generateAccessibilityReport(issuesData) {
  let issues = [];

  if (!issuesData) {
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          type: 'missing-alt',
          element: 'img',
          index: index,
          message: `Image at index ${index} is missing an alt attribute`
        });
      }
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
      const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'button',
          index: index,
          message: `Button at index ${index} is missing an accessible name`
        });
      }
    });

    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'a',
          index: index,
          message: `Link at index ${index} is missing an accessible name`
        });
      }
    });

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      const inputType = input.getAttribute('type');
      if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
        const labelId = input.getAttribute('aria-labelledby');
        const labelText = document.querySelector(`label[for="${input.id}"]`);
        const hasLabel = input.getAttribute('aria-label') || labelId || labelText;
        if (!hasLabel) {
          issues.push({
            type: 'missing-label',
            element: 'input',
            index: index,
            message: `Input at index ${index} is missing an associated label`
          });
        }
      }
    });

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        issues.push({
          type: 'empty-heading',
          element: heading.tagName.toLowerCase(),
          index: index,
          message: `Heading at index ${index} has no text content`
        });
      }
    });
  } else {
    issues = await accessiblyHelper(issuesData);
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };

  return report;
}

// New function to validate link accessibility
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  // Check if link has href and is not empty
  if (!link.href || link.href.trim() === '') {
    return false;
  }

  // Check if link has accessible name
  if (!link.textContent || link.textContent.trim() === '') {
    return false;
  }

  return true;
}

// New function to handle fake links
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

// Function to render the index view
function renderIndexView() {
    const dependencyGraph = setupDependencyGraph();
    if (dependencyGraph) {
        dependencyGraph.setAttribute('role', 'region');
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
}

function addressAccessibilityIssues(insightReport) {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = skipLink.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  if (typeof a11y !== 'undefined') {
    a11y.announce('Welcome to the bot!', 'assertive');
  }

  const imageElement = document.querySelector('img:not([alt])');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  const divElement = document.querySelector('[data-list]');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }

  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
}

function addKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Handle keyboard events
  });
}

function addAriaLabels() {
  const elements = document.querySelectorAll('[data-label]');
  elements.forEach(el => {
    el.setAttribute('aria-label', el.getAttribute('data-label'));
  });
}

function addScreenReaderAnnouncements() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
}

function addFocusTrap() {
  const focusableElements = document.querySelectorAll('a, button, input, [tabindex]');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}

function improveAccessibility() {
  fixTableStructureIssues();
  fixTableHeaderCellScope();
  addMainLandmark();
  addSvgAccessibleNames();
}

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
}

// Setup dependency graph
function setupDependencyGraph() {
    const dependencyGraph = document.querySelector('#dependency-graph');
    if (dependencyGraph) {
        const currentRole = dependencyGraph.getAttribute('role');
        if (!currentRole || currentRole !== 'graph') {
            dependencyGraph.setAttribute('role', 'graph');
        }
    }
    return dependencyGraph;
}

// Function to render the index view (with dependency graph role)
function renderIndexViewWithRole() {
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

const initializeApp = () => {
    addMainLandmark();
    setupDependencyGraph();
};

// Initialize the application with accessibility improvements
function initialize() {
  // Ensure the dependencyGraph container has a proper ARIA role
  if (typeof dependencyGraph !== 'undefined' && dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }

  // Address accessibility issues
  addressAccessibilityIssues();

  // Create the in-page button
  createInPageButton();

  // Add main landmark
  addMainLandmark();

  // Setup dependency graph
  setupDependencyGraph();

  // Existing initialization logic preserved
  // Accessibility: Ensure main content is keyboard accessible
  // Accessibility: Add skip link functionality
  // Accessibility: Add buttons have proper labels
  // Accessibility: Add landmark roles and fix landmark issues
  // Accessibility: Add accessible names to 2 SVGs
  // Accessibility: Ensure unique landmarks (2 issues)
  // Accessibility: Fix 1 fake link issue
  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }

  // Render index view
  renderIndexView();

  // Load and process landmarks
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  
  return processed;
}

async function renderFunction1() {
  const moduleAReturnValue = await accessiblyHelper();

  function ensureDependencyGraphRole(container) {
    if (!container) return;
    if (!container.hasAttribute('role')) {
      container.setAttribute('role', 'img');
    }
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency graph');
    }
  }

  const appData = {
    title: 'Screeps',
    version: '1.0.0'
  };

  return { moduleAReturnValue, appData };
}

async function renderFunction2() {
  const moduleBReturnValue = await accessiblyHelper();

  return { moduleBReturnValue };
}

// Combined exports from both branches
module.exports = {
  utils: undefined,
  express,
  axe,
  fastMap,
  path,
  React,
  PropTypes,
  ReactDOM,
  App,
  reportWebVitals,
  a11y,
  calculateSum,
  UserSafety,
  getSafetyCategory,
  getSafetyCategoryDetailed,
  getUserSafetyInfo,
  isUserSafetyUnsafe,
  hasSafetyCategory,
  loadUserSafetyInfo,
  main,
  fixAccessibilityIssues,
  ensureUniqueLandmarksDom,
  addressAccessibilityIssues,
  renderDependencyGraph,
  renderIndexView,
  renderDependencyGraphContent,
  initialize: initializeAdapted,
  importAndExecute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  generateAccessibilityReport,
  getLangAttribute,
  createInPageButton,
  isInitialized,
  appData_originSide,
  appState,
  CONFIG,
  config,
  helper,
  formatDate,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  ensureUniqueLandmarksList,
  checkLandmarkElements,
  fixTableStructure,
  validateLandmark,
  spawnProcess,
  spawnConcurrent,
  accessiblyHelper,
  validateLinkAccessibility,
  handleFakeLinks,
  initializeApp,
  renderFunction1,
  renderFunction2,
  applyAccessibilityFixes,
  setupDependencyGraph,
  addSvgAccessibleNames,
  fixFakeLinks,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  improveAccessibility,
  analyzeContentSafety,
  addLangAttribute,
  ensureUniqueLandmarks,
  dependencyGraph,
  requiredModule1,
  requiredModule2,
  getDependencyGraph,
  exportedFunctions: {
    greet,
    add,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    appData,
    someFunction,
    validateInput,
    processData,
    formatResponse,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
  },
};

// Adapted main execution
if (require.main === module) {
    initializeApp();
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
}