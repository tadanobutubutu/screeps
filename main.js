const http = require('http');
const path = require('path');
const express = require('express');
const { exec } = require('child_process');

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const app = express();

app.use(express.json());

const addressabilityIssues = {
  processIssues: function(issues) {
    /* existing code */
  },

  generateAccessibilityReport: function(accessibilityReport) {
    if (!accessibilityReport || !accessibilityReport.issues) {
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

  addressAccessibilityIssues: function(source) {
    const mainBlockRegex = /\{[\s\S]*?\}/g;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i];
      result = result.replace(block, block.trim());
    }
    return result;
  }
};

function validateLandmark(element) {
  if (!element) return false;

  const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'];
  const role = element.getAttribute && element.getAttribute('role');
  if (role && landmarkRoles.includes(role)) return true;

  const landmarkTags = ['HEADER', 'FOOTER', 'NAV', 'MAIN', 'ASIDE', 'SECTION', 'ARTICLE'];
  if (element.tagName && landmarkTags.includes(element.tagName)) return true;

  return false;
}

function spawnSomeCommand() {
  /* existing code */
}

function addLangAttribute(element) {
  if (element) {
    element.lang = 'en';
  }
  return element;
}

function getConfig() {
  return config;
}

/**
 * Focus trap implementation for keyboard navigation
 * Keeps keyboard focus within a specified container element
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {Function|null} A cleanup function to remove the focus trap, or null if container is invalid
 */
function trapFocus(container) {
  if (!container) return null;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableElements = container.querySelectorAll(focusableSelectors);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(event) {
    if (event.key !== 'Tab') return;

    if (focusableElements.length === 0) return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        if (lastElement) lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        if (firstElement) firstElement.focus();
      }
    }
  }

  container.addEventListener('keydown', handleTabKey);

  // Return cleanup function to remove the trap
  return function removeTrap() {
    container.removeEventListener('keydown', handleTabKey);
  };
}

function createServer() {
  const server = http.createServer(app);

  server.get('/', (req, res) => {
    res.send('Hello World!');
  });

  return server;
}

app.get('/redirect', (req, res) => {
  res.redirect('#');
});

app.post('/api/accessibility/report', (req, res) => {
  const report = req.body;

  const issues = addressabilityIssues.processIssues(report);
  const accessibilityReport = addressabilityIssues.generateAccessibilityReport(report);
  const accessibilityScore = addressabilityIssues.calculateAccessibilityScore(issues);

  res.json({ issues, accessibilityReport, accessibilityScore });
});

app.get('/api/scan', (req, res) => {
  exec('accessibility-scan.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Accessibility scan failed' });
    }

    const result = { stdout, stderr };
    res.json(result);
  });
});

function ensureDomIsLoaded() {
  if (typeof document !== 'undefined') {
    // Access DOM elements if needed
  }
}

function startApp() {
  ensureDomIsLoaded();

  const documentElement = typeof document !== 'undefined' ? (document.documentElement || document.body) : null;

  const landmarkValid = validateLandmark(documentElement);

  if (landmarkValid) {
    console.log('Landmark validation passed.');
  } else {
    console.log('Landmark validation failed.');
  }

  addressabilityIssues.calculateAccessibilityScore([
    { type: 'missing-aria-label', element: null },
    { type: 'missing-alt-text', element: null }
  ]);

  // Trigger accessibility scan with `accessibility-scan.sh` command
  spawnSomeCommand();
}

if (require.main === module) {
  startApp();
}

module.exports = {
  trapFocus,
  addressabilityIssues,
  validateLandmark,
  spawnSomeCommand,
  addLangAttribute,
  getConfig,
  createServer,
  ensureDomIsLoaded,
  startApp
};