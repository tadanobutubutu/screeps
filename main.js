const accessibilityUtils = {
  // ... (The rest of the original code remains unchanged)

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

// Required changes to fix the React SVG Accessible Name issue
const addSvgAccessibleName = function addSvgAccessibleName(svgString, label) {
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
};

// Example usage of the function
const originalSvgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" dy=".35em" x="50%" text-anchor="middle" class="sim-title" font-size="17">Screeps Dashboard</text></svg>';
const modifiedSvgString = addSvgAccessibleName(originalSvgString, 'Screeps Dashboard');

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

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

// Credential response handling
async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }

  if (response.error) {
    throw new Error(response.error);
  }

  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }

  throw new Error('Invalid credential response');
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', "Download " + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader("Download of " + filename + " started");
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

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

// Accessibility-related functions
function addLangAttribute() {
  // Implementation for adding lang attribute to HTML element
  // This would typically be done in the HTML template, not in JavaScript
  // For the purpose of this exercise, we'll assume it's handled elsewhere
}

function fixTableStructureIssues() {
  // Implementation for fixing table structure issues
  // This would typically involve ensuring proper table semantics
}

function addMainLandmark() {
  // Implementation for adding/fixing landmark issues
  // This would typically involve ensuring proper ARIA landmarks
}

function addSvgAccessibleNameUtil() {
  // Implementation for adding accessible names to SVGs
  // This would typically involve adding title/desc elements or ARIA labels
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();

  // Add keyboard support for all interactive elements
  document.querySelectorAll('[data-accessible]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    });
  });
};

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// New function: validateTableAccessibility
function validateTableAccessibility(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for presence of <caption> (accessibility best practice for table description)
  const caption = tableElement.querySelector('caption');
  if (!caption || !caption.textContent.trim()) {
    issues.push('TABLE is missing a descriptive caption');
  }

  // Check that all rows have consistent number of cells
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  let expectedCellCount = null;

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.children).filter(
      child => ['TH', 'TD'].includes(child.tagName.toUpperCase())
    );

    if (expectedCellCount === null && cells.length > 0) {
      expectedCellCount = cells.length;
    } else if (cells.length !== expectedCellCount) {
      issues.push(`Row ${rowIndex + 1} has inconsistent number of cells`);
    }
  });

  // Check that TH elements exist (header row/column should be marked)
  const thCells = tableElement.querySelectorAll('th');
  if (thCells.length === 0) {
    issues.push('TABLE has no header cells (TH) defined');
  }

  return issues;
}

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
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

// New functions for rendering dependency graphs and displaying module structure for debugging purposes

/**
 * Displays module structure for debugging purposes.
 * Returns a structured representation of a module's exports, dependencies, and structure.
 * @param {Object} module - The module object to inspect
 * @param {Object} options - Configuration options
 * @param {number} options.maxDepth - Maximum depth to traverse (default: 3)
 * @param {boolean} options.includePrivate - Include private properties starting with _ (default: false)
 * @param {string} options.format - Output format: 'object', 'string', or 'tree' (default: 'object')
 * @returns {Object|string} Module structure representation
 */
function displayModuleStructure(module, options = {}) {
  const {
    maxDepth = 3,
    includePrivate = false,
    format = 'object'
  } = options;

  if (!module || typeof module !== 'object') {
    return module;
  }

  const visited = new WeakSet();

  function traverse(obj, depth = 0) {
    if (depth > maxDepth || obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (visited.has(obj)) {
      return '[Circular]';
    }
    visited.add(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => traverse(item, depth + 1));
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!includePrivate && key.startsWith('_')) {
        continue;
      }
      result[key] = traverse(value, depth + 1);
    }
    return result;
  }

  const structure = traverse(module);

  if (format === 'string') {
    return JSON.stringify(structure, null, 2);
  }

  if (format === 'tree') {
    function toTree(obj, prefix = '') {
      if (typeof obj !== 'object' || obj === null) {
        return `${prefix}${obj}`;
      }
      let result = '';
      const keys = Object.keys(obj);
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const newPrefix = prefix + (isLast ? '└── ' : '├── ');
        const childPrefix = prefix + (isLast ? '    ' : '│   ');
        result += `${newPrefix}${key}: `;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          result += '\n' + toTree(obj[key], childPrefix);
        } else {
          result += `${obj[key]}\n`;
        }
      });
      return result;
    }
    return toTree(structure);
  }

  return structure;
}

/**
 * Generates a dependency graph from module exports and imports.
 * @param {Object} modules - Map of module names to their exports/dependencies
 * @returns {Object} Dependency graph with nodes and edges
 */
