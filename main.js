// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// main.js - Accessibility improvements implementation

// Function to announce page updates for screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Focus management for modal dialogs
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Handle keyboard navigation for custom components
function setupKeyboardNavigation(selector, options = {}) {
  const items = document.querySelectorAll(selector);
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    item.addEventListener('keydown', (e) => {
      let newIndex;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        newIndex = (index + 1) % items.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        newIndex = (index - 1 + items.length) % items.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = items.length - 1;
      }
      if (newIndex !== undefined) {
        items[newIndex].focus();
        items[newIndex].click();
        e.preventDefault();
      }
    });
  });
}

// Reduce motion preference check
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Skip link functionality
function initSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.tabIndex = -1;
        target.focus();
        e.preventDefault();
      }
    });
  }
}

// New function: setLangAttribute
const setLangAttribute = (element, lang) => {
  if (!element || typeof lang !== 'string') {
    return false;
  }

  // Validate lang attribute format (BCP 47 compliance)
  const validLangPattern = /^[a-z]{2,3}(-[A-Z]{2})?$/;
  if (!validLangPattern.test(lang)) {
    return false;
  }

  element.setAttribute('lang', lang);
  return true;
};

// New function: checkAccessibilityAttributes
const checkAccessibilityAttributes = (element) => {
  const attributes = {};

  if (!element) {
    return attributes;
  }

  attributes.lang = element.getAttribute('lang');
  attributes.role = element.getAttribute('role');
  attributes.ariaLabel = element.getAttribute('aria-label');
  attributes.ariaDescribedby = element.getAttribute('aria-describedby');
  attributes.ariaHidden = element.getAttribute('aria-hidden');
  attributes.tabIndex = element.getAttribute('tabindex');

  return attributes;
};

// New function: ensureAccessibility
const ensureAccessibility = (element, options = {}) => {
  if (!element) {
    return false;
  }

  let success = true;

  if (options.lang) {
    success = setLangAttribute(element, options.lang) && success;
  }

  if (options.role) {
    element.setAttribute('role', options.role);
  }

  if (options.ariaLabel) {
    element.setAttribute('aria-label', options.ariaLabel);
  }

  return success;
};

// New function: ensureDependencyGraphARIA
function ensureDependencyGraphARIA() {
  const graph = document.querySelector('[data-dependency-graph]') || document.querySelector('.dependency-graph');
  if (graph) {
    if (!graph.hasAttribute('aria-label')) {
      graph.setAttribute('aria-label', 'Dependency graph');
    }
  }
}

module.exports = {
  announceToScreenReader,
  trapFocus,
  setupKeyboardNavigation,
  prefersReducedMotion,
  initSkipLinks,
  setLangAttribute,
  checkAccessibilityAttributes,
  ensureAccessibility,
  ensureDependencyGraphARIA
};