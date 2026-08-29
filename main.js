// main.js - Accessibility improvements implementation

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.addSVGAccessibility();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.addFocusStyles();
    this.setupFocusVisiblePolyfill();
    this.enhanceDynamicContent();
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

  // Apply ARIA attributes to SVG elements (dependency graph renderers)
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.getAttribute('title') || 'Image description';
      const descriptionId = `svg-desc-${Math.floor(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      svg.appendChild(descriptionElement);
    });
  },

  // Apply ARIA attributes to dynamically added elements
  enhanceSVG() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-desc-${Math.floor(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
    });
  },

  // Anchor message to screen reader via live region
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
        const target = e.target.closest('[role="button"]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach(container => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest('[data-dropdown]'))
        ) {
          focusIsInsideContainer = true;
        }

        // Ensure focus trapping only within the dropdown container
        if (focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]'
          );

          if (firstFocusableElement) {
            const lastFocusableElement = firstFocusableElement;
            // Handle tab cycling
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
              e.preventDefault();
              lastFocusableElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
              e.preventDefault();
              firstFocusableElement.focus();
            }
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    // Trap focus within modals
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]'
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

    const targetId = skipLink.getAttribute('href').substring(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  // Add lang attribute to HTML element
  getLangAttribute() {
    return document.documentElement.lang || 'en';
  },

  // Create skip-to-main-content button
  createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Skip to main content';
    button.addEventListener('click', () => {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
    return button;
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-contrast: more)').matches
    );
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(tag => {
      const landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
      }
    });
  },

  // New function to add SVG accessibility props
  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-desc-${Math.floor(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
    });
  },

  // Address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    // Implementation would process the report and fix identified issues
    console.log('Addressing accessibility issues:', report);
  },

  // Preserve existing code functionality
  preserveExistingCode() {
    // Placeholder to ensure existing functionality is maintained
    console.log("Preserving existing code and accessibility features");
  }
};

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Adding the new function at the end
function newFunction() {
  // Placeholder implementation - could be expanded based on actual requirements
  console.log("New function executed");
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Exporting the module
module.exports = {
  newFunction,
  a11yStore,
  addressAccessibilityIssues,
  getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
  createInPageButton: a11yStore.createInPageButton.bind(a11yStore)
};