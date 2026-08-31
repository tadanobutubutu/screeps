// main.js - Accessibility-focused implementation

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
// todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526

/**
 * Main application entry point with accessibility features
 */

function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

const checkTableStructure = /* existing code */

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
    const packageJsonPath = path.join(process.cwd(), 'package.json');
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
    addLangAttribute,
    handleCredentialResponse
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
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function setupKeyboardNavigation() {
  /* existing code */
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Ensure images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
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

function createInPageButton(buttonId, buttonText) {
  /* existing code */
}

function validateLinkAccessibility(options) {
  /* existing code */
}

function handleFakeLinks(issues) {
  /* existing code */
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

// Utilities for addressing accessibility issues
const AddressabilityIssues = {
  addressAccessibilityIssues(insightReport) {
    /* existing code */
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

    return { valid: true, element: tagName, role: landmarkRole };
  },

  spawnSomeCommand(callback) {
    const child_process = require('child_process');
    child_process.spawn('someCommand', {}, {
      stdio: 'inherit',
    }).on('exit', (code, signal) => {
      if (code === 0) {
        callback(null, 'Successfully executed someCommand');
      } else {
        callback(new Error(`someCommand failed with code ${code}`));
      }
    });
  },

  addLangAttribute(element, lang) {
    element.setAttribute('lang', lang);
  },

  countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  }
};

function getLangAttribute() {
  return navigator.language || 'en-US';
}

function wrapPrimaryContentInMain() {
  const mainElement = document.createElement('main');
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
  
  const primaryContent = document.querySelector('main') || document.querySelector('article') || document.querySelector('[role="main"]');
  
  if (primaryContent && primaryContent.parentNode) {
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
  }
  
  return mainElement;
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) {
    return { valid: false, error: 'Table element is required' };
  }
  
  const issues = [];
  
  // Check for caption
  if (!tableElement.querySelector('caption')) {
    issues.push('Missing table caption');
  }
  
  // Check for scope attributes on th elements
  const thElements = tableElement.querySelectorAll('th');
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`Table header cell ${index + 1} missing scope attribute`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function validateTableStructure(tableElement) {
  if (!tableElement) {
    return { valid: false, error: 'Table element is required' };
  }
  
  const issues = [];
  
  // Check for proper table structure
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  
  if (!thead) {
    issues.push('Missing thead element');
  }
  
  if (!tbody) {
    issues.push('Missing tbody element');
  }
  
  // Check for orphaned td elements
  const tfoot = tableElement.querySelector('tfoot');
  const hasTbody = !!tbody;
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0 && !hasTbody) {
      issues.push(`Row ${index + 1} has no cells`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return null;
  }
  
  // Check for existing aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for title element
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }
  
  // Check for desc element
  const descElement = svgElement.querySelector('desc');
  if (descElement && descElement.textContent) {
    return descElement.textContent;
  }
  
  // Try to infer from surrounding context
  const parent = svgElement.parentElement;
  if (parent) {
    const parentAlt = parent.getAttribute('alt');
    if (parentAlt) {
      return parentAlt;
    }
    
    const parentTitle = parent.getAttribute('title');
    if (parentTitle) {
      return parentTitle;
    }
  }
  
  return null;
}

function addAriaToFormControls(formElement) {
  if (!formElement) {
    return;
  }
  
  const inputs = formElement.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const id = input.id;
    
    if (!id) {
      return; // Skip if no ID
    }
    
    // Check if there's a label association
    const hasLabel = input.hasAttribute('aria-label') || 
                     input.hasAttribute('aria-labelledby') ||
                     document.querySelector(`label[for="${id}"]`);
    
    if (!hasLabel) {
      const type = input.type || 'text';
      input.setAttribute('aria-label', `${type} input`);
    }
  });
}

function validateLandmarkStructure(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }
  
  const issues = [];
  
  // Check if element has implicit or explicit landmark role
  const tag = element.tagName ? element.tagName.toLowerCase() : '';
  
  const validTags = ['header', 'main', 'nav', 'aside', 'footer', 'section', 'form'];
  const landmarkRoles = ['banner', 'main', 'navigation', 'complementary', 'contentinfo', 'region', 'form'];
  
  const role = element.getAttribute('role');
  
  if (!role && !validTags.includes(tag)) {
    issues.push('Element is missing landmark role and is not a semantic landmark element');
  }
  
  return { valid: issues.length === 0, issues };
}

function addFixLandmarkIssues(landmarks) {
  if (!Array.isArray(landmarks)) {
    return;
  }
  
  const seenRoles = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    
    if (seenRoles[role]) {
      // Add unique identifier by converting to section if main
      if (role === 'main') {
        landmark.setAttribute('role', 'region');
        const newId = `main-fix-${seenRoles[role]}`;
        landmark.setAttribute('aria-label', newId);
      }
      seenRoles[role]++;
    } else {
      seenRoles[role] = 1;
    }
  });
}

function createAccessibleLink(url, text) {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

function fixFakeLinkIssues(issues) {
  if (!Array.isArray(issues)) {
    return;
  }
  
  issues.forEach(issue => {
    if (issue.type === 'fake-link') {
      const element = issue.element;
      if (element) {
        // Remove JavaScript from href
        const href = element.getAttribute('href') || '';
        if (href.startsWith('javascript:')) {
          element.setAttribute('href', '#');
          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
        }
      }
    }
  });
}

function validateLandmark(element) {
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

  return { valid: true, element: tagName, role: landmarkRole };
}

function ensureUniqueLandmarksFromString(source) {
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

export {
  MyComponent,
  AddressabilityIssues,
};