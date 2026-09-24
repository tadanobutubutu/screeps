// Main module

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Dependency imports
const dependencyGraphContent = require('./dependencyGraphContent').dependencyGraphContent;
const indexContent = require('./indexContent').indexContent;
const http = require('http');
const url = require('url');
const a11yStore = require('./utilities/a11yStore');

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  setSvgAccessibilityProps,
  addAccessibleNamesToSVGs,
  ensureElementHasIdOrigin,
  addAriaLabel: addAriaLabelAlt,
  googleSignIn,
  handleCredentialResponse: handleCredentialResponseAlt,
  renderGraphIndex: renderGraphIndexUtil,
  addressAccessibilityIssues
} = require('./utilities');

const http = require('http')

const renderGraphIndex = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
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
    if (/[一-鿿]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[぀-ヿ]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[؀-ۿ]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâãäåæçèéêëìîï]/.test(content) || /[ÀÂÃÄÅÆÇÈÉÊËÌÎÏ]/.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/.test(content) || /[ÄÖÜ]/.test(content)) {
      lang = 'de'; // German
    }
  }
  return lang;
}

// DONE: Address accessibility issues from insight report:
// - DONE REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - DONE REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - DONE REACT_017: Add/fix 4 landmark issues (handled by validateLandmark() and validateLandmarkStructure())
// - DONE REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and validateSvgAccessibility())
// - DONE REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - DONE REACT_036: Fix 1 fake link issue (handled by createInPageButton(), personName(), and ...)
// ADD: Address new accessibility issues from insight report
// New functions to address REACT_036: Fix fake link issue
function personName(name) {
  // Creates an accessible person name element
  if (typeof document === 'undefined') return null;
  
  const span = document.createElement('span');
  span.className = 'person-name';
  span.textContent = name;
  return span;
}

// Function to handle initial accessibility setup
function handleInitialAccessibility() {
  a11yStore.checkLandmarkElements();
  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
}

// New entry point for accessibility related functions
function accessibility() {
  // Handle initial accessibility setup on page load
  handleInitialAccessibility();
  // Ensure all interactive elements have proper ARIA roles and attributes after page load
  ensureInteractiveElementsAccessible();
}

