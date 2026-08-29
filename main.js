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
  // Add main landmark
  const main = document.querySelector('main') || document.createElement('main');
  if (!main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  // Add navigation landmarks
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Add header landmark
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // Add footer landmark
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  
  // Add aside landmarks for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    if (!aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }
    if (!aside.getAttribute('aria-label')) {
      aside.setAttribute('aria-label', `Related content ${index + 1}`);
    }
  });
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus and dropdowns
  const collapsibleElements = document.querySelectorAll(
    '[aria-haspopup="true"], [data-toggle="dropdown"], .dropdown-toggle, .accordion-toggle'
  );
  
  collapsibleElements.forEach(element => {
    if (!element.hasAttribute('aria-expanded')) {
      element.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add aria-label to form elements that have a name but no label
  const formElements = document.querySelectorAll('input, select, textarea');
  formElements.forEach(element => {
    const name = element.getAttribute('name');
    const label = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
    
    if (name && !label) {
      // Find associated label text
      const labelElement = document.querySelector(`label[for="${element.id}"]`);
      if (labelElement) {
        element.setAttribute('aria-label', labelElement.textContent.trim());
      } else if (element.placeholder) {
        element.setAttribute('aria-label', element.placeholder);
      }
    }
  });
  
  // Add aria-describedby for inputs with help text
  const inputsWithHelp = document.querySelectorAll('[aria-describedby]');
  inputsWithHelp.forEach(input => {
    const describedById = input.getAttribute('aria-describedby');
    const helpElement = document.getElementById(describedById);
    if (helpElement && !input.hasAttribute('aria-label')) {
      input.setAttribute('aria-label', helpElement.textContent.trim());
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
  // Ensure all form inputs have proper labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([aria-label])');
  inputs.forEach(input => {
    const inputId = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    if (!input.id) {
      input.id = inputId;
    }
    
    const label = document.querySelector(`label[for="${inputId}"]`);
    if (!label && input.name) {
      const existingLabel = input.closest('label');
      if (existingLabel) {
        const labelText = existingLabel.textContent.trim();
        if (labelText) {
          input.setAttribute('aria-label', labelText);
        }
      }
    }
  });
  
  // Add role="form" to form elements
  const forms = document.querySelectorAll('form:not([role])');
  forms.forEach(form => {
    form.setAttribute('role', 'form');
  });
  
  // Add required field indicators
  const requiredFields = document.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.hasAttribute('aria-required')) {
      field.setAttribute('aria-required', 'true');
    }
  });
  
  // Add aria-invalid for fields with validation errors
  const errorFields = document.querySelectorAll('.error, [aria-invalid="true"], .is-invalid');
  errorFields.forEach(field => {
    if (!field.hasAttribute('aria-invalid') || field.getAttribute('aria-invalid') === 'false') {
      field.setAttribute('aria-invalid', 'true');
    }
    const errorId = field.getAttribute('aria-describedby') || `${field.id}-error`;
    if (!document.getElementById(errorId)) {
      field.setAttribute('aria-describedby', errorId);
    }
  });
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addARIAAttributesToFormControls,
  replaceMyButtonId
};