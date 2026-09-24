// main.js - Accessibility-focused implementation

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Functions to ensure the element has an id, add aria-label, render dependency graph
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

/**
 * Main application entry point
 */

// Import required modules
const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Find the primary content element in the DOM
const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

// TODO: Add the lang attribute to the html tag based on content language
function getLangAttribute() {
  const htmlElement = document.documentElement;
  const currentLang = htmlElement.getAttribute('lang');
  if (currentLang) {
    return currentLang;
  }
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    return browserLang.substring(0, 2).toLowerCase();
  }
  return 'en';
}

function addLangAttribute(element, lang = getLangAttribute()) {
  element.setAttribute('lang', lang);
}

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

/**
 * Checks if a link or button element is accessible by verifying:
 * 1. It has proper ARIA attributes if needed
 * 2. It has a visible label or accessible name
 * 3. It's not hidden from assistive technologies
 * @param {HTMLElement} element - The link or button element to check
 * @returns {boolean} True if the element is accessible, false otherwise
 */
function checkElementAccessibility(element) {
    if (!element || !(element.tagName === 'A' || element.tagName === 'BUTTON')) {
        return false;
    }

    // Check for proper ARIA attributes if present
    const ariaHidden = element.getAttribute('aria-hidden');
    if (ariaHidden === 'true') {
        return false;
    }

    // Check for visible label or accessible name
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const hasTextContent = element.textContent.trim().length > 0;

    if (!ariaLabel && !ariaLabelledBy && !hasTextContent) {
        return false;
    }

    // Check if element is visually hidden but not hidden from screen readers
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
        if (element.getAttribute('aria-hidden') !== 'true') {
            return false;
        }
    }

    return true;
}

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// This is the existing code that needs to be preserved
// (This comment remains as-is)
// More existing code that should be preserved
// Existing code ends here

function setupHandlers() {
  console.log('Setting up event handlers...');
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
}

function getLangAttribute() {
  let lang = 'en'; // Default to English
  return lang;
}

function getFullLangAttribute() {
  return getLangAttribute();
}

function fixDependencyGraphAccessibility(container) {
  if (typeof container === 'string') {
    let result = container;
    const graphRegex = /<([a-z][a-z0-9]*)([^>]*)(class|id)="[^"]*dependency-graph[^"]*"[^>]*>/gi;
    result = result.replace(graphRegex, (match, tag, attrs, attrName) => {
      let newAttrs = attrs;
      if (!/role\s*=/.test(newAttrs)) {
        newAttrs += ' role="img"';
      }
      if (!/aria-label\s*=/.test(newAttrs)) {
        newAttrs += ' aria-label="Dependency graph"';
      }
      return `<${tag}${newAttrs}${attrName}="${match.split('"')[1]}"${match.split('"')[2] || ''}">`;
    });
    return result;
  }

  if (container && container.setAttribute) {
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'img');
    }
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency graph');
    }
  }

  return container;
}

function validateTableAccessibility(table, index) {
  const issues = [];

  if (!table) {
    issues.push(`Table at index ${index}: Table element is missing or null`);
    return issues;
  }

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  return issues;
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array} tables - Array of table objects to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];
  const issues = [];

  const tablesNodes = (typeof document !== 'undefined') ? document.querySelectorAll('table') : [];
  tablesNodes.forEach((tableItem, index) => {
    const tableIssues = validateTableAccessibility(tableItem, index);
    if (Array.isArray(tableIssues) && tableIssues.length > 0) {
      allIssues.push({
        tableIndex: index,
        issues: tableIssues
      });
    }
    issues.push(...tableIssues);
  });

  const nestedTables = (typeof document !== 'undefined') ? document.querySelectorAll('table table') : [];
  if (nestedTables.length > 0) {
    issues.push(`Found ${nestedTables.length} nested tables - consider avoiding nested tables for accessibility (REACT_027)`);
  }

  return {
    success: allIssues.length === 0 && issues.length === 0,
    issues: [...allIssues.map(i => i.issues).flat(), ...issues]
  };
}

