// main.js
// TODO: Address accessibility issues from insight report
// TODO-hash: 4960bda783623b568ecb422d6e6eb9ceac6573ea

/**
 * Main application module addressing accessibility requirements
 */

export function initializeApp() {
  // Initialize application with accessibility features
  setupKeyboardNavigation();
  setupFocusManagement();
  announceToScreenReader('Application loaded');
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (event) => {
    // Handle Escape key to close modals/dropdowns
    if (event.key === 'Escape') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.getAttribute('aria-expanded') === 'true') {
        activeElement.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function setupFocusManagement() {
  // Ensure focus is visible for keyboard users
  document.addEventListener('mousedown', () => {
    document.body.classList.add('using-mouse');
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('using-mouse');
    }
  });
}

export function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

export function createAccessibleButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}