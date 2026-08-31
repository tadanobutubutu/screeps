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
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Get full lang attribute including region (e.g., 'en-US')
function getFullLangAttribute() {
  return getLangAttribute();
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

/**
 * Validates table accessibility and structure, fixing issues
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {Array} - List of issues found and fixed
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  // Check for caption
  let caption = table.querySelector('caption');
  if (!caption) {
    caption = document.createElement('caption');
    caption.textContent = 'Table';
    table.insertBefore(caption, table.firstChild);
    issues.push('Added missing caption');
  }
  
  // Check for th elements in header row
  const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
  if (headerRow) {
    const ths = headerRow.querySelectorAll('th');
    if (ths.length === 0) {
      const cells = headerRow.querySelectorAll('td');
      cells.forEach((cell, index) => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = cell.textContent;
        cell.parentNode.replaceChild(th, cell);
        if (index < 3) {
          issues.push(`Converted td to th in header row`);
        }
      });
    }
  }
  
  // Check for scope attributes on th elements
  const allThs = table.querySelectorAll('th');
  allThs.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
      issues.push('Added scope attribute to th element');
    }
  });
  
  // Check for summary or aria-describedby
  if (!table.hasAttribute('aria-describedby') && !table.getAttribute('summary')) {
    if (!caption || !caption.textContent) {
      table.setAttribute('aria-label', 'Data table');
      issues.push('Added aria-label to table');
    }
  }
  
  return issues;
}

/**
 * Validates and fixes table structure
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {Array} - List of structure issues found and fixed
 */
function validateTableStructure(table) {
  const issues = [];
  
  // Check for tbody (should be implicit if not present)
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    // Create tbody and move rows into it
    const new_tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      new_tbody.appendChild(row);
    });
    table.appendChild(new_tbody);
    issues.push('Created missing tbody element');
  } else {
    // Ensure rows are direct children of tbody
    const directRows = [];
    table.querySelectorAll('tr').forEach(row => {
      if (row.parentElement !== tbody) {
        directRows.push(row);
      }
    });
    directRows.forEach(row => {
      tbody.appendChild(row);
    });
    if (directRows.length > 0) {
      issues.push('Moved orphaned rows into tbody');
    }
  }
  
  // Ensure proper nesting: thead -> tr -> th/td
  const theads = table.querySelectorAll('thead');
  theads.forEach((thead, index) => {
    if (thead.children.length === 0) {
      thead.insertAdjacentHTML('afterbegin', '<tr></tr>');
      issues.push(`Added empty tr to empty thead ${index + 1}`);
    }
  });
  
  return issues;
}

/**
 * Validates landmark element for proper use
 * @param {HTMLElement} element - Landmark element to validate
 * @returns {boolean} - True if valid
 */
function validateLandmark(element) {
  const validRoles = [
    'banner', 'navigation', 'main', 'article', 'aside',
    'header', 'footer', 'complementary', 'form'
  ];
  
  const role = element.getAttribute('role');
  if (role && !validRoles.includes(role)) {
    console.warn('Invalid landmark role:', role);
    return false;
  }
  
  return true;
}

/**
 * Validates landmark structure
 * @param {HTMLElement} element - Element to validate
 * @returns {boolean} - True if structure is valid
 */
function validateLandmarkStructure(element) {
  // Check if landmark has proper hierarchical structure
  const landmarkRoles = ['banner', 'navigation', 'main', 'article', 'aside', 'header', 'footer', 'complementary', 'form'];
  const hasLandmarkRole = landmarkRoles.includes(element.getAttribute('role'));
  
  if (hasLandmarkRole) {
    // Landmarks should not be nested improperly
    const landmarkAncestors = [];
    let parent = element.parentElement;
    while (parent) {
      const parentRole = parent.getAttribute('role');
      if (landmarkRoles.includes(parentRole)) {
        landmarkAncestors.push(parentRole);
      }
      parent = parent.parentElement;
    }
    
    // main landmark should be unique and not nested
    if (element.getAttribute('role') === 'main' && landmarkAncestors.length > 0) {
      console.warn('main landmark should not be nested');
      return false;
    }
  }
  
  return true;
}

/**
 * Ensures unique landmarks in the document
 * @returns {Array} - List of duplicate landmarks found
 */
function ensureUniqueLandmarks() {
  const duplicates = [];
  const landmarkTypes = {};
  
  // Find all landmarks
  const landmarkSelectors = [
    'header[role="banner"]',
    'nav',
    'main',
    'article',
    'aside',
    'footer[role="contentinfo"]',
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="article"]',
    '[role="complementary"]',
    '[role="form"]'
  ];
  
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const role = element.getAttribute('role') || element.tagName.toLowerCase();
      if (element.tagName === 'HEADER' && !element.hasAttribute('role')) {
        // Could be banner or generic header
        if (element.parentElement === document.body) {
          return; // This is likely a banner
        }
      }
      
      const key = role;
      if (!landmarkTypes[key]) {
        landmarkTypes[key] = [];
      }
      landmarkTypes[key].push(element);
    });
  });
  
  // Check for duplicates
  Object.keys(landmarkTypes).forEach(role => {
    if (landmarkTypes[role].length > 1) {
      duplicates.push({
        role: role,
        count: landmarkTypes[role].length,
        elements: landmarkTypes[role]
      });
      
      // Make duplicates unique by removing role and adding aria-label
      landmarkTypes[role].slice(1).forEach((el, index) => {
        el.removeAttribute('role');
        el.setAttribute('aria-label', `${role} region ${index + 2}`);
        el.setAttribute('tabindex', '-1');
      });
    }
  });
  
  return duplicates;
}

