// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add any additional accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds lang attribute to the HTML element for accessibility (REACT_015)
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Adds a skip link for keyboard navigation accessibility (REACT_025)
 */
function addSkipLink() {
  const existingSkipLink = document.querySelector('.skip-link');
  if (existingSkipLink) return;

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  
  const style = document.createElement('style');
  style.textContent = `
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      z-index: 100;
      transition: top 0.3s;
    }
    .skip-link:focus {
      top: 0;
    }
  `;
  
  document.head.appendChild(style);
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Initializes all accessibility features
 */
function initAccessibility() {
  addLangAttribute();
  addSkipLink();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// Export functions
export { addLangAttribute, addSkipLink, initAccessibility };