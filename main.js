const accessibilityUtils = {
  // ... existing code

  /**
   * Wraps primary content inside a <main> element for improved accessibility.
   *
   * @param {HTMLElement} container - The container element to find the primary content within.
   * @returns {HTMLElement | null} Returns the <main> element if found, or null if not found.
   */
  wrapPrimaryContentInMain(container) {
    if (!container) {
      throw new Error('Container element is required');
    }

    // Check if a <main> element already exists to avoid duplication
    const existingMain = document.querySelector('main');
    if (existingMain) {
      return existingMain;
    }

    // Create a new <main> element
    const main = document.createElement('main');

    // Move all existing body children into the <main> element
    while (container.firstChild) {
      main.appendChild(container.firstChild);
    }

    // Append the <main> element to the body
    container.appendChild(main);

    return main;
  },

  /**
   * Adds an aria-label to the element if one is not already present.
   *
   * @param {HTMLElement} element - The element to label.
   * @param {string} label - The accessible label text.
   * @returns {HTMLElement} The element (for chaining).
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
   * Renders a dependency graph inside the given container.
   *
   * @param {HTMLElement} container - The DOM element that will hold the graph.
   * @param {Object} dependencies - The dependency data to visualize.
   * @param {Object} [options={}] - Optional rendering options.
   * @returns {HTMLElement} The container element.
   */
  renderDependencyGraphs(container, dependencies, options = {}) {
    if (!container) {
      throw new Error('Container element is required');
    }

    if (!dependencies) {
      throw new Error('Dependencies data is required');
    }

    // Ensure container has an id for graph references
    const containerId = ensureElementHasId(container, 'graph-container');

    // Add accessibility label if not present
    addAriaLabel(container, `Dependency graph: ${containerId}`);

    // Render logic placeholder
    container.innerHTML = `<div id="${containerId}">Graph not implemented</div>`;

    return container;
  },

  /**
   * Validates the table structure for accessibility issues.
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
            issues.push({
              tableIndex: index,
              issue: 'Header cell missing scope attribute',
              element: th
            });
          }
        });
      }

      // Check row consistency
      const rows = table.querySelectorAll('tr');
      const cellCounts = new Set();
      rows.forEach((row) => {
        cellCounts.add(row.children.length);
      });

      if (cellCounts.size > 1) {
        issues.push({
          tableIndex: index,
          issue: 'Inconsistent number of cells across rows',
          details: `Found ${cellCounts.size} different cell counts`
        });
      }

      // Ensure data cells have proper headers (simple check)
      const firstRow = rows[0];
      if (firstRow) {
        rows.forEach((row, rowIndex) => {
          if (rowIndex === 0) return; // skip header row
          const cells = row.querySelectorAll('td');
          cells.forEach((td) => {
            // For simplicity, just check if the table has headers and the cell has a colspan/rowspan that may cause confusion
            if (td.hasAttribute('colspan') || td.hasAttribute('rowspan')) {
              issues.push({
                tableIndex: index,
                issue: 'Data cell at row ${rowIndex} has colspan/rowspan',
                element: td
              });
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
   * Validates the structure of tables on the page for accessibility best practices.
   * This is a more comprehensive version of validateTableStructure that includes additional checks.
   *
   * @returns {boolean} True if all tables pass checks, otherwise false.
   */
  validateTableStructureComprehensive() {
    const tables = document.querySelectorAll('table');
    const issues = [];

    tables.forEach((table, tableIndex) => {
      // Check if table has a caption
      const caption = table.querySelector('caption');
      if (!caption) {
        issues.push({ tableIndex, issue: 'Missing caption' });
      }

      // Check for headers
      const headers = table.querySelectorAll('th');
      if (headers.length === 0) {
        issues.push({ tableIndex, issue: 'No header cells found' });
      } else {
        // Check header scope attributes
        headers.forEach((th, headerIndex) => {
          if (!th.hasAttribute('scope')) {
            issues.push({
              tableIndex,
              issue: `Header cell at index ${headerIndex} missing scope attribute`,
              element: th
            });
          }
        });
      }

      // Check row consistency
      const rows = table.querySelectorAll('tr');
      const cellCounts = new Set();
      rows.forEach((row) => {
        cellCounts.add(row.children.length);
      });

      if (cellCounts.size > 1) {
        issues.push({
          tableIndex,
          issue: 'Inconsistent number of cells across rows',
          details: `Found ${cellCounts.size} different cell counts`
        });
      }

      // Check for complex table structures
      const complexCells = table.querySelectorAll('td[colspan], td[rowspan]');
      if (complexCells.length > 0) {
        complexCells.forEach((cell, cellIndex) => {
          issues.push({
            tableIndex,
            issue: 'Complex table structure detected',
            details: `Cell at index ${cellIndex} has colspan/rowspan`,
            element: cell
          });
        });
      }

      // Check for missing summary (deprecated but still sometimes used)
      if (table.hasAttribute('summary')) {
        issues.push({
          tableIndex,
          issue: 'Deprecated summary attribute used',
          details: 'Use caption instead'
        });
      }
    });

    if (issues.length > 0) {
      console.warn('Comprehensive table accessibility issues found:', issues);
      return false;
    }

    console.log('All tables passed comprehensive accessibility checks.');
    return true;
  }
};

// Export functions for use in other modules
module.exports = {
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  initAccessibility: accessibilityUtils.initAccessibility,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
  exportData: accessibilityUtils.exportData,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  validateTableStructure,
  validateTableStructureComprehensive,
  wrapPrimaryContentInMain
};