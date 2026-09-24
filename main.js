// main.js - Accessibility-focused implementation

// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)

// Functions to ensure the element has an id, add aria-label, render dependency graphs
/* todo-hash: 300db4d2fa69e704c1157258b06c332c14aaf34f */

// New functions to add
const AccessibilityUtils = {
  ensureElementHasId(element, prefix = 'a11y') {
    if (!element) {
      return { success: false, error: 'Element is required' };
    }

    let id = element.id;
    if (!id) {
      id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
      element.id = id;
      return { success: true, id, created: true };
    }

    return { success: true, id, created: false };
  },

  calculateScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    if (!label || typeof label !== 'string') {
      return { success: false, error: 'Valid label is required' };
    }

    element.setAttribute('aria-label', label);
    return { success: true, label };
  },

  calculateColorContrast(foreground, background) {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);

    if (!fgRgb || !bgRgb) {
      return { valid: false, error: 'Invalid color format' };
    }

    const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      ratio: ratio.toFixed(2),
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7,
      valid: true
    };
  },

  fixMultipleMainElements(source) {
    const mainBlockRegex = /<\w+(\s+\w+\s*=\s*.*\s*)*<\/main>/g;

    let matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i];
      const fixedBlock = block
        .replace(/<\/main>/, '</section>')
        .replace(/<main/, '<section');
      result = result.replace(block, fixedBlock);
    }

/**
 * Validate table structure and add missing elements
 * @param {HTMLTableElement} table - The table element
 * @returns {Object} - Validation result
 */
function validateTableStructure(table) {
  const result = checkTableStructure(table);
  
  if (!result.valid) {
    return result;
  }
  
  // Add caption if missing
  if (!result.hasCaption) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table';
    table.insertBefore(caption, table.firstChild);
    result.hasCaption = true;
  }
  
  // Add thead if missing but th exists
  if (!result.hasHeader && table.querySelector('th')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      result.hasHeader = true;
    }
  }
  
  // Add tbody if missing
  if (!result.hasBody) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    result.hasBody = true;
  }
  
  return result;
}

/**
 * Get lang attribute for the document
 * @returns {string} - Language code
 */
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  const lang = htmlElement ? htmlElement.getAttribute('lang') || '' : '';
  return lang || navigator.language || navigator.userLanguage || 'en';
}

/**
 * Add lang attribute to HTML element
 * @param {string} langCode - Language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(langCode = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', langCode);
  }
}

/**
 * Function to determine if an element is a landmark
 * This function replaces the existing isLandmarkElement function for a unified implementation
 * @param {Element} element - The element to check
 * @returns {boolean} - True if element is a landmark
 */
function isLandmarkElement(element) {
  if (!element) return false;
  return element.hasAttribute('role') && ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'region'].includes(element.getAttribute('role'));
}

/**
 * Check for unique landmarks and fix duplicates
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"]');
  const seenLandmarks = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seenLandmarks[role]) {
      // Remove role from duplicate or change to region
      landmark.setAttribute('role', 'region');
      if (!landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${role} section`);
      }
    } else {
      seenLandmarks[role] = true;
    }
  });
  
  return Object.keys(seenLandmarks);
}

/**
 * Fix fake link issues (links without href or buttons styled as links)
 */
function fixFakeLinkIssues() {
  const links = document.querySelectorAll('a:not([href])');
  const fakeLinks = [];
  
  links.forEach(link => {
    fakeLinks.push(link);
    // Add button role or fix as proper link
    if (link.getAttribute('href') === '' || link.getAttribute('href') === '#') {
      link.setAttribute('role', 'button');
    }
  });
  
  return fakeLinks.length;
}

/**
 * Validate a landmark element
 * @param {Element} element - The element to validate
 * @returns {Object} - Validation result
 */
