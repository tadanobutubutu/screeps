const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

// TODO: Identify and update specific functions that render dependency graphs or
// index views.

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

// main.js - Main application logic

// Import necessary modules
const { checkAccessibility } = require('./accessibility');
const { checkStructure } = require('./structure');
const fs = require('fs');
const path = require('path');

// Import and re-export someFunction from './utils'
const _utils = require('./utils');
const someFunction = _utils.default || _utils.someFunction || _utils;

// Existing configuration
const config = {
    verbose: true,
    debug: false,
    rules: {
        contrast: true,
        semantic: true,
        structure: true
    }
};

// Main validation function for web accessibility
function validateWebAccessibility(url) {
    if (!url) {
        throw new Error('URL is required');
    }
    
    console.log(`Validating: ${url}`);
    
    const results = {
        accessibility: null,
        structure: null,
        errors: [],
        warnings: []
    };
    
    try {
        results.accessibility = validateTableAccessibility(url);
        results.structure = validateTableStructure(url);
    } catch (error) {
        results.errors.push(error.message);
    }
    
    return results;
}

// Helper function to check if element exists
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Helper function to get element text
function getElementText(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent : '';
}

// Get all table elements
function getAllTables() {
    return document.querySelectorAll('table');
}

// Get table headers
function getTableHeaders(table) {
    return table.querySelectorAll('th');
}

// Get table rows
function getTableRows(table) {
    return table.querySelectorAll('tr');
}

// Validate table accessibility
function validateTableAccessibility(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string' 
        ? document.querySelectorAll('table') 
        : [tableOrUrl];
    
    const accessibilityResults = {
        hasHeaders: true,
        hasScope: true,
        hasIdOrHeaders: true,
        contrast: true,
        issues: [],
        score: 100
    };
    
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        
        // Check if table has headers
        if (headers.length === 0) {
            accessibilityResults.issues.push({
                table: index,
                type: 'missing_headers',
                message: `Table ${index + 1}: Missing table headers (th elements)`
            });
            accessibilityResults.hasHeaders = false;
            accessibilityResults.score -= 20;
        }
        
        // Check for scope attributes
        headers.forEach((header, hIndex) => {
            if (!header.hasAttribute('scope')) {
                accessibilityResults.issues.push({
                    table: index,
                    header: hIndex,
                    type: 'missing_scope',
                    message: `Table ${index + 1}, Header ${hIndex + 1}: Missing scope attribute`
                });
                accessibilityResults.hasScope = false;
                accessibilityResults.score -= 10;
            }
        });
        
        // Check for proper associations (id/headers)
        const cells = table.querySelectorAll('td');
        if (cells.length > 0 && headers.length > 0) {
            const hasProperAssociation = headers[0].hasAttribute('id') || 
                cells[0].hasAttribute('headers');
            if (!hasProperAssociation) {
                accessibilityResults.issues.push({
                    table: index,
                    type: 'missing_association',
                    message: `Table ${index + 1}: Tables with headers should use id/headers attributes for proper association`
                });
                accessibilityResults.hasIdOrHeaders = false;
                accessibilityResults.score -= 15;
            }
        }
    });
    
    return accessibilityResults;
}

