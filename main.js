// main.js - Accessibility improvements implementation
// Merged from HEAD and origin/main

// ============================================
// Utility Functions
// ============================================

/**
 * Ensures an element has a unique ID.
 * If the element already has an id, it is returned; otherwise a new id is generated.
 *
 * @param {HTMLElement} element - The element to identify.
 * @param {string} [prefix='element'] - Prefix for the generated ID.
 * @returns {string} The element's id.
 */
const ensureElementHasId = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
};

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

// ============================================
// Accessibility Utilities
// ============================================

const accessibilityUtils = {
  /**
   * Initializes the skip link functionality.
   * Finds a skip link with class 'skip-link' and ensures clicking it
   * focuses the target element while preventing default navigation.
   */
  initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    skipLink.addEventListener('click', (e) => {
      const href = skipLink.getAttribute('href');
      if (!href) return;
      const targetId = href.replace('#', '');
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        e.preventDefault();
      }
    });
  },

  /**
   * Traps focus within the given element.
   * Tab‑presses are confined to the element's focusable descendants.
   *
   * @param {HTMLElement} element - The container element.
   */
  trapFocus(element) {
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
   * A newer focus trap implementation.
   * Identical to `trapFocus` for consistency.
   *
   * @param {HTMLElement} element - The container element.
   */
  newFocusTrap(element) {
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
   * Enhances keyboard accessibility for interactive elements and elements with
   * the `data-accessible` attribute. Adds a `tabindex="0"` and handles Enter/Space
   * to trigger clicks.
   */
  initAccessibility() {
    // Add keyboard support for all interactive elements and data-accessible elements
    document.querySelectorAll('button, a, [role="button"], [data-accessible]').forEach((element) => {
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
   * Triggers a file download of the given data as JSON and announces the action
   * to screen readers.
   *
   * @param {Object} data - The data to export.
   * @param {string} filename - The name of the file to download.
   */
  exportData(data, filename = 'export.json') {
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
  },

  /**
   * Scans the page for common accessibility issues and logs warnings.
   * Returns an object summarizing the fixes performed.
   */
  addressAccessibilityIssues() {
    const fixes = {
      skipLinks: 0,
      tables: 0,
      images: 0,
    };
    
    // Validate skip links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const target = link.getAttribute('href').substring(1);
      const element = document.getElementById(target);
      if (!element) {
        console.warn(`Skip link points to non-existent element: ${target}`);
        fixes.skipLinks++;
      }
    });
    
    // Validate tables
    document.querySelectorAll('table').forEach((table) => {
      if (!table.querySelector('th')) {
        console.warn('Table missing header cells (th)');
        fixes.tables++;
      }
      // Ensure each row has same number of cells
      const rows = table.querySelectorAll('tr');
      const cellCounts = new Set();
      rows.forEach((row) => {
        cellCounts.add(row.children.length);
      });
      if (cellCounts.size > 1) {
        console.warn('Inconsistent number of cells across table rows');
        fixes.tables++;
      }
    });
    
    // Validate images
    document.querySelectorAll('img:not([alt])').forEach((img) => {
      console.warn('Image missing alt attribute', img);
      fixes.images++;
    });
    
    console.log('Accessibility issues addressed', fixes);
  },

  /**
   * Announces a message to screen readers using an aria-live region.
   *
   * @param {string} message - The message to announce.
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Validates the structure of tables on the page for accessibility best practices.
   * Checks for:
   *   - Presence of captions.
   *   - Proper use of `<th>` elements with `scope` attributes.
   *   - Consistent cell counts across rows.
   *   - Absence of problematic colspan/rowspan in data cells (basic check).
   *
   * @returns {boolean} True if all tables pass checks, otherwise false.
   */
  validateTableStructure() {
    const tables = document.querySelectorAll('table');
    const issues = [];
    
    tables.forEach((table, index) => {
      // Check if table has a caption
      const caption = table.querySelector('caption');
      if (!caption) {
        issues.push({ tableIndex: index, issue: 'Missing caption' });
      }
      
      // Check for header scope
      const headers = table.querySelectorAll('th');
      if (headers.length === 0) {
        issues.push({ tableIndex: index, issue: 'No header cells found' });
      } else {
        headers.forEach((th) => {
          if (!th.hasAttribute('scope')) {
            issues.push({ tableIndex: index, issue: 'Header cell missing scope attribute', element: th });
          }
        });
      }
      
      // Check for consistent row cell counts
      const rows = table.querySelectorAll('tr');
      const cellCounts = new Set();
      rows.forEach((row) => {
        cellCounts.add(row.children.length);
      });
      if (cellCounts.size > 1) {
        issues.push({ tableIndex: index, issue: 'Inconsistent number of cells across rows' });
      }
      
      // Ensure data cells have proper headers (simple check)
      const firstRow = rows[0];
      if (firstRow) {
        const headerCellsCount = table.querySelectorAll('th').length;
        rows.forEach((row, rowIndex) => {
          if (rowIndex === 0) return; // skip header row
          const cells = row.querySelectorAll('td');
          cells.forEach((td) => {
            // For simplicity, just check if the table has headers and the cell has a colspan/rowspan that may cause confusion
            if (td.hasAttribute('colspan') || td.hasAttribute('rowspan')) {
              issues.push({ tableIndex: index, issue: `Data cell at row ${rowIndex} has colspan/rowspan`, element: td });
            }
          });
        });
      }
    });
    
    if (issues.length > 0) {
      console.warn('Table accessibility issues found:', issues);
      return false;
    }
    
    console.log('All tables passed accessibility checks.');
    return true;
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
  addAriaLabel,
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  initAccessibility: accessibilityUtils.initAccessibility,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  validateTableStructure: accessibilityUtils.validateTableStructure,
  initKeyboardNavigation: accessibilityUtils.initKeyboardNavigation,
  enhanceFormAccessibility: accessibilityUtils.enhanceFormAccessibility
};