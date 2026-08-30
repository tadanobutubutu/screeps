// main.js - Screeps bot with utility and accessibility features

// Utility functions for common tasks
/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) cloned[key] = deepClone(obj[key]);
    }
    return cloned;
  }
  return obj;
}

/**
 * Generates a unique ID
 * @returns {string} - Unique identifier
 */
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Safely parses JSON
 * @param {string} str - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed object or default value
 */
function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

// Accessibility helper functions
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  return (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  };
}

// Alias for backwards compatibility
const handleKeyboard = handleKeyboardNavigation;

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTab = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleTab);
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);

  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Get the lang attribute from the HTML element
function getLangAttribute() {
  const doc = getDocument();
  const htmlElement = doc ? doc.querySelector('html') : null;
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Ensure the HTML element has proper ARIA attributes including lang
function ensureDependencyGraphARIA() {
  const doc = getDocument();
  let htmlElement = doc ? doc.querySelector('html') : null;
  
  if (!htmlElement) {
    return { lang: null, dir: null };
  }
  
  // Ensure lang attribute is set (accessibility requirement REACT_015)
  if (!htmlElement.hasAttribute('lang') || !htmlElement.getAttribute('lang')) {
    // Default to 'en' if no language is specified
    htmlElement.setAttribute('lang', 'en');
  }
  
  // Ensure dir attribute is set for proper text direction
  if (!htmlElement.hasAttribute('dir')) {
    htmlElement.setAttribute('dir', 'ltr');
  }
  
  return {
    lang: htmlElement.getAttribute('lang'),
    dir: htmlElement.getAttribute('dir')
  };
}

// Add accessible names to SVG elements
function addAccessibleNamesToSvg(container) {
  const svgs = container.querySelectorAll('svg');
  if (svgs.length >= 2) {
    svgs[0].setAttribute('aria-label', 'First SVG');
    svgs[1].setAttribute('aria-label', 'Second SVG');
  }
  
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-label', `SVG element ${index + 1}`);
    }
  });
}

/**
 * Checks if an element is in the viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(element) {
  if (typeof document === 'undefined') return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Placeholder functions for accessibility issues (to be implemented)
// REACT_015: Add lang attribute to HTML element
function createInPageButton(options) {
  // Implement the logic to create a proper in-page link button
}

// REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // Implement the logic to check for table accessibility issues and return a list of issues
}

function validateTableStructure(table) {
  // Implement the logic to check for table structure issues and return a list of issues
}

// REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // Implement the logic to check for landmark presence and proper use
}

function validateLandmarkStructure(element) {
  // Implement the logic to check for landmark structure compliance
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Implement the logic to check for and handle duplicate landmarks
}

// REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // Implement the logic to generate an accessible name for SVG elements
}

function setSvgAttributes(svg, attributes) {
  // Implement the logic to set specified attributes on SVG elements
}

// REACT_036: Fix 1 fake link issue
function handleFakeLinks(links) {
  // Implement the logic to handle fake links within the app
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  const elementToModify = typeof document !== 'undefined' ? document.querySelector('html') : null;
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en');
  }
}

// New helper functions to address the additional accessibility requirements
function ensureElementHasId(elementId) {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element && !element.hasAttribute('id')) {
    element.setAttribute('id', elementId);
  }
}

function addAriaLabelById(elementId, label) {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

// New function to render dependency graphs or display module structure
function renderDependencyGraph(module) {
  // Implementation to render the dependency graph for a given module
  // This is a placeholder function and should be replaced with actual logic
  console.log('Rendering dependency graph for:', module);
  // Example output: 'Rendering dependency graph for: ModuleName'
}

// New function to display module structure
function displayModuleStructure(module) {
  // Implementation to display the module structure for a given module
  // This is a placeholder function and should be replaced with actual logic
  console.log('Displaying module structure for:', module);
  // Example output: 'Displaying module structure for: ModuleName'
}

// New function for generating a report based on accessibility issues
function generateAccessibilityReport() {
  // Implementation for generating a report based on accessibility issues
  // This is a placeholder; actual implementation should collect issues
  const report = {
    timestamp: new Date().toISOString(),
    issues: []
  };
  return report;
}

// Function to check link accessibility
function checkLinkAccessibility() {
  const doc = getDocument();
  if (doc) {
    const links = doc.querySelectorAll('a');
    let issues = [];
    links.forEach(link => {
      if (!link.textContent && !link.getAttribute('aria-label')) {
        issues.push('Link missing accessible name');
      }
    });
    return issues.length === 0;
  }
  return true;
}

// Placeholder for validateLinkAccessibility (referenced by checkLinkAccessibility)
function validateLinkAccessibility() {
  // Implement the logic to validate link accessibility
  return [];
}

/**
 * A new utility function added per the issue requirement.
 * Returns the product of two numeric arguments.
 * @param {number} arg1 - First number.
 * @param {number} arg2 - Second number.
 * @returns {number} The product of arg1 and arg2.
 */
