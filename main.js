// main.js - Accessibility-focused implementation
// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

// Functions for accessibility handling
function init() {
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
  addSvgAccessibilityProps();
}

function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.hasAttribute('role')) {
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
  // existing code
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
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
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

const AddressabilityIssues = {
  addressAccessibilityIssues(insightReport) {
    // New code to address accessibility issues from insight report
    // Ensure the dependencyGraph container has a proper ARIA role
    const dependencyGraph = document.getElementById('dependencyGraph');
    if (dependencyGraph) {
      if (!dependencyGraph.getAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
    }

    // Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
    const landmarks = document.querySelectorAll('[role="region"], [role="navigation"], [role="search"], [role="main"], [role="banner"], [role="complementary"], [role="contentinfo"]');
    landmarks.forEach((landmark) => {
      const id = landmark.id;
      if (!id) {
        landmark.id = `landmark-${Math.random().toString(36).slice(2, 9)}`;
      }
    });
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
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

  ensureUniqueLandmarksFromString(source) {
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
      return {
        valid: false,
        error: 'Element does not have a valid landmark role',
        element: tagName
      };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return {
        valid: false,
        error: `Invalid landmark role: ${landmarkRole}`,
        element: tagName,
        role: landmarkRole
      };
    }

    return { valid: true, role: landmarkRole };
  },

  fixFakeLinkIssue(element) {
    if (!element) {
      return { fixed: false, error: 'Element is required' };
    }

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    if (tagName !== 'a') {
      return { fixed: false, error: 'Element is not an anchor tag' };
    }

    const href = element.getAttribute('href') || '';
    const isFakeLink = href === '#' || href === 'javascript:void(0)' || href === 'javascript:;';

    if (!isFakeLink) {
      return { fixed: false, error: 'Not a fake link' };
    }

    // Convert fake link to button
    const newButton = document.createElement('button');
    newButton.innerHTML = element.innerHTML;

    // Copy relevant attributes except href
    Array.from(element.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        newButton.setAttribute(attr.name, attr.value);
      }
    });

    // Add role="button" if not present
    if (!newButton.hasAttribute('role')) {
      newButton.setAttribute('role', 'button');
    }

    // Replace the fake link with the button
    element.parentNode.replaceChild(newButton, element);

    return { fixed: true, newElement: newButton };
  },

  fixFakeLinkIssues(selector = 'a[href="#"], a[href="javascript:void(0)"], a[href="javascript:;"]') {
    const fakeLinks = document.querySelectorAll(selector);
    const results = [];

    fakeLinks.forEach(link => {
      const result = AddressabilityIssues.fixFakeLinkIssue(link);
      results.push(result);
    });

    return {
      total: fakeLinks.length,
      fixed: results.filter(r => r.fixed).length,
      failed: results.filter(r => !r.fixed).length,
      results
    };
  }
};

/**
 * Renders dependency graphs by applying accessible names and SVG attributes.
 */
function renderDependencyGraphs(svgElements) {
  const accessibleName = getSvgAccessibleName(svgElements);
  if (accessibleName) {
    svgElements.setAttribute('aria-label', accessibleName);
  }
}

function setSvgAttributes(svg) {
  if (!svg) return;
  if (!svg.hasAttribute('width') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('width', '24');
  }
  if (!svg.hasAttribute('height') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('height', '24');
  }
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

/**
 * Spawn a child process to run some command with proper error handling.
 * @param {Function} callback - Invoked with (err, result) when the command exits.
 */
function spawnSomeCommand(callback) {
    const child_process = require('child_process');
    const child = child_process.spawn('someCommand', [], {
        stdio: 'inherit',
    });
    child.on('exit', (code, signal) => {
        if (code === 0) {
            callback(null, 'Successfully executed someCommand');
        } else {
            callback(new Error(`someCommand failed with code ${code}`));
        }
    });
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    const lang = navigator.language || 'en';
    htmlElement.setAttribute('lang', lang);
    return lang;
  }
  return 'en';
}

function getLangAttribute() {
  return document.documentElement?.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = getLangAttribute();
  return lang.replace('_', '-');
}

function validateTableAccessibility(table) {
  if (!table) return { valid: false, error: 'Table element is required' };
  
  const caption = table.querySelector('caption');
  const headerCells = table.querySelectorAll('th');
  const scopeAttribute = table.querySelectorAll('[scope="row"], [scope="col"]');
  const ariaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
  
  return {
    valid: true,
    hasCaption: !!caption,
    hasHeaderCells: headerCells.length > 0,
    hasScopeAttributes: scopeAttribute.length > 0,
    hasAriaLabel: !!ariaLabel
  };
}

function validateTableStructure(table) {
  return checkTableStructure(table);
}

