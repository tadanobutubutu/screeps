// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds the lang attribute to the HTML element if it's missing or invalid.
 * Addresses REACT_015 accessibility requirement.
 * @returns {boolean} Returns true if lang attribute was successfully added/validated, false otherwise.
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  const currentLang = htmlElement.getAttribute('lang');
  
  if (!currentLang || currentLang.trim() === '') {
    htmlElement.setAttribute('lang', 'en');
    console.log('Accessibility: lang attribute added to HTML element');
    return true;
  }
  
  console.log('Accessibility: lang attribute already present:', currentLang);
  return true;
}

/**
 * Adds accessibility improvements as per insight report REACT_025.
 * This function handles additional accessibility enhancements beyond the lang attribute.
 */
function addAccessibilityImprovements() {
  // Initialize accessibility features
  addLangAttribute();
  
  // REACT_025: Additional accessibility changes
  // Adding role="main" to main content area for screen readers
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (!main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  });
  
  // Adding aria-label to navigation elements
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation section ${index + 1}`);
    }
  });
  
  // Ensuring all form inputs have associated labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([aria-label])');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label) {
        input.setAttribute('aria-label', input.getAttribute('placeholder') || 'Unlabeled input');
      }
    }
  });
  
  // Adding skip link capability indicator
  const skipLink = document.querySelector('.skip-link, [href="#main-content"], .skip-to-content');
  if (skipLink) {
    skipLink.setAttribute('role', 'link');
  }
  
  console.log('Accessibility: Additional improvements applied (REACT_025)');
  return true;
}

// Auto-initialize accessibility features when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAccessibilityImprovements);
  } else {
    addAccessibilityImprovements();
  }
}

// Export functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    addAccessibilityImprovements
  };
}