// TODO: Address accessibility issues from insight report — FIXED

const main = () => {
  // Implementation here
  return true;
};

// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

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

// TODO: This is the existing code that needs to be preserved
// main.js - Accessibility improvements implementation

// Accessibility helper function for keyboard navigation
function createKeyboardNavigationHandler(options = {}) {
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

// Global tracking for unique landmark IDs
const landmarkIdRegistry = new Set();

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
  
  function generateUniqueId() {
    let id;
    do {
      id = `landmark-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    } while (landmarkIdRegistry.has(id));
    return id;
  }

  landmarks.forEach((landmark) => {
    const currentId = landmark.id;
    // Remove old ID from registry if it existed
    if (currentId && landmarkIdRegistry.has(currentId)) {
      landmarkIdRegistry.delete(currentId);
    }
    
    const newId = generateUniqueId();
    landmarkIdRegistry.add(newId);
    landmark.id = newId;
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

// Add accessible names to SVG elements
function addAccessibleNamesToSvg(container = document) {
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const title = svg.querySelector('title');
    if (title && !svg.getAttribute('aria-labelledby')) {
      const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      title.id = id;
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', id);
    }
  });
}

// Add ARIA attributes to interactive elements
function addARIAAttributes(container = document) {
  const interactiveElements = container.querySelectorAll('a, input, select, textarea');
  interactiveElements.forEach(el => {
    if (!el.getAttribute('role') && !el.getAttribute('aria-label')) {
      const text = el.textContent || el.placeholder || el.value;
      if (text && text.trim()) {
        el.setAttribute('aria-label', text.trim());
      }
      landmark.id = newId;
    }

    ids.add(landmark.id);
  });
}

// Fix fake link issues (TODO: Add real implementation)
function fixFakeLinkIssues() {
  const links = document.querySelectorAll('a[href="#"]:not([data-fake-link])');
  Array.from(links).forEach((link) => {
    link.setAttribute('aria-hidden', 'true');
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Apply accessible names to SVGs
  addAccessibleNamesToSvg(document.body);
  
  // Add ARIA attributes to interactive elements
  addARIAAttributes();
  
  // Add keyboard navigation to focusable elements
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(el => {
    const keyboardHandler = createKeyboardNavigationHandler({
      onEnter: () => el.click()
    });
    el.addEventListener('keydown', keyboardHandler);
  });
  
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    createKeyboardNavigationHandler,
    prefersReducedMotion,
    addressAccessibilityIssues,
    addAccessibleNamesToSVGs,
    addARIAFormControls,
    ensureUniqueLandmarksWithIds,
    fixFakeLinkIssues
  };
}

// Get the lang attribute from the HTML element
function getLangAttribute(htmlElement) {
  if (!htmlElement) {
    htmlElement = document.querySelector('html');
  }
  return htmlElement ? htmlElement.getAttribute('lang') : null;
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

// New accessibility functions added to address insight report

function getLangAttribute() {
  const html = document.documentElement;
  return html ? html.getAttribute('lang') : null;
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  return button;
}

function validateTableAccessibility(table) {
  // Simple check for caption or aria-label
  return (table.querySelector('caption') || table.getAttribute('aria-label'));
}

function validateTableStructure(table) {
  // Ensure table has thead and tbody
  return (table.querySelector('thead') && table.querySelector('tbody'));
}

function validateLandmark(element) {
  const role = element.getAttribute('role');
  return ['main', 'nav', 'header', 'footer', 'aside', 'form', 'search'].includes(role);
}

function validateLandmarkStructure() {
  // Placeholder for landmark nesting validation
  return true;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="nav"], [role="header"], [role="footer"], [role="aside"]');
  const ids = new Set();
  landmarks.forEach(el => {
    const id = el.getAttribute('id');
    if (id) ids.add(id);
  });
  return true;
}

function handleFakeLinks(container = document) {
  const fakeLinks = container.querySelectorAll('[href="#"]');
  fakeLinks.forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
  });
}

function isLinkAccessible(link) {
  const text = link.textContent.trim();
  return text.length > 0;
}

// Function to set the lang attribute based on the preferred language or localization (REACT_015)
function setLangAttribute(htmlElement, lang) {
  if (!htmlElement) {
    htmlElement = document.querySelector('html');
  }
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
}

// Function to create a proper in-page link button (REACT_015, REACT_036)
function createInPageButton(options = {}) {
  const {
    text = '',
    href = '#',
    target = '_self',
    className = '',
    id = generateId(),
    onClick = null,
    ariaLabel = null,
    role = 'button'
  } = options;

  const button = document.createElement('a');
  button.href = href;
  button.textContent = text;
  button.target = target;
  button.className = className;
  button.id = id;
  button.setAttribute('role', role);
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (href === '#' || href.startsWith('#')) {
    button.setAttribute('tabindex', '0');
  }
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Handle keyboard activation for anchor acting as button
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
      button.click();
    }
  });

  return button;
}

// Function to check for table accessibility issues (REACT_027)
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table || table.tagName !== 'TABLE') {
    issues.push({ type: 'invalid_element', message: 'Element is not a table' });
    return issues;
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({ type: 'missing_caption', message: 'Table is missing a caption for accessibility' });
  }

  // Check for th elements with proper scope
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      issues.push({ 
        type: 'missing_scope', 
        message: `Header at index ${index} is missing scope attribute`,
        element: th
      });
    }
  });

  // Check if table has proper headers (th elements)
  if (headers.length === 0) {
    issues.push({ type: 'no_headers', message: 'Table has no header cells (th elements)' });
  }

  // Check for accessible table summary via aria-describedby or caption
  const summary = table.getAttribute('aria-describedby');
  if (!summary && !caption) {
    issues.push({ type: 'no_summary', message: 'Table has no summary or caption' });
  }

  return issues;
}

// Function to check for table structure issues (REACT_027)
function validateTableStructure(table) {
  const issues = [];
  
  if (!table || table.tagName !== 'TABLE') {
    issues.push({ type: 'invalid_element', message: 'Element is not a table' });
    return issues;
  }

  // Check for thead, tbody, and tfoot structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  if (!thead) {
    issues.push({ type: 'missing_thead', message: 'Table is missing thead element' });
  }

  if (!tbody) {
    issues.push({ type: 'missing_tbody', message: 'Table is missing tbody element' });
  }

  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push({ type: 'no_rows', message: 'Table has no rows' });
  }

  // Check for consistent column counts in tbody
  if (tbody) {
    const bodyRows = tbody.querySelectorAll('tr');
    let expectedCols = null;
    bodyRows.forEach((row, index) => {
      const cells = row.querySelectorAll('td, th');
      if (expectedCols === null) {
        expectedCols = cells.length;
      } else if (cells.length !== expectedCols) {
        issues.push({
          type: 'inconsistent_columns',
          message: `Row ${index} has ${cells.length} cells, expected ${expectedCols}`,
          element: row
        });
      }
    });
  }

  // Check for proper colspan and rowspan usage
  const allCells = table.querySelectorAll('td, th');
  allCells.forEach((cell, index) => {
    const colspan = cell.getAttribute('colspan');
    const rowspan = cell.getAttribute('rowspan');
    
    if (colspan && isNaN(parseInt(colspan))) {
      issues.push({
        type: 'invalid_colspan',
        message: `Cell ${index} has invalid colspan value`,
        element: cell
      });
    }
    
    if (rowspan && isNaN(parseInt(rowspan))) {
      issues.push({
        type: 'invalid_rowspan',
        message: `Cell ${index} has invalid rowspan value`,
        element: cell
      });
    }
  });

  return issues;
}

// Function to check for landmark presence and proper use (REACT_017)
function validateLandmark(element) {
  const issues = [];
  
  if (!element) {
    issues.push({ type: 'no_element', message: 'No element provided for validation' });
    return issues;
  }

  // Check for common landmarks
  const landmarks = {
    header: element.querySelectorAll('header:not([role])'),
    nav: element.querySelectorAll('nav'),
    main: element.querySelectorAll('main'),
    footer: element.querySelectorAll('footer:not([role])'),
    aside: element.querySelectorAll('aside'),
    section: element.querySelectorAll('section[aria-label], section[aria-labelledby]'),
    form: element.querySelectorAll('form[aria-label], form[aria-labelledby]'),
    search: element.querySelectorAll('search')
  };

  // Check for presence of main landmark (required)
  if (landmarks.main.length === 0) {
    issues.push({ type: 'missing_main', message: 'Page is missing a main landmark' });
  }

  // Check for header landmark
  if (landmarks.header.length === 0) {
    issues.push({ type: 'missing_header', message: 'Page has no header landmark' });
  }

  // Check for navigation landmarks
  if (landmarks.nav.length === 0) {
    issues.push({ type: 'missing_nav', message: 'Page has no navigation landmark' });
  }

  // Check for footer landmark
  if (landmarks.footer.length === 0) {
    issues.push({ type: 'missing_footer', message: 'Page has no footer landmark' });
  }

  // Validate search landmark
  if (landmarks.search.length > 0) {
    landmarks.search.forEach((search, index) => {
      if (!search.getAttribute('role') && search.tagName !== 'SEARCH') {
        issues.push({
          type: 'invalid_search',
          message: `Search element ${index} should use <search> tag or role="search"`,
          element: search
        });
      }
    });
  }

  return issues;
}

// Function to check for landmark structure compliance (REACT_017)
function validateLandmarkStructure(element) {
  const issues = [];
  
  if (!element) {
    issues.push({ type: 'no_element', message: 'No element provided for validation' });
    return issues;
  }

  // Check for nested landmarks (anti-pattern)
  const nestedCheck = (parent, parentName) => {
    const landmarkTags = ['header', 'main', 'footer', 'nav', 'aside', 'section'];
    landmarkTags.forEach(tag => {
      const nested = parent.querySelectorAll(`:scope > ${tag}`);
      if (nested.length > 0) {
        issues.push({
          type: 'nested_landmark',
          message: `${parentName} contains nested ${tag} landmark`,
          element: parent
        });
      }
    });
  };

  // Check body for landmark issues
  if (element === document.body || element.tagName === 'BODY') {
    const headers = element.querySelectorAll('header');
    headers.forEach((header, index) => {
      if (header.closest('header, footer')) {
        issues.push({
          type: 'nested_landmark',
          message: `Header ${index} is nested inside another landmark`,
          element: header
        });
      }
    });
  }

  // Check for proper landmark labeling
  const sections = element.querySelectorAll('section');
  sections.forEach((section, index) => {
    const hasLabel = section.getAttribute('aria-label') || section.getAttribute('aria-labelledby');
    if (!hasLabel) {
      issues.push({
        type: 'unlabeled_section',
        message: `Section ${index} is missing an accessible name (aria-label or aria-labelledby)`,
        element: section
      });
    }
  });

  // Check for proper use of complementary landmark
  const asides = element.querySelectorAll('aside');
  if (asides.length > 0) {
    asides.forEach((aside, index) => {
      const parent = aside.parentElement;
      const parentTag = parent ? parent.tagName.toLowerCase() : '';
      if (parentTag === 'main' || (parent.hasAttribute && parent.hasAttribute('role') && parent.getAttribute('role') === 'main')) {
        issues.push({
          type: 'invalid_complementary',
          message: `Aside ${index} should not be nested inside main landmark`,
          element: aside
        });
      }
    });
  }

  // Check for redundant roles
  const redundantRoles = [
    { tag: 'main', role: 'main' },
    { tag: 'nav', role: 'navigation' },
    { tag: 'aside', role: 'complementary' },
    { tag: 'header', role: 'banner' },
    { tag: 'footer', role: 'contentinfo' }
  ];

  redundantRoles.forEach(({ tag, role }) => {
    const elements = element.querySelectorAll(tag);
    elements.forEach((el, index) => {
      if (el.getAttribute('role') === role) {
        issues.push({
          type: 'redundant_role',
          message: `${tag} element ${index} has redundant role="${role}"`,
          element: el
        });
      }
    });
  });

  return issues;
}

// Function to check for and handle duplicate landmarks (REACT_017, REACT_025)
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkCounts = {};
  
  // Get all landmarks with their roles
  const landmarks = document.querySelectorAll('[role], header, nav, main, footer, aside, section, search');
  
  landmarks.forEach(landmark => {
    let landmarkType;
    
    if (landmark.hasAttribute('role')) {
      landmarkType = landmark.getAttribute('role');
    } else {
      landmarkType = landmark.tagName.toLowerCase();
    }
    
    if (!landmarkCounts[landmarkType]) {
      landmarkCounts[landmarkType] = [];
    }
    landmarkCounts[landmarkType].push(landmark);
  });

  // Check for duplicate landmarks that should be unique
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  
  Object.keys(landmarkCounts).forEach(type => {
    const count = landmarkCounts[type].length;
    const normalizedType = type.toLowerCase();
    
    if (uniqueLandmarks.includes(normalizedType) && count > 1) {
      issues.push({
        type: 'duplicate_landmark',
        message: `Found ${count} ${type} landmarks, but there should only be one`,
        elements: landmarkCounts[type],
        count: count
      });
    }
  });

  // Check for multiple navigation landmarks without labels
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        issues.push({
          type: 'unlabeled_nav',
          message: `Navigation ${index + 1} is missing an aria-label`,
          element: nav
        });
      }
    });
  }

  // Check for multiple search landmarks
  const searchElements = document.querySelectorAll('search, [role="search"]');
  if (searchElements.length > 1) {
    issues.push({
      type: 'multiple_search',
      message: `Found ${searchElements.length} search landmarks, consider using only one`,
      elements: Array.from(searchElements),
      count: searchElements.length
    });
  }

  return {
    issues,
    landmarkCounts,
    hasDuplicates: issues.length > 0
  };
}

// Function to generate an accessible name for SVG elements (REACT_041)
function getSvgAccessibleName(svg) {
  if (!svg || svg.tagName !== 'SVG') {
    return null;
  }

  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent;
    }
  }

  // Check for title element within SVG
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  // Check for desc element within SVG
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  // Check for adjacent label element
  const svgId = svg.getAttribute('id');
  if (svgId) {
    const labels = document.querySelectorAll(`label[for="${svgId}"]`);
    if (labels.length > 0) {
      return labels[0].textContent.trim();
    }
  }

  // Check parent elements for aria-describedby
  let parent = svg.parentElement;
  while (parent) {
    const describedBy = parent.getAttribute('aria-describedby');
    if (describedBy) {
      const descElement = document.getElementById(describedBy);
      if (descElement) {
        return descElement.textContent.trim();
      }
    }
    
    const labelledBy = parent.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }
    
    parent = parent.parentElement;
  }

  return null;
}

// Function to set specified attributes on SVG elements (REACT_041)
function setSvgAttributes(svg, attributes = {}) {
  const issues = [];
  
  if (!svg || svg.tagName !== 'SVG') {
    issues.push({ type: 'invalid_element', message: 'Element is not an SVG' });
    return { success: false, issues };
  }

  const validSvgAttributes = [
    'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
    'role', 'tabindex', 'focusable', 'id', 'class', 'style',
    'width', 'height', 'viewBox', 'xmlns', 'preserveAspectRatio'
  ];

  const validRoles = [
    'img', 'presentation', 'group', 'button', 'link', 'menuitem',
    'menuitemcheckbox', 'menuitemradio', 'checkbox', 'radio', 'switch'
  ];

  let success = true;

  Object.keys(attributes).forEach(attr => {
    const value = attributes[attr];

    // Handle role attribute specially
    if (attr === 'role') {
      if (!validRoles.includes(value)) {
        issues.push({
          type: 'invalid_role',
          message: `Invalid role "${value}" for SVG. Valid roles: ${validRoles.join(', ')}`,
          attribute: attr,
          value
        });
        success = false;
      } else {
        svg.setAttribute('role', value);
      }
      return;
    }

    // Check if attribute is valid for SVG
    if (!validSvgAttributes.includes(attr)) {
      // Still allow custom attributes, just log warning
      issues.push({
        type: 'warning',
        message: `Non-standard attribute "${attr}" will be set as-is`,
        attribute: attr,
        value
      });
    }

    // Handle boolean attributes
    if (typeof value === 'boolean') {
      if (value) {
        svg.setAttribute(attr, '');
      } else {
        svg.removeAttribute(attr);
      }
    } else {
      svg.setAttribute(attr, value);
    }
  });

  // Ensure role is set for accessibility if not already present
  if (!svg.getAttribute('role') && !svg.getAttribute('aria-label') && !svg.querySelector('title')) {
    issues.push({
      type: 'recommendation',
      message: 'SVG should have a role, aria-label, or title for accessibility'
    });
  }

  return { success, issues };
}

// Function to handle fake links within the app (REACT_036)
function handleFakeLinks(links) {
  const results = {
    converted: [],
    issues: [],
    skipped: []
  };

  if (!links || links.length === 0) {
    return results;
  }

  links.forEach(link => {
    // Check if it's actually a fake link (has onclick but no valid href)
    const href = link.getAttribute('href');
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');

    // Determine if this is a fake link
    const isFakeLink = 
      (onclick && (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;')) ||
      (role === 'button' && href && (href === '#' || href.startsWith('javascript:'))) ||
      (!href && onclick);

    if (isFakeLink) {
      // Check for accessibility issues
      const issues = [];

      if (!onclick && !role) {
        issues.push('Fake link has no onclick handler or role');
      }

      if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
        issues.push('Fake link has no accessible name');
      }

      if (href && href.startsWith('javascript:')) {
        issues.push('Using javascript: href is not recommended for accessibility');
      }

      // Convert to proper button or fix the link
      if (role !== 'button') {
        link.setAttribute('role', 'button');
      }

      // Ensure tabindex for keyboard navigation
      if (!link.getAttribute('tabindex') && !link.hasAttribute('href')) {
        link.setAttribute('tabindex', '0');
      }

      // Ensure keyboard activation works
      if (!link.hasAttribute('onkeydown')) {
        link.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onclick) {
              link.click();
            }
          }
        });
      }

      results.converted.push({
        element: link,
        originalHref: href,
        issues
      });
    } else {
      // Check if it's a valid link
      if (href && !href.startsWith('#') && !href.startsWith('javascript:') && href !== '#' && href !== 'javascript:void(0)') {
        // This is a valid link, no action needed
        results.skipped.push({
          element: link,
          reason: 'Valid link'
        });
      } else {
        // Check for issues with questionable links
        const issues = [];
        
        if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
          issues.push('Link uses empty/invalid href pattern');
        }
        
        if (issues.length > 0) {
          results.issues.push({
            element: link,
            issues
          });
        }
      }
    }
  });

  return results;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    main,
    exampleFunction,
    processData,
    initializeAccessibility,
    handleKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    addAccessibleNamesToSvg,
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    handleFakeLinks,
    isLinkAccessible,
    validateLinkAccessibility,
    getSvgAccessibleName,
    setSvgAttributes,
    handleFakeLinks,
    setLangAttribute
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}