// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ALT: 'missing-alt',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',
  LOW_CONTRAST: 'low-contrast',
  TINY_SIZE: 'tiny-size',

  addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

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
    element.setAttribute('lang', lang);
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

  getSvgAccessibleName(svg) {
    if (!svg) return '';
    return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title')?.textContent || '';
  },

  setSvgAttributes(svg) {
    if (!svg) return;
  
    // Handle width: set to 24 if missing or less than 24
    const width = svg.getAttribute('width');
    if (!width || parseInt(width) < 24) {
      svg.setAttribute('width', '24');
    }
  
    // Handle height: set to 24 if missing or less than 24
    const height = svg.getAttribute('height');
    if (!height || parseInt(height) < 24) {
      svg.setAttribute('height', '24');
    }
  },

  detectAccessibilityIssues(elements) {
    const issues = [];
  
    elements.forEach((element, index) => {
      if (!element.id) {
        issues.push({
          element: index,
          type: AddressabilityIssues.MISSING_ID,
          message: 'Element is missing an id attribute'
        });
      }
      
      if (!element.getAttribute('role')) {
        issues.push({
          element: index,
          type: AddressabilityIssues.MISSING_ROLE,
          message: 'Element is missing a role attribute'
        });
      }
    });

    return issues;
  },

  initializeAccessibility(container) {
    let svgElements;
    if (container instanceof Element) {
      svgElements = container.querySelectorAll('svg');
    } else if (Array.isArray(container)) {
      svgElements = container;
    } else {
      svgElements = [];
    }

    svgElements.forEach(svg => {
      if (!svg.id) {
        svg.id = generateUniqueId();
      }

      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }

      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName) {
        svg.setAttribute('aria-label', accessibleName);
      }

      setSvgAttributes(svg);
    });

    return {
      issues: detectAccessibilityIssues(svgElements),
      count: svgElements.length
    };
  },

  handleCredentialResponse(response) {
    if (!response) {
      return {
        success: false,
        message: 'No credential response provided'
      };
    }

    if (!response.token) {
      return {
        success: false,
        message: 'Token is missing from credential response'
      };
    }

    try {
      // Store credentials securely
      const credentialData = {
        token: response.token,
        refreshToken: response.refreshToken || null,
        expiresAt: response.expiresIn ? Date.now() + (response.expiresIn * 1000) : null,
        receivedAt: Date.now()
      };

      // Emit custom event for other components to handle
      if (typeof window !== 'undefined') {
        const credentialEvent = new CustomEvent('credential-response', {
          detail: credentialData,
          bubbles: true
        });
        window.dispatchEvent(credentialEvent);
      }

      return {
        success: true,
        message: 'Credential response handled successfully',
        data: credentialData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process credential response: ' + error.message
      };
    }
  },

  getStoredCredentials() {
    const stored = sessionStorage.getItem('credentials');
    if (!stored) return null;

    try {
      const credentials = JSON.parse(stored);
      if (credentials.expiresAt && Date.now() > credentials.expiresAt) {
        sessionStorage.removeItem('credentials');
        return null;
      }
      return credentials;
    } catch (error) {
      return null;
    }
  },

  clearCredentials() {
    sessionStorage.removeItem('credentials');
    if (typeof window !== 'undefined') {
      const clearEvent = new CustomEvent('credentials-cleared', {
        bubbles: true
      });
      window.dispatchEvent(clearEvent);
    }
  }
};

// TODO: Add the implementation details here
function generateUniqueId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

function checkTableStructure(table) {
  if (!table) return false;
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

// Export functions for testing
const getSvgAccessibleName = AddressabilityIssues.getSvgAccessibleName;
const setSvgAttributes = AddressabilityIssues.setSvgAttributes;
const detectAccessibilityIssues = AddressabilityIssues.detectAccessibilityIssues;
const initializeAccessibility = AddressabilityIssues.initializeAccessibility;
const handleCredentialResponse = AddressabilityIssues.handleCredentialResponse;
const getStoredCredentials = AddressabilityIssues.getStoredCredentials;
const clearCredentials = AddressabilityIssues.clearCredentials;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    initializeAccessibility,
    getSvgAccessibleName,
    setSvgAttributes,
    checkTableStructure,
    generateUniqueId,
    detectAccessibilityIssues,
    handleCredentialResponse,
    getStoredCredentials,
    clearCredentials
  };
}