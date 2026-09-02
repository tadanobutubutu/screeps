const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',

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

      // Check for potentially inaccessible link text
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
      return score + (scorePoints[issue.type] || scorePoints.other);
    }, 0);
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

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    const isLandmark = landmarkRoles.includes(role) ||
                       (tagName && implicitLandmarks[tagName]);

    return {
      valid: isLandmark,
      tagName: tagName,
      role: role
    };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    return childProcess.spawn(command, [], {
      stdio: 'inherit',
      shell: true
    });
  },

  addLangAttribute(element, lang) {
    if (element) {
      element.setAttribute('lang', lang);
    } else {
      const html = document.documentElement;
      if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
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
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];

    landmarks.forEach(landmark => {
      const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
      const role = landmark.getAttribute('role');
      const implicitRole = {
        header: 'banner',
        nav: 'navigation',
        main: 'main',
        aside: 'complementary',
        footer: 'contentinfo'
      };

      if (!landmark.hasAttribute('role')) {
        const implicitLandmark = implicitRole[tagName];
        if (implicitLandmark) {
          landmark.setAttribute('role', implicitLandmark);
        }
      }
    });
  }
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

function addBook(bookData) {
  return bookData;
}

function createServer() {
  return null;
}

function generateAccessibilityReport(accessibilityReport) {
  if (!accessibilityReport || !accessibilityReport.issues) {
    return [];
  }

  const report = accessibilityReport.issues.map(issue => ({
    issueType: issue.type,
    status: issue.status || 'pending',
    fixApplied: issue.fixApplied || ''
  }));

  return report;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    fixMainLandmarkIssues: AddressabilityIssues.fixMainLandmarkIssues,
    fixSemanticMarkup: AddressabilityIssues.fixSemanticMarkup,
    validateLandmarkStructure: AddressabilityIssues.validateLandmarkStructure,
    sampleInsightReport,
    addBook,
    createServer,
    generateAccessibilityReport
  };
} else {
  // Browser environment - wait for DOM
  (function() {
    // Browser-specific accessibility functions
    function init() {
      const svgElements = document.querySelectorAll('svg');

      svgElements.forEach(svg => {
        const currentRole = svg.getAttribute('role');
        if (!currentRole) {
          svg.setAttribute('role', 'img');
        }

        const accessibleName = getSvgAccessibleName(svg);
        if (accessibleName) {
          svg.setAttribute('aria-label', accessibleName);
        }

        setSvgAttributes(svg);

        // Ensure ARIA attributes for dependency graphs
        ensureDependencyGraphARIA(svg);
        setupFocusManagement();
        setupAriaLiveRegions();
      });
    }

    function ensureDependencyGraphARIA(svg) {
      if (!svg) return;
      
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', accessibleName);
      }
    }

    function getLangAttribute() {
      const htmlElement = document.documentElement;
      return htmlElement ? htmlElement.getAttribute('lang') : 'en';
    }

    function addLangAttribute() {
      const htmlElement = document.documentElement;
      if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
      }
    }

    function getSvgAccessibleName(svg) {
      const title = svg.querySelector('title');
      if (title && title.textContent) {
        return title.textContent.trim();
      }
      const desc = svg.querySelector('desc');
      if (desc && desc.textContent) {
        return desc.textContent.trim();
      }
      return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
    }

    function setSvgAttributes(svg) {
      if (!svg.hasAttribute('focusable')) {
        svg.setAttribute('focusable', 'true');
      }
    }

    function checkLandmarkElements() {
      console.log('Checking landmark elements...');
      return true;
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
      const modals = document.querySelectorAll('[role="dialog"], .modal');
      modals.forEach((modal) => {
        trapFocus(modal);
      });

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
      const skipLink = document.getElementById('skip-link');
      if (!skipLink) {
        const skipLinkEl = document.createElement('a');
        skipLinkEl.id = 'skip-link';
        skipLinkEl.href = '#main-content';
        skipLinkEl.textContent = 'Skip to main content';
        skipLinkEl.className = 'skip-link';
        skipLinkEl.style.position = 'absolute';
        skipLinkEl.style.left = '-9999px';
        document.body.insertBefore(skipLinkEl, document.body.firstChild);
      }

      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.hasAttribute('alt')) {
          img.setAttribute('alt', '');
          img.setAttribute('role', 'presentation');
        }
      });

      const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
      inputs.forEach((input) => {
        const id = input.id || 'input-' + Math.random().toString(36).substr(2, 9);
        input.id = id;
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          input.setAttribute('aria-label', input.name || 'Input');
        }
      });
    }

    function trapFocus(element) {
      if (!element) return;
      const focusableElements = element.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }

    function closeOpenDialogs() {
      const dialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
      dialogs.forEach((dialog) => {
        dialog.setAttribute('aria-hidden', 'true');
      });
    }

    function announceToScreenReader(message) {
      const liveRegion = document.getElementById('aria-live-region');
      if (liveRegion) {
        liveRegion.textContent = '';
        setTimeout(() => {
          liveRegion.textContent = message;
        }, 100);
      }
    }

    function calculateDifference(a, b) {
      return a - b;
    }

    function calculateProduct(a, b) {
      return a * b;
    }

    function isNumber(value) {
      return typeof value === 'number' && !isNaN(value);
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function createInPageButton(buttonId, buttonText) {
      const button = document.createElement('button');
      button.id = buttonId;
      button.textContent = buttonText;
      return button;
    }

    function handleKeyNavigation(event) {
      const key = event.key;
      if (key === 'Enter' || key === ' ') {
        event.preventDefault();
      }
    }

    function handleFakeLinks(issues) {
      if (!Array.isArray(issues)) return;
      issues.forEach((issue) => {
        if (issue.type === 'fake-link') {
          console.warn('Fake link detected:', issue.element);
        }
      });
    }

    const hello = () => {
      return 'Hello from main.js';
    };

    function checkTableStructure(table) {
      if (!table) return false;
      const rows = table.querySelectorAll('tr');
      return rows.length > 0;
    }

    function initializeAccessibility() {
      if (!document.querySelectorAll) return;
      init();
      enhanceSemanticMarkup();
      checkLandmarkElements();
      AddressabilityIssues.validateLandmarkStructure();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAccessibility);
    } else {
      initializeAccessibility();
    }
  })();
}