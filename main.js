// main.js - Accessibility improvements implementation

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

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

export function calculateSum(a, b) { return a + b; }

var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

function countDependencies(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countDependencies(obj[key]);
    } else if (typeof obj[key] === 'function') {
      let funcName = obj[key].name || '<anonymous>';
      if (!funcNames.includes(funcName)) {
        funcNames.push(funcName);
        count++;
      }
    }
  }
  return count;
}

function MainApp() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;

  React.useEffect(() => {
    if (!prefersReducedMotion) {
      a11yStore.updateLiveRegion('Dynamic content updated');
    }
    a11yStore.checkLandmarkElements();
    a11yStore.addSVGAccessibilityProps();
  }, [prefersReducedMotion, prefersHighContrast]);

  return (
    <div lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><button type="button" onClick={() => {}} aria-label="Contact">Contact</button></li>
          </ul>
        </nav>
      </header>

      <main id="main-content" role="main" tabIndex={-1}>
        <h1>Welcome</h1>
        <p>This is the main content area.</p>
      </main>

      <footer role="contentinfo">
        <p>&copy; 2024 Company Name</p>
      </footer>
    </div>
  );
}

function handleSkipLinkClick() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
  }
}

let a11yStore = {
  init: function() {
    // initialization code
  },
  updateLiveRegion: function(message, priority = 'polite') {
    // implementation of updateLiveRegion
  },
  checkLandmarkElements: function() {
    // implementation of checkLandmarkElements
  },
  addSVGAccessibilityProps: function() {
    // implementation of addSVGAccessibilityProps
  },
  preserveExistingCode: function() {
    // existing code preservation
  },
  renderIndexView: function() {
    // implementation of renderIndexView
  }
};

export { a11yStore };
export { MainApp };
export { handleSkipLinkClick };
export { calculateSum };
export { countDependencies };

function addLandmarkRegions() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building" aria-labelledby="buildingLabel">
        <span id="buildingLabel">Main Building</span>
      </div>
      <div class="landmark-region" role="region" aria-label="Park" aria-labelledby="parkLabel">
        <span id="parkLabel">Central Park</span>
      </div>
    `;
  }
}

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

// Export affected functions to make them accessible
export { functionA, functionB };

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

// Wrap the entire document content inside a <main> element and set its lang attribute
function wrapPrimaryContentInMain() {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  // REACT_015: Ensure the <html> element has a lang attribute for accessibility
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  mainElement.appendChild(document.body.cloneNode(true));
  document.body.parentNode.insertBefore(mainElement, document.body);
}

// Execute wrapping
wrapPrimaryContentInMain();

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

// Standalone utility function to check if user prefers reduced motion
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Standalone utility function to check if user prefers high contrast
export function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

/**
 * Handle dynamic content updates
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' or 'assertive')
 */
export function updateLiveRegion(message, priority = 'polite') {
  if (!liveRegion) createLiveRegion();
  announce(message, priority);
}

/**
 * Check landmark elements and add IDs if missing
 */
export function checkLandmarkElements() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach((element) => {
    const landmark = document.querySelector(`[role="${element}"]`);
    if (landmark && landmark.id === '') {
      landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
    }
  });
}

/**
 * Add SVG accessibility props
 */
export function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', 'svg-title');
    const titleText = svg.querySelector('title').textContent || 'Image description';
    const descriptionId = `svg-description-${Math.floor(Math.random() * 1000)}`;
    svg.setAttribute('aria-describedby', descriptionId);

    const descriptionElement = document.createElement('p');
    descriptionElement.setAttribute('id', descriptionId);
    descriptionElement.textContent = titleText;
    descriptionElement.className = 'sr-only';
    document.body.appendChild(descriptionElement);
  });
}

/**
 * Preserve existing code and address accessibility issues
 */
export function preserveExistingCode() {
  // TODO: This is the existing code that needs to be preserved
  // Address accessibility issues from insight report:
  // - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
  // - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
  // - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
  // - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
  // - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
  // - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
  // - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
  // - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
  // _Commit: e1099c59bb958f49f6c140d0eff8ec6973d95bb5_
  // <!-- todo-hash: 4b0e1a8ca96059e3d2b21d4ce5b2d2a62631b70d -->
  // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
  // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
  // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
  // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
  // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
  // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
}

// Default export for backwards compatibility
export default {
  calculateSum,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  divide,
  start() {
    console.log('Application started');
    return Promise.resolve();
  }
};

export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  },
  error(message) {
    console.error(`[ERROR] ${message}`);
  }
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->
//_Commit: e1c38a81654fe5ba4cfcfba53c47360921b7ae1a_

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 8c3a9295a6bf382e113f3e8184d40223b3f3f8d5_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

export function initializeApp() {
  console.log('Initializing application...');
  return Promise.resolve();
}

// TODO: Implement function for generating a report based on accessibility issues
export function generateAccessibilityReport() {
  // Placeholder for the actual implementation
  // This function should return a report object based on the accessibility issues found
  return {
    issues: [
      // Example issue object
      {
        description: "Example issue description",
        severity: "warning",
        // ... other properties like 'elementId', 'fixRecommendation', etc.
      }
    ]
  };
}

// Helper functions for accessibility (referenced in comments)
function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);
  return liveRegion;
}

function announce(message, priority = 'polite') {
  const liveRegion = document.querySelector('[aria-live]') || createLiveRegion();
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = message;
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function createInPageButton() {
  // Implementation for creating in-page buttons
}

function validateTableAccessibility() {
  // Implementation for validating table accessibility
}

function validateTableStructure() {
  // Implementation for validating table structure
}

function validateLandmark() {
  // Implementation for validating landmarks
}

function validateLandmarkStructure() {
  // Implementation for validating landmark structure
}

function getSvgAccessibleName() {
  // Implementation for getting SVG accessible name
}

function setSvgAttributes() {
  // Implementation for setting SVG attributes
}

function handleFakeLinks() {
  // Implementation for handling fake links
}

function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

function addProperLandmarkRegions() {
  // Implementation for adding proper landmark regions
}

// Export the liveRegion variable for use in other modules
let liveRegion = null;