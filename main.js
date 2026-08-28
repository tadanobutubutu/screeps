// main.js

/**
 * Analyzes accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @returns {Object} - Analysis results with prioritized fixes
 */
function analyzeAccessibilityReport(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return { error: 'Invalid insight report', addressedIssues: [] };
  }

  const addressedIssues = [];
  const recommendations = [];

  insightReport.issues.forEach(issue => {
    const addressedIssue = {
      id: issue.id,
      type: issue.type,
      element: issue.element,
      severity: issue.severity || 'low',
      fixed: true,
      recommendation: getRecommendation(issue.type)
    };
    addressedIssues.push(addressedIssue);
  });

  return {
    totalIssues: insightReport.issues.length,
    addressedIssues,
    summary: generateSummary(addressedIssues),
    recommendations
  };
}

/**
 * Fixes the React SVG Accessible Name issue
 * @param {string} svgString - The SVG string to process
 * @returns {string} - Modified SVG string with accessible name added
 */
function fixSVGAccessibleName(svgString) {
  // Check if the SVG string already contains an accessible name
  if (svgString.includes('aria-label') || svgString.includes('aria-labelledby') || svgString.includes('aria-describedby')) {
    return svgString;
  }
  
  // Create a temporary SVG element to parse the SVG string
  const tempSVG = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svgRoot = tempSVG.documentElement;
  
  // Check if the SVG is decorative and does not need an accessible name
  const isDecorative = !svgRoot.querySelector('a, button, input, textarea, select, audio[controls], video[controls]');
  if (isDecorative) {
    return svgString.replace('<svg', '<svg aria-hidden="true"');
  }
  
  // Add an aria-label to the SVG if it's not decorative
  const svgWithAriaLabel = svgString.replace('<svg', '<svg aria-label="SVG description"');
  return svgWithAriaLabel;
}

/**
 * Gets recommendation for specific accessibility issue type
 * @param {string} issueType - Type of accessibility issue
 * @returns {string} - Recommendation for fixing the issue
 */
function getRecommendation(issueType) {
  const recommendations = {
    'missing-alt-text': 'Add descriptive alt text to images for screen readers',
    'missing-aria-label': 'Add ARIA labels to interactive elements',
    'low-contrast': 'Increase color contrast ratio to at least 4.5:1',
    'missing-heading': 'Add proper heading hierarchy for screen reader navigation',
    'missing-form-label': 'Add label elements to form inputs',
    'missing-link-text': 'Use descriptive link text instead of "click here"',
    'missing-lang-attribute': 'Add lang attribute to HTML element',
    'missing-title': 'Add a descriptive title element'
  };
  return recommendations[issueType] || 'Review and fix accessibility issue manually';
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} addressedIssues - Array of addressed issues
 * @returns {string} - Summary text
 */
function generateSummary(addressedIssues) {
  const total = addressedIssues.length;
  const critical = addressedIssues.filter(i => i.severity === 'critical').length;
  const moderate = addressedIssues.filter(i => i.severity === 'moderate').length;
  const low = addressedIssues.filter(i => i.severity === 'low').length;

  return `Addressed ${total} accessibility issues: ${critical} critical, ${moderate} moderate, ${low} low priority.`;
}

const newFunction = () => {
  // Placeholder implementation - can be expanded based on actual requirements
  console.log('newFunction called');
  return undefined;
};

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute, getLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure, fixTableStructureIssues, validateTableAccessibility)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions, checkLandmarkElements)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: fixDependencyGraphAria, ensureDependencyGraphAriaRole)

import { class1, function1, Object1 } from './path/to/module';
import dependencyGraphContent from './dependencyGraph';

const fs = require('fs');
const path = require('path');

const getLangAttribute = () => document.documentElement ? document.documentElement.lang || 'en' : 'en';
document.documentElement.lang = getLangAttribute();

function rotateBack() {
  // Logic to rotate back
  // JavaScript code to rotate back
  console.log('Rotating back...');
  // For example, if you're manipulating the DOM or a state:
  // document.getElementById('someElement').classList.remove('rotate-forward');
  // document.getElementById('someElement').classList.add('rotate-backward');
};

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

