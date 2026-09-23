// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: b8ad7986d07c9a084d54347d2b890045530741c8_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
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
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
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

// TODO: Create new function to check if an element has a specific class name
function hasClass(element, className) {
  if (!element || !element.className) return false;
  const classNames = element.className.trim().split(' ');
  return classNames.includes(className);
}

/**
 * Validates the structure of landmark elements in a document
 * Checks for proper nesting, duplicate landmarks, and ARIA landmark roles
 * @param {Document|HTMLElement} docOrContainer - The document or container to validate
 * @returns {Object} - Validation results with structure issues
 */
function validateLandmarkStructure(docOrContainer) {
  const results = {
    valid: true,
    issues: []
  };
  
  if (!docOrContainer) {
    results.valid = false;
    results.issues.push('Document or container is required');
    return results;
  }
  
  const container = docOrContainer.body || docOrContainer;
  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = container.querySelectorAll(selector);
  
  // Check for multiple <main> elements
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length > 1) {
    results.valid = false;
    results.issues.push(`Found ${mainElements.length} <main> elements. Documents should only have one <main> landmark.`);
  }
  
  // Check for <header> and <footer> outside of landmark contexts
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    
    // Check for nested landmarks of the same type (except nav, aside, section)
    if (tag === 'header' || tag === 'footer' || tag === 'article') {
      const parentOfSameType = landmark.parentElement?.closest(tag);
      if (parentOfSameType) {
        results.valid = false;
        results.issues.push(`Nested <${tag}> element found. <${tag}> should not be nested within another <${tag}>.`);
      }
    }
    
    // Check for section/article without accessible name
    if (tag === 'section' || tag === 'article') {
      const hasLabel = landmark.id || landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
      const firstHeading = landmark.querySelector('h1, h2, h3, h4, h5, h6');
      
      if (!hasLabel && !firstHeading) {
        results.valid = false;
        results.issues.push(`<${tag}> element should have an accessible name via id, aria-label, aria-labelledby, or contain a heading.`);
      }
    }
    
    // Check for proper landmark role attributes
    const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
    const explicitRole = landmark.getAttribute('role');
    if (explicitRole && !validLandmarkRoles.includes(explicitRole)) {
      results.issues.push(`Element has non-standard landmark role: ${explicitRole}`);
    }
  });
  
  // Check for landmark elements with tabindex that might indicate interactive misuse
  landmarks.forEach(landmark => {
    const tabindex = landmark.getAttribute('tabindex');
    if (tabindex !== null && landmark.tagName.toLowerCase() !== 'nav') {
      results.issues.push(`Landmark element <${landmark.tagName.toLowerCase()}> should not have tabindex. Use tabindex on interactive elements within landmarks instead.`);
    }
  });
  
  return results;
}

/**
 * Validates the structure of landmark elements in a document
 * Checks for proper nesting, duplicate landmarks, and ARIA landmark roles
 * @param {Document|HTMLElement} docOrContainer - The document or container to validate
 * @returns {Object} - Validation results with structure issues
 */
function validateLandmarkStructure(docOrContainer) {
  const results = {
    valid: true,
    issues: []
  };
  
  if (!docOrContainer) {
    results.valid = false;
    results.issues.push('Document or container is required');
    return results;
  }
  
  const container = docOrContainer.body || docOrContainer;
  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = container.querySelectorAll(selector);
  
  // Check for multiple <main> elements
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length > 1) {
    results.valid = false;
    results.issues.push(`Found ${mainElements.length} <main> elements. Documents should only have one <main> landmark.`);
  }
  
  // Check for <header> and <footer> outside of landmark contexts
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    
    // Check for nested landmarks of the same type (except nav, aside, section)
    if (tag === 'header' || tag === 'footer' || tag === 'article') {
      const parentOfSameType = landmark.parentElement?.closest(tag);
      if (parentOfSameType) {
        results.valid = false;
        results.issues.push(`Nested <${tag}> element found. <${tag}> should not be nested within another <${tag}>.`);
      }
    }
    
    // Check for section/article without accessible name
    if (tag === 'section' || tag === 'article') {
      const hasLabel = landmark.id || landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
      const firstHeading = landmark.querySelector('h1, h2, h3, h4, h5, h6');
      
      if (!hasLabel && !firstHeading) {
        results.valid = false;
        results.issues.push(`<${tag}> element should have an accessible name via id, aria-label, aria-labelledby, or contain a heading.`);
      }
    }
    
    // Check for proper landmark role attributes
    const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
    const explicitRole = landmark.getAttribute('role');
    if (explicitRole && !validLandmarkRoles.includes(explicitRole)) {
      results.issues.push(`Element has non-standard landmark role: ${explicitRole}`);
    }
  });
  
  // Check for landmark elements with tabindex that might indicate interactive misuse
  landmarks.forEach(landmark => {
    const tabindex = landmark.getAttribute('tabindex');
    if (tabindex !== null && landmark.tagName.toLowerCase() !== 'nav') {
      results.issues.push(`Landmark element <${landmark.tagName.toLowerCase()}> should not have tabindex. Use tabindex on interactive elements within landmarks instead.`);
    }
  });
  
  return results;
}

