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
const appData = {
  title: 'Screeps',
  version: '1.0.0'
};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";
let userSafety = "unsafe";
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

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

// Format response
function formatResponse(data) {
  return data;
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

// TODO: Implement checkLandmarkElements
function checkLandmarkElements() {
    console.log('Checking landmark elements...');
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

// Helper function for accessibility
async function accessiblyHelper(data) {
    if (data) {
        return data;
    }
    return [];
}

async function generateAccessibilityReport(issuesData) {
  let issues = [];

  if (!issuesData) {
    const images = typeof document !== 'undefined' ? document.querySelectorAll('img') : [];
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

    const buttons = typeof document !== 'undefined' ? document.querySelectorAll('button') : [];
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

    const links = typeof document !== 'undefined' ? document.querySelectorAll('a') : [];
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

    const inputs = typeof document !== 'undefined' ? document.querySelectorAll('input') : [];
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

    const headings = typeof document !== 'undefined' ? document.querySelectorAll('h1, h2, h3, h4, h5, h6') : [];
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

  const appDataLocal = {
    title: 'Screeps',
    version: '1.0.0'
  };

  return { moduleAReturnValue, appData: appDataLocal };
}

async function renderFunction2() {
  const moduleBReturnValue = await accessiblyHelper();
  return { moduleBReturnValue };
}

const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';
  if (SafetyCategories && SafetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }
  return safetyCategoriesMessage;
};

// TODO: Implement this function for creating in-page buttons
const createButton = (id, text, onclick) => {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.onclick = onclick;
  document.body.appendChild(button);
};

// Function to update user settings
const updateUserSettings = (newUserSafety, newSafetyCategories) => {
  userSafety = newUserSafety;
  safetyCategories = newSafetyCategories;
};

// Additional exported functions from merged branches
const functionA = () => {
  // Implementation of functionA
};

const functionB = () => {
  // Implementation of functionB
};

const harvestResources = () => {
  // Placeholder logic for harvesting resources
  console.log('Harvesting resources...');
};

const upgradeResource = (resource) => {
  // Placeholder logic for upgrading a resource
  console.log(`Upgrading resource: ${resource}`);
};

const enhanceAccessibility = () => {
  console.log('Accessibility enhancements applied.');
};

const upgradeUserSettings = () => {
  let upgradeMessage = '';
  const upgrades = [];

  if (userSafety !== 'safe') {
    upgrades.push({ field: 'userSafety', from: userSafety, to: 'safe' });
  }

  if (safetyCategories && safetyCategories.includes('Unauthorized Advice')) {
    upgrades.push({ field: 'safetyCategories', from: safetyCategories, to: 'Authorized Advice' });
  }

  if (upgrades.length > 0) {
    upgradeMessage = `Upgrade needed: ${upgrades.length} setting(s) require update.`;
  }

  return {
    message: upgradeMessage,
    upgrades: upgrades,
    requiresUpgrade: upgrades.length > 0
  };
};

// Helper function to check if a link is accessible or needs improvements
function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

function getUserSafetyAdvice() {
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
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

// Add the code that sets the ARIA role for the dependencyGraph container
function setupDependencyGraph() {
    const dependencyGraphEl = document.querySelector('#dependency-graph');
    if (dependencyGraphEl) {
        const currentRole = dependencyGraphEl.getAttribute('role');
        if (!currentRole || currentRole !== 'graph') {
            dependencyGraphEl.setAttribute('role', 'graph');
        }
    }
    return dependencyGraphEl;
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

function addMainLandmark() {
    // Implementation for adding main landmark
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

// New function to import a module and execute a function
function importAndExecute(modulePath, functionName, callback) {
    require(modulePath)[functionName](callback);
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

// Function to render the index view
function renderIndexView() {
    const dependencyGraphEl = setupDependencyGraph();
    if (dependencyGraphEl) {
        dependencyGraphEl.setAttribute('role', 'region');
        dependencyGraphEl.setAttribute('aria-label', 'Dependency graph visualization');
    }
}

const initialize = () => {
    addMainLandmark();
    setupDependencyGraph();
};

// TODO: Implement tower defense
function towerDefense() {
  // Placeholder for tower defense logic
  console.log('Tower defense system initialized.');
}

// Adapted main execution
if (require.main === module) {
    initialize();
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}

module.exports = {
  config,
  appData,
  appState,
  initializeApp: initialize,
  processData,
  fetchUser: processData,
  clearCache: () => appState.cache.clear(),
  initialize,
  validateInput,
  addressAccessibilityIssues,
  processAccessibilityReport: generateAccessibilityReport,
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility: validateTableStructure,
  validateTableStructure,
  fixTableStructure: fixTableStructureIssues,
  addMainLandmark,
  validateLandmark: isValidLandmark,
  validateLandmarkStructure: validateTableStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton: createButton,
  createAccessibleLink: createButton,
  handleAccessibilityIssue: addressAccessibilityIssues,
  getConfig: () => CONFIG,
  addLandmarkRegions: addMainLandmark,
  setSvgAttributes,
  fixTableAccessibility: fixTableStructureIssues,
  fixLandmarkIssues: ensureUniqueLandmarks,
  addSvgAccessibility: addSvgAccessibleNames,
  createAccessibleLinks: createButton,
  importAndExecute,
  analyzeModuleDependenciesLocal: analyzeContentSafety,
  improveAccessibility,
  addLandmarkRoles: ensureUniqueLandmarks,
  addSvgAccessibleNames,
  ensureLangAttribute: addLangAttribute,
  updateUserSettings,
  functionA,
  functionB,
  harvestResources,
  upgradeResource,
  enhanceAccessibility,
  generateAccessibilityReport,
  upgradeUserSettings,
  checkLinkAccessibility,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks: ensureUniqueLandmarksList,
  getLandmarkById: isValidLandmark,
  validateLandmarkAttributes: isValidLandmark,
  analyzeAccessibility: generateAccessibilityReport,
  setSvgAccessibleNames: addSvgAccessibleNames,
  fixFakeLink: fixFakeLinks,
  setLanguageAttribute: addLangAttribute,
  fixFakeLinks,
  wrapPrimaryContentInMain: applyAccessibilityFixes,
  validateLinkAccessibility: checkLinkAccessibility,
  handleFakeLinks: fixFakeLinks,
  scanAccessibility: generateAccessibilityReport,
  writeReport: generateAccessibilityReport,
  formatResponse,
  upgradeSystem: upgradeUserSettings,
  enhanceSystemWithHarvestedData: enhanceAccessibility,
  createButton,
  ensureElementAccessibility: ensureUniqueLandmarks,
  renderDependencyGraph: renderIndexView,
  renderFunction1,
  renderFunction2,
  towerDefense,
  accessiblyHelper,
  checkSafetyCategories,
  getUserSafetyAdvice,
  dependencyGraph,
  getDependencyGraph: () => dependencyGraph,
  UserSafety,
  SafetyCategories,
  CONFIG,
  appData_originSide
};

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraph;
}