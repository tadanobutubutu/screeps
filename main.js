const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Import accessibility utilities
const { 
  getLangAttribute, 
  getFullLangAttribute 
} = require('./utils/accessibilityUtils');

const { 
  validateTableAccessibility, 
  validateTableStructure, 
  fixTableStructure 
} = require('./utils/tableAccessibilityUtils');

const { 
  addMainLandmark, 
  validateLandmark, 
  validateLandmarkStructure, 
  validateLandmarkAttributes 
} = require('./utils/landmarkUtils');

const { 
  getSvgAccessibleName, 
  setSvgAttributes 
} = require('./utils/svgAccessibilityUtils');

const { 
  ensureUniqueLandmarks 
} = require('./utils/uniqueLandmarksUtils');

const { 
  createInPageButton 
} = require('./utils/inPageButtonUtils');

const { 
  validateLinkAccessibility, 
  handleFakeLinks 
} = require('./utils/linkAccessibilityUtils');

const { 
  calculateDependencyTree, 
  generateDependencyString 
} = require('./utils/dependencyTree');

const { CONFIG } = require('./utils/constants');
const { helper, formatDate } = require('./utils');
const { someFunction } = require('./utils/someFunction');
const { fetchUser, clearCache } = require('./utils/user');

// Screeps bot core modules
const { 
  countDependencies, 
  addBook, 
  BookItem, 
  defaultSorting, 
  onTitleSort, 
  onAuthorSort, 
  ensureDependencyGraphARIA, 
  Main, 
  validateLandmarkInput, 
  landmarkStructureCheck, 
  setLanguageAttribute, 
  addLandmarkRoles, 
  fixFakeLinks, 
  isSecureContext, 
  ensureFocusableElements, 
  validateSvgAccessibility, 
  processUniqueElements, 
  addressInsightIssues, 
  renderDependencyGraph, 
  renderIndexView, 
  calculateSum, 
  addProperLandmarkRegions, 
  createInPageButtons, 
  fixFakeLinkIssue, 
  addSvgAccessibleNames, 
  ensureUniqueLandmarksDoc, 
  effectorSW 
} = require('./bookFunctions');

// Accessibility helper functions
function addLangAttribute(element, lang = 'en') {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('lang', lang);
  } else if (typeof document !== 'undefined' && document.documentElement) {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
      html.setAttribute('lang', lang);
    }
  }
  return element;
}

function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

function renderDependencyGraphContent() {
  const container = typeof document !== 'undefined' ? document.getElementById('dependencyGraph') : null;
  if (!container) {
    return;
  }

  renderDependencyGraph(container);
  renderIndexView(container);
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return;
  
  const primaryContent = document.querySelector('.primary-content') ||
                         document.querySelector('[role="main"]') ||
                         document.getElementById('main-content') ||
                         document.querySelector('#content');
  
  if (primaryContent && !primaryContent.closest('main')) {
    const main = document.createElement('main');
    primaryContent.parentNode.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

function addressInsightIssues() {
  if (typeof document === 'undefined') return;
  
  getLangAttribute();
  addLangAttribute(document.documentElement);
  ensureUniqueLandmarksDoc();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  fixTableStructure();
}

function initializeApp() {
  addressInsightIssues();
  wrapPrimaryContentInMain();
  
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    registerSW();
  }
}

// AddressabilityIssues class for accessibility auditing
class AddressabilityIssues {
  constructor() {
    this.MISSING_ID = 'missing-id';
    this.MISSING_HEADING = 'missing-heading';
    this.EMPTY_CONTENT = 'empty-content';
    this.INACCESSIBLE_LINK_TEXT = 'inaccessible-link-text';
  }

  addressAccessibilityIssues(insightReport) {
    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    function checkSection(section, index) {
      if (!section.heading) {
        issues.push({
          type: this.MISSING_HEADING,
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: this.EMPTY_CONTENT,
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      if (
        section.content &&
        section.content.toLowerCase().includes('click here')
      ) {
        issues.push({
          type: this.INACCESSIBLE_LINK_TEXT,
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }

      if (isArray(section.sections)) {
        section.sections.forEach(checkSection);
      }
    }

    insightReport.sections.forEach(checkSection.bind(this));

    return issues;
  }
}

const validateLandmark = (landmark) => AddressabilityIssues.prototype.validateLandmark 
  ? AddressabilityIssues.prototype.validateLandmark(landmark) 
  : true;

const addSvgAccessibleName = function (svgElement, name) {
  if (!svgElement || !name) return svgElement;

  let title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  if (!title && typeof document !== 'undefined') {
    title = document.createElement('title');
    if (svgElement.insertBefore) {
      svgElement.insertBefore(title, svgElement.firstChild);
    }
  }
  if (title) {
    title.textContent = name;
  }

  const ariaLabelledBy = svgElement.getAttribute ? svgElement.getAttribute('aria-labelledby') : null;
  if (!ariaLabelledBy && !svgElement.getAttribute('aria-label')) {
    if (title) {
      title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      svgElement.setAttribute('aria-labelledby', title.id);
    }
  }

  return svgElement;
};

const ensureElementHasId = function (element) {
  if (!element) return;

  const name = element.getAttribute ? element.getAttribute('id') : null;
  if (!name) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
};

// Express server routes for Screeps bot dashboard
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/bot/status', (req, res) => {
  res.json({ 
    running: true, 
    cpu: process.cpuUsage(),
    memory: process.memoryUsage()
  });
});

// Serve static files for dashboard if exists
app.use(express.static(path.join(__dirname, 'public')));

// Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Screeps bot dashboard running on port ${PORT}`);
});

// Export for testing and modularity
module.exports = {
  app,
  server,
  initializeApp,
  addressInsightIssues,
  addLangAttribute,
  ensureLandmarkUniqueness,
  renderDependencyGraphContent,
  wrapPrimaryContentInMain,
  validateLandmark,
  addSvgAccessibleName,
  ensureElementHasId,
  AddressabilityIssues,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  calculateDependencyTree,
  generateDependencyString,
  CONFIG,
  helper,
  formatDate,
  someFunction,
  fetchUser,
  clearCache,
  countDependencies,
  addBook,
  BookItem,
  defaultSorting,
  onTitleSort,
  onAuthorSort,
  ensureDependencyGraphARIA,
  Main,
  validateLandmarkInput,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  ensureFocusableElements,
  validateSvgAccessibility,
  processUniqueElements,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  createInPageButtons,
  fixFakeLinkIssue,
  addSvgAccessibleNames,
  ensureUniqueLandmarksDoc,
  effectorSW
};