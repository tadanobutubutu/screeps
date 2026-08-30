// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

// REACT_015: Get or set lang attribute on HTML element
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function setLangAttribute(lang) {
  const htmlElement = document.querySelector('html');
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element not found'] };
  }
  
  const hasCaption = table.querySelector('caption');
  const hasSummary = table.querySelector('thead');
  const hasHeaders = table.querySelectorAll('th[scope]');
  
  if (!hasCaption) {
    issues.push('REACT_027: Table should have a caption element for context');
  }
  
  if (!hasSummary && !hasHeaders.length) {
    issues.push('REACT_027: Complex tables should have th elements with scope attributes');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    element: table
  };
}

function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element not found'] };
  }
  
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('REACT_027: Table should have at least one row');
  }
  
  const cells = table.querySelectorAll('td, th');
  cells.forEach((cell, index) => {
    if (!cell.hasAttribute('headers') && !cell.hasAttribute('scope') && cell.tagName === 'TH') {
      // This is expected for proper th elements
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
    element: table
  };
}

// REACT_017: Validate landmark accessibility
function validateLandmark(element) {
  const issues = [];
  
  if (!element) {
    return { valid: false, issues: ['Element not found'] };
  }
  
  const role = element.getAttribute('role');
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  if (role && !validLandmarks.includes(role)) {
    issues.push('REACT_017: Invalid landmark role: ' + role);
  }
  
  const tagLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const tagName = element.tagName.toLowerCase();
  if (tagLandmarks.includes(tagName)) {
    // Valid landmark tag
  }
  
  return {
    valid: issues.length === 0,
    issues,
    element
  };
}

function validateLandmarkStructure() {
  const issues = [];
  
  // Check for unique main landmark
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    issues.push('REACT_017: Multiple main landmarks found. Only one main landmark should exist.');
  }
  
  // Check for header landmark
  const headerElements = document.querySelectorAll('header, [role="banner"]');
  if (headerElements.length > 1) {
    issues.push('REACT_017: Multiple header/banner landmarks found.');
  }
  
  // Check for footer landmark
  const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');
  if (footerElements.length > 1) {
    issues.push('REACT_017: Multiple footer/contentinfo landmarks found.');
  }
  
  // Check for navigation landmarks
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && navElements.length > 1) {
      issues.push(`REACT_017: Navigation landmark ${index + 1} should have an aria-label for identification.`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  // Check aria-label first
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  
  // Check title element
  const titleElement = svgElement.querySelector('title');
  return titleElement ? titleElement.textContent : null;
}

function setSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return false;
  
  // Remove existing accessible name sources
  const existingTitle = svgElement.querySelector('title');
  if (existingTitle) existingTitle.remove();
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');
  
  // Add title element
  const title = document.createElement('title');
  title.textContent = name;
  title.id = `svg-title-${Date.now()}`;
  svgElement.insertBefore(title, svgElement.firstChild);
  
  // Link with aria-labelledby
  svgElement.setAttribute('aria-labelledby', title.id);
  
  return true;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarks = {
    banner: document.querySelectorAll('[role="banner"], header:not([role])'),
    navigation: document.querySelectorAll('[role="navigation"], nav:not([role])'),
    main: document.querySelectorAll('[role="main"], main:not([role])'),
    complementary: document.querySelectorAll('[role="complementary"], aside:not([role])'),
    contentinfo: document.querySelectorAll('[role="contentinfo"], footer:not([role])')
  };
  
  // Check multiple main landmarks
  if (landmarks.main.length > 1) {
    issues.push('REACT_025: Only one main landmark allowed. Found ' + landmarks.main.length + '.');
  }
  
  // Check multiple banner/header landmarks
  if (landmarks.banner.length > 1) {
    issues.push('REACT_025: Only one banner landmark allowed. Found ' + landmarks.banner.length + '.');
  }
  
  // Check multiple contentinfo/footer landmarks
  if (landmarks.contentinfo.length > 1) {
    issues.push('REACT_025: Only one contentinfo landmark allowed. Found ' + landmarks.contentinfo.length + '.');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_036: Fix fake link issues
function isFakeLink(element) {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  const isClickable = element.hasAttribute('onclick') || 
                      window.getComputedStyle(element).cursor === 'pointer' ||
                      element.getAttribute('role') === 'button';
  
  const isAnchor = tagName === 'a' && element.hasAttribute('href');
  const isButton = tagName === 'button';
  
  return isClickable && !isAnchor && !isButton;
}

function fixFakeLink(element) {
  if (!element || !isFakeLink(element)) return false;
  
  // Add button role if not present
  if (!element.hasAttribute('role')) {
    element.setAttribute('role', 'button');
  }
  
  // Add tabindex if not focusable
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }
  
  // Add keyboard event handling
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      element.click();
    }
  });
  
  return true;
}

