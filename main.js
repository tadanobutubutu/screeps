// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add any additional accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds the lang attribute to the HTML element for accessibility (REACT_015)
 * @param {string} [lang='en'] - The language code to set
 */
export const addLangAttribute = (lang = 'en') => {
  document.documentElement.lang = lang;
};

/**
 * Applies accessibility improvements to the page (REACT_025)
 * Addresses additional accessibility enhancements from the insight report
 */
export const applyAccessibilityEnhancements = () => {
  // Ensure ARIA landmarks are properly set
  const main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  // Ensure skip link capability (invisible skip link for keyboard users)
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = 'position:absolute;top:-40px;left:0;background:#000;color:#fff;padding:8px;z-index:100;';
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Add ID for main content anchor if not exists
  const mainContent = document.querySelector('main, [role="main"]');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
  }

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('[tabindex="-1"]');
  interactiveElements.forEach(el => {
    el.setAttribute('role', el.getAttribute('role') || 'button');
  });
};

/**
 * Initialize all accessibility features
 */
export const initializeAccessibility = () => {
  addLangAttribute();
  applyAccessibilityEnhancements();
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}