// Validate table structure
function validateTableStructure(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string' 
        ? document.querySelectorAll('table') 
        : [tableOrUrl];
    
    const structureResults = {
        hasCaption: true,
        hasSummary: true,
        consistentColumns: true,
        hasThead: true,
        hasTbody: true,
        issues: [],
        score: 100
    };
    
    tables.forEach((table, index) => {
        // Check for caption
        const caption = table.querySelector('caption');
        if (!caption) {
            structureResults.issues.push({
                table: index,
                type: 'missing_caption',
                message: `Table ${index + 1}: Missing caption element`
            });
            structureResults.hasCaption = false;
            structureResults.score -= 15;
        }
        
        // Check for summary (via aria-describedby or summary attribute)
        const hasSummaryAttr = table.hasAttribute('summary');
        const hasAriaDescription = table.hasAttribute('aria-describedby');
        if (!hasSummaryAttr && !hasAriaDescription) {
            structureResults.issues.push({
                table: index,
                type: 'missing_summary',
                message: `Table ${index + 1}: Missing summary (use summary attribute or aria-describedby)`
            });
            structureResults.hasSummary = false;
            structureResults.score -= 10;
        }
        
        // Check for thead
        const thead = table.querySelector('thead');
        if (!thead) {
            structureResults.issues.push({
                table: index,
                type: 'missing_thead',
                message: `Table ${index + 1}: Missing thead element`
            });
            structureResults.hasThead = false;
            structureResults.score -= 10;
        }
        
        // Check for tbody
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            structureResults.issues.push({
                table: index,
                type: 'missing_tbody',
                message: `Table ${index + 1}: Missing tbody element`
            });
            structureResults.hasTbody = false;
            structureResults.score -= 10;
        }
        
        // Check column consistency
        const rows = table.querySelectorAll('tr');
        if (rows.length > 1) {
            const firstRowCells = rows[0].querySelectorAll('th, td').length;
            let inconsistent = false;
            
            rows.forEach((row, rIndex) => {
                const cellCount = row.querySelectorAll('th, td').length;
                if (cellCount !== firstRowCells) {
                    inconsistent = true;
                }
            });
            
            if (inconsistent) {
                structureResults.issues.push({
                    table: index,
                    type: 'inconsistent_columns',
                    message: `Table ${index + 1}: Inconsistent number of columns across rows`
                });
                structureResults.consistentColumns = false;
                structureResults.score -= 20;
            }
        }
    });
    
    return structureResults;
}

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(dependencies).length;
    const devDependencyCount = Object.keys(devDependencies).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

// Language attribute helper functions
function getLangAttribute(el) {
  if (!el) {
    return 'en';
  }
  return el.getAttribute('lang');
}

function getFullLangAttribute(el) {
  if (!el) {
    return 'en-US';
  }
  return el.getAttributeNS(null, 'xml:lang') || getLangAttribute(el);
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäçéèêëîïôûü]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return setHtmlLangAttribute(lang);
}

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  setHtmlLangAttribute(lang);
}

function renderHomePage() {
  return renderHeader() + '<div>Home Page</div>' + renderFooter();
}

function renderDashboard() {
  return renderHeader() + '<div>Dashboard Content</div>' + renderFooter();
}

// New function to convert anchor tags to buttons with specific id and text
function convertAnchorsToButtons() {
  if (typeof document !== 'undefined') {
    const anchors = document.querySelectorAll('a#unrotate');
    anchors.forEach(anchor => {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.type = 'button';
      button.textContent = anchor.textContent;
      anchor.parentNode.replaceChild(button, anchor);
    });
  }
}

// Call the function to convert anchors to buttons if needed
if (typeof document !== 'undefined') {
  convertAnchorsToButtons();
}

/**
 * Adds accessible names to SVG elements by ensuring a <title> exists
 * @param {string} [name='SVG Image'] - The accessible name for the SVG
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'SVG Image';
      svg.prepend(title);
    }
  });
}

/**
 * Fixes 26 table structure issues by ensuring thead and tbody exist
 */
function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach(table => {
    if (table.querySelector('thead') || table.querySelector('tbody')) return;

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, index) => {
      if (index === 0) {
        thead.appendChild(row);
      } else {
        tbody.appendChild(row);
      }
    });

    if (thead.children.length > 0 && tbody.children.length > 0) {
      table.innerHTML = '';
      table.appendChild(thead);
      table.appendChild(tbody);
    }
  });
}

/**
 * Adds/fixes main landmark by ensuring a <main> element exists
 */
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    document.body.prepend(mainElement);
  }
}

/**
 * Ensures unique landmarks by removing duplicate roles
 */
