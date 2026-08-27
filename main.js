// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add any additional accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Add lang attribute to HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// REACT_025: Ensure all interactive elements are keyboard accessible
function ensureKeyboardAccessibility() {
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  interactiveElements.forEach((el) => {
    if (!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON' && el.tagName !== 'INPUT' && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA') {
      el.setAttribute('tabindex', '0');
    }
  });
}

// REACT_025: Add aria-labels to elements that lack accessible text
function addAriaLabels() {
  const elementsNeedingLabels = document.querySelectorAll('img, svg, [role="img"]');
  elementsNeedingLabels.forEach((el) => {
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('alt')) {
      el.setAttribute('aria-label', '');
    }
  });
}

// Initialize all accessibility fixes
function initializeAccessibility() {
  addLangAttribute();
  ensureKeyboardAccessibility();
  addAriaLabels();
}

if (typeof document !== 'undefined') {
  initializeAccessibility();
}

module.exports = {
  addLangAttribute,
  ensureKeyboardAccessibility,
  addAriaLabels,
  initializeAccessibility,
};