// Address accessibility issues from insight report:
// Accessibility-related code changes to improve keyboard navigation,
// screen reader support, and ARIA compliance

(function() {
  'use strict';

  // Accessibility utilities
  const AccessibilityManager = {
    // Store for focus management
    focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    
    // Initialize accessibility features
    init() {
      this.setupKeyboardNavigation();
      this.setupFocusManagement();
      this.setupAriaLiveRegions();
      this.setupSkipLinks();
      this.setupReducedMotion();
    },

    // Setup keyboard navigation
    setupKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        // Handle Escape key to close modals/menus
        if (e.key === 'Escape') {
          this.handleEscapeKey(e);
        }
        
        // Handle Enter/Space for button-like elements
        if ((e.key === 'Enter' || e.key === ' ') && !this.isFormElement(e.target)) {
          this.handleActivation(e);
        }
      });
    },

    // Check if element is a form element
    isFormElement(element) {
      const formElements = ['INPUT', 'TEXTAREA', 'SELECT'];
      return formElements.includes(element.tagName) || element.isContentEditable;
    },

    // Handle escape key
    handleEscapeKey(event) {
      const activeElement = document.activeElement;
      
      // Close any open modals
      const modals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
      modals.forEach(modal => {
        modal.setAttribute('aria-hidden', 'true');
        this.trapFocus(modal, false);
      });

      // Blur current element if needed
      if (activeElement && activeElement.classList.contains('requires-escape')) {
        activeElement.blur();
      }
    },

    // Handle activation for non-button elements
    handleActivation(event) {
      const target = event.target;
      if (target.classList.contains('keyboard-activatable') || 
          target.hasAttribute('data-keyboard-activate')) {
        event.preventDefault();
        target.click();
      }
    },

    // Setup focus management
    setupFocusManagement() {
      // Ensure focus remains visible
      document.addEventListener('mousedown', (e) => {
        const target = e.target;
        if (!target.classList.contains('focus-visible')) {
          target.classList.add('mouse-focus');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
          document.body.classList.remove('mouse-focus');
        }
      });
    },

    // Setup ARIA live regions for dynamic content
    setupAriaLiveRegions() {
      // Create polite live region for announcements
      let liveRegion = document.getElementById('aria-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
        document.body.appendChild(liveRegion);
      }

      // Make available globally
      window.announceToScreenReader = (message, priority = 'polite') => {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = '';
        setTimeout(() => {
          liveRegion.textContent = message;
        }, 100);
      };
    },

    // Setup skip links
    setupSkipLinks() {
      const skipLinks = document.querySelectorAll('.skip-link');
      skipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.tabIndex = -1;
            target.focus();
            target.scrollIntoView();
          }
        });
      });
    },

    // Setup reduced motion preference
    setupReducedMotion() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      const handleReducedMotion = () => {
        if (prefersReducedMotion.matches) {
          document.body.classList.add('reduced-motion');
        } else {
          document.body.classList.remove('reduced-motion');
        }
      };

      handleReducedMotion();
      prefersReducedMotion.addEventListener('change', handleReducedMotion);

      // Expose for other components
      window.prefersReducedMotion = prefersReducedMotion.matches;
    },

    // Trap focus within an element
    trapFocus(element, trap = true) {
      if (!trap) {
        element.removeAttribute('data-focus-trapped');
        return;
      }

      element.setAttribute('data-focus-trapped', 'true');
      const focusableElements = element.querySelectorAll(this.focusableElements);
      
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      element.addEventListener('keydown', handleTabKey);
    }
  };

  // Export for use in other modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AccessibilityManager };
  } else {
    window.AccessibilityManager = AccessibilityManager;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AccessibilityManager.init());
  } else {
    AccessibilityManager.init();
  }
})();