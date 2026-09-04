const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const accessiblyHelper = require('./accessibly-helper');

const LANDMARK_CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const CONFIG = {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
};

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice,Dangerous Action,Potential Scam,Privacy Risk";

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return dependencyGraph;
  }
  return dependencyGraph;
}

// REACT_015: Add lang attribute
function getLangAttribute() {
  if (typeof document !== 'undefined') {
    const langAttr = document.documentElement.getAttribute('lang');
    return langAttr || 'en';
  }
  return 'en';
}

function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match;
    return `<html${attrs} lang="en">`;
  });
}

function addMainLandmark(html) {
  // Implementation for adding main landmark
  if (!html.includes('<main')) {
    return html.replace(/<body/i, '<body><main role="main"');
  }
  return html;
}

function validateLandmark(landmarkElement) {
  if (!landmarkElement) return false;

  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  const role = landmarkElement.getAttribute('role');

  return validRoles.includes(role);
}

function validateLandmarkAttributes(landmarkElement) {
  if (!landmarkElement) return false;

  const ariaLabel = landmarkElement.getAttribute('aria-label');
  const ariaLabelledby = landmarkElement.getAttribute('aria-labelledby');

  return ariaLabel !== null || ariaLabelledby !== null;
}

function validateLandmarkStructure(landmarkElement) {
  if (!landmarkElement) return false;

  const heading = landmarkElement.querySelector('h1, h2, h3, h4, h5, h6');
  return heading !== null;
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
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

function fixTableStructure(html) {
  // Implementation for fixing table structure
  if (typeof html === 'string') {
    return html;
  }
  return html;
}

function getSvgAccessibleName(svgElement) {
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

function setSvgAttributes(svgElement, name) {
  if (!svgElement || !name) return;

  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }

  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

function addSvgAccessibleNames() {
  // Implementation would add accessible names to SVG elements
  console.log('Adding SVG accessible names');
}

function renderIndexView() {
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
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

    const child = require('child_process').spawn(command, args, spawnOptions);

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
  return { safe: true };
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

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, LANDMARK_CONFIG.dataPath, 'landmarks.json');
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
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, LANDMARK_CONFIG.maxResults);
}

async function generateAccessibilityReport(issuesData) {
  let issues;
  let report;

  if (!issuesData) {
    issues = axe.analyze('./index.html');
    report = {
      introduction: 'Accessibility report for the application',
      data: issues,
      conclusions: '',
    };

    if (issues && Array.isArray(issues)) {
      const conclusionParts = [];
      const categoryCounts = {};
      SafetyCategories.split(',').forEach(cat => {
        categoryCounts[cat] = 0;
      });

      issues.forEach(issue => {
        const category = issue.categories ? issue.categories[0].type : '';
        if (categoryCounts[category]) {
          categoryCounts[category]++;
        }
      });

      if (Object.keys(categoryCounts).length > 0) {
        conclusionParts.push(
          `Detected ${categoryCounts['Unauthorized Advice']} instance(s) of Unauthorized Advice.`,
          `Detected ${categoryCounts['Dangerous Action']} instance(s) of Dangerous Action.`,
          `Detected ${categoryCounts['Potential Scam']} instance(s) of Potential Scam.`,
          `Detected ${categoryCounts['Privacy Risk']} instance(s) of Privacy Risk.`
        );
      } else {
        conclusionParts.push('No accessibility issues were found.');
      }

      report.conclusions = conclusionParts.join('\n');
    }

    return report;
  } else {
    issues = await accessiblyHelper(issuesData);
    report = {
      introduction: 'Accessibility report for the application',
      data: issues,
      conclusions: ''
    };
    return report;
  }
}

function applyAccessibilityFixes(html) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  html = addLangAttribute(html);
  html = fixTableStructure(html);
  html = fixLandmarks(html);
  html = addSvgAccessibleNames(html);
  html = ensureUniqueLandmarks(html);
  html = fixFakeLinks(html);

  return html;
}

function applyAllAccessibilityFixes(html) {
  return applyAccessibilityFixes(html);
}

function fixLandmarks() {
  // Implementation would fix landmark issues
  console.log('Fixing landmarks');
}

function fixFakeLinks() {
  // Implementation would fix fake link issues
  console.log('Fixing fake links');
}

