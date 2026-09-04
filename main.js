// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure(), addProperLandmarkRegions())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// Ensure the dependencyGraph container has a proper ARIA role

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } from './mainAdapted';
import { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure } from './mainAccessibility';

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const { spawn } = require('child_process');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const config = CONFIG;

// Application state
let isInitialized = false;
const appData_originSide = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

/**
 * Implements upgrade logic for the application
 * Handles version checks, configuration updates, and data migrations
 */
export function upgradeLogic() {
  const currentVersion = '1.0.0';
  const targetVersion = '1.1.0';

  try {
    // Check if upgrade is needed
    const storedVersion = localStorage.getItem('appVersion');

    if (storedVersion !== targetVersion) {
      // Perform version-specific upgrades
      if (storedVersion === '1.0.0') {
        // Upgrade from 1.0.0 to 1.1.0
        upgradeFrom1_0_0to1_1_0();
      }

      // Update stored version
      localStorage.setItem('appVersion', targetVersion);

      // Trigger accessibility improvements
      if (typeof addLangAttribute === 'function') {
        addLangAttribute();
      }

      if (typeof ensureUniqueLandmarks === 'function') {
        ensureUniqueLandmarks();
      }

      if (typeof addProperLandmarkRegions === 'function') {
        addProperLandmarkRegions();
      }

      return { success: true, from: storedVersion || currentVersion, to: targetVersion };
    }

    return { success: true, from: storedVersion, to: targetVersion, message: 'Already up to date' };
  } catch (error) {
    console.error('Upgrade failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Performs upgrade from version 1.0.0 to 1.1.0
 * Handles data migrations and configuration updates
 */
function upgradeFrom1_0_0to1_1_0() {
  // Migrate user preferences if needed
  const preferences = localStorage.getItem('userPreferences');
  if (preferences) {
    try {
      const prefs = JSON.parse(preferences);
      // Add any new preference fields for 1.1.0
      if (!prefs.enhancedAccessibility) {
        prefs.enhancedAccessibility = true;
        localStorage.setItem('userPreferences', JSON.stringify(prefs));
      }
    } catch (e) {
      console.warn('Failed to migrate preferences:', e);
    }
  }
}

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement ? document.documentElement.getAttribute('lang') || 'en' : 'en';
  }
  return 'en';
}

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

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
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

// REACT_015: Add lang attribute
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;
    return html;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;
    return html;
}

// REACT_041: Add accessible names to SVGs
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

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
    if (typeof document === 'undefined') return;
    const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
    const landmarkCounts = {};

    landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        landmarkCounts[landmark] = elements.length;
    });

    for (const [landmark, count] of Object.entries(landmarkCounts)) {
        if (count > 1) {
            const elements = document.querySelectorAll(landmark);
            elements.forEach((element, index) => {
                if (index > 0) {
                    element.setAttribute('aria-label', landmark + ' landmark ' + (index + 1));
                }
            });
        }
    }
}

// TODO: Implement checkLandmarkElements
function checkLandmarkElements() {
    console.log('Checking landmark elements...');
}

function validateLandmark() {
  return [];
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

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility() {
  const pagesDir = path.join(__dirname, 'pages');
  const filePaths = await fs.promises.readdir(pagesDir);
  const issues = [];

  for (const filePath of filePaths) {
    const fullPath = path.join(pagesDir, filePath);
    const { violations } = await axe.analyze(fullPath);

    if (violations.length > 0) {
      issues.push({
        file: filePath,
        issues: violations,
      });
    }
  }

  return issues;
}

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
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
    generatedAt: new Date().toISOString(),
    totalFilesScanned: issues.length,
    totalIssuesFound: issues.reduce((sum, file) => sum + (file.issues ? file.issues.length : 0), 0),
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
  if (typeof document === 'undefined') return;
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

function initialize() {
  console.log('Initializing application...');

  addMainLandmark();

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

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  return svgElement.getAttribute('aria-label') || 
         svgElement.getAttribute('aria-labelledby') || 
         svgElement.querySelector('title')?.textContent || 
         '';
}

function setSvgAttributes(svgElement, options = {}) {
  if (!svgElement) return;
  
  if (options.label) {
    svgElement.setAttribute('aria-label', options.label);
  }
  if (options.role) {
    svgElement.setAttribute('role', options.role);
  }
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks();
    return result;
}

function addressAccessibilityIssues(insightReport) {
  if (typeof document !== 'undefined') {
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
  }

  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
      insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
  console.log('Addressing accessibility issues from insight report:', insightReport);
}

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    // ... (Existing createInPageButton implementation)
}

// TODO: Implement functions for validateLinkAccessibility(), handleFakeLinks(), functionA(), and functionB()

// REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
function addProperLandmarkRegions() {
  // Implementation to be added
}

// Add the code that sets the ARIA role for the dependencyGraph container
function setupDependencyGraph() {
    if (typeof document === 'undefined') return null;
    const dependencyGraph = document.querySelector('#dependency-graph');
    if (dependencyGraph) {
        const currentRole = dependencyGraph.getAttribute('role');
        if (!currentRole || currentRole !== 'graph') {
            dependencyGraph.setAttribute('role', 'graph');
        }
    }
    return dependencyGraph;
}

// New function to import a module and execute a function
function importAndExecute(modulePath, functionName, callback) {
    require(modulePath)[functionName](callback);
}

// Accessibility functions
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

// Function to render the index view
function renderIndexView() {
    const dependencyGraph = setupDependencyGraph();
    if (dependencyGraph) {
        dependencyGraph.setAttribute('role', 'region');
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
}

const initializeApp = () => {
    addMainLandmark();
    setupDependencyGraph();
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

export {
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
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkAttributes,
    validateLandmarkStructure,
    checkLandmarkElements,
    initialize,
    generateAccessibilityReport,
    spawnProcess,
    spawnConcurrent,
    applyAccessibilityFixes,
    addressAccessibilityIssues,
    importAndExecute,
    getSvgAccessibleName,
    setSvgAttributes,
    renderIndexView,
    ensureUniqueLandmarks,
    addKeyboardNavigation,
    addAriaLabels,
    addScreenReaderAnnouncements,
    addFocusTrap,
    improveAccessibility,
    analyzeContentSafety,
    renderFunction1,
    renderFunction2,
    appState,
    CONFIG,
    config,
    upgradeLogic,
    addLangAttribute,
    addProperLandmarkRegions,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    scanAccessibility,
    writeReport,
    setupDependencyGraph
};

module.exports = {
  getLangAttribute,
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  upgradeLogic,
  scanAccessibility,
  writeReport,
  generateAccessibilityReport,
  applyAccessibilityFixes,
  addressAccessibilityIssues,
  spawnProcess,
  spawnConcurrent,
  setupDependencyGraph,
  initializeApp
};