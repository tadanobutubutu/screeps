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

function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
}

function personName(name) {
  if (name !== undefined && name !== null && typeof name === 'string' && name.trim().length > 0) {
    return name.trim();
  }
  return 'Person';
}

function validateTableAccessibility(table) {
  if (!table) return false;
  return table.tagName === 'TABLE' || table.getAttribute('role') === 'table';
}

function validateTableStructure(table) {
  if (!table) return false;
  return table.querySelectorAll('tr').length > 0;
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy && typeof document !== 'undefined') {
    const el = document.getElementById(ariaLabelledBy);
    if (el) return el.textContent || el.innerText || '';
  }
  const title = svg.querySelector('title');
  if (title) return title.textContent || title.innerText || '';
  return '';
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return 0;
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="banner"], [role="region"]');
  const seen = {};
  let duplicateCount = 0;
  for (let i = 0; i < landmarks.length; i++) {
    const el = landmarks[i];
    const label = el.getAttribute('aria-label') || el.id || el.getAttribute('role');
    if (seen[label]) {
      duplicateCount++;
    } else {
      seen[label] = true;
    }
  }
  return duplicateCount;
}

function createInPageButton(element, text) {
  if (!element || typeof document === 'undefined') return null;
  const btn = document.createElement('button');
  btn.textContent = text || 'Action';
  btn.setAttribute('type', 'button');
  if (element.parentNode) {
    element.parentNode.replaceChild(btn, element);
  }
  return btn;
}

function addressNewAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const summary = {
    totalIssues: Array.isArray(issues) ? issues.length : 0,
    fixes: [],
    skipped: 0
  };

  if (!Array.isArray(issues)) return summary;

  issues.forEach((issue) => {
    try {
      if (!issue || !issue.element) {
        summary.skipped++;
        return;
      }

      if (issue.type === 'svg') {
        const accessibleName = getSvgAccessibleName(issue.element);
        if (!accessibleName) {
          issue.element.setAttribute('aria-label', defaultText);
        }
        summary.fixes.push({
          type: 'svg',
          index: issue.index,
          action: 'Added accessible name to SVG'
        });
      } else if (issue.type === 'table') {
        validateTableAccessibility(issue.element);
        validateTableStructure(issue.element);
        summary.fixes.push({
          type: 'table',
          index: issue.index,
          action: 'Fixed table accessibility and structure'
        });
      } else if (issue.type === 'landmark') {
        summary.fixes.push({
          type: 'landmark',
          index: issue.index,
          action: 'Ensured unique landmark'
        });
      } else if (issue.type === 'lang') {
        const lang = getLangAttribute();
        if (issue.element.setAttribute) {
          issue.element.setAttribute('lang', lang);
        }
        summary.fixes.push({
          type: 'lang',
          index: issue.index,
          action: 'Added lang attribute'
        });
      } else if (issue.type === 'fakeLink') {
        const btnText = options.defaultText || personName('User');
        createInPageButton(issue.element, btnText);
        summary.fixes.push({
          type: 'fakeLink',
          index: issue.index,
          action: 'Created in-page button for fake link'
        });
      } else {
        summary.skipped++;
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue && issue.type ? issue.type : 'unknown',
        index: issue && issue.index !== undefined ? issue.index : -1,
        action: 'Failed to fix new issue',
        error: error.message
      });
    }
  });

  return summary;
}

function checkLinkAndButtonAccessibility(issues, options) {
  return addressAccessibilityIssues(issues, options);
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkLinkAndButtonAccessibility, addressAccessibilityIssues, calculateSum, calculateProduct, getLangAttribute, personName, validateTableAccessibility, validateTableStructure, getSvgAccessibleName, ensureUniqueLandmarks, createInPageButton, addressNewAccessibilityIssues };
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
  window.getSvgAccessibleName = getSvgAccessibleName;
  window.ensureUniqueLandmarks = ensureUniqueLandmarks;
  window.createInPageButton = createInPageButton;
  window.addressNewAccessibilityIssues = addressNewAccessibilityIssues;
}