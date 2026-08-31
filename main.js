// main.js - Accessibility improvements implementation
// Merged from HEAD and origin/main

// ============================================
// Utility Functions
// ============================================

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 9);
  }
  return element;
};

/**
 * Ensures an element has an ID, generating one if necessary
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Prefix for generated ID (default: 'element')
 * @returns {string} The element's ID
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

/**
 * Ensures an element has an ID using the original utility approach
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's ID
 */
function ensureElementHasIdOrigin(element) {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 9);
  }
  return element;
}

/**
 * Adds an ARIA label to an element
 * @param {HTMLElement} element - The element to label
 * @param {string} label - The label text
 * @returns {HTMLElement} The labeled element
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  if (!label) {
    throw new Error('Label is required');
  }
  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Traps focus within a container element for accessibility
 * @param {HTMLElement} element - Container element to trap focus within
 */
function focusTrap(element) {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Initializes the skip link functionality for keyboard navigation
 */
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link a[href^="#"]');
  if (skipLink) {
    const targetId = skipLink.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
      });
    }
  }
}

// ============================================
// Accessibility Utilities
// ============================================

const accessibilityUtils = {
  initSkipLink,

  /**
   * Adds keyboard support for all interactive elements
   */
  initKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach((element) => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Handle data-accessible elements
    const accessibleElements = document.querySelectorAll('[data-accessible]');
    accessibleElements.forEach((element) => {
      element.setAttribute('tabindex', '0');
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  },

  /**
   * Addresses common accessibility issues in the document
   */
  addressAccessibilityIssues() {
    const issues = [];

    // Check for images without alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        issues.push({ type: 'warning', message: `Image at index ${index} missing alt attribute` });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label) {
          issues.push({ type: 'error', message: `Input at index ${index} missing associated label` });
        }
      }
    });

    // Log accessibility issues
    issues.forEach((issue) => {
      if (issue.type === 'error') {
        console.error('[Accessibility]', issue.message);
      } else {
        console.warn('[Accessibility]', issue.message);
      }
    });

    return issues;
  },

  /**
   * Enhances form accessibility
   */
  enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach((input, index) => {
        if (!input.id) {
          input.id = `form-input-${Math.random().toString(36).substr(2, 9)}`;
        }
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.hasAttribute('aria-label')) {
          input.setAttribute('aria-label', `Form input ${index + 1}`);
        }
      });
    });
  }
};

// ============================================
// Data Export Functionality
// ============================================

/**
 * Exports data to a file with accessibility announcements
 * @param {Object} data - The data to export
 * @param {string} filename - The filename for the export
 */
function exportData(data, filename = 'export.json') {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Announce export completion for screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = `Export of ${filename} started`;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    document.body.removeChild(announcement);
  }, 100);
}

// ============================================
// Dependency Graph Rendering
// ============================================

/**
 * Renders dependency graphs in the specified container
 * @param {HTMLElement} container - Container element for the graph
 * @param {Array} dependencies - Array of dependency data
 * @param {Object} options - Rendering options
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container');

  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`);

  // Clear existing content
  container.innerHTML = '';

  // Create SVG for graph visualization
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', options.width || 600);
  svg.setAttribute('height', options.height || 400);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', `graph-title-${containerId}`);
  container.appendChild(svg);

  // Render graph nodes and edges
  const nodes = [];
  const edges = [];

  dependencies.forEach((dep, index) => {
    const nodeX = 50 + (index % 5) * 100;
    const nodeY = 50 + Math.floor(index / 5) * 80;

    nodes.push({
      id: dep.id || `node-${index}`,
      label: dep.name,
      x: nodeX,
      y: nodeY
    });
  });

  // Create edges based on dependencies
  dependencies.forEach((dep, index) => {
    if (dep.dependencies) {
      dep.dependencies.forEach((depId) => {
        const sourceNode = nodes.find(n => n.id === depId);
        const targetNode = nodes[index];
        if (sourceNode && targetNode) {
          edges.push({
            source: sourceNode,
            target: targetNode
          });
        }
      });
    }
  });

  // Render edges
  edges.forEach((edge) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', edge.source.x + 40);
    line.setAttribute('y1', edge.source.y + 20);
    line.setAttribute('x2', edge.target.x + 40);
    line.setAttribute('y2', edge.target.y + 20);
    line.setAttribute('stroke', '#666');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  });

  // Render nodes
  nodes.forEach((node) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${node.x}, ${node.y})`);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '80');
    rect.setAttribute('height', '40');
    rect.setAttribute('rx', '5');
    rect.setAttribute('fill', '#4a90e2');
    rect.setAttribute('stroke', '#333');
    rect.setAttribute('stroke-width', '2');
    group.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '40');
    text.setAttribute('y', '25');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '12');
    text.textContent = node.label;
    group.appendChild(text);

    svg.appendChild(group);
  });

  // Add title for accessibility
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.setAttribute('id', `graph-title-${containerId}`);
  title.textContent = options.title || 'Dependency Graph';
  svg.insertBefore(title, svg.firstChild);

  return { containerId, nodes, edges };
}

// ============================================
// Render Graph Index (merged from origin/main)
// ============================================

function renderGraphIndex(container, dependencies, options = {}) {
  return renderDependencyGraphs(container, dependencies, options);
}

// ============================================
// Initialize Application
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Application initialized');

  // Initialize accessibility features
  accessibilityUtils.initKeyboardNavigation();
  accessibilityUtils.enhanceFormAccessibility();

  const issues = accessibilityUtils.addressAccessibilityIssues();
  if (issues.length > 0) {
    console.log(`Found ${issues.length} accessibility issues`);
  }
});

// ============================================
// Module Exports
// ============================================

module.exports = {
  exportData,
  focusTrap,
  renderDependencyGraphs,
  renderGraphIndex,
  accessibilityUtils,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel
};