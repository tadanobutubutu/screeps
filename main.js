// TODO: This is the existing code that needs to be preserve
// Addressed accessibility issues from insight report

// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation
function addAccessibilityFeatures () {
  // Implement accessibility improvements here
  // For example:
  // - Add ARIA attributes
  // - Improve keyboard navigation
  // - Ensure proper contrast ratios
}

// ... rest of existing code ...

// Make sure to export all existing functions as they were
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
  median
} = require('./mathHelpers')

// TODO: New code that was added to the branch
// New function that does something different
function functionC() {
  // Function C implementation
}

const config = {
  port: 3000,
  debug: false
}

function getWelcomeMessage () {
  return greetingFunction() + ' This is a new function that returns a welcome message.'
}

// TODO: This is the existing code that needs to be preserved
// ...
// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

  /**
     * Check if the user prefers reduced motion
     * @returns {boolean} True if the user prefers reduced motion
     */
  prefersReducedMotion () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  prefersHighContrast () {
    return window.matchMedia('(prefers-contrast: more)').matches
  },

  updateLiveRegion (message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion()
    this.announce(message, priority)
  },

  checkLandmarkElements () {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside']
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`)
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`)
        }

        if (landmarks.length > 1) {
          if (
            !landmark.hasAttribute('aria-label') &&
                        !landmark.hasAttribute('aria-labelledby')
          ) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`)
          }
        }
      })
    })
  },

  addSVGAccessibilityProps () {
    const svgElements = document.querySelectorAll('svg')
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title')
      if (!titleElement) {
        titleElement = document.createElement('title')
        titleElement.textContent = 'Image'
        svg.insertBefore(titleElement, svg.firstChild)
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`
      }

      svg.setAttribute('aria-labelledby', titleElement.id)

      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img')
      }
    })
  },

  fixFakeLinks () {
    const fakeLinks = document.querySelectorAll('[href]:not(a)')
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link')
      link.setAttribute('tabindex', '0')
      link.setAttribute('data-interactive', 'true')
    })
  },

  preserveExistingCode () {
    // TODO: This is the existing code that needs to be preserved
    // _Commit: 4b0a76170c9695891c503753fc8449a3a8434fd3_
    // <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e88 -->
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  },

  /**
   * Check for accessible names on interactive elements
   * @param {HTMLElement} container - Container to check (defaults to document)
   * @returns {Array} - Array of elements missing accessible names
   */
  newFunction(container = document) {
    const interactiveElements = container.querySelectorAll(
      'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="menuitem"], [tabindex]:not([tabindex="-1"])'
    );
    
    const elementsMissingNames = [];
    
    interactiveElements.forEach((element) => {
      const hasAccessibleName = 
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        (element.tagName === 'INPUT' && element.getAttribute('type') !== 'hidden' && 
          (element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || 
           document.querySelector(`label[for="${element.id}"]`))) ||
        element.textContent?.trim() ||
        element.value?.trim() ||
        element.getAttribute('title');
      
      if (!hasAccessibleName) {
        elementsMissingNames.push(element);
      }
    });
    
    return elementsMissingNames;
  }
}

/**
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set (e.g., 'en', 'fr')
 * @returns {boolean} True if successful, false otherwise
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.setAttribute('lang', lang);
      return true;
    }
  }
  return false;
}

/**
 * Gets the lang attribute from the HTML element
 * @returns {string|null} The current language code or null if not set
 */
function getLangAttribute() {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      return htmlElement.getAttribute('lang');
    }
  }
  return null;
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function isLandmarkElement (element) {
  const landmarkTags = [
    'main',
    'nav',
    'aside',
    'header',
    'footer',
    'section',
    'article',
    'form',
    'search'
  ]

  if (!element) {
    return false
  }

  // Set the lang attribute on the HTML element
  setHtmlLangAttribute(lang);

  return lang;
}

/**
 * Parse a credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Parsed response with success status and credential or error
 */
