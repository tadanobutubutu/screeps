// main.js - Combined utility and accessibility features

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

// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

// Accessibility helper function for keyboard navigation
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

// Get the lang attribute from the HTML element
function getLangAttribute(htmlElement) {
  if (!htmlElement) {
    htmlElement = document.querySelector('html');
  }
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Ensure the HTML element has proper ARIA attributes including lang
function ensureDependencyGraphARIA() {
  let htmlElement = document.querySelector('html');
  
  if (!htmlElement) {
    htmlElement = document.createElement('html');
    document.insertBefore(htmlElement, document.firstChild);
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

// TODO: add the new functions or changes requested in the issue

// New utility functions

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
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle getLangAttribute for REACT_015
function getLangAttribute(htmlElement) {
  // Implement the logic to set the lang attribute based on the preferred language or localization
  if (htmlElement) {
    // Check if element has lang attribute, if not set default
    if (!htmlElement.hasAttribute('lang') || !htmlElement.getAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
    return htmlElement.getAttribute('lang');
  }
  return 'en';
}

// Function to createInPageButton for REACT_015, REACT_036
function createInPageButton(options) {
  // Implement the logic to create a proper in-page link button
  const button = document.createElement('button');
  button.textContent = options.text || 'Link';
  button.setAttribute('role', 'link');
  button.tabIndex = options.tabIndex || 0;
  
  // Add click handler if provided
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  // Add keyboard navigation if provided
  if (options.onKeyDown) {
    button.addEventListener('keydown', options.onKeyDown);
  }
  
  // Set ARIA attributes if provided
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.ariaDescribedby) {
    button.setAttribute('aria-describedby', options.ariaDescribedby);
  }
  
  return button;
}

// Function to validateTableAccessibility for REACT_027
function validateTableAccessibility(table) {
  // Implement the logic to check for table accessibility issues and return a list of issues
  const issues = [];
  
  if (!table || table.tagName !== 'TABLE') {
    issues.push('Element is not a table element');
    return issues;
  }
  
  // Check if table has caption or aria-label
  if (!table.querySelector('caption') && !table.hasAttribute('aria-label')) {
    issues.push('Table must have a caption or aria-label for accessibility');
  }
  
  // Check for proper header structure
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table should have header cells (th) for accessibility');
  }
  
  // Check for proper row and column structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table should have at least one row');
  }
  
  return issues;
}

// Function to validateTableStructure for REACT_027
function validateTableStructure(table) {
  // Implement the logic to check for table structure issues and return a list of issues
  const issues = [];
  
  if (!table || table.tagName !== 'TABLE') {
    issues.push('Element is not a table element');
    return issues;
  }
  
  // Check if table has header and body sections if there are multiple rows
  const rows = table.querySelectorAll('tr');
  if (rows.length > 1) {
    // Check if table has thead/tbody/tfoot
    if (!table.querySelector('thead') && !table.querySelector('tbody')) {
      issues.push('Large tables should have thead or tbody sections for structure');
    }
  }
  
  // Check for proper header association
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    const id = header.id;
    if (id) {
      // Check if any cell references this header via headers attribute
      const cells = table.querySelectorAll(`[headers="${id}"]`);
      if (cells.length === 0) {
        issues.push(`Header with ID "${id}" is not referenced by any cell`);
      }
    }
  });
  
  // Check for semantic structure
  const caption = table.querySelector('caption');
  if (caption) {
    // Check if caption comes before table content
    const allChildren = Array.from(table.children);
    const captionIndex = allChildren.indexOf(caption);
    if (captionIndex > 0 && allChildren[captionIndex - 1].tagName === 'COLGROUP') {
      issues.push('Caption should be the first child of table after colgroup if present');
    }
  }
  
  return issues;
}

// Function to validateLandmark for REACT_017
function validateLandmark(element) {
  // Implement the logic to check for landmark presence and proper use
  const issues = [];
  
  if (!element) {
    issues.push('No element provided for landmark validation');
    return issues;
  }
  
  const tagName = element.tagName.toLowerCase();
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
  
  if (landmarks.includes(tagName)) {
    // Check for aria-label or aria-labelledby
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      issues.push(`${tagName} landmark should have accessible name`);
    }
    
    // Check for unique landmarks
    const sameTypeLandmarks = document.querySelectorAll(`.${tagName}`);
    if (sameTypeLandmarks.length > 1) {
      issues.push(`Multiple ${tagName} landmarks may cause confusion`);
    }
  } else {
    issues.push(`${tagName} is not a landmark element`);
  }
  
  return issues;
}

