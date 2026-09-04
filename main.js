const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const {
  renderGraphIndex,
  checkAccessibilityForReport,
  trapFocus,
  addLandmarkRegions,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark
} = require('./utilities');
const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data'
};

const axe = require('axe-core');

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  },
  silent: true
};

function calculateMultiplier(factor) {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return factor * safetyCategories.length;
}

async function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

/**
 * Validates table structure
 */
function validateTableStructure() {
  // Implementation to be added
}

/**
 * Fixes table structure issues
 */
function fixTableStructure() {
  // Implementation to be added
}

/**
 * Adds main landmark to page
 */
function addMainLandmark() {
  // Implementation to be added
}

/**
 * Validates landmark accessibility
 */
function validateLandmark() {
  // Implementation to be added
}

/**
 * Validates landmark structure
 */
function validateLandmarkStructure() {
  // Implementation to be added
}

/**
 * Validates landmark attributes
 */
function validateLandmarkAttributes() {
  // Implementation to be added
}

/**
 * Gets SVG accessible name
 * @returns {string} The accessible name for SVG element
 */
function getSvgAccessibleName() {
  // Implementation to be added
}

/**
 * Sets SVG attributes for accessibility
 */
function setSvgAttributes() {
  // Implementation to be added
}

/**
 * Ensures unique landmarks on the page
 */
function ensureUniqueLandmarks() {
  // Implementation to be added
}

/**
 * Creates an in-page navigation button
 */
function createInPageButton() {
  // Implementation to be added
}

/**
 * Validates link accessibility
 */
function validateLinkAccessibility() {
  // Implementation to be added
}

/**
 * Handles fake links on the page
 */
function handleFakeLinks() {
  // Implementation to be added
}

/**
 * Adds proper landmark regions to the page
 */
function addProperLandmarkRegions() {
  // Implementation to be added
}

function visualizeModuleRelationships(modules) {
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function loadLandmarks() {
  try {
    const filePath = path.join(config.dataPath, 'landmarks.json');
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

  const validLandmarks = landmarks.filter(validateLandmark);
  const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
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

function analyzeAccessibility(node) {
  return axe(node, axeConfig);
}

function getAxeResults(issuesData) {
  return issuesData.nodes.map(node => {
    const { violations, bestPractices } = node;
    const results = [];

    violations.forEach(violation => {
      results.push({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        suggestedFixed: violation.required ? 'Required' : 'Recommended',
        helpUrl: violation.helpUrl,
        helpText: violation.help,
        nodes: violation.nodes || []
      });
    });

    bestPractices.forEach(bestPractice => {
      results.push({
        id: bestPractice.id,
        impact: bestPractice.impact,
        description: bestPractice.description,
        helpUrl: bestPractice.helpUrl,
        helpText: bestPractice.help,
      });
    });

    return {
      nodeId: node.id,
      results
    };
  });
}

function generateAccessibilityReport(issuesData) {
  const report = {
    introduction: 'Accessibility report for the application',
    data: getAxeResults(issuesData).flatMap(item => item.results),
    conclusions: '',
  };

  return report;
}

let dependencyGraph = {};

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return {
    graph: dependencyGraph,
    status: Object.keys(dependencyGraph).length > 0 ? 'active' : 'inactive'
  };
}

const appState = {
  initialized: false,
  cache: new Map()
};

const initialise = () => {
  appState.initialized = true;
  console.log('App initialized');
};

function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  },

  addBook: function(title, author, isbn) {
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add Book Form');

    const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
    const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
    const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'book-title');
    titleLabel.textContent = 'Book Title';
    form.appendChild(titleLabel);
    form.appendChild(titleInput);

    const titleHelp = document.createElement('span');
    titleHelp.id = 'title-help';
    titleHelp.className = 'sr-only';
    titleHelp.textContent = 'Enter the title of the book';
    form.appendChild(titleHelp);

    const authorLabel = document.createElement('label');
    authorLabel.setAttribute('for', 'book-author');
    authorLabel.textContent = 'Author';
    form.appendChild(authorLabel);
    form.appendChild(authorInput);

    const isbnLabel = document.createElement('label');
    isbnLabel.setAttribute('for', 'book-isbn');
    isbnLabel.textContent = 'ISBN';
    form.appendChild(isbnLabel);
    form.appendChild(isbnInput);

    const isbnHelp = document.createElement('span');
    isbnHelp.id = 'isbn-help';
    isbnHelp.className = 'sr-only';
    isbnHelp.textContent = 'Enter the 13-digit ISBN';
    form.appendChild(isbnHelp);

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('aria-label', 'Add Book');
    submitButton.textContent = 'Add Book';

    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.id = 'add-book-status';
    status.className = 'sr-only';
    form.appendChild(status);

    const container = document.getElementById('add-book-container') || document.body;
    container.appendChild(form);

    titleInput.focus();

    const heading = document.createElement('h2');
    heading.id = 'add-book-heading';
    heading.textContent = 'Add New Book';
    heading.setAttribute('tabindex', '-1');
    form.setAttribute('aria-labelledby', 'add-book-heading');
    form.insertBefore(heading, form.firstChild);

    form.appendChild(submitButton);

    return form;
  }
};

