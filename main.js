// TODO: Address accessibility issues from insight report:

// main.js - Entry point for the application

// Module imports and configuration
const config = require('./config');
const logger = require('./utils/logger');
const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');
const path = require('path');
const fs = require('fs');

// Configuration - merged
const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

let appData = {};
const appState = {
  initialized: false,
  data: null,
  cache: {},
  lang: 'en'
};

const helper = (input) => input ? input.toUpperCase() : '';
const formatDate = (date) => (date instanceof Date ? date.toISOString().split('T')[0] : null);
const validateInput = (input) => {
  if (typeof input !== 'string') return false;
  return input.trim().length > 0;
};

const { validateInput: validatorValidateInput } = require('./utils/validators');
const { processData: processorProcessData } = require('./utils/processor');

const processData = (data) => (data ? { ...data, processed: true } : null);

function newFunction() {
  console.log('New function executed');
}

function handleCredentialResponse(response) {
  const credential = JSON.parse(response.credential);

  if (!credential || !credential.credential || !credential.clientId) {
    throw new Error('Invalid credential response structure');
  }

  localStorage.setItem('authCredential', JSON.stringify({
    token: credential.credential,
    clientId: credential.clientId,
    timestamp: Date.now()
  }));

  return credential;
}

function function3() {
  console.log('function3 executed');
}

const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this)
      });
      return true;
    }
    return false;
  },

  renderButton: function(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      });
      return true;
    }
    return false;
  },

  handleCredentialResponse: function(response) {
    console.log('Google Sign-In successful');
    return response;
  }
};

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function validateLandmarkObject(landmark) {
  const errors = [];
  if (!landmark) errors.push('Landmark is null or undefined');
  else {
    if (typeof landmark.id === 'undefined' || landmark.id === null) {
      errors.push('Landmark must have an id');
    }
  }
  return { valid: errors.length === 0, errors };
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

function processLandmarks(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, config.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    const seen = new Set();
    return landmarks.filter(landmark => {
        if (seen.has(landmark.id)) {
            return false;
        }
        seen.add(landmark.id);
        return true;
    });
}

function ensureUniqueLandmarksFromString(str) {
    try {
        const landmarks = JSON.parse(str);
        return ensureUniqueLandmarks(landmarks);
    } catch (e) {
        return [];
    }
}

function validateLandmark(landmark) {
    return isValidLandmark(landmark);
}

function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

function getLangAttribute() {
  return document.documentElement.lang;
}

function validateTableAccessibility() {
  return [];
}

function validateTableStructure() {
  return [];
}

function getSvgAccessibleName() {
  return [];
}

function validateLinkAccessibility() {
  return [];
}

function analyzeAccessibility(issuesData) {
  return issuesData || [];
}

function addressAccessibilityIssues() {
}

function createInPageButton() {
}

function setSvgAccessibleNames(id1, id2, label1, label2) {
}

function fixFakeLink() {
}

function setLanguageAttribute() {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

function addLandmarkRoles() {
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }
}

function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  if (parent.tagName?.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  if (!link.href || link.href.trim() === '') {
    return false;
  }

  if (!link.textContent || link.textContent.trim() === '') {
    return false;
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[role="button"], a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.removeAttribute('href');
  });
}

function initialize() {
  console.log('Initializing application...');
  
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  return true;
}

const initializeApp = () => {
  console.log('Application initialized');

  const mainContent = document.querySelector('[role="main"]') || document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('aria-label', 'Main content area');
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  setLanguageAttribute();
  addLandmarkRoles();
  fixFakeLinks();

  addressAccessibilityIssues();
  createInPageButton();
  setSvgAccessibleNames('svg1Id', 'svg2Id', ' aria-label for SVG1', ' aria-label for SVG2');
  ensureUniqueLandmarks([]);
  fixFakeLink();

  if (a11y && a11y.init) {
    a11y.init();
  }

  if (processed.length > 0) {
    enhanceSystemWithHarvestedData(processed);
  };
};

async function scanAccessibility(htmlContent, url) {
  let document;
  let window;

  if (htmlContent) {
    const dom = new JSDOM(htmlContent, { url: url || 'http://localhost', pretendToBeVisual: true });
    document = dom.window.document;
    window = dom.window;
  } else if (typeof global.document !== 'undefined') {
    document = global.document;
    window = global.window;
  } else {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { pretendToBeVisual: true });
    document = dom.window.document;
    window = dom.window;
  }

  const axeCore = require('axe-core');

  try {
    const results = await axeCore.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
      },
      resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable']
    }, window);

    const report = {
      timestamp: new Date().toISOString(),
      url: url || 'local',
      documentTitle: document.title,
      issues: {
        violations: results.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map(n => ({
            html: n.html,
            target: n.target,
            failureSummary: n.failureSummary
          }))
        })),
        passes: results.passes.length,
        incomplete: results.incomplete.map(i => ({
          id: i.id,
          impact: i.impact,
          description: i.description,
          nodes: i.nodes.map(n => ({
            html: n.html,
            target: n.target
          }))
        })),
        inapplicable: results.inapplicable.length,
        summary: {
          totalViolations: results.violations.length,
          critical: results.violations.filter(v => v.impact === 'critical').length,
          serious: results.violations.filter(v => v.impact === 'serious').length,
          modal: results.violations.filter(v => v.impact === 'moderate').length,
          minor: results.violations.filter(v => v.impact === 'minor').length
        }
      }
    };

    return report;
  } catch (error) {
    console.error('Accessibility scan failed:', error.message);
    return {
      timestamp: new Date().toISOString(),
      url: url || 'local',
      error: error.message,
      issues: {
        violations: [],
        passes: 0,
        incomplete: [],
        inapplicable: 0,
        summary: {
          totalViolations: 0,
          critical: 0,
          serious: 0,
          modal: 0,
          minor: 0
        }
      }
    };
  }
}

