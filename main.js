// main.js

const _ = require('lodash');
const dependencyGraphContent = require('./dependencyGraphContent');

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addProperLandmarkRegions();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks(); // Added for REACT_036
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

    // Handle Tab key navigation
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
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

    // Also check for .landmark class elements from first version
    const landmarks = document.querySelectorAll('.landmark');
    landmarks.forEach((landmark, index) => {
      if (landmark.hasAttribute('aria-labelledby') && !landmark.querySelector(`#landmark-label-${index}`)) {
        console.warn(`REACT_017: ARIA-labelledby attribute exists without corresponding element for landmark at index ${index}`);
      }
    });
  },

  // New function to add proper landmark regions for accessibility
  addProperLandmarkRegions() {
    // Ensure the main landmark exists
    if (!document.querySelector('main, [role="main"]')) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      main.id = 'main-content';
      document.body.appendChild(main);
    }

    // Ensure banner landmark for header
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }

    // Add navigation landmarks with accessible labels
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', `navigation-${index + 1}`);
      }
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
    });

    // Ensure contentinfo landmark for footer
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    // Ensure complementary landmark for aside
    const aside = document.querySelector('aside');
    if (aside && !aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }

    // Add form landmark to forms missing a label
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
        const label = form.querySelector('legend, label');
        if (!label) {
          form.setAttribute('role', 'form');
          form.setAttribute('aria-label', `form-${index + 1}`);
        }
      }
    });

    // Add search landmark if missing
    const searchRegions = document.querySelectorAll('[role="search"]');
    if (searchRegions.length === 0) {
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput && !searchInput.closest('[role="search"]')) {
        const searchRegion = document.createElement('div');
        searchRegion.setAttribute('role', 'search');
        searchRegion.setAttribute('aria-label', 'search');
        searchInput.parentNode.insertBefore(searchRegion, searchInput);
        searchRegion.appendChild(searchInput);
      }
    }

    // Ensure all landmark regions have accessible names where required
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
    landmarkRoles.forEach((role) => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((el) => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          const tagName = el.tagName.toLowerCase();
          let label = '';
          switch (role) {
            case 'navigation':
              label = 'navigation';
              break;
            case 'complementary':
              label = 'complementary';
              break;
            case 'contentinfo':
              label = 'contentinfo';
              break;
            case 'search':
              label = 'search';
              break;
            case 'form':
              label = 'form';
              break;
            default:
              label = role;
          }
          el.setAttribute('aria-label', label);
        }
      });
    });

    // Ensure only one main landmark
    const mains = document.querySelectorAll('main, [role="main"]');
    if (mains.length > 1) {
      for (let i = 1; i < mains.length; i++) {
        mains[i].remove();
      }
    }

    // Ensure only one banner landmark
    const banners = document.querySelectorAll('[role="banner"], header');
    if (banners.length > 1) {
      for (let i = 1; i < banners.length; i++) {
        banners[i].remove();
      }
    }

    // Ensure only one contentinfo/footer landmark
    const footers = document.querySelectorAll('[role="contentinfo"], footer');
    if (footers.length > 1) {
      for (let i = 1; i < footers.length; i++) {
        footers[i].remove();
      }
    }
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

  // New function to preserve existing code
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

// REACT_015: Add lang attribute to HTML element
// - REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (typeof document !== 'undefined') {
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.lang = 'en';
  }
  document.documentElement.lang = 'en';
}

// Setup ARIA attributes for screen readers
function setupAccessibilityAttributes() {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  
  interactiveElements.forEach(function(element) {
    if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
      console.warn('Interactive element missing accessible label:', element);
    }
  });
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  // Check for aria-label first
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const ids = svgElement.getAttribute('aria-labelledby').split(' ');
    let labels = [];
    ids.forEach(id => {
      const labelElement = document.getElementById(id);
      if (labelElement) {
        labels.push(labelElement.textContent.trim());
      }
    });
    if (labels.length > 0) {
      return labels.join(' ');
    }
  }

  // Check for title element
  const title = svgElement.querySelector('title');
  if (title && title.textContent) return title.textContent.trim();

  // Check for desc element
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }

  // Fallback to text content
  return svgElement.textContent.trim() || '';
}

