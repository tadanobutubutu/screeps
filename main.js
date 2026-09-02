// TODO: This is the existing code that needs to be preserved

// Addressed accessibility issues from insight report
// _Commit: aabb40916364c3b608e08e010dc71de4a04dfa74_
// ----- END ORIGINAL CODE-----

// Import required modules
const AccessibilityHelpers = require('./AccessibilityHelpers');
const utilities = require('./utilities');

const {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateAccessibilityReport,
  checkAccessibility,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasIdOrigin,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  implementAccessibilityFixesFromReport,
  renderGraphIndex,
  trapFocus,
  checkAccessibilityForReport
} = AccessibilityHelpers;

// Access the dependencyGraph container and ensure it has proper ARIA role
function fixDependencyGraphAriaRole(container) {
  const dependencyGraph = container?.getElementById?.('dependencyGraph') 
    || container?.querySelector?.('[data-dependency-graph]')
    || (typeof document !== 'undefined' && (document.getElementById('dependencyGraph') || document.querySelector('[data-dependency-graph]')));
  
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.getAttribute('aria-label') && !dependencyGraph.getAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }
  }
  return dependencyGraph;
}

/**
 * Adds an accessible name to an SVG string
 * @param {string} svgString - The SVG string to modify
 * @param {string} label - The accessible label to add
 * @returns {string} Modified SVG string with aria-label
 */
function addAccessibleName(svgString, label = 'Descriptive label for SVG') {
  if (typeof DOMParser === 'undefined' || typeof XMLSerializer === 'undefined') {
    return svgString;
  }
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', label);
  }
  return new XMLSerializer().serializeToString(svg);
}

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructure(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

/**
 * New function to handle additional rendering logic
 * @param {Object} additionalData - Additional data for rendering
 * @returns {string} Rendered additional content HTML
 */
function renderAdditionalContent(additionalData) {
  const container = typeof document !== 'undefined' ? document.createElement('div') : { 
    className: '', 
    setAttribute: () => {}, 
    innerHTML: '', 
    outerHTML: '<div class="additional-content"></div>' 
  };
  container.className = 'additional-content';
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Additional content');
  
  if (additionalData && additionalData.content) {
    container.innerHTML = additionalData.content;
  }
  
  return container.outerHTML || '<div class="additional-content">' + (additionalData ? additionalData.content : '') + '</div>';
}

// Task scheduling functions
const taskQueue = [];
let taskIdCounter = 0;

function addTask(taskFn, priority = 'medium') {
  const id = generateTaskId();
  const task = { id, fn: taskFn, priority, cancelled: false };
  taskQueue.push(task);
  taskQueue.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  return id;
}

function generateTaskId() {
  return `task_${Date.now()}_${++taskIdCounter}`;
}

function cancelTask(id) {
  const task = taskQueue.find(t => t.id === id);
  if (task) {
    task.cancelled = true;
    return true;
  }
  return false;
}

function processTasks() {
  while (taskQueue.length > 0) {
    const task = taskQueue.shift();
    if (!task.cancelled) {
      try {
        task.fn();
      } catch (error) {
        console.error('Task execution error:', error);
      }
    }
  }
}

// Element labeling and focus management
function setElementLabel(elementId, label) {
  if (typeof document === 'undefined') return false;
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

function setFocus(elementId) {
  if (typeof document === 'undefined') return false;
  const element = document.getElementById(elementId);
  if (element && typeof element.focus === 'function') {
    element.focus();
    return true;
  }
  return false;
}

function handleKeyboardNavigation(event) {
  if (typeof document === 'undefined') return;
  // Basic keyboard navigation handler
  const focusableElements = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const elements = Array.from(document.querySelectorAll(focusableElements)).filter(el => !el.disabled && el.offsetParent !== null);
  
  if (event.key === 'Tab') {
    const currentIndex = elements.indexOf(document.activeElement);
    if (event.shiftKey) {
      const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
      elements[prevIndex]?.focus();
      event.preventDefault();
    } else {
      const nextIndex = currentIndex >= elements.length - 1 ? 0 : currentIndex + 1;
      elements[nextIndex]?.focus();
      event.preventDefault();
    }
  }
}

// Initialize accessibility fixes from report
function initializeAccessibilityFixes(report) {
  if (typeof document === 'undefined') return;
  
  const container = document.body;
  
  // Fix dependency graph ARIA
  fixDependencyGraphAriaRole(container);
  fixDependencyGraphAria(container);
  
  // Fix button identifiers
  fixButtonIdentifiers(container);
  
  // Implement fixes from report
  if (report && implementAccessibilityFixesFromReport) {
    implementAccessibilityFixesFromReport(container, report);
  }
  
  // Add main landmark to index
  addMainLandmarkToIndex(container);
  
  // Ensure unique landmarks
  ensureUniqueLandmarks(container);
  
  // Add accessible names to SVGs
  addAccessibleNamesToSVGs(container);
}

// Export all functions
module.exports = {
  // Core accessibility functions
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  renderGraphIndex,
  
  // Validation functions
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateAccessibilityReport,
  checkAccessibility,
  checkAccessibilityForReport,
  
  // Utility functions
  focusTrap,
  trapFocus,
  createInPageButton,
  createWebResourceButton,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasIdOrigin,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  implementAccessibilityFixesFromReport,
  
  // New functions from both branches
  addAccessibleName,
  renderAdditionalContent,
  fixDependencyGraphAriaRole,
  initializeAccessibilityFixes,
  
  // Task scheduling
  addTask,
  generateTaskId,
  cancelTask,
  processTasks,
  
  // Element labeling and focus
  setElementLabel,
  setFocus,
  handleKeyboardNavigation,
  
  // Utilities from utilities module
  ...utilities
};