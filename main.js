// Main entry point for the application

/**
 * Generates the HTML content with proper landmark elements
 * @param {Object} options - Configuration options
 * @returns {string} Generated HTML string
 */
function generatePageContent(options = {}) {
    const { title = 'Quality & Metrics Reports', content = '' } = options;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header>
        <nav>...</nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>...</footer>
</body>
</html>
    `.trim();
}

/**
 * Wraps content in a main landmark element
 * @param {string} content - The content to wrap
 * @returns {string} Content wrapped in main tags
 */
function wrapInMainLandmark(content) {
    return `<main>\n        ${content}\n    </main>`;
}

/**
 * Updates HTML files to include proper landmark elements
 * @param {string} htmlContent - The HTML content to update
 * @returns {string} Updated HTML content with main landmark
 */
function updateHTMLWithLandmarks(htmlContent) {
    // Check if main landmark already exists
    if (htmlContent.includes('<main>')) {
        return htmlContent;
    }
    
    // Find body content and wrap it in main
    const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        const bodyContent = bodyMatch[1].trim();
        const wrappedContent = wrapInMainLandmark(bodyContent);
        return htmlContent.replace(
            /<body>[\s\S]*?<\/body>/i,
            `<body>\n        ${wrappedContent}\n    </body>`
        );
    }
    
    return htmlContent;
}

const affectedFunctions = {};

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
  // Create a new button element
  const button = document.createElement('button');

  // Set the button's ID, text content, and class
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;

  // Append the button to the body or a specific container
  document.body.appendChild(button);

  // Return the created button for further manipulation if needed
  return button;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  // Existing code

  // New property to count dependencies
  countDependencies() {
    // New implementation to count dependencies using Document and regex
    const importCommentRegExp = /^\s*import\s+({|[\w\s,]*)*\s*;?\s*\s*$/gm;
    const importCount = (document.body.textContent || '').match(importCommentRegExp)?.length || 0;
    return importCount;
  },

  init() {
    // ... existing init code ...
    this.setupSkipLinks();
    // ... other initialization ...
    this.fixFakeLinks(); // Added for REACT_036
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.liveRegion);

    // Update scope attributes in all .html files in the views directory
    const viewsDir = path.join(__dirname, 'views');
    if (fs.existsSync(viewsDir)) {
      fs.readdirSync(viewsDir)
        .filter(file => file.endsWith('.html'))
        .forEach(file => {
          const filePath = path.join(viewsDir, file);
          let content = fs.readFileSync(filePath, 'utf8');
          content = updateThScopeAttribute(content);
          fs.writeFileSync(filePath, content);
        });
    }

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('.dropdown');
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

        // Ensure focus trapping only within the dropdown container
        if (focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            if (e.shiftKey) {
              // Shift+Tab on first element moves to last
              if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
              }
            } else {
              // Tab on last element moves to first
              const lastFocusableElement = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              )[container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              ).length - 1];
              
              if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
              }
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

      const modal = document.querySelector('.modal[style*="display: block"]');
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

    const targetId = skipLink.getAttribute('href').replace('#', '');
    const target = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      });

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.indexOf('Safari') !== -1) {
        window.addEventListener('load', () => {
          skipLink.focus();
        });
      }
    }
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-high-contrast: more)').matches;
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) {
      this.createLiveRegion();
    }
    if (this.liveRegion) {
      this.announce(message, priority);
    }
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

        // Ensure unique accessible names for duplicate landmarks
        if (landmarks.length > 1) {
          if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  // Add SVG accessibility props
  addSVGAccessibility() {
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
        titleElement.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Set aria-labelledby to point to the title
      svg.setAttribute('aria-labelledby', titleElement.id);

      // Add role img if not present (redundant but safe)
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  // Fix fake links (REACT_036)
  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"], a[role="link"]:not([href])');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'link');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
    });
  },

  // Preserve existing code
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
            document.body.insertBefore(skipLink, document.body.firstChild);
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

  // Address accessibility issues from insight report (placeholder)
  addressInsightReportIssues() {
    // Placeholder for implementing accessibility fixes from insight report
  },

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    // Placeholder for keyboard navigation setup
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) {
      this.createLiveRegion();
    }
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;
    }
  },
};

// ... rest of your main.js code ...

  // New implementation to count dependencies using Document and regex
  const importCommentRegExp = /^\s*import\s+({|[\w\s,]*)*\s*;?\s*\s*$/gm;
  const importCount = (document.body.textContent || '').match(importCommentRegExp)?.length || 0;
  return importCount;
}

// New function to handle adding landmark regions
function addLandmarkRegions() {
  // Implementation would iterate through LANDMARK_ELEMENTS and ensure they have proper IDs
  LANDMARK_ELEMENTS.forEach(elementType => {
    const element = document.querySelector(elementType);
    if (element) {
      if (!element.id) {
        element.id = `${elementType}-region`;
      }
    }
  });
}

// New function to check landmark elements
function checkLandmarkElements() {
  // Existing function implementation
  const landmarkElements = LANDMARK_ELEMENTS;
  landmarkElements.forEach(element => {
    const landmarks = document.querySelectorAll(element);
    landmarks.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (landmark.id === '') {
        landmark.id = `${element}-${index}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      if (landmarks.length > 1) {
        if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
          landmark.setAttribute('aria-label', `${element} ${index + 1}`);
        }
      }
    });
  });
}

