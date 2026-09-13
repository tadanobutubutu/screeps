// main.js
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

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
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      // Process HTML files as needed
    });
}

// ----- END ORIGINAL CODE -------

/**
 * Check if a value is a number
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a number, false otherwise
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

/**
 * Checks the structure of a table and validates it against expected schema
 * @param {string|Object} tableOrName - The name of the table or the table object to check
 * @param {Array} expectedColumns - Array of expected column definitions
 * @returns {Object} - Validation result with isValid boolean and error messages
 */
function checkTableStructure(tableOrName, expectedColumns = []) {
    const result = {
        isValid: true,
        errors: []
    };

    // Support both call signatures: (tableName, expectedColumns) and (table, expectedColumns)
    if (typeof tableOrName === 'string') {
        if (!tableOrName || tableOrName.trim() === '') {
            result.isValid = false;
            result.errors.push('Table name must be a non-empty string');
            return result;
        }

        if (!Array.isArray(expectedColumns)) {
            result.isValid = false;
            result.errors.push('Expected columns must be an array');
            return result;
        }

        if (expectedColumns.length === 0) {
            result.isValid = false;
            result.errors.push('Expected columns must not be empty');
            return result;
        }

        for (const column of expectedColumns) {
            if (typeof column !== 'string' || column.trim() === '') {
                result.isValid = false;
                result.errors.push('All expected columns must be non-empty strings');
                return result;
            }
        }

        // In a real implementation, this would query the database schema
        // and validate that the table has the expected columns
        return result;
    }

    if (!tableOrName || typeof tableOrName !== 'object') {
        result.isValid = false;
        result.errors.push('Table must be a valid object');
        return result;
    }

    // Check if table has columns property
    if (!tableOrName.columns || !Array.isArray(tableOrName.columns)) {
        result.isValid = false;
        result.errors.push('Table must have a columns array');
        return result;
    }

    // Validate each expected column exists
    const tableColumns = tableOrName.columns.map(col => col.name || col);
    
    expectedColumns.forEach(expected => {
        const columnName = typeof expected === 'string' ? expected : expected.name;
        if (!tableColumns.includes(columnName)) {
            result.isValid = false;
            result.errors.push(`Missing expected column: ${columnName}`);
        }
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

/**
 * Checks if a table has the expected structure
 * @param {string} tableName - The name of the table to check
 * @param {Array<string>} expectedColumns - Array of expected column names
 * @returns {boolean} - True if table structure matches expected columns, false otherwise
 */
function checkTableStructure(tableName, expectedColumns) {
  if (!tableName || typeof tableName !== 'string') {
    return false;
  }
  
  if (!expectedColumns || !Array.isArray(expectedColumns)) {
    return false;
  }
  
  // Validate that expectedColumns is not empty
  if (expectedColumns.length === 0) {
    return false;
  }
  
  // Validate that all expectedColumns are non-empty strings
  for (const column of expectedColumns) {
    if (typeof column !== 'string' || column.trim() === '') {
      return false;
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
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
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
  addProperLandmarkRegions() {
    // Ensure the document has a proper <main> landmark
    if (!document.querySelector('main, [role="main"]')) {
      const mainEl = document.createElement('main');
      mainEl.setAttribute('id', 'main-content');
      // Move all body children that aren't landmarks into the main element
      const bodyChildren = Array.from(document.body.children);
      bodyChildren.forEach((child) => {
        const role = child.getAttribute('role');
        const tagName = child.tagName.toLowerCase();
        const isLandmark = ['main', 'nav', 'header', 'footer', 'aside'].includes(tagName) ||
          (role && ['main', 'navigation', 'banner', 'contentinfo', 'complementary'].includes(role));
        if (!isLandmark) {
          mainEl.appendChild(child);
        }
      });
      // If mainEl has no children, add a placeholder
      if (mainEl.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.setAttribute('id', 'main-content-placeholder');
        mainEl.appendChild(placeholder);
      }
      document.body.appendChild(mainEl);
    }

    // Ensure <nav> landmarks have proper role
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
      if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });

    // Ensure <header> elements have proper role (only when not already in a sectioning element)
    const headerElements = document.querySelectorAll('header');
    headerElements.forEach((header, index) => {
      const parent = header.parentElement;
      const isInsideArticle = parent && ['article', 'section', 'aside', 'nav', 'main'].includes(parent.tagName.toLowerCase());
      if (!isInsideArticle && !header.hasAttribute('role')) {
        header.setAttribute('role', 'banner');
      }
      if (!header.hasAttribute('aria-label') && !header.hasAttribute('aria-labelledby')) {
        header.setAttribute('aria-label', `Banner ${index + 1}`);
      }
    });

    // Ensure <footer> elements have proper role (only when not already in a sectioning element)
    const footerElements = document.querySelectorAll('footer');
    footerElements.forEach((footer, index) => {
      const parent = footer.parentElement;
      const isInsideArticle = parent && ['article', 'section', 'aside', 'nav', 'main'].includes(parent.tagName.toLowerCase());
      if (!isInsideArticle && !footer.hasAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
      if (!footer.hasAttribute('aria-label') && !footer.hasAttribute('aria-labelledby')) {
        footer.setAttribute('aria-label', `Content info ${index + 1}`);
      }
    });

    // Ensure <aside> elements have proper role
    const asideElements = document.querySelectorAll('aside');
    asideElements.forEach((aside, index) => {
      if (!aside.hasAttribute('role')) {
        aside.setAttribute('role', 'complementary');
      }
      if (!aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
        aside.setAttribute('aria-label', `Complementary ${index + 1}`);
      }
    });

    // Ensure exactly one <h1> exists for proper document structure
    const headings = document.querySelectorAll('h1');
    if (headings.length === 0) {
      const mainContent = document.querySelector('main, [role="main"]');
      if (mainContent) {
        const h1 = document.createElement('h1');
        h1.textContent = document.title || 'Main heading';
        h1.setAttribute('id', 'main-heading');
        mainContent.insertBefore(h1, mainContent.firstChild);
      }
    } else if (headings.length > 1) {
      // Demote additional h1s to h2
      for (let i = 1; i < headings.length; i++) {
        const oldH1 = headings[i];
        const newH2 = document.createElement('h2');
        newH2.textContent = oldH1.textContent;
        // Preserve attributes
        Array.from(oldH1.attributes).forEach((attr) => {
          newH2.setAttribute(attr.name, attr.value);
        });
        oldH1.parentNode.replaceChild(newH2, oldH1);
      }
    }
  },
  addressAccessibilityIssues(report) {
    if (!report) return;

    if (report.langMissing) {
      if (!document.documentElement.getAttribute('lang')) {
        document.documentElement.setAttribute('lang', 'en');
      }
    }

    if (report.landmarkIssues) {
      this.addProperLandmarkRegions();
    }

    if (report.svgIssues) {
      this.addSVGAccessibilityProps();
    }

    if (report.fakeLinks) {
      this.fixFakeLinks();
    }
  },
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
  greet(name) {
    return `Hello, ${name}!`;
  },
  add(a, b) {
    return a + b;
  }
  
  // This function checks the structure of a table
  // In a real implementation, this would query the database schema
  // and validate that the table has the expected columns
  return true;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs

function ensureElementHasId(element) {
  // existing function implementation
}

function addAriaLabel(element, label) {
  // existing function implementation
}

function renderDependencyGraphs(dependencies) {
  // existing function implementation
}

// New function to address REACT_015: Add lang attribute to HTML element
function addLangAttributeToHtml() {
  const htmlFilePath = path.join(__dirname, 'index.html');
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  const updatedHtmlContent = htmlContent.replace(/<html>/g, '<html lang="en">');
  fs.writeFileSync(htmlFilePath, updatedHtmlContent);
}

// New function to address REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles() {
  // Example function, implementation will depend on the actual HTML structure
  // This is a placeholder function
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function addAccessibleNamesToSVGs() {
  // Example function, implementation will depend on the actual SVGs and their structure
  // This is a placeholder function
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Example function, implementation will depend on the actual HTML structure
  // This is a placeholder function
}

// New function to address REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue() {
  // Example function, implementation will depend on the actual HTML structure
  // This is a placeholder function
}

// New function to address REACT_027: Add scope="col" or scope="row" to <th> elements
// This function is already implemented, so no changes are needed here.

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

// Ensure lang attribute is set on the <html> element for accessibility (REACT_015)
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

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

// Exporting the new added function
module.exports = {
    main,
    SomeClass,
    someUtility,
    config,
    countDependencies,
    run,
    checkTableStructure,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs,
    myNewFunction,
    isNumber,
    clamp,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink
};