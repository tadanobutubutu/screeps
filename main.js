// main.js - Accessibility improvements implementation

// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

// Existing code preserved below

// Add focus visible styles for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Improve skip link functionality
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

// Announce dynamic content changes to screen readers
function announceToScreenReader(message) {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    document.body.appendChild(announcer);
  }
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Ensure all interactive elements have proper ARIA attributes
function enhanceAriaLabels() {
  const buttons = document.querySelectorAll('button:not([aria-label])');
  buttons.forEach((button) => {
    if (!button.textContent.trim()) {
      button.setAttribute('aria-label', 'Button');
    }
  });

  const images = document.querySelectorAll('img:not([alt])');
  images.forEach((img) => {
    img.setAttribute('alt', '');
  });
}

// Trap focus within modal dialogs
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
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

// Initialize accessibility features on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initSkipLink();
  enhanceAriaLabels();
});

// Exports
export {
  announceToScreenReader,
  enhanceAriaLabels,
  trapFocus,
  initSkipLink
};