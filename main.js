const main = require('./utilities');
const { requireDir } = require('require-dir');
requireDir(require.resolve('./utilities'));

const accessibilityUtils = {
  // ... existing accessibilityUtils implementation
};

const exportUtils = {
  // ... existing exportUtils implementation
};

// Import all utilities functions for convenience (merged from both branches)
const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute,
  handleCredentialResponse: handleCredentialResponseUtil,
  ensureElementId,
  addAriaLabel,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addMainLandmark,
  addLangAttribute,
  fixTableStructureIssues,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  renderGraphIndex,
  renderDependencyGraph,
  renderDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  // New function to handle focus trap
  newFocusTrap: newMainFocusTrap,
  // New functions to address new accessibility issues from insight report
  newAddressAccessibilityIssues: addressAccessibilityIssues
} = main;

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  newFocusTrap: newFocusTrap,
  addressAccessibilityIssues: newAddressAccessibilityIssues
};

const appState = {
  sessions: new Map()
};

const handleCredentialResponse = (credentialResponse) => {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }

  // Check for site name in the origin and set it as the username
  const siteName = document.location.hostname;
  const username = siteName.split('.').slice(0, 2).join('.');

  // Handle the credentialResponse
  const authentication = credentialResponse.getBasicProfile();
  if (authentication) {
    const idToken = credentialResponse.getIdToken();

    // Store the session data
    const sessionData = {
      idToken,
      email: authentication.getEmail(),
      username,
      firstName: authentication.getGivenName(),
      lastName: authentication.getFamilyName(),
      imageUrl: authentication.getImageUrl(),
    };

    // Add or update session data in the state
    const existingSession = appState.sessions.get(sessionData.idToken);
    if (existingSession) {
      existingSession.email = sessionData.email;
      existingSession.firstName = sessionData.firstName;
      existingSession.lastName = sessionData.lastName;
      existingSession.imageUrl = sessionData.imageUrl;
    } else {
      appState.sessions.set(sessionData.idToken, sessionData);
    }

    // Announce success to screen readers
    accessibilityUtils.announceToScreenReader(`Logged in as ${sessionData.username}`);

    return { status: 'success', data: sessionData };
  }

  return { status: 'error', message: 'User does not have a Google account' };
};

/**
 * Adds an aria-label attribute to an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }

  if (typeof label !== 'string' || label.trim() === '') {
    return element;
  }

  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Ensures an element has both an id and an aria-label for accessibility.
 * @param {HTMLElement} element - The element to enhance
 * @param {string} idPrefix - The prefix for generating an id if needed
 * @param {string} ariaLabel - The aria-label text
 * @returns {string|null} The id of the element, or null if element is invalid
 */
function ensureElementAccessibility(element, idPrefix, ariaLabel) {
  if (!element) {
    return null;
  }

  const id = ensureElementId(element, idPrefix);
  addAriaLabel(element, ariaLabel);

  return id;
}

/**
 * Renders the graph index view
 * @param {Object} graphData - The graph data to render
 * @returns {string} Rendered graph index HTML
 */
function renderGraphIndex(graphData) {
  // Use the existing renderDependencyGraph function for actual rendering
  return renderDependencyGraph(graphData);
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

// Accessibility function (merged from both branches)
function setSvgAccessibleProps(svg) {
  if (!svg) return;

  // Add accessible names to SVG
  addSvgAccessibleNames(svg);

  // Validate landmark structure
  validateLandmarkStructure(svg);

  // Get or create accessible name
  const titleElement = main.getSvgAccessibleName(svg);
  if (titleElement) {
    svg.setAttribute('aria-labelledby', titleElement.id);
  }

  // Ensure SVG has proper role
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }

  // Add fallback for browsers that don't support aria-labelledby
  if (!svg.querySelector('title, desc')) {
    const fallbackTitle = document.createElement('title');
    fallbackTitle.textContent = svg.getAttribute('aria-label') || 'SVG graphic';
    svg.prepend(fallbackTitle);
  }
}

module.exports = {
  // ... existing exports, updated to use new functions (accessibilityUtils, newFocusTrap)
  a11yStore,
  appState,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  ensureElementAccessibility,
  renderGraphIndex,
  renderDependencyGraph,
  setSvgAccessibleProps,
  ...main,
  // ... additional exports (if any)
};