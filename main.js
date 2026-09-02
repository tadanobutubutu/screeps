const fs = require('fs');
const main = require('./utilities');

/**
 * Sets ARIA attributes for better screen reader support
 * @param {HTMLElement} element - DOM element to enhance
 * @param {Object} attributes - ARIA attributes to set
 */
function setAriaAttributes(element, attributes) {
  if (!element || typeof element !== 'object') return;

  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith('aria-')) {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Makes an element focusable programmatically
 * @param {HTMLElement} element - Element to make focusable
 * @param {boolean} focusable - Whether element should be focusable
 */
function setFocusable(element, focusable = true) {
  if (!element) return;

  if (focusable) {
    element.setAttribute('tabindex', '0');
  } else {
    element.removeAttribute('tabindex');
  }
}

/**
 * Adds keyboard navigation support for elements
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Navigation options
 */
function addKeyboardNavigation(container, options = {}) {
  if (!container) return;

  const defaultOptions = {
    focusSelector: '[tabindex="0"]',
    loop: true,
    ...options
  };

  const focusableElements = Array.from(container.querySelectorAll(defaultOptions.focusSelector));

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      navigateFocus(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      navigateFocus(-1);
    }
  });

  function navigateFocus(direction) {
    const currentIndex = focusableElements.indexOf(document.activeElement);
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
      newIndex = defaultOptions.loop ? focusableElements.length - 1 : 0;
    } else if (newIndex >= focusableElements.length) {
      newIndex = defaultOptions.loop ? 0 : focusableElements.length - 1;
    }

    focusableElements[newIndex]?.focus();
  }
}

/**
 * Ensures proper contrast ratio for text elements
 * @param {HTMLElement} element - Text element to check
 * @param {number} minRatio - Minimum contrast ratio (1-21)
 */
function ensureTextContrast(element, minRatio = 4.5) {
  if (!element || !window.getComputedStyle) return;

  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  const textColor = style.color;

  // Simple contrast calculation (for demonstration)
  const contrast = calculateContrast(textColor, bgColor);

  if (contrast < minRatio) {
    console.warn(`Contrast ratio (${contrast.toFixed(1)}) is below recommended minimum (${minRatio}) for element:`, element);
    // In a real implementation, you might adjust colors here
  }
}

// Helper function for contrast calculation
function calculateContrast(color1, color2) {
  // This is a simplified version - real implementation would need proper color parsing
  // and luminance calculation according to WCAG standards
  return Math.random() * 20 + 1; // Mock value for demonstration
}

// Existing function
function existingFunction() {
  // Function implementation
}

// Accessibility-related functions
function setAriaLabel(element, label) {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('aria-label', label);
  }
}

function ensureKeyboardAccessibility(element) {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
  }
}

function ensureAccessibleAttributes(element, attributes) {
  if (!element) return;

  // Ensure required accessibility attributes are present
  Object.entries(attributes).forEach(([attr, value]) => {
    if (!element.hasAttribute(attr)) {
      element.setAttribute(attr, value);
    }
  });
}

function makeFocusable(element, tabindex = 0) {
  if (!element) return;

  // Ensure element is focusable
  element.setAttribute('tabindex', tabindex.toString());
}

function addAriaLabel(element, label) {
  if (!element || !label) return;

  element.setAttribute('aria-label', label);
}

// New function to analyze dependency graph
function analyzeDependencyGraph(graph) {
  // Implementation for analyzing dependency graph
  console.log('Analyzing dependency graph:', graph);
}

// New function to visualize dependencies
function visualizeDependencies(dependencies) {
  // Implementation for visualizing dependencies
  console.log('Visualizing dependencies:', dependencies);
}

// Utility function for logging
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
};

