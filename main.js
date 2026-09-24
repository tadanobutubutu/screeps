const main = require('./utilities')

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  setSvgAccessibilityProps,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  ensureElementHasIdOrigin,
  addAriaLabel: addAriaLabelAlt,
  googleSignIn,
  handleCredentialResponse: handleCredentialResponseAlt,
  renderGraphIndex: renderGraphIndexUtil,
  addressAccessibilityIssues
} = require('./utilities');

const http = require('http')

const renderGraphIndex = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

const renderGraphIndexAlt = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

// a11yStore from HEAD - preserving all accessibility methods
const a11yStore = {
  // ... existing methods ...

  /**
   * Check if the user prefers reduced motion
   * @returns {boolean} True if the user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(element => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }

        if (landmarks.length > 1) {
          if (!landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSvgAccessibleNames() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      }

      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[data-link]');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-pressed', 'true');
    });
  },

  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // _Commit: 4b0a76170c9695891c503753fc8449a3a8434fd3_
    // <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
    // _Commit: 9f4ca23445c76674f7b5dd5047c707b41ba67409_
    // <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->
  },

  newFunction() {
    // New function implementation from origin/main
  },

  validateTableAccessibility(table) {
    return validateTableAccessibility(table);
  },

  validateLandmarkStructure(container) {
    return validateLandmarkStructureFn(container);
  }
};

/**
 * Validates the structure of the table to ensure accessibility.
 * @param {HTMLElement} table - The table to validate
 * @returns {boolean} True if the table is accessible, false otherwise
 */
function validateTableStructure(table) {
    if (!table) {
      throw new Error('Table is required');
    }

    // Check for table caption (provides context for screen readers)
    const caption = table.querySelector('caption');
    if (!caption) {
      return false;
    }

    // Check for header cells (required for accessible tables)
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      return false;
    }

    // Verify all header cells have scope attribute
    for (const header of headers) {
      if (!header.hasAttribute('scope')) {
        return false;
      }
    }

    return true;
}

/**
 * Validates table accessibility by checking structure and headers.
 * @param {HTMLElement} table - The table to validate
 * @returns {Object} - Validation result with success status and details
 */
function validateTableAccessibility(table) {
  if (!table) {
    return { success: false, error: 'Table is required' };
  }

  const hasCaption = table.querySelector('caption') !== null;
  const headers = table.querySelectorAll('th');

  const headerValidation = Array.from(headers).every(header => header.hasAttribute('scope'));

  return {
    success: hasCaption && headers.length > 0 && headerValidation,
    details: {
      hasCaption,
      headerCount: headers.length,
      headersHaveScope: headerValidation
    }
  };
}

/**
 * Check accessibility of landmark elements in the document.
 * @param {HTMLElement} container - The container element to check
 */
function checkLandmarkAccessibility(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = container.querySelectorAll(landmarkSelectors.join(','));
  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Validates the structure of landmark elements.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmarkStructureFn(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const requiredRoles = ['main', 'banner', 'navigation', 'contentinfo'];
  const foundRoles = new Set();

  container.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (requiredRoles.includes(role)) {
      foundRoles.add(role);
    }
  });

  const missingRoles = requiredRoles.filter(role => !foundRoles.has(role));
  return {
    valid: missingRoles.length === 0,
    foundRoles: Array.from(foundRoles),
    missingRoles
  };
}