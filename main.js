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
  }
};

/**
 * Check if an element is a landmark element for accessibility
 * Landmark elements include: main, nav, aside, header, footer, section, article, form, search
 * @param {HTMLElement|string} element - The element or element tag name to check
 * @returns {boolean} True if the element is a landmark element
 */
function isLandmarkElement(element) {
  const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];

  if (!element) {
    return false;
  }

  if (typeof element === 'string') {
    return landmarkTags.includes(element.toLowerCase());
  }

  if (element.tagName) {
    return landmarkTags.includes(element.tagName.toLowerCase());
  }

  return false;
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_\-\.]/gi, '_');
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

/**
 * Handle credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Result of handling the credential
 */
function handleCredentialResponseFn(credentialResponse) {
    const parsedResponse = parseCredentialResponse(credentialResponse);

    if (!parsedResponse.success) {
        return {
            status: 'error',
            message: parsedResponse.error
        };
    }

    const credential = parsedResponse.credential;

    if (!credential) {
        return {
            status: 'error',
            message: 'No credential provided'
        };
    }

    // Decode the JWT token to extract user information
    const decodedToken = decodeJwtToken(credential);

    if (!decodedToken) {
        return {
            status: 'error',
            message: 'Failed to decode credential token'
        };
    }

    // Create session for the authenticated user
    const sessionId = generateSessionId();
    const sessionData = {
        user: {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            sub: decodedToken.sub
        },
        authenticatedAt: Date.now(),
        credential: credential
    };

    appState.sessions.set(sessionId, sessionData);
    logSessionEvent('user_authenticated', {
        sessionId,
        clientId: parsedResponse.clientId,
        timestamp: Date.now()
    });

    return {
        status: 'success',
        sessionId,
        user: sessionData.user
    };
}

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return timestamp + '-' + randomPart;
}

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

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return 'SVG graphic';
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

/**
 * Add lang attribute to the document/html element for accessibility (REACT_015)
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 * @param {HTMLElement} root - Root element to set lang on (defaults to documentElement)
 */
function setDocumentLanguage(lang = 'en', root = null) {
  const element = root || document.documentElement;
  if (!element.hasAttribute('lang')) {
    element.setAttribute('lang', lang);
  }
}

/**
 * Fix tables to ensure they have proper accessibility structure (REACT_027)
 * Adds captions and scope attributes to header cells
 * @param {HTMLElement} container - Container to search for tables
 */
