// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Configuration for landmark checks */
const config = {
  requiredLandmarks: ['main', 'header', 'footer'],
  optionalLandmarks: ['nav', 'aside', 'section'],
  skipElements: ['script', 'style', 'meta', 'link']
};

/**
 * Checks if an element is a landmark element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if the element is a landmark.
 */
function isLandmark(element) {
  if (!element || !element.tagName) return false;
  const landmarkTags = ['HEADER', 'MAIN', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'FOOTER'];
  return landmarkTags.includes(element.tagName);
}

/**
 * Validates landmark elements in a document
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation results
 */
function validateLandmarks(doc) {
  // ... (existing code)
}

/**
 * Gets all landmark elements from a container
 * @param {HTMLElement} container - The container element
 * @returns {HTMLElement[]} Array of landmark elements
 */
function getLandmarkElements(container) {
  // ... (existing code)
}

/**
 * Validates the table structure for accessibility issues
 * @param {Document|HTMLElement} doc - The document or container to validate
 * @returns {Object} - Validation results with errors
 */
function validateTableStructure(doc) {
  const results = {
    valid: true,
    tables: [],
    errors: []
  };

  if (!doc) {
    results.valid = false;
    results.errors.push('Document is required');
    return results;
  }

  // Support both Document and HTMLElement
  const queryMethod = typeof doc.querySelectorAll === 'function' ? doc.querySelectorAll.bind(doc) : null;
  if (!queryMethod) {
    results.valid = false;
    results.errors.push('Provided input is not a valid document or element');
    return results;
  }

  const tables = doc.querySelectorAll('table');

  tables.forEach((table, tableIndex) => {
    const tableInfo = {
      index: tableIndex,
      issues: []
    };

    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption || !caption.textContent.trim()) {
      tableInfo.issues.push('Table must have a <caption> element describing its purpose');
    }

    // Check for proper structure: at least one thead/tbody
    const hasRows = table.querySelector('tr');
    if (!hasRows) {
      tableInfo.issues.push('Table must contain at least one <tr> row');
    }

    // Check for th elements
    const ths = table.querySelectorAll('th');
    if (ths.length === 0) {
      tableInfo.issues.push('Table must have at least one <th> element to identify column or row headers');
    } else {
      // Validate th scope attributes
      ths.forEach((th, thIndex) => {
        const scope = th.getAttribute('scope');
        if (scope && !['row', 'col', 'rowgroup', 'colgroup'].includes(scope)) {
          tableInfo.issues.push(`<th> at index ${thIndex} has an invalid scope attribute: "${scope}"`);
        }
      });
    }

    // Check for proper thead/tbody/tfoot structure if applicable
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    const directRows = table.querySelectorAll(':scope > tr');

    if (thead && tbody && directRows.length > 0) {
      tableInfo.issues.push('Table should not contain direct <tr> children when <thead> or <tbody> is used');
    }

    // Check for accessible name on table (via caption, aria-label, or aria-labelledby)
    const ariaLabel = table.getAttribute('aria-label');
    const ariaLabelledBy = table.getAttribute('aria-labelledby');
    if (!caption && !ariaLabel && !ariaLabelledBy) {
      tableInfo.issues.push('Table must have an accessible name (use <caption>, aria-label, or aria-labelledby)');
    }

    if (tableInfo.issues.length > 0) {
      results.valid = false;
      results.errors.push(...tableInfo.issues.map(issue => `Table ${tableIndex}: ${issue}`));
    }

    results.tables.push(tableInfo);
  });

  return results;
}

// Example module pattern (common in Screeps)
const SomeModule = {
  // Some functionality
};

// Generalized accessibility functions

function setSvgAccessibleName(svg, name) {
  // ... (existing code)
}

/**
 * Gets the accessible name for an SVG element
 * Checks for aria-label, aria-labelledby, title element, and text content
 * @param {SVGElement} svg - The SVG element
 * @returns {string} - The accessible name or empty string
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';

  // Check aria-label first
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim() !== '') {
    return ariaLabel;
  }

  // Check aria-labelledby
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement && labelElement.textContent) {
      return labelElement.textContent.trim();
    }
  }

  // Check for title element
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  // Check for desc element
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  return '';
}

function improveAccessibility(container) {
  if (!container) {
    container = document.body;
  }
  if (container) {
    renderDependencyGraphContent(container);
  }

  // Ensure all clickable elements are focusable
  const focusable = container.querySelectorAll('button, input, select, textarea, [tabindex]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

/**
 * Renders dependency graph content within a container
 * @param {HTMLElement} container - The container element
 */
function renderDependencyGraphContent(container) {
  if (!container) return;
  // Process the container for dependency graph content
  const elements = container.querySelectorAll('*');
  elements.forEach(el => {
    if (el.dataset) {
      // Process dependency data
    }
  });
}

/**
 * Ensures landmark uniqueness within elements
 * @param {HTMLElement[]} elements - Array of elements
 * @returns {HTMLElement[]} - Array of unique elements
 */
function ensureLandmarkUniqueness(elements) {
  // ... (existing code)
}

/**
 * Ensures landmark roles are unique in the document
 * Fixes duplicate landmark roles by removing redundant roles or adding aria labels
 * @returns {Object} - Result with fixed count and details
 */
function ensureUniqueLandmarks() {
  // ... (existing code)
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (svg && !svg.getAttribute('role')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      }
    }
  });
}

function processUniqueElements() {
  // ... (existing code)
}

function addressInsightIssues(insightReport) {
  // ... (existing code)
}

function renderDependencyGraph(dependencyData) {
  // ... (existing code)
}

// ADD NEW FUNCTION HERE
function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

function calculateSum(a, b) {
  return a + b;
}

/**
 * Adds proper landmark regions to affected elements
 * @param {HTMLElement[]} affectedElements - Array of elements to add landmark regions to
 * @returns {HTMLElement[]} - Array of elements that were modified
 */
function addProperLandmarkRegions(affectedElements) {
  if (!affectedElements || !Array.isArray(affectedElements)) return [];

  const modifiedElements = [];

  affectedElements.forEach(el => {
    if (el && el.tagName && !isLandmark(el)) {
      el.setAttribute('role', 'region');
      modifiedElements.push(el);
    }
  });

  return modifiedElements;
}

module.exports = {
  validateLandmark,
  processLandmarks,
  config,
  isLandmark,
  validateLandmarks,
  getLandmarkElements,
  validateTableStructure,
  SomeModule,
  setSvgAccessibleName,
  getSvgAccessibleName,
  improveAccessibility,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  // functionB: ensureUniqueLandmarks, // Add functionB export here if it is implemented
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  addLangAttribute,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  generateAccessibilityReport
};