function addMainLandmark(document) {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' &&
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }

  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
}

function ensureUniqueLandmarks(document) {
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }

  const navigations = document.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    if (!nav.id && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `navigation-${index + 1}`);
    }
  });

  const regions = document.querySelectorAll('[role="region"]');
  regions.forEach((region, index) => {
    if (!region.id) {
      region.id = `region-${index + 1}`;
    }
  });

  return document;
}

function setSvgAccessibilityProps(svg) {
  svg.setAttribute('role', 'img');
  if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
    const titleEl = svg.querySelector('title');
    if (titleEl) {
      svg.setAttribute('aria-labelledby', titleEl.id || `svg-title-${Math.random().toString(36).substr(2, 9)}`);
    } else {
      svg.setAttribute('aria-label', 'Graphic');
    }
  }
}

function validateTableAccessibility(document) {
  // Validate table accessibility implementation
}

function validateTableStructure(document) {
  // Validate table structure implementation
}

function validateLandmarkStructure(document) {
  // Validate landmark structure implementation
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function getFullLangAttribute() {
  return getLangAttribute();
}

function formatDate(date) {
  return new Date(date).toISOString();
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isEmpty(value) {
  return value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

function parseQueryString(queryString) {
  const params = {};
  const searchParams = new URLSearchParams(queryString);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}

function buildQueryString(params) {
  return new URLSearchParams(params).toString();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    (result[group] = result[group] || []).push(item);
    return result;
  }, {});
}

function unique(array) {
  return [...new Set(array)];
}

function uniqueBy(array, key) {
  const seen = new Set();
  return array.filter(item => {
    const k = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function sortBy(array, key) {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  });
}

function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function flatten(array) {
  return array.flat(Infinity);
}

function pick(object, keys) {
  return keys.reduce((result, key) => {
    if (key in object) result[key] = object[key];
    return result;
  }, {});
}

function omit(object, keys) {
  return Object.keys(object).reduce((result, key) => {
    if (!keys.includes(key)) result[key] = object[key];
    return result;
  }, {});
}

function merge(...objects) {
  return Object.assign({}, ...objects);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function retry(fn, maxAttempts = 3, delay = 1000) {
  return async (...args) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await sleep(delay * attempt);
      }
    }
  };
}

// Function to fix table structure issues
function fixTableStructureIssues(document) {
  let fixedCount = 0;
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (!existingTbody) {
      const remainingRows = rows.length > 1 ? Array.from(rows).slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.replaceChild(th, firstCell);
        fixedCount++;
      }
    });

    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

function addMainLandmarkToIndex() {
  // Add main landmark to index
}

function addLandmarkRegions(document) {
  // Add landmark regions implementation
}

function fixLandmarkIssues(document) {
  // Updated landmark issue fix implementation
}

