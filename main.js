// TODO: Address accessibility issues from insight report — CONTINUING
// Add new functions (no existing functions should be removed or renamed)

// New accessibility utility functions

/**
 * Adds ARIA attributes to improve accessibility for dynamic content
 * @param {HTMLElement} element - The element to enhance
 * @param {Object} options - ARIA options
 */
function setAriaAttributes(element, options = {}) {
  if (!element || !element.setAttribute) return;
  
  Object.keys(options).forEach(key => {
    element.setAttribute(`aria-${key}`, options[key]);
  });
}

/**
 * Creates an accessible modal dialog
 * @param {string} title - Title for the modal
 * @param {string} content - Content for the modal
 * @returns {HTMLElement} The modal element
 */
function createAccessibleModal(title, content) {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');
  modal.setAttribute('aria-describedby', 'modal-content');
  modal.classList.add('accessible-modal');
  
  const titleElement = document.createElement('h2');
  titleElement.id = 'modal-title';
  titleElement.textContent = title;
  
  const contentElement = document.createElement('div');
  contentElement.id = 'modal-content';
  contentElement.innerHTML = content;
  
  modal.appendChild(titleElement);
  modal.appendChild(contentElement);
  
  return modal;
}

/**
 * Enhances form inputs with accessibility features
 * @param {HTMLFormElement} form - The form to enhance
 */
function enhanceFormAccessibility(form) {
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`);
    if (label && input.id) {
      input.setAttribute('aria-describedby', `${input.id}-description`);
    }
    
    // Add aria-invalid for validation states
    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Provides keyboard navigation support for focusable elements
 * @param {HTMLElement} container - Container element with focusable items
 */
function setupKeyboardNavigation(container) {
  if (!container) return;
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  container.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
}

/**
 * Adds skip link for keyboard users
 * @returns {HTMLElement} Skip link element
 */
function createSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.classList.add('skip-link');
  skipLink.setAttribute('aria-label', 'Skip to main content');
  
  // Make it visible when focused
  skipLink.addEventListener('focus', () => {
    skipLink.style.transform = 'translateY(0)';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.transform = 'translateY(-100%)';
  });
  
  return skipLink;
}

/**
 * Validates color contrast ratio for accessibility compliance
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @returns {number} Contrast ratio
 */
function calculateContrastRatio(foreground, background) {
  const getLuminance = (color) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(foreground) + 0.05;
  const l2 = getLuminance(background) + 0.05;
  return Math.max(l1, l2) / Math.min(l1, l2);
}

/**
 * Ensures images have appropriate alt text
 * @param {HTMLImageElement} image - Image element to validate
 * @returns {boolean} Whether image has valid alt text
 */
function validateImageAlt(image) {
  if (!image || image.tagName !== 'IMG') return false;
  
  const alt = image.getAttribute('alt');
  return alt !== null && alt !== undefined;
}

/**
 * Initializes accessibility features when DOM is loaded
 */
function initAccessibilityFeatures() {
  // Add skip link to body
  const skipLink = createSkipLink();
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Enhance form accessibility
  const forms = document.querySelectorAll('form');
  forms.forEach(form => enhanceFormAccessibility(form));
  
  // Setup keyboard navigation for components
  const components = document.querySelectorAll('.keyboard-navigable');
  components.forEach(comp => setupKeyboardNavigation(comp));
  
  // Validate images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!validateImageAlt(img)) {
      console.warn('Image missing alt text:', img);
    }
  });
}

// Initialize accessibility features when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibilityFeatures);
} else {
  initAccessibilityFeatures();
}

// Export functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setAriaAttributes,
    createAccessibleModal,
    enhanceFormAccessibility,
    setupKeyboardNavigation,
    createSkipLink,
    calculateContrastRatio,
    validateImageAlt,
    initAccessibilityFeatures
  };
}