// This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51
// ----- END ORIGINAL CODE -----

const config = [process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
];

const appState = {
  initialized: false,
  data: null,
  cache: new AccessibilityChecker()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// Accessibility utilities
// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs, checkTableStructure, generateUniqueId, detectAccessibilityIssues, handleCredentialResponse, getStoredCredentials, clearCredentials

const AccessibilityChecker = {
  MISSING_ID: 'missing-id',
  MISSING_ALT: 'missing-alt',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',
  LOW_CONTRAST: 'low-contrast',
  TINY_SIZE: 'tiny-size',

  analyzeAccessibilityIssues(report) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    // From HEAD - new accessibility checks for sections, empty content, and inaccessible link text
    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible language
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    // From ORIGINAL CODE - existing functions to check for missing ID, missing alt text, missing aria label, missing role, and low contrast elements
    ...

    return issues;
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues) || accessibilityReport.issues.length === 0) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main([^>]*)>/, '<section$1>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole) {
      return { valid: false, error: 'Element does not have a valid landmark role', element: tagName };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}`, element: tagName, role: landmarkRole };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  // New functions from ORIGINAL CODE
  spawnSomeCommand(callback) {
    const child_process = require('child_process');

    const spawnOptions = {  shell: true };

    child_process.spawn('someCommand', [], spawnOptions, (error, stdout, stderr) => {
      if (error) {
        callback(new Error(`someCommand failed: ${error.message}`));
        return;
      }

      callback(null, `someCommand exited with status code: ${stdout}`);
    });
  },

  addLangAttribute(element, lang) {
    return lang;
  },

  countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  renderDependencyGraph() {
    const dependencyContent = require('../dependencyGraphContent/indexContent');
    const graphContainer = document.getElementById('dependency-graph-container');
    if (graphContainer) {
      graphContainer.innerHTML = dependencyContent;
    }
  },

  renderIndexView() {
    const indexContent = require('../indexContent/indexContent');
    const indexContainer = document.getElementById('index-container');
    if (indexContainer) {
      indexContainer.innerHTML = indexContent;
    }
  },

  // Functions added from origin/main
  getState: () => state,
  setState: (newState) => { state = { ...state, ...newState }; },

  // New functions to address accessibility issues from origin/main
  fixTableStructureIssues() { ... },
  fixTableHeaderCellScope() { ... },
  checkAll() { ... },
  addLandmarkRolesAndFixIssues() { ... },
  fixLandmarkIssues() { ... },
  ensureUniqueLandmarks() { ... },
  fixSvgAccessibleNames() { ... },
  addSvgAccessibilityProps(svgElement, accessibleName, role = 'img') { ... },
  fixButtonIdentifiers() { ... },
  createResourceButton(resourceName, onClick) { ... }
};

function ensureUniqueLandmarks(landmarks) {
  let elementsToCheck;
  // If no landmarks array provided, query the DOM (from origin/main)
  if (!Array.isArray(landmarks)) {
    elementsToCheck = document.querySelectorAll('[role]');
  } else {
    elementsToCheck = landmarks;
  }

  const names = [];
  const duplicates = [];

  // Check for duplicate accessible names (from HEAD)
  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs (from origin/main)
  const elementsById = {};
  elementsToCheck.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  // Check for duplicate roles (from origin/main)
  const landmarksByRole = {};
  elementsToCheck.forEach(landmark => {
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

/**
 * Implements comprehensive validation logic for the application.
 * Validates inputs, configuration, and data integrity.
 * @param {*} value - The value to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with success status and any issues found
 */
function performValidation(value, options = {}) {
  const issues = [];

  // Check for null/undefined
  if (value === null || value === undefined) {
    issues.push('Value is null or undefined');
    return {
      success: false,
      issues
    };
  }

  // Validate type
  if (options.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== options.type) {
      issues.push(`Expected type ${options.type}, got ${actualType}`);
    }
  }

  // Validate required properties for objects
  if (options.required && typeof value === 'object' && !Array.isArray(value)) {
    options.required.forEach(prop => {
      if (!(prop in value)) {
        issues.push(`Missing required property: ${prop}`);
      }
    });
  }

  // Validate min/max for numbers
  if (typeof value === 'number') {
    if (options.min !== undefined && value < options.min) {
      issues.push(`Value ${value} is less than minimum ${options.min}`);
    }
    if (options.max !== undefined && value > options.max) {
      issues.push(`Value ${value} is greater than maximum ${options.max}`);
    }
  }

  // Validate min/max length for strings/arrays
  if (typeof value === 'string' || Array.isArray(value)) {
    if (options.minLength !== undefined && value.length < options.minLength) {
      issues.push(`Length ${value.length} is less than minimum ${options.minLength}`);
    }
    if (options.maxLength !== undefined && value.length > options.maxLength) {
      issues.push(`Length ${value.length} is greater than maximum ${options.maxLength}`);
    }
  }

  // Validate against pattern (regex)
  if (options.pattern && typeof value === 'string') {
    if (!options.pattern.test(value)) {
      issues.push('Value does not match expected pattern');
    }
  }

  // Validate enum values
  if (options.enum && Array.isArray(options.enum)) {
    if (!options.enum.includes(value)) {
      issues.push(`Value must be one of: ${options.enum.join(', ')}`);
    }
  }

  return {
    success: issues.length === 0,
    issues
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
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues (optional)
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues = []) {
  const handled = [];
  const unhandled = [];

  // Process provided issues (from HEAD)
  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  // Perform DOM validation (from origin/main)
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

  const svgs = document.querySelectorAll ? document.querySelectorAll('svg') : [];
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

function createAccessibleLink(href, text) {
    // Implementation to create accessible link (conflict resolved: merged implementation)
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
    // Merged implementation (conflict resolved)
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
 * Implements upgrade logic using harvested data to improve the system
 * This function checks environment variables for upgrade triggers and updates the system configuration accordingly.
 */
function upgradeSystem() {
  const env = process.env;
  const config = getConfig();

  // Harvest upgrade data from environment variables
  if (env.UPGRADE_NEEDED) {
    // Example improvement: increment version number based on environment hint
    const currentVer = config.version.split('.')[0];
    const newVer = (parseInt(currentVer, 10) + 1).toString();
    config.version = newVer + '.0.0';
    console.log(`System upgraded to version ${config.version}`);
  }

  return config;
}

// New functions to address accessibility issues

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
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
function addMainLandmark() {
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
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], main, nav, header, aside, footer');
    const issues = validateLandmarkStructure(landmarks);
    return {
        success: issues.success,
        issues: issues.issues
    };
}

/**
 * Checks landmark elements for accessibility compliance
 * @returns {Object} Result with success status and any issues found
 */
function checkLandmarkElements() {
    const landmarks = document.querySelectorAll('[role], main, nav, header, aside, footer, section, article');
    const issues = [];
    
    landmarks.forEach(landmark => {
        const result = validateLandmark(landmark);
        if (!result.success) {
            issues.push(...result.issues);
        }
    });
    
    const structureIssues = validateLandmarkStructure(landmarks);
    if (!structureIssues.success) {
        issues.push(...structureIssues.issues);
    }
    
    const uniquenessIssues = ensureUniqueLandmarks(landmarks);
    if (!uniquenessIssues.success) {
        issues.push(...uniquenessIssues.duplicates);
    }
    
    return {
        success: issues.length === 0,
        issues: issues
    };
}

function addProperLandmarkRegions() {
  const body = document.body;
  const existingMain = document.querySelector('main');
  
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    body.appendChild(main);
  }
  
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });
  
  const headers = document.querySelectorAll('header');
  headers.forEach(header => {
    if (!header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
  });
  
  const footers = document.querySelectorAll('footer');
  footers.forEach(footer => {
    if (!footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  });
}

function fixFakeLinks() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
      link.setAttribute('role', 'text');
    }
  });
}

/**
 * Fixes accessible names for SVG elements
 */
function fixSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  });
}

/**
 * Adds SVG accessibility properties to an SVG element
 * @param {Object} svgElement - The SVG element to add accessibility props to
 * @param {string} accessibleName - The accessible name for the SVG
 * @param {string} role - The ARIA role for the SVG (default: 'img')
 * @returns {Object} The SVG element with accessibility props added
 */
function addSvgAccessibilityProps(svgElement, accessibleName, role = 'img') {
    if (!svgElement || typeof svgElement !== 'object') {
        return null;
    }
    
    // Set the role attribute
    svgElement.setAttribute('role', role);
    
    // Set the accessible name via aria-label
    if (accessibleName) {
      svgElement.setAttribute('aria-label', accessibleName);
    }
    
    return svgElement;
}

/**
 * Fixes button identifiers for accessibility by replacing placeholder ids
 * like 'my-button' with meaningful, descriptive button ids based on the
 * button's text content. Ensures each button has a unique, accessible id.
 * @returns {Object} Result with success status and count of buttons fixed
 */
function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('button');
  const seenIds = {};
  let fixed = 0;

  buttons.forEach((button, index) => {
    let currentId = button.getAttribute('id');
    const isPlaceholder = !currentId || currentId === 'my-button' || /^my-button(-.*)?$/.test(currentId);

    if (isPlaceholder) {
      // Generate a meaningful id from the button's text content
      const text = (button.textContent || '').trim();
      let newId;
      if (text) {
        newId = 'btn-' + text.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        if (!newId || newId === 'btn-') {
          newId = 'btn-' + (index + 1);
        }
      } else {
        newId = 'btn-' + (index + 1);
      }

      // Ensure uniqueness
      let uniqueId = newId;
      let counter = 2;
      while (seenIds[uniqueId] || document.getElementById(uniqueId)) {
        uniqueId = newId + '-' + counter;
        counter++;
      }

      button.setAttribute('id', uniqueId);
      seenIds[uniqueId] = true;
      fixed++;
    } else {
      // Track existing non-placeholder ids to ensure overall uniqueness
      if (seenIds[currentId] || document.getElementById(currentId) && document.getElementById(currentId) !== button) {
        let uniqueId = currentId + '-unique';
        let counter = 2;
        while (seenIds[uniqueId] || document.getElementById(uniqueId)) {
          uniqueId = currentId + '-unique-' + counter;
          counter++;
        }
        button.setAttribute('id', uniqueId);
        seenIds[uniqueId] = true;
        fixed++;
      } else {
        seenIds[currentId] = true;
      }
    }
  });

  return {
    success: true,
    fixed
  };
}

function createResourceButton(resourceName, onClick) {
    const button = document.createElement('button');
    button.textContent = resourceName;
    button.type = 'button';
    button.setAttribute('aria-label', resourceName);
    button.setAttribute('data-resource', resourceName);
    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    return button;
}

module.exports = {
  initializeApp,
  getConfig,
  validateInput,
  processData,
  createInPageButton,
  handleAccessibilityIssues,
  createAccessibleLink,
  addLandmarkRegions,
  getSvgAccessibleName,
  setSvgAttributes,
  addSvgAccessibleNames,
  upgradeSystem,
  addLangAttribute,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addLandmarkRolesAndFixIssues,
  fixLandmarkIssues,
  checkLandmarkElements,
  ensureUniqueLandmarks,
  fixSvgAccessibleNames,
  addSvgAccessibilityProps,
  fixButtonIdentifiers,
  createResourceButton,
  performValidation
};