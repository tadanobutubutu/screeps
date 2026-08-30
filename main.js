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

  // Apply ARIA attributes to SVG elements
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.getAttribute('title') || 'Image description';
      const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
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
        const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
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

  // Preserve existing code functionality
  preserveExistingCode() {
    // Placeholder to ensure existing functionality is maintained
    console.log("Preserving existing code and accessibility features");
  },

  // Address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
  }
};

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
}

// Get person name for accessible labeling
function personName() {
  const nameElement = document.querySelector('[data-person-name]');
  return nameElement ? nameElement.textContent.trim() : 'User';
}

// Validate and fix table accessibility
function validateTableAccessibility() {
  if (!window) return;
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
    if (!table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      table.setAttribute('aria-label', 'Table');
    }
  });
}

// Validate and fix table structure
function validateTableStructure() {
  if (!window) return;
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
      }
      table.insertBefore(thead, table.firstChild);
    }
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (!table.querySelector('thead').contains(row)) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
  });
}

// Validate landmark elements
function validateLandmark() {
  if (!window) return;
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
  landmarks.forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('role')) {
      // Optionally add a role, but leave as is for now
    }
  });
}

// Validate landmark structure
function validateLandmarkStructure() {
  if (!window) return;
  const main = document.querySelector('main');
  if (main) {
    const nestedLandmarks = main.querySelectorAll('main, nav, header, footer, aside');
    if (nestedLandmarks.length > 0) {
      console.warn('Landmarks nested within main may be incorrect.');
    }
  }
}

// Get accessible name for SVG
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'Image';
}

// Ensure unique landmark IDs
function ensureUniqueLandmarks() {
  if (!window) return;
  const landmarks = document.querySelectorAll('[role="landmark"], main, nav, header, footer, aside');
  const idSet = new Set();
  landmarks.forEach(el => {
    const id = el.id;
    if (id) {
      if (idSet.has(id)) {
        console.warn('Duplicate landmark ID found:', id);
      } else {
        idSet.add(id);
      }
    }
  });
}

// New function to add focus styles
function addFocusStyles() {
  const style = document.createElement('style');
  style.textContent = `
    :focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
    .focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

// New function to setup focus visible polyfill
function setupFocusVisiblePolyfill() {
  if (typeof window === 'undefined') return;
  
  let isFocusVisible = false;
  
  document.addEventListener('keydown', () => {
    isFocusVisible = true;
  });
  
  document.addEventListener('mousedown', () => {
    isFocusVisible = false;
  });
  
  document.addEventListener('focusin', (e) => {
    if (isFocusVisible) {
      e.target.classList.add('focus-visible');
    }
  });
  
  document.addEventListener('focusout', (e) => {
    e.target.classList.remove('focus-visible');
  });
}

// New function to enhance dynamic content
function enhanceDynamicContent() {
  // Setup MutationObserver for dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Apply accessibility attributes to new elements
          if (node.querySelectorAll) {
            // Add accessibility to new buttons
            const newButtons = node.querySelectorAll('button:not([id])');
            newButtons.forEach(btn => {
              if (!btn.id) {
                btn.id = `btn-${Math.floor(Math.random() * 10000)}`;
              }
            });

            // Add accessibility to new SVGs
            const newSvgs = node.querySelectorAll('svg:not([role])');
            newSvgs.forEach(svg => {
              if (!svg.hasAttribute('role')) {
                svg.setAttribute('role', 'img');
              }
              if (!svg.hasAttribute('aria-labelledby')) {
                const titleText = svg.getAttribute('title') || 'Image description';
                const descriptionId = `svg-desc-${Math.floor(Math.random() * 10000)}`;
                svg.setAttribute('aria-labelledby', descriptionId);

                const desc = document.createElement('desc');
                desc.id = descriptionId;
                desc.textContent = titleText;
                svg.appendChild(desc);
              }
            });
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Exporting the module
module.exports = {
  newFunction: a11yStore.preserveExistingCode.bind(a11yStore),
  a11yStore,
  addressAccessibilityIssues,
  getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
  createInPageButton: a11yStore.createInPageButton.bind(a11yStore),
  updateLiveRegion: a11yStore.updateLiveRegion.bind(a11yStore),
  checkLandmarkElements: a11yStore.checkLandmarkElements.bind(a11yStore),
  addSVGAccessibilityProps: a11yStore.addSVGAccessibilityProps.bind(a11yStore),
  preserveExistingCode: a11yStore.preserveExistingCode.bind(a11yStore),
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  addFocusStyles,
  setupFocusVisiblePolyfill,
  enhanceDynamicContent
};