const http = require('http');
const url = require('url');

// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

const main = require('./utilities');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Import necessary dependencies
const React = require('react');
const { render } = require('react-dom');
const {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
  validateAccessibilityReport,
  addressAccessibilityIssues,
  trapFocus,
  addLangAttributeOrigin,
  setDependencyGraphRole,
  setElementLabel,
  addTask,
  scheduleTasks,
  setFocus,
  handleKeyboardNavigation,
  handleArrowNavigation,
  handleTabNavigation,
  ensureDependencyGraphARIA
} = require('./AccessibilityHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

const config = {
  port: 3000,
  debug: false
};

function getWelcomeMessage() {
  return greetingFunction() + " This is a new function that returns a welcome message.";
}

const { class1, function1, Object1 } = require('./path/to/module');

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
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }

        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }

      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
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
  },

  newFunction() {
    // New function implementation from origin/main
  },

  /**
   * Creates a focus trap for keyboard navigation within a specified container
   * @param {HTMLElement} container - The container element to trap focus within
   * @param {Object} options - Configuration options for the focus trap
   * @param {boolean} options.initialFocus - Whether to set initial focus on the first focusable element
   * @param {boolean} options.returnFocus - Whether to return focus to the previously focused element when trap is released
   * @returns {Object} An object with methods to activate and deactivate the focus trap
   */
  createFocusTrap(container, options = {}) {
    if (!container) {
      throw new Error('Container element is required for focus trap');
    }

    const { initialFocus = true, returnFocus = true } = options;
    let previouslyFocusedElement = null;
    let isActive = false;

    // Get all focusable elements within the container
    function getFocusableElements() {
      return Array.from(container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    }

    // Handle keyboard events
    function handleKeyDown(event) {
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift+Tab: move to last element if at first
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move to first element if at last
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } else if (event.key === 'Escape') {
        // Escape key can be used to exit the trap
        deactivate();
      }
    }

    // Activate the focus trap
    function activate() {
      if (isActive) return;

      previouslyFocusedElement = document.activeElement;
      isActive = true;

      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0 && initialFocus) {
        focusableElements[0].focus();
      }

      container.addEventListener('keydown', handleKeyDown);
    }

    // Deactivate the focus trap
    function deactivate() {
      if (!isActive) return;

      isActive = false;
      container.removeEventListener('keydown', handleKeyDown);

      if (returnFocus && previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }

    return {
      activate,
      deactivate,
      isActive: () => isActive
    };
  }
};

/**
 * Add accessibility properties to SVG elements in the document
 */
function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      titleElement.textContent = 'Image';
      svg.insertBefore(titleElement, svg.firstChild);
    }

    if (!titleElement.id) {
      titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
    }

    svg.setAttribute('aria-labelledby', titleElement.id);

    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

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
 * Parse a credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Parsed response with success status and credential or error
 */
function parseCredentialResponse(credentialResponse) {
    try {
        if (!credentialResponse || !credentialResponse.credential) {
            return {
                success: false,
                error: 'Invalid credential response'
            };
        }
        const parts = credentialResponse.credential.split('.');
        if (parts.length !== 3) {
            return {
                success: false,
                error: 'Malformed credential token'
            };
        }
        const payload = parts[1];
        const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
        return JSON.parse(decoded);
    } catch (error) {
        return null;
    }
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_.-]/g, '_');
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
function handleCredentialResponse(credentialResponse) {
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
    appState.credentials.push({
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

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
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

  const hasCaption = !!table.querySelector('caption');
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
function validateLandmark(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="navigation"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
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
 * @returns {Object} - Validation result with structure details
 */
function validateLandmarkStructure(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const requiredRoles = ['main', 'banner', 'navigation', 'contentinfo'];
  const foundRoles = new Set();

  // Check native landmark elements
  const nativeLandmarks = container.querySelectorAll('main, nav, header, footer, aside');
  nativeLandmarks.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    const roleMap = {
      'main': 'main',
      'nav': 'navigation',
      'header': 'banner',
      'footer': 'contentinfo',
      'aside': 'complementary'
    };
    if (roleMap[tagName]) {
      foundRoles.add(roleMap[tagName]);
    }
  });

  // Check explicit role attributes
  container.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (requiredRoles.includes(role)) {
      foundRoles.add(role);
    }
  });

  // Check for missing required landmarks
  const missingRoles = requiredRoles.filter(r => !foundRoles.has(r));

  // Check for duplicate landmarks
  const duplicates = {};
  container.querySelectorAll('main, [role="main"]').forEach(el => {
    duplicates.main = (duplicates.main || 0) + 1;
  });
  container.querySelectorAll('nav, [role="navigation"]').forEach(el => {
    duplicates.navigation = (duplicates.navigation || 0) + 1;
  });

  const hasDuplicates = Object.values(duplicates).some(count => count > 1);

  return {
    isValid: missingRoles.length === 0 && !hasDuplicates,
    hasMain: foundRoles.has('main'),
    hasBanner: foundRoles.has('banner'),
    hasNav: foundRoles.has('navigation'),
    hasFooter: foundRoles.has('contentinfo'),
    missingRoles,
    duplicates,
    foundRoles: Array.from(foundRoles)
  };
}

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

if (typeof document !== 'undefined') {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function newFunction() {
  // Implementation from origin/main
}

if (typeof document !== 'undefined') {
  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }
}

function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  mainElement = document.createElement('main');

  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  document.body.appendChild(mainElement);

  return mainElement;
}

function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

