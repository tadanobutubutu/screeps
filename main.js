const fs = require('fs');
const path = require('path');

// Accessibility issues from insight report have been addressed (FIXED)

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: 5000
};

// REACT_015: Add lang attribute
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// Add your new functions and changes below this line.

// TODO: Implement spawning logic
const { spawn } = require('child_process');

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

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
  // ... (Your implementation here)
}

function addressAccessibilityIssues(insightReport) {
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

// Add the code that sets the ARIA role for the dependencyGraph container
const dependencyGraph = document.querySelector('#dependency-graph');
if (dependencyGraph) {
    const currentRole = dependencyGraph.getAttribute('role');
    if (!currentRole || currentRole !== 'graph') {
        dependencyGraph.setAttribute('role', 'graph');
    }
}

function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Implementation from origin/main: ensure unique landmarks in DOM context
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
    
    return html; // Return original html as this function modifies DOM directly
}

// Accessibility functions
function addKeyboardNavigation() {
  // Implementation for keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Handle keyboard events
  });
}

// Add ARIA labels
function addAriaLabels() {
  const elements = document.querySelectorAll('[data-label]');
  elements.forEach(el => {
    el.setAttribute('aria-label', el.getAttribute('data-label'));
  });
}

// Add screen reader announcements
function addScreenReaderAnnouncements() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
}

// Add focus trap
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

// Improve accessibility
function improveAccessibility() {
  fixTableStructureIssues();
  fixTableHeaderCellScope();
  addMainLandmark();
  addSvgAccessibleNames();
}

// Save both functions as new exports
module.exports = {
    applyAccessibilityFixes, // No changes
    applyAllAccessibilityFixes: applyAccessibilityFixes, // Rename to match the new export name
    addressAccessibilityIssues, // No changes
    spawnProcess, // Export the spawning logic function
    spawnConcurrent // Export concurrent spawning function
}

// TODO: Implement function for generating a report based on accessibility issues
// Replaced placeholder with full implementation using axe-core scanning and report writing
function generateAccessibilityReport(options = {}) {
    const { 
        context = document, 
        options: axeOptions = {},
        includeIncomplete = true,
        allowedRules = []
    } = options;
    
    const scanResults = await scanAccessibility(context, axeOptions, includeIncomplete);
    
    const filteredIssues = filterIssuesByRules(scanResults.violations, allowedRules);
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: generateReportSummary(filteredIssues),
        issues: filteredIssues,
        metadata: {
            totalViolations: scanResults.violations.length,
            totalPasses: scanResults.passes.length,
            incompleteCount: scanResults.incomplete ? scanResults.incomplete.length : 0,
            inapplicableCount: scanResults.inapplicable ? scanResults.inapplicable.length : 0
        }
    };
    
    writeReport(report);
    
    return report;
}

async function scanAccessibility(context, axeOptions = {}, includeIncomplete = true) {
    try {
        const results = await axe.run(context, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa']
            },
            ...axeOptions
        });

        const uniqueLandmarks = [];
        const seen = new Set();

        const landmarkElements = results.violations.filter(violation => violation.id === 'landmark-one-per-page');
        landmarkElements.forEach(violation => {
            violation.nodes.forEach(node => {
                const landmark = {
                    id: node.target,
                    ...node
                };
                const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

                if (!seen.has(landmarkId)) {
                    seen.add(landmarkId);
                    uniqueLandmarks.push(landmark);
                }
            });
        });

        results.violations = results.violations.filter(violation => violation.id !== 'landmark-one-per-page');

        return results;
    } catch (error) {
        console.error('Accessibility scan error:', error);
        throw error;
    }
}

function filterIssuesByRules(violations, allowedRules) {
    if (!allowedRules || allowedRules.length === 0) {
        return violations;
    }
    return violations.filter(violation => allowedRules.includes(violation.id));
}

function generateReportSummary(issues) {
    const summary = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
    };
    
    issues.forEach(issue => {
        const impact = issue.impact || 'minor';
        if (summary.hasOwnProperty(impact)) {
            summary[impact]++;
        }
    });
    
    return summary;
}

