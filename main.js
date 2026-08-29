// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Add your code here to replace `my-button` with a concrete button id
 */
function replaceMyButtonId() {
  // Find the element with the `my-button` class and replace the class with the actual id.
  // Assuming you have already set the id on the button element in your code
  const button = document.querySelector('.my-button');
  if (button) {
    button.id = 'exampleButton';
    button.classList.remove('my-button');
  }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Check if main landmark exists
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');
    document.body.insertBefore(newMain, document.body.firstChild);
  }

  // Check if navigation landmark exists
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (!nav) {
    const newNav = document.createElement('nav');
    newNav.setAttribute('role', 'navigation');
    newNav.setAttribute('aria-label', 'Main navigation');
    document.body.insertBefore(newNav, document.body.firstChild);
  }

  // Check if header landmark exists
  const header = document.querySelector('header') || document.querySelector('[role="banner"]');
  if (!header) {
    const newHeader = document.createElement('header');
    newHeader.setAttribute('role', 'banner');
    document.body.insertBefore(newHeader, document.body.firstChild);
  }

  // Check if footer landmark exists
  const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
  if (!footer) {
    const newFooter = document.createElement('footer');
    newFooter.setAttribute('role', 'contentinfo');
    document.body.appendChild(newFooter);
  }
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus
  const collapsibleMenus = document.querySelectorAll('[data-collapsible], .collapsible, [aria-expanded]');
  collapsibleMenus.forEach(menu => {
    if (!menu.hasAttribute('aria-expanded')) {
      menu.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-label to form elements without labels
  const formElements = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]), select:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])');
  formElements.forEach(element => {
    const label = element.previousElementSibling;
    if (label && (label.tagName === 'LABEL' || label.getAttribute('for') === element.id)) {
      const labelId = label.id || `label-${element.id || Math.random().toString(36).substr(2, 9)}`;
      if (!label.id) label.id = labelId;
      element.setAttribute('aria-labelledby', labelId);
    } else if (!element.id) {
      element.setAttribute('aria-label', 'Form input');
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addARIAAttributesToFormControls() {
  // Add required attributes to required fields
  const requiredFields = document.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.hasAttribute('aria-required')) {
      field.setAttribute('aria-required', 'true');
    }
  });

  // Add aria-describedby for fields with help text
  const fieldsWithHelp = document.querySelectorAll('[aria-describedby]');
  fieldsWithHelp.forEach(field => {
    const helpId = field.getAttribute('aria-describedby');
    const helpElement = document.getElementById(helpId);
    if (helpElement && !helpElement.hasAttribute('id')) {
      helpElement.setAttribute('id', helpId);
    }
  });

  // Add aria-invalid to fields with validation errors
  const errorMessages = document.querySelectorAll('[class*="error"], [role="alert"]');
  errorMessages.forEach(error => {
    const linkedField = document.querySelector(`[aria-describedby*="${error.id}"], [aria-errormessage="${error.id}"]`);
    if (linkedField) {
      linkedField.setAttribute('aria-invalid', 'true');
      if (!linkedField.hasAttribute('aria-describedby')) {
        linkedField.setAttribute('aria-describedby', error.id);
      }
    }
  });
}

/**
 * Function to replace `my-button` with actual button id
 */
function initAccessibility() {
  addProperLandmarkRegions();
  addProperAccountManagement();
  addARIAAttributesToFormControls();
  replaceMyButtonId();
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addARIAAttributesToFormControls,
  replaceMyButtonId,
  initAccessibility
};