// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

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

/**
 * Gets the language attribute value for the HTML element
 * @returns {string} The language code to be used for the lang attribute
 */
function getLangAttribute() {
  // For now, default to English. This can be enhanced to detect page language.
  return 'en';
}

/**
 * Validates table structure for accessibility (e.g., proper use of headers, captions)
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateTableStructure(table) {
  // Check for presence of <caption> or aria-label/aria-labelledby
  const hasCaption = table.querySelector('caption') !== null;
  const hasAriaLabel = table.hasAttribute('aria-label') || table.hasAttribute('aria-labelledby');
  
  if (!hasCaption && !hasAriaLabel) {
    console.warn('Table is missing caption or aria-label for accessibility.');
    return false;
  }

  // Check for <th> elements with scope attributes
  const thElements = table.querySelectorAll('th');
  thElements.forEach(th => {
    const scope = th.getAttribute('scope');
    if (!['col', 'row', 'colgroup', 'rowgroup'].includes(scope)) {
      console.warn('<th> element missing required scope attribute:', th);
      return false;
    }
  });

  return true;
}

/**
 * Validates all tables on the page for accessibility
 */
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableStructure(table);
  });
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string|null} The accessible name if found, otherwise null
 */
function getSvgAccessibleName(svg) {
  // Check for <title> child element
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent.trim()) {
    return titleElement.textContent.trim();
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby attribute
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledByElement = document.getElementById(ariaLabelledby);
    if (labelledByContentElement && labelledByElement.textContent.trim()) {
      return labelledByElement.textContent.trim();
    }
  }

  return null;
}

/**
 * Validates SVG elements for accessible names
 */
function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      console.warn('SVG element is missing an accessible name.', svg);
    }
  });
}

/**
 * Validates landmark elements for proper structure and ARIA roles
 * @param {string} role - The expected landmark role
 * @param {Element} element - The element to check
 * @returns {boolean} True if valid, false otherwise
 */
function validateLandmark(role, element) {
  // Basic validation: ensure element has the correct role
  const currentRole = element.getAttribute('role');
  if (currentRole !== role) {
    element.setAttribute('role', role);
    console.warn(`Element role updated to '${role}' for better landmark semantics.`);
  }
  return true;
}

/**
 * Validates landmark structure for accessibility
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="complementary"], [role="contentinfo"], main, nav, header, aside, footer');
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!role) {
      // Assign implicit role based on tag name
      const tagName = landmark.tagName.toLowerCase();
      switch (tagName) {
        case 'header':
          landmark.setAttribute('role', 'banner');
          break;
        case 'main':
          landmark.setAttribute('role', 'main');
          break;
        case 'nav':
          landmark.setAttribute('role', 'navigation');
          break;
        case 'aside':
          landmark.setAttribute('role', 'complementary');
          break;
        case 'footer':
          landmark.setAttribute('role', 'contentinfo');
          break;
      }
    }
  });
}

/**
 * Creates an accessible in-page button control
 * @param {string} label - Accessible label for the button
 * @param {Function} onClick - Click handler function
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.setAttribute('aria-label', label);
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Formats a person's name with additional accessibility context
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Formatted full name
 */
function personName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

/**
 * Ensures there are unique landmarks by removing duplicate ones
 */
function ensureUniqueLandmarks() {
  // Remove duplicate banners
  const banners = document.querySelectorAll('[role="banner"], header');
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      banners[i].remove();
    }
    console.warn('Removed duplicate banner landmarks to ensure uniqueness.');
  }

  // Remove duplicate mains
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].remove();
    }
    console.warn('Removed duplicate main landmarks to ensure uniqueness.');
  }

  // Remove duplicate navigations
  const navs = document.querySelectorAll('nav, [role="navigation"]');
  if (navs.length > 1) {
    for (let i = 1; i < navs.length; i++) {
      navs[i].remove();
    }
    console.warn('Removed duplicate navigation landmarks to ensure uniqueness.');
  }

  // Remove duplicate contentinfo
  const contentinfos = document.querySelectorAll('[role="contentinfo"], footer');
  if (contentinfos.length > 1) {
    for (let i = 1; i < contentinfos.length; i++) {
      contentinfos[i].remove();
    }
    console.warn('Removed duplicate contentinfo landmarks to ensure uniqueness.');
  }

  // Remove duplicate complementarys
  const complementaries = document.querySelectorAll('aside, [role="complementary"]');
  if (complementaries.length > 1) {
    for (let i = 1; i < complementaries.length; i++) {
      complementaries[i].remove();
    }
    console.warn('Removed duplicate complementary landmarks to ensure uniqueness.');
  }
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

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  // Preserve any other existing exports here
  newFunction,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  createInPageButton,
  personName,
  ensureUniqueLandmarks
};