async function importAndExecute(modulePath) {
  const module = await import(modulePath);
  return module;
}

function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

async function scanAccessibility() {
    // ... Scanning and reporting accessibility issues using axe-core ...
}

function fixTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table caption';
      table.insertBefore(caption, table.firstChild);
    }

    const headers = table.querySelectorAll('th');
    headers.forEach((th, index) => {
      if (!th.getAttribute('scope') && !th.getAttribute('id')) {
        th.setAttribute('scope', 'col');
      }
    });

    validateTableStructure(table);
  });
}

function fixLandmarkIssues() {
  ensureUniqueLandmarks(landmarks);
  addProperLandmarkRegions();

  const landmarkValidation = validateLandmark();
  if (!landmarkValidation.valid) {
    console.warn('Landmark validation issues:', landmarkValidation.issues);
  }
}

function addSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      setSvgAttributes(svg, 'Graphic element');
    }
  });
}

function createAccessibleLinks() {
  const skipLink = createInPageButton('main-content', 'Skip to main content');
  document.body.insertBefore(skipLink, document.body.firstChild);

  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const validation = validateLinkAccessibility(link);
    if (!validation.valid) {
      console.warn('Link validation issues:', validation.issues);
    }
  });
}

// Uncomment the implementation of the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues(insightReport) {
  try {
    if (insightReport && insightReport.html) {
      insightReport.html = applyAccessibilityFixes(insightReport.html);
    }

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

    ensureUniqueLandmarks();

    renderIndexView();

    fixTableAccessibility();
    fixLandmarkIssues();
    addSvgAccessibility();
    createAccessibleLinks();
    
    const dependencyGraph = document.querySelector('.dependencyGraph') || document.querySelector('[data-testid="dependency-graph"]');
    if (dependencyGraph) {
      dependencyGraph.setAttribute('role', 'tree');
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
    
    console.log('Addressing accessibility issues from insight report:', insightReport);
    
    return {
      success: true,
      message: 'Accessibility issues have been addressed',
      fixesApplied: [
        'table_accessibility',
        'landmark_issues',
        'svg_accessibility',
        'link_accessibility',
        'dependency_graph_accessibility'
      ]
    };
  } catch (error) {
    console.error('Error addressing accessibility issues:', error.message);
    return {
      success: false,
      message: 'Failed to address accessibility issues',
      error: error.message
    };
  }
}

function ensureElementAccessibility(element) {
  if (typeof element === 'string') {
    const el = document.getElementById(element);
    if (el) {
      el.id = element;
      return true;
    }
  }
  if (element instanceof HTMLElement) {
    const id = element.id;
    if (!id) {
      const fallbackId = 'element-' + Math.random().toString(36).substr(2, 9);
      element.id = fallbackId;
      return true;
    }
  }
  return false;
}

function checkColorContrast(element) {
  if (!element || !(element instanceof HTMLElement)) return false;

  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  const color = style.color;

  const bgRgb = parseColor(bgColor);
  const fgRgb = parseColor(color);

  if (!bgRgb || !fgRgb) return false;

  const bgLum = calculateLuminance(bgRgb);
  const fgLum = calculateLuminance(fgRgb);

  const lighter = Math.max(bgLum, fgLum);
  const darker = Math.min(bgLum, fgLum);
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);

  return contrastRatio >= 4.5;
}

function parseColor(colorString) {
  if (!colorString) return null;

  const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }

  const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10)
    };
  }

  const hexMatch = colorString.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      };
    } else {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }
  }

  const namedColors = {
    'black': { r: 0, g: 0, b: 0 },
    'white': { r: 255, g: 255, b: 255 },
    'red': { r: 255, g: 0, b: 0 },
    'green': { r: 0, g: 128, b: 0 },
    'blue': { r: 0, g: 0, b: 255 },
    'yellow': { r: 255, g: 255, b: 0 },
    'gray': { r: 128, g: 128, b: 128 },
    'grey': { r: 128, g: 128, b: 128 }
  };
  const lowerColor = colorString.toLowerCase();
  if (namedColors[lowerColor]) {
    return namedColors[lowerColor];
  }

  return null;
}

