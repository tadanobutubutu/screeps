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
    // ... (existing code)
  },

  getLangAttribute() {
    // ... (existing code)
  }
};

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  handleCredentialResponse(response) {
    if (!response || typeof response !== 'object') {
      return null;
    }

    // Extract credential-related fields
    const credentialInfo = {
      token: response.token || '',
      auth: response.auth || '',
      session: response.session || '',
      authorization: response.authorization || ''
    };

    // If no credential info, return null
    if (!Object.values(credentialInfo).some(info => info)) {
      return null;
    }

    // Create a report entry for the credential response
    const reportEntry = {
      type: 'credential-response',
      message: 'Credential response detected',
      details: credentialInfo
    };

    // Try to merge with existing accessibility report
    if (this.generateAccessibilityReport) {
      try {
        const baseReport = this.generateAccessibilityReport(response);
        if (baseReport) {
          // Combine both reports
          return [...baseReport, reportEntry].filter(Boolean);
        }
      } catch (error) {
        // Ignore errors in report generation
      }
    }

    return reportEntry;
  }
}

// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

/**
 * Checks if a link is accessible and has valid attributes for screen readers
 * @param {Object} linkElement - The link element to check for accessibility
 * @returns {Object} Result with success status and any accessibility issues found
 */
function isLinkAccessible(linkElement) {
  const issues = [];
  
  if (!linkElement) {
    issues.push('Link element is null or undefined');
    return {
      success: false,
      issues
    };
  }
  
  // Check if element is an anchor tag
  if (linkElement.tagName !== 'A') {
    issues.push('Element is not an anchor tag');
  }
  
  // Check for href attribute
  const href = linkElement.getAttribute('href');
  if (!href) {
    issues.push('Missing href attribute');
  }
  
  // Check for placeholder or empty href
  if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
    issues.push('Link has placeholder or empty href');
  }
  
  // Check for accessible name (text content or aria-label)
  const textContent = linkElement.textContent ? linkElement.textContent.trim() : '';
  const ariaLabel = linkElement.getAttribute('aria-label') || '';
  const ariaLabelledby = linkElement.getAttribute('aria-labelledby');
  
  if (!textContent && !ariaLabel && !ariaLabelledby) {
    issues.push('Link has no accessible name (missing text, aria-label, or aria-labelledby)');
  }
  
  return {
    success: issues.length === 0,
    issues
  };
}

const config = {
  // ... (existing config)
};

// Export functions for testing
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
  fixFakeLinks,
  isLinkAccessible
};