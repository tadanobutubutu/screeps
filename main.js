const accessibilityUtils = {
  initSkipLink: function () {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  trapFocus: function (element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
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
    if (focusableElements.length > 0) {
      firstElement.focus();
    }
  },

  announceToScreenReader: function (message, priority) {
    if (priority === undefined) {
      priority = 'polite';
    }
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(function () {
      announcer.remove();
    }, 1000);
  },

  handleKeyboardNav: function (e, handlers) {
    const key = e.key;
    handlers[key] && handlers[key](e);
  },

  newFocusTrap: originNewFocusTrap,

  renderDependencyGraphs: function (container, dependencies, options) {
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
  },

  validateTableStructure: function () {
    const tables = document.querySelectorAll('table');
    const issues = [];

    tables.forEach((table) => {
      // Check if table has a caption
      const caption = table.querySelector('caption');
      if (!caption) {
        issues.push({ issue: 'Missing caption' });
      }

      // Check for header scope
      const headers = table.querySelectorAll('th');
      if (headers.length === 0) {
        issues.push({ issue: 'No header cells found' });
      } else {
        headers.forEach((th) => {
          if (!th.hasAttribute('scope')) {
            issues.push({
              issue: 'Header cell missing scope attribute',
              element: th
            });
          }
        });
      }

      // Check for consistent cell counts across rows
      const rows = table.querySelectorAll('tr');
      const cellCounts = new Set();
      rows.forEach((row) => {
        cellCounts.add(row.children.length);
      });
      if (cellCounts.size > 1) {
        issues.push({ issue: 'Inconsistent number of cells across rows' });
      }
    });

    if (issues.length > 0) {
      console.warn('Table accessibility issues found:', issues);
      return false;
    }

    console.log('All tables passed accessibility checks.');
    return true;
  },

  validateTableStructureComprehensive: function () {
    const tables = document.querySelectorAll('table');
    const issues = [];

    tables.forEach((table) => {
      // Check if table has a caption
      const caption = table.querySelector('caption');
      if (!caption) {
        issues.push({ issue: 'Missing caption' });
      }

      // Check for headers
      const headers = table.querySelectorAll('th');
      if (headers.length === 0) {
        issues.push({ issue: 'No header cells found' });
      } else {
        // Check header scope attributes
        headers.forEach((th, headerIndex) => {
          if (!th.hasAttribute('scope')) {
            issues.push({
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
          issue: 'Inconsistent number of cells across rows',
          details: `Found ${cellCounts.size} different cell counts`
        });
      }

      // Check for complex table structures
      const complexCells = table.querySelectorAll('td[colspan], td[rowspan]');
      if (complexCells.length > 0) {
        complexCells.forEach((cell, cellIndex) => {
          issues.push({
            issue: 'Complex table structure detected',
            details: `Cell at index ${cellIndex} has colspan/rowspan`,
            element: cell
          });
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