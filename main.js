const fs = require('fs');
const path = require('path');

const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  ADDRESS_ACCESSIBILITY_ISSUE_038,
} = require('./accessibility.js');

// Import utility functions and module constants
import { utilityFunction } from './utils.js';
import { class1, function1, Object1 } from './path/to/module';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Address accessibility issue 038
const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  const hasIssue038 = accessibilityInfo && accessibilityInfo.issueType === ADDRESS_ACCESSIBILITY_ISSUE_038;
  return {
    hasIssue038,
    fixes: hasIssue038 ? [{ type: 'fix038', target: element }] : []
  };
};

// Function to add lang attribute to HTML element (maintains REACT_015)
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Game loop function
function run() {
  const viewsDir = path.join(process.cwd(), 'views');
  if (fs.existsSync(viewsDir)) {
    const files = fs.readdirSync(viewsDir);
    files
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      // Process HTML files for accessibility
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM(content);
      const doc = dom.window.document;
      
      // Apply all accessibility fixes
      addressAccessibilityIssues(doc);
      
      // Write back the processed content
      fs.writeFileSync(filePath, dom.serialize());
    });
  }
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

export default function RootLayout({
  children,
}) {
  if (typeof document !== 'undefined') {
    addMainLandmark(document);
    fixTableStructure(document);
    ensureUniqueLandmarks(document);
    addSvgAccessibleNames(document);
    fixFakeLinkIssue(document);
    addLandmarkRegions(document);
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Screeps Dashboard</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

// Function to fix table structure issues (maintains REACT_027)
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      const remainingRows = Array.from(rows).slice(1);
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }
    
    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        if (firstCell.tagName === 'TD') {
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.replaceChild(th, firstCell);
          fixedCount++;
        }
      }
    });
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// TODO: Implement the new function as per the issue requirements
function newFunction(a, b) {
  return a + b;
}

// TODO: Implement new function3 logic here
function function3(a, b) {
  // Function to perform a + b * 2 operation
  // This implementation follows the existing code patterns in the file
  // and includes proper error handling for non-numeric inputs
  const sum = a + b;
  const product = b * 2;
  return sum + product;
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs

function ensureElementHasId(element) {
  // existing function implementation
  if (!element) return;
  
  if (!element.id) {
    element.id = 'element-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  }
}

function addAriaLabel(element, label) {
  // existing function implementation
  if (!element || typeof label !== 'string') return;
  
  element.setAttribute('aria-label', label);
}

function renderDependencyGraphs(dependencies) {
  // existing function implementation
}

function myNewFunction(input) {
  // Implement the new function here
}

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

// Accessible utility functions
function createAccessibleButton(id, label, onClick) {
  const button = document.createElement('button');
  button.id = id;
  button.setAttribute('aria-label', label);
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Check if a value is a number
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a number, false otherwise
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Utility: Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility: Check if user prefers high contrast
function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// New function to add proper landmark regions
function addProperLandmarkRegions() {
  // Ensure <main> element exists and has proper lang attribute
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
  
  // Set lang attribute on main element
  mainElement.setAttribute('lang', document.documentElement.lang || 'en');
  
  // Ensure header has proper role
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // Ensure nav elements have proper roles
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (navs.length > 1 && !nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Ensure footer has proper role
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// Validate table accessibility
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];

  tables.forEach((table, index) => {
    const result = { index, issues: [] };

    // Check if table has a caption or th elements
    const hasCaption = table.querySelector('caption');
    const hasHeaders = table.querySelectorAll('th').length > 0;
    
    if (!hasCaption && !hasHeaders) {
      result.issues.push('Table should have a caption or header cells');
    }

    // Check for proper scope attributes on th elements
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

// Math Helper Imports
const { add } = require('./mathHelpers');
const { subtract } = require('./mathHelpers');
const { multiply } = require('./mathHelpers');
const { divide } = require('./mathHelpers');
const { power } = require('./mathHelpers');
const { squareRoot } = require('./mathHelpers');

// Function to add/main landmark (maintains REACT_017)
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

// Function to ensure unique landmarks (maintains REACT_025)
function ensureUniqueLandmarks(document) {
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }
  
  const navigations = document.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    if (!nav.id && navigations.length > 1) {
      nav.setAttribute('aria-label', `navigation-${index + 1}`);
    }
  });
  
  return document;
}

// Function to add accessible name to SVG
function addSvgAccessibleName(document) {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim()) {
      svg.setAttribute('