// Run game logic here...

// Update scope attributes in all .html files in the views directory
const viewsDir = path.join(__dirname, 'views');
if (fs.existsSync(viewsDir)) {
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      content = updateThScopeAttribute(content);
      fs.writeFileSync(filePath, content);
    });
}

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.querySelector('main');
if (mainElement) {
  document.documentElement.lang = document.documentElement.lang || 'en';
}

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);

  // Define functionA and functionB as objects with properties X, Y, and Z
  functionA = {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ'
  };

  functionB = {
    X: 'valueX2',
    Y: 'valueY2',
    Z: 'valueZ2'
  };
};

// ----- END ORIGINAL CODE -------

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Preserve existing code
a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
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
          document.body.insertBefore(skipLink, document.body.firstChild);
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
}

// Checks the structure of a table and validates it against expected schema
function checkTableStructure(tableOrName, expectedColumns = []) {
  // ... ( keep existing implementation )
}

// Checks the schema of an object with a "columns" property
function checkTableSchema(tableSchema) {
  if (!tableSchema || typeof tableSchema !== 'object' || !Array.isArray(tableSchema.columns)) {
    return { isValid: false, errors: ['Table schema must have a "columns" property'] };
  }

  const errors = [];
  const columns = tableSchema.columns;

  const expectedColumns = tableSchema.expectedColumns || [];
  
  expectedColumns.forEach((expecting) => {
    const found = tableSchema.columns.find((col) => col.name === expecting.name);
    if (!found) {
      errors.push(`Missing expected column: ${expecting.name}`);
      return;
    }

    if (expecting.type && found.type !== expecting.type) {
      errors.push(`Expected column ${found.name} to be a ${expecting.type}, but it is a ${found.type}`);
    }

    if (expecting.unique !== undefined && found.unique !== expecting.unique) {
      errors.push(`Expected column ${found.name} to be ${expecting.unique ? 'unique' : 'not unique'}, but it is ${found.unique ? 'unique' : 'not unique'}`);
    }
  });

  if (errors.length > 0) {
    return {isValid: false, errors};
  }

  return {isValid: true};
}

// Accessibility fixes as per insight report
// REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report

/**
 * Sets the lang attribute on the document root element
 * @param {string} lang - Language code (default: 'en')
 */
function setLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

/**
 * Initializes accessibility features based on insight report
 */
function initAccessibility() {
  // REACT_015: Add lang attribute
  setLangAttribute();

  // REACT_025: Add skip link functionality for keyboard users
  const skipLink = document.getElementById('main-content') || document.querySelector('main');
  if (skipLink) {
    skipLink.setAttribute('tabindex', '-1');
    skipLink.addEventListener('focus', function() {
      this.removeAttribute('tabindex');
    });
  }

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(function(element) {
    if (!element.getAttribute('tabindex') && !element.hasAttribute('href')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

// Export affected functions to make them accessible
module.exports = {
  ...affectedFunctions,
  functionA,
  functionB,
  generatePageContent,
  wrapInMainLandmark,
  updateHTMLWithLandmarks,
  setLangAttribute,
  initAccessibility,
  a11yStore,
  createInPageButton,
  checkLandmarkElements,
  addLandmarkRegions,
  addressAccessibilityIssues,
  countDependencies: a11yStore.countDependencies.bind(a11yStore),
};

// Export for module usage (ES modules)
if (typeof exports !== 'undefined') {
  exports.a11yStore = a11yStore;
  exports.addressAccessibilityIssues = addressAccessibilityIssues;
  exports.createInPageButton = createInPageButton;
  exports.default = a11yStore;
}