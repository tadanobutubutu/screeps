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

function renderIndexView(req, res) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accessibility Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #333; }
        .nav { margin: 20px 0; }
        .nav a { margin-right: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Accessibility Dashboard</h1>
        <nav class="nav">
          <a href="/">Home</a>
          <a href="/dependency-graph">Dependency Graph</a>
          <a href="/scan">Run Scan</a>
        </nav>
        <main>
          <h2>Welcome</h2>
          <p>Use the navigation above to view the dependency graph or run accessibility scans.</p>
        </main>
      </div>
    </body>
    </html>
  `;
  res.send(html);
}

function renderDependencyGraph(req, res) {
  const graphData = {
    nodes: [
      { id: 'main', label: 'main.js', type: 'entry' },
      { id: 'express', label: 'express', type: 'dependency' },
      { id: 'http', label: 'http', type: 'dependency' }
    ],
    edges: [
      { from: 'main', to: 'express' },
      { from: 'main', to: 'http' }
    ]
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dependency Graph</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 1000px; margin: 0 auto; }
        h1 { color: #333; }
        .nav { margin: 20px 0; }
        .nav a { margin-right: 15px; }
        .graph-container { border: 1px solid #ddd; padding: 20px; margin-top: 20px; }
        .node { padding: 10px; margin: 5px; display: inline-block; border-radius: 5px; }
        .node-entry { background: #4CAF50; color: white; }
        .node-dependency { background: #2196F3; color: white; }
        .edge { display: block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Dependency Graph</h1>
        <nav class="nav">
          <a href="/">Home</a>
          <a href="/dependency-graph">Dependency Graph</a>
          <a href="/scan">Run Scan</a>
        </nav>
        <div class="graph-container">
          <h3>Nodes</h3>
          ${graphData.nodes.map(node => `
            <div class="node node-${node.type}">
              <strong>${node.id}</strong>: ${node.label}
            </div>
          `).join('')}
          
          <h3>Edges</h3>
          ${graphData.edges.map(edge => `
            <div class="edge">${edge.from} → ${edge.to}</div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
}

function createServer() {
  const server = http.createServer(app);

  server.get('/', (req, res) => {
    renderIndexView(req, res);
  });

  server.get('/dependency-graph', (req, res) => {
    renderDependencyGraph(req, res);
  });

  server.get('/scan', (req, res) => {
    res.redirect('#');
  });

  server.post('/api/accessibility-report', (req, res) => {
    const report = req.body;

    const issues = addressabilityIssues.processIssues(report);
    const accessibilityReport = addressabilityIssues.generateAccessibilityReport(report);
    const accessibilityScore = addressabilityIssues.calculateAccessibilityScore(report.fixedIssues || []);

    res.json({ issues, accessibilityReport, accessibilityScore });
  });

  server.post('/api/scan', (req, res) => {
    exec('accessibility-scan.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.status(500).json({ error: 'Scan failed' });
        return;
      }

      const result = { stdout, stderr };
      res.json(result);
    });
  });

  return server;
}

function ensureDomIsLoaded() {
  if (typeof document !== 'undefined') {
    // Access DOM elements if needed
  }
}

function init() {
  ensureDomIsLoaded();

  const landmarkCheck = typeof document !== 'undefined' ? (document.documentElement || document.body) : null;

  if (landmarkCheck && validateLandmark(landmarkCheck)) {
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
  createServer,
  getConfig,
  validateLandmark,
  addLangAttribute,
  renderIndexView,
  renderDependencyGraph,
  addressabilityIssues,
  init
};