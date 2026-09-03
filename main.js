const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const { createServer, startApp, config } = require('./');
const { addLangAttribute, ensureUniqueLandmarks, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, createInPageButton, createAccessibleLink, handleAccessibilityIssues, addAriaLabel } = require('./accessibility');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

// TODO: Add headers for accessibility improvements (priority callback)
app.use((req, res, next) => {
  res.setHeader('Content-Language', 'en');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Script to run the bot code (assuming it's a Scripts file in the Scripts directory)
app.get('/api/run', (req, res) => {
  const scriptPath = path.join(__dirname, '..', 'Scripts', req.query.script || 'main');
  if (!fs.existsSync(scriptPath)) {
    res.status(404).send('Script not found.');
    return;
  }

  const script = fs.readFileSync(scriptPath, 'utf-8');
  const result = execSync(`node ${scriptPath}`);

  res.send(result.toString());
});

// API endpoint for accessing the accessibility check report (assuming fetching data from a JSON file)
app.get('/api/accessibility-report', (req, res) => {
  fs.readFile(__dirname + '/accessibility-report.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    const report = JSON.parse(data);
    res.json(report);
  });
});

// Address accessibility issues upon rendering the main HTML content
addLangAttribute(document);

// Initialize app (process accessibility issues and wrap primary content if needed)
initializeApp();

createServer(app).listen(config.port, () => {
  console.log(`Listening on port ${config.port}...`);
});

// Controller for handling accessibility issues
function addressInsightIssues() {
  getLangAttribute();
  addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

  if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
    ensureUniqueLandmarks(landmarks);
  }
  ensureUniqueLandmarks();

  validateTableAccessibility();
  validateTableStructure();

  getSvgAccessibleName();

  createInPageButton();
  createAccessibleLink();
  handleAccessibilityIssues();

  validateLandmark();
  validateLandmarkStructure();
}

// Initialize app
function initializeApp() {
  addressInsightIssues();
  if (typeof wrapPrimaryContentInMain === 'function') {
    wrapPrimaryContentInMain();
  }
}