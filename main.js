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

// Export the module
module.exports.SomeModule = SomeModule;

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
  const focusable = container.querySelectorAll('a, button, input, select, textarea, [tabindex]');
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
    }
  });
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

/**
 * Ensures landmark roles are unique in the document
 * Fixes duplicate landmark roles by removing redundant roles or adding aria labels
 * @returns {Object} - Result with fixed count and details
 */
function ensureUniqueLandmarks() {
  const results = {
    fixed: 0,
    errors: [],
    landmarksProcessed: 0
  };

  try {
    // Get all elements with landmark roles
    const landmarkRoleSelectors = [
      '[role="main"]',
      '[role="banner"]',
      '[role="contentinfo"]',
      '[role="navigation"]',
      '[role="complementary"]',
      '[role="search"]',
      '[role="form"]',
      '[role="region"]',
      'main',
      'header',
      'footer',
      'nav',
      'aside',
      'section',
      'article'
    ];

    const selector = landmarkRoleSelectors.join(', ');
    const landmarkElements = document.querySelectorAll(selector);

    // Track landmark roles we've seen
    const seenRoles = new Map(); // role -> element
    const roleCounts = {}; // role -> count

    landmarkElements.forEach(el => {
      results.landmarksProcessed++;
      
      // Determine the landmark role
      let role = el.getAttribute('role');
      if (!role) {
        // Map semantic elements to their implicit roles
        const tagName = el.tagName.toLowerCase();
        const implicitRoles = {
          'main': 'main',
          'header': 'banner',
          'footer': 'contentinfo',
          'nav': 'navigation',
          'aside': 'complementary',
          'section': 'region',
          'article': 'region'
        };
        role = implicitRoles[tagName] || 'region';
      }

      // Count roles
      roleCounts[role] = (roleCounts[role] || 0) + 1;

      // Check for duplicates of unique roles
      const uniqueRoles = ['main', 'banner', 'contentinfo'];
      if (uniqueRoles.includes(role)) {
        if (seenRoles.has(role)) {
          // Duplicate unique role found - fix it
          const existingEl = seenRoles.get(role);
          
          // Prefer the semantic element over the role attribute
          const existingIsSemantic = ['MAIN', 'HEADER', 'FOOTER'].includes(existingEl.tagName);
          const currentIsSemantic = ['MAIN', 'HEADER', 'FOOTER'].includes(el.tagName);
          
          if (currentIsSemantic && !existingIsSemantic) {
            // Current is semantic, existing has role attribute - remove role from existing
            existingEl.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from non-semantic element`);
            seenRoles.set(role, el);
          } else if (!currentIsSemantic && existingIsSemantic) {
            // Existing is semantic, current has role attribute - remove role from current
            el.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from non-semantic element`);
          } else {
            // Both same type - remove role from current (later in DOM)
            el.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from element`);
          }
        } else {
          seenRoles.set(role, el);
        }
      } else {
        // For non-unique roles (navigation, complementary, search, form, region)
        // Ensure they have accessible names if there are multiples
        if (roleCounts[role] > 1) {
          if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
            // Generate a label based on context
            let label = '';
            if (el.id) {
              label = el.id;
            } else if (el.className) {
              label = el.className.split(' ')[0];
            } else {
              label = `${role}-${roleCounts[role]}`;
            }
            el.setAttribute('aria-label', label);
            results.fixed++;
            results.errors.push(`Added aria-label "${label}" to ${role} landmark`);
          }
        }
        if (!seenRoles.has(role)) {
          seenRoles.set(role, el);
        }
      }
    });

    // Validate required landmarks exist
    config.requiredLandmarks.forEach(required => {
      const roleMap = {
        'main': 'main',
        'header': 'banner',
        'footer': 'contentinfo'
      };
      const role = roleMap[required];
      if (!seenRoles.has(role)) {
        results.errors.push(`Required landmark "${required}" (role="${role}") not found`);
      }
    });

  } catch (error) {
    results.errors.push(`Error ensuring landmark uniqueness: ${error.message}`);
  }

  return results;
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
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
    if (el && el.tagName && !el.hasAttribute('role')) {
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
  ensureLandmarkUniqueness,
  ensureUniqueLandmarks,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions
};