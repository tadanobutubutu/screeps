const main = {
  ...main,
  ...accessibilityUtils,
  ensureElementId: ensureElementIdUtil,
  ensureElementHasId: function(element) {
    if (!element) return;
    if (element.id) return element.id;
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return element.id;
  },
  newFocusTrap: newFocusTrap,
  log: function(message, level = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`);
  },
  sanitizeFilename: function(filename) {
    return filename.replace(/[^a-z0-9_.-]/gi, '_');
  },
  readFileSafe: function(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading file ${filePath}: ${error.message}`);
      return null;
    }
  },
  processData: function(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({ ...item, processed: true, timestamp: Date.now() }));
  },
  filterValidItems: function(items, validator) {
    return items.filter((item) => {
      try {
        return validator(item);
      } catch (e) {
        return false;
      }
    });
  },
  initAccessibility: function() {
    accessibilityUtils.initSkipLink();

    document.querySelectorAll('[data-accessible]').forEach((element) => {
      element.addEventListener('keydown', (e) => {
        if (['Enter', ' '].includes(e.key)) {
          e.preventDefault();
          element.click();
        }
      });
    });
  },
  groupByCategory: function(items, getCategory) {
    return items.reduce((groups, item) => {
      const category = getCategory(item);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  },
  transformInputData: transformInputData,
  validateTableAccessibility: validateTableAccessibility,
  ensureElementHasIdOrigin: function(element, origin = 'default') {
    if (!element) return;
    if (element.id) return element.id;
    element.id = `${origin}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return element.id;
  },
  displayModuleStructure: displayModuleStructure,
  generateDependencyGraph: generateDependencyGraph,
  // New accessibility functions
  getLangAttribute: getLangAttribute,
  personName: personName,
  validateTableStructure: validateTableStructure,
  validateLandmark: validateLandmark,
  validateLandmarkStructure: validateLandmarkStructure,
  getSvgAccessibleName: getSvgAccessibleName,
  createInPageButton: createInPageButton,
  createWebResourceButton: createWebResourceButton,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  newAccessibilityCheck,
  ensureUniqueLandmarks: function() {
    // Implement a function to check for unique landmarks
    // This function should return true if all landmarks have unique ids
    const landmarks = document.querySelectorAll('[role=banner], [role=navigation]');
    const ids = new Set();

    landmarks.forEach((landmark) => {
      const id = landmark.id;
      if (id) ids.add(id);
    });

    return ids.size === landmarks.length;
  }

  // Check for title element
  const titleElement = svg.querySelector('title');
  if (titleElement) {
    return titleElement.textContent.trim();
  }

  // Check for desc element (less common but sometimes used)
  const descElement = svg.querySelector('desc');
  if (descElement) {
    return descElement.textContent.trim();
  }

  return null;
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
 * Validates the table structure for accessibility issues.
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

/**
 * Adds ARIA attributes to form elements to improve accessibility.
 * Adds appropriate ARIA roles and labels where missing.
 *
 * @param {HTMLElement} form - The form element to enhance.
 */
function enhanceFormAccessibility(form) {
  if (!form) {
    throw new Error('Form element is required');
  }

  // Add ARIA roles to form elements
  form.querySelectorAll('input, textarea, select').forEach((element) => {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const label = form.querySelector(`label[for="${element.id}"]`);
      if (label) {
        element.setAttribute('aria-labelledby', label.id);
      } else if (element.placeholder) {
        element.setAttribute('aria-label', element.placeholder);
      }
    }

    // Add role="combobox" to select elements if they're enhanced with JavaScript
    if (element.tagName === 'SELECT' && !element.hasAttribute('role')) {
      element.setAttribute('role', 'combobox');
    }
  });

  // Add ARIA attributes to buttons
  form.querySelectorAll('button').forEach((button) => {
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      console.warn('Button without visible text or ARIA label found', button);
    }
  });
}

/**
 * Adds ARIA attributes to navigation elements to improve keyboard navigation.
 *
 * @param {HTMLElement} nav - The navigation element to enhance.
 */
function enhanceNavigationAccessibility(nav) {
  if (!nav) {
    throw new Error('Navigation element is required');
  }

  // Ensure nav has a role
  if (!nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  // Add ARIA labels to navigation items if missing
  nav.querySelectorAll('a').forEach((link) => {
    if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
      console.warn('Navigation link without text or ARIA label found', link);
    }
  });
}

// Export functions for use in other modules
module.exports = {
  ...main,
  ...accessibilityUtils
};

// Check SVG accessibility
const svgs = document.querySelectorAll('svg');
svgs.forEach((svg, index) => {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  if (title && desc) {
    // Ensure that both title and desc are present
  } else {
    // Log an error if either title or desc is missing
  }
});

// Fix button identifiers with updated function
function fixButtonIdentifiers(buttons) {
  if (!Array.isArray(buttons)) return [];
  return buttons.map((button) => {
    if (!(button instanceof HTMLElement)) return button;
    if (!button.id && button.textContent) {
      const id = `btn-${button.textContent.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      button.id = id;
    }
    return button;
  });
}

// Implement a function to address new accessibility issues
function handleNewAccessibilityIssues(issues) {
  // Implementation to address new accessibility issues in the report
  // This function should validate the report and fix issues as needed
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role=banner], [role=navigation]');
  const ids = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (id) ids.add(id);
  });

  return ids.size < 2;
}

// Accessibility toolbox utilities
const { validateTableStructure, addAriaLabel } = accessibilityUtils;

// Utilities to help address new accessibility issues
function fixLinkAccessibility(link) {
  if (!link || !link.textContent.trim()) return link;
  link.setAttribute('aria-label', `Link ${link.href}`);
  return link;
}

function createLandmark(options) {
  const defaultOptions = {
    role: 'banner',
    label: null,
    id: null,
    container: document.body
  };

  const optionsWithDefaults = { ...defaultOptions, ...options };
  const landmark = document.createElement('div');
  landmark.setAttribute('role', optionsWithDefaults.role);
  if (optionsWithDefaults.label) landmark.setAttribute('aria-label', optionsWithDefaults.label);
  if (optionsWithDefaults.id) landmark.id = ensureUniqueLandmarkId(optionsWithDefaults.id);
  if (optionsWithDefaults.container) optionsWithDefaults.container.appendChild(landmark);
  return landmark;
}

function addMainLandmark() {
  const main = createLandmark({ role: 'main' });
  fixButtonIdentifiers([main]);
  return main;
}

module.exports = {
  fixButtonIdentifiers,
  handleNewAccessibilityIssues,
  ensureUniqueLandmarks,
  fixLinkAccessibility,
  createLandmark,
  addMainLandmark,
  validateTableStructure,
  addAriaLabel
};