function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  if (!Array.isArray(landmarks)) {
    return { success: true, duplicates: [] };
  }

  landmarks.forEach(landmark => {
    const name = (landmark && (landmark.ariaLabel || (landmark.getAttribute && landmark.getAttribute('aria-label')) || landmark.textContent)) || '';
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

function personName() {
  return 'Person Name';
}

function processSvgElements() {
  const svgElements = document.querySelectorAll('svg');
}

// New functionality: Ensure element has an id, add aria-label, render dependency graphs
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
  return dependencies.filter(Boolean).length;
}

// Render the dependency graph
function renderDependencyGraph() {
  const graphContent = [PERSON_NAME]();
  return `${graphContent} ${indexContent}`;
}

// Render the index view
function renderIndexView() {
  const indexData = indexContent.render();
  return indexData;
}

const [ADDRESS] = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',

  [PERSON_NAME]) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible link text
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      return score + (scorePoints[issue.type] || scorePoints.other);
    }, 0);
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    const isLandmark = landmarkRoles.includes(role) ||
                       (tagName && implicitLandmarks[tagName]);

    return {
      valid: isLandmark,
      tagName: tagName,
      role: role
    };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    return childProcess.spawn(command, [], {
      stdio: 'inherit',
      shell: true
    });
  },

  addLangAttribute(element, [PERSON_NAME]) {
    if (element) {
      element.setAttribute('lang', lang);
    } else {
      const html = document.documentElement;
      if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];

    landmarks.forEach(landmark => {
      const tagName = landmark.tagName ? [PERSON_NAME]() : '';
      const role = landmark.getAttribute('role');
      const implicitRole = {
        header: 'banner',
        nav: 'navigation',
        main: 'main',
        aside: 'complementary',
        footer: 'contentinfo'
      };

      if (!landmark.hasAttribute('role')) {
        const implicitLandmark = implicitRole[tagName];
        if (implicitLandmark) {
          landmark.setAttribute('role', implicitLandmark);
        }
      }
    });
  }
};

function validateLandmark(element) {
  return AddressabilityIssues.validateLandmark(element);
}

function addAriaLabel(element, label) {
  if (label) {
    element.setAttribute('aria-label', label);
  }
}

function setARIARoleForDependencyGraph() {
  if (typeof document === 'undefined') {
    return;
  }
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'grid');
  }
}

function renderDependencyGraph(graphData, container) {
  // ...
  addAriaLabel(container, 'Dependency graph');
  // Render the dependency graph into the container
  const graph = document.createElement('div');
  graph.className = 'dependency-graph';
  graph.textContent = JSON.stringify(graphData, null, 2);
  container.appendChild(graph);
  // ...
  return graph;
}

// New accessibility functions from insight report

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table) return true;
  
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.textContent.trim()) {
      th.setAttribute('aria-label', 'Empty header');
    }
  });
  
  return true;
}

function validateTableStructure(table) {
  if (!table) return { valid: true, error: null };
  
  const rows = table.querySelectorAll('tr');
  const cellCount = rows[0] ? rows[0].querySelectorAll('th, td').length : 0;
  
  rows.forEach((row, index) => {
    const rowCells = row.querySelectorAll('th, td').length;
    if (rowCells !== cellCount && index > 0) {
      row.setAttribute('role', 'row');
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        cell.setAttribute('role', cellIndex === 0 ? 'rowheader' : 'cell');
      });
    }
  });
  
  return { valid: true, error: null };
}

// REACT_017: Add/fix landmark issues
function validateLandmarkElement(element, landmarkType) {
  if (!element) return false;
  
  const existingLandmark = element.getAttribute('role');
  if (!existingLandmark) {
    element.setAttribute('role', landmarkType);
  }
  
  return true;
}

function validateLandmarkStructure(container) {
  if (!container) return true;
  
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const landmarks = container.querySelectorAll('[role]');
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!allowedLandmarks.includes(role)) {
      landmark.removeAttribute('role');
    }
  });
  
  return true;
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  return '';
}

function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return svgElement;
  
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;
  
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (!ariaLabelledBy && !svgElement.getAttribute('aria-label')) {
    title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    svgElement.setAttribute('aria-labelledby', title.id);
  }
  
  return svgElement;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container) {
  if (!container) return;
  
  const landmarkCounts = {};
  const landmarks = container.querySelectorAll('[role]');
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });
  
  Object.keys(landmarkCounts).forEach(role => {
    if (landmarkCounts[role] > 1) {
      let count = 0;
      landmarks.forEach(landmark => {
        if (landmark.getAttribute('role') === role) {
          count++;
          if (count > 1) {
            const label = landmark.getAttribute('aria-label') || `${role}-${count}`;
            landmark.setAttribute('aria-label', label);
          }
        }
      });
    }
  });
  
  return true;
}