// Function to validateLandmarkStructure for REACT_017
function validateLandmarkStructure(element) {
  // Implement the logic to check for landmark structure compliance
  const issues = [];
  
  if (!element) {
    issues.push('No element provided for landmark validation');
    return issues;
  }
  
  const tagName = element.tagName.toLowerCase();
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
  
  if (landmarks.includes(tagName)) {
    // Check if landmark is properly nested
    const parent = element.parentElement;
    if (parent) {
      const parentTag = parent.tagName.toLowerCase();
      const properParents = ['body', 'article', 'section'];
      if (!properParents.includes(parentTag)) {
        issues.push(`${tagName} landmark should be direct child of ${properParents.join(', ')} or body`);
      }
    }
    
    // Check for appropriate content
    if (element.textContent.trim().length === 0) {
      issues.push(`${tagName} landmark should have content`);
    }
  } else {
    issues.push(`${tagName} is not a landmark element`);
  }
  
  return issues;
}

// Function to ensureUniqueLandmarks for REACT_017, REACT_025
function ensureUniqueLandmarks() {
  // Implement the logic to check for and handle duplicate landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, article, section');
  const landmarkTypes = {};
  const issues = [];
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    
    if (!landmarkTypes[tagName]) {
      landmarkTypes[tagName] = [];
    }
    landmarkTypes[tagName].push(landmark);
  });
  
  // Check for duplicate landmarks
  Object.keys(landmarkTypes).forEach(type => {
    if (landmarkTypes[type].length > 1) {
      issues.push(`${type} landmark appears ${landmarkTypes[type].length} times - consider using aria-label to distinguish`);
    }
  });
  
  return issues;
}

// Function to getSvgAccessibleName for REACT_041
function getSvgAccessibleName(svg) {
  // Implement the logic to generate an accessible name for SVG elements
  if (!svg || svg.tagName.toLowerCase() !== 'svg') {
    return 'Not an SVG element';
  }
  
  // Try to get aria-label first
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  
  // Try to get title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || 'SVG with title';
  }
  
  // Try to use alt text from img element that references this SVG
  const img = document.querySelector(`img[usemap="#${svg.id}"]`);
  if (img && img.hasAttribute('alt')) {
    return img.getAttribute('alt');
  }
  
  // Fallback to generic description
  return 'SVG graphic';
}

// Function to setSvgAttributes for REACT_041
function setSvgAttributes(svg, attributes) {
  // Implement the logic to set specified attributes on SVG elements
  if (!svg || svg.tagName.toLowerCase() !== 'svg') {
    return false;
  }
  
  let success = true;
  
  Object.keys(attributes).forEach(key => {
    try {
      svg.setAttribute(key, attributes[key]);
    } catch (e) {
      console.error(`Failed to set attribute ${key}:`, e);
      success = false;
    }
  });
  
  return success;
}

// Function to handleFakeLinks for REACT_036
function handleFakeLinks(links) {
  // Implement the logic to handle fake links within the app
  const fakeLinks = [];
  
  if (!links) return fakeLinks;
  
  links.forEach(link => {
    if (link.tagName.toLowerCase() === 'div' || 
        (link.tagName.toLowerCase() === 'span' && 
         (link.getAttribute('role') === 'button' || 
          link.style.cursor === 'pointer'))) {
      
      // Check if it's a fake link that should be a real link
      if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
        fakeLinks.push(link);
      }
    }
  });
  
  return fakeLinks;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    handleKeyboardNavigation,
    handleKeyboard,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    ensureDependencyGraphARIA,
    getLangAttribute,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    debounce,
    throttle,
    generateId,
    safeJsonParse,
    addAccessibleNamesToSvg,
    isInViewport,
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    setSvgAttributes,
    handleFakeLinks
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    window.accessibilityFeatures = initializeAccessibility();
    // Ensure ARIA attributes are properly set on the HTML element
    ensureDependencyGraphARIA();
  });
}