// Accessibility fixes application function
const applyAccessibilityFixes = (elements) => {
  const fixes = {
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  // Fix landmarks
  elements.forEach(element => {
    if (element.tagName && !element.getAttribute('role') && 
        ['HEADER', 'NAV', 'MAIN', 'SECTION', 'ASIDE', 'FOOTER'].includes(element.tagName)) {
      const roleMap = {
        'HEADER': 'banner',
        'NAV': 'navigation',
        'MAIN': 'main',
        'SECTION': 'region',
        'ASIDE': 'complementary',
        'FOOTER': 'contentinfo'
      };
      element.setAttribute('role', roleMap[element.tagName]);
      fixes.landmarksFixed++;
    }
  });

  // Fix SVG accessibility
  elements.forEach(element => {
    if (element.tagName === 'SVG' && !element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', 'SVG Icon');
      fixes.svgNamesAdded++;
    }
  });

  // Fix fake links
  elements.forEach(element => {
    if (element.tagName === 'DIV' && element.getAttribute('role') === 'link' && 
        !element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
      fixes.fakeLinksFixed++;
    }
  });

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
};

// Focus trap for keyboard navigation
const focusTrap = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  let activeElementIndex = 0;

  function setActiveElement(index) {
    if (index < 0) {
      index = focusableElements.length - 1;
    } else if (index >= focusableElements.length) {
      index = 0;
    }

    if (focusableElements[index]) {
      focusableElements[index].focus();
    } else {
      focusableElements[0].focus();
    }
    activeElementIndex = index;
  }

  function nextFocusableElement() {
    setActiveElement(activeElementIndex + 1);
  }

  function prevFocusableElement() {
    setActiveElement(activeElementIndex - 1);
  }

  function moveFocusToFirst() {
    setActiveElement(0);
  }

  function moveFocusToLast() {
    setActiveElement(focusableElements.length - 1);
  }

  element.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Tab':
        if (e.shiftKey) {
          prevFocusableElement();
        } else {
          nextFocusableElement();
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        prevFocusableElement();
        e.preventDefault();
        break;
      case 'ArrowRight':
        nextFocusableElement();
        e.preventDefault();
        break;
      case 'Home':
        moveFocusToFirst();
        e.preventDefault();
        break;
      case 'End':
        moveFocusToLast();
        e.preventDefault();
        break;
    }
  });
};

// Create a button with correct accessibility properties for in-page linking
const createInPageButton = (text, onClick, ariaLabel = null) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  return button;
};

// Create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
const createWebResourceButton = (url, iconSrc, ariaLabel) => {
  const button = document.createElement('button');
  button.setAttribute('aria-label', ariaLabel);
  button.innerHTML = `<img src="${iconSrc}" alt="" />`;
  button.addEventListener('click', () => window.open(url, '_blank'));
  return button;
};

// Validate the table structure for accessibility issues
const validateTableAccessibility = (table) => {
  if (!table) {
    throw new Error('Invalid table element provided');
  }

  const issues = [];

  // Check for missing table headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table is missing header cells (th elements)');
  }

  // Check for scope attributes on headers
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      issues.push('Header cell is missing scope attribute');
    }
  });

  // Check for missing captions
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table is missing a caption');
  }

  // Check for proper table structure (thead, tbody, tfoot)
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  if (!thead) {
    issues.push('Table is missing thead section');
  }

  if (!tbody) {
    issues.push('Table is missing tbody section');
  }

  // Check for data cells in header rows
  const headerRows = table.querySelectorAll('thead tr');
  headerRows.forEach(row => {
    const dataCells = row.querySelectorAll('td');
    if (dataCells.length > 0) {
      issues.push('Header row contains data cells (td elements)');
    }
  });

  return issues.length > 0 ? issues : null;
};

const validateTableStructure = (table) => {
  if (!table) {
    throw new Error('Invalid table element provided');
  }

  const issues = [];

  // Check for proper table structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  if (!thead) {
    issues.push('Table is missing thead section');
  }

  if (!tbody) {
    issues.push('Table is missing tbody section');
  }

  // Check for empty table
  if (thead && thead.children.length === 0 && tbody && tbody.children.length === 0) {
    issues.push('Table is empty (no rows in thead or tbody)');
  }

  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      issues.push('Row is missing cells (th or td elements)');
    }
  });

  return issues.length > 0 ? issues : null;
};

// Validate the landmark structure for accessibility issues
const validateLandmark = (element) => {
  if (!element) {
    throw new Error('Invalid element provided');
  }

  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const role = element.getAttribute('role');

  if (role && !landmarkRoles.includes(role)) {
    issues.push(`Invalid landmark role: ${role}`);
  }

  return issues.length > 0 ? issues : null;
};

const validateLandmarkStructure = (element) => {
  if (!element) {
    throw new Error('Invalid element provided');
  }

  const issues = [];
  const role = element.getAttribute('role');
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (role && !landmarkRoles.includes(role)) {
    issues.push(`Element has invalid landmark role: ${role}`);
  }

  // Check for nested landmarks
  const childLandmarks = element.querySelectorAll('[role]');
  childLandmarks.forEach(child => {
    const childRole = child.getAttribute('role');
    if (landmarkRoles.includes(childRole)) {
      issues.push(`Nested landmark detected: ${childRole} inside ${role || 'non-landmark'}`);
    }
  });

  return issues.length > 0 ? issues : null;
};

