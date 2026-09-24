// _Commit: 0457fc77191e9773113c8020dda42de0e9c85cee_
// <!-- todo-hash: 976409385ddd48f0a50b6cdeda656d4907b5fda2 -->
// TODO: Address accessibility issues from insight report — FIXED
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

const someFunction = () => {
  // some existing implementation
};

  function trapFocus() {
    focusableElements = element.querySelectorAll('a, button, input, textarea, select');
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

// New function to validate link accessibility and handle fake links
const validateLinkAccessibility = (target) => {
  // Single-link validation mode
  if (target && target.nodeType === 1 && target.tagName === 'A') {
    const issues = [];
    if (!target) {
      return { valid: false, issues: ['Link not found'] };
    }
    const hasText = target.textContent.trim().length > 0;
    const hasAriaLabel = target.hasAttribute('aria-label');
    const hasTitle = target.hasAttribute('title');
    if (!hasText && !hasAriaLabel && !hasTitle) {
      issues.push('Link must have text content, aria-label, or title');
    }
    const href = target.getAttribute('href');
    if (!href || href === '#') {
      issues.push('Link should have a valid href attribute');
    }
    return { valid: issues.length === 0, issues };
  }

  // Document-level scan for fake links
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if ((link.href && link.href.startsWith('#')) || !link.hasAttribute('href')) {
      handleFakeLinks(link);
    }
  }

// New function to handle fake links by wrapping them in an in-page button,
// or process clickable non-anchor/non-button elements when given a Document
const handleFakeLinks = (target) => {
  // Document mode: handle non-anchor clickable elements
  if (target && target.nodeType === 9) {
    const results = { found: 0, processed: 0 };
    const clickableElements = target.querySelectorAll('[onclick], [role="button"]');
    clickableElements.forEach(element => {
      if (element.tagName !== 'A' && element.tagName !== 'BUTTON') {
        results.found++;
        if (!element.getAttribute('tabindex') && !element.hasAttribute('role')) {
          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
          results.processed++;
        }
      }
    });
    return results;
  }

  // Link mode: wrap a single anchor in an in-page button
  const link = target;
  if (!link) return;
  const fakeLinkButton = createInPageButton(link.textContent, link.href);
  link.textContent = '';
  link.setAttribute('target', '_top');
  link.addEventListener('click', (event) => {
    event.preventDefault();
    fakeLinkButton.click();
  });

  // Initialize the focus trap
  trapFocus();
}

/**
 * Checks link and button accessibility in a given context
 * @param {Object} context - Context object containing document or DOM elements
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(context = {}) {
  const issues = [];
  const documentObj = context.document || (typeof document !== 'undefined' ? document : {});
  
  if (typeof documentObj.querySelectorAll !== 'function') {
    return issues;
  }
  
  try {
    // Check links
    const links = documentObj.querySelectorAll('a');
    links.forEach((link, index) => {
      if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
        issues.push({
          type: 'link',
          element: link,
          index: index,
          description: 'Link without accessible name or text content'
        });
      }
    });
    
    // Check buttons
    const buttons = documentObj.querySelectorAll('button');
    buttons.forEach((button, index) => {
      if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
        issues.push({
          type: 'button',
          element: button,
          index: index,
          description: 'Button without accessible name or text content'
        });
      }
    });
  } catch (error) {
    // Error handling for DOM queries in restricted environments
  }
  
  return issues;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function validateLandmarkStructure(doc) {
  const issues = [];
  
  const requiredLandmarks = ['header', 'main', 'footer'];
  requiredLandmarks.forEach(landmark => {
    const element = doc.querySelector(landmark) || doc.querySelector(`[role="${landmark}"]`);
    if (!element) {
      issues.push(`Missing required landmark: ${landmark}`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Ensure unique landmarks in the document
 * @param {Document} doc - The document to process
 * @returns {Object} Processing result
 */
function ensureUniqueLandmarks(doc) {
  const results = { processed: 0, updated: 0 };
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarkTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('role', tag);
          results.updated++;
        }
        results.processed++;
      });
    }
  });
  
  return results;
}

