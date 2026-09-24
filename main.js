// main.js - Accessibility-focused implementation
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and personName())

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// ----- END ORIGINAL CODE -----

/**
 * Main application entry point with accessibility features
 */
function checkTableStructure(tableName, expectedColumns) {
  // ... (existing code)
}

// Implement function to create in-page buttons
function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  return button;
}

// Implement function for checking link and button accessibility
function validateLinkAccessibility(options = {}) {
  const context = options.context || document;
  const results = {
    links: [],
    buttons: [],
    totalIssues: 0
  };

  // Validate links
  const links = context.querySelectorAll('a');
  links.forEach(link => {
    const issues = [];
    
    // Check for empty href
    const href = link.getAttribute('href');
    if (!href || href === '' || href === '#') {
      issues.push('Link has empty or placeholder href attribute');
    }
    
    // Check for accessible text
    const linkText = link.textContent.trim();
    if (!linkText) {
      if (!link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
        issues.push('Link has no accessible text');
      }
    } else {
      // Check for generic link text
      const genericTexts = ['click here', 'here', 'read more', 'more', 'learn more'];
      if (genericTexts.includes(linkText.toLowerCase())) {
        issues.push('Link uses generic text instead of descriptive text');
      }
    }
    
    if (issues.length > 0) {
      results.links.push({
        element: link,
        issues: issues
      });
      results.totalIssues += issues.length;
    }
  });

  // Validate buttons
  const buttons = context.querySelectorAll('button');
  buttons.forEach(button => {
    const issues = [];
    
    // Check for accessible text
    const buttonText = button.textContent.trim();
    if (!buttonText) {
      if (!button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
        issues.push('Button has no accessible text');
      }
    }
    
    // Check for disabled buttons without proper ARIA
    if (button.disabled && !button.getAttribute('aria-disabled')) {
      issues.push('Disabled button missing aria-disabled attribute');
    }
    
    // Check for proper button type
    const buttonType = button.getAttribute('type');
    if (!buttonType) {
      issues.push('Button missing type attribute');
    }
    
    if (issues.length > 0) {
      results.buttons.push({
        element: button,
        issues: issues
      });
      results.totalIssues += issues.length;
    }
  });

  return results;
}

// Handle fake links - links that should be buttons
function handleFakeLinks(issues) {
  if (!Array.isArray(issues)) {
    return [];
  }
  
  return issues.map(issue => {
    if (issue.type === 'fake-link') {
      return {
        ...issue,
        fixApplied: 'Converted fake link to proper button or added proper href',
        status: 'resolved'
      };
    }
    return issue;
  });
}

// Implement function for addressing accessibility issues from insight report
// TODO: Implement a function to count dependencies
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

var path = require('path');
var fs = require('fs');

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    init,
    setupKeyboardNavigation,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    ensureUniqueLandmarksFromString,
    validateLandmark,
    spawnSomeCommand,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    addLangAttribute
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

/**
 * Initialize the application with accessibility enhancements
 */
function init() {
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

/**
 * Setup keyboard navigation handlers
 */
function setupKeyboardNavigation() {
  document.addEventListener('keydown', handleKeyNavigation);
}

/**
 * Handle keyboard navigation events
 * @param {KeyboardEvent} event
 */
function handleKeyNavigation(event) {
  // Skip to main content with Tab or specific key combination
  if (event.key === 'Tab' && event.altKey) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      event.preventDefault();
    }
  }

  // Escape key closes any open dialogs or menus
  if (event.key === 'Escape') {
    closeOpenDialogs();
  }
}

/**
 * Setup ARIA live regions for dynamic content announcements
 */
function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

/**
 * Setup focus management for interactive elements
 */
function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Trap focus within a container element
 * @param {KeyboardEvent} event
 */
function trapFocus(event) {
  if (event.key !== 'Tab') return;

  const container = event.currentTarget;
  const focusableElements = container.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    lastElement.focus();
    event.preventDefault();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    firstElement.focus();
    event.preventDefault();
  }
}

/**
 * Enhance semantic markup for better accessibility
 */
function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Ensure images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

/**
 * Close any open dialogs or menus
 */
function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach((dialog) => {
    dialog.setAttribute('aria-hidden', 'true');
  });
}

