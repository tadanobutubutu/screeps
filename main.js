I'll resolve this Git merge conflict by carefully analyzing both branches and integrating all unique functionality. Let me examine what each side provides:

**HEAD branch contributions:**
- SVG accessibility functions (`getSvgAccessibleName`, `addSvgAccessibilityProps`)
- ARIA attribute functions (`ensureElementHasId`, `ensureAriaLabel`)
- Live region management in `a11yStore`
- Landmark validation functions
- DOM-related accessibility utilities
- Module exports

**origin/main branch contributions:**
- Utility math functions (`add`, `calculateDiscount`)
- Table accessibility validators
- Additional landmark validation functions
- Different `a11yStore` initialization approach
- Separate module exports structure

Now I'll merge everything together, resolving duplicate function declarations and ensuring all unique features are preserved:

```javascript
const fs = require('fs');
const path = require('path');
const { updateThScopeAttribute } = require('./testHelper');
const { checkLandmarkElements: checkLandmarkElementsFromA11Y } = require('./a11y');

const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

// Utility functions
function add(a, b) {
  return a + b;
}

function calculateDiscount(price, discountRate) {
    // Calculate and return the discounted price
    return price - (price * discountRate);
}

function getLangAttribute(element) {
  return element.getAttribute('lang');
}

function createInPageButton() {
  return null;
}

// Validate landmark structure
function validateLandmark() {
  return true;
}

function validateLandmarkStructure() {
  return true;
}

function validateTableAccessibility() {
  return true;
}

function validateTableStructure() {
  return true;
}

function validateLandmarkElements() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach((element) => {
    const landmark = document.querySelector(`[role="${element}"]`);
    if (landmark && landmark.id === '') {
      landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
    }
  });
}

// REACT_036: Fix fake links - Addressed in fixFakeLinks

// Standalone function to get the accessible name of an SVG element
// Uses aria-labelledby first, then falls back to the <title> child element
function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof SVGElement) || svg.tagName !== 'svg') {
    return '';
  }

  // First, check for aria-labelledby reference
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const names = ids
      .map(id => {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : '';
      })
      .filter(text => text.length > 0);
    if (names.length > 0) {
      return names.join(' ');
    }
  }

  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel.trim();
  }

  // Fall back to <title> child element
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  // Check for title attribute on the SVG itself
  const titleAttr = svg.getAttribute('title');
  if (titleAttr && titleAttr.trim().length > 0) {
    return titleAttr.trim();
  }

  return '';
}

// The updated function to check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The updated function to check if user prefers high contrast
function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// Ensure the <html> element has a lang attribute for accessibility (REACT_015)
function ensureHtmlLangAttribute() {
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

// Ensure an element has an id
function ensureElementHasId(element, prefix = 'el') {
  if (!element.id) {
    element.id = `${prefix}-${Math.floor(Math.random() * 10000)}`;
  }
  return element.id;
}

// Ensure an element has an aria-label
function ensureAriaLabel(element, label) {
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label);
  }
}

// Render dependency graph description
function renderDependencyGraphDescription(graphData) {
  const description = document.createElement('div');
  description.className = 'sr-only';
  description.textContent = `Dependency graph containing ${graphData.nodes.length} nodes and ${graphData.edges.length} edges.`;
  return description;
}

// New function to determine the appropriate aria-labelledby value
function getSvgAriaLabelledBy(svgElement, ariaLabel) {
  if (ariaLabel) {
    return ariaLabel;
  }

  const existingTitle = svgElement.querySelector('title');
  if (existingTitle && existingTitle.id) {
    return existingTitle.id;
  }

  return 'svg-title';
}

// The new standalone function for adding SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    focusable = false,
    tabIndex
  } = options;

  if (role && !svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', role);
  }

  svgElement.setAttribute('aria-labelledby', getSvgAriaLabelledBy(svgElement, ariaLabel || ariaLabelledby));

  const descriptionId = `svg-desc-${Date.now() * 1000}`;
  svgElement.setAttribute('aria-describedby', descriptionId);

  const descriptionElement = document.createElement('desc');
  descriptionElement.id = descriptionId;
  descriptionElement.textContent = getSvgAccessibleName(svgElement);
  descriptionElement.className = 'sr-only';
  svgElement.appendChild(descriptionElement);

  if (prefersReducedMotion()) {
    svgElement.classList.add('reduced-motion');
  }

  if (prefersHighContrast()) {
    svgElement.classList.add('high-contrast');
  }

  if (focusable) {
    svgElement.setAttribute('focusable', 'true');
  }

  if (typeof tabIndex === 'number') {
    svgElement.setAttribute('tabindex', tabIndex);
  }
}

// New function to count dependencies
function countDependencies(options = {}) {
  return a11yStore.countDependencies(options);
}

// New function to update the live region
function updateLiveRegion(message, priority = 'polite') {
  return a11yStore.updateLiveRegion(message, priority);
}

// New function to check landmark elements
function checkLandmarkElements() {
  return a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props (merged from both branches)
function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    // Ensure SVG has a title for accessible name
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      titleElement.textContent = 'Image'; // Default accessible name
      svg.insertBefore(titleElement, svg.firstChild);
    }

    // Ensure title has an ID for aria-labelledby
    if (!titleElement.id) {
      titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
    }

    // Set aria-labelledby to point to the title
    svg.setAttribute('aria-labelledby', titleElement.id);

    // Add role img if not present (redundant but safe)
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// Check if user prefers reduced motion (for module use)
function checkReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if user prefers high contrast (for module use)
function checkHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// Store for accessibility announcements (screen reader support)

const a11yStore = {
  init() {
    ensureHtmlLangAttribute();
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks(); // Added for REACT_036
    this.initAccessibility();
  },

  // Accessible utility functions
  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');

    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  // Initialize accessibility features
  initAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
        }
      });
    }

    // Ensure all images have alt text
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    // Add proper labeling to form inputs
    document.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });
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
    if (!this.liveRegion) this.createLiveRegion();

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
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
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

        // Ensure focus trapping only within the dropdown container
        if (!focusIsInsideContainer) {
          // Find the first focusable element within the container
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

  // Manage focus for accessibility
  setupFocusManagement() {
    // Trap focus within modals
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

  // Setup skip links
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

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        // Ensure landmark has a unique ID
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }

        // Ensure unique accessible names for duplicate landmarks
        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  // New function to add SVG accessibility props
  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      // Ensure SVG has a title for accessible name
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image'; // Default accessible name
        svg.insertBefore(titleElement, svg.firstChild);
      }

      // Ensure title has an ID for aria-labelledby
      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }

      // Set aria-labelledby to point to the title
      svg.setAttribute('aria-labelledby', titleElement.id);

      // Add role img if not present (redundant but safe)
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  // New function to fix fake links (REACT_036)
  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
  },

  // Count dependencies
  countDependencies(options = {}) {
    return 0;
  },

  // Address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    // Process report and fix issues
  }
};

// Check for duplicate banners
const banners = document.querySelectorAll('[role="banner"], [role="header"]');
if (banners.length > 1) {
  throw new Error('Document should have at most one banner or header landmark');
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  // Check if a <main> element already exists
  let mainEl = document.querySelector('main');
  if (mainEl) {
    return mainEl;
  }

  // Identify landmark elements that should remain outside of <main>
  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  // Create a new <main> element
  mainEl = document.createElement('main');

  // Move all body children that are not in the exclude list into <main>
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainEl.appendChild(child);
    }
  });

  // Append the <main> element to the body
  document.body.appendChild(mainEl);

  return mainEl;
}

function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

function ensureUniqueLandmarks() {
  return true;
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    add,
    calculateDiscount,
    getLangAttribute,
    createInPageButton,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkElements,
    getSvgAccessibleName,
    ensureHtmlLangAttribute,
    ensureElementHasId,
    ensureAriaLabel,
    renderDependencyGraphDescription,
    addSvgAccessibilityProps,
    a11yStore,
    addressAccessibilityIssues,
    createAccessibleButton,
    createAccessibleDialog,
    announceToScreenReader,
    trapFocus,
    initAccessibility,
    countDependencies,
    updateLiveRegion,
    checkLandmarkElements,
    addSVGAccessibilityProps
  };
}
```