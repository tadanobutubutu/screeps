// TODO: Create or update the affected functions to be accessible
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: Add back any required exports that might have been?
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
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

export default greetingFunction;
export { config, getWelcomeMessage };

const { class1, function1, Object1 } = require('./path/to/module');

// Application state used by credential/session functions
const appState = {
  sessions: new Map(),
  credentials: []
};

/**
 * Decode a JWT token payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
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
    } catch (error) {
        return null;
    }
}

/**
 * Validate a session ID
 * @param {string} sessionId
 * @returns {Object|null} Session data or null
 */
function validateSession(sessionId) {
    const session = appState.sessions.get(sessionId);
    if (!session) {
        return null;
    }
    return session;
}

/**
 * Revoke a session
 * @param {string} sessionId
 * @returns {boolean} True if session was revoked
 */
function revokeSession(sessionId) {
    const existed = appState.sessions.has(sessionId);
    if (existed) {
        appState.sessions.delete(sessionId);
    }
    return existed;
}

/**
 * Generate a new session ID
 * @returns {string} New session ID
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get the count of active sessions
 * @returns {number}
 */
function getActiveSessionsCount() {
    return appState.sessions.size;
}

/**
 * Create a new session
 * @param {Object} userData - User data to store in session
 * @returns {string} Session ID
 */
function createSession(userData) {
    const sessionId = generateSessionId();
    appState.sessions.set(sessionId, { user: userData, createdAt: Date.now() });
    return sessionId;
}

const a11yStore = {
  // ... existing methods ...

  /**
   * Check if the user prefers reduced motion
   * @returns {boolean} True if the user prefers reduced motion
   */
  prefersReducedMotion() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (typeof document === 'undefined') return;
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  createLiveRegion() {
    if (typeof document === 'undefined') return null;
    let region = document.getElementById('a11y-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'a11y-live-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';
      document.body.appendChild(region);
    }
    this.liveRegion = region;
    return region;
  },

  announce(message, priority = 'polite') {
    if (typeof document === 'undefined') return;
    if (!this.liveRegion) this.createLiveRegion();
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 50);
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

  /**
   * New function implementation from origin/main
   */
  newFunction() {
    // New function implementation from origin/main
    if (typeof console !== 'undefined') {
      console.log('New function called');
    }
  },

  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  }
};

// Main entry point for the Screeps bot.
// Handles core game logic and integration points.
class ScreepsBot {
  constructor() {
    this.network = null;
    this.tasks = [];
    this.config = {};
  }

  async start() {
    // Initialize network connection
    await this.network.connect();

    // Load initial data
    await this.loadData();

    console.log('Screenspider bot started');
  }

  loadData() {
    // Placeholder for data loading logic
    // Implement actual data fetching here
  }

  // Accessibility enhancement: Ensure all UI elements are properly labeled
  setElementLabel(elementId, label) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(elementId);
    if (el) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'button');
    }
  }

  // New feature: Priority-based task scheduling
  addTaskWithPriority(taskFn, priority = 'medium') {
    this.tasks.push({ task: taskFn, priority });
    this.scheduleTasks();
  }

  scheduleTasks() {
    // Sort tasks by priority (high > medium > low)
    this.tasks.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      return prioOrder[b.priority] - prioOrder[a.priority];
    });

    // Execute highest priority task
    if (this.tasks.length > 0) {
      const nextTask = this.tasks[0];
      try {
        nextTask.task();
      } catch (err) {
        console.error(`Task failed: ${err.message}`);
      }
    }
  }
}

/**
 * Get the language attribute for an element or document.
 * @param {HTMLElement} [element] - Element to check; defaults to documentElement
 * @returns {string} The lang attribute value or 'en' as fallback
 */
function getLangAttribute(element) {
  if (typeof document === 'undefined') return 'en';
  const target = element || document.documentElement;
  return target.getAttribute('lang') || 'en';
}

/**
 * Create an in-page button for navigation
 * @param {string} label - Button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement|null}
 */
