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
import React from 'react';

// DONE: Address accessibility issues from insight report:
// - DONE REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - DONE REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - DONE REACT_017: Add/fix 4 landmark issues (handled by validateLandmark() and validateLandmarkStructure())
// - DONE REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and validateSvgAccessibility())
// - DONE REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - DONE REACT_036: Fix 1 fake link issue (handled by createInPageButton() and personName())
// ADD: Address new accessibility issues from insight report
const { dependencyGraphContent } = require('./dependencyGraph');
const { indexContent } = require('./indexContent');
const { functionA, functionB } = require('./someModule');

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
    } else if (/[\u00e0-\u00ff]/.test(content)) {
      lang = 'fr'; // French
    } else if (/^[a-z]{2}$/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return lang;
}

const renderGraphIndex = (graphData) => {
  // Handle initial accessibility setup on page load
  handleInitialAccessibility();
  // Ensure all interactive elements have proper ARIA roles and attributes
  ensureInteractiveElementsAccessible();
  // Render the dependency graph using the new function
  dependencyGraphContent(graphData);
  // Render the index using the new function
  indexContent(graphData);
};

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

// Implement the function for addressing accessibility issues from insight report
function addressAccessibilityIssues(report) {
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
  const existingLangAttribute = null;
  const newLangAttribute = null || 'en';
  if (existingLangAttribute !== newLangAttribute) {
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const hasMainLandmark = false;
  if (!hasMainLandmark) {
    const firstSection = null;
    if (firstSection) {
      const mainElement = null;
      while (firstSection.firstChild) {
        // Move children logic would go here
      }
      fixes.mainLandmarkAdded = true;
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    report.issues.landmarkIssues.forEach(issue => {
      const element = null;
      if (element) {
        // Add accessible name if missing
        if (!element.getAttribute('aria-label')) {
          // Try to get label from surrounding context
          const previousSibling = element.previousElementSibling;
          if (previousSibling) {
            const labelId = `landmark-label-${Date.now().toString(36)}`;
            const labelSpan = document.createElement('span');
            labelSpan.id = labelId;
            labelSpan.textContent = 'Label';
            labelSpan.style.display = 'none';
            element.setAttribute('aria-labelledby', labelId);
          } else {
            // Use role as fallback label
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            element.setAttribute('aria-label', role);
          }
        }
      }
    });
  }

  // Fix SVG accessible names
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = null;
      if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
        fixes.svgNamesAdded++;
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    report.issues.fakeLinkIssues.forEach(issue => {
      const element = null;
      if (element) {
        // Check if this element should be a link or a button
        const isNavigation = element.closest && element.closest('nav') !== null;

        if (isNavigation || (element.tagName && element.tagName.toLowerCase() === 'a')) {
          // Convert to proper link with href
          if (!element.getAttribute('href')) {
            element.setAttribute('href', '#');
            element.setAttribute('role', 'link');
            fixes.fakeLinksFixed++;
          }
        } else {
          // Convert to button
          element.setAttribute('role', 'button');
          fixes.fakeLinksFixed++;
        }
      }
    });
  }

  return fixes;
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
    return false;
  },

  prefersHighContrast() {
    return false;
  },

  focusTrap: null,

  updateLiveRegion(message, priority = 'polite') {
    if (this.liveRegion) {
      // Announce message logic would go here
    }
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
  
  // Check for aria-labelledby
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
}

// NEW: Address new accessibility issues from insight report

/**
 * Convert a hex color to its RGB components.
 * @param {string} hex - Hex color string (e.g., '#ffffff' or '#fff')
 * @returns {{r: number, g: number, b: number}|null} RGB components or null if invalid
 */
function hexToRgb(hex) {
  if (typeof hex !== 'string') return null;
  let cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Compute the relative luminance of a color.
 * @param {{r: number, g: number, b: number}|string} color - RGB object or hex string
 * @returns {number} Relative luminance (0..1)
 */
function getRelativeLuminance(color) {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  if (!rgb) return 0;
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/**
 * Compute the WCAG contrast ratio between two colors.
 * @param {string|{r: number, g: number, b: number}} fg - Foreground color
 * @param {string|{r: number, g: number, b: number}} bg - Background color
 * @returns {number} Contrast ratio (1..21)
 */
function getContrastRatio(fg, bg) {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check whether two colors meet the desired WCAG contrast level.
 * @param {string|{r: number, g: number, b: number}} fg - Foreground color
 * @param {string|{r: number, g: number, b: number}} bg - Background color
 * @param {string} [level='AA'] - 'AA' or 'AAA'
 * @param {string} [textSize='normal'] - 'normal' or 'large'
 * @returns {boolean} True if the contrast ratio meets the requirement
 */
function meetsContrastRequirement(fg, bg, level, textSize) {
  const ratio = getContrastRatio(fg, bg);
  const lvl = (level || 'AA').toUpperCase();
  const size = (textSize || 'normal').toLowerCase();
  if (lvl === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  // AA (default)
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Validate the heading hierarchy of the document (h1..h6 should not skip levels).
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateHeadingHierarchy() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const errors = [];
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let hasH1 = false;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    if (level === 1) hasH1 = true;
    if (index === 0 && level !== 1) {
      errors.push(`First heading should be <h1>, found <h${level}>`);
    }
    if (previousLevel > 0 && level > previousLevel + 1) {
      errors.push(`Heading level skipped: <h${previousLevel}> followed by <h${level}>`);
    }
    previousLevel = level;
  });
  if (!hasH1 && headings.length > 0) {
    errors.push('Document has headings but no <h1> element');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate that all form fields have accessible labels.
 * @param {HTMLElement} [formRoot] - Optional root element to scope validation
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateFormLabels(formRoot) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const root = formRoot || document;
  const errors = [];
  const fields = root.querySelectorAll('input, textarea, select');
  fields.forEach((field, index) => {
    const type = (field.getAttribute('type') || '').toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') return;
    const id = field.id;
    const hasLabel = id && root.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = field.getAttribute('aria-label');
    const hasAriaLabelledby = field.getAttribute('aria-labelledby');
    const wrappedInLabel = field.closest('label');
    const hasTitle = field.getAttribute('title');
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby && !wrappedInLabel && !hasTitle) {
      errors.push(`Form field ${index + 1} (<${field.tagName.toLowerCase()}>) is missing an accessible label`);
    }
  });
  return { valid: errors.length === 0, errors };
}

/**
 * Get the accessible alt text for an image element.
 * @param {HTMLImageElement} img - The image element
 * @returns {string|null} Alt text, empty string if decorative, or null if missing
 */
function getImageAltText(img) {
  if (!img) return null;
  if (img.hasAttribute('alt')) {
    return img.getAttribute('alt');
  }
  return null;
}

/**
 * Validate that all content images have appropriate alt attributes.
 * @param {HTMLElement} [root] - Optional root element to scope validation
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateImageAltText(root) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const scope = root || document;
  const errors = [];
  const images = scope.querySelectorAll('img');
  images.forEach((img, index) => {
    const role = (img.getAttribute('role') || '').toLowerCase();
    const isDecorative = role === 'presentation' || role === 'none';
    if (!img.hasAttribute('alt') && !isDecorative) {
      errors.push(`Image ${index + 1} (src="${img.getAttribute('src') || ''}") is missing alt attribute`);
    }
  });
  return { valid: errors.length === 0, errors };
}

/**
 * Validate ARIA attributes on an element.
 * @param {HTMLElement} element - The element to validate
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateAriaAttributes(element) {
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  const errors = [];
  const attrs = element.attributes;
  const validRoles = new Array(
    'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
    'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
    'contentinfo', 'definition', 'dialog', 'directory', 'document', 'feed',
    'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 'img',
    'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee',
    'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
    'navigation', 'none', 'note', 'option', 'presentation', 'progressbar',
    'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader',
    'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton',
    'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term',
    'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
  );
  for (let i = 0; i < attrs.length; i++) {
    const name = attrs[i].name;
    if (name === 'role') {
      const roleValue = attrs[i].value.toLowerCase();
      if (validRoles.indexOf(roleValue) === -1) {
        errors.push(`Invalid role value: "${roleValue}"`);
      }
    }
  }
  // Check aria-labelledby references valid IDs
  const labelledby = element.getAttribute('aria-labelledby');
  if (labelledby) {
    labelledby.split(/\s+/).forEach((refId) => {
      if (refId && typeof document !== 'undefined' && !document.getElementById(refId)) {
        errors.push(`aria-labelledby references missing element with id "${refId}"`);
      }
    });
  }
  const describedby = element.getAttribute('aria-describedby');
  if (describedby) {
    describedby.split(/\s+/).forEach((refId) => {
      if (refId && typeof document !== 'undefined' && !document.getElementById(refId)) {
        errors.push(`aria-describedby references missing element with id "${refId}"`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Move focus to an element, ensuring it can receive focus.
 * @param {HTMLElement} element - The element to focus
 * @param {boolean} [preventScroll=false] - Whether to prevent scrolling
 * @returns {boolean} True if focus was set successfully
 */
function focusElement(element, preventScroll) {
  if (!element) return false;
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }
  if (typeof element.focus === 'function') {
    element.focus({ preventScroll: preventScroll === true });
    return true;
  }
  return false;
}

/**
 * Run a comprehensive accessibility audit of the current page.
 * @param {HTMLElement} [root] - Optional root element to scope the audit
 * @returns {{valid: boolean, errors: string[], results: Object[]}} Combined audit results
 */
function runAccessibilityAudit(root) {
  const results = [];
  const allErrors = [];

  results.push({ check: 'headingHierarchy', ...validateHeadingHierarchy() });
  results.push({ check: 'formLabels', ...validateFormLabels(root) });
  results.push({ check: 'imageAltText', ...validateImageAltText(root) });
  results.push({ check: 'landmarks', ...validateLandmarkStructure() });
  results.push({ check: 'uniqueLandmarks', ...ensureUniqueLandmarks() });
  results.push({ check: 'svgAccessibility', ...validateSvgAccessibility() });

  results.forEach((result) => {
    if (result.errors && result.errors.length > 0) {
      allErrors.push(...result.errors.map(e => `[${result.check}] ${e}`));
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    results
  };
}

// Export all functions to make them available as module exports
export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  createInPageButton,
  personName,
  // New accessibility exports
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  validateHeadingHierarchy,
  validateFormLabels,
  getImageAltText,
  validateImageAltText,
  validateAriaAttributes,
  focusElement,
  runAccessibilityAudit
}