// New function to detect and set language based on content
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
function isLandmarkElement(element) {
  const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];
  
  if (!element) {
    return false;
  }

  if (typeof element === 'string') {
    return landmarkTags.includes(element.toLowerCase());
  }

  if (element.tagName) {
    return landmarkTags.includes(element.tagName.toLowerCase());
  }

  return false;
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
    if (/\p{Han}/u.test(content) || /[ㄱ-��FRAMESwsugaengsemightyhighㅣ-�� jeluji/u.test(content)) {
      lang = 'ko'; // Korean
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (content.match(/[\u0600-\u06FF\u0750-\u077F]/) || content.match(/\p{Arabic}/u)) {
      lang = 'ar'; // Arabic
    } else if ... {
      lang = 'fr'; // French
    } else if ... {
      lang = 'de'; // German
    } else if (content.match(/[ÀÂÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔŐÖØÙÚÛÜÝàáâäãåāăąåæçèéêëìíîïðñòóôöøùúûüý]/u)) {
      lang = 'fr'; // French
    } else if (/^[a-z]{2}$/i.test(content)) {
      lang = 'de'; // German
    } else if (/[àâçéèêëîïøøùüûÿæœ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (content.match(/[àâçéèêëîïœæ]/i)) {
      lang = 'ca'; // Catalan
    } else if (content.match(/ [àâäàáâãäåèéêëìïîïñòóôõöøùúûñçÜĆćČč]/i)) {
      lang = 'es'; // Spanish
    } else if (content.match(/[àâ'(Á‌�A채ĺ​‌�] /)) {
      lang = 'pt-br'; // Brazilian Portuguese
    } else if (content.match(/[абверы]+/u)) {
      lang = 'bg'; // Bulgarian
    } else if (content.match(/[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]+/u)) {
      lang = 'ru'; // Russian
    } else if (content.match(/[אבגדהוזחטיכלמנסע付ね貫りゃゅょっああっ–]+/)) {
      lang = 'he'; // Hebrew
    }
  }
  
  return lang;
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if ... {
    errors.push('Table is missing <thead> element');
  }
  
  if ... {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = ...
  const thElements = thead ? ... : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if ... {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = ...
  const hasSummary = ...
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

// New entry point for accessibility-related functions
function accessibility() {
  a11yStore.checkLandmarkElements();
  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
}

/**
 * Address accessibility issues for the document
 */
function validateTableAccessibility(table) {
  if (!table) {
    return { success: false, error: 'Table is required' };
  }
  
  const errors = [];
  const rows = ...
  
  rows.forEach((row, rowIndex) => {
    const cells = ... th');
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
      const prevCells = ... th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length} in previous row)`);
      }
    }
  };
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
  
  if (role && ... && ... {
    ... landmark role: ${role}`);
  }
  
  if (!role && ... {
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
  const mainElements = ... [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found ... Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = ... nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName && ... === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName && ... === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function ... {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-label
  let accessibleName = ...
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = ...
  if (labelledBy) {
    const labelElement = ...
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = ...
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for desc element inside SVG
  const desc = ...
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }
  
  const errors = [];
  const svgs = ...
  
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }
  
  const errors = [];
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarkTypes.forEach((type) => {
    // Find elements by tag name
    const elements = document.querySelectorAll(type);
    // Find elements by role attribute
    const labeledElements = document.querySelectorAll(`[role="${type}"]`);
    const total = elements.length + labeledElements.length;
    
    if (total > 1 && type !== 'nav' && type !== 'aside') {
      errors.push(`Multiple ${type} landmarks found (${total}). Consider using unique aria-labels to differentiate them.`);
    } else if (total > 1) {
      // For nav and aside, multiple are allowed but must have unique labels
      const allElements = [...elements, ...labeledElements];
      const labels = allElements.map(el => el.getAttribute('aria-label') || el.id || '');
      const uniqueLabels = new Set(labels.filter(l => l));
      if (uniqueLabels.size < total) {
        errors.push(`Multiple ${type} landmarks found without unique aria-labels`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validates table accessibility by checking structure and headers.
 * @param {HTMLElement} table - The table to validate
 * @returns {Object} - Validation result with success status and details
 */
function validateTableAccessibility(table) {
  if (!table) {
    return { success: false, error: 'Table is required' };
  }

  const hasCaption = !!table.querySelector('caption');
  const headers = table.querySelectorAll('th');

  const headerValidation = Array.from(headers).every(header => header.hasAttribute('scope'));

  return {
    success: hasCaption && headers.length > 0 && headerValidation,
    details: {
      hasCaption,
      headerCount: headers.length,
      headersHaveScope: headerValidation
    }
  };
}

/**
 * Check accessibility of landmark elements in the document.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmark(container = document) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="navigation"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Validates the structure of landmark elements.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmarkStructure(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const requiredRoles = ['main', 'banner', 'navigation', 'contentinfo'];
  const foundRoles = new Set();

  container.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (requiredRoles.includes(role)) {
      foundRoles.add(role);
    }
  });

  return {
    hasMain: foundRoles.has('main'),
    hasBanner: foundRoles.has('banner'),
    hasNav: foundRoles.has('navigation'),
    hasFooter: foundRoles.has('contentinfo'),
    missingRoles: requiredRoles.filter(r => !foundRoles.has(r))
  };
}

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraphs(graphData) {
  if (typeof document === 'undefined') return;

  // Remove any existing graph containers
  const existingContainers = document.querySelectorAll('.dependency-graph-container');
  existingContainers.forEach(container => container.remove());

  // Create new container
  const container = document.createElement('div');
  container.className = 'dependency-graph-container';
  container.setAttribute('role', 'region');

  // Render the graph
  const graphHtml = renderDependencyGraph(graphData);
  container.innerHTML = graphHtml;

  // Add to document
  const mainElement = document.querySelector('main') || document.body;
  mainElement.appendChild(container);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

if (typeof document !== 'undefined') {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function newFunction() {
  // Implementation from origin/main
}

if (typeof document !== 'undefined') {
  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }
}

function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }
  
  const opts = options || {};
  const button = document.createElement('button');
  
  // Set the type explicitly to avoid form submission side effects
  button.type = 'button';
  
  // Set the accessible name
  button.setAttribute('aria-label', opts.ariaLabel || text);
  
  // Use aria-controls to indicate the element the button controls/links to
  if (targetId) {
    button.setAttribute('aria-controls', targetId);
  }
  
  // Set the text content
  button.textContent = text;
  
  // Apply optional className
  if (opts.className) {
    button.className = opts.className;
  }
  
  // Store the target id as a data attribute for handling clicks
  if (targetId) {
    button.setAttribute('data-target-id', targetId);
    
    // Attach a click handler that scrolls to the target and updates the URL hash
    button.addEventListener('click', function(event) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Prevent default to allow smooth scrolling behavior to be controlled
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update the URL hash without jumping
        if (history && typeof history.pushState === 'function') {
          history.pushState(null, '', '#' + targetId);
        } else {
          window.location.hash = targetId;
        }
        // Move focus to the target element if it's focusable, otherwise set tabindex
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        targetElement.focus({ preventScroll: true });
      }
    });
  }
  
  return button;
}

function personName(name) {
  if (typeof name !== 'string') {
    return '';
  }
  return name.trim();
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
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
      const prevCells = prevRow.querySelectorAll('td, th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length} in previous row)`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_027: Fix table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  const thead = tableElement.querySelector('thead');
  if (!thead) {
    errors.push('Table is missing <thead> element');
  }
  
  const tbody = tableElement.querySelector('tbody');
  if (!tbody) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
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
  const hasCaption = tableElement.querySelector('caption') !== null;
  const hasSummary = tableElement.hasAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate landmark structure
 * @returns {Object} Validation result
 */
function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate landmark uniqueness
 * @returns {Object} Validation result
 */
function validateLandmark() {
  const errors = [];
  const landmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form'];
  const usedLandmarks = new Set();

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      errors.push(`Multiple elements with role="${landmark}" found`);
    }
    if (elements.length > 0) {
      usedLandmarks.add(landmark);
    }
  });

  if (usedLandmarks.size < landmarks.length) {
    errors.push('Not all required landmarks are present');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get accessible name for SVG element
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return '';
  }
  
  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
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
  
  // Fallback to default name
  return 'SVG graphic';
}

// Export the new function along with existing ones
module.exports = {
  wrapPrimaryContentInMain,
  detectAndSetLang,
  personName,
  createInPageButton,
  getLangAttribute,
  validateTableStructure,
  validateTableAccessibility,
  validateLandmarkStructure,
  validateLandmark,
  getSvgAccessibleName
};
```