function validateLandmark(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }
  
  const validationResult = { valid: true, issues: [] };
  
  if (!isLandmarkElement(element)) {
    validationResult.valid = false;
    validationResult.issues.push('Element is not a landmark');
    return validationResult;
  }
  
  // Check for proper labeling
  const role = element.getAttribute('role');
  if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby') && !element.querySelector('h1, h2, h3, h4, h5, h6')) {
    validationResult.issues.push(`Landmark ${role} should have an accessible name`);
  }
  
  return validationResult;
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table element
 * @param {number} index - Table index for reporting
 * @returns {Object} - Validation result
 */
function validateTableAccessibility(table, index) {
  return validateTableStructure(table);
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check (optional)
 * @returns {Object} Result with success status and duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  document.querySelectorAll('[role]').forEach(element => {
    const role = element.getAttribute('role');
    if (landmarkRoles.includes(role)) {
      if (landmarks[role]) {
        duplicates.push({ role, element });
      } else {
        landmarks[role] = element;
      }
    }
  });

  duplicates.forEach(({ role, element }) => {
    if (role === 'main') {
      element.removeAttribute('role');
    } else {
      const uniqueId = `${role}-${Date.now()}`;
      element.setAttribute('aria-labelledby', uniqueId);
      const label = document.createElement('span');
      label.id = uniqueId;
      label.textContent = `${role} region`;
      label.style.display = 'none';
      element.insertBefore(label, element.firstChild);
    }
  });

  runCommand(command, args, callback) {
    const child_process = require('child_process');

// Function to fix fake link issues
function fixFakeLinkIssues() {
  const fixed = [];
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');

    child_process.spawn(command, args || [], spawnOptions, (error, stdout, stderr) => {
      if (error) {
        callback(new Error(`someCommand failed: ${error.message}`));
        return;
      }

      switch (solution.action) {
        case 'add-attribute':
          applyAttributeChange(solution);
          applied.push(solution);
          break;
        case 'remove-attribute':
          applyAttributeRemoval(solution);
          applied.push(solution);
          break;
        case 'modify-content':
          applyContentModification(solution);
          applied.push(solution);
          break;
        case 'inject-element':
          injectAccessibilityElement(solution);
          applied.push(solution);
          break;
        default:
          logMessage(`Unknown action: ${solution.action}`);
          skipped.push({ solution, reason: 'Unknown action' });
      }
    } catch (error) {
      logMessage(`Failed to apply solution: ${error.message}`);
      skipped.push({ solution, reason: error.message });
    }
  });

  logMessage(`Applied ${applied.length} solutions, skipped ${skipped.length}`);

  countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  // New function added as per the issue
  performNewFunctionality() {
    console.log('Performing new functionality...');
    // Implement the new functionality here
  }
}

// FunctionA has been updated to include actual validation logic
function functionA() {
  const isAccessible = performAccessibilityCheck();
  console.log('Function A executed successfully. Page accessibility status:', isAccessible);
  return isAccessible;
}

// Global constants for the insight report
const sampleInsightReport = {
  // ... previous content ...
};

// ... (other functions and setting up exports)

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

/**
 * Harvests data from available sources.
 * Collects configuration, app state, and DOM-based resource information
 * into a single object that can be consumed by other functions
 * (such as upgradeSystem).
 *
 * @returns {Object} Harvested data containing:
 *   - config: the current application configuration
 *   - state: the current application state
 *   - resources: array of resource names harvested from the DOM (if available)
 *   - timestamp: the time at which harvesting occurred
 */
function harvest() {
  const harvested = {
    config: getConfig(),
    state: {
      initialized: appState.initialized,
      hasData: appState.data !== null && appState.data !== undefined,
      cacheSize: appState.cache ? appState.cache.size : 0
    },
    resources: [],
    timestamp: Date.now()
  };

  // If running in a browser-like environment, harvest resource names from the DOM
  if (typeof document !== 'undefined' && document.querySelectorAll) {
    const resourceElements = document.querySelectorAll('[data-resource]');
    resourceElements.forEach(el => {
      const name = el.getAttribute('data-resource');
      if (name && harvested.resources.indexOf(name) === -1) {
        harvested.resources.push(name);
      }
    });
  }

  return harvested;
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
  harvest,
  performValidation,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  addProperLandmarkRegions,
  fixFakeLinks
};