const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100
};

import './styles.css';
import { someFunction } from './otherFile';

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Helper function to get language attribute
function getLangAttribute() {
    return document.documentElement.lang || (navigator?.language || 'en-US');
}

function getFullLangAttribute() {
    return document.documentElement.lang || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
}

/**
 * Validates table accessibility compliance
 * @param {Object} tableElement - The table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(tableElement) {
  const issues = [];

  if (!tableElement) {
    console.warn('Table element is null or undefined');
    return {
      success: false,
      issues: ['Table element is null or undefined']
    };
  }

  // Check for caption
  if (!tableElement.querySelector('caption')) {
    console.warn('Table missing caption');
    issues.push('Missing caption element');
  }

  // Check for headers attribute
  if (!tableElement.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells
  const headerCells = tableElement.querySelectorAll('th');
  if (headerCells) {
    headerCells.forEach(cell => {
      if (!cell.hasAttribute('scope')) {
        issues.push('Missing scope attribute on header cell');
      }
    });
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
    const rows = table?.querySelectorAll('tr') ?? [];
    if (!rows || rows.length === 0) {
      console.warn('Table has no rows');
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

function validateLandmark(landmark) {
  const errors = [];
  const role = landmark.getAttribute('role');
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
  if (!validLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  return errors;
}

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkElement(element) {
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
 * Validates landmark attributes for accessibility
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

  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmarkElement(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    // Otherwise, check for required landmarks in the DOM
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

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
  return svg;
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarksArg - Array of landmark elements to check (optional)
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarksArg) {
  let landmarks = [];
  if (Array.isArray(landmarksArg)) {
    landmarks = landmarksArg;
  } else if (landmarksArg != null) {
    landmarks = [landmarksArg];
  } else {
    landmarks = Array.from(document.querySelectorAll('[role]'));
  }

  const elementsById = {};
  const landmarksByRole = {};

  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        console.warn(`Duplicate landmark role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
    }
  }

  // Check for duplicate accessible names
  const names = [];
  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      console.warn(`Duplicate accessible name: ${name}`);
    } else {
      names.push(name);
    }
  });

  return landmarks;
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
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  button.setAttribute('aria-label', text);
  return button;
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues (optional)
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues = []) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  // Perform DOM validation
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
  });

  validateLandmarkStructure();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    getSvgAccessibleName(svg);
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
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

  if (options.ariaHidden !== undefined) {
    enhancedSvg.ariaHidden = options.ariaHidden;
  }

  if (options.role) {
    enhancedSvg.role = options.role;
  }

  // Ensure the SVG has an accessible name
  if (!enhancedSvg.ariaLabel && !enhancedSvg.ariaLabelledby && !enhancedSvg.title) {
    enhancedSvg.title = 'SVG graphic';
  }

  return enhancedSvg;
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
 * Fixes table structure issues
 * @param {Object} table - The table to fix
 * @returns {Object} The fixed table
 */
function fixTableStructure(table) {
  if (!table.headers) {
    table.headers = 'auto';
  }

  if (!table.scope) {
    table.scope = 'auto';
  }

  return table;
}

/**
 * Adds main landmark to the document
 * @param {Object} document - The document object
 * @returns {Object} The modified document with main landmark
 */
function addMainLandmark(document) {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.appendChild(main);
  }
  return document;
}

/**
 * Validates link accessibility
 * @param {Object} link - The link to validate
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
 * Handles fake links by converting them to buttons
 * @param {Object} link - The fake link to handle
 * @returns {Object} The converted button element
 */
function handleFakeLinks(link) {
  if (link.href === '#' || link.href === 'javascript:void(0)') {
    return createInPageButton(link.textContent, link.onClick);
  }
}

function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

/**
 * Iterates through all SVG elements and sets accessible names
 * @returns {Object} Result with success status and count of SVGs processed
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let processed = 0;

  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
    processed++;
  });

  return {
    success: true,
    processed
  };
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttributeToDoc() {
  const lang = getFullLangAttribute();
  document.documentElement.setAttribute('lang', lang);
  return lang;
}

/**
 * Fixes table structure issues
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }
    // Add headers attribute if missing
    if (!table.getAttribute('headers')) {
      table.setAttribute('headers', 'true');
    }
  });
}

/**
 * Fixes scope attribute on header cells
 */
function fixTableHeaderCellScope() {
  const headerCells = document.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });
}

/**
 * Adds main landmark
 */
function addMainLandmarkToDoc() {
  const main = document.querySelector('main');
  if (!main) {
    const newMain = document.createElement('main');
    document.body.insertBefore(newMain, document.body.firstChild);
  }
}

/**
 * Adds landmark roles and fixes issues
 */
function addLandmarkRolesAndFixIssues() {
  // Add roles to sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.hasAttribute('role')) {
      section.setAttribute('role', 'region');
    }
  });
}

/**
 * Fixes landmark issues
 */
function fixLandmarkIssues() {
  // Ensure unique landmarks
  ensureUniqueLandmarks();
}

/**
 * Fixes fake links
 */
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', link.textContent);
  });
}

/**
 * Adds proper landmark regions
 */
function addProperLandmarkRegions() {
  addMainLandmarkToDoc();
  addLandmarkRolesAndFixIssues();
}

/**
 * Replaces my-button with actual button
 */
function replaceMyButton() {
  const myButton = document.getElementById('my-button');
  if (myButton) {
    const button = document.createElement('button');
    button.textContent = myButton.textContent;
    button.onclick = myButton.onclick;
    myButton.replaceWith(button);
  }
}

/**
 * Ensures dependencyGraph container has proper ARIA role
 */
function ensureDependencyGraphAriaRole() {
  const container = document.getElementById('dependencyGraph');
  if (container && !container.hasAttribute('role')) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency Graph');
  }
}

/**
 * Counts dependencies in the codebase
 * @param {string} code - The code to analyze for dependencies
 * @returns {number} The count of dependencies found
 */
function countDependencies(code) {
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;

  let count = 0;
  let match;

  // Count require() calls
  while ((match = requireRegex.exec(code)) !== null) {
    count++;
  }

  // Count import statements
  while ((match = importRegex.exec(code)) !== null) {
    count++;
  }

  return count;
}

// Accessibility scanning function using axe-core library
async function scanAccessibility(filePaths) {
  const issues = [];

  // Check table accessibility
  const tableAccessibilityIssues = await axe.checkTables(document);
  issues.push(...tableAccessibilityIssues);

  // Check landmark accessibility
  const landmarkIssues = await axe.checkLandmarks(document);
  issues.push(...landmarkIssues);

  // Check SVG accessibility
  const svgIssues = await axe.checkSvgs(document);
  issues.push(...svgIssues);

  // Check link accessibility
  const linkIssues = await axe.checkLinks(document);
  issues.push(...linkIssues);

  return issues;
}

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkElement,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  initializeApp,
  getConfig,
  validateInput,
  processData,
  validateLinkAccessibility,
  addLandmarkRegions,
  setSvgAttributes,
  scanAccessibility,
  addSvgAccessibilityProps,
  addLangAttribute,
  addMainLandmark,
  fixTableStructure,
  addSvgAccessibleNames,
  addLangAttributeToDoc,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmarkToDoc,
  addLandmarkRolesAndFixIssues,
  fixLandmarkIssues,
  fixFakeLinks,
  addProperLandmarkRegions,
  replaceMyButton,
  ensureDependencyGraphAriaRole,
  countDependencies,
  handleFakeLinks,
  HTML
};