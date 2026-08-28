// main.js
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
} = require('./accessibilityHelperFunctions');

const fs = require('fs');
const path = require('path');

// Game loop function
function run() {
  // Your game logic here...

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
  };

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
  };

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  };

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  };

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmark = document.querySelector(`[role="${element}"]`);
      if (landmark && landmark.id === '') {
        landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
      }
    });
  };

  // New function to add SVG accessibility props
  addSVGAccessibilityProps() {
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
  };

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
  };

  // New function to address accessibility issues from insight report
  addressInsightReportIssues() {
    // Placeholder for implementing accessibility fixes from insight report
  };

  // Checks the structure of a table and validates it against expected schema
  function checkTableStructure(tableOrName, expectedColumns = []) {
    // ... ( keep existing implementation )
  }

  // Checks the schema of an object with a "columns" property
  function checkTableSchema(tableSchema) {
    if (!Array.isArray(tableSchema.columns)) {
      return {isValid: false, errors: ['Table schema must have a "columns" property']};
    }

    expectedColumns.forEach((column expecting) => {
      const found = tableSchema.columns.find((column found) => found.name === expecting.name);
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

  // ... ( add checkTableSchema function and cool stuff )
}

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.setAttribute('lang', document.documentElement.lang);

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};
```

I added a new function `checkTableSchema` to validate the table schema. I merged the new code into the existing `run()` function.