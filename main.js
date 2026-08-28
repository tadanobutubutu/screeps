// TODO: Address accessibility issues from insight report — CONTINUING
// Add new functions (no existing functions should be removed or renamed)


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
  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.setAttribute('role', 'main');
    // Attach label via first heading
    const heading = document.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      mainEl.setAttribute('aria-labelledby', heading.id || '');
    }
  } else {
    const body = document.body;
    body.setAttribute('role', 'main');
    const heading = document.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      body.setAttribute('aria-labelledby', heading.id || '');
    }
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
  // Add aria-expanded to account dropdown if present
  const dropdown = document.querySelector('.account-dropdown');
  if (dropdown) {
    const expanded = dropdown.children.length > 0;
    dropdown.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  // Add aria-label to form inputs lacking labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', 'Account control');
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addProperFormAccessibility() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const controls = form.querySelectorAll('input, textarea, select, button, checkbox, radio');
    controls.forEach(control => {
      // Ensure every control has an associated label
      const label = control.closest('label');
      if (!label) {
        const nearest = control.closest('fieldset, form, [for]');
        if (nearest && nearest.getAttribute('id')) {
          control.setAttribute('for', nearest.getAttribute('id'));
        }
      }

      // Add required attribute if missing
      if (!control.hasAttribute('required')) {
        control.setAttribute('required', '');
      }

      // For checkboxes and radios, provide an accessible label if none exists
      if (['checkbox', 'radio'].includes(control.tagName)) {
        const group = control.closest('div, section, [role="group"]');
        if (group) {
          const first = group.querySelector('input, textarea, select');
          if (first) {
            first.setAttribute('aria-label', 'Select option');
          }
        }
      }
    });
  });
}

/**
 * Function to replace `my-button` with actual button id
 */
addProperLandmarkRegions();
addProperAccountManagement();
addProperFormAccessibility();
replaceMyButtonId();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addProperFormAccessibility,
  replaceMyButtonId
};