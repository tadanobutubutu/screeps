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
 * This function gets the current language attribute
 * @returns {string} - the current language attribute
 */
function getLangAttribute() {
  return document.documentElement.lang;
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang || '';
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // ... (existing code)
  const main = document.querySelector('main') || document.createElement('main');
  if (!main.id) main.id = 'main-content';
  main.setAttribute('role', 'main');
  
  const header = document.querySelector('header') || document.createElement('header');
  if (!header.id) header.id = 'site-header';
  header.setAttribute('role', 'banner');
  
  const nav = document.querySelector('nav') || document.createElement('nav');
  if (!nav.id) nav.id = 'main-navigation';
  nav.setAttribute('aria-label', 'Main navigation');
  
  const footer = document.querySelector('footer') || document.createElement('footer');
  if (!footer.id) footer.id = 'site-footer';
  footer.setAttribute('role', 'contentinfo');
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // ... (existing code)
  const collapsibleMenus = document.querySelectorAll('[aria-haspopup="true"], [data-toggle="collapse"]');
  collapsibleMenus.forEach(menu => {
    menu.setAttribute('aria-expanded', 'false');
    menu.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });
  
  const formElements = document.querySelectorAll('input, select, textarea');
  formElements.forEach(element => {
    if (!element.getAttribute('aria-label') && !document.querySelector(`label[for="${element.id}"]`)) {
      const label = element.getAttribute('name') || element.getAttribute('placeholder') || 'Form field';
      element.setAttribute('aria-label', label);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // ... (existing code)
  const formControls = document.querySelectorAll('input, select, textarea, button');
  formControls.forEach(control => {
    if (control.type !== 'hidden' && !control.disabled) {
      if (!control.getAttribute('aria-describedby') && control.getAttribute('aria-label')) {
        control.setAttribute('role', control.tagName.toLowerCase());
      }
      
      if (control.required && !control.getAttribute('aria-required')) {
        control.setAttribute('aria-required', 'true');
      }
      
      if (control.valid && !control.getAttribute('aria-invalid')) {
        control.setAttribute('aria-invalid', 'false');
      }
    }
  });
  
  const requiredFields = document.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    field.setAttribute('aria-required', 'true');
  });
}

/**
 * Function to replace `my-button` with actual button id
 */
function initializeButton() {
  replaceMyButtonId();
}

initializeButton();
addAriaToFormControls();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute
};