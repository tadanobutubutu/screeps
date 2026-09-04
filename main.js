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
<<<<<<< HEAD
const axe = require('axe-core');
const accessiblyHelper = require('./accessibly-helper');

const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data'
};

const axeConfig = {
  rules: {},
=======
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
>>>>>>> origin/main
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
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
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

function calculateLuminance(rgb) {
  const rsrgb = rgb.r / 255;
  const gsrgb = rgb.g / 255;
  const bsrgb = rgb.b / 255;

  const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

async function renderFunction1() {
  // asynchronous operation for rendering function 1
}

async function renderFunction2() {
  // asynchronous operation for rendering function 2
}

function getSvgAccessibleName() {
  // Implementation to be added
}

function setSvgAttributes() {
  // Implementation to be added
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
const appState = {
  initialized: false,
  cache: new Map(),
  lang: 'en'
};

function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

function greet(name) {
  return `Hello, ${name}!`;
}

function rotateBack() {
  console.log('Reverting back the rotation.');
}

function addressAccessibilityIssues() {
  fixAccessibilityIssues();
}

function addBook(title, author, isbn) {
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

  const heading = document.createElement('h2');
  heading.id = 'add-book-heading';
  heading.textContent = 'Add New Book';
  heading.setAttribute('tabindex', '-1');
  form.setAttribute('aria-labelledby', 'add-book-heading');
  form.insertBefore(heading, form.firstChild);

  form.appendChild(submitButton);

  return form;
}

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
    if (rgbaMatch[4] === '100%') {
      // fully opaque
      return {
        r: parseInt(rgbaMatch[1], 10),
        g: parseInt(rgbaMatch[2], 10),
        b: parseInt(rgbaMatch[3], 10)
      };
    } else {
      const [a] = rgbaMatch.slice(4); // a
      const r = parseInt(rgbaMatch[1], 10);
      const g = parseInt(rgbaMatch[2], 10);
      const b = parseInt(rgbaMatch[3], 10);
      return {
        r: Math.round(r * a / 255),
        g: Math.round(g * a / 255),
        b: Math.round(b * a / 255)
      };
    }
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
  return null;
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
    ensureAria(element);
    return true;
  }
  return false;
}

function ensureAria(element) {
  if (!element || !element.getAttribute) return false;
  // Data roles: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
  const requiredRoles = ['button', 'banner', 'dialog'];

  function hasRole(element, role) {
    const currentRole = element.getAttribute('role');
    if (!currentRole) return false;
    return currentRole.toLowerCase() === role;
  }

  function addRole(element, role) {
    const currentRole = element.getAttribute('role');
    if (!currentRole) {
      element.setAttribute('role', role);
      return true;
    }
    return false;
  }

  for (let requiredRole of requiredRoles) {
    if (element && hasRole(element, requiredRole)) continue;
    if (addRole(element, requiredRole)) return true;
  }
  return false;
}

module.exports = {
  CONFIG,
  axeConfig,
  calculateMultiplier,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  analyzeAccessibility,
  generateAccessibilityReport,
  calculateLuminance,
  parseColor,
  ensureElementAccessibility,
  renderFunction1,
  renderFunction2,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  ensureUniqueLandmarksHTML,
  addressAccessibilityIssues,
  applyAccessibilityFixes,
  createInPageButton,
  checkColorContrast,
  getSvgRole,
  setSvgAttributes,
  ensureUniqueLandmarks,
  addressAccessibilityIssuesHTML,
  main,
  greet,
  rotateBack,
  improveAddBookAccessibility
};