/**
 * Main JavaScript module for landmark element validation
 * @module main
 */

/**
 * Configuration for landmark checks
 */
const config = {
  requiredLandmarks: ['main', 'header', 'footer'],
  optionalLandmarks: ['nav', 'aside', 'section'],
  skipElements: ['script', 'style', 'meta', 'link']
};

/**
 * Validates table accessibility for screen readers
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Validation results with valid flag and errors array
 */
function validateTableAccessibility(table) {
  const errors = [];
  
  if (!table) {
    errors.push('Table element is required');
    return { valid: false, errors };
  }
  
  if (table.tagName !== 'TABLE') {
    errors.push('Element must be a table');
    return { valid: false, errors };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table should have a caption element for accessibility');
  }
  
  // Check for th elements
  const thElements = table.querySelectorAll('th');
  if (thElements.length === 0) {
    errors.push('Table should have th elements for headers');
  }
  
  // Check scope attribute on th elements
  thElements.forEach((th, index) => {
    const scope = th.getAttribute('scope');
    if (!scope) {
      errors.push(`th element at index ${index} should have a scope attribute (col or row)`);
    }
  });
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead element');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody element');
  }
  
  // Check for proper headers attribute for data cells
  const cells = table.querySelectorAll('td');
  cells.forEach((cell, index) => {
    const headers = cell.getAttribute('headers');
    if (!headers && table.querySelectorAll('th').length > 0) {
      // Only suggest if there's more than just a simple 2-column table
      const row = cell.parentElement;
      if (row && row.children.length > 2) {
        errors.push(`td element at index ${index} should have a headers attribute for complex tables`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Checks if an element is a landmark element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if the element is a landmark
 */
function isLandmark(element) {
  if (!element || !element.tagName) return false;
  const landmarkTags = ['HEADER', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'FOOTER'];
  return landmarkTags.includes(element.tagName);
}

/**
 * Add addLangAttribute function
 */
function addLangAttribute(htmlElement, language) {
  if (!htmlElement) return;
  if (htmlElement.lang !== language) {
    htmlElement.lang = language;
  }

  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = doc.querySelectorAll(selector);

  landmarks.forEach(landmark => {
    results.landmarks.push({
      tag: landmark.tagName ? landmark.tagName.toLowerCase() : null,
      id: landmark.id || null,
      className: landmark.className || null
    });
  });

  const hasMain = results.landmarks.some(l => l.tag === 'main');
  if (!hasMain) {
    results.valid = false;
    results.errors.push('Document must contain at least one <main> landmark');
  }

  return results;
}

/**
 * Add validateTableAccessibility function
 */
function validateTableAccessibility(table) {
  const tableRows = Array.from(table.rows);
  let tableHead, tableBody;
  const tableHasHead = tableRows.some((row, index) => index === 0 && row.cells.length > 0);

  if (tableHasHead) {
    tableHead = tableRows[0];
    tableBody = tableRows.slice(1);
  } else {
    tableHead = null;
    tableBody = tableRows;
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
 * Main JavaScript module for landmark element validation
 * @module main
 */

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
 * @returns {boolean} - True if the element is a landmark
 */
function isLandmark(element) {
  if (!element || !element.tagName) return false;
  const landmarkTags = ['HEADER', 'MAIN', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'FOOTER'];
  return landmarkTags.includes(element.tagName);
}

/**
 * Validates landmark elements in a document
 * @param {Document} doc - The document to validate
 * @returns {Object} - Validation results
 */
function validateLandmarks(doc) {
  const results = {
    valid: true,
    landmarks: [],
    errors: []
  };

  if (!doc || !doc.body) {
    results.valid = false;
    results.errors.push('Document body not found');
    return results;
  }

  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = doc.querySelectorAll(selector);

  landmarks.forEach(landmark => {
    results.landmarks.push({
      tag: landmark.tagName.toLowerCase(),
      id: landmark.id || null,
      className: landmark.className || null
    });
  });

  const hasMain = results.landmarks.some(l => l.tag === 'main');
  if (!hasMain) {
    results.valid = false;
    results.errors.push('Document must contain at least one <main> landmark');
  }

  return results;
}

/**
 * Gets all landmark elements from a container
 * @param {HTMLElement} container - The container element
 * @returns {HTMLElement[]} - Array of landmark elements
 */
function getLandmarkElements(container) {
  if (!container) return [];

  const landmarkElements = [];
  const selector = 'header, main, nav, aside, section, article, footer';
  const elements = container.querySelectorAll(selector);

  elements.forEach(el => {
    if (isLandmark(el)) {
      landmarkElements.push(el);
    }
  });

  return landmarkElements;
}

// Example module pattern (common in Screeps)
const SomeModule = {
  // Some functionality
};

// Generalized accessibility functions

function setSvgAccessibleName(svg, name) {
  if (!svg) {
    throw new Error('SVG element is required');
    return;
  }
  svg.setAttribute('aria-label', name);
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

function renderDependencyGraphContent(container) {
  if (!container) return;
  // Process the container for dependency graph content
  const elements = container.querySelectorAll('[data-dependency]');
  elements.forEach(el => {
    if (el.dataset) {
      // Process dependency data
      const dependency = el.dataset.dependency;
      el.setAttribute('data-processed', 'true');
    }
  });
}

// TODO: Implement a function to count dependencies
// This is a placeholder for the actual implementation
function countDependencies(dependencyData) {
  if (!Array.isArray(dependencyData)) {
    throw new Error('dependencyData must be an array');
  }
  return dependencyData.length;
}

function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const elementsById = {};

  if (!elements) return [];

  elements.forEach(el => {
    if (el.id) {
      elementsById[el.id] = elementsById[el.id] || [];
      elementsById[el.id].push(el);
    }
  });

  const uniqueElements = [];
  Object.keys(elementsById).forEach(id => {
    const els = elementsById[id];
    if (els.length === 1) {
      uniqueElements.push(els[0]);
    }
  });

  return uniqueElements;
}

function ensureUniqueLandmarks() {
  return {};
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (svg && svg.querySelector) {
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
  const uniqueElements = [];
  // Process unique elements for landmark roles
  return uniqueElements;
}

function addressInsightIssues(insightReport) {
  const issues = insightReport && insightReport.issues ? insightReport.issues : [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      ensureUniqueLandmarks();
    }
    if (issue.code === 'REACT_017') {
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (!el['aria-label'] && !el.label) {
          el['aria-label'] = el.id || 'unnamed-element';
        }
      });
      const react017Elements = issue.elements || [];
    }
  });
}

function renderDependencyGraph(dependencyData) {
  console.log('Rendering dependency graph with data:', dependencyData);
}

function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

function calculateSum(a, b) {
  return a + b;
}

function addProperLandmarkRegions(affectedElements) {
  if (!affectedElements || !Array.isArray(affectedElements)) return;

  affectedElements.forEach(el => {
    if (el && el.tagName && !el.getAttribute('role')) {
      el.setAttribute('role', 'region');
    }
  });
}

module.exports = {
  validateLandmark,
  config,
  isLandmark,
  validateLandmarks,
  getLandmarkElements,
  SomeModule,
  setSvgAccessibleName,
  improveAccessibility,
  renderDependencyGraphContent,
  countDependencies,
  ensureLandmarkUniqueness,
  ensureUniqueLandmarks,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  ensureUniqueLandmarkElements,
  addSVGAccessibleName,
  fixFakeLinks,
  landmarks,
  landmarks
};