// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Check if the user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply accessibility attributes to interactive elements
 */
function applyAccessibilityAttributes() {
  const interactiveElements = document.querySelectorAll('a, input, select, textarea');
  
  interactiveElements.forEach(element => {
    if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
      console.warn('Interactive element missing accessible label:', element);
    }
  });
}

/**
 * Handle keyboard navigation focus management
 */
function handleKeyboardNavigation() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

/**
 * Announce dynamic content changes to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Ensure a main landmark exists in the document for accessibility
 * Wraps the primary content in a <main> element if one doesn't exist
 * @returns {HTMLElement|null} The main element or null if already exists
 */
function ensureMainLandmark() {
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    
    // Find the first table or significant content element to wrap
    const contentElement = document.querySelector('table, .container, #table-rotated, article, section');
    
    if (contentElement && contentElement.parentNode) {
      contentElement.parentNode.insertBefore(mainElement, contentElement);
      mainElement.appendChild(contentElement);
      console.info('Accessibility: Created <main> landmark and wrapped primary content');
    } else if (document.body) {
      // Fallback: wrap all direct body children except header, nav, footer
      const elementsToWrap = Array.from(document.body.children).filter(el => {
        const tagName = el.tagName.toLowerCase();
        return !['header', 'nav', 'footer', 'aside'].includes(tagName) && 
               !el.classList.contains('sr-only');
      });
      
      elementsToWrap.forEach(el => mainElement.appendChild(el));
      document.body.insertBefore(mainElement, document.body.firstChild);
      console.info('Accessibility: Created <main> landmark and wrapped main content');
    }
  }
  
  return mainElement;
}

/**
 * Validate that required landmarks exist on the page
 * @returns {Object} Object containing validation results
 */
function validateLandmarks() {
  const results = {
    hasMain: !!document.querySelector('main'),
    hasHeader: !!document.querySelector('header'),
    hasNav: !!document.querySelector('nav'),
    hasFooter: !!document.querySelector('footer'),
    isValid: false
  };
  
  results.isValid = results.hasMain;
  
  if (!results.hasMain) {
    console.warn('Accessibility: Page is missing <main> landmark. Use ensureMainLandmark() to create one.');
  }
  
  return results;
}

module.exports = {
  prefersReducedMotion,
  applyAccessibilityAttributes,
  handleKeyboardNavigation,
  announceToScreenReader,
  ensureMainLandmark,
  validateLandmarks
};