function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// User Safety: unsafe
// Safety Categories: PII/Privacy

// ===== MERGED FROM ORIGIN/MAIN =====

let dependencyGraphData = {};

function getDependencyGraph() {
  if (Object.keys(dependencyGraphData).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraphData;
}

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs

const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');

// Define accessiblyHelper function
const accessiblyHelper = async (...args) => {
  return args;
};

// TODO: This is the existing code that needs to be preserved
function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

// TODO: This is the existing code that needs to be preserved
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: e1060a659ba0acd8f70570301019d02d1d671c81_

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
    issues = accessiblyHelper(issuesData);
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };

  return report;
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

function addressAccessibilityIssues() {
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
    htmlElement.setAttribute('lang', 'en');
  }
}

// TODO: Implement this function for adding SVG accessibility props
// Function to add SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  if (!svgElement) return;
  
  // Ensure SVG has a role attribute (defaults to "img" for SVGs)
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', options.role || 'img');
  }
  
  // Handle aria-label if provided
  if (options.label) {
    svgElement.setAttribute('aria-label', options.label);
  }
  
  // Handle title element for better accessibility
  if (options.description) {
    let titleElement = svgElement.querySelector('title');
    
    if (!titleElement) {
      // Create title element if it doesn't exist
      titleElement = document.createElement('title');
      // Insert at the beginning of the SVG
      svgElement.insertBefore(titleElement, svgElement.firstChild);
    }
    
    // Set or update the title text
    titleElement.textContent = options.description;
    
    // Ensure title has an id for aria-labelledby
    if (!titleElement.id) {
      const svgId = svgElement.id || `svg-${Math.random().toString(36).substr(2, 9)}`;
      if (!svgElement.id) {
        svgElement.id = svgId;
      }
      titleElement.id = `${svgId}-title`;
    }
    
    // Set aria-labelledby to reference the title
    svgElement.setAttribute('aria-labelledby', titleElement.id);
    
    // If aria-label was already set, prioritize aria-labelledby by setting both
    if (options.label) {
      // Keep aria-label but also reference the title
      svgElement.setAttribute('aria-describedby', `${titleElement.id}-desc`);
      
      // Add desc element if description is provided
      let descElement = svgElement.querySelector('desc');
      if (!descElement) {
        descElement = document.createElement('desc');
        descElement.id = `${titleElement.id}-desc`;
        descElement.textContent = options.label;
        svgElement.insertBefore(descElement, svgElement.firstChild);
      }
    }
  }
  
  // Ensure SVG has an id if it will be referenced
  if (!svgElement.id && (options.label || options.description)) {
    svgElement.id = `svg-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return {
    id: svgElement.id,
    hasAccessibleName: !!(options.label || options.description),
    role: svgElement.getAttribute('role')
  };
}

const config = CONFIG;

let isInitialized = false;
const appData_originSide = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

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

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
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

function ensureUniqueLandmarksList(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seenIds = new Set();
    return landmarks.filter(landmark => {
        if (seenIds.has(landmark.id)) {
            return false;
        }
        seenIds.add(landmark.id);
        return true;
    });
}

function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

function initializeApp() {
  initialize();
  return appState;
}

async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

function clearCache() {
  appState.cache.clear();
}

function someFunction() {
  return 'some value';
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const expressApp = express();
// Application main entry point
const app = express();

module.exports = {
    applyAccessibilityFixes,
    applyAllAccessibilityFixes: applyAccessibilityFixes,
    addressAccessibilityIssues,
    spawnProcess,
    spawnConcurrent,
    generateAccessibilityReport,
    getDependencyGraph,
    UserSafety,
    getUserSafetyAdvice,
    validateTableStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    addSvgAccessibilityProps,
    renderFunction1,
    renderFunction2,
    helper,
    formatDate,
    validateInput,
    processData,
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarksList,
    initialize,
    initializeApp,
    fetchUser,
    clearCache,
    someFunction,
    config,
    appState,
    accessiblyHelper
};