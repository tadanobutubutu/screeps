const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  // Property to count dependencies
  countDependencies(document) {
    const importCommentRegExp = /import\s/g;
    const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
    return importCount.length;
  },

  init() {
    this.checkLandmarkElements();
    this.addSvgAccessibility();
    this.setupSkipLinks();
    this.fixFakeLinks(); // Added for REACT_036
    this.updateThScopeAttributes();
  },

  // Update scope attributes in all .html files in the views directory
  updateThScopeAttributes() {
    const viewsDir = path.join(__dirname, 'views');
    if (!fs.existsSync(viewsDir)) return;
    
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        updateThScopeAttribute(filePath);
      });
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;
    
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  },

  // Utility: Announce message to screen readers
  announce(message, priority = 'polite') {
    this.createLiveRegion();
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Fix Safari focus trapping in dropdowns
  setupDropdownFocusTrapping() {
    const dropdownContainers = document.querySelectorAll('.dropdown, .dropdown-menu, [data-dropdown]');
    dropdownContainers.forEach(container => {
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

  // Manage focus for accessibility
  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('.modal[aria-modal="true"], [role="dialog"]');
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
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.replace('#', '');
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      const isSafari = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
      if (isSafari) {
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

  // Check landmark elements
  checkLandmarkElements() {
    const landmarkElements = LANDMARK_ELEMENTS;
    landmarkElements.forEach(element => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        // Ensure landmark has a unique ID
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }
        
        // Ensure unique accessible name for duplicate landmarks
        if (landmarks.length > 1) {
          const hasAriaLabel = landmark.getAttribute('aria-label');
          if (!hasAriaLabel) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  // Add SVG accessibility props
  addSvgAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
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
      if (!svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-labelledby', titleElement.id);
      }
      
      // Add role img if not present (redundant but safe)
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  // Fix fake links (REACT_036)
  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-disabled', 'true');
    });
  },

  // Address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach(issue => {
      // Handle each issue type
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
        // Add more cases as needed
      }
    });
  },
};

// Standalone function to count dependencies using Document and regex
function countDependencies(document) {
  const importCommentRegExp = /import\s/g;
  const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// New function to handle adding landmark regions
function addLandmarkRegions() {
  // Implementation would iterate through LANDMARK_ELEMENTS and ensure they have proper IDs
  LANDMARK_ELEMENTS.forEach(element => {
    const elements = document.querySelectorAll(element);
    elements.forEach((el, index) => {
      if (!el.id) {
        el.id = `${element}-${index}`;
      }
    });
  });
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      // Your file processing logic here...
      fs.writeFileSync(filePath, content);
    });
}

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// Import accessibility helper functions
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibility');

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.lang = 'en';
document.body.insertBefore(mainElement, document.body.firstChild);

// Initialize accessibility features
a11yStore.init();

// Game-related functions and exports
function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

// TODO: Add the implementation of this function
function updateThScopeAttribute(filePath) {
  // Implementation to update the scope attribute in the .html file
  // This is a placeholder implementation
  console.log(`Updating scope attributes in ${filePath}`);
}

const config = {
  enabled: true
};

// Implement this function for accessibility checks on tables
function accessibilityCheckTables() {
  // Your implementation for accessibility checks on tables goes here
  // For example, you could iterate over all tables and call the existing validation functions
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });
}

module.exports = {
    run,
    main,
    SomeClass,
    someUtility,
    config,
    countDependencies,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    a11yStore,
    mainElement,
    accessibilityCheckTables,
    addLandmarkRegions,
    updateThScopeAttribute
};