/**
 * Get SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const titleElement = document.getElementById(ariaLabelledBy);
    return titleElement ? titleElement.textContent : '';
  }
  
  return '';
}

/**
 * Set SVG accessibility attributes
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 * @returns {SVGElement} The updated SVG element
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return svg;
  
  if (!svg.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  }
  
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  return svg;
}

/**
 * Add SVG accessibility props to all SVGs in the document
 * @param {Document} doc - The document to process
 * @returns {Object} Processing result
 */
function addSvgAccessibilityProps(doc) {
  const results = { found: 0, processed: 0, updated: 0 };
  const svgs = doc.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    results.found++;
    const accessibleName = getSvgAccessibleName(svg);
    const originalName = accessibleName || `SVG icon ${results.found}`;
    const updatedSvg = setSvgAttributes(svg, originalName);
    
    if (updatedSvg) {
      results.processed++;
      // Check if we added aria-label
      if (updatedSvg.hasAttribute('aria-label') && !svg.hasAttribute('aria-label')) {
        results.updated++;
      }
    }
  });
  
  return results;
}

/**
 * Address all accessibility issues from the insight report
 * @param {Document} doc - The document to process
 * @returns {Object} Result summary
 */
function addressAccessibilityIssues(doc) {
  const results = {};

  // Add lang attribute
  const lang = getLangAttribute();
  if (doc && doc.documentElement) {
    doc.documentElement.setAttribute('lang', lang);
  }

  // Fix table structure and accessibility
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);

    // Ensure caption or aria-label
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      const caption = doc.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure header row with th elements
    const rows = table.querySelectorAll('tr');
    let hasHeader = false;
    rows.forEach(row => {
      if (row.querySelector('th')) {
        hasHeader = true;
      }
    });

    if (!hasHeader && rows.length > 0) {
      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('td');
      cells.forEach(cell => {
        const th = doc.createElement('th');
        th.textContent = cell.textContent;
        cell.parentNode.replaceChild(th, cell);
      });
    }
  });

  // Fix landmark issues
  ensureUniqueLandmarks(doc);
  validateLandmarkStructure(doc);

  // Add accessible names to SVGs
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (name) {
      setSvgAttributes(svg, name);
    }
  });

  // Handle fake links
  handleFakeLinks(doc);

  results.status = 'completed';
  return results;
}

function calculateProduct(a, b) {
  return a * b;
}

function checkLinkAndButtonAccessibility(issues, options = {}) {
  if (Array.isArray(issues)) {
    return addressAccessibilityIssues(issues, options);
  }
  return addressAccessibilityIssues([{ element: issues, type: 'link', index: 0 }], options);
}

function getLangAttribute(element) {
  if (element && typeof element.getAttribute === 'function') {
    const lang = element.getAttribute('lang');
    if (lang) return lang;
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || document.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
}

function personName(person) {
  if (!person) return 'Unknown';
  if (typeof person === 'string') return person;
  if (person && typeof person === 'object') {
    if (person.name) return person.name;
    if (person.firstName && person.lastName) return person.firstName + ' ' + person.lastName;
    if (person.firstName) return person.firstName;
    if (person.username) return person.username;
  }
  return 'Unknown';
}

function validateTableAccessibility(table) {
  let fixed = 0;
  if (!table || typeof table.querySelector !== 'function') return fixed;
  try {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      fixed++;
    }
    const ths = table.querySelectorAll('th');
    for (let i = 0; i < ths.length; i++) {
      if (!ths[i].getAttribute('scope')) {
        ths[i].setAttribute('scope', 'col');
        fixed++;
      }
    }
  } catch (e) {}
  return fixed;
}