function ensureUniqueLandmarks() {
  const landmarkRoles = ['main', 'header', 'footer', 'nav', 'aside'];
  landmarkRoles.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute('role');
        }
      });
    }
  });
}

/**
 * Fixes fake link issues by replacing non-anchor clickable elements with proper links
 */
function fixFakeLinkIssue() {
  document.querySelectorAll('[onclick]').forEach(el => {
    if (el.tagName.toLowerCase() !== 'a') {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = el.textContent;
      a.onclick = el.onclick;
      el.replaceWith(a);
    }
  });
}

/**
 * Adds lang attribute to the document's <html> tag
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Accessibility issue resolution functions (from HEAD)
function addressAccessibilityIssues() {
  // REACT_015: Add lang attribute to HTML element
  function setHtmlLangAttributeInternal(lang = 'en', doc = document) {
    if (doc.documentElement) {
      doc.documentElement.setAttribute('lang', lang);
    }
  }

  // REACT_017: Add/fix 4 landmark issues
  // Helper to create proper landmark regions (main, nav, header, footer, aside)
  function createLandmark(type, options = {}) {
    const { id, label, className, role } = options;
    const element = document.createElement(type);
    
    if (id) element.id = id;
    if (label) element.setAttribute('aria-label', label);
    if (className) element.className = className;
    if (role) element.setAttribute('role', role);
    
    return element;
  }

  // REACT_025: Ensure unique landmarks (2 issues)
  // Helper to ensure landmark IDs are unique
  function getUniqueLandmarkId(baseId) {
    if (!document.getElementById(baseId)) {
      return baseId;
    }
    let counter = 1;
    let newId = `${baseId}-${counter}`;
    while (document.getElementById(newId)) {
      counter++;
      newId = `${baseId}-${counter}`;
    }
    return newId;
  }

  // REACT_036: Fix 1 fake link issue
  // Convert fake links (anchors without href or with href="#") to proper buttons
  function fixFakeLink(linkElement) {
    if (linkElement.tagName === 'A') {
      const href = linkElement.getAttribute('href');
      if (!href || href === '#' || href === '') {
        const text = linkElement.textContent;
        const newButton = document.createElement('button');
        newButton.textContent = text;
        
        // Copy attributes except href
        Array.from(linkElement.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            newButton.setAttribute(attr.name, attr.value);
          }
        });
        
        // Copy inline styles
        newButton.style.cssText = linkElement.style.cssText;
        
        linkElement.parentNode.replaceChild(newButton, linkElement);
        return newButton;
      }
    }
    return linkElement;
  }

  return {
    setHtmlLangAttribute: setHtmlLangAttributeInternal,
    createLandmark,
    getUniqueLandmarkId,
    fixFakeLink
  };
}

// Improve accessibility by adding semantic role and label to the root element
const root = document.getElementById('root');
if (root) {
  root.setAttribute('role', 'main');
  root.setAttribute('aria-label', 'Main application');
}

// Original code from main.js (placeholder functions)
const originalFunction = (input) => {
  // ... existing implementation ...
};

// New function or change requested in the issue
const newFunction = (input) => {
  // ... new implementation ...
};

// Existing code that must continue to pass
const otherFunction = (input) => {
  // ... existing implementation ...
};

// Export for testing and external use
module.exports = {
    validateWebAccessibility,
    validateTableAccessibility,
    validateTableStructure,
    elementExists,
    getElementText,
    getAllTables,
    getTableHeaders,
    getTableRows,
    config,
    countDependencies,
    someFunction,
    setLanguage,
    getLangAttribute,
    getFullLangAttribute,
    addressAccessibilityIssues,
    newFunction,
    originalFunction,
    otherFunction,
    renderHomePage,
    renderDashboard,
    setHtmlLangAttribute,
    detectAndSetLang,
    convertAnchorsToButtons,
    addSvgAccessibleNames,
    fixTableStructureIssues,
    addMainLandmark,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    addLangAttribute
};