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

/**
 * Ensures the dependencyGraph container has a proper ARIA role
 * @param {string} containerId - The ID of the dependencyGraph container
 * @returns {Object} - Summary of the role assignment
 */
function ensureDependencyGraphRole(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return { success: false, message: 'Container not found' };
  }

  const summary = {
    containerId,
    previousRole: container.getAttribute('role') || 'none',
    newRole: 'application',
    success: true
  };

  container.setAttribute('role', 'application');
  return summary;
}

/**
 * Ensures all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
 * @param {string} scopeSelector - Optional selector to scope the search (defaults to document)
 * @returns {Object} - Summary of ids assigned to landmark elements
 */
function ensureLandmarkIds(scopeSelector) {
  const scope = scopeSelector ? document.querySelector(scopeSelector) : document;
  const landmarkElements = scope.querySelectorAll('header, nav, main, aside, section, footer');

  const summary = {
    totalLandmarks: landmarkElements.length,
    assignedIds: [],
    existingIds: [],
    fixes: []
  };

  let idCounter = 0;

  landmarkElements.forEach((landmark, index) => {
    if (landmark.id) {
      summary.existingIds.push(landmark.id);
      summary.fixes.push({
        tag: landmark.tagName.toLowerCase(),
        action: 'Existing id preserved',
        id: landmark.id
      });
    } else {
      const generatedId = `landmark-${idCounter++}`;
      landmark.id = generatedId;
      summary.assignedIds.push(generatedId);
      summary.fixes.push({
        tag: landmark.tagName.toLowerCase(),
        action: 'Generated id',
        id: generatedId
      });
    }
  });

  return summary;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ...module.exports, addressAccessibilityIssues, ensureDependencyGraphRole, ensureLandmarkIds, calculateSum, calculateProduct };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.ensureDependencyGraphRole = ensureDependencyGraphRole;
  window.ensureLandmarkIds = ensureLandmarkIds;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
}