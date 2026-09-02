const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
    // Use dependencyGraphContent from the imported module
    return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
    // Use indexContent from the imported module
    return indexContent(data, options);
}

// Add lang attribute to HTML element
function getLangAttribute() {
    // Implementation to add lang attribute
    return document.documentElement.lang || navigator.language || 'en';
}

// Import accessibility utilities from the other conflict branch
const accessibilityUtils = require('./accessibility').accessibilityUtils;

// Add lang attribute to HTML element
function getFullLangAttribute() {
    // Implementation to add full lang attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

// Focus trap implementation with improved accessibility features
function newFocusTrap(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    accessibilityUtils.originNewFocusTrap(element);
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
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
}

// Create accessible in-page button
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  
  if (options.text) {
    button.textContent = options.text;
  }
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  if (options.targetId) {
    button.setAttribute('aria-controls', options.targetId);
  }
  
  if (options.expanded !== undefined) {
    button.setAttribute('aria-expanded', options.expanded);
  }
  
  return button;
}

// Validate and enhance landmark structure
function validateLandmarkStructure(element) {
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'article', 'section'];
  const existingRole = element.getAttribute('role');
  
  if (!existingRole && validRoles.some(role => element.matches(role))) {
    // Auto-detect landmark type if not explicitly set
    if (element.matches('header')) {
      element.setAttribute('role', 'banner');
    } else if (element.matches('nav')) {
      element.setAttribute('role', 'navigation');
    } else if (element.matches('main')) {
      element.setAttribute('role', 'main');
    } else if (element.matches('footer')) {
      element.setAttribute('role', 'contentinfo');
    }
  }
}

// Ensure element has proper accessibility attributes
function ensureElementAccessibility(element, options = {}) {
  if (!element) return;
  
  // Add ID if missing
  if (!element.id) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 9);
  }
  
  // Add aria-labelledby if available
  if (options.labeledBy) {
    element.setAttribute('aria-labelledby', options.labeledBy);
  }
  
  // Add aria-label if available
  if (options.label) {
    element.setAttribute('aria-label', options.label);
  }
  
  // Add role if specified
  if (options.role) {
    element.setAttribute('role', options.role);
  }
}

// Validate and fix table accessibility issues
function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return;
  
  // Ensure table has a caption
  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    table.insertBefore(newCaption, table.firstChild);
  }
  
  // Ensure thead exists
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
}

// Main landmark region addition
function addMainLandmark(element) {
  if (!element) return;
  
  const currentRole = element.getAttribute('role');
  if (!currentRole) {
    element.setAttribute('role', 'main');
  }
}

// Ensure unique landmarks in document
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll(
    '[role="banner"], [role="navigation"], [role="main"], [role="complementary"], ' +
    '[role="contentinfo"], [role="search"], [role="form"]'
  );
  
  const landmarkCounts = new Map();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!landmarkCounts.has(role)) {
      landmarkCounts.set(role, 0);
    }
    
    if (landmarkCounts.get(role) > 0) {
      landmark.setAttribute('data-duplicate-landmark', 'true');
    }
    
    landmarkCounts.set(role, landmarkCounts.get(role) + 1);
  });
}

// Add accessible name to SVG elements
function getSvgAccessibleName(element) {
  return element.getAttribute('aria-label') || 
         element.getAttribute('title') || 
         element.title || 
         '';
}

// Handle accessibility errors
function handleAccessibilityIssues(issues) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Accessibility issues detected:', issues);
  }
}

// Create accessible link
function createAccessibleLink(options = {}) {
  const link = document.createElement('a');
  
  if (options.href) {
    link.href = options.href;
  }
  
  if (options.text) {
    link.textContent = options.text;
  }
  
  if (options.target) {
    link.target = options.target;
  }
  
  link.setAttribute('rel', 'noopener');
  
  return link;
}

// Add lang attribute to document element
function addLangAttribute(lang) {
  if (lang && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

// Fix table structure issues
function fixTableStructureIssues(table) {
  if (!table || table.tagName !== 'TABLE') return;
  
  // Ensure proper row structure
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    if (!row.querySelector('th, td')) {
      const cell = document.createElement('td');
      cell.innerHTML = '&nbsp;';
      row.appendChild(cell);
    }
  });
  
  // Ensure proper column structure
  const cells = table.querySelectorAll('th, td');
  cells.forEach((cell, index) => {
    if (!cell.hasAttribute('headers')) {
      cell.setAttribute('headers', 'cell-' + index);
    }
  });
}

// Add main landmark to index page
function addMainLandmarkToIndex(mainContent) {
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
    mainContent.id = 'main-content';
  }
}

// Ensure element has unique ID
function ensureElementHasIdOrigin(element) {
  if (!element) return;
  
  if (!element.id) {
    element.id = 'element-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
}

// Add aria-label attribute
function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

// Fix button identifiers for accessibility
function fixButtonIdentifiers(button) {
  if (button && button.tagName === 'BUTTON') {
    if (!button.id) {
      button.id = 'btn-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    if (button.getAttribute('aria-label')) {
      button.setAttribute('aria-labelledby', button.id);
    }
  }
}

// Fix dependency graph aria attributes
function fixDependencyGraphAria(graphElement) {
  if (graphElement) {
    graphElement.setAttribute('role', 'region');
    graphElement.setAttribute('aria-label', 'Dependency Graph');
    
    const controls = graphElement.querySelectorAll('[role="button"]');
    controls.forEach(control => {
      if (!control.getAttribute('tabindex')) {
        control.setAttribute('tabindex', '0');
      }
    });
  }
}

// Add SVG accessibility properties
function setSvgAccessibilityProps(svg) {
  if (svg) {
    svg.setAttribute('role', 'img');
    
    const title = svg.querySelector('title');
    if (title) {
      svg.setAttribute('aria-label', title.textContent);
    } else {
      svg.setAttribute('aria-label', 'Graphical content');
    }
  }
}

// Add accessible names to all SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = svg.getAttribute('aria-label') || svg.id || svg.className.baseVal.replace(/\s+/g, '-');
    if (name && !svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-label', name);
    }
    svg.setAttribute('role', 'img');
  });
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  getLangAttribute,
  getFullLangAttribute,
  newFocusTrap,
  createInPageButton,
  validateLandmarkStructure,
  ensureElementAccessibility,
  validateTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  handleAccessibilityIssues,
  createAccessibleLink,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmarkToIndex,
  ensureElementHasIdOrigin,
  addAriaLabel,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  setSvgAccessibilityProps,
  addSvgAccessibleNames,
  accessibilityUtils
};