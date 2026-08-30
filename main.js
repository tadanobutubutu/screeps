// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
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
  });
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  
  // Set to track used ID suffixes for quick lookup
  const usedSuffixes = new Set();
  const landmarkIds = [];

  // Collect existing ID suffixes from landmarks that have IDs
  landmarks.forEach(landmark => {
    if (landmark.id) {
      const suffix = landmark.id.split('-')[1];
      if (suffix) {
        usedSuffixes.add(suffix);
        landmarkIds.push(landmark.id);
      }
    }
  });

  // Generate unique IDs for landmarks that don't have proper IDs
  landmarks.forEach((landmark, index) => {
    if (!landmark.id || !landmark.id.startsWith('landmark-')) {
      let uniqueId;
      let attempts = 0;
      
      do {
        uniqueId = `landmark-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;
        attempts++;
        if (attempts > 100) {
          uniqueId = `landmark-${Date.now()}-${Math.random()}`;
          break;
        }
      } while (usedSuffixes.has(uniqueId.split('-')[1]));
      
      usedSuffixes.add(uniqueId.split('-')[1]);
      landmark.id = uniqueId;
    } else {
      const suffix = landmark.id.split('-')[1];
      if (suffix && usedSuffixes.has(suffix)) {
        let uniqueId;
        let attempts = 0;
        
        do {
          uniqueId = `landmark-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;
          attempts++;
          if (attempts > 100) {
            uniqueId = `landmark-${Date.now()}-${Math.random()}`;
            break;
          }
        } while (usedSuffixes.has(uniqueId.split('-')[1]));
        
        usedSuffixes.add(uniqueId.split('-')[1]);
        landmark.id = uniqueId;
      } else if (suffix) {
        usedSuffixes.add(suffix);
      }
    }
  });
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
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

