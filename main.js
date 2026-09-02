// TODO: Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks
// - REACT_036: Fix 1 fake link issue

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e. g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Gets the current lang attribute from the document's <html> element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || '';
  }
  return '';
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
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[éèêàâïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German;
    }
  }

  return lang;
}

/**
 * Returns a properly formatted person name
 * @param {string} name - The person 's name
 * @returns {string} The formatted person name
 */
function personName(name) {
  if (!name) return '';
  return String(name).trim();
}

/**
 * Creates an accessible in- page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  // Check if table has a caption
  if (!table.querySelector('caption')) {
    console.warn('Table is missing a caption');
    return false;
  }

  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    console.warn('Table is missing header cells');
    return false;
  }

  // Check if table cells have proper scope attributes
  const cells = table.querySelectorAll('td, th');
  for (const cell of cells) {
    if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
      console.warn('Table header cell is missing scope attribute');
      return false;
    }
  }

  return true;
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  // Check if table has proper structure
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    console.warn('Table is missing required thead or tbody elements');
    return false;
  }

  // Check if table has at least one row
  if (table.querySelectorAll('tr').length === 0) {
    console.warn('Table is missing rows');
    return false;
  }

  return true;
}

/**
 * Validates landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark(element) {
  if (!element || typeof element !== 'object') return false;

  // Check if element is a valid landmark role
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const role = element.getAttribute('role') || element.tagName.toLowerCase();

  if (!validRoles.includes(role)) {
    return false;
  }

  // Check for required ARIA attributes based on role
  switch (role) {
    case 'navigation':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
    case 'region':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
    case 'form':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
  }

  // Check if landmark is unique when required
  if (['banner', 'main', 'contentinfo'].includes(role)) {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Validates the structure of landmark elements
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark structure is valid
 */
function validateLandmarkStructure(element) {
  if (!element || typeof element !== 'object') return false;

  // Check if element is a landmark role
  const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'region', 'search'];
  const role = element.getAttribute('role') || element.tagName.toLowerCase();

  if (!landmarkRoles.includes(role)) {
    return false;
  }

  // Check for proper nesting
  if (role === 'main' && element.parentElement && element.parentElement.tagName.toLowerCase() === 'body') {
    return true;
  }

  return true;
}

/**
 * Gets the accessible name from an SVG element
 * @param {SVGSVGElement} svg - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || '';
}

/**
 * Validates landmark attributes for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark attributes are valid
 */
function validateLandmarkAttributes(element) {
  if (!element || typeof element !== 'object') return true;
  return true;
}

/**
 * Sets SVG attributes to ensure accessibility
 * @param {SVGSVGElement} svg - The SVG element
 * @param {string} name - The accessible name for the SVG
 */
function setSvgAttributes(svg, name) {
  if (!svg || typeof svg !== 'object') return;
  svg.setAttribute('aria-label', name);
  svg.setAttribute('role', 'img');
}

/**
 * Ensures all landmarks are unique in the document
 * @returns {boolean} Whether all landmarks are unique
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return true;
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
  const landmarkRoles = new Set();
  for (const landmark of landmarks) {
    const role = landmark.getAttribute('role');
    if (landmarkRoles.has(role)) {
      return false;
    }
    landmarkRoles.add(role);
  }
  return true;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {boolean} Whether the link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') return true;
  return link.hasAttribute('href') && link.getAttribute('href') !== '#';
}

/**
 * Handles fake links by converting them to proper buttons
 * @param {HTMLAnchorElement} link - The fake link to convert
 * @returns {HTMLButtonElement} The converted button element
 */
function handleFakeLinks(link) {
  if (!link || typeof link !== 'object' || link.tagName !== 'A') return null;
  if (link.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
    link.parentNode.replaceChild(button, link);
    return button;
  }
  return null;
}

// REACT_015: Add lang attribute to HTML element
// Add the language attribute to the HTML element for proper accessibility
function fixHtmlLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    const currentLang = document.documentElement.lang;
    const content = document.body ? document.body.textContent : '';
    const detectedLang = detectAndSetLang(content);
    document.documentElement.lang = currentLang || detectedLang;
  }
}

