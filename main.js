// TODO: Address accessibility issues from insight report:

// Screen reader announcement utility for accessibility
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('role', 'status');
  announcement.className = 'sr-only';
  announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.textContent = message;
  }, 50);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus management utility for accessibility
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
  
  firstFocusable?.focus();
}

// Handle escape key for modal/dialog closing
function handleEscapeKey(callback) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && e.keyCode === 27) {
      callback();
    }
  });
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Safe focus management
function setFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

// Initialize accessibility features
function initAccessibility() {
  // Skip to main content link handling
  const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        e.preventDefault();
        setFocus(target);
        target.scrollIntoView();
      }
    });
  }
  
  // Handle reduced motion preferences
  if (prefersReducedMotion()) {
    document.body.classList.add('reduced-motion');
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    announceToScreenReader,
    trapFocus,
    handleEscapeKey,
    prefersReducedMotion,
    setFocus,
    initAccessibility
  };
}