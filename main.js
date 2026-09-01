(function() {
    'use strict';

    // DOM Elements
    const dependencyGraph = document.getElementById('dependencyGraph');

    // Functions to ensure the element has an id, add aria-label, render dependency graphs
    // (Previously existing code that needs to be preserved)

    // Helper function to validate landmark structure
    function isValidLandmark(landmark) {
        return landmark &&
               typeof landmark.id !== 'undefined' &&
               landmark.id !== null;
    }

    // Helper function to check if a link is accessible
    function checkLinkAccessibility(linkUrl) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
        .then(response => {
          clearTimeout(timeout);
          return response.ok;
        })
        .catch(() => {
          clearTimeout(timeout);
          return false;
        });
    }

    // TODO: This is the existing code that needs to be preserved
    // Address accessibility issues from insight report:
    // Ensure the dependencyGraph container has a proper ARIA role
    // (This comment remains as-is)
    //_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    //<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    //_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    //<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    //_Commit: 5cb26805d1cf9dc1c3c0bd9f2923ab16e34f825e _
    //<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

    // New function to handle keyboard navigation
    function handleKeyboardNavigation() {
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-nav');
        }
      });

      document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
      });
    }

    // New function to wrap primary content in main element for accessibility
    function wrapPrimaryContentInMain(parent) {
      if (!parent || typeof parent.nodeType !== 'number') {
        throw new Error('Invalid parent element');
      }

      // If already a main element, return as-is
      if (parent.tagName?.toLowerCase() === 'main') {
        return parent;
      }

      const mainElement = document.createElement('main');
      mainElement.appendChild(parent);

      return mainElement;
    }

    // New function to add ARIA labels to interactive elements
    function addARIALabels() {
      const interactiveElements = document.querySelectorAll('[role="button"], [role="link"], [role="menuitem"]');
      interactiveElements.forEach(element => {
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          const textContent = element.textContent.trim();
          if (textContent) {
            element.setAttribute('aria-label', textContent);
          }
        }
      });
    }

    // New function to add screen reader announcements
    function addScreenReaderAnnouncements() {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('class', 'sr-only');
      document.body.appendChild(liveRegion);

      if (a11y && a11y.announce) {
        a11y.announce('Accessibility features initialized', 'polite');
      }
    }

    // New function to trap focus in modals
    function trapModalFocus(modal) {
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      modal.addEventListener('keydown', function(e) {
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
      });

      // Focus the first element when modal opens
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    // Initialize all accessibility improvements
    function initialize() {
      addressAccessibilityIssues();
      handleKeyboardNavigation();
      addARIALabels();
      addScreenReaderAnnouncements();
      createInPageButton();

      // Example of trapping focus in a modal
      const modal = document.getElementById('modal');
      if (modal) {
        trapModalFocus(modal);
      }
    }

    // className has been renamed to class
    document.documentElement.className = document.documentElement.class;

    // Initialize on DOM ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }
})();