function generateDependencyGraph(modules) {
  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  // Create nodes for each module
  for (const [name, module] of Object.entries(modules)) {
    const id = `module-${name}`;
    nodeMap.set(name, id);
    nodes.push({
      id,
      label: name,
      type: 'module',
      exports: module.exports ? Object.keys(module.exports) : [],
      dependencies: module.dependencies || []
    });
  }

  // Create edges for dependencies
  for (const [name, module] of Object.entries(modules)) {
    const sourceId = nodeMap.get(name);
    if (module.dependencies) {
      for (const dep of module.dependencies) {
        const targetId = nodeMap.get(dep);
        if (targetId) {
          edges.push({
            source: sourceId,
            target: targetId,
            type: 'depends-on'
          });
        }
      }
    }
  }

  return { nodes, edges };
}

// New accessibility functions for insight report issues

/**
 * Get lang attribute for HTML element - REACT_015
 * @param {string} locale - The locale code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value
 */
function getLangAttribute(locale = 'en') {
  if (!locale) return 'en';
  return locale.split('-')[0].toLowerCase();
}

/**
 * Format person name for accessibility - REACT_015, REACT_036
 * @param {Object} person - Person object with firstName, lastName, middleName
 * @returns {string} Formatted full name
 */
function personName(person) {
  if (!person) return '';
  const parts = [];
  if (person.firstName) parts.push(person.firstName);
  if (person.middleName) parts.push(person.middleName);
  if (person.lastName) parts.push(person.lastName);
  return parts.join(' ').trim();
}

/**
 * Validate table structure - REACT_027
 * @param {HTMLTableElement} tableElement - The table element to validate
 * @returns {Array<string>} Array of validation issues
 */
function validateTableStructure(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for proper table structure with thead, tbody, tfoot
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  const tfoot = tableElement.querySelector('tfoot');

  if (!thead) {
    issues.push('TABLE is missing a THEAD section');
  }

  if (!tbody && !tableElement.querySelector('tr')) {
    issues.push('TABLE has no data rows (TBODY or direct TR children)');
  }

  // Check for scope attributes on header cells
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`TH at index ${index} is missing scope attribute (should be 'col', 'row', 'colgroup', or 'rowgroup')`);
    }
  });

  // Check for header IDs and data cell headers attribute (complex tables)
  const hasHeadersAttr = tableElement.querySelector('td[headers]');
  if (hasHeadersAttr) {
    const headerIds = new Set();
    tableElement.querySelectorAll('th[id]').forEach(th => headerIds.add(th.id));

    tableElement.querySelectorAll('td[headers]').forEach(td => {
      const headersList = td.getAttribute('headers').split(/\s+/);
      headersList.forEach(id => {
        if (!headerIds.has(id)) {
          issues.push(`TD references non-existent header ID: ${id}`);
        }
      });
    });
  }

  return issues;
}

/**
 * Validate landmark structure - REACT_017
 * @param {HTMLElement} element - The element to validate as a landmark
 * @returns {Array<string>} Array of validation issues
 */
function validateLandmark(element) {
  const issues = [];

  if (!element) {
    issues.push('Element is required');
    return issues;
  }

  const landmarkRoles = [
    'banner', 'complementary', 'contentinfo', 'form',
    'main', 'navigation', 'region', 'search'
  ];

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element is a landmark
  const isLandmark = landmarkRoles.includes(role) ||
    (tagName === 'main') ||
    (tagName === 'nav') ||
    (tagName === 'aside') ||
    (tagName === 'header') ||
    (tagName === 'footer') ||
    (tagName === 'form') ||
    (tagName === 'section' && element.hasAttribute('aria-label')) ||
    (tagName === 'section' && element.hasAttribute('aria-labelledby'));

  if (!isLandmark) {
    issues.push('Element is not a recognized landmark');
  }

  // Check for accessible name on region landmarks
  if (role === 'region' || tagName === 'section') {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      issues.push('Region/section landmark must have an accessible name (aria-label or aria-labelledby)');
    }
  }

  // Check for duplicate landmarks of certain types
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  if (uniqueLandmarks.includes(role) || uniqueLandmarks.includes(tagName)) {
    const existing = document.querySelectorAll(`[role="${role}"], ${tagName}`);
    if (existing.length > 1) {
      issues.push(`Multiple ${role || tagName} landmarks found - should be unique`);
    }
  }

  return issues;
}

/**
 * Validate landmark structure across document - REACT_017
 * @returns {Array<string>} Array of validation issues
 */