function fixTableAccessibility(container = document) {
  const tables = container.querySelectorAll('table');
  
  tables.forEach((table, tableIndex) => {
    // Check if table has a caption, add one if missing
    let caption = table.querySelector('caption');
    if (!caption) {
      caption = document.createElement('caption');
      caption.textContent = `Table ${tableIndex + 1}`;
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure all headers have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((header, headerIndex) => {
      if (!header.hasAttribute('scope')) {
        // Determine if this is a column header or row header
        const row = header.parentElement;
        const rowHeaders = Array.from(row.querySelectorAll('th'));
        const positionInRow = rowHeaders.indexOf(header);
        
        // Check if this header spans multiple columns (is likely a column header)
        const isColumnHeader = positionInRow === 0 && rowHeaders.length > 1;
        header.setAttribute('scope', isColumnHeader ? 'col' : 'row');
      }
    });
  });
}

/**
 * Ensure all SVG elements have accessible names (REACT_041)
 * @param {HTMLElement} container - Container to search for SVGs
 */
function fixSvgAccessibility(container = document) {
  const svgs = container.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    // Check if SVG has a title element
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      title.textContent = `Graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }

    // Ensure title has an ID for aria-labelledby
    if (!title.id) {
      title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Set aria-labelledby to reference the title
    if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-labelledby', title.id);
    }

    // Ensure SVG has a role of img
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * Ensure all landmarks have unique identifiers (REACT_025)
 * @param {HTMLElement} container - Container to search for landmarks
 */
function fixLandmarkUniqueness(container = document) {
  const landmarkSelectors = ['main', 'nav', 'header', 'footer', 'aside'];
  const landmarkCounts = {};
  
  landmarkSelectors.forEach(selector => {
    const landmarks = container.querySelectorAll(selector);
    landmarks.forEach((landmark, index) => {
      const tagName = landmark.tagName.toLowerCase();
      
      // Initialize count for this tag if not exists
      if (landmarkCounts[tagName] === undefined) {
        landmarkCounts[tagName] = 0;
      }
      
      // For multiple landmarks of the same type, ensure uniqueness
      if (landmarks.length > 1) {
        landmarkCounts[tagName]++;
        
        if (!landmark.id) {
          landmark.id = `${tagName}-${landmarkCounts[tagName]}`;
        }
        
        // Add aria-label if no label exists
        if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
          landmark.setAttribute('aria-label', `${tagName} ${landmarkCounts[tagName] + 1}`);
        }
      } else if (!landmark.id) {
        // For single landmarks, still add id if missing
        landmark.id = tagName;
      }
    });
  });
}

/**
 * Ensure all landmarks have proper structure (REACT_017)
 * @param {HTMLElement} container - Container to search for landmarks
 */
function fixLandmarkStructure(container = document) {
  const landmarkSelectors = ['main', 'nav', 'header', 'footer', 'aside'];
  
  landmarkSelectors.forEach(selector => {
    const landmarks = container.querySelectorAll(selector);
    const count = landmarks.length;
    
    landmarks.forEach((landmark, index) => {
      // Generate unique id if not present
      if (!landmark.id) {
        const idSuffix = count > 1 ? `-${index}` : '';
        landmark.id = `${selector}${idSuffix}`;
      }
    });
  });
}

/**
 * Fix fake links to have proper accessibility attributes (REACT_036)
 * @param {HTMLElement} container - Container to search for fake links
 */
function fixFakeLinksAccessibility(container = document) {
  const fakeLinks = container.querySelectorAll('[data-link]');
  
  fakeLinks.forEach((link, index) => {
    // Add proper role attribute
    if (!link.getAttribute('role') || link.getAttribute('role') === '') {
      link.setAttribute('role', 'link');
    }
    
    // Add tabindex if not present
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    
    // Add aria-pressed if not present
    if (!link.hasAttribute('aria-pressed')) {
      link.setAttribute('aria-pressed', 'false');
    }
    
    // Add aria-label if link has no text content
    const hasTextContent = link.textContent && link.textContent.trim().length > 0;
    if (!hasTextContent && !link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', `Link ${index + 1}`);
    }
  });
}

/**
 * Run all accessibility fixes to address open checks
 * @param {HTMLElement} container - Container element to fix (defaults to document)
 * @param {Object} options - Configuration options
 */
function runAccessibilityFixes(container = document, options = {}) {
  const lang = options.lang || 'en';
  
  // REACT_015: Set document language
  setDocumentLanguage(lang);
  
  // REACT_027: Fix table accessibility
  fixTableAccessibility(container);
  
  // REACT_041: Fix SVG accessible names
  fixSvgAccessibility(container);
  
  // REACT_025: Fix landmark uniqueness
  fixLandmarkUniqueness(container);
  
  // REACT_017: Fix landmark structure
  fixLandmarkStructure(container);
  
  // REACT_036: Fix fake links
  fixFakeLinksAccessibility(container);
}

// Export all functions for external use
module.exports = {
  renderGraphIndex,
  renderGraphIndexAlt,
  isLandmarkElement,
  sanitizeFilename,
  processData,
  handleCredentialResponseFn,
  generateSessionId,
  validateTableStructure,
  validateTableAccessibility,
  getSvgAccessibleName,
  checkLandmarkAccessibility,
  validateLandmarkStructureFn,
  setDocumentLanguage,
  fixTableAccessibility,
  fixSvgAccessibility,
  fixLandmarkUniqueness,
  fixLandmarkStructure,
  fixFakeLinksAccessibility,
  runAccessibilityFixes,
  a11yStore
};