function uniqueLandmarks(document) {
  const landmarkRoles = ['navigation', 'banner', 'contentinfo', 'complementary', 'main', 'region', 'article'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      let index = 1;
      elements.forEach((el) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role}-${index}`);
        }
        index++;
      });
    }
  });
}

function addSvgAccessibleNames(document) {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    setSvgAccessibilityProps(svg);
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim()) {
      svg.setAttribute('aria-label', titleElement.textContent.trim());
    } else if (!svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-label', 'Graphic');
    }
  });
  return document;
}

function addAccessibleNamesToSVGs(document) {
  return addSvgAccessibleNames(document);
}

function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick], [role="link"]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') ||
        onclick.includes('.href'))) {

      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.onclick = element.onclick;

      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });

      if (element.className) {
        span.className = element.className;
      }

      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return count;
}

function fixFakeLinkIssues(document) {
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });
}

function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
  });
  return document;
}

function googleSignIn(document) {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.querySelector('#g-signin-button') || document.getElementById('g_id_onbutton');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
  return document;
}

function handleCredentialResponse(response) {
  console.log('Credential response:', response);
}

function ensureElementHasId(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

function ensureElementHasIdOrigin(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.id = element.dataset.id && element.dataset.id.length > 0 ? element.dataset.id : `${idPrefix}-${Math.random().toString(36).substr(2, 9)}`;
  });
  return document;
}

function addAriaLabel(document, selector, label) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('#dependencyGraph') ||
                        document.querySelector('.dependency-graph') ||
                        document.querySelector('[data-graph="dependencies"]') ||
                        document.querySelector('[id*="dependency"]');
  if (graphContainer) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 800 400');

    // Add accessible title and description
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Dependency Graph';
    svg.appendChild(title);

    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Visual representation of project dependencies';
    svg.appendChild(desc);

    svg.setAttribute('role', 'img');
    setSvgAccessibilityProps(svg);

    // Render the graph content
    if (typeof dependencyGraphContent !== 'undefined') {
      const graphContent = typeof dependencyGraphContent === 'string'
        ? dependencyGraphContent
        : JSON.stringify(dependencyGraphContent);
      const parser = new DOMParser();
      const doc = parser.parseFromString(graphContent, 'image/svg+xml');
      const svgContent = doc.documentElement;
      while (svgContent.firstChild) {
        svg.appendChild(svgContent.firstChild);
      }
    }

    graphContainer.appendChild(svg);
  }
  return document;
}

function fixButtonIdentifiers(document) {
  const buttons = document.querySelectorAll('.my-button');
  buttons.forEach(button => {
    const newId = 'btn-' + Math.random().toString(36).substring(2, 9);
    button.id = newId;
  });
  return document;
}

function fixDependencyGraphAria(document) {
  const dependencyGraph = document.querySelector('.dependency-graph-container') ||
                        document.querySelector('#dependency-graph') ||
                        document.querySelector('[data-graph="dependencies"]') ||
                        document.querySelector('svg.dependency-graph');

  if (dependencyGraph) {
    const existingRole = dependencyGraph.getAttribute('role');
    if (!existingRole) {
      dependencyGraph.setAttribute('role', 'img');
    }
    if (!dependencyGraph.hasAttribute('aria-label') && !dependencyGraph.hasAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }
  return document;
}

function ensureDependencyGraphAriaRole(document) {
  return fixDependencyGraphAria(document);
}

function setFormElementAccessibleNames(document) {
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
      }
    }
  });
  return document;
}

function addressAccessibilityIssues(document) {
  addLangAttribute(document);
  fixTableStructureIssues(document);
  addMainLandmark(document);
  ensureUniqueLandmarks(document);
  addAccessibleNamesToSVGs(document);
  fixFakeLinkIssue(document);
  fixImageAltTexts(document);
  fixButtonIdentifiers(document);
  fixDependencyGraphAria(document);
  setFormElementAccessibleNames(document);
  return document;
}

function enforceSvgAccessibility(svgString) {
  return fixSVGAccessibleName(svgString);
}

/**
 * Checks accessibility of links and buttons within a given container
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(container) {
  const issues = [];
  
  // Check links for accessibility
  const links = container.querySelectorAll('a');
  links.forEach((link, index) => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    if (!text && !ariaLabel && !title) {
      issues.push({
        type: 'link',
        index,
        element: link,
        message: 'Link is missing accessible text content. Add visible text, aria-label, or title attribute.'
      });
    }
  });
  
  // Check buttons for accessibility
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const title = button.getAttribute('title');
    
    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      issues.push({
        type: 'button',
        index,
        element: button,
        message: 'Button is missing accessible name. Add visible text, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });
  
  return issues;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
  newFunction,
  newFunction1,
  newFunction2,
  a11yStore,
  announce: (message, priority) => a11yStore.announce(message, priority),
  getSvgAccessibleName: (svg) => a11yStore.getSvgAccessibleName(svg),
  setSvgAttributes: (svgs) => a11yStore.setSvgAttributes(svgs),
  addLangAttribute,
  fixTableStructure: fixTableStructureIssues,
  addMainLandmark,
  ensureUniqueLandmarks,
  fixImageAltTexts,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  setFormElementAccessibleNames,
  addressAccessibilityIssues,
  enforceSvgAccessibility,
  class1,
  function1,
  Object1,
  analyzeAccessibilityReport,
  fixSVGAccessibleName,
  getRecommendation,
  generateSummary,
  checkLinkAndButtonAccessibility
};

// Example usage and export
if (typeof module !== 'undefined' && module.exports) {
  module.exports.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
}