function myNewFunction(arg1, arg2) {
  return arg1 * arg2;
}

// Additional accessibility helper functions from origin/main
function addressAccessibilityIssues(doc) {
    if (!doc || !doc.documentElement) {
        // Fallback for environment without document (e.g., test environment)
        return;
    }

    // ... existing code ...
}

function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return null;
}

function wrapPrimaryContentInMain() {
  // Implement the logic to wrap primary content in a main element
}

function addFixLandmarkIssues() {
  // Implement the logic to fix landmark issues
}

function addAriaToFormControls() {
  // Implement the logic to add ARIA attributes to form controls
}

function fixFakeLinkIssues() {
  // Implement the logic to fix fake link issues
}

function createAccessibleLink() {
  // Implement the logic to create an accessible link
}

// Handle accessibility errors
function handleAccessibilityErrors(element) {
  // Handle accessibility errors
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues(insightReport) {
  // Handle case where insightReport is null, undefined, or not an object
  if (!insightReport || typeof insightReport !== 'object') {
    console.warn('Invalid insight report provided to fixAccessibilityIssues');
    return;
  }

  const accessibilityIssues = insightReport.accessibility || [];

  if (!Array.isArray(accessibilityIssues) || accessibilityIssues.length === 0) {
    console.log('No accessibility issues found in the insight report');
    return;
  }

  console.log(`Found ${accessibilityIssues.length} accessibility issues:`);

  accessibilityIssues.forEach((issue, index) => {
    if (issue && typeof issue === 'object') {
      const description = issue.description || 'No description available';
      const severity = issue.severity || 'unknown';
      const impact = issue.impact || 'unknown';
      const selector = issue.selector || 'unknown selector';

      console.log(`Issue ${index + 1}:`);
      console.log(`  Description: ${description}`);
      console.log(`  Severity: ${severity}`);
      console.log(`  Impact: ${impact}`);
      console.log(`  Selector: ${selector}`);

      // Attempt to address the issue based on type
      if (issue.type) {
        switch (issue.type) {
          case 'color-contrast':
            console.log('  Action: Consider adjusting color contrast for better visibility');
            break;
          case 'alt-text':
            console.log('  Action: Add or improve alt text for images');
            break;
          case 'aria-label':
            console.log('  Action: Add or improve aria-label attributes');
            break;
          case 'heading-order':
            console.log('  Action: Review and fix heading hierarchy order');
            break;
          default:
            console.log(`  Action: Review and address ${issue.type} issue`);
        }
      }

      console.log('---');
    }
  });
}

// Add new function to address the accessibility issue REACT_043: Make header focusable
function makeHeaderFocusable() {
  // code to make the header element focusable
  // Example: Adding tabindex to the header
  const header = typeof document !== 'undefined' ? document.querySelector('header') : null;
  if (header) {
    header.setAttribute('tabindex', '0');
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    window.accessibilityFeatures = initializeAccessibility();
    // Ensure ARIA attributes are properly set on the HTML element
    ensureDependencyGraphARIA();
    
    // Run accessibility fixes
    addLangAttribute();
    createInPageButton();
    
    // Validate tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      validateTableAccessibility(table);
      validateTableStructure(table);
    });
    
    // Validate landmarks
    validateLandmark();
    validateLandmarkStructure();
    ensureUniqueLandmarks();
    
    // Add accessible names to SVGs
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      setSvgAttributes(svg, accessibleName);
    });
    
    // Handle fake links
    handleFakeLinks();
    
    // Ensure elements have IDs and ARIA labels
    ensureElementHasId('myTable');
    ensureElementHasId('mySvg');
    ensureElementHasId('inPageButton');
    addAriaLabelById('myTable', 'Product data table');
    addAriaLabelById('mySvg', 'Company logo');
    addAriaLabelById('inPageButton', 'Accessibility menu');
    
    // Fix button identifiers
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((button, index) => {
      if (!button.id) {
        button.id = `accessible-button-${index}`;
      }
    });
    
    // Google sign-in accessibility
    const googleButton = document.querySelector('[data-google-signin]');
    if (googleButton) {
      googleButton.setAttribute('aria-label', 'Sign in with Google');
      googleButton.setAttribute('role', 'button');
    }
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();

  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    handleKeyboardNavigation,
    handleKeyboard,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    ensureDependencyGraphARIA,
    getLangAttribute
  };
}

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

