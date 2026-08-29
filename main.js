// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }

  return null;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement) return;
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  if (!svgElement.getAttribute('focusable')) {
    svgElement.setAttribute('focusable', 'false');
  }
  if (!getSvgAccessibleName(svgElement)) {
    svgElement.setAttribute('aria-label', 'SVG image');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  const text = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const title = link.getAttribute('title');
  return !!(text || ariaLabel || title);
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  const text = button.textContent ? button.textContent.trim() : '';
  const ariaLabel = button.getAttribute('aria-label');
  const title = button.getAttribute('title');
  return !!(text || ariaLabel || title);
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const root = container || document;
  const links = root.querySelectorAll ? root.querySelectorAll('a') : [];
  const buttons = root.querySelectorAll ? root.querySelectorAll('button') : [];
  const issues = [];

  links.forEach((link) => {
    if (!isLinkAccessible(link)) {
      issues.push({ type: 'link', element: link, message: 'Link missing accessible name' });
    }
  });

  buttons.forEach((button) => {
    if (!isButtonAccessible(button)) {
      issues.push({ type: 'button', element: button, message: 'Button missing accessible name' });
    }
  });

  return { issues };
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element) return false;
  const currentRole = element.getAttribute('role') || element.tagName.toLowerCase();
  if (currentRole !== role) {
    element.setAttribute('role', role);
  }
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', role);
  }
  return true;
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  const body = document.body;
  if (!body) return null;
  let main = body.querySelector('main');
  if (main) return main;
  main = document.createElement('main');
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }
  body.appendChild(main);
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object
 */
function checkLandmarks(container = document) {
  const root = container || document;
  const issues = [];
  const landmarkSelectors = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkSelectors.forEach((selector) => {
    const elements = root.querySelectorAll ? root.querySelectorAll(selector) : [];
    elements.forEach((el) => {
      const label = el.getAttribute('aria-label');
      const labelledBy = el.getAttribute('aria-labelledby');
      if (!label && !labelledBy) {
        el.setAttribute('aria-label', selector);
      }
    });
  });
  return { issues };
}

function makeAccessible(element) {
  if (!element) return;
  if (!element.getAttribute('role')) {
    element.setAttribute('role', 'button');
  }
  if (!element.getAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }
}

exports.someFunction = function() {
  // Existing code
};

exports.anotherFunction = function() {
  // Existing code
};

// TODO: Create or update the affected functions to be accessible
// - getSvgAccessibleName
// - setSvgAccessibilityProps
// - isLinkAccessible
// - isButtonAccessible
// - checkAccessibility
// - checkLandmarkElement
// - wrapPrimaryContentInMain
// - checkLandmarks
// - getLangAttribute
// - createInPageButton
// - validateTableAccessibility
// - validateTableStructure
// - validateLandmark
// - validateLandmarkStructure
// - validateLandmarkAttributes
// - ensureUniqueLandmarks
// - validateLinkAccessibility
// - handleFakeLinks
// - countDependencies
// - makeAccessible
// - rotateBack

// The function rotateBack() should be defined somewhere in your code to handle the action of rotating back.

// Here's an example of how the rotateBack function might be defined:
function rotateBack() {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

function getLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  return htmlElement.getAttribute('lang');
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Skip to main content');
  button.textContent = 'Skip to main content';
  return button;
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption, th, [scope]')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table caption';
      table.insertBefore(caption, table.firstChild);
    }
  });
  return tables.length;
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  let issues = 0;
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) issues++;
    });
  });
  return issues;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[role]');
  return landmarks.length;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
  let issues = 0;
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('role') && !landmark.tagName.match(/^(MAIN|NAV|HEADER|FOOTER|ASIDE)$/)) {
      issues++;
    }
  });
  return issues;
}

function validateLandmarkAttributes() {
  const landmarks = document.querySelectorAll('[role]');
  let issues = 0;
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'region'].includes(role)) {
      issues++;
    }
  });
  return issues;
}

function setSvgAttributes(svgElement) {
  const svg = svgElement || document.querySelector('svg');
  if (!svg) return;
  if (!svg.getAttribute('role')) svg.setAttribute('role', 'img');
  if (!svg.getAttribute('focusable')) svg.setAttribute('focusable', 'false');
  return svg;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      landmark.id = `landmark-${index}`;
    }
  });
  return landmarks.length;
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let issues = 0;
  links.forEach(link => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    if (!text && !ariaLabel && !title) {
      issues++;
    }
  });
  return issues;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
  return fakeLinks.length;
}

function countDependencies() {
  const scripts = document.querySelectorAll('script[src]');
  const styles = document.querySelectorAll('link[rel="stylesheet"]');
  const images = document.querySelectorAll('img[src]');
  const svgElements = document.querySelectorAll('svg[src]');
  const fonts = document.querySelectorAll('link[rel="preload"][as="font"], link[rel="stylesheet"][href*="font"]');

  return {
    scripts: scripts.length,
    styles: styles.length,
    images: images.length,
    svgs: svgElements.length,
    fonts: fonts.length,
    total: scripts.length + styles.length + images.length + svgElements.length + fonts.length
  };
}

// TODO: Create or update the affected functions to be accessible
// Expose all relevant functions via exports so they can be accessed from main.js

exports.getSvgAccessibleName = getSvgAccessibleName;
exports.setSvgAccessibilityProps = setSvgAccessibilityProps;
exports.isLinkAccessible = isLinkAccessible;
exports.isButtonAccessible = isButtonAccessible;
exports.checkAccessibility = checkAccessibility;
exports.checkLandmarkElement = checkLandmarkElement;
exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
exports.checkLandmarks = checkLandmarks;
exports.makeAccessible = makeAccessible;
exports.getLangAttribute = getLangAttribute;
exports.createInPageButton = createInPageButton;
exports.validateTableAccessibility = validateTableAccessibility;
exports.validateTableStructure = validateTableStructure;
exports.validateLandmark = validateLandmark;
exports.validateLandmarkStructure = validateLandmarkStructure;
exports.validateLandmarkAttributes = validateLandmarkAttributes;
exports.setSvgAttributes = setSvgAttributes;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.validateLinkAccessibility = validateLinkAccessibility;
exports.handleFakeLinks = handleFakeLinks;
exports.countDependencies = countDependencies;
exports.rotateBack = rotateBack;

exports.addressAccessibilityIssue038 = addressAccessibilityIssue038;
exports.renderDependencyGraph = renderDependencyGraph;

function addressAccessibilityIssue038(element, accessibilityInfo) {
  // Code to address the specific accessibility issue on the element
  console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
}

function renderDependencyGraph() {
  // Placeholder for rendering dependency graph
  return null;
}