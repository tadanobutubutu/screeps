// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Add your code here to replace `my-button` with a concrete button id
 */
function replaceMyButtonId() {
  const buttons = document.querySelectorAll('[id="my-button"], [class="my-button"], [data-testid="my-button"]');
  buttons.forEach((button, index) => {
    if (!button.id || button.id === 'my-button') {
      button.id = `exampleButton${index > 0 ? '-' + index : ''}`;
    }
  });
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Add main landmark if not present
  let main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  // Add navigation landmark if not present
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav) => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
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
  
  // Add aside landmark for sidebars
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside) => {
    if (!aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }
  });
  
  // Add search landmark
  const searchForms = document.querySelectorAll('form[role="search"], form[aria-label="search"], form[aria-label*="search" i]');
  searchForms.forEach((form) => {
    if (!form.getAttribute('role')) {
      form.setAttribute('role', 'search');
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
  // Add aria-expanded to collapsible menus/buttons
  const collapsibleButtons = document.querySelectorAll('button[aria-controls], button[aria-expanded]');
  collapsibleButtons.forEach((button) => {
    if (!button.hasAttribute('aria-expanded')) {
      button.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add aria-controls linking to their target elements
  collapsibleButtons.forEach((button) => {
    const controlsId = button.getAttribute('aria-controls');
    if (controlsId) {
      const controlledElement = document.getElementById(controlsId);
      if (controlledElement && !controlledElement.hasAttribute('aria-labelledby')) {
        const existingId = button.id || `button-${controlsId}`;
        button.id = button.id || existingId;
        controlledElement.setAttribute('aria-labelledby', button.id);
      }
    }
  });
  
  // Add aria-label to form elements that don't have labels
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input) => {
    if (!input.labels || input.labels.length === 0) {
      const placeholder = input.getAttribute('placeholder');
      if (placeholder) {
        input.setAttribute('aria-label', placeholder);
      }
    }
  });
  
  // Add aria-label to buttons without text content
  const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  buttonsWithoutLabels.forEach((button) => {
    if (!button.textContent.trim()) {
      const title = button.getAttribute('title');
      if (title) {
        button.setAttribute('aria-label', title);
      }
    }
  });
  
  // Add proper aria-describedby for form validation messages
  const errorMessages = document.querySelectorAll('[role="alert"], .error, [aria-invalid="true"]');
  errorMessages.forEach((error, index) => {
    const id = error.id || `error-message-${index}`;
    error.id = id;
    
    const associatedInput = error.closest('label')?.getAttribute('for') 
      ? document.getElementById(error.closest('label').getAttribute('for'))
      : error.previousElementSibling;
    
    if (associatedInput && associatedInput.hasAttribute('aria-describedby')) {
      const existingDescribedBy = associatedInput.getAttribute('aria-describedby');
      associatedInput.setAttribute('aria-describedby', `${existingDescribedBy} ${id}`);
    } else if (associatedInput) {
      associatedInput.setAttribute('aria-describedby', id);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addARIAAttributes() {
  // Ensure all form inputs have proper associations
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach((input) => {
    const tagName = input.tagName.toLowerCase();
    const inputType = input.getAttribute('type') || 'text';
    
    // Skip hidden inputs
    if (inputType === 'hidden') return;
    
    // Add required attribute awareness
    if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
    
    // Add disabled state awareness
    if (input.hasAttribute('disabled') && !input.hasAttribute('aria-disabled')) {
      input.setAttribute('aria-disabled', 'true');
    }
    
    // Add read-only state awareness
    if (input.hasAttribute('readonly') && !input.hasAttribute('aria-readonly')) {
      input.setAttribute('aria-readonly', 'true');
    }
  });
  
  // Ensure checkboxes and radio buttons have proper grouping
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    const group = document.querySelector(`[role="group"][aria-label*="checkbox" i] fieldset[legend]`);
    if (!checkbox.hasAttribute('aria-describedby') && group) {
      const legend = group.querySelector('legend');
      if (legend) {
        checkbox.setAttribute('aria-describedby', legend.id || 'checkbox-group');
      }
    }
  });
  
  // Add aria-selected to tab interfaces
  const tabListItems = document.querySelectorAll('[role="tab"]');
  tabListItems.forEach((tab) => {
    if (!tab.hasAttribute('aria-selected')) {
      tab.setAttribute('aria-selected', 'false');
    }
    if (!tab.hasAttribute('tabindex')) {
      tab.setAttribute('tabindex', '-1');
    }
  });
  
  // Ensure progress bars have proper ARIA attributes
  const progressBars = document.querySelectorAll('progress, [role="progressbar"]');
  progressBars.forEach((bar) => {
    if (!bar.hasAttribute('aria-label')) {
      bar.setAttribute('aria-label', 'Progress indicator');
    }
  });
  
  // Add aria-live for dynamic content updates
  const dynamicContent = document.querySelectorAll('.dynamic-content, [data-dynamic]');
  dynamicContent.forEach((content) => {
    if (!content.hasAttribute('aria-live')) {
      content.setAttribute('aria-live', 'polite');
    }
  });
  
  // Ensure sliders have proper ARIA attributes
  const sliders = document.querySelectorAll('input[type="range"], [role="slider"]');
  sliders.forEach((slider) => {
    if (!slider.hasAttribute('aria-valuemin')) {
      slider.setAttribute('aria-valuemin', '0');
    }
    if (!slider.hasAttribute('aria-valuemax')) {
      slider.setAttribute('aria-valuemax', '100');
    }
    if (!slider.hasAttribute('aria-valuenow')) {
      const value = slider.value || '0';
      slider.setAttribute('aria-valuenow', value);
    }
  });
}

/**
 * Function to replace `my-button` with actual button id
 */
function initializeAccessibility() {
  replaceMyButtonId();
  addProperLandmarkRegions();
  addProperAccountManagement();
  addARIAAttributes();
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addARIAAttributes,
  replaceMyButtonId,
  initializeAccessibility
};