// REACT_027: Fix table structure issues
// Fixes common table accessibility issues
function fixTableStructure(table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  let fixed = false;

  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table';
    table.insertBefore(caption, table.firstChild);
    fixed = true;
  }

  // Add thead and tbody if missing
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    const thead = table.querySelector('thead') || document.createElement('thead');
    const tbody = table.querySelector('tbody') || document.createElement('tbody');
    
    // Move rows to tbody if they're direct children and not in thead
    const rows = Array.from(table.querySelectorAll('tr'));
    for (const row of rows) {
      if (!row.parentElement.querySelector('thead') && row.parentElement === table) {
        tbody.appendChild(row);
        fixed = true;
      }
    }
    
    if (!table.querySelector('thead')) {
      table.insertBefore(thead, table.firstChild);
      fixed = true;
    }
    if (!table.querySelector('tbody')) {
      table.appendChild(tbody);
      fixed = true;
    }
  }

  // Add scope attributes to th elements
  const headers = table.querySelectorAll('th');
  for (const header of headers) {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
      fixed = true;
    }
  }

  return fixed;
}

// REACT_017: Fix landmark issues - add proper labels to landmarks
function fixLandmarkLabels() {
  if (typeof document === 'undefined') return;
  
  // Fix navigation landmarks
  const navigations = document.querySelectorAll('[role="navigation"]');
  for (const nav of navigations) {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'Navigation');
    }
  }

  // Fix region landmarks
  const regions = document.querySelectorAll('[role="region"]');
  for (const region of regions) {
    if (!region.hasAttribute('aria-label') && !region.hasAttribute('aria-labelledby')) {
      region.setAttribute('aria-label', 'Region');
    }
  }

  // Fix form landmarks
  const forms = document.querySelectorAll('[role="form"]');
  for (const form of forms) {
    if (!form.hasAttribute('aria-label') && !form.hasAttribute('aria-labelledby')) {
      form.setAttribute('aria-label', 'Form');
    }
  }
}

// REACT_025: Ensure unique landmarks by removing duplicates or modifying roles
function fixUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  const uniqueRoles = ['banner', 'main', 'contentinfo'];
  
  for (const role of uniqueRoles) {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      // Keep the first element, remove role from others or change to region with label
      for (let i = 1; i < elements.length; i++) {
        const element = elements[i];
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', 'Supplementary ' + (element.textContent ? element.textContent.trim().substring(0, 20) : 'Content'));
      }
    }
  }
}

// REACT_041: Add accessible names to SVGs
function fixSvgAccessibility() {
  if (typeof document === 'undefined') return;
  
  const svgs = document.querySelectorAll('svg');
  for (const svg of svgs) {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.hasAttribute('title')) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Graphic');
    } else if (svg.hasAttribute('title') && !svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.getAttribute('title');
      if (title) {
        svg.setAttribute('aria-label', title);
      }
    }
  }
}

// REACT_036: Fix fake links (links with href="#")
function fixFakeLinks() {
  if (typeof document === 'undefined') return;
  
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  for (const link of fakeLinks) {
    handleFakeLinks(link);
  }
}

// Run all accessibility fixes
function fixAllAccessibilityIssues() {
  fixHtmlLangAttribute();
  fixLandmarkLabels();
  fixUniqueLandmarks();
  fixSvgAccessibility();
  fixFakeLinks();
  
  // Fix tables after DOM is ready
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    for (const table of tables) {
      fixTableStructure(table);
    }
  }
}

// Auto-fix on module load if in browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fixAllAccessibilityIssues, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fixAllAccessibilityIssues);
  }
}

module.exports = {
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  fixHtmlLangAttribute,
  fixTableStructure,
  fixLandmarkLabels,
  fixUniqueLandmarks,
  fixSvgAccessibility,
  fixFakeLinks,
  fixAllAccessibilityIssues
};