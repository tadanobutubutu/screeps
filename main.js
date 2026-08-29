// TODO: This is the existing code that needs to be preserved
/**
 * Accessibility improvement functions for main.js
 * Addressing issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix table structure issues
 * - REACT_017: Add/fix landmark issues
 * - REACT_041: Add accessible names to SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix fake link issue
 */

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

/**
 * Adds lang attribute to HTML element
 * @param {string} htmlString - HTML content
 * @param {string} langCode - Language code (e.g., 'en', 'es', 'fr')
 * @returns {string} HTML string with lang attribute
 */
function addLangAttribute(htmlString, langCode = 'en') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const htmlElement = doc.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', langCode);
  }

  return doc.documentElement.outerHTML;
}

/**
 * Fixes table structure issues
 * @param {string} htmlString - HTML content with tables
 * @returns {string} HTML with fixed table structures
 */
function fixTableStructureIssues(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure with thead and tbody
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    const rows = table.querySelector('tr');

    if (!hasThead && rows) {
      const thead = doc.createElement('thead');
      const tbody = doc.createElement('tbody');

      // Move first row to thead
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        firstRow.remove();
      }

      // Move remaining rows to tbody
      const remainingRows = table.querySelectorAll('tr');
      remainingRows.forEach(row => {
        tbody.appendChild(row.cloneNode(true));
        row.remove();
      });

      table.insertBefore(thead, table.firstChild);
      table.appendChild(tbody);
    }
  });

  return doc.documentElement.outerHTML;
}

/**
 * Adds main landmark to the document
 * @param {string} htmlString - HTML content
 * @returns {string} HTML with main landmark added
 */
function addMainLandmark(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Check if main element already exists
  let mainElement = doc.querySelector('main');

  if (!mainElement) {
    mainElement = doc.createElement('main');
    mainElement.setAttribute('id', 'main-content');

    // Try to find a suitable location for the main element
    const body = doc.querySelector('body');
    if (body) {
      // Find the first meaningful content and wrap it or insert main before it
      const firstContent = body.firstElementChild;
      if (firstContent) {
        body.insertBefore(mainElement, firstContent);
      } else {
        body.appendChild(mainElement);
      }
    }
  }

  // Add skip link for accessibility
  const existingSkipLink = doc.querySelector('.skip-link, [href="#main-content"]');
  if (!existingSkipLink) {
    const skipLink = doc.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';

    const body = doc.querySelector('body');
    if (body) {
      body.insertBefore(skipLink, body.firstChild);
    }
  }

  return doc.documentElement.outerHTML;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} htmlString - HTML content with SVGs
 * @returns {string} HTML with accessible SVG names
 */
function addSvgAccessibleNames(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const svgs = doc.querySelectorAll('svg');
  let svgCount = 0;

  svgs.forEach(svg => {
    // Check if SVG already has an accessible name
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      const title = doc.createElement('title');
      title.textContent = `SVG icon ${svgCount + 1}`;
      title.id = `svg-title-${svgCount + 1}`;

      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgCount++;
  });

  return doc.documentElement.outerHTML;
}

/**
 * Ensures unique landmarks in the document
 * @param {string} htmlString - HTML content
 * @returns {string} HTML with unique landmarks
 */
function ensureUniqueLandmarks(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Ensure only one main landmark
  const mainElements = doc.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first main element, convert others to divs
    for (let i = 1; i < mainElements.length; i++) {
      const newDiv = doc.createElement('div');
      newDiv.setAttribute('role', 'main');
      mainElements[i].parentNode.replaceChild(newDiv, mainElements[i]);
    }
  }

  // Add unique labels to repeated landmarks
  const landmarks = ['header', 'nav', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      let count = 0;
      elements.forEach(el => {
        if (!el.getAttribute('aria-label') && !el.id) {
          el.setAttribute('aria-label', `${landmark}-${count + 1}`);
        }
        count++;
      });
    }
  });

  return doc.documentElement.outerHTML;
}

/**
 * Fixes fake link issues (links that don't navigate properly)
 * @param {string} htmlString - HTML content
 * @returns {string} HTML with fixed fake links
 */
function fixFakeLinkIssue(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Find links that use onclick or javascript: but should be proper links
  const links = doc.querySelectorAll('a[href^="javascript:"], a[onclick]');

  links.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const href = link.getAttribute('href');

    // If it's a fake link (no valid href), convert to button or add proper href
    if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
      const onclickAttr = link.getAttribute('onclick');

      // If it has onclick functionality, convert to button
      if (onclickAttr && !href.startsWith('javascript:')) {
        const button = doc.createElement('button');
        button.setAttribute('type', 'button');

        // Copy all attributes
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            button.setAttribute(attr.name, attr.value);
          }
        });

        // Copy inner content
        button.innerHTML = link.innerHTML;

        link.parentNode.replaceChild(button, link);
      }
    }
  });

  return doc.documentElement.outerHTML;
}

/**
 * Main function to apply all accessibility fixes
 * @param {string} htmlString - Original HTML content
 * @param {Object} options - Configuration options
 * @returns {string} HTML with all accessibility fixes applied
 */
function applyAccessibilityFixes(htmlString, options = {}) {
  const defaultOptions = {
    langCode: 'en',
    fixTables: true,
    addMain: true,
    fixSvgs: true,
    uniqueLandmarks: true,
    fixFakeLinks: true
  };

  const config = { ...defaultOptions, ...options };
  let result = htmlString;

  if (config.langCode) {
    result = addLangAttribute(result, config.langCode);
  }

  if (config.fixTables) {
    result = fixTableStructureIssues(result);
  }

  if (config.addMain) {
    result = addMainLandmark(result);
  }

  if (config.fixSvgs) {
    result = addSvgAccessibleNames(result);
  }

  if (config.uniqueLandmarks) {
    result = ensureUniqueLandmarks(result);
  }

  if (config.fixFakeLinks) {
    result = fixFakeLinkIssue(result);
  }

  return result;
}

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Count dependencies in the project
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
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

// Export all functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    newFunction,
    a11yStore,
    addressAccessibilityIssues,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    applyAccessibilityFixes,
    countDependencies,
    getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
    createInPageButton: a11yStore.createInPageButton.bind(a11yStore)
  };
}