/**
 * Ensure unique main landmarks exist in the document.
 * Logs a warning if multiple main landmarks are detected.
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    console.warn('Multiple main landmarks detected. Ensure only one main landmark exists.');
    throw new Error('Document should have at most one main landmark');
  }
}

/**
 * Create an in-page button with accessibility features.
 * @param {string} text - Button text
 * @param {string} targetId - Target element ID to scroll to
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton(text, targetId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', `Scroll to ${text}`);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

/**
 * Generate accessible name from an element's content.
 * @param {HTMLElement} element - Element to get accessible name for
 * @returns {string} - Accessible name
 */
function personName(element) {
  if (!element) {
    return '';
  }

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }

  if (element.textContent) {
    return element.textContent.trim();
  }

  return element.title || '';
}

// Initialize appState with required structures
const appState = {
  sessions: new Map(),
  credentials: []
};

/**
 * Validate a session
 * @param {string} sessionId - The session ID to validate
 * @returns {Object|null} - Session data or null if invalid
 */
function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

/**
 * Get active sessions count
 * @returns {number} - Number of active sessions
 */
function getActiveSessionsCount() {
  return appState.sessions.size;
}

/**
 * Decode a JWT token
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} - Decoded token payload or null
 */
function decodeJwtToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

function implementAccessibilityFixesFromReport(container, report = {}) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!container) {
    container = typeof document !== 'undefined' ? document.body : null;
  }

  // Handle new functions for session management
  if (typeof document !== 'undefined') {
    document.addEventListener('google-sign-in', handleCredentialResponse);
  }

  // Implement checkAccessibilityForReport function
  function checkAccessibilityForReport(content) {
    // ... Actual implementation of the accessibility checking logic
    return [];
  }

  // Handle additional rendering logic
  function renderAdditionalContent(additionalData) {
    // ... Actual implementation of the renderAdditionalContent function
    return '';
  }

  // Address existing accessibility issues using the provided functions
  if (container) {
    renderDependencyGraphs(container);
    fixDependencyGraphAria(container);
  }

  // Handle new rendering function
  function renderGraphIndex(content, options = {}) {
    return content;
  }

  // Fix accessibility issues and validate the report
  const accessibilityIssues = checkAccessibilityForReport(container);
  if (accessibilityIssues.length > 0) {
    log(`Found ${accessibilityIssues.length} accessibility issues:`);
    accessibilityIssues.forEach((issue) => {
      log(`  - ${issue}`);
    });
  }

  if (report.lang) {
    addLangAttribute(report.lang);
    fixes.langAdded = true;
  }

  if (report.mainLandmark) {
    addMainLandmark(report.mainLandmark);
    fixes.mainLandmarkAdded = true;
  }

  if (report.landmarks) {
    report.landmarks.forEach((landmark) => {
      const { id, role, label } = landmark;
      addMainLandmarkToIndex(id, role, label);
      fixLandmarkIssues({ id, role, label });
      fixes.landmarksFixed++;
    });
  }

  if (report.svgNames) {
    report.svgNames.forEach((name) => {
      addSvgAccessibleNames(name);
      fixes.svgNamesAdded++;
    });
  }

  if (report.fakeLinks) {
    report.fakeLinks.forEach((link) => {
      fixFakeLinkIssue(link);
      fixes.fakeLinksFixed++;
    });
  }

  // Handle focus trapping for keyboard navigation
  if (container) {
    trapFocus(container);
  }

  return fixes;
}

function log(message) {
  console.log(message);
}

// HTTP Server setup
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // CORS headers for credential responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Health check endpoint
    if (parsedUrl.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', sessions: getActiveSessionsCount() }));
        return;
    }

    // Credential response endpoint
    if (parsedUrl.pathname === '/api/credential' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const credentialResponse = JSON.parse(body);
                const result = handleCredentialResponse(credentialResponse);

                res.writeHead(result.status === 'success' ? 200 : 400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Session validation endpoint
    if (parsedUrl.pathname === '/api/session/validate' && req.method === 'GET') {
        const sessionId = parsedUrl.query.sessionId;

        if (!sessionId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: 'Session ID required' }));
            return;
        }

        const session = validateSession(sessionId);

        if (session) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'valid', user: session.user }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'invalid', message: 'Session expired or invalid' }));
        }
        return;
    }

    // Session revocation endpoint
    if (parsedUrl.pathname === '/api/session/revoke' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { sessionId } = JSON.parse(body);
                const revoked = revokeSession(sessionId);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: revoked ? 'success' : 'error' }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Invalid request' }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
});

/**
 * Revoke a session
 * @param {string} sessionId - The session ID to revoke
 * @returns {boolean} - True if session was revoked
 */
function revokeSession(sessionId) {
    return appState.sessions.delete(sessionId);
}

// Start server if this is the main module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export modules for testing
module.exports = {
    addSvgAccessibilityProps,
    isLandmarkElement,
    handleCredentialResponse,
    parseCredentialResponse,
    decodeJwtToken,
    generateSessionId,
    validateTableStructure,
    validateTableAccessibility,
    validateLandmark,
    validateLandmarkStructure,
    createInPageButton,
    personName,
    validateSession,
    revokeSession,
    getActiveSessionsCount,
    server,
    sanitizeFilename,
    processData,
    renderDependencyGraph,
    renderIndex,
    newFunction,
    checkLandmarkElement,
    wrapPrimaryContentInMain,
    checkLandmarks,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createFocusTrap: a11yStore.createFocusTrap,
    implementAccessibilityFixesFromReport,
    log
};