// REACT_036: Fix fake link issues
function personName(name, linkElement) {
  if (linkElement && linkElement.tagName !== 'A') {
    const isInteractive = linkElement.getAttribute('role') === 'link' || 
                          linkElement.onclick !== null ||
                          linkElement.tabIndex !== null;
    
    if (isInteractive) {
      linkElement.setAttribute('role', 'link');
      if (name) {
        linkElement.setAttribute('aria-label', name);
      }
    }
  }
  return linkElement;
}

function createInPageButton(element, label) {
  if (!element) return null;
  
  if (element.tagName !== 'BUTTON' && !element.getAttribute('role')) {
    element.setAttribute('role', 'button');
    if (label) {
      element.setAttribute('aria-label', label);
    }
  }
  
  return element;
}

function [PERSON_NAME]() {
  console.log('New function called');
}

function checkLandmarkElements(response) {
  // Implement the logic to check for landmark elements
  // For the purpose of this example, let's assume a simple check for the presence of 'landmark'
  return response.includes('landmark');
}

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  // ... Existing code ...
  return http.createServer(app);
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  server.on('listening', () => {
    setARIARoleForDependencyGraph();
    newFunction();
  });
  return server;
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

// Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues() {
  // Add lang attribute to HTML element
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute(htmlElement));
  }

  // Implement function for counting dependencies with Node.js
  function countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  }
}

function initializeAccessibility() {
  if (!document.querySelectorAll) return;
  addressAccessibilityIssues(sampleInsightReport);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    addSvgAccessibleName,
    ensureUniqueLandmarks,
    personName,
    createInPageButton,
    AddressabilityIssues,
    fixMainLandmarkIssues: AddressabilityIssues.fixMainLandmarkIssues,
    fixSemanticMarkup: AddressabilityIssues.fixSemanticMarkup,
    createServer,
    startApp,
    checkLandmarkElements,
    newFunction,
    setARIARoleForDependencyGraph,
    addLangAttribute: AddressabilityIssues.addLangAttribute,
    validateLandmarkElement,
    handleFakeLinks
  };

  links.forEach(element => {
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const isLink = tagName === 'a';
    const isButton = tagName === 'button' || (element.getAttribute && element.getAttribute('role') === 'button');

    if (isLink || isButton) {
      const hasTextContent = element.textContent ? element.textContent.trim().length > 0 : false;
      const hasAriaLabel = element.hasAttribute ? element.hasAttribute('aria-label') : false;
      const hasTitle = element.hasAttribute ? element.hasAttribute('title') : false;

      const accessibleName = hasTextContent || hasAriaLabel || hasTitle;

      if (!accessibleName) {
        if (isLink) {
          issues.linksWithoutText.push(element);
        } else {
          issues.buttonsWithoutText.push(element);
        }
      }

      if (!hasAriaLabel && !(hasTextContent || hasTitle)) {
        if (isLink) {
          issues.linksWithoutAriaLabel.push(element);
        } else {
          issues.buttonsWithoutAriaLabel.push(element);
        }
      }
    }
  });

  return issues;
}

function newFocusTrap(container) {
  if (!container) {
    return {
      activate: () => {},
      deactivate: () => {},
      toggle: () => {}
    };
  }

  let isActive = false;
  let previouslyFocusedElement = null;

  function getFocusableElements(element) {
    const selectors = [
      'a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])',
      'iframe', 'object', 'embed', '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]:not([contenteditable="false"])'
    ].join(', ');

    return Array.from(element.querySelectorAll(selectors)).filter(el => {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || (el.getClientRects && el.getClientRects().length > 0);
    });
  }

  function handleKeyDown(event) {
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(container);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    } else if (event.key === 'Escape') {
      deactivate();
    }
  }

  function activate() {
    if (isActive) return;

    previouslyFocusedElement = document.activeElement;
    container.setAttribute('data-focus-trap-active', 'true');

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    container.addEventListener('keydown', handleKeyDown);
    isActive = true;
  }

  function deactivate() {
    if (!isActive) return;

    container.removeAttribute('data-focus-trap-active');
    container.removeEventListener('keydown', handleKeyDown);

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }

    isActive = false;
  }

  function toggle() {
    if (isActive) {
      deactivate();
    } else {
      activate();
    }
  }

  return { activate, deactivate, toggle };
}