function createAccessibleInput(type, name, labelText, value) {
    const input = document.createElement('input');
    input.type = type;
    input.id = name;
    input.name = name;
    if (value !== undefined) input.value = value;
    input.setAttribute('aria-required', 'true');
    return input;
}

function addLangAttribute(html) {
    return html;
}

function fixTableStructure(html) {
    return html;
}

function fixLandmarks(html) {
    return html;
}

function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const svgRegex = /<svg[^>]*>.*?<\/svg>/gi;
    let offset = 0;
    let index = 0;

    html = html.replace(svgRegex, (fullMatch, ...args) => {
        const svgStart = args[args.length - 2];
        const svgEnd = args[args.length - 1];
        const attrs = fullMatch.substring(0, fullMatch.indexOf('>') + 1);

        const svgContent = html.substring(svgStart, svgEnd + 6);
        const hasTitle = /<title/i.test(svgContent);
        const hasAriaLabel = /\baria-label=/i.test(attrs);
        const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs);

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
            const oldSvgLength = svgContent.length;
            html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength);
            offset += newSvg.length - oldSvgLength;
        }
        index++;
        return fullMatch;
    });

    return html;
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarksHTML(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(/^</, '<' + tag).replace(`<${tag}`, `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarksHTML(result);
    result = fixFakeLinks(result);
    return result;
}

function addressAccessibilityIssuesHTML(insightReport) {
    if (insightReport && insightReport.html) {
        insightReport.html = applyAccessibilityFixes(insightReport.html);
    }
    console.log('Addressing accessibility issues from insight report:', insightReport);
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

// Helper function to check color contrast
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

// Helper function to parse color strings to RGB
function parseColor(colorString) {
  if (!colorString) return null;

  // Handle rgb() format
  const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }

  // Handle rgba() format (ignore alpha)
  const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10)
    };
  }

  // Handle hex format
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

  // Handle named colors (limited support)
}

async function renderFunction1() {
  const moduleAReturnValue = await accessiblyHelper();

  function ensureContainerAria(container) {
    if (!container) return;
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'img');
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

  const depAnalysis = await analyzeModuleDependencies(['moduleA', 'moduleB']);
  const visualization = visualizeModuleRelationships(['moduleA', 'moduleB']);

  return { moduleBReturnValue, depAnalysis, visualization };
}

function getSvgRole(svgElement) {
  if (!svgElement) return '';
  return svgElement.getAttribute('role') || 
         svgElement.getAttribute('aria-label') || 
         svgElement.getAttribute('aria-labelledby') || 
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
  const landmarks = document.querySelectorAll('nav, main, aside, footer');
  const seen = new Map();
  
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    if (seen.has(tag)) {
      landmark.setAttribute('id', `${tag}-${seen.get(tag)}`);
      seen.set(tag, seen.get(tag) + 1);
    } else {
      seen.set(tag, 1);
    }
  });
}

function addressAccessibilityIssues() {
  const rootContainer = document.querySelector('#root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  const skipLink = document.querySelector('.skip-link');
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
    if (!button.getAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  function cleanupFocusStyles() {
    document.body.classList.remove('keyboard-nav');
  }

  if (typeof a11y !== 'undefined') {
    a11y.announce('Welcome to the bot!', 'assertive');
  }

  const imageElement = document.querySelector('#main-image');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  const divElement = document.querySelector('#list-container');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

let isInitialized = false;
const appData_originSide = {};
const appState_full = {
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

function findLandmarkById(landmarks, id) {
  return landmarks.find(landmark => landmark.id === id);
}

function someFunction() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories.length;
}

// TODO: Implement the required changes to improve accessibility for adding a new book
function improveAddBookAccessibility() {
  return main.addBook('Untitled', 'Unknown Author', '');
}

module.exports = {
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  getDependencyGraph,
  generateAccessibilityReport,
  analyzeAccessibility,
  renderFunction1,
  renderFunction2,
  calculateMultiplier,
  loadLandmarks,
  processLandmarks,
  ensureUniqueLandmarksList,
  validateLandmark,
  getAxeResults,
  getSvgRole,
  setSvgAttributes,
  ensureUniqueLandmarks,
  addressAccessibilityIssues,
  ensureUniqueLandmarksHTML,
  addressAccessibilityIssuesHTML,
  applyAccessibilityFixes,
  helper,
  formatDate,
  validateInput,
  processData,
  sortLandmarks,
  findLandmarkById,
  someFunction,
  CONFIG,
  config,
  appState,
  improveAddBookAccessibility,
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  checkColorContrast,
  parseColor,
  createInPageButton
};