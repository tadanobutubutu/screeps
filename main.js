// TODO: This is the existing code that needs to be preserved

// REACT_015: Add lang attribute
// Set the document's language attribute for accessibility
document.documentElement.lang = 'en';

// REACT_025: Add other accessibility changes as per the insight report
// Focus management for accessibility
const focusableElements = 'button, [href], input, select, textarea, ...';

// Function to handle focus trapping (useful for modals/dialogs)
function trapFocus(element) {
  const focusableContent = element.querySelectorAll(focusableElements);
  const firstFocusable = focusableContent[0];
  const lastFocusable = focusableContent[focusableContent.length - 1];

  element.addEventListener('keydown', function (e) {
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

// Function to manage skip link functionality
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

// Accessibility announcement for screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Initialize accessibility features
function initAccessibility() {
  initSkipLink();
  
  // Ensure all interactive elements have proper ARIA attributes
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Unlabeled button');
    }
  });
}

// New function or change requested in the issue
export function newExportedFunction() {
  // Implementation of the new function
}

// Function to count dependencies
// Counts dependencies from various input formats: package.json dependencies object, array of dependencies, or a single count
function countDependencies(deps) {
  if (!deps) {
    return 0;
  }
  
  if (typeof deps === 'number') {
    return deps;
  }
  
  if (Array.isArray(deps)) {
    return deps.length;
  }
  
  if (typeof deps === 'object') {
    return Object.keys(deps).length;
  }
  
  return 0;
}

// Export accessibility utilities for use elsewhere
export { trapFocus, initSkipLink, announceToScreenReader, initAccessibility };