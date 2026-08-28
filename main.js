const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

// Address accessibility issue 038 from HEAD
export const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  if (!element || !accessibilityInfo) {
    return false;
  }

  const { issueType, severity, elementType } = accessibilityInfo;

  if (elementType === "button" || elementType === "link") {
    if (element.setAttribute) {
      const currentTabIndex = element.getAttribute("tabindex");
      if (currentTabIndex === null || currentTabIndex === undefined) {
        element.setAttribute("tabindex", "0");
      }
    }
  }

  if (element.setAttribute && (issueType === "dynamicContent" || severity === "critical")) {
    const existingAriaLive = element.getAttribute("aria-live");
    if (!existingAriaLive) {
      element.setAttribute("aria-live", "polite");
    }
  }

  if (element.setAttribute && !element.getAttribute("role")) {
    const role = accessibilityInfo.role || getDefaultRoleForElement(elementType);
    if (role) {
      element.setAttribute("role", role);
    }
  }

  console.log(`Accessibility issue 038 addressed for ${element.tagName || element}:`, accessibilityInfo);
  return true;
};

function getDefaultRoleForElement(elementType) {
  const roleMap = {
    "button": "button",
    "link": "link",
    "navigation": "navigation",
    "header": "banner",
    "footer": "contentinfo",
    "main": "main",
    "aside": "complementary",
    "article": "article",
    "section": "region"
  };
  return roleMap[elementType] || null;
}

// Create in-page button function from origin/main
function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  document.body.appendChild(button);
  return button;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  countDependencies,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    // Update scope attributes in all .html files in the views directory
    const viewsDir = path.join(__dirname, 'views');
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        updateThScopeAttribute(filePath);
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

    // Create live region for screen reader announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.padding = '0';
    this.liveRegion.style.margin = '-1px';
    this.liveRegion.style.overflow = 'hidden';
    this.liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    this.liveRegion.style.whiteSpace = 'nowrap';
    this.liveRegion.style.border = '0';
    document.body.appendChild(this.liveRegion);
  },

  setupKeyboardNavigation() {
    // Keyboard navigation setup
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

      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
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

  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
  },

  checkLandmarkElements() {
    const landmarkElements = LANDMARK_ELEMENTS;
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

  preserveExistingCode() {
    // Preserve existing code comments and markers
  },

  addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach(issue => {
      switch (issue.type) {
        case 'missing-lang':
          if (!document.documentElement.lang) {
            document.documentElement.lang = 'en';
          }
          break;
        case 'missing-skip-link':
          if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            document.body.prepend(skipLink);
          }
          break;
        case 'missing-alt':
          document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('alt')) {
              img.setAttribute('alt', 'Image description');
            }
          });
          break;
        case 'missing-label':
          document.querySelectorAll('input, select, textarea').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
              el.setAttribute('aria-label', 'Form field');
            }
          });
          break;
      }
    });
  },

  addressInsightReportIssues() {
    // Placeholder for implementing accessibility fixes from insight report
  }
};

// Metadata from HEAD
export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps"
};

// Main code block merging both branches
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

a11yStore.preserveExistingCode();

function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

function checkTableStructure(tableOrName, expectedColumns = []) {
  // Existing implementation
}

function checkTableSchema(tableSchema) {
  if (!Array.isArray(tableSchema.columns)) {
    return {isValid: false, errors: ['Table schema must have a "columns" property']};
  }

  expectedColumns.forEach((expecting) => {
    const found = tableSchema.columns.find((found) => found.name === expecting.name);
    if (!found) {
      return {isValid: false, errors: [`Missing expected column: ${expecting.name}`]};
    }

    const errors = [];
    if (expecting.type && found.type !== expecting.type) {
      errors.push(`Expected column ${found.name} to be a ${expecting.type}, but it is a ${found.type}`);
    }

    if (expecting.unique && found.unique !== expecting.unique) {
      errors.push(`Expected column ${found.name} to be ${expecting.unique ? 'unique' : 'not unique'}, but it is ${found.unique}`);
    }

    if (errors.length > 0) {
      return {isValid: false, errors};
    }
  });

  return {isValid: true};
}

function addLandmarkRegions() {
  LANDMARK_ELEMENTS.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (element) {
      if (!element.id) {
        element.id = `landmark-${landmark}-${Date.now()}`;
      }
    }
  });
}

function checkLandmarkElements(htmlContent) {
  // Existing function implementation
}

// Run game logic
function run() {
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

  // Checks the structure of a table and validates it against expected schema
  function checkTableStructure(tableOrName, expectedColumns = []) {
    // ... ( keep existing implementation )
  }

  // Checks the schema of an object with a "columns" property
  function checkTableSchema(tableSchema) {
    if (!Array.isArray(tableSchema.columns)) {
      return {isValid: false, errors: ['Table schema must have a "columns" property']};
    }

    // ... ( add checkTableSchema function and cool stuff )

    expectedColumns.forEach((expecting) => {
      const found = tableSchema.columns.find((found) => found.name === expecting.name);
      if (!found) {
        return {isValid: false, errors: [`Missing expected column: ${expecting.name}`]};
      }

      const errors = [];
      if (expecting.type && found.type !== expecting.type) {
        errors.push(`Expected column ${found.name} to be a ${expecting.type}, but it is a ${found.type}`);
      }

      if (expecting.unique && found.unique !== expecting.unique) {
        errors.push(`Expected column ${found.name} to be ${expecting.unique ? 'unique' : 'not unique'}, but it is ${found.unique}`);
      }

      if (errors.length > 0) {
        return {isValid: false, errors};
      }
    });

    return {isValid: true};
  }

  // Exporting the new added function
  module.exports = {
    newFunction,
    a11yStore,
    checkLandmarkElements,
    addLandmarkRegions,
    addressAccessibilityIssues,
    countDependencies,
    createInPageButton,
  };

  // Export for module usage
  export { a11yStore };
  export { addressAccessibilityIssues };
  export { createInPageButton };
  export default a11yStore;

  // Import and export additional functions if needed (placeholder for actual modules)
  // Assuming 'utils' modules are required (example follows)
  // import { utilityFunction } from './utils.js';
  // export { utilityFunction };

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      updateThScopeAttribute(filePath);
    });

  // Wrap the entire document content inside a <main> element and set its lang attribute
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  // REACT_015: Ensure the <html> element has a lang attribute for accessibility
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  // Start the game loop
  setInterval(run, 1000);
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

// Export functions and objects
export { addressAccessibilityIssue038 };
export { metadata };
export { a11yStore };
export { addressAccessibilityIssues };
export { createInPageButton };
export { checkLandmarkElements };
export { addLandmarkRegions };
export { countDependencies };
export { checkTableSchema };
export { checkTableStructure };

// Default export
export default a11yStore;