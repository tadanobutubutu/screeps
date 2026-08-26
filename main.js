// Address accessibility issues from insight report
(function() {
  'use strict';

  // Store references to DOM elements for better performance and accessibility
  const elements = {
    main: document.querySelector('main'),
    nav: document.querySelector('nav'),
    skipLink: document.getElementById('skip-to-content')
  };

  // Accessibility: Announce page load to screen readers
  function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('role', 'status');
    announcement.className = 'sr-only visually-hidden';
    announcement.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  // Accessibility: Handle keyboard navigation for custom interactive elements
  function handleKeyboardNavigation(element, options = {}) {
    const { onEnter, onSpace, onEscape, onArrowUp, onArrowDown } = options;
    
    element.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Enter':
          if (onEnter) onEnter(event);
          break;
        case ' ':
          if (onSpace) {
            event.preventDefault();
            onSpace(event);
          }
          break;
        case 'Escape':
          if (onEscape) onEscape(event);
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp(event);
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown(event);
          }
          break;
      }
    });
  }

  // Accessibility: Trap focus within a modal or dialog
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleTab(event) {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTab);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleTab);
    };
  }

  // Accessibility: Manage focus when opening/closing modals
  let previousActiveElement = null;

  function saveFocus() {
    previousActiveElement = document.activeElement;
  }

  function restoreFocus() {
    if (previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus();
    }
  }

  // Accessibility: Skip link functionality
  function initSkipLink() {
    if (elements.skipLink) {
      elements.skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.getElementById(elements.skipLink.getAttribute('href').slice(1));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
          target.removeAttribute('tabindex');
        }
      });
    }
  }

  // Accessibility: Enhance button behavior
  function enhanceButtons() {
    document.querySelectorAll('button').forEach(button => {
      // Ensure buttons have accessible names
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        console.warn('Button missing accessible name:', button);
      }
    });
  }

  // Accessibility: Form field enhancements
  function enhanceForms() {
    document.querySelectorAll('input, select, textarea').forEach(field => {
      // Associate labels with fields
      const id = field.id || field.name;
      if (id && !field.getAttribute('aria-labelledby') && !field.getAttribute('aria-label')) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
          console.warn('Form field missing associated label:', field);
        }
      }

      // Provide error announcements
      field.addEventListener('invalid', (event) => {
        event.preventDefault();
        const errorMessage = field.validationMessage;
        field.setAttribute('aria-invalid', 'true');
        announceToScreenReader(`Error: ${errorMessage}`, 'assertive');
      });

      field.addEventListener('blur', () => {
        if (field.getAttribute('aria-invalid') === 'true' && field.validity.valid) {
          field.setAttribute('aria-invalid', 'false');
        }
      });
    });
  }

  // Accessibility: Image alt text validation
  function validateImages() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('alt')) {
        console.warn('Image missing alt attribute:', img);
      }
    });
  }

  // Accessibility: Reduce motion preference
  function handleReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduced-motion');
    }
    
    mediaQuery.addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    });
  }

  // Initialize accessibility features
  function init() {
    initSkipLink();
    enhanceButtons();
    enhanceForms();
    validateImages();
    handleReducedMotion();
    announceToScreenReader('Page loaded successfully');
  }

  // Public API exports
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      announceToScreenReader,
      handleKeyboardNavigation,
      trapFocus,
      saveFocus,
      restoreFocus,
      initSkipLink,
      enhanceButtons,
      enhanceForms,
      validateImages,
      handleReducedMotion,
      init
    };
  } else {
    window.main = {
      announceToScreenReader,
      handleKeyboardNavigation,
      trapFocus,
      saveFocus,
      restoreFocus,
      initSkipLink,
      enhanceButtons,
      enhanceForms,
      validateImages,
      handleReducedMotion,
      init
    };
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();