// Extract the accessible name for an SVG from its content
const getSvgAccessibleName = (svg) => {
  if (!svg || svg.tagName !== 'SVG') {
    throw new Error('Invalid SVG element provided');
  }

  // Check for aria-label attribute
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }

  // Check for aria-labelledby attribute
  if (svg.hasAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby');
    const labelledByElement = document.getElementById(id);
    if (labelledByElement) {
      return labelledByElement.textContent.trim();
    }
  }

  // Check for title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent.trim();
  }

  // Check for desc element
  const desc = svg.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }

  // Check for figcaption if SVG is inside figure
  const figure = svg.closest('figure');
  if (figure) {
    const caption = figure.querySelector('figcaption');
    if (caption) {
      return caption.textContent.trim();
    }
  }

  // Check for text content
  const textContent = svg.textContent.trim();
  if (textContent.length > 0) {
    return textContent;
  }

  return null;
};

// Add a language attribute to the HTML element
const getLangAttribute = (element) => {
  if (!element || element.tagName !== 'HTML') {
    throw new Error('Invalid HTML element provided');
  }

  return element.getAttribute('lang') || element.getAttribute('xml:lang');
};

// Validate the accessibility report for issues
const validateAccessibilityReport = (report) => {
  if (!report || typeof report !== 'object') {
    throw new Error('Invalid accessibility report provided');
  }

  const issues = [];

  // Check for required properties
  const requiredProps = ['timestamp', 'issues', 'summary'];
  requiredProps.forEach(prop => {
    if (!report.hasOwnProperty(prop)) {
      issues.push(`Missing required property: ${prop}`);
    }
  });

  // Validate issues array
  if (report.issues && Array.isArray(report.issues)) {
    report.issues.forEach((issue, index) => {
      if (!issue.type || !issue.description) {
        issues.push(`Issue at index ${index} is missing type or description`);
      }
    });
  }

  return issues.length > 0 ? issues : null;
};

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

// Announce message to screen reader
const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  setTimeout(() => announcer.remove(), 1000);
};

// Keyboard navigation handler
const handleKeyboardNav = (element, options = {}) => {
  const defaultOptions = {
    onEnter: () => {},
    onSpace: () => {},
    onEscape: () => {},
    ...options
  };

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      defaultOptions.onEnter(e);
    } else if (e.key === ' ') {
      defaultOptions.onSpace(e);
    } else if (e.key === 'Escape') {
      defaultOptions.onEscape(e);
    }
  });
};

// New focus trap implementation
const newFocusTrap = (element) => {
  if (!element) return;
  
  const focusable = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
};

// Skip link initialization
const initSkipLink = (skipLinkId, targetId) => {
  const skipLink = document.getElementById(skipLinkId);
  const target = document.getElementById(targetId);
  
  if (!skipLink || !target) return;
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    target.setAttribute('tabindex', '-1');
    target.focus();
  });
};

// Trap focus in element
const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
};

// Ensure element has an ID
const ensureElementId = (element, prefix = 'elem') => {
  if (!element) return null;
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
};

// Add language attribute
const addLangAttribute = (lang) => {
  const html = document.documentElement;
  if (!html) return;
  
  html.setAttribute('lang', lang);
};

// Fix table structure issues
const fixTableStructureIssues = (table) => {
  if (!table) return [];
  
  const fixes = [];
  
  // Ensure thead exists
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixes.push('Added missing thead element');
    }
  }
  
  // Ensure tbody exists
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (!row.closest('thead')) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
    fixes.push('Added missing tbody element');
  }
  
  return fixes;
};

// Add main landmark
const addMainLandmark = (element) => {
  if (!element) return;
  
  if (!element.getAttribute('role')) {
    element.setAttribute('role', 'main');
  }
};

// Function to create in-page button with different signature (from origin/main)
const createInPageButtonById = (buttonId, buttonText, buttonClass) => {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  return button;
};

// Function to validate landmark structure for document (from origin/main)
const validateLandmarkStructureDocument = () => {
  const requiredLandmarks = ['header', 'main', 'footer'];
  const missingLandmarks = [];

  requiredLandmarks.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (!element) {
      missingLandmarks.push(landmark);
    }
  });

  if (missingLandmarks.length > 0) {
    console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
    return false;
  }
  return true;
};

// Focus trap utility (from origin/main)
const focusTrapUtil = (container) => {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length === 0) return;
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
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
};

