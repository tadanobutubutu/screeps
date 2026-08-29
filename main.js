// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Add your code here to replace `my-button` with a concrete button id
 */
function replaceMyButtonId() {
  const button = document.querySelector('[data-testid="my-button"]') || document.getElementById('my-button');
  if (button) {
    button.id = 'exampleButton';
  }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  const existingMain = document.querySelector('main');
  const existingNav = document.querySelector('nav');
  const existingHeader = document.querySelector('header');
  const existingFooter = document.querySelector('footer');
  
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.insertBefore(main, document.body.firstChild);
  }
  
  if (!existingNav) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main navigation');
    document.body.insertBefore(nav, document.body.firstChild);
  }
  
  if (!existingHeader) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.insertBefore(header, document.body.firstChild);
  }
  
  if (!existingFooter) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
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
  const collapsibleMenus = document.querySelectorAll('[data-toggle="collapse"], [aria-expanded]');
  collapsibleMenus.forEach(menu => {
    if (!menu.hasAttribute('aria-expanded')) {
      menu.setAttribute('aria-expanded', 'false');
    }
  });
  
  const formControls = document.querySelectorAll('input:not([aria-label]), select:not([aria-label]), textarea:not([aria-label])');
  formControls.forEach(control => {
    const label = document.querySelector(`label[for="${control.id}"]`);
    if (label && !control.hasAttribute('aria-label')) {
      control.setAttribute('aria-label', label.textContent);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addFormControlAriaAttributes() {
  const formControls = document.querySelectorAll('input, select, textarea, button');
  
  formControls.forEach(control => {
    if (!control.id && !control.getAttribute('aria-label')) {
      const name = control.getAttribute('name');
      const placeholder = control.getAttribute('placeholder');
      
      if (name) {
        control.setAttribute('aria-label', name);
      } else if (placeholder) {
        control.setAttribute('aria-label', placeholder);
      }
    }
    
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
    
    if (control.disabled && !control.getAttribute('aria-disabled')) {
      control.setAttribute('aria-disabled', 'true');
    }
  });
  
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
      const legend = form.querySelector('legend');
      if (legend) {
        form.setAttribute('aria-labelledby', legend.id || 'form-legend');
      }
    }
  });
}

/**
 * Function to replace `my-button` with actual button id
 */
function initializeButton() {
  replaceMyButtonId();
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addFormControlAriaAttributes,
  replaceMyButtonId,
  initializeButton
};