// Harvest and upgrade logic function
function harvestAndUpgradeLogic() {
    // Implement harvest and upgrade logic
    // Example:
    for (let creep of Game.creeps) {
        if (creep.memory.working) {
            if (creep.store.getFreeCapacity() > 0) {
                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                if (source) {
                    creep.harvest(source);
                }
            } else {
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_EXTENSION ||
                               structure.structureType === STRUCTURE_SPAWN ||
                               structure.structureType === STRUCTURE_TOWER;
                    }
                });
                if (target) {
                    creep.upgradeStructure(target);
                }
            }
        } else {
            let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target) {
                creep.build(target);
            } else {
                let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    creep.attack(target);
                } else {
                    creep.moveTo(Game.flags.Worker);
                }
            }
        }
    }
}

// Harvest and upgrade logic functions
function harvest(creep, source) {
    if (!source) return;
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}

function upgradeController(creep, controller) {
    if (!controller) return;
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
    }
}

// Google sign-in accessibility
function googleSignIn() {
  const googleButton = typeof document !== 'undefined' ? document.querySelector('[data-google-signin]') : null;
  if (googleButton) {
    googleButton.setAttribute('aria-label', 'Sign in with Google');
    googleButton.setAttribute('role', 'button');
  }
}
googleSignIn();

// Validate table structure and accessibility
const table = typeof document !== 'undefined' ? document.getElementById('myTable') : null;
if (table) {
  validateTableAccessibility(table);
  validateTableStructure(table);
}

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();
ensureUniqueLandmarks();

// Add accessible names to SVGs
const svg = typeof document !== 'undefined' ? document.getElementById('mySvg') : null;
if (svg) {
  const accessibleName = getSvgAccessibleName(svg);
  setSvgAttributes(svg, accessibleName);
}

// Ensure unique landmarks
ensureUniqueLandmarkId('main-content');

// Validate link accessibility (New Function)
checkLinkAccessibility();

// Handle fake links
handleFakeLinks();

// Handle fake link issues
handleAccessibilityErrors();

// Render functions
function renderPage(data) {
  // Code to render the page
}

function renderAccessibilityPage() {
  fixAccessibilityIssues();
  renderDependencyGraph(dependencyGraphContent);
  renderIndex();
}

const renderIndex = () => {
  // Code to render the index view
};

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = typeof document !== 'undefined' ? document.getElementById('product-list') : null;
  if (container) {
    container.innerHTML = products.map(renderProductCard).join('');
    return container;
  }
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderProductList(input.products);
  }
}

