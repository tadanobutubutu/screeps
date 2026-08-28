// main.js - No changes needed; the issue is in docs/dependency-graph.html
// The fix should be applied to the HTML file, not this JavaScript file.
// TODO: Add back any required exports that might have been?
/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }

  // Set role attribute
  svgElement.setAttribute('role', 'img');

  // Set aria-label if not present
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (!ariaLabel) {
    svgElement.setAttribute('aria-label', svgElement.getAttribute('title') || svgElement.getAttribute('alt') || 'SVG Image');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  // Check if link has proper href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return false;
  }

  // Check if link has text content or aria-label
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');

  if (!hasText && !hasAriaLabel) {
    return false;
  }

  return true;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  // Check if button has type attribute
  const type = button.getAttribute('type');

  // Check if button has text content or aria-label
  const hasText = button.textContent.trim().length > 0;
  const hasAriaLabel = button.getAttribute('aria-label');
  const hasAriaLabelledby = button.getAttribute('aria-labelledby');

  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return false;
  }

  return true;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement|Document} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkLinkAndButtonAccessibility(container = document) {
  const results = {
    links: {
      accessible: [],
      inaccessible: []
    },
    buttons: {
      accessible: [],
      inaccessible: []
    },
    isFullyAccessible: true
  };

  // Check all links in the container
  const links = container.querySelectorAll ? container.querySelectorAll('a') : [];
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
      results.isFullyAccessible = false;
    }
  });

  // Check all buttons in the container
  const buttons = container.querySelectorAll ? container.querySelectorAll('button') : [];
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
    } else {
      results.buttons.inaccessible.push(button);
      results.isFullyAccessible = false;
    }
  });

  return results;
}

// Add the new renderIndexView function

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Implement your code here.
  // Example of creating a button in-page:
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  // Append the button to the body or another element as needed
  document.body.appendChild(button);
}

/**
 * Ensures unique landmarks in the document or specific container.
 * Checks for duplicate landmark elements (main, nav, header, footer, etc.)
 * and returns information about any duplicates found.
 * @param {HTMLElement|Document} [container=document] - The container to check for landmarks
 * @returns {Object} An object containing landmark uniqueness check results
 */
function ensureUniqueLandmarks(container = document) {
  // Landmark types that should be unique in a document
  const UNIQUE_LANDMARKS = ['main', 'navigation', 'banner', 'contentinfo', 'search'];
  
  // Selectors for landmark elements (both semantic and ARIA-based)
  const LANDMARK_SELECTORS = [
    'main',
    'nav',
    'header',
    'footer',
    'aside',
    'section[aria-label]',
    'section[aria-labelledby]',
    '[role="main"]',
    '[role="navigation"]',
    '[role="banner"]',
    '[role="contentinfo"]',
    '[role="search"]',
    '[role="complementary"]',
    '[role="region"]'
  ].join(', ');

  const results = {
    isUnique: true,
    uniqueLandmarks: [],
    duplicateLandmarks: [],
    totalLandmarks: 0
  };

  // Get all landmark elements from the container
  const landmarks = container.querySelectorAll ? container.querySelectorAll(LANDMARK_SELECTORS) : [];
  results.totalLandmarks = landmarks.length;

  // Track occurrences of each landmark type
  const landmarkCounts = {};
  const landmarkElements = {};

  landmarks.forEach(landmark => {
    // Determine the landmark type
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();
    
    // Determine the canonical landmark type
    let landmarkType;
    if (role) {
      // Map ARIA roles to standard landmark types
      const roleMap = {
        'main': 'main',
        'navigation': 'navigation',
        'banner': 'banner',
        'contentinfo': 'contentinfo',
        'search': 'search',
        'complementary': 'complementary',
        'region': 'region'
      };
      landmarkType = roleMap[role] || role;
    } else {
      // Map HTML elements to standard landmark types
      const tagMap = {
        'main': 'main',
        'nav': 'navigation',
        'header': 'banner',
        'footer': 'contentinfo',
        'aside': 'complementary',
        'section': 'region'
      };
      landmarkType = tagMap[tagName] || tagName;
    }

    // Initialize tracking for this landmark type
    if (!landmarkCounts[landmarkType]) {
      landmarkCounts[landmarkType] = 0;
      landmarkElements[landmarkType] = [];
    }

    landmarkCounts[landmarkType]++;
    landmarkElements[landmarkType].push(landmark);
  });

  // Analyze each landmark type
  for (const type in landmarkCounts) {
    const count = landmarkCounts[type];
    const elements = landmarkElements[type];

    if (UNIQUE_LANDMARKS.includes(type) && count > 1) {
      // This is a duplicate for a unique landmark type
      results.isUnique = false;
      results.duplicateLandmarks.push({
        type: type,
        count: count,
        elements: elements
      });
    } else {
      // This is a unique or acceptable landmark
      results.uniqueLandmarks.push({
        type: type,
        count: count,
        elements: elements
      });
    }
  }

  return results;
}

// Exports for all functions
module.exports = {
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkLinkAndButtonAccessibility,
  checkAccessibility,
  renderIndexView,
  ensureUniqueLandmarks,
};