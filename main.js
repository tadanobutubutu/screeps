// TODO: This is the existing code that needs to be preserve - Address new accessibility issues from insight report:
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

function detectAndSetLang(content) {
  let lang = 'en';
  if (content) {
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh';
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja';
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru';
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar';
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr';
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de';
    }
  }
  return setHtmlLangAttribute(lang);
}

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

function personName(name) {
  if (!name) return '';
  return name.trim();
}

function validateTableAccessibility(table) {
  const errors = [];
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  const errors = [];
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');
const fs = require('fs');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

/**
 * Main application entry point with accessibility features
 */

function getSvgAccessibleName(svg) {
  // Try to get accessible name from various attributes
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('title') || 
         svg.getAttribute('alt') || 
         svg.getAttribute('data-name') || null;
}

function setSvgAttributes(svg) {
  // Set default SVG attributes for accessibility
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'true');
  }
}

function addAccessibleNamesToSVGs() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (svg.getAttribute('role') !== 'presentation') {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

const checkTableStructure = function() {
  // Check and fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper headers
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerRow = document.createElement('tr');
        firstRow.querySelectorAll('td, th').forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.setAttribute('scope', 'col');
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    
    // Ensure proper table role
    table.setAttribute('role', 'table');
  });
};

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

// Implement function for addressing accessibility issues from insight report
// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    const allDeps = Object.keys(dependencies).concat(Object.keys(devDependencies));

    renderDependencyGraph(allDeps);
    renderIndex(allDeps);

    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

function renderDependencyGraph(dependencies) {
  if (!Array.isArray(dependencies)) return null;

  const graphContainer = document.createElement('div');
  graphContainer.id = 'dependencyGraph';
  graphContainer.setAttribute('role', 'region');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');
  graphContainer.className = 'dependency-graph';

  dependencies.forEach(dep => {
    const depItem = document.createElement('div');
    depItem.className = 'dependency-item';
    depItem.textContent = dep;
    graphContainer.appendChild(depItem);
  });

  const existing = document.getElementById('dependencyGraph');
  if (existing) {
    existing.parentNode.replaceChild(graphContainer, existing);
  } else {
    document.body.appendChild(graphContainer);
  }

  return graphContainer;
}

function renderIndex(dependencies) {
  if (!Array.isArray(dependencies)) return null;

  const indexContainer = document.createElement('div');
  indexContainer.id = 'dependencyIndex';
  indexContainer.setAttribute('role', 'region');
  indexContainer.setAttribute('aria-label', 'Dependency Index');
  indexContainer.className = 'dependency-index';

  dependencies.forEach((dep, index) => {
    const indexItem = document.createElement('div');
    indexItem.className = 'index-item';
    indexItem.textContent = `${index + 1}. ${dep}`;
    indexContainer.appendChild(indexItem);
  });

  const existing = document.getElementById('dependencyIndex');
  if (existing) {
    existing.parentNode.replaceChild(indexContainer, existing);
  } else {
    document.body.appendChild(indexContainer);
  }

  return indexContainer;
}

/**
 * Handle credential response from browser authentication
 * @param {Object} response - The credential response object
 * @returns {Object} Processed credential information
 */
function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    // Check if response contains expected credential data
    const hasCredential = response.credential || response.token || response.id;
    
    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    // Process credential information
    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    // Handle different types of credential responses
    if (response.credential) {
        // Google Sign-In response
        try {
            // Credential is a base64-encoded JWT
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    // Announce success to screen readers
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

// Landmark validation functions from HEAD
function newValidateLandmark(element) {
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }
  return { valid: errors.length === 0, errors };
}

function newValidateLandmarkStructure() {
  const errors = [];
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }
  return { valid: errors.length === 0, errors };
}

function newEnsureUniqueLandmarks() {
  const errors = [];
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];
  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;
    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });
  return { valid: errors.length === 0, errors };
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    renderDependencyGraph,
    renderIndex,
    init,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    fixTableStructure,
    fixLandmarkIssues,
    addMainLandmark,
    addLandmarkRegions,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssues,
    googleSignIn,
    fixButtonIdentifiers,
    ensureDependencyGraphAriaRole,
    getSvgAccessibleName,
    setSvgAttributes,
    sampleInsightReport,
    createInPageButton,
    handleFakeLinks,
    // New functions from HEAD
    setHtmlLangAttribute,
    detectAndSetLang,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    newValidateLandmark,
    newValidateLandmarkStructure,
    newEnsureUniqueLandmarks
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  addLangAttribute();
  fixTableStructure();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addAccessibleNamesToSVGs();
  fixFakeLinkIssues();
  fixButtonIdentifiers();
  ensureDependencyGraphAriaRole();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function addLangAttribute() {
  // Add lang attribute to HTML element if missing
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure proper role
    if (!table.hasAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    
    // Ensure caption if missing
    if (!table.querySelector('caption') && table.hasAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Check for proper header structure
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const firstRowCells = rows[0].querySelectorAll('td, th');
      let hasHeader = false;
      firstRowCells.forEach(cell => {
        if (cell.tagName === 'TH') hasHeader = true;
      });
      
      if (!hasHeader) {
        firstRowCells.forEach(cell => {
          const th = document.createElement('th');
          th.setAttribute('scope', 'col');
          th.textContent = cell.textContent;
          th.setAttribute('role', 'columnheader');
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

function fixLandmarkIssues() {
  addMainLandmark();
  addLandmarkRegions();
}

function addMainLandmark() {
  // Ensure main content has proper landmark
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  // If no main element exists, create one or use div with role
  if (!main) {
    const mainContent = document.querySelector('#main-content, .main-content, [contentmain]');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

function addLandmarkRegions() {
  // Add landmark roles to common regions
  const regions = {
    'header': 'banner',
    'footer': 'contentinfo',
    'nav': 'navigation',
    'aside': 'complementary',
    'section[aria-label]': 'region',
    'section[aria-labelledby]': 'region'
  };
  
  Object.entries(regions).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.hasAttribute('role') && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        el.setAttribute('role', role);
      }
    });
  });
}

function ensureUniqueLandmarks() {
  // Ensure landmarks have unique accessible names if duplicates exist
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const name = landmark.getAttribute('aria-label') || landmark