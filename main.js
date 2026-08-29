// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// Accessibility function to add lang attribute to the HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// ... Existing functions and exports ...

// New function to get and set the lang attribute on an element
function getLangAttribute(element) {
  return element.getAttribute('lang') || document.documentElement.lang;
}

// New function to create an in-page button
function createInPageButton(options) {
  if (!options || !options.id || !options.label) {
    throw new Error('Options must include "id" and "label".');
  }

  const button = document.createElement('a');
  button.href = `#${options.id}`;
  button.textContent = options.label;
  button.classList.add('in-page-button');

  if (getBrowserName() !== 'firefox') {
    // Non-Firefox browsers have a built-in aria-label for anchors, no need to duplicate
    button.setAttribute('aria-label', options.label);
  }

  return button;
}

// Helper function to detect the current browser
function getBrowserName() {
  // ... Add browser detection logic here ...
}

// Update document.readyState check to call new functions as well
function initAccessibility() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addLangAttribute();
      fixTableStructureIssues();
      addMainLandmark();
      addSvgAccessibleNames();
      ensureUniqueLandmarks();
      fixFakeLinkIssue();
      createInPageButton({ id: 'example', label: 'Example Link' });
    });
  } else {
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
    createInPageButton({ id: 'example', label: 'Example Link' });
  }
}

// Export functions for accessibility
module.exports = {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initAccessibility,
  createInPageButton
};

initAccessibility();