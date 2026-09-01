const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap } = main;

// Accessibility utilities and functions
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(skipLink.getAttribute('href').slice(1));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // New focus trap function
  newFocusTrap: (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
  },
};

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

function getTables() {
  return appData.tables;
}

function getConfig() {
  return { ...appData.config };
}

function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

// Required changes to fix the React SVG Accessible Name issue
function addSvgAccessibleName(svgString, label) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', label || 'Descriptive label for SVG');
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
}

// Example usage of the function
const originalSvgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" dy=".35em" x="50%" text-anchor="middle" class="sim-title" font-size="17">Screeps Dashboard</text></svg>';
const modifiedSvgString = addSvgAccessibleName(originalSvgString, 'Screeps Dashboard');

/**
 * Function to handle additional rendering logic using new functions for rendering graph/index
 * @param {HTMLElement|string} container - Container element or selector
 * @param {Object} options - Options for rendering
 * @param {string} options.title - Title for the graph/index view
 * @param {string} options.graphType - Type of graph to render
 * @param {boolean} options.showLegend - Whether to show legend
 * @returns {string} Rendered HTML content
 */
function renderGraphIndex(container, options = {}) {
  const defaultOptions = {
    title: 'Dependency Graph',
    graphType: 'dependency',
    showLegend: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Use renderDependencyGraphs function from utilities
  const graphHtml = renderDependencyGraphs(container, {
    ...mergedOptions,
    onRender: (graphData) => {
      // Apply accessibility fixes to the rendered graph
      if (addressAccessibilityIssues) {
        addressAccessibilityIssues(graphData);
      }
    }
  });
  
  // Apply additional accessibility improvements using new functions
  const fixedHtml = fixDependencyGraphAria(graphHtml);
  
  // Ensure all elements have proper IDs for accessibility
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = fixedHtml;
  const elements = tempContainer.querySelectorAll('button, a, [role="button"]');
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `graph-element-${index}`;
    }
  });
  
  return tempContainer.innerHTML;
}

/**
 * New function to handle additional rendering logic
 * @param {Object} additionalData - Additional data for rendering
 * @returns {string} Rendered additional content HTML
 */
function renderAdditionalContent(additionalData) {
  // Implementation of the new function
  // Placeholder for actual implementation
  return '<div class="additional-content"></div>';
}

// Preserve all existing exports
module.exports = {
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  newFocusTrap,
  renderGraphIndex,
  renderDependencyGraphs,
  renderAdditionalContent,
  addAccessibleName: addSvgAccessibleName,
  addAriaLabel,
  focusTrap,
  // Preserve any other existing exports here
};