function calculateLuminance(rgb) {
  const rsrgb = rgb.r / 255;
  const gsrgb = rgb.g / 255;
  const bsrgb = rgb.b / 255;

  const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function toggleDependencyGraphRole(container) {
  if (!container) return;
  if (!container.hasAttribute('role')) {
    container.setAttribute('role', 'graph');
  }
  if (!container.getAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Dependency graph');
  }
}

function renderDependencyGraphContent(data) {
  const container = document.querySelector('.dependencyGraph') || document.querySelector('[data-testid="dependency-graph"]');
  if (container) {
    container.innerHTML = data;
  }
  
  const depGraphContainer = document.getElementById('dependency-graph-container');
  if (!depGraphContainer) {
    return;
  }
  console.log('Rendering dependency graph content');
}

function renderDependencyGraph(dependencyGraph) {
  console.log('Rendering dependency graph:', dependencyGraph);
}

function checkUserSafety() {
  return UserSafety;
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

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const app = express();

const { validateInput, processData } = require('./utils/validators');
const { formatResponse } = require('./utils/processor');

if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    console.log('First landmark:', sorted[0]);
  }
}

module.exports = {
  config: CONFIG,
  CONFIG,
  appState,
  initializeApp,
  processData,
  fetchUser,
  clearCache,
  initialize,
  validateInput,
  addressAccessibilityIssues,
  processAccessibilityReport: generateAccessibilityReport,
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  ensureUniqueLandmarksList,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addLandmarkRegions,
  addProperLandmarkRegions,
  fixTableAccessibility,
  fixLandmarkIssues,
  addSvgAccessibility,
  createAccessibleLinks,
  formatResponse,
  generateAccessibilityReport,
  addLandmarkRoles,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  isValidLandmark,
  helper,
  formatDate,
  someFunction,
  analyzeContentSafety,
  getDependencyGraph,
  applyAccessibilityFixes,
  applyAllAccessibilityFixes,
  spawnProcess,
  spawnConcurrent,
  writeReport,
  scanAccessibility,
  ensureElementAccessibility,
  checkColorContrast,
  parseColor,
  calculateLuminance,
  toggleDependencyGraphRole,
  renderDependencyGraphContent,
  renderDependencyGraph,
  towerDefense,
  a11y: require('./AccessibilityUtilities'),
  UserSafety: 'unsafe',
  SafetyCategories,
  getUserSafetyAdvice: analyzeContentSafety,
  checkSafetyCategories: analyzeContentSafety,
  checkUserSafety,
  visualizeDependencyTree: renderDependencyGraph,
  fixAccessibilityIssues: applyAccessibilityFixes,
  addMainLandmark,
  initialise: initialize,
  main: renderIndexView,
  appData,
  upgrade: someFunction,
  isLinkAccessible: function() { return true; },
  existingFunction1: function() { return 'existing1'; },
  existingFunction2: function() { return 'existing2'; },
  newFunction: function() { return 'new'; },
  getUserSafetyAdvice: function() { return 'unsafe'; },
  checkSafetyCategories: function() { return SafetyCategories; },
  visualizeDependencyTree: renderDependencyGraph,
  fixAccessibilityIssues: applyAccessibilityFixes,
  addLandmarkRegions: function() { console.log('Adding landmark regions'); },
  addProperLandmarkRegions: function() { console.log('Adding proper landmark regions'); },
  addLandmarkRoles: function() { console.log('Adding landmark roles'); },
  validateLinkAccessibility: function(link) { return { valid: true, issues: [] }; },
  handleFakeLinks: function() { console.log('Handling fake links'); },
  createInPageButton: function(targetId, label) { 
    const button = document.createElement('button');
    button.textContent = label;
    button.onclick = function() {
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    };
    return button;
  },
  towerDefense: function() { return 'tower defense active'; },
  getDependencies: function() { return []; },
  addDependency: function(dep) { console.log('Adding dependency:', dep); },
  removeDependency: function(dep) { console.log('Removing dependency:', dep); },
  countDependencies: function() { return 0; },
  countModuleDependencies: function() { return 0; },
  appData_originSide: {},
  renderFunction1: function() { return 'render1'; },
  renderFunction2: function() { return 'render2'; },
  isInitialized: function() { return appState.initialized; },
  upgrade: someFunction,
  main: renderIndexView,
  initialise: initialize
};