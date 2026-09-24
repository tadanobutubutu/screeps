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
    return issues || [];
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

    const matches = source.match(mainBlockRegex) || [];
    if (matches.length <= 1) {
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
  if (role && landmarkRoles.includes(role.toLowerCase())) return true;

  const landmarkTags = ['HEADER', 'FOOTER', 'NAV', 'MAIN', 'ASIDE', 'SECTION', 'ARTICLE'];
  if (element.tagName && landmarkTags.includes(element.tagName.toUpperCase())) return true;

  return false;
}

function ensureDependencyGraphAriaRole(container) {
  if (!container) return;
  
  const existingRole = container.getAttribute('role');
  if (existingRole) return;
  
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', container.getAttribute('aria-label') || 'Dependency Graph');
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
  const accessibilityScore = addressabilityIssues.calculateAccessibilityScore(accessibilityReport);

  res.json({ issues, accessibilityReport, accessibilityScore });
});

app.get('/api/accessibility/scan', (req, res) => {
  exec('accessibility-scan.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ error: 'Accessibility scan failed' });
      return;
    }

    const result = { stdout, stderr };
    res.json(result);
  });
});

function ensureDomIsLoaded() {
  if (document) {
    // Access DOM elements if needed
  }
}

function init() {
  ensureDomIsLoaded();

  const rootElement = typeof document !== 'undefined' ? (document.documentElement || document.body) : null;

  if (rootElement && validateLandmark(rootElement)) {
    console.log('Landmark validation passed.');
  } else {
    console.log('Landmark validation failed.');
  }

  addressabilityIssues.calculateAccessibilityScore([
    { type: 'missing-aria-label', element: 'button' },
    { type: 'missing-alt-text', element: 'image' }
  ]);

  const dependencyGraphContainer = typeof document !== 'undefined' ? document.getElementById('dependencyGraph') : null;
  if (dependencyGraphContainer) {
    ensureDependencyGraphAriaRole(dependencyGraphContainer);
  }

  // Trigger accessibility scan with `accessibility-scan.sh` command
  spawnSomeCommand();
}

function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

if (require.main === module) {
  startApp();
}

module.exports = {
  getConfig,
  createServer,
  addressabilityIssues,
  validateLandmark,
  ensureDependencyGraphAriaRole,
  addLangAttribute,
  init
};