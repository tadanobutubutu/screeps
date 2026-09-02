// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

const AddressabilityIssues = {
  // Issue types for accessibility reporting
  MISSING_ID: 'missing-id',
  MISSING_LABEL: 'missing-label',
  MISSING_ROLE: 'missing-role',
  INVALID_TABLE: 'invalid-table-structure',

  ensureElementId(element, prefix = 'el') {
    if (!element) return '';
    if (!element.id) {
      const generatedId = `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
      element.id = generatedId;
    }
    return element.id;
  },
  addAriaLabel(element, label) {
    if (!element) return;
    if (label && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  },
  renderDependencyGraph(graphData, container) {
    if (!container) return;
    container.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dependency graph');
    container.appendChild(svg);
  },
  // Addressability-related functionality
  // Placeholder for addressability issues tracking
  issues: [],
  add: function(issue) {
    this.issues.push(issue);
  },
  clear: function() {
    this.issues = [];
  },

  analyzeAccessibilityIssues: function(insightReport) {
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
          message: `Section ${index} has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible language
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section ${index} contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  generateAccessibilityReport: function(accessibilityReport) {
    if (!accessibilityReport || !accessibilityReport.issues || accessibilityReport.issues.length === 0) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore: function(fixedIssues) {
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

  convertMainToSection: function(source) {
    const mainBlockRegex = /<main\b([^>]*)>([\s\S]*?)<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main\b([^>]*)>/i, '<section$1>')
        .replace(/<\/main>/i, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark: function(element) {
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

  createInPageButton: function(options) {
    const button = document.createElement('button');
    button.textContent = options.text || 'Click me';
    button.setAttribute('aria-label', options.ariaLabel || options.text);
    button.className = options.className || 'in-page-button';
    if (options.onClick) {
      button.addEventListener('click', options.onClick);
    }
    return button;
  },

  personName: function(firstName, lastName) {
    return `${firstName} ${lastName}`.trim();
  },

  addLangAttribute: function(element, lang) {
    element.setAttribute('lang', lang);
  },

  countDependencies: function() {
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

  ensureUniqueLandmarksFromString: function(str) {
    return str;
  },

  initializeDependencyGraphWithNewFunctions(graphData, container, options = {}) {
    initializeDependencyGraph(container);
    renderGraph(graphData, container, options);
  }

  // Old function for reference
  // renderDependencyGraph(graphData, container) {
  //   if (!container) return;
  //   container.innerHTML = '';
  //   const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  //   svg.setAttribute('role', 'img');
  //   svg.setAttribute('aria-label', 'Dependency graph');
  //   container.appendChild(svg);
  // }

};

/**
 * Identifies functions that render dependency graphs
 * @returns {string[]} Array of function names that render dependency graphs
 */
function getDependencyGraphFunctions() {
  const functions = [];
  // Check if renderDependencyGraph exists
  if (typeof renderDependencyGraph === 'function') {
    functions.push('renderDependencyGraph');
  }
  // Check if renderGraph exists
  if (typeof renderGraph === 'function') {
    functions.push('renderGraph');
  }
  // Check if renderTree exists
  if (typeof renderTree === 'function') {
    functions.push('renderTree');
  }
  return functions;
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    getDependencyGraphFunctions,
    initializeDependencyGraphWithNewFunctions
  };
}