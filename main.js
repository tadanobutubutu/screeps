// main.js - Accessibility-focused implementation

// TODO: add the new functions or changes requested in the issue
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

  addAriaLabel(element, label) {
    if (!element) {
      return { success: false, error: 'Element is required' };
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

  validateFocusManagement(container) {
    if (!container || typeof container !== 'object') {
      return { valid: false, error: 'Container is required' };
    }

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    let focusableElements = [];
    try {
      focusableElements = container.querySelector
        ? Array.from(container.querySelectorAll(focusableSelectors.join(',')))
        : [];
    } catch (e) {
      return { valid: false, error: 'Unable to query focusable elements' };
    }

    const tabIndexIssues = focusableElements.filter(el => {
      const tabIndex = el.getAttribute ? el.getAttribute('tabindex') : null;
      return tabIndex && parseInt(tabIndex, 10) > 0;
    });

    return {
      valid: tabIndexIssues.length === 0,
      focusableCount: focusableElements.length,
      tabIndexIssues: tabIndexIssues.length,
      elements: focusableElements
    };
  }
};

/* todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 */
const AddressabilityIssues = {
  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || accessibilityReport.issues.length === 0) {
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

  transformMainToSection(source) {
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

    if (!landmarkRole && tagName === 'div') {
      landmarkRole = 'region';
    }

    if (!landmarkRole) {
      return {
        valid: false,
        error: 'Element does not have a valid landmark role',
        element: tagName
      };
    }

    if (landmarkRoles.indexOf(landmarkRole) === -1) {
      return {
        valid: false,
        error: `Invalid landmark role: ${landmarkRole}`,
        element: tagName,
        role: landmarkRole
      };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  runAccessibilityCheck(callback) {
    const child_process = require('child_process');

    const spawnOptions = {
      shell: true
    };

    child_process.spawn('echo', ['Running accessibility checks...'], spawnOptions, (error, stdout, stderr) => {
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
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  }
};

module.exports = { AddressabilityIssues, AccessibilityUtils };