function setSvgAttributes(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }

  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);

  // Add a default aria-label if none exists
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
}

function setSvgAttributesArray(svgElements) {
  if (!svgElements || !Array.isArray(svgElements)) return;

  svgElements.forEach((svg, index) => {
    if (!svg) return;

    // Get or create a title element for accessibility
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }

    // Set a default accessible name if none exists
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      title.textContent = `SVG ${index + 1}`;
    }

    // Ensure the SVG has proper ARIA attributes
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', `SVG ${index + 1}`);
    }
  });
}

function validateLandmark(landmark) {
  if (!landmark) return false;
  if (!landmark.name || typeof landmark.name !== 'string') return false;
  if (typeof landmark.lat !== 'number' || typeof landmark.lng !== 'number') return false;
  if (landmark.lat < -90 || landmark.lat > 90) return false;
  if (landmark.lng < -180 || landmark.lng > 180) return false;
  return true;
}

// Main module entry point
// This file serves as the main entry for the application
const main = {
  // Store for functions
  functions: {},
  
  // Register a function
  register: function(name, fn) {
    this.functions[name] = fn;
  },
  
  // Get a registered function
  get: function(name) {
    return this.functions[name];
  },
  
  // Execute a registered function
  execute: function(name, ...args) {
    const fn = this.functions[name];
    if (typeof fn === 'function') {
      return fn.apply(this, args);
    }
    throw new Error(`Function ${name} not found`);
  },
  
  // Initialize the application
  init: function() {
    // Add keyboard navigation support
    setupKeyboardNavigation();
    
    // Add ARIA labels where needed
    setupAccessibilityAttributes();
    
    console.log('Application initialized');
  }
};

function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// Landmark Accessibility Functions
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  // Check if a <main> element already exists
  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  // Identify landmark elements that should remain outside of <main>
  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  // Create a new <main> element
  mainElement = document.createElement('main');

  // Move all body children that are not in the exclude list into <main>
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  // Append the <main> element to the body
  document.body.appendChild(mainElement);

  return mainElement;
}

// Initialize the application
function init() {
    // Add keyboard navigation support
    setupKeyboardNavigation();
    
    // Add ARIA labels where needed
    setupAccessibilityAttributes();
    
    console.log('Application initialized');
}

// Initialize accessibility features when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            a11yStore.init();
            init();
        });
    } else {
        a11yStore.init();
        init();
    }
}

// Preserve existing code
a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  // Implementation can be added as needed
}

// Standalone utility function to check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Standalone utility function to check if user prefers high contrast
function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        main: main,
        init: init,
        setupKeyboardNavigation: a11yStore.setupKeyboardNavigation,
        setupAccessibilityAttributes: setupAccessibilityAttributes,
        myNewFunction: myNewFunction,
        getSvgAccessibleName: getSvgAccessibleName,
        setSvgAttributes: setSvgAttributes,
        setSvgAttributesArray: setSvgAttributesArray,
        validateLandmark: validateLandmark,
        ensureElementHasId: ensureElementHasId,
        addAriaLabel: addAriaLabel,
        wrapPrimaryContentInMain: wrapPrimaryContentInMain,
        ensureUniqueLandmarks: a11yStore.addProperLandmarkRegions,
        checkLandmarkElements: a11yStore.checkLandmarkElements,
        a11yStore: a11yStore,
        addressAccessibilityIssues: addressAccessibilityIssues,
        prefersReducedMotion: prefersReducedMotion,
        prefersHighContrast: prefersHighContrast,
        // Include functions from dependencyGraphContent if available
        ...(dependencyGraphContent && typeof dependencyGraphContent === 'object' ? dependencyGraphContent : {})
    };
}