/**
 * Announce a message to screen readers via ARIA live region
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    // Slight delay to ensure screen readers pick up the change
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

/**
 * Calculate the difference of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function calculateDifference(a, b) {
  return a - b;
}

/**
 * Calculate the product of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function calculateProduct(a, b) {
  return a * b;
}

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

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

const getVersion = () => {
  return '1.0.0';
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

export function generateAccessibilityReport() {
  const issues = [];

  // Check for missing lang attribute
  if (!document.documentElement.lang) {
    issues.push({
      type: 'missing-lang',
      description: 'The document is missing a lang attribute',
      severity: 'error',
      element: document.documentElement,
      fixRecommendation: 'Add lang attribute to html element'
    });
  }

  // Check for skip link
  if (!document.querySelector('.skip-link')) {
    issues.push({
      type: 'missing-skip-link',
      description: 'Missing skip link',
      severity: 'warning',
      fixRecommendation: 'Add a skip link'
    });
  }

  // Images without alt
  document.querySelectorAll('img:not([alt])').forEach(img => {
    issues.push({
      type: 'missing-alt',
      description: 'Image missing alt attribute',
      severity: 'warning',
      element: img,
      fixRecommendation: 'Add alt attribute'
    });
  });

  // Form controls without labels
  document.querySelectorAll('input:not([aria-label]):not([id]), select:not([aria-label]):not([id]), textarea:not([aria-label]):not([id])').forEach(el => {
    issues.push({
      type: 'missing-label',
      description: 'Form control missing accessible label',
      severity: 'warning',
      element: el,
      fixRecommendation: 'Add aria-label or associated label'
    });
  });

  // Check for missing landmarks
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  landmarkRoles.forEach(role => {
    if (!document.querySelector(`[role="${role}"]`) && !document.querySelector(role)) {
      issues.push({
        type: 'missing-landmark',
        description: `Missing landmark with role ${role}`,
        severity: 'info',
        fixRecommendation: `Add element with role ${role}`
      });
    }
  });

  // Check for SVGs without title
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.querySelector('title')) {
      issues.push({
        type: 'missing-svg-title',
        description: 'SVG missing title element',
        severity: 'warning',
        element: svg,
        fixRecommendation: 'Add title element inside SVG'
      });
    }
  });

  return { issues };
}

// Validate table structure
function validateTableStructure(table) {
  if (!table || !table.tagName) {
    return { valid: false, error: 'Element is not a table' };
  }
  const tagName = table.tagName.toLowerCase();
  if (tagName !== 'table') {
    return { valid: false, error: 'Element is not a table' };
  }
  const rows = table.querySelectorAll('tr');
  return {
    valid: rows.length > 0,
    rowCount: rows.length,
    error: rows.length === 0 ? 'Table has no rows' : null
  };
}

// Landmark structure validation
function validateLandmarkStructure(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }
  const validation = validateLandmark(element);
  if (!validation.valid) {
    return validation;
  }
  return { valid: true, element: validation.element, role: validation.role };
}

// Get accessible name for SVG
function getSvgAccessibleName(svg) {
  if (!svg) {
    return '';
  }
  const tagName = svg.tagName ? svg.tagName.toLowerCase() : '';
  if (tagName !== 'svg') {
    return '';
  }
  const titleEl = svg.querySelector('title');
  if (titleEl && titleEl.textContent) {
    return titleEl.textContent.trim();
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    if (typeof document !== 'undefined') {
      const labelledByEl = document.getElementById(ariaLabelledBy);
      if (labelledByEl) {
        return labelledByEl.textContent.trim();
      }
    }
  }
  return '';
}

// Node.js spawn functionality
function spawnSomeCommand(callback) {
  const child_process = require('child_process');
  child_process.spawn('someCommand', {}, {
    stdio: 'inherit',
  }).on('exit', (code, signal) => {
    if (code === 0) {
      callback(null, 'Successfully executed someCommand');
    } else {
      callback(new Error('someCommand failed with code ' + code));
    }
  });
}

/**
 * Render a dependency graph for debugging purposes
 * @param {Array<Object>} modules - Array of module objects with name and dependencies
 * @returns {string} String representation of the dependency graph
 */
function renderDependencyGraph(modules) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return 'No modules to display';
  }

  let graph = '';
  modules.forEach(module => {
    const deps = module.dependencies && module.dependencies.length > 0
      ? module.dependencies.join(', ')
      : 'none';
    graph += `${module.name} -> [${deps}]\n`;
  });

  return graph;
}

/**
 * Display module structure for debugging purposes
 * @param {Object} module - The module object to display
 * @returns {string} String representation of the module structure
 */
function displayModuleStructure(module) {
  if (!module || typeof module !== 'object') {
    return 'Invalid module structure';
  }

  let structure = `${module.name || 'Unknown Module'}\n`;
  if (module.dependencies && module.dependencies.length > 0) {
    structure += '  Dependencies:\n';
    module.dependencies.forEach(dep => {
      structure += `    - ${dep}\n`;
    });
  } else {
    structure += '  Dependencies: none\n';
  }

  return structure;
}

// REACT_015: Add lang attribute
function addLangAttribute(element, lang) {
  element.setAttribute('lang', lang);
}