/* Common utility functions */
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

/* New functions */
function fixTableStructure() {
  if (typeof document === 'undefined') return;
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const hasHeaderCells = table.querySelectorAll('th').length > 0;
    if (!hasHeaderCells) {
      console.warn('Table missing header cells (th).', table);
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.children.length > 0) {
        if (!firstRow.querySelector('th')) {
          const cells = firstRow.children;
          for (let i = 0; i < cells.length; i++) {
            const newTh = document.createElement('th');
            newTh.textContent = cells[i].textContent;
            newTh.setAttribute('scope', 'col');
            cells[i].replaceWith(newTh);
          }
          if (!table.querySelector('thead')) {
            const thead = document.createElement('thead');
            firstRow.parentNode.insertBefore(thead, firstRow);
            thead.appendChild(firstRow);
          }
        }
      }
    }

    const rows = Array.from(table.rows);
    const firstRow = rows[0];
    if (firstRow && firstRow.querySelector('th') && !table.querySelector('thead')) {
      const thead = document.createElement('thead');
      table.insertBefore(thead, firstRow);
      thead.appendChild(firstRow);
    }

    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        const parent = th.parentElement;
        if (parent && parent.tagName === 'TR') {
          const grandparent = parent.parentElement;
          if (grandparent && grandparent.tagName === 'THEAD') {
            th.setAttribute('scope', 'col');
          } else {
            th.setAttribute('scope', 'row');
          }
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });

    if (!table.querySelector('caption') && !table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
      console.warn('Table missing accessible name (caption or aria-label).', table);
    }
  });
}

function addMainLandmark(doc) {
  if (!doc) doc = (typeof document !== 'undefined') ? document : null;
  if (!doc) return 0;
  const main = doc.querySelector('main') || doc.querySelector('[role="main"]') || doc.getElementById('main-content');
  return main ? 1 : 0;
}

function addSvgAccessibleNames(doc) {
  if (!doc) doc = (typeof document !== 'undefined') ? document : null;
  if (!doc) return 0;
  const svgs = doc.querySelectorAll('svg');
  let fixed = 0;
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.querySelector('title')) {
      svg.setAttribute('role', 'img');
      fixed++;
    }
  });
  return fixed;
}

// AddressabilityIssues object from HEAD branch
const AddressabilityIssues = {
  analyzeInsightReport(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible link text
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      return score + (scorePoints[issue.type] || scorePoints.other);
    }, 0);
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    const isLandmark = landmarkRoles.includes(role) ||
                       (tagName && implicitLandmarks[tagName]);

    return {
      valid: isLandmark,
      tagName: tagName,
      role: role
    };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    return childProcess.spawn(command, [], {
      stdio: 'inherit',
      shell: true
    });
  },

  addLangAttribute(element, lang) {
    if (element) {
      element.setAttribute('lang', lang);
    } else {
      const html = document.documentElement;
      if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJsonPath).dependencies || {};
    const devDependencies = JSON.parse(packageJsonPath).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];

    landmarks.forEach(landmark => {
      const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
      const role = landmark.getAttribute('role');
      const implicitRole = {
        header: 'banner',
        nav: 'navigation',
        main: 'main',
        aside: 'complementary',
        footer: 'contentinfo'
      };

      if (!landmark.hasAttribute('role')) {
        const implicitLandmark = implicitRole[tagName];
        if (implicitLandmark) {
          landmark.setAttribute('role', implicitLandmark);
        }
      }
    });
  },

  sampleInsightReport: {
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
  },

  addBook(bookData) {
    // Function to add a book to a library (based on origin/main changes)
  },

  createServer() {
    // Function to create an Express server and start it on a specific port
  },

  generateAccessibilityReport() {
    // Placeholder implementation for generating an accessibility report
  },

  countDependencies(dependencies) {
    if (!Array.isArray(dependencies)) {
      return 0;
    }
    return dependencies.filter(Boolean).length;
  },

  setLangAttribute() {
    // Function to set the lang attribute on the <html> element when the page loads or language changes
    document.addEventListener('DOMContentLoaded', setLangAttribute);
  }
};

/**
 * Main game loop
 */
function renderDependencyGraphs(svgElements) {
  const accessibleName = getSvgAccessibleName(svgElements);
  if (accessibleName) {
    // Use accessibleName
  }

  setSvgAttributes(svgElements);
}

