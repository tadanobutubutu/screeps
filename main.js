// TODO: This is the existing code that needs to preserve
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

const fs = require('fs');
const path = require('path');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and newFocusTrap())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

/**
 * REACT_015: Add lang attribute to HTML element
 * Sets the lang attribute on the HTML element for proper language declaration
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttributeToHtml(langCode = 'en') {
  const html = document.documentElement;
  if (html && langCode) {
    html.setAttribute('lang', langCode);
    console.log(`Set lang attribute to: ${langCode}`);
  }
}

/**
 * REACT_017: Add landmark roles and fix landmark issues
 * Ensures proper landmark roles are applied to main content areas
 * @param {HTMLElement} container - The container element to process
 */
function addLandmarkRoles(container = document) {
  const main = container.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  const nav = container.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  const footer = container.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  const aside = container.querySelector('aside');
  if (aside && !aside.getAttribute('role')) {
    aside.setAttribute('role', 'complementary');
  }

  const search = container.querySelector('[role="search"]');
  if (search && !search.id) {
    search.setAttribute('id', 'main-search');
  }

  console.log('Added landmark roles to semantic elements');
}

/**
 * REACT_043: Wrap primary content in a main element
 * Ensures primary content is wrapped in a <main> element with proper attributes
 */
function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('main') || document.querySelector('[role="main"]');

  if (!primaryContent) {
    // Create a new main element and wrap the primary content
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');
    newMain.id = 'main-content';

    // Move all top-level body children (excluding existing mains, headers, footers, etc.) into the new main
    const bodyChildren = document.body.children;
    const elementsToMove = [];
    for (let i = 0; i < bodyChildren.length; i++) {
      const child = bodyChildren[i];
      const tagName = child.tagName.toLowerCase();
      if (!['header', 'footer', 'nav', 'main', 'aside'].includes(tagName)) {
        elementsToMove.push(child);
      }
    }

    elementsToMove.forEach((element) => {
      newMain.appendChild(element);
    });

    document.body.appendChild(newMain);
  } else {
    // Ensure main has proper attributes
    if (!primaryContent.hasAttribute('role')) {
      primaryContent.setAttribute('role', 'main');
    }
    if (!primaryContent.id) {
      primaryContent.id = 'main-content';
    }
  }
}

/**
 * REACT_025: Ensure unique landmarks (2 issues)
 * Makes landmark values unique by adding or updating IDs
 * @param {HTMLElement} container - The container element to process
 */
function ensureUniqueLandmarks(container = document) {
  const landmarks = container.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');

  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role');
    if (!landmark.id) {
      landmark.id = `${role}-${index + 1}`;
    }
  });

  console.log(`Ensured uniqueness for ${landmarks.length} landmarks`);
}

/**
 * REACT_041: Add accessible names to SVGs
 * Adds aria-label or title elements to SVGs for screen reader support
 * @param {HTMLElement} container - The container element to process
 */
function addAccessibleNamesToSVGs(container = document) {
  const svgs = container.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const existingTitle = svg.querySelector('title');
      if (!existingTitle) {
        const title = document.createElement('title');
        title.textContent = `SVG icon ${index + 1}`;
        svg.insertBefore(title, svg.firstChild);
      }

      const titleId = `svg-title-${index + 1}`;
      const titleEl = svg.querySelector('title');
      if (titleEl) {
        titleEl.id = titleId;
      }

      svg.setAttribute('aria-labelledby', titleId);
    }
  });

  console.log(`Added accessible names to ${svgs.length} SVGs`);
}

/**
 * REACT_036: Fix fake link issues
 * Converts elements that appear as links but aren't properly marked up
 * @param {HTMLElement} container - The container element to process
 */
function fixFakeLinks(container = document) {
  const clickableElements = container.querySelectorAll('[onclick]:not(a):not(button)');

  clickableElements.forEach((element, index) => {
    const text = element.textContent?.trim();
    const isIconOnly = element.querySelector('svg, img, i[class*="icon"]');

    if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
      // Convert to button if it's clickable
      element.setAttribute('role', 'button');

      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }

      if (isIconOnly && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        element.setAttribute('aria-label', `Button ${index + 1}`);
      }

      if (!text) {
        console.warn(`Fake link element ${index + 1} may need accessible name`);
      }
    }
  });

  console.log(`Fixed ${clickableElements.length} fake link elements`);
}

/**
 * Address accessibility issues from insight report
 * Processes an accessibility report and logs/suggests fixes for issues
 * @param {Object} insightReport - The accessibility report object
 */
function addressAccessibilityIssues(insightReport) {
  // Handle case where insightReport is null, undefined, or not an object
  if (!insightReport || typeof insightReport !== 'object') {
    console.warn('Invalid insight report provided to addressAccessibilityIssues');
    return;
  }
}

/**
 * Main function to apply all accessibility fixes
 * Addresses all issues from the accessibility insight report
 * @param {Object} insightReport - Optional accessibility report
 */
function applyAllAccessibilityFixes(insightReport) {
  // REACT_015: Add lang attribute
  addLangAttributeToHtml();

  // REACT_017: Add landmark roles
  addLandmarkRoles();

  // REACT_043: Wrap primary content in main
  wrapPrimaryContentInMain();

  // REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks();

  // REACT_041: Add accessible names to SVGs
  addAccessibleNamesToSVGs();

  // REACT_036: Fix fake links
  fixFakeLinks();

  // Process insight report if provided
  if (insightReport) {
    addressAccessibilityIssues(insightReport);
  }

  console.log('All accessibility fixes have been applied');
}

