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
 * Renders a dependency graph for debugging purposes.
 * @param {Array} modules - Array of module objects with dependencies
 * @returns {string} - A string representation of the dependency graph
 */
function renderDependencyGraph(modules) {
  const lines = [];
  lines.push('Dependency Graph:');
  modules.forEach((mod) => {
    lines.push(`  ${mod.name}`);
    if (mod.dependencies && mod.dependencies.length > 0) {
      mod.dependencies.forEach((dep) => {
        lines.push(`    -> ${dep}`);
      });
    } else {
      lines.push('    -> (no dependencies)');
    }
  });
  return lines.join('\n');
}

/**
 * Displays the structure of modules for debugging purposes.
 * @param {Array} modules - Array of module objects
 * @returns {string} - A string representation of the module structure
 */
function displayModuleStructure(modules) {
  const lines = [];
  lines.push('Module Structure:');
  modules.forEach((mod, index) => {
    lines.push(`[${index}] ${mod.name}`);
    if (mod.exports && mod.exports.length > 0) {
      mod.exports.forEach((exp) => {
        lines.push(`    exports: ${exp}`);
      });
    }
    if (mod.children && mod.children.length > 0) {
      mod.children.forEach((child) => {
        lines.push(`    child: ${child.name || child}`);
      });
    }
  });
  return lines.join('\n');
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLinkAndButtonAccessibility,
    addressAccessibilityIssues,
    calculateSum,
    calculateProduct,
    renderDependencyGraph,
    displayModuleStructure
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.renderDependencyGraph = renderDependencyGraph;
  window.displayModuleStructure = displayModuleStructure;
}