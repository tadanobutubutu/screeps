const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const { validateLandmark, generateUniqueId, ensureUniqueIds, setDependencyGraphRole, countDependencies, checkLandmarkElements, sampleInsightReport, ensureElementHasId, addAriaLabel, renderDependencyGraph, getLangAttribute, validateTableAccessibility, validateTableStructure, validateLandmarkElement, validateLandmarkStructure, getSvgAccessibleName, addSvgAccessibleName, ensureUniqueLandmarks, personName, createInPageButton, newFunction, setARIARoleForDependencyGraph, AddressabilityIssues, fixMainLandmarkIssues, fixSemanticMarkup, validateLandmarkElementAddressability, addLangAttribute, generateAccessibilityReport, handleFakeLinks, handleCredentialResponse, addBook, addressAccessibilityIssues, initializeAccessibility } = require('./addressability');
const { createServer, startApp, config } = require('./');
const port = PORT || 3000;

// Merged functions from both versions
function ensureElementHasId(element, prefix = 'elem') {
  if (!element) return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element) throw new Error('Element is required');
  if (!label) throw new Error('aria-label value is required');
  element.setAttribute('aria-label', label);
  return element;
}

function addSvgAccessibilityProps() {
  if (typeof document === 'undefined') return;
  
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
    setSvgAttributes(svg);
  });
}

function countDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

function renderDependencyGraph(dependencies, container) {
  if (!container || !dependencies) return;
  
  const deps = Array.isArray(dependencies) ? dependencies : Object.entries(dependencies).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map(dep => ({ name: dep, type: key }));
    }
    return [{ name: key, type: 'other' }];
  });

  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  graphContainer.setAttribute('role', 'figure');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');

  const title = document.createElement('h3');
  title.textContent = 'Dependency Graph';
  graphContainer.appendChild(title);

  const list = document.createElement('ul');
  deps.forEach(dep => {
    const item = document.createElement('li');
    item.textContent = `${dep.name} (${dep.type})`;
    list.appendChild(item);
  });

  graphContainer.appendChild(list);
  container.appendChild(graphContainer);
}

function handleCredentialResponse(response) {
  if (!response) {
    return { success: false, error: 'No credential response provided' };
  }

  const hasCredential = response.credential || response.token || response.id;
  if (!hasCredential) {
    return { success: false, error: 'Invalid credential response format' };
  }

  const processedCredential = {
    id: response.id || null,
    token: response.token || response.credential || null,
    name: response.name || 'Anonymous User',
    email: response.email || null,
    success: true
  };

  if (response.credential) {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      processedCredential.id = payload.sub || processedCredential.id;
      processedCredential.email = payload.email || processedCredential.email;
      processedCredential.name = payload.name || processedCredential.name;
    } catch (error) {
      console.warn('Failed to parse credential response:', error);
    }
  }

  if (typeof announceToScreenReader === 'function') {
    announceToScreenReader('User successfully authenticated');
  }

  return processedCredential;
}

function checkLandmarkElements() {
  if (typeof document === 'undefined') return false;
  const landmarks = document.querySelectorAll('main, header, footer, nav, aside, section[aria-labelledby]');
  return landmarks.length > 0;
}

