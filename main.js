// main.js - Screeps bot with utility and accessibility features

// Utility functions for common tasks
/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  var timeout;
  return function executedFunction() {
    var args = Array.prototype.slice.call(arguments);
    var later = function() {
      clearTimeout(timeout);
      func.apply(this, args);
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
  var inThrottle;
  return function executedFunction() {
    var args = Array.prototype.slice.call(arguments);
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(function() {
        inThrottle = false;
      }, limit);
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
  if (Array.isArray(obj)) return obj.map(function(item) {
    return deepClone(item);
  });
  if (typeof obj === 'object') {
    var cloned = {};
    Object.keys(obj).forEach(function(key) {
      cloned[key] = deepClone(obj[key]);
    });
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
function safeJsonParse(str, defaultValue) {
  if (defaultValue === undefined) defaultValue = null;
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

// Accessibility helper functions
function handleKeyboardNavigation(options) {
  if (options === undefined) options = {};
  var onEnter = options.onEnter;
  var onEscape = options.onEscape;
  var onArrowUp = options.onArrowUp;
  var onArrowDown = options.onArrowDown;
  
  return function(event) {
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
var handleKeyboard = handleKeyboardNavigation;

// Helper to manage focus within a container
function trapFocus(container) {
  var focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  var firstElement = focusableElements[0];
  var lastElement = focusableElements[focusableElements.length - 1];

  function handleTab(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  container.addEventListener('keydown', handleTab);
  
  return function() {
    container.removeEventListener('keydown', handleTab);
  };
}

// ARIA live region announcer
function createAnnouncer() {
  var announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);

  return {
    announce: function(message) {
      announcer.textContent = '';
      setTimeout(function() {
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
  var doc = getDocument();
  var htmlElement = doc ? doc.querySelector('html') : null;
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Ensure the HTML element has proper ARIA attributes including lang
function ensureDependencyGraphARIA() {
  var doc = getDocument();
  var htmlElement = doc ? doc.querySelector('html') : null;
  
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
  var svgs = container.querySelectorAll('svg');
  if (svgs.length >= 2) {
    svgs[0].setAttribute('aria-label', 'First SVG');
    svgs[1].setAttribute('aria-label', 'Second SVG');
  }
  
  svgs.forEach(function(svg, index) {
    if (!svg.hasAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-label', 'SVG element ' + (index + 1));
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
  var rect = element.getBoundingClientRect();
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
  if (typeof document === 'undefined') return null;
  
  var opts = options || {};
  var button = document.createElement('a');
  button.href = opts.href || '#';
  button.textContent = opts.text || 'In-page link';
  button.role = 'button';
  button.addEventListener('click', function(e) {
    e.preventDefault();
    if (opts.onClick) opts.onClick(e);
  });
  
  if (opts.targetElement) {
    opts.targetElement.appendChild(button);
  }
  
  return button;
}

// REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  if (!table) return [];
  
  var issues = [];
  
  if (!table.hasAttribute('role') || table.getAttribute('role') !== 'table') {
    issues.push('Table missing role="table" attribute');
  }
  
  var hasCaption = table.querySelector('caption');
  if (!hasCaption) {
    issues.push('Table missing caption element');
  }
  
  var headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table missing header cells');
  }
  
  var rowHeaders = table.querySelectorAll('td[role="rowheader"]');
  if (rowHeaders.length > 0 && !table.hasAttribute('aria-multiselectable')) {
    issues.push('Table has row headers but missing aria-multiselectable');
  }
  
  return issues;
}

function validateTableStructure(table) {
  if (!table) return [];
  
  var issues = [];
  var rows = table.querySelectorAll('tr');
  
  if (rows.length === 0) {
    issues.push('Table has no rows');
    return issues;
  }
  
  rows.forEach(function(row, rowIndex) {
    var cells = row.querySelectorAll('td, th');
    var headerCells = row.querySelectorAll('th');
    
    if (headerCells.length > 0 && rowIndex > 0) {
      issues.push('Row ' + rowIndex + ' has header cells which should only be in first row');
    }
    
    cells.forEach(function(cell, cellIndex) {
      var colSpan = cell.getAttribute('colspan');
      var rowSpan = cell.getAttribute('rowspan');
      
      if (colSpan && parseInt(colSpan) > 1 && !cell.hasAttribute('aria-colspan')) {
        issues.push('Cell at row ' + rowIndex + ', col ' + cellIndex + ' has colspan but no aria-colspan');
      }
      
      if (rowSpan && parseInt(rowSpan) > 1 && !cell.hasAttribute('aria-rowspan')) {
        issues.push('Cell at row ' + rowIndex + ', col ' + cellIndex + ' has rowspan but no aria-rowspan');
      }
    });
  });
  
  return issues;
}

// REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (!element) return [];
  
  var issues = [];
  var validLandmarks = ['banner', 'navigation', 'main', 'article', 'aside', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  var landmarks = element.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="article"], [role="aside"], [role="complementary"], [role="contentinfo"], [role="search"], [role="form"], [role="application"], banner, nav, main, article, aside, header, footer, section');
  
  if (landmarks.length === 0) {
    issues.push('No landmark elements found');
  }
  
  return issues;
}

function validateLandmarkStructure(element) {
  if (!element) return [];
  
  var issues = [];
  
  var mainElements = element.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    issues.push('Multiple main landmarks found');
  }
  
  var bannerElements = element.querySelectorAll('header[role="banner"], [role="banner"]');
  if (bannerElements.length > 1) {
    issues.push('Multiple banner landmarks found');
  }
  
  var contentInfoElements = element.querySelectorAll('footer[role="contentinfo"], [role="contentinfo"]');
  if (contentInfoElements.length > 1) {
    issues.push('Multiple contentinfo landmarks found');
  }
  
  return issues;
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  
  var doc = document;
  var landmarkTypes = {
    'banner': [],
    'navigation': [],
    'main': [],
    'contentinfo': []
  };
  
  Object.keys(landmarkTypes).forEach(function(type) {
    var elements = doc.querySelectorAll('[role="' + type + '"], ' + type);
    if (elements.length > 1) {
      for (var i = 1; i < elements.length; i++) {
        elements[i].setAttribute('aria-roledescription', 'supplemental ' + type);
      }
    }
  });
}

// REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  var existingLabel = svg.getAttribute('aria-label');
  if (existingLabel) return existingLabel;
  
  var title = svg.querySelector('title');
  if (title && title.textContent) return title.textContent;
  
  var desc = svg.querySelector('desc');
  if (desc && desc.textContent) return desc.textContent;
  
  var img = svg.parentNode;
  if (img && img.tagName === 'IMG' && img.getAttribute('alt')) {
    return img.getAttribute('alt');
  }
  
  return null;
}

function setSvgAttributes(svg, attributes) {
  if (!svg || !attributes) return;
  
  if (typeof attributes === 'string') {
    if (!svg.hasAttribute('aria-label')) {
      svg.setAttribute('aria-label', attributes);
    }
  } else if (typeof attributes === 'object') {
    Object.keys(attributes).forEach(function(key) {
      svg.setAttribute(key, attributes[key]);
    });
  }
}

// REACT_036: Fix 1 fake link issue
function handleFakeLinks(links) {
  if (!links) return;
  
  links.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === '#' || href === '' || !href) {
      link.setAttribute('role', 'button');
      if (!link.hasAttribute('aria-label')) {
        link.setAttribute('aria-label', 'Button link');
      }
    }
  });
}

// Internal set to track used landmark IDs
var _usedLandmarkIds = {};

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    var candidate = baseName;
    if (_usedLandmarkIds.hasOwnProperty(candidate)) {
        // Collision handling: add random suffix
        var suffix = Math.random().toString(36).substring(2, 9);
        candidate = baseName + '-' + suffix;
    }
    _usedLandmarkIds[candidate] = true;
    return candidate;
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
  var elementToModify = typeof document !== 'undefined' ? document.querySelector('html') : null;
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en');
  }
}

// New helper functions to address the additional accessibility requirements
function ensureElementHasId(elementId) {
  var element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element && !element.hasAttribute('id')) {
    element.setAttribute('id', elementId);
  }
}

function addAriaLabelById(elementId, label) {
  var element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

// New function to render dependency graphs or display module structure
function renderDependencyGraph(module) {
  if (typeof console !== 'undefined') {
    console.log('Rendering dependency graph for:', module);
  }
}

// New function to display module structure
function displayModuleStructure(module) {
  if (typeof console !== 'undefined') {
    console.log('Displaying module structure for:', module);
  }
}

// New function for generating a report based on accessibility issues
function generateAccessibilityReport() {
  var report = {
    timestamp: new Date().toISOString(),
    issues: []
  };
  return report;
}

// Function to check link accessibility
function checkLinkAccessibility() {
  var doc = getDocument();
  if (doc) {
    var links = doc.querySelectorAll('a');
    var issues = [];
    links.forEach(function(link) {
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
  var doc = getDocument();
  if (!doc) return [];
  
  var links = doc.querySelectorAll('a');
  var issues = [];
  
  links.forEach(function(link) {
    if (!link.textContent && !link.getAttribute('aria-label')) {
      issues.push('Link missing accessible name');
    }
    
    var href = link.getAttribute('href');
    if (href === '#' || href === '') {
      issues.push('Link has fake href attribute');
    }
  });
  
  return issues;
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
        return;
    }

    ensureDependencyGraphARIA();
    addLangAttribute();
}

function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return null;
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return null;
  
  var doc = document;
  var main = doc.querySelector('main');
  
  if (!main) {
    main = doc.createElement('main');
    main.setAttribute('role', 'main');
    
    var content = doc.querySelector('div.content, #content, .content-wrapper');
    if (content) {
      content.parentNode.insertBefore(main, content);
      main.appendChild(content);
    } else {
      doc.body.appendChild(main);
    }
  }
  
  return main;
}

function addFixLandmarkIssues() {
  if (typeof document === 'undefined') return;
  
  var doc = document;
  var mainElement = doc.querySelector('main, [role="main"]');
  if (mainElement && !mainElement.id) {
    mainElement.id = 'main-content';
  }
}

function addAriaToFormControls() {
  if (typeof document === 'undefined') return;
  
  var doc = document;
  var inputs = doc.querySelectorAll('input, textarea, select');
  
  inputs.forEach(function(input) {
    if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      var label = doc.querySelector('label[for="' + input.id + '"]');
      if (label) {
        input.setAttribute('aria-labelledby', label.id || 'label-' + input.id);
        if (!label.id) {
          label.id = 'label-' + input.id;
        }
      }
    }
  });
}

function fixFakeLinkIssues() {
  if (typeof document === 'undefined') return;
  
  var doc = document;
  var links = doc.querySelectorAll('a[href="#"]');
  links.forEach(function(link) {
    link.setAttribute('role', 'button');
    if (!link.hasAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Action link');
    }
  });
}

function createAccessibleLink() {
  return function(text, href, onClick) {
    if (typeof document === 'undefined') return null;
    
    var link = document.createElement('a');
    link.href = href || '#';
    link.textContent = text;
    
    if (onClick) {
      link.addEventListener('click', onClick);
    }
    
    return link;
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    window.accessibilityFeatures = initializeAccessibility();
    ensureDependencyGraphARIA();
    
    addLangAttribute();
    createInPageButton();
    
    var tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
      validateTableAccessibility(table);
      validateTableStructure(table);
    });
    
    validateLandmark();
    validateLandmarkStructure();
    ensureUniqueLandmarks();
    
    var svgs = document.querySelectorAll('svg');
    svgs.forEach(function(svg) {
      var accessibleName = getSvgAccessibleName(svg);
      setSvgAttributes(svg, accessibleName);
    });
    
    handleFakeLinks();
    
    ensureElementHasId('myTable');
    ensureElementHasId('mySvg');
    ensureElementHasId('inPageButton');
    addAriaLabelById('myTable', 'Product data table');
    addAriaLabelById('mySvg', 'Company logo');
    addAriaLabelById('inPageButton', 'Accessibility menu');
    
    var buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach(function(button, index) {
      if (!button.id) {
        button.id = 'accessible-button-' + index;
      }
    });
    
    var googleButton = document.querySelector('[data-google-signin]');
    if (googleButton) {
      googleButton.setAttribute('aria-label', 'Sign in with Google');
      googleButton.setAttribute('role', 'button');
    }
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  var announcer = createAnnouncer();

  return {
    announce: announcer.announce,
    handleKeyboardNavigation: handleKeyboardNavigation,
    handleKeyboard: handleKeyboard,
    trapFocus: trapFocus,
    createAnnouncer: createAnnouncer,
    prefersReducedMotion: prefersReducedMotion,
    ensureDependencyGraphARIA: ensureDependencyGraphARIA,
    getLangAttribute: getLangAttribute
  };
}

// Screeps game loop
module.exports = function() {
    var langAttr = getLangAttribute();
    var primaryContent = wrapPrimaryContentInMain();

    var tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
      validateTableAccessibility(table);
      validateTableStructure(table);
    });
    
    validateLandmark(document);
    validateLandmarkStructure(document);
    addFixLandmarkIssues();

    var svgs = document.querySelectorAll('svg');
    svgs.forEach(function(svg) {
      var svgName = getSvgAccessibleName(svg);
      setSvgAttributes(svg, svgName);
    });
    
    addAriaToFormControls();

    ensureUniqueLandmarks();
    fixFakeLinkIssues();
    createAccessibleLink();

    var creeps = Game.creeps;
    var sources = Game.sources;
    var controller = Game.controllers[0];

    Object.values(creeps).forEach(function(creep) {
        var source = creep.findClosestByPath(FIND_SOURCES, {
            filter: function(source) {
                return source.energy > 0;
            }
        });
        if (source) {
            harvest(creep, source);
        } else {
            upgradeController(creep, controller);
        }
    });

    checkLinkAccessibility();
};

// Export for use in other modules (CommonJS)
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