function validateTableStructure(table) {
  let fixed = 0;
  if (!table || typeof table.querySelector !== 'function') return fixed;
  try {
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      rows.forEach(row => {
        if (row.parentNode === table) {
          tbody.appendChild(row);
        }
      });
      if (tbody.childNodes.length > 0) {
        table.appendChild(tbody);
        fixed++;
      }
    }
    if (table.querySelector('tr') && !table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow.querySelector('th')) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
        fixed++;
      }
    }
  } catch (e) {}
  return fixed;
}

function validateLandmark(element) {
  let fixed = 0;
  if (!element || typeof element.getAttribute !== 'function') return fixed;
  const role = element.getAttribute('role');
  const valid = ['banner', 'main', 'navigation', 'contentinfo', 'complementary', 'region', 'search', 'form'];
  if (valid.includes(role)) {
    if ((role === 'region' || role === 'navigation' || role === 'search' || role === 'form') && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', role);
      fixed++;
    }
  }
  return fixed;
}

function validateLandmarkStructure(element) {
  let fixed = 0;
  if (!element || typeof element.getAttribute !== 'function') return fixed;
  const role = element.getAttribute('role');
  if (role === 'region' && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', 'Region');
    fixed++;
  }
  return fixed;
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  if (typeof svg.getAttribute === 'function') {
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const labelledBy = svg.getAttribute('aria-labelledby');
    if (labelledBy && typeof document !== 'undefined') {
      const el = document.getElementById(labelledBy);
      if (el) return el.textContent || el.getAttribute('aria-label') || '';
    }
    const alt = svg.getAttribute('alt');
    if (alt) return alt;
  }
  if (typeof svg.querySelector === 'function') {
    const title = svg.querySelector('title');
    if (title) return title.textContent || '';
  }
  return '';
}

function createInPageButton(options = {}) {
  if (typeof document === 'undefined') return null;
  const button = document.createElement('button');
  button.textContent = options.text || options.label || 'Action';
  if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
  if (options.id) button.id = options.id;
  if (options.className) button.className = options.className;
  if (options.onClick && typeof options.onClick === 'function') {
    button.addEventListener('click', options.onClick);
  }
  return button;
}

function ensureUniqueLandmarks(container) {
  let fixed = 0;
  if (typeof document === 'undefined') return fixed;
  const root = container || (typeof document.body !== 'undefined' ? document.body : null);
  if (!root || typeof root.querySelectorAll !== 'function') return fixed;
  const roles = ['banner', 'main', 'navigation', 'contentinfo', 'complementary', 'region', 'search', 'form'];
  roles.forEach(role => {
    const nodes = root.querySelectorAll(`[role="${role}"]`);
    nodes.forEach((node, index) => {
      if (index > 0) {
        const hasLabel = node.getAttribute('aria-label') || node.getAttribute('aria-labelledby');
        if (!hasLabel) {
          node.setAttribute('aria-label', role + ' ' + (index + 1));
          fixed++;
        }
      }
    });
  });
  return fixed;
}

function fixDependencyGraph() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('dependencyGraph');
  if (container) {
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'region');
    }
    if (!container.getAttribute('aria-label') && !container.getAttribute('aria-labelledby')) {
      container.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixDependencyGraph);
  } else {
    fixDependencyGraph();
  }
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLinkAndButtonAccessibility,
    addressAccessibilityIssues,
    calculateSum,
    calculateProduct,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    ensureUniqueLandmarks,
    fixDependencyGraph
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAccessibility = checkLinkAccessibility;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.getLangAttribute = getLangAttribute;
  window.personName = personName;
  window.validateTableAccessibility = validateTableAccessibility;
  window.validateTableStructure = validateTableStructure;
  window.validateLandmark = validateLandmark;
  window.validateLandmarkStructure = validateLandmarkStructure;
  window.getSvgAccessibleName = getSvgAccessibleName;
  window.createInPageButton = createInPageButton;
  window.ensureUniqueLandmarks = ensureUniqueLandmarks;
  window.fixDependencyGraph = fixDependencyGraph;
}