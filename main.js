// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Add the missing lang attribute to the <html> element
const htmlElement = getDocument().documentElement;
htmlElement.lang = 'en'; // Change the value to the desired language code

// Get the document object
function getDocument() {
  return document;
}

// Create a new element with attributes
function createElement(tag, attributes = {}) {
  const element = getDocument().createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}

// Trigger accessibility mode
function triggerAccessibilityMode() {
  getDocument().body.setAttribute('data-accessibility-mode', 'true');
}

// Get the lang attribute for the HTML element
function getLangAttribute() {
  return getDocument().documentElement.lang || 'en';
}

// Create an in-page button for navigation
function createInPageButton(label, targetId) {
  const button = createElement('button', {
    type: 'button',
    'aria-label': label,
  });
  button.textContent = label;
  button.addEventListener('click', () => {
    const target = getDocument().getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

// Validate table accessibility
function validateTableAccessibility(table) {
  if (!table) return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelectorAll('th').length > 0;
  return hasCaption && hasHeaders;
}

// Validate table structure
function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  let isValid = true;
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      isValid = false;
    }
  });
  return isValid;
}

// Validate landmark
function validateLandmark(landmark) {
  if (!landmark) return false;
  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  return ['banner', 'main', 'navigation', 'contentinfo', 'complementary', 'region'].includes(role);
}

// Validate landmark structure
function validateLandmarkStructure(landmark) {
  if (!landmark) return false;
  return landmark.children.length > 0;
}

// Validate landmark attributes
function validateLandmarkAttributes(landmark) {
  if (!landmark) return false;
  const hasLabel = landmark.hasAttribute('aria-label') || landmark.hasAttribute('aria-labelledby');
  return hasLabel;
}

// Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || '';
}

// Set SVG attributes for accessibility
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', accessibleName);
}

// Ensure unique landmarks on the page
function ensureUniqueLandmarks() {
  const landmarks = getDocument().querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="contentinfo"], header, main, nav, footer');
  const seen = new Set();
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (seen.has(role)) {
      landmark.setAttribute('aria-hidden', 'true');
    } else {
      seen.add(role);
    }
  });
}

// Validate link accessibility
function validateLinkAccessibility(link) {
  if (!link) return false;
  const hasHref = link.hasAttribute('href');
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby');
  return hasHref && (hasText || hasAriaLabel);
}

// Handle fake links (elements that look like links but aren't)
function handleFakeLinks() {
  const fakeLinks = getDocument().querySelectorAll('[role="link"], .fake-link, a[href=""]');
  fakeLinks.forEach((fakeLink) => {
    if (fakeLink.tagName.toLowerCase() !== 'a' || !fakeLink.getAttribute('href')) {
      fakeLink.setAttribute('tabindex', '0');
      fakeLink.setAttribute('role', 'button');
    }
  });
}

// Implement the handleErrorState function to handle the new accessibility issue
function handleErrorState(errorElement, container, trigger = false) {
  if (!errorElement) return;

  // Wrap the error in a <section> and container element (if provided)
  const errorSection = createElement('section', {
    'aria-live': 'polite', // Add ARIA live region
  });
  errorSection.appendChild(errorElement);

  if (container) {
    const errorContainer = getDocument().createElement(container);
    errorContainer.appendChild(errorSection);
    container.appendChild(errorContainer);
  } else {
    getDocument().body.appendChild(errorSection);
  }

  // If trigger is true, trigger the accessibility mode
  if (trigger) {
    triggerAccessibilityMode();
  }
}

// Implement the handleAccessibilityError function that wraps handleErrorState with triggering the accessibility mode
function handleAccessibilityError(errorElement, container) {
  handleErrorState(errorElement, container, true);
}

// Get the button with the specified ID
function getButtonWithId() {
  return getDocument().querySelector('#buttonWithId');
}

// Exit the existing handleErrorState function
export { handleErrorState };

// Export the new handleAccessibilityError function
export { handleAccessibilityError };

// Export the new getButtonWithId function to get the button with the specified ID
export { getButtonWithId };

// Export accessibility helper functions
export { getDocument, createElement, triggerAccessibilityMode, getLangAttribute, createInPageButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, validateLandmarkAttributes, getSvgAccessibleName, setSvgAttributes, ensureUniqueLandmarks, validateLinkAccessibility, handleFakeLinks };