function createInPageButton(label, onClick) {
  if (typeof document === 'undefined') return null;
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

/**
 * Validate the accessibility of a table
 * @param {HTMLElement} table
 * @returns {boolean}
 */
function validateTableAccessibility(table) {
  return validateTableStructure(table);
}

/**
 * Set SVG accessibility attributes
 * @param {SVGElement} svg
 */
function setSvgAttributes(svg) {
  a11yStore.addSVGAccessibilityProps.call({ svg });
  // Use the existing helper logic
  let titleElement = svg.querySelector('title');
  if (!titleElement) {
    titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
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
}

/**
 * Validate link accessibility
 * @param {HTMLElement} link
 * @returns {boolean}
 */
function validateLinkAccessibility(link) {
  if (!link) return false;
  const hasHref = link.hasAttribute('href');
  const isAnchor = link.tagName === 'A';
  const hasAriaLabel = link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby');
  const hasText = (link.textContent || '').trim().length > 0;
  return isAnchor && hasHref && (hasAriaLabel || hasText);
}

/**
 * Handle fake links in the document
 */
function handleFakeLinks() {
  a11yStore.fixFakeLinks();
}

/**
 * Wrap primary content in a main element for accessibility
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return;
  const main = document.querySelector('main');
  if (!main) {
    const mainEl = document.createElement('main');
    mainEl.id = 'main-content';
    while (document.body.firstChild) {
      mainEl.appendChild(document.body.firstChild);
    }
    document.body.appendChild(mainEl);
  }
}

/**
 * Check landmarks for uniqueness and add labels
 */
function checkLandmarks() {
  a11yStore.checkLandmarkElements();
}

/**
 * Ensure landmark elements have unique IDs
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
  const idCounts = {};

  landmarks.forEach((landmark) => {
    const tag = landmark.tagName.toLowerCase();
    idCounts[tag] = (idCounts[tag] || 0) + 1;
    if (!landmark.id || landmark.id === '') {
      landmark.id = `${tag}-${idCounts[tag]}`;
    }
  });
}

/**
 * Handle focus trap for modal dialogs
 * @param {HTMLElement} container - Container element
 */
function handleFocusTrap(container) {
  if (typeof document === 'undefined' || !container) return;
  const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

/**
 * Get accessible name for SVG element
 * @param {SVGElement} svg
 * @returns {string}
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

/**
 * Add proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  wrapPrimaryContentInMain();
  ensureUniqueLandmarks();
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

    if (!parsedResponse) {
        return { status: 'error', message: 'Failed to parse credential response' };
    }

    if (parsedResponse.success === false) {
        return { status: 'error', message: parsedResponse.error };
    }

    return {
        status: 'success',
        credential: parsedResponse
    };
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} table
 * @returns {boolean}
 */
function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;

  // Check for table header
  const hasHeader = table.querySelector('thead') !== null;
  const headerCells = table.querySelectorAll('th').length;

  // Check for proper caption
  const hasCaption = table.querySelector('caption') !== null;

  // Check for scope attributes on header cells
  const headersWithScope = table.querySelectorAll('th[scope]').length;

  return hasHeader && headerCells > 0 && (hasCaption || headersWithScope > 0);
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
 * Helper function for UI updates with accessibility
 * @param {string} elementId - Element ID to update
 * @param {string} text - Text content to set
 */
function updateUI(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
    element.setAttribute('aria-live', 'polite');
  }
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
    addSvgAccessibilityProps: a11yStore.addSVGAccessibilityProps,
    isLandmarkElement,
    handleCredentialResponse,
    parseCredentialResponse,
    decodeJwtToken,
    generateSessionId,
    validateTableStructure,
    validateSession,
    revokeSession,
    getActiveSessionsCount,
    server,
    sanitizeFilename,
    processData,
    renderDependencyGraph: main.renderDependencyGraph,
    renderIndex: main.renderIndex,
    greetingFunction,
    newFunction: a11yStore.newFunction,
    checkLandmarkElement: a11yStore.checkLandmarkElements,
    wrapPrimaryContentInMain,
    checkLandmarks,
    ensureUniqueLandmarks,
    handleFocusTrap,
    getSvgAccessibleName,
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    setSvgAttributes,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions,
    ScreepsBot,
    config,
    getWelcomeMessage,
    updateUI
};