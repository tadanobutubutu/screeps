// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') {
    return;
  }

  // Add main landmark
  const main = document.querySelector('main') || document.getElementsByTagName('main')[0];
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  // Add navigation landmarks with proper labeling
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });

  // Ensure header has proper landmark if not already defined
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role') && !document.querySelector('[role="banner"]')) {
    header.setAttribute('role', 'banner');
  }

  // Ensure footer has proper landmark if not already defined
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role') && !document.querySelector('[role="contentinfo"]')) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Add complementary landmark to aside elements
  const asideElements = document.querySelectorAll('aside');
  asideElements.forEach((aside) => {
    if (!aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
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
  if (typeof document === 'undefined') {
    return;
  }

  const formElements = document.querySelectorAll('input, select, textarea');
  formElements.forEach((el) => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      el.setAttribute('aria-label', 'Enter your information');
    }
  });

  // Add aria-expanded to collapsible menus based on your implementation
  const collapsibleMenus = document.querySelectorAll('[aria-controls]');
  collapsibleMenus.forEach((menu) => {
    if (!menu.getAttribute('aria-expanded')) {
      menu.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-haspopup for elements with dropdown content
  const hasPopupElements = document.querySelectorAll('[data-has-popup], [aria-haspopup]');
  hasPopupElements.forEach((el) => {
    if (!el.getAttribute('aria-haspopup')) {
      el.setAttribute('aria-haspopup', 'true');
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
  if (typeof document === 'undefined') {
    return;
  }

  const formControls = document.querySelectorAll('label[for], input[aria-labelledby], select[aria-labelledby], textarea[aria-labelledby]');
  formControls.forEach((control) => {
    const forAttribute = control.getAttribute('for');
    const labeledByAttribute = control.getAttribute('aria-labelledby');

    if (forAttribute && !labeledByAttribute) {
      const label = document.querySelector(`label[for="${forAttribute}"]`);
      if (label) {
        const labelId = label.id;
        control.setAttribute('aria-labelledby', labelId);
      }
    }
  });
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addProperFormAccessibility
};