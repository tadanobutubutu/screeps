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
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  // Add navigation landmarks with proper labeling
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
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

  const formElements = document.querySelectorAll('input:not([type="hidden"]), textarea');
  formElements.forEach((el) => {
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      el.setAttribute('aria-label', 'Enter your information');
    }
  });

  // Add aria-expanded to collapsible menus based on your implementation
  const collapsibleMenus = document.querySelectorAll('[data-toggle="collapse"], [aria-controls]');
  collapsibleMenus.forEach((menu) => {
    if (!menu.hasAttribute('aria-expanded')) {
      menu.setAttribute('aria-expanded', 'false');
    }
  });
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement
};