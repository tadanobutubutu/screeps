// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

/**
 * Generates a report based on accessibility issues found in the document.
 * @returns {Object} A report containing accessibility findings categorized by type.
 */
function generateAccessibilityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: 0,
      critical: 0,
      moderate: 0,
      minor: 0
    },
    issues: {
      landmarks: [],
      formControls: [],
      keyboardNavigation: [],
      ariaAttributes: [],
      images: []
    }
  };

  // Check landmarks for uniqueness and proper roles
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, [role="region"], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const landmarkIds = new Set();
  
  landmarks.forEach(landmark => {
    const id = landmark.id;
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    
    if (id) {
      if (landmarkIds.has(id)) {
        report.issues.landmarks.push({
          type: 'DUPLICATE_ID',
          severity: 'critical',
          message: `Duplicate landmark ID: "${id}"`,
          element: tagName
        });
        report.summary.totalIssues++;
        report.summary.critical++;
      }
      landmarkIds.add(id);
    } else {
      report.issues.landmarks.push({
        type: 'MISSING_ID',
        severity: 'moderate',
        message: `Landmark missing ID attribute`,
        element: tagName,
        role: role || null
      });
      report.summary.totalIssues++;
      report.summary.moderate++;
    }
  });

  // Check for main landmark
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    report.issues.landmarks.push({
      type: 'MISSING_MAIN',
      severity: 'critical',
      message: 'No main landmark found in the document'
    });
    report.summary.totalIssues++;
    report.summary.critical++;
  } else if (mainElements.length > 1) {
    report.issues.landmarks.push({
      type: 'MULTIPLE_MAIN',
      severity: 'moderate',
      message: `Multiple main landmarks found (${mainElements.length})`,
      count: mainElements.length
    });
    report.summary.totalIssues++;
    report.summary.moderate++;
  }

  // Check form controls for accessibility
  const formControls = document.querySelectorAll('input, select, textarea');
  formControls.forEach((control, index) => {
    const id = control.id;
    const hasLabel = control.getAttribute('aria-label') || 
                     control.getAttribute('aria-labelledby') ||
                     document.querySelector(`label[for="${id}"]`);
    
    if (!hasLabel && !['hidden', 'submit', 'button', 'reset'].includes(control.type)) {
      report.issues.formControls.push({
        type: 'MISSING_LABEL',
        severity: 'critical',
        message: `Form control missing accessible label`,
        element: control.tagName.toLowerCase(),
        type: control.type || 'text'
      });
      report.summary.totalIssues++;
      report.summary.critical++;
    }

    if (control.required && !control.getAttribute('aria-required')) {
      report.issues.formControls.push({
        type: 'MISSING_ARIA_REQUIRED',
        severity: 'minor',
        message: `Required field missing aria-required attribute`,
        element: control.tagName.toLowerCase()
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      report.issues.images.push({
        type: 'MISSING_ALT',
        severity: 'critical',
        message: 'Image missing alt attribute'
      });
      report.summary.totalIssues++;
      report.summary.critical++;
    } else if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
      report.issues.images.push({
        type: 'EMPTY_ALT',
        severity: 'moderate',
        message: 'Image has empty alt attribute - consider if decorative'
      });
      report.summary.totalIssues++;
      report.summary.moderate++;
    }
  });

  // Check for interactive elements without keyboard support
  const interactiveElements = document.querySelectorAll('[role="button"], [role="link"]');
  interactiveElements.forEach(element => {
    const isAnchor = element.tagName.toLowerCase() === 'a';
    const isButton = element.tagName.toLowerCase() === 'button';
    const hasTabIndex = element.hasAttribute('tabindex');
    
    if (!isAnchor && !isButton && !hasTabIndex) {
      report.issues.keyboardNavigation.push({
        type: 'NOT_KEYBOARD_ACCESSIBLE',
        severity: 'moderate',
        message: 'Interactive element may not be keyboard accessible',
        element: element.tagName.toLowerCase(),
        role: element.getAttribute('role')
      });
      report.summary.totalIssues++;
      report.summary.moderate++;
    }
  });

  // Check for proper ARIA usage
  const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
  elementsWithAria.forEach(element => {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim() === '') {
      report.issues.ariaAttributes.push({
        type: 'EMPTY_ARIA_LABEL',
        severity: 'minor',
        message: 'Element has empty aria-label',
        element: element.tagName.toLowerCase()
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  return report;
}

/**
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  // Implementation to address accessibility issues from an insight report.
  // Apply specific accessibility fixes here based on the report's structure.
  // For now, we simply return the report unchanged.
  return insightReport;
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  let uniqueIds = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(landmark.id.split('-')[1])) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
}

// Set of used landmark IDs for ensuring uniqueness
const _usedLandmarkIds = new Set();

/**
 * Ensures a unique landmark ID based on the provided base name.
 * @param {string} baseName - The base name to use for the unique ID.
 * @returns {string} A unique landmark ID.
 */
function ensureUniqueLandmarkId(baseName) {
  let candidate = baseName;
  if (_usedLandmarkIds.has(candidate)) {
    // Collision handling: add random suffix
    const suffix = Math.random().toString(36).substring(2, 9);
    candidate = `${baseName}-${suffix}`;
  }
  _usedLandmarkIds.add(candidate);
  return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];
  for (const lm of landmarks) {
    if (!seen.has(lm.id)) {
      seen.add(lm.id);
      result.push(lm);
    }
  }
  return result;
}

/**
 * Ensures an element has an id attribute
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix='element'] - Prefix for auto-generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return element.id;
}

/**
 * Adds an aria-label attribute to an element
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  element.setAttribute('aria-label', label);
}

/**
 * Renders dependency graphs
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} options - Graph rendering options
 * @param {Array} options.nodes - Array of dependency nodes
 * @param {Array} options.edges - Array of dependency edges
 * @returns {HTMLElement} The rendered graph container
 */
function renderDependencyGraphs(container, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const { nodes = [], edges = [] } = options;
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
  
  // Render nodes
  nodes.forEach(node => {
    const nodeElement = document.createElement('div');
    nodeElement.id = ensureElementHasId(nodeElement, 'node');
    nodeElement.textContent = node.label || node.id;
    nodeElement.className = 'graph-node';
    graphContainer.appendChild(nodeElement);
  });
  
  // Render edges (connections between nodes)
  edges.forEach(edge => {
    const sourceId = ensureElementHasId(document.getElementById(edge.source) || { id: edge.source }, 'node-source');
    const targetId = ensureElementHasId(document.getElementById(edge.target) || { id: edge.target }, 'node-target');
    
    const edgeElement = document.createElement('div');
    edgeElement.className = 'graph-edge';
    edgeElement.setAttribute('data-source', edge.source);
    edgeElement.setAttribute('data-target', edge.target);
    graphContainer.appendChild(edgeElement);
  });
  
  container.appendChild(graphContainer);
  return graphContainer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    ensureUniqueLandmarks,
    setupKeyboardNavigation,
    trapFocus,
    generateAccessibilityReport,
    addressAccessibilityIssues,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs
  };
}