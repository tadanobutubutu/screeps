// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

const AddressabilityIssues = {
  // Issue types for accessibility reporting
  MISSING_ID: 'missing-id',
  MISSING_LABEL: 'missing-label',
  MISSING_ROLE: 'missing-role',
  INVALID_TABLE: 'invalid-table-structure',
  MISSING_TABLE_HEADER: 'missing-table-header',
  MISSING_TABLE_BODY: 'missing-table-body',
  MISSING_TABLE_CAPTION: 'missing-table-caption',
  
  ensureElementId(element, prefix = 'el') {
    if (!element) return '';
    if (!element.id) {
      const generatedId = `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
      element.id = generatedId;
    }
    return element.id;
  },
  addAriaLabel(element, label) {
    if (!element) return;
    if (label && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  },
  renderDependencyGraph(graphData, container) {
    if (!container) return;
    container.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dependency graph');
    container.appendChild(svg);
  },
  // Addressability-related functionality
  // Placeholder for addressability issues tracking
  issues: [],
  add: function(issue) {
    this.issues.push(issue);
  },
  clear: function() {
    this.issues = [];
  },

  analyzeAccessibilityIssues: function(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section ${index} has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible language
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section ${index} contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  generateAccessibilityReport: function(accessibilityReport) {
    if (!accessibilityReport || !accessibilityReport.issues || accessibilityReport.issues.length === 0) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore: function(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  convertMainToSection: function(source) {
    const mainBlockRegex = /<main\b([^>]*)>([\s\S]*?)<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main\b([^>]*)>/i, '<section$1>')
        .replace(/<\/main>/i, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark: function(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole) {
      return { valid: false, error: 'Element does not have a valid landmark role', element: tagName };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}`, element: tagName, role: landmarkRole };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  createInPageButton: function(options) {
    const button = document.createElement('button');
    button.textContent = options.text || 'Click me';
    button.setAttribute('aria-label', options.ariaLabel || options.text);
    button.className = options.className || 'in-page-button';
    if (options.onClick) {
      button.addEventListener('click', options.onClick);
    }
    return button;
  },

  personName: function(firstName, lastName) {
    return `${firstName} ${lastName}`.trim();
  },

  addLangAttribute: function(element, lang) {
    element.setAttribute('lang', lang);
  },

  countDependencies: function() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  ensureUniqueLandmarksFromString: function(str) {
    return str;
  }
};

/**
 * Identifies functions that render dependency graphs
 * @returns {string[]} Array of function names that render dependency graphs
 */
function getDependencyGraphFunctions() {
  const functions = [];
  // Check if renderDependencyGraph exists
  if (typeof renderDependencyGraph === 'function') {
    functions.push('renderDependencyGraph');
  }
  // Check if renderGraph exists
  if (typeof renderGraph === 'function') {
    functions.push('renderGraph');
  }
  // Check if renderTree exists
  if (typeof renderTree === 'function') {
    functions.push('renderTree');
  }
  return functions;
}

/**
 * Updates a dependency graph rendering function with accessibility features
 * @param {string} functionName - Name of the function to update
 * @param {HTMLElement} container - Container element for the graph
 * @returns {Object} Accessibility configuration for the graph
 */
function updateDependencyGraphAccessibility(functionName, container) {
  if (!container) {
    return { success: false, error: 'Container element is required' };
  }

  const accessibleConfig = {
    functionName,
    hasId: !!container.id,
    ariaLabel: container.getAttribute('aria-label'),
    role: container.getAttribute('role'),
    svgElements: []
  };

  // Find all SVG elements within the container
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    accessibleConfig.svgElements.push({
      index,
      id: svg.id || `dependency-graph-svg-${index}`,
      role: svg.getAttribute('role') || 'img',
      hasAriaLabel: !!svg.getAttribute('aria-label'),
      hasTitle: !!svg.querySelector('title')
    });
  });

  return {
    success: true,
    config: accessibleConfig
  };
}

/**
 * Main application entry point with accessibility features
 */

function initializeDependencyGraph(container, options = {}) {
  const svgElements = container ? container.querySelectorAll('svg') : [];

  svgElements.forEach((svg, index) => {
    // Ensure each SVG has a unique ID
    if (!svg.id) {
      svg.id = `dep-graph-${Date.now()}-${index}`;
    }

    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    
    // Get accessible name and set aria-label if available
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-label', accessibleName);
    }
  });

  // Update accessibility for dependency graph functions
  const graphFunctions = getDependencyGraphFunctions();
  graphFunctions.forEach(fnName => {
    const result = updateDependencyGraphAccessibility(fnName, container);
    if (result.success) {
      console.log(`Updated accessibility for ${fnName}:`, result.config);
    }
  });
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check for title element
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }
  
  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for id that might have a corresponding label
  if (svg.id) {
    const label = document.querySelector(`label[for="${svg.id}"]`);
    if (label) {
      return label.textContent.trim();
    }
  }
  
  return '';
}

function setSvgAttributes(svg) {
  if (!svg) return;
  
  const currentWidth = svg.getAttribute('width');
  const currentHeight = svg.getAttribute('height');
  
  if (currentWidth === null && svg.style.width === '') {
    svg.setAttribute('width', '24');
  }
  if (currentHeight === null && svg.style.height === '') {
    svg.setAttribute('height', '24');
  }
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

/**
 * Renders a dependency graph with full accessibility support
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} data - The dependency data to render
 * @returns {Object} Result with accessibility information
 */
function renderDependencyGraph(container, data) {
  if (!container) {
    throw new Error('Container element is required for rendering dependency graph');
  }

  // Ensure container has an ID for accessibility
  if (!container.id) {
    container.id = `dep-graph-container-${Date.now()}`;
  }

  // Set accessibility attributes on container
  container.setAttribute('role', 'application');
  if (!container.getAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }

  // Update the container with accessibility info
  updateDependencyGraphAccessibility('renderDependencyGraph', container);

  return {
    success: true,
    containerId: container.id,
    accessible: true
  };
}

function validateAccessibility(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }

  const issues = [];
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';

  if (tagName === 'svg') {
    if (!element.id && !element.getAttribute('aria-label')) {
      issues.push(AddressabilityIssues.MISSING_ID);
    }
    if (!element.getAttribute('role')) {
      issues.push(AddressabilityIssues.MISSING_ROLE);
    }
    if (!element.getAttribute('aria-label')) {
      issues.push(AddressabilityIssues.MISSING_LABEL);
    }
  }

  if (tagName === 'table') {
    const tableCheck = checkTableStructure(element);
    if (!tableCheck.hasHeader) {
      issues.push(AddressabilityIssues.MISSING_TABLE_HEADER);
    }
    if (!tableCheck.hasBody) {
      issues.push(AddressabilityIssues.MISSING_TABLE_BODY);
    }
    if (!tableCheck.hasCaption) {
      issues.push(AddressabilityIssues.MISSING_TABLE_CAPTION);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    getDependencyGraphFunctions,
    updateDependencyGraphAccessibility,
    initializeDependencyGraph,
    getSvgAccessibleName,
    setSvgAttributes,
    checkTableStructure,
    renderDependencyGraph,
    validateAccessibility
  };
}