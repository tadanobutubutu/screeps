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
  // Ensure main landmark exists
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    if (document.body.firstChild) {
      document.body.insertBefore(main, document.body.firstChild);
    } else {
      document.body.appendChild(main);
    }
  }

  // Ensure navigation landmarks have proper roles
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav) => {
    if (!nav.id) {
      nav.setAttribute('role', 'navigation');
    }
  });

  // Ensure header has proper landmark role
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  // Ensure footer has proper landmark role
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
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
  // Add aria-expanded to elements with collapse/toggle behavior
  const collapsibleElements = document.querySelectorAll('[data-toggle="collapse"], .dropdown-toggle, [aria-controls]');
  collapsibleElements.forEach((element) => {
    if (!element.hasAttribute('aria-expanded')) {
      element.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-label to form elements that need better descriptions
  const formElements = document.querySelectorAll('form');
  formElements.forEach((form, index) => {
    if (!form.id && !form.getAttribute('aria-label')) {
      form.setAttribute('aria-label', `Form ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaAttributesToFormControls() {
  // Get all form inputs, textareas, and selects
  const formControls = document.querySelectorAll('input, textarea, select');

  formControls.forEach((control, index) => {
    // Skip controls that already have proper labeling
    const hasLabel = control.id &&
                     document.querySelector(`label[for="${control.id}"]`);

    // Skip hidden inputs
    if (control.type === 'hidden') {
      return;
    }

    if (!hasLabel) {
      // Add aria-label if no associated label exists
      const existingLabel = control.getAttribute('aria-label') ||
                           control.getAttribute('aria-labelledby') ||
                           control.getAttribute('placeholder');

      if (!existingLabel) {
        const inputType = control.type || control.tagName.toLowerCase();
        control.setAttribute('aria-label', `${inputType} input ${index + 1}`);
      }
    }

    // Add required indicator via ARIA for required fields
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }

    // Add invalid state indicator via ARIA
    if (control.validity && !control.validity.valid && !control.getAttribute('aria-invalid')) {
      control.setAttribute('aria-invalid', 'true');
    }
  });

  // Ensure all fieldsets have accessible names
  const fieldsets = document.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset, index) => {
    if (!fieldset.getAttribute('aria-label') && !fieldset.getAttribute('aria-labelledby')) {
      const legend = fieldset.querySelector('legend');
      if (legend) {
        fieldset.setAttribute('aria-label', legend.textContent || `Field group ${index + 1}`);
      }
    }
  });
}

/**
 * Function to replace `my-button` with actual button id
 */
function initAccessibility() {
  replaceMyButtonId();
  addProperLandmarkRegions();
  addProperAccountManagement();
  addAriaAttributesToFormControls();
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaAttributesToFormControls,
  replaceMyButtonId,
  initAccessibility
};