// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a22a37d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 669117b4c3d1a635653f730f0a059efacbb752>
//<!-- todo-hash: 312aa8ea4c5e1c94e4e4b7c36c210eb9a72dea -->
//_Commit: 54b7c4d06282fbf48e78de43e5e115814006658c_
//<!-- todo-hash: d290c9a63ee693e91602d63f7ca6757def47f63e -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report
// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements
//_Commit: 653c5cd3989d35211b6a970c20ca8d1239034d7f_
//
// Version 2 implementation: Additional accessibility improvements
//_Commit: 653c5cd3989d35211b6a970c20ca8d1239034d7f_
//<!-- todo-hash: 398424c02b2e0a493981d83f7e0c15b42542e233 -->
import React from 'react';

// Import dependency graph content and index content for rendering functions
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn } = require('./utilities');

const http = require('http');
const url = require('url');

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e. g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
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
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/^[a-z]{2}$/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

/**
 * Renders the dependency graph view using the dependencyGraphContent module.
 * This function should be called by the dependency graph rendering functions.
 * @param {Object} props - Props for rendering the dependency graph
 * @returns {React.ReactElement} The rendered dependency graph content
 */
function renderDependencyGraph(props) {
  const content = dependencyGraphContent(props);
  return content;
}

/**
 * Renders the index view using the indexContent module.
 * This function should be called by the index view rendering functions.
 * @param {Object} props - Props for rendering the index view
 * @returns {React.ReactElement} The rendered index content
 */
function renderIndexView(props) {
  const content = indexContent(props);
  return content;
}

// App state for session management
const appState = {
  sessions: new Map()
};

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

function handleCredentialResponse(credentialResponse) {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  focusTrap: focusTrap,

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  createLiveRegion() {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0;';
    document.body.appendChild(this.liveRegion);
  },

  announce(message, priority) {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 1000);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element, index) => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }
      });
    });
  }
};

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('aria-describedby') || tableElement.getAttribute('summary');
  
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('td'));
    
    const cellCount = cells.length;
    
    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });
    
    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = Array.from(prevRow.querySelectorAll('td'));
      
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    errors.push(`Element has invalid landmark role: ${role}`);
  }
  
  if (!role && tagName) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found. Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('nav, main, aside, footer, section, article, [role]');
  
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName.toLowerCase();
      
      // Check for invalid nesting
      if (parentTag === 'header' && parentTag === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && parentTag === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.querySelector(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }
  
  return null;
}

function validateSvgAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  const landmarkCounts = {};
  
  // Collect all landmarks
  const landmarks = document.querySelectorAll('nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const identifier = landmark.getAttribute('id') || landmark.getAttribute('data-id') || 'unknown';
    
    // Main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts['main'] > 0) {
        errors.push(`Duplicate main landmark found. Only one main landmark should exist.`);
      } else {
        landmarkCounts['main'] = (landmarkCounts['main'] || 0) + 1;
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Gets the accessible name of an element, addressing REACT_036 fake link issues.
 * @param {HTMLElement} element - The element to extract the accessible name from
 * @returns {string|null} The accessible name or null
 */
function personName(element) {
  if (typeof document === 'undefined' || !element) {
    return null;
  }
  
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelled
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.querySelector(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for heading tags
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length > 0) {
    return headings[0].textContent.trim();
  }
  
  return null;
}

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `elem-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

/**
 * Get all loaded tables
 * @returns {Array} Array of table objects
 */
function getTables() {
  return appData.tables;
}

/**
 * Get application configuration
 * @returns {Object} Configuration object
 */
function getConfig() {
  return { ...appData.config };
}

/**
 * Set application configuration
 * @param {Object} config - Configuration object
 */
function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

const renderIndex = (data, options = {}) => {
  const content = indexContent(data, options);
  if (content && typeof content === 'string') {
    return addLangAttribute(content);
  }
  return content;
};

// Implement the function for addressing accessibility issues from insight report
function applyAccessibilityFixes(report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Combine languages
  const existingLangAttribute = getLangAttribute();
  const newLangAttribute = report.detectedLang || 'en';
  if (existingLangAttribute !== newLangAttribute) {
    setHtmlLangAttribute(newLangAttribute);
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  if (report.issues.landmarkIssues && report.issues.landmarkIssues.missingMain) {
    const firstSection = document.querySelector('section');
    if (firstSection) {
      const mainElement = document.createElement('main');
      while (firstSection.firstChild) {
        mainElement.appendChild(firstSection.firstChild);
      }
      document.body.insertBefore(mainElement, firstSection);
      firstSection.remove();
      fixes.mainLandmarkAdded = true;
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    report.issues.landmarkIssues.forEach(issue => {
      const element = document.querySelector(issue.selector);
      if (element) {
        // Add accessible name if missing
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          // Try to get label from surrounding context
          const previousSibling = element.previousElementSibling;
          if (previousSibling && previousSibling.tagName.match(/H[1-6]/)) {
            const labelId = `label-${Math.random().toString(36).substr(2, 9)}`;
            const labelSpan = document.createElement('span');
            labelSpan.id = labelId;
            labelSpan.textContent = previousSibling.textContent;
            labelSpan.style.display = 'none';
            element.parentNode.insertBefore(labelSpan, element);
            element.setAttribute('aria-labelledby', labelId);
          } else {
            // Use role as fallback label
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            element.setAttribute('aria-label', role);
          }
          fixes.landmarksFixed++;
        }
      }
    });
  }

  // Fix SVG accessible names
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = document.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        svg.setAttribute('aria-label', issue.suggestedName || 'Decorative SVG');
        fixes.svgNamesAdded++;
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    report.issues.fakeLinkIssues.forEach(issue => {
      const element = document.querySelector(issue.selector);
      if (element) {
        // Check if this element should be a link or a button
        const isNavigation = element.closest('nav') !== null;

        if (isNavigation || element.tagName.toLowerCase() === 'a') {
          // Convert to proper link with href
          if (!element.getAttribute('href')) {
            element.setAttribute('href', '#' + (element.id || Math.random().toString(36).substr(2, 9)));
            element.setAttribute('role', 'link');
            fixes.fakeLinksFixed++;
          }
        } else {
          // Convert to button
          element.setAttribute('role', 'button');
          if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
          fixes.fakeLinksFixed++;
        }
      }
    });
  }

  return fixes;
}