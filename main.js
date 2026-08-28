// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

/**
 * Ensures the element has an id attribute, generating one if necessary
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's id
 */
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

/**
 * Adds aria-label to an element if it doesn't have one
 * @param {HTMLElement} element - The element to update
 * @param {string} label - The aria-label to add
 */
function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders dependency graphs for the given data
 * @param {Object} data - The dependency data to render
 * @param {HTMLElement} container - The container element for the graph
 */
function renderDependencyGraphs(data, container) {
  if (!data || !container) {
    throw new Error('Data and container are required');
  }
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  
  container.innerHTML = '';
  container.appendChild(svg);
  
  return svg;
}

// New feature implementation
/**
 * Demonstrates the new feature by preparing an element and rendering a dependency graph.
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} data - The dependency data to render
 * @returns {SVGElement} The rendered SVG element
 */
function newFeature(container, data) {
  // Ensure the element has an id
  ensureElementHasId(container);
  // Add aria-label for accessibility
  addAriaLabel(container, "Dependency Graph");
  // Render the dependency graph
  const svg = renderDependencyGraphs(data, container);
  return svg;
}

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
      if ( navigator.userAgent.toLowerCase().indexOf('safari') !== -1 ) {
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
  },
  // New function to add proper landmark regions
  addProperLandmarkRegions() {
    const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search', 'region'];
    
    // Find elements that should be landmarks based on their structure
    const elements = document.querySelectorAll('div, section, aside, header, footer, nav');
    
    elements.forEach((element, index) => {
      // Skip if already has a landmark role
      if (element.hasAttribute('role') && 
          landmarkRoles.includes(element.getAttribute('role'))) {
        return;
      }
      
      // Check if element should be a landmark based on its position and content
      const tagName = element.tagName.toLowerCase();
      let suggestedRole = null;
      
      // Suggest roles based on tag and position
      if (tagName === 'header' && element.parentElement === document.body) {
        suggestedRole = 'banner';
      } else if (tagName === 'footer' && element.parentElement === document.body) {
        suggestedRole = 'contentinfo';
      } else if (tagName === 'nav' || (tagName === 'div' && element.classList.contains('navigation'))) {
        suggestedRole = 'navigation';
      } else if (tagName === 'main' || (tagName === 'div' && element.classList.contains('main-content'))) {
        suggestedRole = 'main';
      } else if (tagName === 'aside' || (tagName === 'div' && element.classList.contains('sidebar'))) {
        suggestedRole = 'complementary';
      } else if (tagName === 'section' && element.classList.contains('search')) {
        suggestedRole = 'search';
      } else if (tagName === 'form' || (tagName === 'div' && element.classList.contains('form-container'))) {
        suggestedRole = 'form';
      }
      
      if (suggestedRole) {
        // Ensure the element has an ID for accessibility
        ensureElementHasId(element);
        
        // Add the landmark role
        element.setAttribute('role', suggestedRole);
        
        // Add aria-label if it's a duplicate landmark
        const sameRoleElements = document.querySelectorAll(`[role="${suggestedRole}"]`);
        if (sameRoleElements.length > 1) {
          addAriaLabel(element, `${suggestedRole} ${sameRoleElements.length}`);
        }
      }
    });
  },
  // Method to address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    
    // Process different types of accessibility issues
    report.issues.forEach(issue => {
      switch (issue.type) {
        case 'missing-lang':
          // Ensure lang attribute is set on the <html> element for accessibility
          if (!document.documentElement.getAttribute('lang')) {
            document.documentElement.setAttribute('lang', 'en');
          }
          break;
          
        case 'missing-landmarks':
          this.addProperLandmarkRegions();
          break;
          
        case 'missing-alt-text':
          // Ensure images have alt text
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            if (!img.hasAttribute('alt')) {
              img.setAttribute('alt', 'Image');
            }
          });
          break;
          
        case 'color-contrast':
          // This would typically require more complex analysis
          console.warn('Color contrast issue detected, manual review recommended');
          break;
          
        default:
          console.warn(`Unknown accessibility issue type: ${issue.type}`);
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

// Adding the new function at the end
function newFunction() {
  // Your new function code here
  // This function can be extended with specific functionality as needed
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
  a11yStore.addProperLandmarkRegions();
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
  // Keep the existing exports here if any
  newFunction,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  newFeature,
  a11yStore,
  addressAccessibilityIssues
};

// Export for module usage
export { a11yStore };
export { addressAccessibilityIssues };
export { newFunction };
export { ensureElementHasId };
export { addAriaLabel };
export { renderDependencyGraphs };
export { newFeature };
export default a11yStore;

// Import and export additional functions if needed (placeholder for actual modules)
// Assuming 'utils' modules are required (example follows)
// import { utilityFunction } from './utils.js';
// export { utilityFunction };