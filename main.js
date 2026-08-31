// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  issues.forEach((issue) => {
    if (!issue.element || !issue.element.parentNode) {
      summary.skipped++;
      return;
    }

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
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
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
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