// Additional functions from origin/main
const addSvgAccessibleName = function addSvgAccessibleName(svgString, label) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', label || 'Descriptive label for SVG');
  }
  return svgString;
};

function renderGraphIndex(container, options = {}) {
  const cleanup = focusTrapUtil(container);
  return container.innerHTML;
}

function generateAccessibilityReport() {
    const report = {
        missingLandmarks: [],
        invalidAttributes: [],
        errors: []
    };

    // Check for missing landmarks
    const requiredLandmarks = ['header', 'main', 'footer'];
    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(landmark);
        if (!element) {
            report.missingLandmarks.push(landmark);
        }
    });

    // Check for invalid attributes
    const elementsWithInvalidAttributes = document.querySelectorAll('[role]');
    elementsWithInvalidAttributes.forEach(element => {
        const validRoles = ['banner', 'complementary', 'contentinfo', 'main', 'navigation', 'search'];
        const role = element.getAttribute('role');
        if (!validRoles.includes(role)) {
            report.invalidAttributes.push({ element: element.tagName, attribute: 'role', value: role });
        }
    });

    // Check for images without alt text
    const imagesWithoutAlt = document.querySelectorAll('img[alt=""]');
    imagesWithoutAlt.forEach(img => {
        report.errors.push(`Image without alt text: ${img.src}`);
    });

    const reportString = `Accessibility Report:
    Missing Landmarks: ${report.missingLandmarks.join(', ')}
    Invalid Attributes: ${report.invalidAttributes.map(attr => `${attr.element} with ${attr.attribute}=${attr.value}`).join(', ')}
    Errors: ${report.errors.join(', ')}`;

    console.log(reportString);
    return reportString;
}

function handleUpgrade() {
    const currentVersion = '1.0.0';
    const storedVersion = localStorage.getItem('extensionVersion');

    if (!storedVersion) {
        initializeDefaultSettings();
        localStorage.setItem('extensionVersion', currentVersion);
        console.log('Extension initialized for first use');
        return;
    }

    if (storedVersion !== currentVersion) {
        performUpgradeTasks(storedVersion, currentVersion);
        localStorage.setItem('extensionVersion', currentVersion);
        console.log(`Extension upgraded from ${storedVersion} to ${currentVersion}`);
    }
}

function initializeDefaultSettings() {
    const defaultSettings = {
        theme: 'light',
        notifications: true,
        autoSave: true,
        language: 'en'
    };

    Object.keys(defaultSettings).forEach(key => {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(defaultSettings[key]));
        }
    });
}

function performUpgradeTasks(oldVersion, newVersion) {
    const upgradeTasks = {
        migrateSettings: () => {
            const existingSetting = localStorage.getItem('oldSettingKey');
            if (existingSetting) {
                localStorage.setItem('newSettingKey', existingSetting);
                localStorage.removeItem('oldSettingKey');
            }
        },
        clearCache: () => {
            sessionStorage.clear();
        },
        updatePreferences: () => {
            const preferences = localStorage.getItem('userPreferences');
            if (preferences) {
                const parsed = JSON.parse(preferences);
                if (!parsed.hasOwnProperty('newPreferenceField')) {
                    parsed.newPreferenceField = 'defaultValue';
                    localStorage.setItem('userPreferences', JSON.stringify(parsed));
                }
            }
        }
    };

    Object.values(upgradeTasks).forEach(task => task());
}

// Export functionality with accessibility support
const exportUtils = {
  applyAccessibilityFixes,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap,
  handleCredentialResponse,
  log
};

// Accessibility utilities and functions
const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap,
  ensureElementId,
  addAriaLabel,
  setAriaAttributes,
  setFocusable,
  addKeyboardNavigation,
  ensureTextContrast,
  setAriaLabel,
  ensureKeyboardAccessibility,
  ensureAccessibleAttributes,
  makeFocusable,
  createInPageButtonById,
  validateLandmarkStructureDocument,
  focusTrapUtil
};

module.exports = {
  ...main,
  ...accessibilityUtils,
  existingFunction,
  analyzeDependencyGraph,
  visualizeDependencies,
  applyAccessibilityFixes,
  focusTrap,
  createInPageButton,
  createInPageButtonById,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkStructureDocument,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  handleCredentialResponse,
  log,
  exportUtils,
  accessibilityUtils,
  ensureElementId,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleName,
  renderGraphIndex,
  generateAccessibilityReport,
  handleUpgrade,
  initializeDefaultSettings,
  performUpgradeTasks,
  focusTrapUtil
};

// Auto-run upgrade check on page load (if in browser context)
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        handleUpgrade();
    });
}