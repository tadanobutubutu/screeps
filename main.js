<?xml version="1.0" encoding="UTF-8"?>
// TODO: This is the existing code that needs to be preserved
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Get the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e. g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

/**
 * Validates landmark elements
 * @param {Object} element - The landmark element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// const HTML = ({ lang }) => <html lang={lang}>{/* other children */}</html>;

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by addSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    // Implementation to get full language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Validates landmark attributes
 * @param {Object} landmark - The landmark element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkAttributes(landmark) {
  const issues = [];

  if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
    issues.push('Landmark missing accessible name');
  }

  if (landmark.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(landmark.role)) {
    issues.push(`Invalid landmark role: ${landmark.role}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate (optional)
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  // If landmarks array is provided, validate each one (from HEAD)
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    // Otherwise, check for required landmarks in the DOM (from origin/main)
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check (optional)
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      if (!duplicates.includes(name)) {
        duplicates.push(name);
      }
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs
  const elementsById = {};
  landmarks.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  // Check for duplicate roles
  const landmarksByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate landmark role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function createInPageButton(text, onClick) {
  // Implementation to create accessible in-page button (conflict resolved: merged implementation)
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  button.setAttribute('aria-label', text);
  return button;
}

/**
 * Handles fake links by converting them to accessible in-page buttons
 * @param {Object} link - The link element
 * @returns {Object} The converted button or original link
 */
function handleFakeLinks(link) {
  if (link.href === '#' || link.href === 'javascript:void(0)') {
    return createInPageButton({
      text: link.textContent,
      ariaLabel: link.ariaLabel,
      onClick: link.onClick
    });
  }
  return link;
}

/**
 * Validates link accessibility
 * @param {Object} link - The link element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLinkAccessibility(link) {
  const issues = [];

  if (!link.href) {
    issues.push('Link missing href attribute');
  }

  if (!link.textContent && !link.ariaLabel) {
    issues.push('Link missing accessible name');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  // Check for caption (conflict resolved: check for both)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array|Object} tables - Array of table objects or single table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    // Check for rows
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svg - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
}

/**
 * Adds accessibility properties to an SVG element
 * @param {Object} svg - The SVG element to enhance
 * @param {Object} options - Accessibility options
 * @param {string} options.ariaLabel - ARIA label for the SVG
 * @param {string} options.ariaHidden - ARIA hidden state
 * @param {string} options.role - ARIA role for the SVG
 * @returns {Object} The enhanced SVG element with accessibility properties
 */
function addSvgAccessibilityProps(svg, options = {}) {
  const enhancedSvg = { ...svg };

  if (options.ariaLabel) {
    enhancedSvg.ariaLabel = options.ariaLabel;
  }
  if (options.ariaHidden) {
    enhancedSvg.ariaHidden = options.ariaHidden;
  }
  if (options.role) {
    enhancedSvg.role = options.role;
  }

  return enhancedSvg;
}

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Handles fake links by converting them to accessible in-page buttons
 * @param {Object} link - The link element
 * @returns {Object} The converted button or original link
 */
function handleFakeLinks(link) {
  if (link.href === '#' || link.href === 'javascript:void(0)') {
    return createInPageButton({
      text: link.textContent,
      ariaLabel: link.ariaLabel,
      onClick: link.onClick
    });
  }
  return link;
}

/**
 * Creates an accessible in-page button
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {Object} The created button element
 */
function createInPageButton(text, onClick) {
  // Implementation to create accessible in-page button
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  button.setAttribute('aria-label', text);
  if (text.length === 0) {
    button.setAttribute('aria-label', 'Empty button');
  }
  return button;
}

/**
 * Creates an accessible link
 * @param {string} href - The link href
 * @param {string} text - The link text
 * @returns {Object} The created link element
 */
function createAccessibleLink(href, text) {
  // Implementation to create accessible link (conflict resolved: merged implementation)
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

/**
 * Fixes table structure issues
 * @param {Object} table - The table to fix
 * @returns {Object} The fixed table
 */
function fixTableStructure(table