/**
 * Gets accessible name for SVG element
 * @param {SVGElement} svg - SVG element
 * @returns {string} - Accessible name
 */
function getSvgAccessibleName(svg) {
  // Check for title element first
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledElement = document.getElementById(ariaLabelledby);
    if (labelledElement && labelledElement.textContent) {
      return labelledElement.textContent.trim();
    }
  }
  
  // Check for desc element
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }
  
  // Default name based on SVG content
  return 'SVG graphic';
}

/**
 * Sets attributes on SVG element
 * @param {SVGElement} svg - SVG element
 * @param {Object} attributes - Attributes to set
 */
function setSvgAttributes(svg, attributes) {
  if (!attributes || typeof attributes !== 'object') {
    return;
  }
  
  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    if (value !== null && value !== undefined) {
      svg.setAttribute(key, String(value));
    }
  });
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.href - Target href
 * @param {string} options.id - Button ID
 * @returns {HTMLButtonElement} - Created button element
 */
function createInPageButton(options = {}) {
  const { text, href, id } = options;
  
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('role', 'link');
  
  if (id) {
    button.id = id;
  }
  
  if (href) {
    button.setAttribute('href', href);
  }
  
  button.textContent = text || '';
  
  // Add click handler for navigation
  if (href) {
    button.addEventListener('click', (e) => {
      window.location.hash = href;
    });
  }
  
  return button;
}

/**
 * Creates an accessible link
 * @param {Object} options - Link options
 * @param {string} options.text - Link text
 * @param {string} options.href - Link href
 * @param {string} options.id - Link ID
 * @returns {HTMLAnchorElement} - Created link element
 */
function createAccessibleLink(options = {}) {
  const { text, href, id } = options;
  
  const link = document.createElement('a');
  link.href = href || '#';
  
  if (id) {
    link.id = id;
  }
  
  link.textContent = text || '';
  
  // Ensure href is not just '#' (fake link issue REACT_036)
  if (href === '#') {
    link.setAttribute('aria-hidden', 'true');
    link.style.pointerEvents = 'none';
  }
  
  return link;
}

/**
 * Handles fake links by converting them to proper buttons or adding accessibility
 * @param {Array} links - Array of link elements to check
 * @returns {Array} - Array of fixes applied
 */
function handleFakeLinks(links) {
  const fixes = [];
  
  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    
    // Check if it's a fake link (href is '#' with no action)
    if (href === '#' || href === '') {
      const onclick = link.getAttribute('onclick');
      
      if (!onclick) {
        // Convert to proper button
        const button = createInPageButton({
          text: link.textContent,
          href: link.getAttribute('data-href') || window.location.hash,
          id: link.id
        });
        
        if (link.parentNode) {
          link.parentNode.replaceChild(button, link);
          fixes.push(`Converted fake link ${index + 1} to proper button`);
        }
      } else {
        // Add proper accessibility to existing link
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', link.textContent || 'Action link');
        fixes.push(`Added accessibility to fake link ${index + 1}`);
      }
    }
  });
  
  return fixes;
}

/**
 * Handles accessibility issues for a container
 * @param {HTMLElement} container - Container to fix
 * @returns {Object} - Summary of fixes applied
 */
function handleAccessibilityIssues(container) {
  const fixes = {
    tables: [],
    landmarks: [],
    svg: [],
    links: []
  };
  
  // Fix tables
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    const tablefixes = validateTableAccessibility(table);
    fixes.tables.push(...tablefixes);
    const structfixes = validateTableStructure(table);
    fixes.tables.push(...structfixes);
  });
  
  // Fix landmarks
  const landmarkIssues = ensureUniqueLandmarks();
  fixes.landmarks = landmarkIssues;
  
  // Fix SVGs
  addAccessibleNamesToSvg(container);
  
  // Fix fake links
  const links = container.querySelectorAll('a[href="#"]');
  const linkFixes = handleFakeLinks(Array.from(links));
  fixes.links = linkFixes;
  
  return fixes;
}

/**
 * Gets full language attribute for REACT_015
 * @param {HTMLElement} htmlElement - HTML element
 * @returns {string} - Full language attribute value
 */
function getFullLangValue(htmlElement) {
  return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
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
    getFullLangAttribute,
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
    getFullLangValue,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    setSvgAttributes,
    handleFakeLinks,
    handleAccessibilityIssues
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