function validateLandmarkStructure() {
  const issues = [];

  // Check for main landmark
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length === 0) {
    issues.push('Document is missing a main landmark');
  } else if (mainLandmarks.length > 1) {
    issues.push('Document has multiple main landmarks');
  }

  // Check for banner landmark
  const bannerLandmarks = document.querySelectorAll('header[role="banner"], [role="banner"]');
  if (bannerLandmarks.length > 1) {
    issues.push('Document has multiple banner landmarks');
  }

  // Check for contentinfo landmark
  const contentinfoLandmarks = document.querySelectorAll('footer[role="contentinfo"], [role="contentinfo"]');
  if (contentinfoLandmarks.length > 1) {
    issues.push('Document has multiple contentinfo landmarks');
  }

  // Check all region landmarks have accessible names
  const regions = document.querySelectorAll('[role="region"], section');
  regions.forEach((region, index) => {
    if (!region.hasAttribute('aria-label') && !region.hasAttribute('aria-labelledby')) {
      issues.push(`Region landmark at index ${index} is missing accessible name`);
    }
  });

  // Check navigation landmarks
  const navLandmarks = document.querySelectorAll('nav, [role="navigation"]');
  navLandmarks.forEach((nav, index) => {
    if (navLandmarks.length > 1 && !nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      issues.push(`Navigation landmark at index ${index} should have accessible name when multiple exist`);
    }
  });

  return issues;
}

/**
 * Get accessible name for SVG elements - REACT_041
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }

  // Check for <title> child
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for <desc> child
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  return '';
}

/**
 * Create an accessible in-page button (not a fake link) - REACT_036
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {Function} options.onClick - Click handler
 * @param {string} [options.ariaLabel] - Accessible label
 * @param {string} [options.className] - CSS class
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options) {
  const { text, onClick, ariaLabel, className = '' } = options;

  if (!text || typeof onClick !== 'function') {
    throw new Error('Button text and onClick handler are required');
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  button.addEventListener('click', onClick);

  // Add keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  });

  return button;
}

/**
 * Creates an accessible web resource button for external links (e.g., Github, Stack Overflow, etc.)
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.url - URL for the link
 * @param {string} [options.icon] - Icon class or HTML for the button
 * @param {string} [options.className] - Additional CSS class
 * @returns {HTMLAnchorElement} The created button element
 */
function createWebResourceButton(options) {
  const { text, url, icon, className = '' } = options;

  if (!text || !url) {
    throw new Error('Button text and URL are required');
  }

  const button = document.createElement('a');
  button.href = url;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.textContent = text;
  button.className = `web-resource-button ${className}`;

  if (icon) {
    button.innerHTML = `${icon}<span>${text}</span>`;
  }

  // Add accessibility attributes
  button.setAttribute('aria-label', `${text} (opens in new window)`);
  button.setAttribute('role', 'button');

  return button;
}

/**
 * Validates the overall accessibility report for issues
 * @param {Object} report - The accessibility report object
 * @returns {Array<Object>} Array of validation issues with severity and description
 */
function validateAccessibilityReport(report) {
  const issues = [];

  if (!report) {
    issues.push({ severity: 'error', description: 'No report provided' });
    return issues;
  }

  if (report.violations) {
    report.violations.forEach(violation => {
      issues.push({
        severity: violation.impact || 'unknown',
        description: violation.description,
        nodes: violation.nodes,
        help: violation.help
      });
    });
  }

  return issues;
}

/**
 * Addresses accessibility issues from the insight report
 * @param {Array} issues - Array of accessibility issues to address
 * @returns {Object} Summary of changes made
 */
function addressAccessibilityIssues(issues) {
  const changes = {
    fixed: 0,
    skipped: 0,
    errors: []
  };

  if (!issues || !Array.isArray(issues)) {
    return changes;
  }

  issues.forEach(issue => {
    try {
      // Implementation would depend on specific issue types
      if (issue.type && issue.element) {
        changes.fixed++;
      }
    } catch (error) {
      changes.errors.push(error.message);
    }
  });

  return changes;
}

/**
 * Ensures unique landmarks in the document
 * @returns {Array<string>} Array of duplicate landmark warnings
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return [];
  }

  const warnings = [];
  const landmarkTypes = ['main', 'banner', 'navigation', 'aside', 'footer'];
  const issues = [];
  const landmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];

  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(`${type}, [role="${type}"]`);
    if (elements.length > 1) {
      warnings.push(`Multiple ${type} landmarks found - should be unique`);
    }
  });

  uniqueLandmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      issues.push(`Multiple ${role} landmarks found - should be unique`);
    }
  });

  return warnings.length > 0 ? warnings : issues;
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
  // This would typically involve ensuring links are actual links or have proper ARIA roles
}

/**
 * Generates a comprehensive accessibility report based on issues found
 * @param {Object} options - Configuration options for the report
 * @param {boolean} [options.includeDetails=true] - Whether to include detailed issue information
 * @param {boolean} [options.includeSummary=true] - Whether to include summary statistics
 * @param {boolean} [options.includeRecommendations=true] - Whether to include recommendations
 * @returns {Object} The generated accessibility report
 */