// REACT_015: Create in-page button with proper accessibility
function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.ariaExpanded !== undefined) {
    button.setAttribute('aria-expanded', options.ariaExpanded);
  }
  if (options.ariaControls) {
    button.setAttribute('aria-controls', options.ariaControls);
  }
  if (options.className) {
    button.className = options.className;
  }
  
  return button;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
    issues.push('Table missing accessible name (caption, aria-label, or aria-labelledby)');
  }
  
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.getAttribute('scope') && !header.id) {
      issues.push(`Header cell at index ${index} missing scope attribute or id`);
    }
  });
  
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${rowIndex} has no cells`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead && !table.querySelector('th')) {
    issues.push('Table missing header section (thead or th elements)');
  }
  
  if (thead) {
    const headerRows = thead.querySelectorAll('tr');
    headerRows.forEach((row, index) => {
      const ths = row.querySelectorAll('th');
      if (ths.length === 0) {
        issues.push(`Header row ${index} has no th elements`);
      }
    });
  }
  
  if (tbody) {
    const bodyRows = tbody.querySelectorAll('tr');
    bodyRows.forEach((row, index) => {
      const tds = row.querySelectorAll('td');
      if (tds.length === 0 && row.querySelectorAll('th').length === 0) {
        issues.push(`Body row ${index} has no cells`);
      }
    });
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark
function validateLandmark(element) {
  const issues = [];
  const validRoles = ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'region', 'form'];
  const role = element.getAttribute('role');
  
  if (!role && !['header', 'main', 'nav', 'footer', 'aside', 'section', 'form'].includes(element.tagName.toLowerCase())) {
    issues.push('Element is not a valid landmark');
  } else if (role && !validRoles.includes(role)) {
    issues.push(`Invalid landmark role: ${role}`);
  }
  
  if (role === 'region' && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    issues.push('Region landmark must have accessible name');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="region"], [role="form"], header, main, nav, footer, aside, section, form');
  const issues = [];
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  const contentinfoLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  
  if (mainLandmarks.length === 0) {
    issues.push('Page missing main landmark');
  } else if (mainLandmarks.length > 1) {
    issues.push('Page has multiple main landmarks');
  }
  
  if (bannerLandmarks.length > 1) {
    issues.push('Page has multiple banner landmarks');
  }
  
  if (contentinfoLandmarks.length > 1) {
    issues.push('Page has multiple contentinfo landmarks');
  }
  
  landmarks.forEach((landmark) => {
    const validation = validateLandmark(landmark);
    if (!validation.valid) {
      issues.push(...validation.issues.map(issue => `${landmark.tagName}: ${issue}`));
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark attributes
function validateLandmarkAttributes(landmark) {
  const issues = [];
  const role = landmark.getAttribute('role');
  
  if (role === 'region') {
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      issues.push('Region landmark requires aria-label or aria-labelledby');
    }
  }
  
  if (landmark.id && document.querySelectorAll(`#${landmark.id}`).length > 1) {
    issues.push(`Duplicate landmark ID: ${landmark.id}`);
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (svg.getAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  if (svg.getAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) return labelElement.textContent;
  }
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  return '';
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svg, options = {}) {
  if (options.role) {
    svg.setAttribute('role', options.role);
  } else if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  if (options.ariaLabel) {
    svg.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.ariaLabelledBy) {
    svg.setAttribute('aria-labelledby', options.ariaLabelledBy);
  }
  
  if (options.ariaDescribedBy) {
    svg.setAttribute('aria-describedby', options.ariaDescribedBy);
  }
  
  if (options.focusable !== undefined) {
    svg.setAttribute('focusable', options.focusable);
  }
  
  if (options.title) {
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      svg.insertBefore(titleElement, svg.firstChild);
    }
    titleElement.textContent = options.title;
  }
  
  if (options.desc) {
    let descElement = svg.querySelector('desc');
    if (!descElement) {
      descElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
      svg.appendChild(descElement);
    }
    descElement.textContent = options.desc;
  }
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link.textContent.trim() && !link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
    issues.push('Link missing accessible name');
  }
  
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('javascript:')) {
    if (link.tagName === 'A' && !link.hasAttribute('role')) {
      issues.push('Link has invalid or missing href attribute');
    }
  }
  
  if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
    if (!link.getAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
      issues.push('Link with target="_blank" missing rel="noopener"');
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_036: Handle fake links (elements that look like links but aren't)
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[onclick]:not(a):not(button):not([role="button"]):not([role="link"])');
  const issues = [];
  
  fakeLinks.forEach((element) => {
    issues.push({
      element,
      message: 'Element has onclick handler but is not a proper interactive element',
      fix: () => {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
          }
        });
      }
    });
  });
  
  return {
    count: fakeLinks.length,
    issues
  };
}

// REACT_036: Create in-page button (alias for createInPageButton for clarity)
function createAccessibleButton(text, onClick, options = {}) {
  return createInPageButton(text, onClick, options);
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions() {
  const landmarks = [];
  
  // Ensure header has banner role
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
    landmarks.push({ element: header, role: 'banner' });
  }
  
  // Ensure main has main role
  const main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
    landmarks.push({ element: main, role: 'main' });
  }
  
  // Ensure nav has navigation role
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      if (navs.length > 1 && !nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
      landmarks.push({ element: nav, role: 'navigation' });
    }
  });
  
  // Ensure footer has contentinfo role
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
    landmarks.push({ element: footer, role: 'contentinfo' });
  }
  
  // Ensure aside has complementary role
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    if (!aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
      if (asides.length > 1 && !aside.getAttribute('aria-label') && !aside.getAttribute('aria-labelledby')) {
        aside.setAttribute('aria-label', `Complementary ${index + 1}`);
      }
      landmarks.push({ element: aside, role: 'complementary' });
    }
  });
  
  // Ensure form has form role if it's a landmark form
  const forms = document.querySelectorAll('form[aria-label], form[aria-labelledby]');
  forms.forEach((form) => {
    if (!form.getAttribute('role')) {
      form.setAttribute('role', 'form');
      landmarks.push({ element: form, role: 'form' });
    }
  });
  
  return landmarks;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    // New accessibility functions
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    getSvgAccessibleName,
    setSvgAttributes,
    validateLinkAccessibility,
    handleFakeLinks,
    createAccessibleButton,
    addProperLandmarkRegions,
    ensureUniqueLandmarks
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}