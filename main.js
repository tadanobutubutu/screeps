// TODO: Address accessibility issues from insight report:

// Common accessibility improvements for JavaScript applications

/**
 * Manages focus for modal dialogs to ensure keyboard accessibility
 * @param {HTMLElement} modalElement - The modal element to trap focus within
 * @returns {Function} Cleanup function to remove focus trap
 */
function trapFocus(modalElement) {
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  modalElement.addEventListener('keydown', handleTabKey);
  if (firstFocusable) firstFocusable.focus();

  return function removeFocusTrap() {
    modalElement.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Announces content changes to screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - 'polite' or 'assertive'
 */
function announceToScreenReader(message, politeness = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Handles keyboard navigation for custom dropdowns and menus
 * @param {HTMLElement} container - The menu container element
 * @param {Object} options - Configuration options
 */
function handleMenuKeyboardNavigation(container, options = {}) {
  const { selector = '[role="menuitem"]', wrap = true } = options;
  const menuItems = Array.from(container.querySelectorAll(selector));

  function getNextItem(currentIndex, direction) {
    let nextIndex = currentIndex + direction;
    if (wrap) {
      if (nextIndex < 0) nextIndex = menuItems.length - 1;
      if (nextIndex >= menuItems.length) nextIndex = 0;
    } else {
      nextIndex = Math.max(0, Math.min(menuItems.length - 1, nextIndex));
    }
    return nextIndex;
  }

  container.addEventListener('keydown', (e) => {
    const currentIndex = menuItems.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        menuItems[getNextItem(currentIndex, 1)].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        menuItems[getNextItem(currentIndex, -1)].focus();
        break;
      case 'Home':
        e.preventDefault();
        menuItems[0].focus();
        break;
      case 'End':
        e.preventDefault();
        menuItems[menuItems.length - 1].focus();
        break;
    }
  });
}

/**
 * Validates form inputs and announces errors to screen readers
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Whether the form is valid
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('[aria-describedby]');
  let isValid = true;

  inputs.forEach(input => {
    const errorId = input.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);
    
    if (!input.validity.valid) {
      isValid = false;
      input.setAttribute('aria-invalid', 'true');
      if (errorElement) {
        errorElement.removeAttribute('hidden');
        announceToScreenReader(input.validationMessage, 'assertive');
      }
    } else {
      input.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.setAttribute('hidden', '');
      }
    }
  });

  return isValid;
}

/**
 * Handles skip link functionality
 */
function initSkipLinks() {
  const skipLinks = document.querySelectorAll('[href^="#"]');
  skipLinks.forEach(link => {
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
      });
    }
  });
}

module.exports = {
  trapFocus,
  announceToScreenReader,
  handleMenuKeyboardNavigation,
  validateForm,
  initSkipLinks
};