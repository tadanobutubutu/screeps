// Initialize accessibility store
const a11yStore = {
  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks(); // Added for REACT_036
    this.addProperLandmarkRegions(); // Added for proper landmark regions
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
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
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

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
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
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      if ( navigator.userAgent.toLowerCase().indexOf('safari') !== -1 ) {
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
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }
        
        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },
  addSVGAccessibilityProps() {
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
      
      svg.setAttribute('aria-labelledby', titleElement.id);
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },
  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
  },
  addProperLandmarkRegions() {
    // Ensure the document has a proper <main> landmark
    if (!document.querySelector('main, [role="main"]')) {
      const mainEl = document.createElement('main');
      mainEl.setAttribute('id', 'main-content');
      // Move all body children that aren't landmarks into the main element
      const bodyChildren = Array.from(document.body.children);
      bodyChildren.forEach((child) => {
        const role = child.getAttribute('role');
        const tagName = child.tagName.toLowerCase();
        const isLandmark = ['main', 'nav', 'header', 'footer', 'aside'].includes(tagName) ||
          (role && ['main', 'navigation', 'banner', 'contentinfo', 'complementary'].includes(role));
        if (!isLandmark) {
          mainEl.appendChild(child);
        }
      });
      // If mainEl has no children, add a placeholder
      if (mainEl.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.setAttribute('id', 'main-content-placeholder');
        mainEl.appendChild(placeholder);
      }
      document.body.appendChild(mainEl);
    }

    // Ensure <nav> landmarks have proper role
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
      if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });

    // Ensure <header> elements have proper role (only when not already in a sectioning element)
    const headerElements = document.querySelectorAll('header');
    headerElements.forEach((header, index) => {
      const parent = header.parentElement;
      const isInsideArticle = parent && ['article', 'section', 'aside', 'nav', 'main'].includes(parent.tagName.toLowerCase());
      if (!isInsideArticle && !header.hasAttribute('role')) {
        header.setAttribute('role', 'banner');
      }
      if (!header.hasAttribute('aria-label') && !header.hasAttribute('aria-labelledby')) {
        header.setAttribute('aria-label', `Banner ${index + 1}`);
      }
    });

    // Ensure <footer> elements have proper role (only when not already in a sectioning element)
    const footerElements = document.querySelectorAll('footer');
    footerElements.forEach((footer, index) => {
      const parent = footer.parentElement;
      const isInsideArticle = parent && ['article', 'section', 'aside', 'nav', 'main'].includes(parent.tagName.toLowerCase());
      if (!isInsideArticle && !footer.hasAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
      if (!footer.hasAttribute('aria-label') && !footer.hasAttribute('aria-labelledby')) {
        footer.setAttribute('aria-label', `Content info ${index + 1}`);
      }
    });

    // Ensure <aside> elements have proper role
    const asideElements = document.querySelectorAll('aside');
    asideElements.forEach((aside, index) => {
      if (!aside.hasAttribute('role')) {
        aside.setAttribute('role', 'complementary');
      }
      if (!aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
        aside.setAttribute('aria-label', `Complementary ${index + 1}`);
      }
    });

    // Ensure exactly one <h1> exists for proper document structure
    const headings = document.querySelectorAll('h1');
    if (headings.length === 0) {
      const mainContent = document.querySelector('main, [role="main"]');
      if (mainContent) {
        const h1 = document.createElement('h1');
        h1.textContent = document.title || 'Main heading';
        h1.setAttribute('id', 'main-heading');
        mainContent.insertBefore(h1, mainContent.firstChild);
      }
    } else if (headings.length > 1) {
      // Demote additional h1s to h2
      for (let i = 1; i < headings.length; i++) {
        const oldH1 = headings[i];
        const newH2 = document.createElement('h2');
        newH2.textContent = oldH1.textContent;
        // Preserve attributes
        Array.from(oldH1.attributes).forEach((attr) => {
          newH2.setAttribute(attr.name, attr.value);
        });
        oldH1.parentNode.replaceChild(newH2, oldH1);
      }
    }
  },
  addressAccessibilityIssues(report) {
    if (!report) return;

    if (report.langMissing) {
      if (!document.documentElement.getAttribute('lang')) {
        document.documentElement.setAttribute('lang', 'en');
      }
    }

    if (report.landmarkIssues) {
      this.addProperLandmarkRegions();
    }

    if (report.svgIssues) {
      this.addSVGAccessibilityProps();
    }

    if (report.fakeLinks) {
      this.fixFakeLinks();
    }
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
  },
  greet(name) {
    return `Hello, ${name}!`;
  },
  add(a, b) {
    return a + b;
  }
};

// Ensure lang attribute is set on the <html> element for accessibility (REACT_015)
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Preserve existing code
a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Exporting the new added function
module.exports = {
  newFunction: a11yStore,
  greet: a11yStore.greet,
  add: a11yStore.add,
  addressAccessibilityIssues,
  a11yStore,
};

// Export for module usage
export { a11yStore };
export { addressAccessibilityIssues };
export default a11yStore;

// Import and export additional functions if needed (placeholder for actual modules)
// Assuming 'utils' modules are required (example follows)
// import { utilityFunction } from './utils.js';
// export { utilityFunction };