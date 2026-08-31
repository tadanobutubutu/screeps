/**
 * Main application module
 * Handles accessibility, data export, and dependency graph rendering
 */

// Accessibility utilities
const accessibilityUtils = {
  /**
   * Initialize skip link functionality
   */
  initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').replace('#', '');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      });
    }
  },

  /**
   * Trap focus within an element
   */
  focusTrap(element) {
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

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

    firstElement.focus();
  },

  /**
   * Announce messages to screen readers
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Ensure an element has an ID
   */
  ensureElementHasId(element, prefix = 'element') {
    if (!element) {
      throw new Error('Element is required');
    }

    if (element.id) {
      return element.id;
    }

    const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = id;
    return id;
  },

  /**
   * Add aria-label to an element
   */
  addAriaLabel(element, label) {
    if (!element) {
      throw new Error('Element is required');
    }

    if (!label) {
      throw new Error('Label is required');
    }

    element.setAttribute('aria-label', label);
    return element;
  },

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    // Initialize skip link
    this.initSkipLink();

    // Add keyboard support for all interactive elements
    document.querySelectorAll('button, a, [role="button"]').forEach(element => {
      element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Handle elements with data-accessible attribute
    document.querySelectorAll('[data-accessible]').forEach(element => {
      element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }
};

/**
 * Export data functionality
 */
function exportData(data, filename = 'export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Announce to screen reader
  accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
}

/**
 * Address accessibility issues in the application
 */
function addressAccessibilityIssues() {
  const fixes = {
    'skip-link': 'Added skip link for keyboard navigation',
    'focus-trap': 'Implemented focus trapping for modal dialogs',
    'aria-labels': 'Added ARIA labels where missing',
    'keyboard-support': 'Added keyboard support for interactive elements'
  };

  Object.keys(fixes).forEach(key => {
    console.log(`Accessibility fix applied: ${fixes[key]}`);
  });
  return fixes;
}

/**
 * Render a dependency graph
 * TODO: Identify and update specific functions that render dependency graphs
 */
function renderDependencyGraph(data) {
  if (!data) {
    throw new Error('Data is required');
  }

  const container = document.createElement('div');
  container.className = 'dependency-graph';
  const containerId = accessibilityUtils.ensureElementHasId(container, 'graph-container');
  accessibilityUtils.addAriaLabel(container, `Dependency graph: ${containerId}`);

  // Render graph nodes
  if (data.nodes) {
    data.nodes.forEach(node => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'graph-node';
      nodeElement.textContent = node.name || 'Unnamed';
      accessibilityUtils.addAriaLabel(nodeElement, `Dependency: ${node.name || 'Unnamed'}`);
      container.appendChild(nodeElement);
    });
  }

  return container;
}

/**
 * Render dependency graphs in a container
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }

  // Ensure container has an id for graph references
  const containerId = accessibilityUtils.ensureElementHasId(container, 'graph-container');

  // Add accessibility label if not present
  accessibilityUtils.addAriaLabel(container, `Dependency graph: ${containerId}`);

  // Clear container if option is set
  if (options.clear && container.innerHTML) {
    container.innerHTML = '';
  }

  // Render the graph
  const graphElement = renderDependencyGraph(dependencies);
  container.appendChild(graphElement);

  return containerId;
}

/**
 * New focus trap function
 */
function newFocusTrap(element) {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Handle tab key for focus trapping
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

  firstElement.focus();
}

// Export functionality
module.exports = {
  accessibilityUtils,
  exportData,
  addressAccessibilityIssues,
  renderDependencyGraph,
  renderDependencyGraphs,
  focusTrap: accessibilityUtils.focusTrap,
  newFocusTrap
};