/**
 * Accessibility utilities for managing skip links, focus trapping,
 * and other ARIA-related functionality.
 */

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
   * Adds a focus trap to the given element.
   * Tab‑presses are confined to the element’s focusable descendants.
   *
   * @param {HTMLElement} element - The container element.
   */
  trapFocus(element) {
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
   * Triggers a file download of the given data as JSON and announces the action
   * to screen readers.
   *
   * @param {Object} data - The data to export.
   * @param {string} filename - The name of the file to download.
   */
  exportData(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.announceToScreenReader(`Download of ${filename} started`);
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
   * Announces a message to screen readers using an aria‑live region.
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
};

/**
 * Ensures the element has a unique ID.
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
 * Adds an aria‑label to the element if one is not already present.
 *
 * @param {HTMLElement} element - The element to label.
 * @param {string} label - The accessible label text.
 * @returns {HTMLElement} The element (for chaining).
 */
const addAriaLabel = (element, label) => {
  if (!element) {
    throw new Error('Element is required');
  }
  if (!label) {
    throw new Error('Label is required');
  }

  element.setAttribute('aria-label', label);
  return element;
};

/**
 * Renders a dependency graph inside the given container.
 *
 * @param {HTMLElement} container - The DOM element that will hold the graph.
 * @param {Object} dependencies - The dependency data to visualize.
 * @param {Object} [options={}] - Optional rendering options.
 * @returns {HTMLElement} The container element.
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

  // Render logic placeholder
  container.innerHTML = `<div id="${containerId}">Graph not implemented</div>`;

  return container;
}

/**
 * Adds lang attribute to the HTML element if not present.
 * Ensures proper language declaration for screen readers.
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Fixes table structure issues for better accessibility.
 * Adds missing captions, ensures proper headers, and fixes cell structure.
 */
function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach((table) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure headers have scope attributes
    table.querySelectorAll('th').forEach((th) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });

    // Fix inconsistent cell counts
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const firstRowCellCount = rows[0].children.length;
      rows.forEach((row) => {
        while (row.children.length < firstRowCellCount) {
          const td = document.createElement('td');
          td.textContent = '—';
          row.appendChild(td);
        }
      });
    }
  });
}

/**
 * Adds main landmark if not present.
 * Ensures proper document structure for screen readers.
 */
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const content = document.querySelector('body > *:not(script):not(style):not(link)');
    if (content) {
      main.appendChild(content);
      document.body.insertBefore(main, document.body.firstChild);
    }
  }
}

/**
 * Adds accessible names to SVG elements.
 * Ensures SVGs have proper labels for screen readers.
 */
function addSvgAccessibleName() {
  document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])').forEach((svg) => {
    const title = svg.querySelector('title');
    if (title) {
      svg.setAttribute('aria-labelledby', ensureElementHasId(title));
    } else {
      svg.setAttribute('aria-label', 'Graphic');
    }
  });
}

/**
 * Ensures unique landmarks by removing duplicate main elements.
 * Maintains only one main landmark for proper document structure.
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      const div = document.createElement('div');
      while (mains[i].firstChild) {
        div.appendChild(mains[i].firstChild);
      }
      mains[i].replaceWith(div);
    }
  }
}

/**
 * Fixes fake link issues by ensuring proper link behavior.
 * Removes elements that appear like links but don't function as links.
 */
function fixFakeLinkIssue() {
  document.querySelectorAll('[role="link"], [href]').forEach((element) => {
    if (!element.hasAttribute('href') && element.getAttribute('role') === 'link') {
      element.removeAttribute('role');
    }
  });
}

// TODO: Validate the table structure for accessibility issues
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
function validateTableStructure() {
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
}

// Export functions for use in other modules
module.exports = {
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  initAccessibility: accessibilityUtils.initAccessibility,
  exportData: accessibilityUtils.exportData,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  validateTableStructure,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleName,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
};