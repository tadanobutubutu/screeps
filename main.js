// TODO: Address accessibility issues from insight report:
// ... existing comment block

/**
 * Main application entry point
 * Addresses accessibility improvements based on insight report
 */

// Store for accessibility preferences
const accessibilityPrefs = {
  reduceMotion: false,
  highContrast: false,
  largeText: false
};

// Initialize accessibility preferences from user settings
function initAccessibility() {
  // Check for reduced motion preference
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  accessibilityPrefs.reduceMotion = motionQuery.matches;
  
  // Listen for changes to reduced motion preference
  motionQuery.addEventListener('change', (e) => {
    accessibilityPrefs.reduceMotion = e.matches;
    handleMotionPreferenceChange(e.matches);
  });
  
  // Initialize high contrast mode
  const contrastToggle = document.getElementById('contrast-toggle');
  if (contrastToggle) {
    contrastToggle.addEventListener('click', toggleHighContrast);
    contrastToggle.setAttribute('aria-pressed', 'false');
  }
  
  // Initialize large text mode
  const textToggle = document.getElementById('text-toggle');
  if (textToggle) {
    textToggle.addEventListener('click', toggleLargeText);
    textToggle.setAttribute('aria-pressed', 'false');
  }
}

// Toggle high contrast mode with proper ARIA attributes
function toggleHighContrast() {
  accessibilityPrefs.highContrast = !accessibilityPrefs.highContrast;
  document.body.classList.toggle('high-contrast', accessibilityPrefs.highContrast);
  
  const toggle = document.getElementById('contrast-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(accessibilityPrefs.highContrast));
  }
  
  announceToScreenReader(
    accessibilityPrefs.highContrast 
      ? 'High contrast mode enabled' 
      : 'High contrast mode disabled'
  );
}

// Toggle large text mode with proper ARIA attributes
function toggleLargeText() {
  accessibilityPrefs.largeText = !accessibilityPrefs.largeText;
  document.body.classList.toggle('large-text', accessibilityPrefs.largeText);
  
  const toggle = document.getElementById('text-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(accessibilityPrefs.largeText));
  }
  
  announceToScreenReader(
    accessibilityPrefs.largeText 
      ? 'Large text mode enabled' 
      : 'Large text mode disabled'
  );
}

// Handle reduced motion preference changes
function handleMotionPreferenceChange(reduceMotion) {
  if (reduceMotion) {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
}

// Announce changes to screen readers using live regions
function announceToScreenReader(message) {
  let announcer = document.getElementById('aria-live-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'aria-live-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only'; // Screen reader only class
    document.body.appendChild(announcer);
  }
  
  // Clear and set message with small delay to ensure announcement
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Make focus trap for modals and dialogs
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
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
    
    // Close on Escape key
    if (e.key === 'Escape') {
      const closeButton = element.querySelector('[data-close-modal]');
      if (closeButton) {
        closeButton.click();
      }
    }
  });
  
  // Focus first element
  if (firstFocusable) {
    firstFocusable.focus();
  }
}

// Handle keyboard navigation for custom components
function handleKeyboardNavigation(container, options = {}) {
  const {
    orientation = 'both', // 'horizontal', 'vertical', or 'both'
    loop = true
  } = options;
  
  container.addEventListener('keydown', (e) => {
    const items = Array.from(container.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])'));
    const currentIndex = items.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex = null;
    
    if (orientation === 'horizontal' || orientation === 'both') {
      if (e.key === 'ArrowRight') {
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length && loop) nextIndex = 0;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0 && loop) nextIndex = items.length - 1;
      }
    }
    
    if (orientation === 'vertical' || orientation === 'both') {
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length && loop) nextIndex = 0;
      } else if (e.key === 'ArrowUp') {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0 && loop) nextIndex = items.length - 1;
      }
    }
    
    if (nextIndex !== null && nextIndex >= 0 && nextIndex < items.length) {
      e.preventDefault();
      items[nextIndex].focus();
    }
  });
}

// Initialize skip link functionality
function initSkipLinks() {
  const skipLinks = document.querySelectorAll('.skip-link');
  
  skipLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        
        // Remove tabindex after focus to prevent ongoing interference
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  });
}

// Main initialization
function init() {
  initAccessibility();
  initSkipLinks();
  
  // Initialize any modal focus trapping
  document.querySelectorAll('[role="dialog"], [role="alertdialog"]').forEach(dialog => {
    trapFocus(dialog);
  });
  
  // Initialize keyboard-navigable menus
  document.querySelectorAll('[role="menu"]').forEach(menu => {
    handleKeyboardNavigation(menu);
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initAccessibility,
    toggleHighContrast,
    toggleLargeText,
    announceToScreenReader,
    trapFocus,
    handleKeyboardNavigation,
    initSkipLinks,
    init,
    accessibilityPrefs
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}