// TODO: Address accessibility issues from insight report

/**
 * Manages focus for accessibility
 * @param {HTMLElement} element - Element to focus
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
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

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Array} items - Array of navigable items
 * @param {number} currentIndex - Current focused index
 */
function handleKeyboardNavigation(event, items, currentIndex) {
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      newIndex = (currentIndex + 1) % items.length;
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      newIndex = (currentIndex - 1 + items.length) % items.length;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = items.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  if (items[newIndex]) {
    manageFocus(items[newIndex]);
  }
  return newIndex;
}

/**
 * Traps focus within a container for modal dialogs
 * @param {HTMLElement} container - Container element
 * @returns {Function} Cleanup function to remove trap
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  manageFocus(firstElement);

  return () => container.removeEventListener('keydown', handleTabKey);
}

/**
 * Validates form fields and announces errors
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} Is form valid
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach(input => {
    const isFieldValid = input.checkValidity();
    if (!isFieldValid) {
      input.setAttribute('aria-invalid', 'true');
      const errorMessage = input.validationMessage;
      announceToScreenReader(errorMessage, 'assertive');
      isValid = false;
    } else {
      input.removeAttribute('aria-invalid');
    }
  });

  return isValid;
}

module.exports = {
  manageFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  trapFocus,
  validateForm
};