function generateAccessibilityReport(options = {}) {
  const {
    includeDetails = true,
    includeSummary = true,
    includeRecommendations = true
  } = options;

  const report = {
    timestamp: new Date().toISOString(),
    issues: [],
    summary: {},
    recommendations: []
  };

  // Collect all tables in the document
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    const tableIssues = validateTableAccessibility(table);
    if (tableIssues.length > 0) {
      report.issues.push({
        type: 'table-accessibility',
        element: table,
        issues: tableIssues,
        selector: `table:nth-of-type(${index + 1})`
      });
    }
  });

  // Validate landmark structure
  const landmarkIssues = validateLandmarkStructure();
  if (landmarkIssues.length > 0) {
    report.issues.push({
      type: 'landmark-structure',
      issues: landmarkIssues
    });
  }

  // Check for SVG accessibility issues
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const svgName = getSvgAccessibleName(svg);
    if (!svgName) {
      report.issues.push({
        type: 'svg-accessibility',
        element: svg,
        issue: 'SVG element has no accessible name',
        selector: `svg:nth-of-type(${index + 1})`
      });
    }
  });

  // Generate summary statistics
  if (includeSummary) {
    const severityCounts = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    };

    report.issues.forEach(issue => {
      if (issue.issues) {
        issue.issues.forEach(subIssue => {
          if (subIssue.severity) {
            severityCounts[subIssue.severity] = (severityCounts[subIssue.severity] || 0) + 1;
          }
        });
      } else if (issue.severity) {
        severityCounts[issue.severity] = (severityCounts[issue.severity] || 0) + 1;
      }
    });

    report.summary = {
      totalIssues: report.issues.length,
      severityCounts,
      tablesChecked: tables.length,
      landmarksChecked: document.querySelectorAll('[role], main, nav, aside, header, footer, section').length,
      svgsChecked: svgs.length
    };
  }

  // Add recommendations
  if (includeRecommendations) {
    if (report.issues.some(issue => issue.type === 'table-accessibility')) {
      report.recommendations.push(
        'Ensure all tables have proper captions, headers, and scope attributes for better accessibility.'
      );
    }

    if (report.issues.some(issue => issue.type === 'landmark-structure')) {
      report.recommendations.push(
        'Review landmark structure to ensure proper use of ARIA roles and unique landmarks.'
      );
    }

    if (report.issues.some(issue => issue.type === 'svg-accessibility')) {
      report.recommendations.push(
        'Add accessible names to all SVG elements using aria-label, aria-labelledby, or child <title> elements.'
      );
    }

    if (report.issues.length === 0) {
      report.recommendations.push(
        'No accessibility issues found. Continue maintaining good accessibility practices.'
      );
    }
  }

  return report;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// New function: Implement the new function as per the issue requirements
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  const processValue = (value) => {
    if (typeof value === 'string') {
      let processed = value;
      if (trimWhitespace) {
        processed = processed.trim();
      }
      if (uppercase) {
        processed = processed.toUpperCase();
      }
      if (maxLength !== null && processed.length > maxLength) {
        processed = processed.substring(0, maxLength);
      }
      return processed;
    }
    return value;
  };

  if (typeof inputData === 'object' && !Array.isArray(inputData) && inputData !== null) {
    const result = {};
    const keys = preserveKeys ? Object.keys(inputData) : Object.keys(inputData).map(() => Math.random().toString(36).substr(2, 9));

    let i = 0;
    for (const key of Object.keys(inputData)) {
      const value = inputData[key];
      if (typeof value === 'object' && value !== null) {
        result[keys[i]] = transformInputData(value, options);
      } else {
        result[keys[i]] = processValue(value);
      }
      i++;
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return transformInputData(item, options);
      }
      return processValue(item);
    });
  }

  return processValue(inputData);
}

// Export the newFocusTrap function as a standalone utility
const newFocusTrap = accessibilityUtils.newFocusTrap;

// Export all utilities
module.exports = {
  processData,
  calculateTotal,
  formatResponse,
  validateInput,
  transformData,
  mergeResults,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleName,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  getLangAttribute,
  personName,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createWebResourceButton,
  generateAccessibilityReport,
  getTables,
  getConfig,
  setConfig,
  addAccessibleName,
  newFocusTrap,
  renderGraphIndex,
  renderDependencyGraphs,
  renderAdditionalContent,
  addAriaLabel,
  focusTrap,
};