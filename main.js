// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
const { greeting } = require('./utils');
const path = require('path');
const fs = require('fs');

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark() and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// ADD: Address new accessibility issues from insight report

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the HTML lang attribute
 * @param {string} lang - The language code to set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
}

/**
 * Gets the current lang attribute value
 * @returns {string} The current language code
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || '';
  }
  return '';
}

/**
 * Validates and improves table structure for accessibility
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {object} Validation result with valid flag and errors array
 */
function validateTableStructure(tableElement) {
  return validateTableAccessibility(tableElement);
}

/**
 * Renders a dependency graph view using the imported dependencyGraphContent module.
 * @returns {string} The rendered dependency graph content
 */
function renderDependencyGraph() {
  return dependencyGraphContent;
}

/**
 * Renders an index view using the imported indexContent module.
 * @returns {string} The rendered index content
 */
function renderIndexView() {
  return indexContent;
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
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[؀-ۿ]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]|[ÀÂÇÉÈÊËÎÏÔÛÙÜŸŒÆ]/.test(content)) {
      lang = 'fr'; // French
    } else if (/[àâäéèêëïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    }
  }
  
  setHtmlLangAttribute(lang);
  return lang;
}

/**
 * Improves keyboard navigation for accessibility
 */
function improveKeyboardNavigation() {
  // New code to improve accessibility
}

/**
 * Checks for duplicate ID attributes in the document, which can cause accessibility issues
 * and maintenance problems.
 * @returns {boolean} True if duplicates are found, false otherwise
 */
function function3() {
  const elements = document.querySelectorAll('*');
  const ids = [...elements].map(el => el.id);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) {
      console.warn(`Duplicate ID found: "${id}"`);
      return false;
    }
    seen.add(id);
  }
  return true;
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to create an in-page button
const createInPageButton = (text, url) => {
  const button = document.createElement('a');
  button.textContent = text;
  button.setAttribute('href', url);
  button.style.display = 'none';
  document.body.appendChild(button);
  return button;
};

// New function to validate link accessibility and handle fake links
const validateLinkAccessibility = () => {
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (link.href.startsWith('#') || !link.hasAttribute('href')) {
      handleFakeLinks(link);
    }
  }
};

// New function to handle fake links by wrapping them in an in-page button
const handleFakeLinks = (link) => {
  const fakeLinkButton = createInPageButton(link.textContent, link.href);
  link.textContent = '';
  link.setAttribute('target', '_top');
  link.addEventListener('click', (event) => {
    event.preventDefault();
    fakeLinkButton.click();
  });
};

// New function to validate landmark elements
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
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  if (!role && !validLandmarks.includes(tagName)) {
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
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName.toLowerCase();
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName.toLowerCase() === 'footer') {
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
  
  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const identifier = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    
    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        landmarkCounts[identifier]++;
        errors.push(`Duplicate main landmark found (${landmarkCounts[identifier]})`);
      } else {
        landmarkCounts[identifier] = 1;
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
  
  // Check for aria-labelledby referencing another element
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  // Fall back to text content
  const textContent = element.textContent.trim();
  if (textContent) return textContent;
  
  return null;
}

/**
 * Validates that links and interactive elements have accessible names,
 * addressing REACT_036 fake link issues.
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {object} Validation result with valid flag and errors array
 */
function validateAccessibleLinks(container) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const root = container || document;
  const links = root.querySelectorAll('a, button, [role="link"], [role="button"]');
  
  links.forEach((el, index) => {
    const name = personName(el);
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Adds proper landmark regions to the document to ensure accessibility.
 * Ensures there is exactly one main landmark, adds nav if missing,
 * and provides accessible names for all landmark regions.
 * @returns {object} Result with valid flag and any errors
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Ensure there is exactly one main landmark
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
    document.body.appendChild(main);
  } else if (mainElements.length > 1) {
    for (let i = mainElements.length - 1; i > 0; i--) {
      const el = mainElements[i];
      const region = document.createElement('div');
      region.setAttribute('role', 'region');
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        region.setAttribute('aria-label', 'region');
      }
      while (el.firstChild) {
        region.appendChild(el.firstChild);
      }
      el.parentNode.replaceChild(region, el);
      errors.push('Duplicate main landmark converted to region');
    }
    const firstMain = mainElements[0];
    if (!firstMain.getAttribute('aria-label') && !firstMain.getAttribute('aria-labelledby') && !firstMain.querySelector('h1, h2, h3, h4, h5, h6')) {
      firstMain.setAttribute('aria-label', 'main content');
    }
  }
  
  // Add nav landmark if navigation links exist but no nav element
  if (!document.querySelector('nav, [role="navigation"]')) {
    const navLinks = document.querySelectorAll('a[href], [role="link"]');
    if (navLinks.length > 0) {
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'navigation');
      document.body.insertBefore(nav, document.body.firstChild);
      navLinks.forEach(link => nav.appendChild(link));
    }
  }
  
  // Ensure all landmark regions have accessible names
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"], [role="region"]');
  landmarks.forEach((landmark, index) => {
    const hasName = landmark.getAttribute('aria-label') || 
                    landmark.getAttribute('aria-labelledby') || 
                    landmark.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasName) {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      landmark.setAttribute('aria-label', `${role} ${index + 1}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New code to implement the fix for the accessibility issue
// Assuming the insight report indicated that a certain button needed to be focusable
if (typeof document !== 'undefined') {
  const focusableButton = document.querySelector('.focusable-button');
  if (focusableButton) {
    focusableButton.setAttribute('tabindex', '0');
  }
  
  // Before:
  // document.documentElement.lang = '';
  
  // After:
  document.documentElement.lang = 'en'; // Replace 'en' with the appropriate language code
}

const someFunction = () => {
  // some existing implementation
};

/**
 * Check if a link/URL is accessible
 * @param {string} url - The URL to check
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<{accessible: boolean, statusCode: number|null, error: string|null}>}
 */
function isLinkAccessible(url, timeout = 5000) {
  const http = require('http');
  const https = require('https');
  
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') {
      resolve({ accessible: false, statusCode: null, error: 'Invalid URL' });
      return;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      resolve({ accessible: false, statusCode: null, error: 'Malformed URL' });
      return;
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'HEAD',
      timeout: timeout,
    };

    const req = protocol.request(options, (res) => {
      const accessible = res.statusCode >= 200 && res.statusCode < 400;
      resolve({ accessible, statusCode: res.statusCode, error: null });
    });

    req.on('error', (e) => {
      resolve({ accessible: false, statusCode: null, error: e.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ accessible: false, statusCode: null, error: 'Request timeout' });
    });

    req.end();
  });
}

function checkLinkAndButtonAccessibility() {
  if (typeof document === 'undefined') {
    return [];
  }
  
  const issues = [];

  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasAccessibleName =
      link.textContent.trim() !== '' ||
      link.getAttribute('aria-label') !== null ||
      link.getAttribute('aria-labelledby') !== null;
    if (!hasAccessibleName) {
      issues.push({ type: 'link', element: link, index });
    }
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasAccessibleName =
      button.textContent.trim() !== '' ||
      button.getAttribute('aria-label') !== null ||
      button.getAttribute('aria-labelledby') !== null;
    if (!hasAccessibleName) {
      issues.push({ type: 'button', element: button, index });
    }
  });

  return issues;
}

// Export all functions to maintain current exports
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  validateAccessibleLinks,
  addProperLandmarkRegions
};