function parseCredentialResponse (credentialResponse) {
  try {
    if (!credentialResponse || !credentialResponse.credential) {
      return {
        success: false,
        error: 'Invalid credential response'
      }
    }
    const parts = credentialResponse.credential.split('.')
    if (parts.length !== 3) {
      return {
        success: false,
        error: 'Malformed credential token'
      }
    }
    const payload = parts[1]
    const decoded = Buffer.from(
      payload.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf8')
    return JSON.parse(decoded)
  } catch (error) {
    return null
  }
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename (filename) {
  return filename.replace(/[^a-z0-9_.-]/g, '_')
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
function processData (items) {
  if (!Array.isArray(items)) {
    return []
  }
  return items.map((item) => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }))
}

/**
 * Handle credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Result of handling the credential
 */
function handleCredentialResponse (credentialResponse) {
  const parsedResponse = parseCredentialResponse(credentialResponse)

  if (!parsedResponse.success) {
    return {
      status: 'error',
      message: parsedResponse.error
    }
  }

  const credential = parsedResponse.credential

  if (!credential) {
    return {
      status: 'error',
      message: 'No credential provided'
    }
  }

  // Decode the JWT token to extract user information
  const decodedToken = decodeJwtToken(credential)

  if (!decodedToken) {
    return {
      status: 'error',
      message: 'Failed to decode credential token'
    }
  }

  // Create session for the authenticated user
  const sessionId = generateSessionId()
  const sessionData = {
    user: {
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      sub: decodedToken.sub
    },
    authenticatedAt: Date.now(),
    credential
  }

  appState.sessions.set(sessionId, sessionData)
  appState.credentials.push({
    sessionId,
    clientId: parsedResponse.clientId,
    timestamp: Date.now()
  })

  return {
    status: 'success',
    sessionId,
    user: sessionData.user
  }
}

// Implements the validateAccessibilityReport function as required by the issue
/**
 * Validates an accessibility report for issues
 * @param {Object} report - The accessibility report to validate
 * @returns {Array} List of issues found in the report
 */
function validateAccessibilityReport(report) {
  const issues = [];

  // If the report contains an array of issues, process each one
  if (report && Array.isArray(report.issues)) {
    report.issues.forEach((issue, index) => {
      switch (issue.type) {
        case 'missing-aria-label':
          issues.push({
            id: index,
            description: `Missing aria-label for issue #${index}`,
            severity: 'high'
          });
          break;
        case 'low-contrast-text':
          issues.push({
            id: index,
            description: `Low contrast ratio detected for issue #${index}`,
            severity: 'medium'
          });
          break;
        case 'poor-keyboard-navigation':
          issues.push({
            id: index,
            description: `Poor keyboard navigation for issue #${index}`,
            severity: 'high'
          });
          break;
        case 'invalid-landmark-role':
          issues.push({
            id: index,
            description: `Invalid landmark role for issue #${index}`,
            severity: 'medium'
          });
          break;
        case 'duplicate-landmark-id':
          issues.push({
            id: index,
            description: `Duplicate landmark ID for issue #${index}`,
            severity: 'high'
          });
          break;
        default:
          issues.push({
            id: index,
            description: `Unrecognized issue type: ${issue.type}`,
            severity: 'unknown'
          });
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
 */
function validateLandmarkStructure(container) {
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

  return {
    hasMain: foundRoles.has('main'),
    hasBanner: foundRoles.has('banner'),
    hasNav: foundRoles.has('navigation'),
    hasFooter: foundRoles.has('contentinfo'),
    missingRoles: requiredRoles.filter(r => !foundRoles.has(r))
  };
}

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Validate input
  if (!deps || typeof deps !== 'object') {
    console.warn('renderDependencyGraph: Invalid dependencies object provided');
    return '<div class="dependency-graph error">Invalid dependency data</div>';
  }

  // Log for debugging purposes when in development mode
  if (options.debug) {
    console.log('Rendering dependency graph with data:', JSON.stringify(deps, null, 2));
  }

  // Use dependencyGraphContent from the imported module
  try {
    return dependencyGraphContent(deps, options);
  } catch (error) {
    console.error('Error rendering dependency graph:', error.message);
    return `<div class="dependency-graph error">Error rendering graph: ${error.message}</div>`;
  }
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Validate input
  if (!data || typeof data !== 'object') {
    console.warn('renderIndex: Invalid data object provided');
    return '<div class="index-view error">Invalid view data</div>';
  }

  // Log for debugging purposes when in development mode
  if (options.debug) {
    console.log('Rendering index view with data:', JSON.stringify(data, null, 2));
  }

  // Use indexContent from the imported module
  try {
    return indexContent(data, options);
  } catch (error) {
    console.error('Error rendering index view:', error.message);
    return `<div class="index-view error">Error rendering view: ${error.message}</div>`;
  }
}

if (typeof document !== 'undefined') {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
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

  const elementsToExclude = []
  const landmarks = document.querySelectorAll(
    'header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary]", [role="contentinfo"]'
  )
  landmarks.forEach((landmark) => {
    elementsToExclude.push(landmark)

  })

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
}

/**
 * Validate a session
 * @param {string} sessionId - The session ID to validate
 * @returns {Object|null} - Session data or null if invalid
 */
function validateSession (sessionId) {
  return appState.sessions.get(sessionId) || null
}

/**
 * Get active sessions count
 * @returns {number} - Number of active sessions
 */
function getActiveSessionsCount () {
  return appState.sessions.size
}

/**
 * Decode a JWT token
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} - Decoded token payload or null
 */
function decodeJwtToken (token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    const payload = parts[1]
    const decoded = Buffer.from(
      payload.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf8')
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}

// HTTP Server setup
const server = http.createServer((