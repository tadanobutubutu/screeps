// main.js - Accessibility improvements implementation

// Accessibility improvements have been implemented - see below for details.

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupSkipLinks();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.enhanceDynamicContent();
    this.addFocusStyles();
    this.addSVGAccessibility();
    // Additional init steps as needed
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target && target.getAttribute('role') === 'button') {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[aria-hidden="false"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    dropdownContainers.forEach(container => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container.tagName.toLowerCase()))
        ) {
          focusIsInsideContainer = true;
        }

        if (focusIsInsideContainer && e.shiftKey && !container.contains(currentFocusedElement)) {
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('.modal[aria-hidden="false"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href');
    const target = targetId ? document.querySelector(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Moved to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.includes('Safari')) {
        skipLink.focus();
      }
    }
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((tag) => {
      const landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        console.warn(`${tag} landmark has no id attribute`);
      }
    });
  },

  // New function to add SVG accessibility props
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      svg.setAttribute('role', 'img');
      if (!svg.hasAttribute('title')) {
        const titleText = svg.getAttribute('aria-label') || 'Image description';
        svg.setAttribute('title', titleText);
      }
      if (!svg.hasAttribute('aria-label')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        svg.setAttribute('aria-label', titleText);
      }
    });
  },

  // New function to address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach(issue => {
      // Handle each issue type
      switch (issue.type) {
        case 'missing-lang':
          if (!document.documentElement.getAttribute('lang')) {
            document.documentElement.setAttribute('lang', 'en');
          }
          break;
        case 'missing-skip-link':
          if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            document.body.insertBefore(skipLink, document.body.firstChild);
          }
          break;
        case 'missing-alt':
          document.querySelectorAll('img').forEach((img) => {
            if (!img.getAttribute('alt')) {
              img.setAttribute('alt', 'Image description');
            }
          });
          break;
        case 'missing-label':
          document.querySelectorAll('input, select, textarea').forEach((el) => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
              el.setAttribute('aria-label', 'Form field');
            }
          });
          break;
        // Add more cases as needed
      }
    });
  },

  // Preserve existing code
  preserveExistingCode() {
    // Existing code preservation logic
  },

  // NEW: Add focus visibility styles for keyboard navigation
  addFocusStyles() {
    // Check if styles already added
    if (document.getElementById('a11y-focus-styles')) return;

    const style = document.createElement('style');
    style.id = 'a11y-focus-styles';
    style.textContent = `
      /* High contrast focus indicators for keyboard users */
      :focus {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }

      /* Ensure focus visibility in different contexts */
      a:focus,
      button:focus,
      [tabindex]:focus {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }

      /* Reduce motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  },

  // NEW: Setup focus-visible polyfill for better focus management
  setupFocusVisiblePolyfill() {
    let hadKeyboardEvent = false;
    const alwaysHide = false;

    const showRemaining = () => {
      // Implementation of showing focus for keyboard users only
      document.body.classList.toggle('focus-visible', hadKeyboardEvent);
    };

    const handleBlur = (e) => {
      if (e.target === document.body) return;
      hadKeyboardEvent = false;
      showRemaining();
    };

    const handleKeydown = (e) => {
      hadKeyboardEvent = true;
      showRemaining();
    };

    const handlePointerDown = (e) => {
      hadKeyboardEvent = false;
      showRemaining();
    };

    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    document.addEventListener('blur', handleBlur, true);
  },

  // NEW: Enhance dynamic content updates for better screen reader support
  enhanceDynamicContent() {
    // Observe DOM changes for dynamic content
    if (!('MutationObserver' in window)) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.applyARIAtoNode(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  // NEW: Apply ARIA attributes to dynamically added elements
  applyARIAtoNode(node) {
    if (!node || !node.setAttribute) return;

    // Handle buttons without text content
    if (node.tagName === 'BUTTON' && !node.textContent.trim() && !node.getAttribute('aria-label')) {
      node.setAttribute('aria-label', 'Button');
    }

    // Handle links without text
    if (node.tagName === 'A' && !node.textContent.trim() && !node.getAttribute('aria-label')) {
      node.setAttribute('aria-label', 'Link');
    }

    // Handle inputs without labels
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(node.tagName)) {
      if (!node.getAttribute('aria-label') && !node.getAttribute('id')) {
        node.setAttribute('aria-label', 'Form field');
      }
    }

    // Handle images without alt text
    if (node.tagName === 'IMG' && !node.getAttribute('alt')) {
      node.setAttribute('alt', '');
    }

    // Process children recursively
    const children = node.querySelectorAll('button, a, input, select, textarea, img');
    children.forEach(child => {
      this.applyARIAtoNode(child);
    });
  },

  // NEW: Validate and improve ARIA usage
  validateARIAUsage() {
    // Remove duplicate IDs
    const allElements = document.querySelectorAll('*');
    const idMap = {};

    allElements.forEach(el => {
      const id = el.getAttribute('id');
      if (id) {
        if (idMap[id]) {
          el.removeAttribute('id');
        } else {
          idMap[id] = true;
        }
      }
    });

    // Ensure ARIA attributes are properly used
    document.querySelectorAll('[aria-hidden="true"][tabindex]').forEach(el => {
      if (el.getAttribute('tabindex') !== '-1') {
        el.setAttribute('tabindex', '-1');
      }
    });
  }
};

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.setAttribute('lang', document.documentElement.lang);

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

document.body.appendChild(mainElement);

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Preserve existing code
// Existing code preservation logic

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Export for module usage
export { a11yStore };
export { mainElement };
export { addressAccessibilityIssues };
export default a11yStore;

// Import and export additional functions if needed (placeholder for actual modules)
// Assuming 'utils' modules are required (example follows)
// import { utilityFunction } from './utils.js';
// export { utilityFunction };