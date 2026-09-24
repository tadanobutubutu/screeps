// TODO: Address accessibility issues from insight report:

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

    return insufficientContrast;
  },

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color in rgb() or rgba() format
   * @param {string} color2 - Second color in rgb() or rgba() format
   * @returns {number} Contrast ratio
   */
  calculateContrastRatio(color1, color2) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);

    const lum1 = this.calculateLuminance(rgb1);
    const lum2 = this.calculateLuminance(rgb2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Parse color string to RGB components
   * @param {string} color - Color string in rgb() or rgba() format
   * @returns {Object} RGB components
   */
  parseColor(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!match) return { r: 0, g: 0, b: 0 };

    return {
      r: parseInt(match[1]) / 255,
      g: parseInt(match[2]) / 255,
      b: parseInt(match[3]) / 255
    };
  },

  /**
   * Calculate relative luminance of a color
   * @param {Object} rgb - RGB components
   * @returns {number} Relative luminance
   */
  calculateLuminance(rgb) {
    const components = ['r', 'g', 'b'].map(c => {
      const value = rgb[c];
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * components[0] + 0.7152 * components[1] + 0.0722 * components[2];
  },

  /**
   * Check for proper ARIA attributes on interactive elements
   * @param {HTMLElement} container - The container to check
   * @returns {Array} Array of elements with missing ARIA attributes
   */
  checkInteractiveElements(container = document) {
    const interactiveElements = container.querySelectorAll('button, [role="button"], [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const missingAria = [];

    interactiveElements.forEach(element => {
      if (!element.hasAttribute('aria-label') &&
          !element.hasAttribute('aria-labelledby') &&
          !element.hasAttribute('title') &&
          !element.textContent.trim()) {
        missingAria.push(element);
      }
    });

    return missingAria;
  },

  /**
   * Check for proper form labels
   * @param {HTMLElement} container - The container to check
   * @returns {Array} Array of form elements with missing labels
   */
  checkFormLabels(container = document) {
    const formElements = container.querySelectorAll('input:not([type="hidden"]), select, textarea');
    const missingLabels = [];

    formElements.forEach(element => {
      const id = element.id;
      if (id) {
        const label = container.querySelector(`label[for="${id}"]`);
        if (!label) {
          missingLabels.push(element);
        }
      } else {
        missingLabels.push(element);
      }
    });

    return missingLabels;
  },

  /**
   * Check for proper image alternatives
   * @param {HTMLElement} container - The container to check
   * @returns {Array} Array of images with missing alternatives
   */
  checkImageAlternatives(container = document) {
    const images = container.querySelectorAll('img, [role="img"]');
    const missingAlternatives = [];

    images.forEach(image => {
      if (!image.hasAttribute('alt') && !image.hasAttribute('aria-label') && !image.hasAttribute('aria-labelledby')) {
        missingAlternatives.push(image);
      }
    });

    return missingAlternatives;
  },

  /**
   * Run all accessibility checks on the document
   * @param {HTMLElement} container - The container to check
   * @returns {Object} Report of all accessibility issues found
   */
  runAccessibilityAudit(container = document) {
    return {
      landmarks: this.checkLandmarkElements(),
      contrast: this.checkContrastRatios(container),
      interactiveElements: this.checkInteractiveElements(container),
      formLabels: this.checkFormLabels(container),
      imageAlternatives: this.checkImageAlternatives(container),
      prefersReducedMotion: this.prefersReducedMotion(),
      prefersHighContrast: this.prefersHighContrast()
    };
  },

  /**
   * Apply all accessibility fixes to the document
   */
  applyAccessibilityFixes() {
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.ensureFormAccessibility();
    this.ensureKeyboardNavigation();
    this.ensureImageAccessibility();
    this.checkLandmarkElements();
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
 * @param {Function} dependencyGraphContentFn - Optional function to render dependency graph (defaults to imported dependencyGraphContent)
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph (deps, options = {}, dependencyGraphContentFn = dependencyGraphContent) {
  // Validate input
  if (!deps || typeof deps !== 'object') {
    console.warn('renderDependencyGraph: Invalid dependencies object provided');
    return '<div class="dependency-graph error">Invalid dependency data</div>';
  }

  // Log for debugging purposes when in development mode
  if (options.debug) {
    console.log('Rendering dependency graph with data:', JSON.stringify(deps, null, 2));
  }

  // Use dependencyGraphContent from the imported module or provided function
  try {
    return dependencyGraphContentFn(deps, options)
  } catch (error) {
    console.error('Error rendering dependency graph:', error.message);
    return `<div class="dependency-graph error">Error rendering graph: ${error.message}</div>`;
  }
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @param {Function} indexContentFn - Optional function to render index view (defaults to imported indexContent)
 * @returns {string} Rendered index HTML
 */
function renderIndex (data, options = {}, indexContentFn = indexContent) {
  // Validate input
  if (!data || typeof data !== 'object') {
    console.warn('renderIndex: Invalid data object provided');
    return '<div class="index-view error">Invalid view data</div>';
  }

  // Log for debugging purposes when in development mode
  if (options.debug) {
    console.log('Rendering index view with data:', JSON.stringify(data, null, 2));
  }

  // Use indexContent from the imported module or provided function
  try {
    return indexContentFn(data, options)
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

/**
 * Handle focus trap for accessibility (e.g., modals)
 * @param {HTMLElement} container - The container to trap focus within
 */
function handleFocusTrap(container) {
    if (!container) return;
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    });
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
  renderDependencyGraph,
  renderIndex,
  getSvgAccessibleName,
  newFunction,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  addSVGAccessibilityProps,
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
  getActiveSessionsCount,
  server,
  sanitizeFilename,
  processData,
  runAccessibilityAudit: a11yStore.runAccessibilityAudit,
  applyAccessibilityFixes: a11yStore.applyAccessibilityFixes,
  ensureFormAccessibility: a11yStore.ensureFormAccessibility,
  ensureKeyboardNavigation: a11yStore.ensureKeyboardNavigation,
  ensureImageAccessibility: a11yStore.ensureImageAccessibility
};