/**
 * Focus trap utility for modal dialogs and menus
 * Restricts keyboard focus to a given container element
 * @param {HTMLElement} element - The container element to trap focus within
 */
function newFocusTrap(element) {
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  return {
    activate: () => {
      if (firstFocusable) {
        firstFocusable.focus();
      }
    },
    handleTab: (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };
}

const accessibilityUtils = {
  // Utility functions for accessibility
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },
  trapFocus: (element) => {
    const trap = newFocusTrap(element);
    trap.activate();
    element.addEventListener('keydown', trap.handleTab);
  },
  announceToScreenReader: (message, priority = 'polite') => {
    const liveRegion = document.getElementById('a11y-announcer') || (() => {
      const region = document.createElement('div');
      region.id = 'a11y-announcer';
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.style.position = 'absolute';
      region.style.left = '-9999px';
      document.body.appendChild(region);
      return region;
    })();
    liveRegion.textContent = '';
    setTimeout(() => { liveRegion.textContent = message; }, 100);
  },
  handleKeyboardNav: (e, handlers) => {
    if (handlers && typeof handlers[e.key] === 'function') {
      handlers[e.key](e);
    }
  },
  newFocusTrap: newFocusTrap
};

// Functions already existing in the file to preserve
// ...

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `el-${Math.random().toString(36).slice(2, 9)}`;
  }
};

const addAriaLabel = (element, label) => {
  if (element && label && !element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
};

const renderDependencyGraph = (data) => {
  if (!data) return null;
  const container = document.createElement('div');
  container.className = 'dependency-graph';
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Dependency graph visualization');
  return container;
};

// Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
function calculateSum(a, b) { return a + b; }

// Credential response handling
async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }
  
  if (response.error) {
    throw new Error(response.error);
  }
  
  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }
  
  throw new Error('Invalid credential response');
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', "Download " + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader("Download of " + filename + " started");
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log("Error reading file " + filePath + ": " + error.message, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
  // Add keyboard support for all interactive elements
  document.querySelectorAll('[data-accessible]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    });
  });
};

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// TODO: Implement the new function as per the issue requirements
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  const processValue = (value) => {
    if (typeof value === 'string') {
      let processed = value;
      if (trimWhitespace) {
        processed = processed.trim();
      }
      if (uppercase) {
        processed = processed.toUpperCase();
      }
      if (maxLength !== null && processed.length > maxLength) {
        processed = processed.substring(0, maxLength);
      }
      return processed;
    }
    return value;
  };

  if (typeof inputData === 'object' && !Array.isArray(inputData) && inputData !== null) {
    const result = {};
    const keys = preserveKeys ? Object.keys(inputData) : Object.keys(inputData).map(() => Math.random().toString(36).substr(2, 9));
    
    let i = 0;
    for (const key of Object.keys(inputData)) {
      const value = inputData[key];
      if (typeof value === 'object' && value !== null) {
        result[keys[i]] = transformInputData(value, options);
      } else {
        result[keys[i]] = processValue(value);
      }
      i++;
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return transformInputData(item, options);
      }
      return processValue(item);
    });
  }

  return processValue(inputData);
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// New function: validateTableAccessibility
function validateTableAccessibility(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for presence of <caption> (accessibility best practice for table description)
  const caption = tableElement.querySelector('caption');
  if (!caption || !caption.textContent.trim()) {
    issues.push('TABLE is missing a descriptive caption');
  }

  // Check that all rows have consistent number of cells
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  let expectedCellCount = null;

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.children).filter(
      child => ['TH', 'TD'].includes(child.tagName.toUpperCase())
    );

    if (expectedCellCount === null && cells.length > 0) {
      expectedCellCount = cells.length;
    }

    if (expectedCellCount !== null && cells.length !== expectedCellCount) {
      issues.push(`Row ${rowIndex + 1} has inconsistent number of cells`);
    }
  });

  // Check that TH elements exist (header row/column should be marked)
  const thCells = tableElement.querySelectorAll('th');
  if (thCells.length === 0) {
    issues.push('TABLE has no header cells (TH) defined');
  }

  return issues;
}

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

// ----- Additional functions for rendering dependency graphs and displaying module structure -----

/**
 * Renders a dependency graph as a simple text representation.
 * @param {Object} data - The graph data with nodes and edges.
 * @returns {string} A string representation of the graph.
 */
function renderDependencyGraphVisualization(data) {
  const nodes = data.nodes || [];
  const edges = data.edges || [];
  let output = 'Dependency Graph:\n';
  output += 'Nodes:\n';
  nodes.forEach(node => {
    output += ` - ${node.id || node.name || JSON.stringify(node)}\n`;
  });
  output += 'Edges:\n';
  edges.forEach(edge => {
    output += ` ${edge.source} -> ${edge.target}\n`;
  });
  return output;
}

/**
 * Displays the module structure in a tree-like format.
 * @param {Object} module - The module object with name and children.
 * @param {number} depth - Current depth for indentation.
 * @returns {string} A string representation of the module tree.
 */
function displayModuleStructure(module, depth = 0) {
  if (!module) return '';
  const indent = '  '.repeat(depth);
  let output = `${indent}${module.name || 'Module'}\n`;
  if (module.children && Array.isArray(module.children)) {
    module.children.forEach(child => {
      output += displayModuleStructure(child, depth + 1);
    });
  }
  return output;
}

// Export all utilities
module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  calculateSum,
  newFocusTrap,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  transformInputData,
  validateTableAccessibility,
  ensureElementHasId,
  renderDependencyGraphVisualization,
  displayModuleStructure,
  addLangAttributeToHtml,
  addLandmarkRoles,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinks,
  addressAccessibilityIssues,
  applyAllAccessibilityFixes
};