// TODO: Address accessibility issues from insight report:
// - ... (You can add more functions as needed)

// Accessibility helper functions to address common a11y issues
function setupKeyboardNavigation(container) {
  if (!container) return;
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach((element, index) => {
    element.setAttribute('tabindex', '0');
  });
}

function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only visually-hidden';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    announcer.remove();
  }, 1000);
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

function handleEscapeKey(callback) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      callback();
    }
  });
}

// Export accessibility utilities
module.exports = {
  setupKeyboardNavigation,
  announceToScreenReader,
  trapFocus,
  handleEscapeKey
};