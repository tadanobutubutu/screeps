// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report

// Commit: 844fc13bec582ca855ba235218ad7292e418fe1e
// todo-hash: a90ed3c19aa18afabc1c249f08fad416574a9875

/**
 * Adds the lang attribute to the HTML element for accessibility
 * Addresses REACT_015
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
export function addLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Manages focus for accessibility improvements
 * Addresses REACT_025
 * Moves focus to the main content area when a page loads
 */
export function manageFocus() {
  const mainContent = document.querySelector('main') || document.querySelector('#main') || document.querySelector('[role="main"]');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  }
}

/**
 * Sets ARIA attributes for accessibility
 * Addresses REACT_025
 * @param {Object} options - Configuration options for ARIA attributes
 */
export function setAriaAttributes(options = {}) {
  const { skipLinkId = 'main-content', mainId = 'main' } = options;
  
  // Add skip link if not present
  let skipLink = document.querySelector(`#${skipLinkId}`);
  if (!skipLink) {
    skipLink = document.createElement('a');
    skipLink.id = skipLinkId;
    skipLink.href = `#${mainId}`;
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // Ensure main element has proper role
  const mainElement = document.querySelector(`#${mainId}`) || document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
}

/**
 * Sets up keyboard navigation enhancements for accessibility
 * Addresses REACT_025
 * @param {Object} options - Configuration options for keyboard navigation
 */
export function setupKeyboardNavigation(options = {}) {
  const { trapFocusInModals = true } = options;
  
  // Handle Escape key to close modals/dropdowns
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Emit custom event for components to listen to
      const escapeEvent = new CustomEvent('accessibility:escape-pressed', {
        bubbles: true,
        detail: { event }
      });
      document.dispatchEvent(escapeEvent);
    }
  });
  
  // Ensure interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  interactiveElements.forEach((element) => {
    if (!element.getAttribute('role') && !element.hasAttribute('aria-label')) {
      // Ensure elements with icons have aria-label
      const hasIconChild = element.querySelector('svg, .icon, [aria-hidden="true"]');
      if (hasIconChild && !element.textContent.trim()) {
        console.warn(`Accessibility: Element ${element.tagName} may need an aria-label`);
      }
    }
  });
}

/**
 * Initializes all accessibility improvements
 */
export function initializeAccessibility() {
  addLangAttribute();
  setAriaAttributes();
  setupKeyboardNavigation();
  manageFocus();
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}