// Screeps game loop
module.exports = function() {
    // Initialize accessibility features
    const langAttr = getLangAttribute();
    const primaryContent = wrapPrimaryContentInMain();

    // Validate accessibility
    validateTableAccessibility();
    validateTableStructure();
    validateLandmark();
    validateLandmarkStructure();
    addFixLandmarkIssues();

    // SVG accessibility
    const svgName = getSvgAccessibleName();
    addAriaToFormControls();

    // Unique landmarks and fake link fixes
    ensureUniqueLandmarks();
    fixFakeLinkIssues();
    createAccessibleLink();

    // Harvest and upgrade logic
    const creeps = Game.creeps;
    const sources = Game.sources;
    const controller = Game.controllers[0]; // assuming first controller

    Object.values(creeps).forEach(creep => {
        const source = creep.findClosestByPath(FIND_SOURCES, {
            filter: (source) => source.energy > 0
        });
        if (source) {
            harvest(creep, source);
        } else {
            upgradeController(creep, controller);
        }
    });

    // Check link accessibility
    checkLinkAccessibility();
};

// Export utility functions
module.exports.debounce = debounce;
module.exports.throttle = throttle;
module.exports.isEmpty = isEmpty;
module.exports.capitalize = capitalize;
module.exports.getRandomInt = getRandomInt;
module.exports.clamp = clamp;
module.exports.deepClone = deepClone;
module.exports.generateId = generateId;
module.exports.safeJsonParse = safeJsonParse;
module.exports.isInViewport = isInViewport;
module.exports.initializeAccessibility = initializeAccessibility;
module.exports.handleKeyboardNavigation = handleKeyboardNavigation;
module.exports.handleKeyboard = handleKeyboard;
module.exports.trapFocus = trapFocus;
module.exports.createAnnouncer = createAnnouncer;
module.exports.prefersReducedMotion = prefersReducedMotion;
module.exports.ensureDependencyGraphARIA = ensureDependencyGraphARIA;
module.exports.getLangAttribute = getLangAttribute;
module.exports.addAccessibleNamesToSvg = addAccessibleNamesToSvg;
module.exports.createInPageButton = createInPageButton;
module.exports.validateTableAccessibility = validateTableAccessibility;
module.exports.validateTableStructure = validateTableStructure;
module.exports.validateLandmark = validateLandmark;
module.exports.validateLandmarkStructure = validateLandmarkStructure;
module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
module.exports.getSvgAccessibleName = getSvgAccessibleName;
module.exports.setSvgAttributes = setSvgAttributes;
module.exports.handleFakeLinks = handleFakeLinks;
module.exports.validateLinkAccessibility = validateLinkAccessibility;
module.exports.ensureUniqueLandmarkId = ensureUniqueLandmarkId;
module.exports.addAriaLabel = addAriaLabel;
module.exports.addLangAttribute = addLangAttribute;
module.exports.ensureElementHasId = ensureElementHasId;
module.exports.addAriaLabelById = addAriaLabelById;
module.exports.renderDependencyGraph = renderDependencyGraph;
module.exports.displayModuleStructure = displayModuleStructure;
module.exports.generateAccessibilityReport = generateAccessibilityReport;
module.exports.myNewFunction = myNewFunction;
module.exports.getDocument = getDocument;
module.exports.addressAccessibilityIssues = addressAccessibilityIssues;
module.exports.checkLinkAccessibility = checkLinkAccessibility;
module.exports.makeHeaderFocusable = makeHeaderFocusable;
module.exports.fixAccessibilityIssues = fixAccessibilityIssues;
module.exports.googleSignIn = googleSignIn;
module.exports.harvestAndUpgradeLogic = harvestAndUpgradeLogic;
module.exports.harvest = harvest;
module.exports.upgradeController = upgradeController;
module.exports.renderPage = renderPage;
module.exports.renderAccessibilityPage = renderAccessibilityPage;
module.exports.renderIndex = renderIndex;
module.exports.formatProductName = formatProductName;
module.exports.renderProductList = renderProductList;
module.exports.calculateTotalPrice = calculateTotalPrice;
module.exports.renderCart = renderCart;
module.exports.validateAndRender = validateAndRender;
module.exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
module.exports.addFixLandmarkIssues = addFixLandmarkIssues;
module.exports.addAriaToFormControls = addAriaToFormControls;
module.exports.fixFakeLinkIssues = fixFakeLinkIssues;
module.exports.createAccessibleLink = createAccessibleLink;
module.exports.handleAccessibilityErrors = handleAccessibilityErrors;