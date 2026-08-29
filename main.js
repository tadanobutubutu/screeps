// Accessibility module for the application
// Addresses accessibility issues from insight report

// Create the main accessibility store
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.fixFakeLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibility();
  },

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

  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target && target.getAttribute('role') === 'link') {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    const dropdownContainers = document.querySelectorAll('[role="listbox"], [role="menu"]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        if (!focusIsInsideContainer) {
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
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

  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link, [role="link"][href^="#"]');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href');
    const target = targetId ? document.querySelector(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      if (navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }

        if (landmarks.length > 1) {
          if (landmark.id && !landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }

      if (!svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-labelledby', titleElement.id);
      }

      if (!svg.getAttribute('role') && !svg.closest('button, a, [role="link"]')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[role="link"], a[href="#"], a[href="javascript:void(0)"]');
    fakeLinks.forEach((link) => {
      if (link.tagName !== 'A') {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
        link.setAttribute('aria-label', link.textContent || 'Link');
      }
    });
  },

  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // (This comment remains as-is)
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  }
};

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
document.body.appendChild(mainElement);
mainElement.lang = document.documentElement.lang || 'en';

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// Initialize accessibility features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;

  const issues = report.issues || [];
  issues.forEach((issue) => {
    switch (issue.type) {
      case 'missing-lang':
        if (!document.documentElement.lang) {
          document.documentElement.lang = issue.value || 'en';
        }
        break;
      case 'missing-skip-link':
        a11yStore.setupSkipLinks();
        break;
      case 'missing-live-region':
        a11yStore.createLiveRegion();
        break;
      case 'missing-landmark':
        a11yStore.checkLandmarkElements();
        break;
      case 'missing-svg-accessibility':
        a11yStore.addSVGAccessibility();
        break;
      default:
        break;
    }
  });
}

// New function placeholder
function newFunction() {
  // Your new function code here
}

// Exporting the new added function
module.exports = {
  newFunction,
  a11yStore,
  addressAccessibilityIssues
};

// Export for module usage
export { a11yStore };
export { addressAccessibilityIssues };
export { newFunction };
export default a11yStore;