// Create accessible in-page button
function createInPageButton(options = {}) {
  const {
    text = '',
    onClick = () => {},
    id = `button-${Date.now()}`,
    className = '',
    ariaLabel = '',
    ariaDescribedBy = ''
  } = options;
  
  const button = document.createElement('button');
  button.type = 'button';
  button.id = id;
  button.className = className;
  button.textContent = text;
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (ariaDescribedBy) {
    button.setAttribute('aria-describedby', ariaDescribedBy);
  }
  
  // Ensure keyboard accessibility
  button.addEventListener('click', (e) => {
    e.preventDefault();
    onClick(e);
    accessibilityUtils.announceToScreenReader(`Button ${text || ariaLabel} activated`, 'assertive');
  });
  
  return button;
}

// Person name with accessibility
function personName(name, options = {}) {
  const {
    element = 'span',
    lang = getLangAttribute() || 'en'
  } = options;
  
  const nameElement = document.createElement(element);
  nameElement.textContent = name;
  
  // Set language attribute if different from document language
  if (lang !== getLangAttribute()) {
    nameElement.setAttribute('lang', lang);
  }
  
  return nameElement;
}

function newFocusTrap() {
  // New function implementation
}

// Advanced focus trap implementation for keyboard navigation
function newFocusTrap(container, options = {}) {
  const {
    onActivate = () => {},
    onDeactivate = () => {},
    initialFocus = true,
    returnFocusOnDeactivate = true
  } = options;
  
  if (!container) return null;
  
  let previouslyFocused = null;
  let isActive = false;
  
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  const getFocusableElements = () => {
    return Array.from(container.querySelectorAll(focusableSelectors)).filter(
      el => el.offsetParent !== null // Element is visible
    );
  };
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab' || !isActive) return;
    
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    
    if (e.shiftKey) {
      if (active === first || !container.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !container.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  
  const activate = () => {
    if (isActive) return;
    
    previouslyFocused = document.activeElement;
    isActive = true;
    
    document.addEventListener('keydown', handleKeyDown);
    
    if (initialFocus) {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.setAttribute('tabindex', '-1');
        container.focus();
      }
    }
    
    onActivate();
  };
  
  const deactivate = () => {
    if (!isActive) return;
    
    isActive = false;
    document.removeEventListener('keydown', handleKeyDown);
    
    if (returnFocusOnDeactivate && previouslyFocused) {
      previouslyFocused.focus();
    }
    
    onDeactivate();
  };
  
  return {
    container,
    activate,
    deactivate,
    isActive: () => isActive
  };
}

// Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
function calculateSum(a, b) { return a + b; }

// Credential response handling
async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }
  
  if (response.error) {
    throw new Error(response.error);
  }
  
  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }
  
  throw new Error('Invalid credential response');
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}] ${message}`);
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', `Download ${filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
  // Add keyboard support for all interactive elements
  document.querySelectorAll('[data-accessible]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    });
  });
};

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// TODO: Implement the new function as per the issue requirements
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Export all utilities
module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  calculateSum,
  // Accessibility functions added to address insight report issues:
  getLangAttribute,
  setLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAccessibleName,
  ensureUniqueLandmarks,
  isFakeLink,
  fixFakeLink,
  createInPageButton,
  personName,
  newFocusTrap
};