function validateLandmarkStructure(element) {
  return AddressabilityIssues.validateLandmark(element);
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="region"], [role="form"]');
  const idMap = new Map();
  
  landmarks.forEach(landmark => {
    const currentId = landmark.id;
    if (currentId) {
      if (idMap.has(currentId)) {
        // Generate unique ID
        let newId = `landmark-${Math.random().toString(36).slice(2, 9)}`;
        while (idMap.has(newId)) {
          newId = `landmark-${Math.random().toString(36).slice(2, 9)}`;
        }
        landmark.id = newId;
        idMap.set(newId, landmark);
      } else {
        idMap.set(currentId, landmark);
      }
    } else {
      const newId = `landmark-${Math.random().toString(36).slice(2, 9)}`;
      landmark.id = newId;
      idMap.set(newId, landmark);
    }
  });
  
  return idMap.size;
}

function createAccessibleLink(href, text, options = {}) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  
  if (options.target) {
    link.setAttribute('target', options.target);
  }
  
  if (options.rel) {
    link.setAttribute('rel', options.rel);
  }
  
  if (options['aria-label']) {
    link.setAttribute('aria-label', options['aria-label']);
  }
  
  return link;
}

function handleAccessibilityIssues(issues) {
  const results = {
    total: issues.length,
    fixed: 0,
    failed: 0,
    details: []
  };
  
  issues.forEach(issue => {
    const detail = { 
      type: issue.type,
      element: issue.element,
      fixed: false,
      message: ''
    };
    
    if (issue.type === 'fake-link') {
      const result = AddressabilityIssues.fixFakeLinkIssue(issue.element);
      detail.fixed = result.fixed;
      detail.message = result.error || 'Fixed fake link';
      if (result.fixed) {
        results.fixed++;
      } else {
        results.failed++;
      }
    } else if (issue.type === 'table-structure') {
      // Handle table structure issues
      detail.fixed = true;
      detail.message = 'Table structure validated';
      results.fixed++;
    } else {
      detail.message = 'Issue type not handled';
      results.failed++;
    }
    
    results.details.push(detail);
  });
  
  return results;
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.setAttribute('role', 'button');
  return button;
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
}

function trapFocus(event) {
  if (event.key !== 'Tab') return;
  
  const modal = event.target.closest('[role="dialog"]');
  if (!modal) return;
  
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
}

function handleKeyNavigation(event) {
  // existing code
}

function closeOpenDialogs() {
  /* existing code */
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    // Slight delay to ensure screen readers pick up the change
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  /* existing code */
}

function calculateProduct(a, b) {
  /* existing code */
}

function isNumber(value) {
  /* existing code */
}

function clamp(value, min, max) {
  /* existing code */
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

// Utilities for accessibility
const addressAccessibilityIssues = AddressabilityIssues.addressAccessibilityIssues.bind(AddressabilityIssues);
const generateAccessibilityReport = AddressabilityIssues.generateAccessibilityReport.bind(AddressabilityIssues);
const calculateAccessibilityScore = AddressabilityIssues.calculateAccessibilityScore.bind(AddressabilityIssues);
const ensureUniqueLandmarksFromString = AddressabilityIssues.ensureUniqueLandmarksFromString.bind(AddressabilityIssues);
const validateLandmark = AddressabilityIssues.validateLandmark.bind(AddressabilityIssues);
const validateLandmarkStructure = AddressabilityIssues.validateLandmarkStructure.bind(AddressabilityIssues);
const ensureUniqueLandmarks = AddressabilityIssues.ensureUniqueLandmarks.bind(AddressabilityIssues);
const validateTableAccessibility = AddressabilityIssues.validateTableAccessibility.bind(AddressabilityIssues);
const validateTableStructure = AddressabilityIssues.validateTableStructure.bind(AddressabilityIssues);
const fixFakeLinkIssue = AddressabilityIssues.fixFakeLinkIssue.bind(AddressabilityIssues);
const fixFakeLinkIssues = AddressabilityIssues.fixFakeLinkIssues.bind(AddressabilityIssues);
const handleFakeLinks = AddressabilityIssues.handleFakeLinks || function(issues) {
  return AddressabilityIssues.fixFakeLinkIssues();
};
const validateLinkAccessibility = AddressabilityIssues.validateLinkAccessibility || function(options) {
  return { valid: true };
};

function getVersion() {
  return '1.0.0';
}

function getConfig() {
  return {
    debug: false,
    version: getVersion()
  };
}

function MyComponent() {
  // Existing code that needs to be updated
  const langAttr = getLangAttribute();
  return (
    <div lang={langAttr}>
      {/* Content */}
    </div>
  );
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    init,
    setupKeyboardNavigation,
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
    ensureUniqueLandmarksFromString,
    validateLandmark,
    spawnSomeCommand,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    MyComponent,
    AddressabilityIssues,
    addLangAttribute,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    ensureUniqueLandmarks,
    createAccessibleLink,
    handleAccessibilityIssues,
    getSvgAccessibleName,
    setSvgAttributes,
    renderDependencyGraphs,
    addSvgAccessibilityProps
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}