async function generateAccessibilityReport(htmlContent, url) {
  const report = await scanAccessibility(htmlContent, url);
  writeReport(report);
  return report;
}

function writeReport(report) {
  const reportPath = path.join(__dirname, CONFIG.dataPath, 'accessibility-report.json');
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log('Report written to', reportPath);
  } catch (error) {
    console.error('Error writing report:', error.message);
  }
}

const app = express();

app.get('/landmarks', (req, res) => {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  res.json(sorted);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

function enhanceSystemWithHarvestedData(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }

  const sortedLandmarks = sortLandmarks(landmarks);

  const enhancedLandmarks = sortedLandmarks.map(landmark => {
    if (!landmark.ariaRole) {
      landmark.ariaRole = 'landmark';
    }

    if (!landmark.ariaLabel) {
      landmark.ariaLabel = `Landmark: ${landmark.id || 'Unnamed'}`;
    }

    if (!landmark.type) {
      landmark.type = 'generic';
    }

    return landmark;
  });

  const report = {
    title: 'System Upgrade Report',
    timestamp: new Date().toISOString(),
    totalLandmarks: enhancedLandmarks.length,
    summary: {
      description: 'System upgraded using harvested landmark data',
      actionsTaken: [
        'Added ARIA roles to all landmarks',
        'Enhanced accessibility metadata',
        'Generated comprehensive report'
      ]
    },
    landmarks: enhancedLandmarks
  };

  writeReport(report);
  return report;
}

function upgradeSystem(harvestedData) {
  console.log('Applying upgrade logic with harvested data:', harvestedData);

  if (harvestedData) {
    if (harvestedData.maxResults) {
      config.maxResults = harvestedData.maxResults;
    }
    if (harvestedData.debug !== undefined) {
      config.debug = harvestedData.debug;
    }
  }

  return true;
}

function main() {
  const initialized = initialize();
  if (initialized) {
    console.log('Application started successfully');
  }
  return initialized;
}

const formatResponse = (data) => {
  return JSON.stringify(data, null, 2);
};

if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    console.log('First landmark:', sorted[0]);
  }
};

const ensureDependencyGraphAriaRole = () => {
  if (typeof document !== 'undefined') {
    const container = document.getElementById('dependencyGraph') || document.getElementById('dependency-graph');
    if (container) {
      const currentRole = container.getAttribute('role');
      if (!currentRole) {
        container.setAttribute('role', 'region');
      }
      if (!container.getAttribute('aria-label')) {
        container.setAttribute('aria-label', 'Dependency Graph');
      }
    }
  }
};

export {
  app,
  initializeApp,
  fetchUser,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  improveAccessibility,
  generateAccessibilityReport,
  scanAccessibility,
  validateLandmarkObject,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  checkLinkAccessibility,
  loadLandmarks,
  isValidLandmark,
  validateLandmark,
  ensureUniqueLandmarksFromString,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  validateLinkAccessibility,
  wrapPrimaryContentInMain,
  handleFakeLinks,
  setLanguageAttribute,
  fixFakeLink,
  setSvgAccessibleNames,
  createInPageButton,
  upgradeSystem,
  enhanceSystemWithHarvestedData
};

module.exports = {
  config,
  CONFIG,
  initialize,
  initializeApp,
  main,
  helperFunction: utils.helper,
  analyzeAccessibility,
  scanAccessibility,
  generateAccessibilityReport,
  checkLinkAccessibility,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  ensureUniqueLandmarksFromString,
  validateLandmark,
  isValidLandmark,
  validateLandmarkObject,
  addressAccessibilityIssues,
  createInPageButton,
  setSvgAccessibleNames,
  fixFakeLink,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  validateLinkAccessibility,
  wrapPrimaryContentInMain,
  handleFakeLinks,
  formatResponse,
  validateInput: validatorValidateInput,
  processData: processorProcessData,
  upgradeSystem,
  functionA: {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ'
  },
  functionB: {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ'
  },
  googleSignIn,
  newFunction,
  handleCredentialResponse,
  function3
};