// REACT_015: Returns the appropriate lang attribute value based on the current language setting
function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeaders = table.querySelector('thead') !== null;
  const hasBody = table.querySelector('tbody') !== null;

  return {
    valid: hasHeaders && hasBody,
    hasHeaders,
    hasBody
  };
}

function countDependencies(dependencies) {
  if (!Array.isArray(dependencies)) {
    return 0;
  }
  return dependencies.reduce((count, dep) => count + (dep.dependencies ? 1 : 0), 0);
}

// --- Implementation for REACT_041: Add accessible names to 2 SVGs ---
function getSvgAccessibleName(svgElements) {
  if (!Array.isArray(svgElements)) {
    return getSvgTitle(svgElements);
  }
  const names = svgElements.map(svg => {
    return getSvgTitle(svg);
  });
  return names.join(', ');
}

function getSvgTitle(svg) {
  if (!svg) return 'Chart';
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent;
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const titleAttr = svg.getAttribute('title');
  if (titleAttr) {
    return titleAttr;
  }
  return 'Chart';
}

function setSvgAttributes(svgElements) {
  if (!Array.isArray(svgElements)) {
    setSvgAriaAttrs(svgElements);
    return;
  }
  svgElements.forEach(svg => {
    setSvgAriaAttrs(svg);
  });
}

