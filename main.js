const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
};

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - REACT_001: Implement function to handle new accessibility issues
// - REACT_004: Generate accessibility report

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Adds lang attribute to HTML element
 * @param {HTMLElement} element - The element to add lang attribute to
 */
function addLangAttribute(element) {
  if (element && !element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
}

/**
 * Adds landmark roles to provided elements
 * @param {Array|HTMLElement} elements - Array of elements or single element to add roles to
 */
function addLandmarkRoles(elements) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }
  elements.forEach(element => {
    const roles = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
    roles.forEach(role => {
      const existingRole = element.getAttribute('role');
      if (!existingRole || existingRole !== role) {
        element.setAttribute('role', role);
      }
    });
  });
}

/**
 * Logs the current URL to the console
 */
function logCurrentURL() {
  console.log('Current URL: ' + window.location.href);
}

// Table accessibility helpers
/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  return tableAccessibilityUtilities.validateTableAccessibility(table);
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  return tableAccessibilityUtilities.validateTableStructure(table);
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  tableAccessibilityUtilities.fixTableStructure(table);
}

// Landmark handling
/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  addLandmarkRoles([document.querySelector('main')]);
  ensureUniqueLandmarks([document.querySelector('main')]);
}

/**
 * Ensures unique landmarks (2 issues)
 * @param {Array<HTMLElement>} landmarks - Array of landmark elements to check
 */
function ensureUniqueLandmarks(landmarks) {
  const seenIds = new Set();
  const seenRoles = new Set();
  const uniqueLandmarks = [];
  const duplicates = [];

  landmarks.forEach((landmark, index) => {
    const id = landmark.id;
    const role = landmark.getAttribute('role');

    // Skip if duplicate ID
    if (id && seenIds.has(id)) {
      duplicates.push(`Duplicate ID: ${id}`);
      return;
    }
    seenIds.add(id);

    // Skip if duplicate role
    if (role) {
      if (seenRoles.has(role)) {
        duplicates.push(`Duplicate role: ${role}`);
        return;
      }
      seenRoles.add(role);
    }

    uniqueLandmarks.push(landmark);
  });

  return uniqueLandmarks;
}

/**
 * Creates in-page button based on the specified text and callback
 * @param {string} text - The text for the button
 * @param {Function} onClick - The callback to execute when the button is clicked
 * @returns {HTMLElement} The newly created button
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  button.setAttribute('role', 'button');
  return button;
}

/**
 * Creates an accessible link based on the provided href, text, and optional on-click callback
 * @param {string} href - The URL of the linked resource
 * @param {string} text - The text for the link
 * @param {Function} onClick - The callback to execute when the link is clicked (optional)
 * @returns {HTMLElement} The newly created link
 */
function createAccessibleLink(href, text, onClick) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  if (onClick) {
    link.addEventListener('click', onClick);
  }
  link.setAttribute('aria-label', text);
  return link;
}

/**
 * Adds an accessible name (aria-label) to a provided element
 * @param {HTMLElement} element - The element to add an accessible name to
 * @param {string} text - The text for the accessible name
 */
function addAriaLabel(element, text) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', text);
  }
  return element;
}

/**
 * Handles accessibility issues within the provided HTML content
 * @param {string} html - The HTML content to check for accessibility issues
 */
function handleAccessibilityIssues(html) {
  addressAccessibilityIssues(html);
}

/**
 * Validates and manages landmarks, including ensuring unique accessible names, adding proper landmark regions, and fixing existing landmarks
 */
function manageLandmarks() {
  const landmarks = loadLandmarks();
  const issues = ensureUniqueLandmarks(landmarks);
  if (issues.count > 0) {
    console.warn('Landmark issues found:', issues.issues);
  }
  addProperLandmarkRegions();
  fixLandmarkIssues(landmarks);
}

/**
 * Ensures the lang attribute is set on the HTML element and sets the language based on the current browser's language if it's not already set
 */
function ensureLangAttribute() {
  if (typeof document !== 'undefined') {
    const lang = getLangAttribute();
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }
}

/**
 * Adds accessible names (aria-labels) to SVG elements within the provided content
 * @param {string} svgContent - The SVG content to scan for elements
 */
function addSvgAccessibleNames(svgContent) {
  svgAccessibilityUtilities.addSvgAccessibleNames(svgContent);
}

/**
 * Fixes fake links and converts them into accessible buttons within the provided container
 * @param {HTMLElement} container - The container element to scan for links to fix
 */
function fixFakeLinks(container) {
  handleFakeLinks(container, true);
  createInPageButton('Fix Fake Links', () => {
    fixFakeLinks(container);
    manageLandmarks();
  });
}

/**
 * Generates a report on accessibility issues within the provided content
 * @param {string} html - The HTML content to scan for accessibility issues
 * @returns {Object} Report detailing the found issues, including success status and details of any found issues
 */
function generateAccessibilityReport(html) {
  const validationResult = addressAccessibilityIssues(html);
  const report = {
    success: validationResult.valid,
    issues: validationResult.issues
  };
  if (report.success) {
    console.log('No accessibility issues found.');
  } else {
    console.log('Accessibility issues found:');
    report.issues.forEach(issue => console.log(issue));
  }
  return report;
}

module.exports = {
  // Main exports
  getUserSafety,
  getSafetyCategories,
  calculateDiscount,
  existingFunction1,
  existingFunction2,
  newFunction,
  newFunction2,
  someNewFunction,
  createInPageButton,
  addLangAttribute,
  analyzeContentSafety,
  addressAccessibilityIssues,
  applyAccessibilityFixes,
  setDependencyGraphAriaRole,
  ensureUniqueLandmarks,
  applyAllAccessibilityFixes,
  generateAccessibilityReport,
  scanAccessibility,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  improveAccessibility: applyAccessibilityFixes,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  checkLinkAccessibility,
  function3,
  spawnProcess,
  ensureDependencyGraphAriaRole,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibilityImpl,
  handleFakeLinks,
  addLandmarkRegions,
  addProperLandmarkRegions,
  fixButtonIdentifiers,
  googleSignIn,
  enhanceAccessibilityForAddBook,
  fixTableAccessibility,
  fixLandmarkIssues,
  addSvgAccessibility,
  createAccessibleLinks,
  initializeApp,
  processData,
  fetchUser,
  clearCache,
  someFunction,
  helper,
  formatDate,
  validateInput,
  initialize,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  CONFIG,
  appState,
  experience,
  getLangAttribute,
  handleCredentialResponse,
  landmarkSelectors,
  externalFixFakeLinks,
  externalEnsureUniqueLandmarks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssuesFromModule,
  scanAccessibilityFromModule,
  fixFakeLinks: manageLandmarks,
  manageLandmarks,
  ensureLangAttribute,
  addSvgAccessibleNames,
};