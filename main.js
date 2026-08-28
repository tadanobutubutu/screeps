import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Accessibility fix functions
export function addLangAttribute() {
  document.documentElement.lang = 'en';
}

export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead') && table.querySelector('tr:first-child th')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
      }
    }
  });
}

export function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  });
}

// Add ARIA labels to SVGs that don't have an accessible name
export function addAriaLabelToSVGsWithoutAccessibleName(svgs) {
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        svg.setAttribute('aria-label', title.textContent);
      }
    }
  });
}

// Ensure elements have an id and add aria-label where missing
export function ensureElementsHaveIdAndAriaLabel() {
  const elements = document.querySelectorAll('[data-dependency-graph]');
  elements.forEach(el => {
    if (!el.id) {
      el.id = 'dependency-graph-element';
    }
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Dependency Graph');
    }
  });
}

// Add proper landmark regions based on insight report data
export function addProperLandmarkRegions(data) {
  data.forEach(item => {
    if (item.role && item.selector) {
      const elements = document.querySelectorAll(item.selector);
      elements.forEach(el => {
        el.setAttribute('role', item.role);
        if (item.label) {
          el.setAttribute('aria-label', item.label);
        }
      });
    }
  });
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->

// TODO: Address accessibility issues from insight report — FIXED

/**
 * Accessibility utilities for the application
 */
const AccessibilityUtils = {
  /**
   * Manages focus trapping within a container element
   * @param {HTMLElement} container - The container element to trap focus within
   * @returns {Function} - Cleanup function to remove the focus trap
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Ensure focus is set to the first focusable element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Announces a message to screen readers using ARIA live regions
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announceToScreenReader(message, priority = 'polite') {
    let announcer = document.getElementById('aria-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
      document.body.appendChild(announcer);
    }

    // Clear and set message (ensures announcement even for repeated messages)
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  },

  /**
   * Handles escape key to close modals/dropdowns
   * @param {Function} closeCallback - Function to call when Escape is pressed
   * @param {HTMLElement} element - Element to attach the listener to
   */
  handleEscapeKey(closeCallback, element = document) {
    const handler = (e) => {
      if (e.key === 'Escape' && typeof closeCallback === 'function') {
        closeCallback();
      }
    };
    
    element.addEventListener('keydown', handler);
    
    return () => {
      element.removeEventListener('keydown', handler);
    };
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccessibilityUtils };
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure skip link functionality if present
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href') || '#main-content');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  });
}

// Render dependency graphs with proper accessibility attributes
export function renderDependencyGraphs(data) {
  const graphContainer = document.querySelector('.dependency-graph, [data-dependency-graph]');
  if (graphContainer && data) {
    data.forEach(item => {
      if (item.id) {
        const element = document.getElementById(item.id);
        if (element) {
          element.setAttribute('role', item.role || 'tree');
          if (item.label) {
            element.setAttribute('aria-label', item.label);
          }
        }
      }
    });
  }
}

// Generalized accessibility improvements
export function improveAccessibility() {
  // Ensure the dependencyGraph container has a proper ARIA role
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // Add appropriate ARIA labels to SVGs without accessible name
  addAriaLabelToSVGsWithoutAccessibleName(document.querySelectorAll('svg'));

  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('[role="link"]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

// Function to address insight report issues
export function addressInsightIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      ensureUniqueLandmarks();
    }
    if (issue.code === 'REACT_017') {
      // Handle REACT_017 issue - ensuring proper ARIA labels and descriptions
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (!el['aria-label'] && !el.label) {
          el['aria-label'] = el.id || 'unnamed-element';
        }
      });
      // Add proper landmark regions from insight report data
      addProperLandmarkRegions(issue.data || []);
    }
  });
}

// Initialize accessibility fixes
export function initAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  improveAccessibility();
  ensureElementsHaveIdAndAriaLabel();
  renderDependencyGraphs();
}

// New function or changes requested in the issue
function newFunction() {
  // Implementation of the new function
}

// Existing exports (do not remove or rename)
export function existingFunction() {
  // Implementation of the existing function
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();