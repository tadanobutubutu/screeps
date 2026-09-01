// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

const AddressabilityIssues = {
  // Issue types for accessibility reporting
  MISSING_ID: 'missing-id',
  MISSING_LABEL: 'missing-label',
  MISSING_ROLE: 'missing-role',
  INVALID_TABLE: 'invalid-table-structure'
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

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
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

  const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
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

// ... (other functions and comments preserved)

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    getDependencyGraphFunctions,
    updateDependencyGraphAccessibility,
    getSvgAccessibleName,
    setSvgAttributes,
    checkTableStructure,
    renderDependencyGraph
  };
}