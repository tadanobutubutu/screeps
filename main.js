import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { generateDependencyReport, utils, axe } from './utils';

let icons = {};
let dependencyGraph = {};
const books = [];
const safetyCategory = "User Safety: safe";

let appData = {};
const appState = {
  initialized: false,
  data: null,
  cache: {},
  lang: 'en'
};

const helper = (input) => input ? input.toUpperCase() : '';
const formatDate = (date) => (date instanceof Date ? date.toISOString().split('T')[0] : null);
const validateInput = (input) => input && typeof input === 'string' && input.trim().length > 0;
const processData = (data) => (data ? { ...data, processed: true } : null);
const initialize = () => {
  appState.initialized = true;
  console.log('App initialized');
};
const initializeApp = () => {
  initialize();
  return appState;
};
const fetchUser = (userId) => (userId ? { id: userId, name: `User ${userId}` } : null);
const clearCache = () => appState.cache.clear();
const someFunction = () => 'some value';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const app = express();

const fixTableStructureIssues = require('./accessibility-improvements').fixTableStructureIssues;
const fixTableHeaderCellScope = require('./accessibility-improvements').fixTableHeaderCellScope;
const addMainLandmark = require('./accessibility-improvements').addMainLandmark;
const addSvgAccessibleNames = require('./accessibility-improvements').addSvgAccessibleNames;
const fixFakeLinks = require('./accessibility-improvements').fixFakeLinks;
const ensureUniqueLandmarks = require('./accessibility-improvements').ensureUniqueLandmarks;
const addLandmarkRoles = require('./accessibility-improvements').addLandmarkRoles;
const renderDependencyGraph = require('./accessibility-improvements').renderDependencyGraph;
const displayModuleStructure = require('./accessibility-improvements').displayModuleStructure;
const countDependencies = require('./accessibility-improvements').countDependencies;
const analyzeModuleDependencies = require('./accessibility-improvements').analyzeModuleDependencies;
const visualizeModuleRelationships = require('./accessibility-improvements').visualizeModuleRelationships;

const getLangAttribute = () => document.documentElement.lang || 'en';
const writeReport = (report) => {
  const reportPath = path.join(__dirname, CONFIG.dataPath, 'accessibility-report.json');
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log('Report written to', reportPath);
  } catch (error) {
    console.error('Error writing report:', error.message);
  }
};

async function generateAccessibilityReport(htmlContent, url) {
  const report = await scanAccessibility(htmlContent, url);
  writeReport(report);
  return report;
}

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

const addKeyboardNavigation = require('./accessibility-improvements').addKeyboardNavigation;
const addAriaLabels = require('./accessibility-improvements').addAriaLabels;
const addScreenReaderAnnouncements = require('./accessibility-improvements').addScreenReaderAnnouncements;
const addFocusTrap = require('./accessibility-improvements').addFocusTrap;
const improveAccessibility = require('./accessibility-improvements').improveAccessibility;

// Accessibility functions
function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
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

function isValidLandmark(landmark) {
  return landmark && landmark.name;
}

function validateLandmarkObject(landmark) {
  const errors = [];

  // Validation logic

  return {
    valid: errors.length === 0,
    errors
  };
}

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
  addSvgAccessibilityProps,
  getSvgAccessibilityProps,
  getAccessibleLinkProps,
  checkLinkAccessibility,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  isValidLandmark,
  validateLandmarkObject,
  validateLandmark,
  ensureUniqueLandmarksFromString
};