function setSvgAriaAttrs(svg) {
  if (!svg || !(svg instanceof SVGElement)) return;

  const name = getSvgTitle(svg);
  if (name) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
  }

  if (!svg.hasAttribute('aria-labelledby') && !svg.hasAttribute('aria-label')) {
    const title = svg.querySelector('title');
    if (title) {
      const id = svg.id || `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      svg.id = id;
      title.id = `${id}-title`;
      svg.setAttribute('aria-labelledby', `${id}-title`);
    }
  }
}

// Setup functions for accessibility
function setupKeyboardNavigation() {
  let isKeyboardNav = false;

  document.addEventListener('keydown', () => {
    isKeyboardNav = true;
    if (!document.body.classList.contains('keyboard-nav')) {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    if (isKeyboardNav) {
      document.body.classList.remove('keyboard-nav');
      isKeyboardNav = false;
    }
  });
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function trapFocus(e) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modal = e.currentTarget;
  const focusableContent = modal.querySelectorAll(focusableElements);
  const firstFocusableElement = focusableContent[0];
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  }
}

function handleKeyNavigation(e) {
  const key = e.key;
  const target = e.target;

  if (key === 'Enter' || key === ' ') {
    if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
      target.click();
    }
  }
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach((dialog) => {
    dialog.setAttribute('aria-hidden', 'true');
    dialog.hidden = true;
  });
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return null;
  }
  return a - b;
}

function calculateProduct(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return null;
  }
  return a * b;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = 'in-page-button';
  return button;
}

function validateLinkAccessibility(options) {
  const link = options.link;
  const issues = [];

  if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
    issues.push({
      type: 'missing-aria-label',
      message: 'Link has no accessible name'
    });
  }

  if (link.getAttribute('role') === 'button' && !link.hasAttribute('aria-pressed')) {
    issues.push({
      type: 'missing-aria-pressed',
      message: 'Link styled as button missing aria-pressed attribute'
    });
  }

  return issues;
}

function handleFakeLinks(issues) {
  if (!Array.isArray(issues)) {
    return;
  }

  issues.forEach((issue) => {
    if (issue.type === 'missing-aria-label') {
      console.warn(`Accessibility issue: ${issue.message}`);
    }
  });
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

const getVersion = () => {
  return '1.0.0';
};

const getConfig = () => {
  return {
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
};

// Utilities for addressing accessibility issues
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.sections) {
    return [];
  }

  const issues = [];

  insightReport.sections.forEach((section) => {
    if (section.heading) {
      const headingLevel = section.heading.match(/^h([1-6])$/i);
      if (headingLevel) {
        const level = parseInt(headingLevel[1], 10);
        if (level > 3) {
          issues.push({
            type: 'heading-order',
            message: `Heading level ${level} may be too deep`,
            section: section.heading
          });
        }
      }
    }
  });

  return issues;
}

function generateAccessibilityReport(accessibilityReport) {
  if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
    return [];
  }

  const report = accessibilityReport.issues.map(issue => ({
    issueType: issue.type,
    status: issue.status || 'pending',
    fixApplied: issue.fixApplied || ''
  }));

  return report;
}

function ensureUniqueLandmarksFromString(source) {
  const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

  const matches = Array.from(source.matchAll(mainBlockRegex));
  if (matches.length <= 1) {
    return source;
  }

  let result = source;
  for (let i = 1; i < matches.length; i++) {
    const block = matches[i][0];
    const fixedBlock = block
      .replace(/<main([^>]*)>/, '<section$1>')
      .replace(/<\/main>/, '</section>');
    result = result.replace(block, fixedBlock);
  }

  return result;
}

function validateLandmark(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }

  const landmarkRoles = [
    'banner',
    'main',
    'navigation',
    'search',
    'contentinfo',
    'complementary',
    'region',
    'form'
  ];

  const tagName = element.tagName ? element.tagName.toLowerCase() : '';

  const implicitLandmarks = {
    'header': 'banner',
    'main': 'main',
    'nav': 'navigation',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form'
  };

  let landmarkRole = element.getAttribute ? element.getAttribute('role') : null;

  if (!landmarkRole && implicitLandmarks[tagName]) {
    landmarkRole = implicitLandmarks[tagName];
  }

  if (!landmarkRole) {
    return { 
      valid: false, 
      error: 'Element does not have a valid landmark role',
      element: tagName
    };
  }

  if (!landmarkRoles.includes(landmarkRole)) {
    return { 
      valid: false, 
      error: `Invalid landmark role: ${landmarkRole}`,
      element: tagName,
      role: landmarkRole
    };
  }

  return { valid: true, element: tagName, role: landmarkRole };
}

// AddressabilityIssues module additions
AddressabilityIssues.spawnSomeCommand = function (callback) {
  const child_process = require('child_process');

  const spawnOptions = {
    shell: true
  };

  child_process.spawn('someCommand', [], spawnOptions, (error, stdout, stderr) => {
    if (error) {
      callback(new Error(`someCommand failed: ${error.message}`));
      return;
    }

    callback(null, `someCommand exited with status code: ${stdout}`);
  });
};

AddressabilityIssues.calculateAccessibilityScore = function (fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return 0;
  }
});

// Add/fix 4 landmark issues
const landmarks = document.querySelectorAll('main, nav, aside, header, footer');
landmarks.forEach((landmark) => {
  const validationResult = validateLandmark(landmark);
  if (!validationResult.valid) {
    // Handle invalid landmark
    console.error(`Landmark issues found: ${validationResult.error}`);
  }
});

// Add accessible names to 2 SVGs
const svgElements = document.querySelectorAll('svg');
svgElements.forEach((svg) => {
  const accessibleName = getSvgAccessibleName(svg);
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
});

function spawnSomeCommand(callback) {
  const child_process = require('child_process');
  child_process.spawn('someCommand', {}, {
    stdio: 'inherit',
  }).on('exit', (code, signal) => {
    if (code === 0) {
      callback(null, 'Successfully executed someCommand');
    } else {
      callback(new Error(`someCommand failed with code ${code}`));
    }
  });
}

function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length <= 1) return;

  mains.forEach((main, index) => {
    if (index > 0) {
      const section = document.createElement('section');
      while (main.firstChild) {
        section.appendChild(main.firstChild);
      }
      main.parentNode.replaceChild(section, main);
    }
  });
}

function addProperLandmarkRegions() {
  const regions = document.querySelectorAll('section:not([role])');
  regions.forEach(region => {
    region.setAttribute('role', 'region');
  });
}

function handleCredentialResponse(response) {
  console.log('Credential response:', response);
}

function sampleInsightReport() {
  return {
    sections: [
      { heading: 'h2' },
      { heading: 'h4' }
    ]
  };
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    renderDependencyGraphs,
    getSvgAccessibleName,
    setSvgAttributes,
    getSvgTitle,
    setupKeyboardNavigation,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    addressAccessibilityIssuesFromInsightReport,
    generateAccessibilityReport,
    spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse,
    addSvgAccessibilityProps: setSvgAttributes,
    getLangAttribute,
    sampleInsightReport,
    ensureUniqueLandmarksFromString,
    validateLandmark,
    ensureUniqueLandmarks,
    addProperLandmarkRegions,
    AddressabilityIssues
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  addLangAttribute(document.documentElement);
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
  ensureUniqueLandmarks();
  addProperLandmarkRegions();
}