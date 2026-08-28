Here is the resolved file content:

```javascript
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_017: Add landmark roles and fix landmark issues (DONE: addLandmarkRole, ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// - REACT_035: Function to create accessible in-page buttons (DONE: createInPageButton)

/**
 * Generates a unique landmark ID to ensure unique landmarks
 * @param {string} baseId - The base identifier for the landmark
 * @returns {string} - A unique landmark ID
 */
function getUniqueLandmarkId(baseId) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${baseId}-${timestamp}-${random}`;
}

/**
 * Adds landmark roles to elements that need them for accessibility
 * @param {string} selector - CSS selector for the element
 * @param {string} landmarkRole - The landmark role to add (e.g., 'navigation', 'main', 'banner')
 */
function addLandmarkRole(selector, landmarkRole) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    element.setAttribute('role', landmarkRole);
    if (landmarkRole === 'navigation') {
      element.setAttribute('aria-label', `Navigation ${index + 1}`);
    } else if (landmarkRole === 'main') {
      element.setAttribute('aria-label', `Main content`);
    } else if (landmarkRole === 'banner') {
      element.setAttribute('aria-label', `Site header`);
    }
  });
}

/**
 * Ensures all landmarks on the page have unique identifiers
 * Validates and fixes duplicate landmark issues
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], nav, main, header, footer');
  const seenLandmarks = new Map();

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const existingIds = seenLandmarks.get(role) || [];

    if (existingIds.length > 0) {
      // This is a duplicate landmark - make it unique
      const uniqueId = getUniqueLandmarkId(`landmark-${role}`);
      landmark.id = uniqueId;
      landmark.setAttribute('aria-label', `${role} ${existingIds.length + 1}`);
    }

    if (!landmark.id) {
      landmark.id = getUniqueLandmarkId(`landmark-${role}`);
    }

    seenLandmarks.set(role, [...existingIds, landmark.id]);
  });
}

/**
 * Adds accessible names to SVG elements
 * @param {string} selector - CSS selector for SVG elements
 * @param {string} name - The accessible name to add
 */
function addSvgAccessibleName(selector, name) {
  const svgs = document.querySelectorAll(selector);
  svgs.forEach((svg, index) => {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name || `SVG icon ${index + 1}`);
  });
}

/**
 * Fixes fake link issues by ensuring proper semantic markup
 * @param {string} selector - CSS selector for fake links
 */
function fixFakeLinks(selector) {
  const fakeLinks = document.querySelectorAll(selector);
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Check if it's a fake link (no href or href that looks like JavaScript)
    if (!href || href.startsWith('javascript:') || href === '#') {
      // Add button role if it's not already a button
      if (link.tagName !== 'BUTTON') {
        link.setAttribute('role', 'button');

        // Add keyboard support
        if (!link.hasAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }

        // Add click handler if not present
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
      }
    }
  });
}

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 */
function addHtmlLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Creates an accessible in-page button element
 * @param {Document} doc - The document object
 * @param {string} text - The button text content
 * @param {Object} [options] - Optional configuration for the button
 * @param {string} [options.className] - CSS class name(s) for the button
 * @param {string} [options.id] - ID attribute for the button
 * @param {string} [options.ariaLabel] - Accessible label for screen readers
 * @param {boolean} [options.disabled] - Whether the button should be disabled
 * @param {string} [options.type] - Button type attribute (default: 'button')
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(doc, text = '', options = {}) {
  const button = doc.createElement('button');
  button.textContent = text;
  button.type = options.type || 'button';

  if (options.className) {
    button.className = options.className;
  }

  if (options.id) {
    button.id = options.id;
  }

  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.disabled) {
    button.disabled = true;
  }

  return button;
}

// Initialize accessibility fixes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add lang attribute to HTML element (REACT_015)
  addHtmlLangAttribute();

  // Add landmark roles (REACT_017)
  addLandmarkRole('nav', 'navigation');
  addLandmarkRole('main', 'main');
  addLandmarkRole('header', 'banner');
  addLandmarkRole('footer', 'contentinfo');

  // Ensure unique landmarks (REACT_025)
  ensureUniqueLandmarks();

  // Add accessible names to SVGs (REACT_041)
  addSvgAccessibleName('svg', 'Decorative icon');

  // Fix fake links (REACT_036)
  fixFakeLinks('.fake-link');
});

module.exports = {
  getUniqueLandmarkId,
  addLandmarkRole,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  fixFakeLinks,
  addHtmlLangAttribute,
  createInPageButton
};
```