function createSampleInsightReport() {
  return {
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
}

function fetchAccessibilityReport() {
  return [];
}

function fixAccessibilityIssues() {
  // Fix accessibility issues in the current DOM structure
}

function updateAccessibleElements() {
  if (typeof document === 'undefined') return;
  const elementsToUpdate = document.querySelectorAll('[data-accessible]');
  elementsToUpdate.forEach((element) => {
    element.setAttribute('role', 'button');
    element.setAttribute('aria-pressed', 'false');
  });
}

function updateLatestAccessibilityPolicy() {
  // Fetch and save the latest accessibility policy
}

class AccessibilityIssue {
  constructor(id, name, description, results = [], resolved = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.results = results;
    this.resolved = resolved;
  }
}

class FakeLinkIssue extends AccessibilityIssue {
  constructor(link) {
    super('FK-001', 'Fake Link', 'A fake link was found.', [], false);
    this.link = link;
  }

  resolve() {
    this.results = ['Link replaced with a valid anchor tag'];
    this.resolved = true;
  }
}

function implementAccessibilitySolutions() {
  if (typeof document === 'undefined') return;
  const issues = fetchAccessibilityReport();
  issues.forEach(issue => {
    if (issue instanceof FakeLinkIssue) {
      issue.resolve();
      fixFakeLinkIssue(issue.link);
    }
  });
  updateLatestAccessibilityPolicy();
}

function fixFakeLinkIssue(link) {
  if (link && link.parentNode) {
    const anchor = document.createElement('a');
    anchor.href = link.getAttribute('data-href') || '#';
    anchor.textContent = link.textContent;
    anchor.className = link.className;
    link.parentNode.replaceChild(anchor, link);
  }
}

function setupKeyboardNavigation() {
  // Existing keyboard navigation setup
}

function setupAriaLiveRegions() {
  if (typeof document === 'undefined') return;
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
  if (typeof document === 'undefined') return;
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
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
  if (typeof document === 'undefined') return;
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });

  ensureUniqueLandmarks();
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  const landmarks = ['main', 'header', 'footer'];
  const existingLandmarks = {};
  
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main) => {
    if (existingLandmarks[main.id]) {
      throw new Error('Duplicate main element found!');
    }
    existingLandmarks[main.id] = true;
  });

  const headerElements = document.querySelectorAll('header');
  headerElements.forEach((header) => {
    if (existingLandmarks[header.id]) {
      header.setAttribute('role', 'complementary');
    }
    existingLandmarks[header.id] = true;
  });

  const footerElements = document.querySelectorAll('footer');
  footerElements.forEach((footer) => {
    if (existingLandmarks[footer.id]) {
      footer.setAttribute('role', 'contentinfo');
    }
    existingLandmarks[footer.id] = true;
  });
}

function trapFocus(event) {
  // Focus trap implementation
}

function init() {
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
  checkLandmarkElements();
  implementAccessibilitySolutions();
  updateAccessibleElements();
}

// Server creation (from HEAD, enhanced with merged functions)
function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
  });
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    setDependencyGraphRole();
    ensureUniqueIds();
    setARIARoleForDependencyGraph();
    newFunction();
  });
  return server;
}

function startApp() {
  const server = createServer();
  return server;
}

// Browser initialization
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Module exports (merged from both versions)
module.exports = {
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  ensureElementHasId,
  ensureElementId: ensureElementHasId,
  addAriaLabel,
  addBook,
  makeAccessible,
  addAriaSupport,
  addProperLandmarkRegions,
  renderDependencyGraph,
  personName,
  createInPageButton,
  createServer,
  startApp,
  config,
  addressAccessibilityIssues,
  generateAccessibilityReport,
  calculateAccessibilityScore,
  ensureUniqueLandmarksFromString,
  spawnSomeCommand,
  spawnCommand,
  addLangAttribute,
  implementCountDependenciesInMain,
  countDependencies,
  countPackageDependencies,
  processSvgElements,
  addressNewAccessibilityIssues,
  implementAccessibilitySolutions,
  handleCredentialResponse,
  getStoredCredentials,
  handleAddLangAttribute,
  newFunctionality,
  enhanceKeyboardNavigation,
  transformMainToSection,
  logMessage,
  handleShutdown,
  main,
  setSvgAttributes,
  getAccessibleName,
  checkLandmarkElements,
  gracefulShutdown,
  sampleInsightReport,
  MyComponent,
  addSvgAccessibilityProps,
  checkTableStructure,
  createSampleInsightReport,
  fetchAccessibilityReport,
  fixAccessibilityIssues,
  updateAccessibleElements,
  updateLatestAccessibilityPolicy,
  AccessibilityIssue,
  FakeLinkIssue,
  fixFakeLinkIssue,
  setupKeyboardNavigation,
  setupAriaLiveRegions,
  setupFocusManagement,
  enhanceSemanticMarkup,
  ensureUniqueLandmarks,
  init,
  trapFocus
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}