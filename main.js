const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const config = {
  port: PORT,
  env: process.env.NODE_ENV || 'development'
};

function processSvgElements() {
  if (typeof document !== 'undefined') {
    const svgElements = document.querySelectorAll('svg');
  }
}

function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
}

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
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

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
      element.setAttribute('lang', lang || 'en');
    } else {
      const html = typeof document !== 'undefined' ? document.documentElement : null;
      if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

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
    if (typeof document === 'undefined') return true;
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
    return true;
  },

  ensureLandmarkUniqueness(elements) {
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
};

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Map();
  const result = [];

  landmarks.forEach(landmark => {
    if (!landmark) return;

    // Ensure the landmark has an id
    if (!landmark.id) {
      landmark.id = `landmark-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Check for duplicate ids
    if (!seen.has(landmark.id)) {
      seen.set(landmark.id, 1);
      result.push(landmark);
    } else {
      // Make the id unique by appending a suffix
      let counter = seen.get(landmark.id);
      let uniqueId = `${landmark.id}-${counter}`;
      while (seen.has(uniqueId)) {
        counter++;
        uniqueId = `${landmark.id}-${counter}`;
      }
      landmark.id = uniqueId;
      seen.set(uniqueId, 1);
      result.push(landmark);
    }
  });

  return result;
}

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

function countDependencies() {
  return AddressabilityIssues.countDependencies();
}

function checkTableStructure(table) {
  if (!table) return { valid: true, error: null };

  const rows = table.querySelectorAll('tr');
  const cellCount = rows[0] ? rows[0].querySelectorAll('th, td').length : 0;

  rows.forEach((row, index) => {
    const rowCells = row.querySelectorAll('th, td');
    if (rowCells.length !== cellCount && index > 0) {
      row.setAttribute('role', 'row');
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        cell.setAttribute('role', cellIndex === 0 ? 'rowheader' : 'cell');
      });
    }
  });

  return { valid: true, error: null };
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
      if (typeof atob === 'function') {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        processedCredential.id = payload.sub || processedCredential.id;
        processedCredential.email = payload.email || processedCredential.email;
        processedCredential.name = payload.name || processedCredential.name;
      }
    } catch (error) {
      console.warn('Failed to parse credential response:', error);
    }
  }

  if (typeof announceToScreenReader === 'function') {
    announceToScreenReader('User successfully authenticated');
  }

  return processedCredential;
}

function init() {
  addLangAttribute();
  setupAriaLiveRegions();
  enhanceSemanticMarkup();
  setupFocusManagement();
  setupKeyboardNavigation();
  addressInsightIssues();
  enforceAccessibility();
}

function addressInsightIssues() {
  const landmarks = getLandmarkElements();
  ensureUniqueLandmarks(landmarks);
  validateTableAccessibility();
  checkTableStructure();

  getSvgAccessibleName();

  createInPageButton();
  createAccessibleLink();
  handleAccessibilityIssues();

  AddressabilityIssues.validateLandmark();
  AddressabilityIssues.validateLandmarkStructure();
}

function enforceAccessibility() {
  renderDependencyGraphs();
  fixButtonIdentifiers();
  fixFakeLinkIssues();
  ensureDependencyGraphAriaRole();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function setupKeyboardNavigation() {
  /* existing code */
}

function handleKeyNavigation(event) {
  if (event.key === 'Tab' && event.altKey) {
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      event.preventDefault();
    }
  }

  if (event.key === 'Escape') {
    closeOpenDialogs();
  }
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
  const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
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

function trapFocus(event) {
  if (event.key !== 'Tab') return;

  const container = event.currentTarget;
  const focusableElements = container.querySelectorAll(
    'button, a, input, select, textarea, [tabindex], [contenteditable]'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    lastElement.focus();
    event.preventDefault();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    firstElement.focus();
    event.preventDefault();
  }
}

function enhanceSemanticMarkup() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = '0';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  const images = document.querySelectorAll('img:not([alt])');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  const inputs = document.querySelectorAll('input:not([id]), select:not([id]), textarea:not([id])');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function closeOpenDialogs() {
  if (typeof document === 'undefined') return;
  const openDialogs = document.querySelectorAll('[aria-expanded="true"]');
  openDialogs.forEach((dialog) => {
    dialog.setAttribute('aria-expanded', 'false');
  });
}

function announceToScreenReader(message) {
  if (typeof document === 'undefined') return;
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  /* existing code */
}

function calculateProduct(a, b) {
  /* existing code */
}

function isNumber(value) {
  /* existing code */
}

function clamp(value, min, max) {
  /* existing code */
}

function createInPageButton(element, label) {
  if (!element) return null;

  if (element.tagName !== 'BUTTON' && !element.getAttribute('role')) {
    element.setAttribute('role', 'button');
    if (label) {
      element.setAttribute('aria-label', label);
    }
  }

  return element;
}

function createAccessibleLink(link, label) {
  if (!link) return null;

  if (link.tagName !== 'A') {
    link.setAttribute('role', 'link');
  }
  if (label) {
    link.setAttribute('aria-label', label);
  }

  return link;
}

function validateLinkAccessibility(options) {
  /* existing code */
}

function handleFakeLinks(issues) {
  if (!issues || !Array.isArray(issues)) {
    return;
  }

  issues.forEach(issue => {
    if (issue.type === 'fake') {
      const fakeLinks = document.querySelectorAll('a[href="#"]');
      fakeLinks.forEach(link => {
        console.warn(`Fake link detected: ${issue.message}`);
      });
    }
  });
}

function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    if (!link.textContent.trim() || link.textContent === 'click here') {
      link.setAttribute('aria-label', 'Navigation link');
    }
  });
}

function getLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang || 'en';
}

function addLangAttribute(element, lang) {
  if (element) {
    if (lang) {
      element.setAttribute('lang', lang);
    } else if (!element.hasAttribute('lang')) {
      element.setAttribute('lang', getLangAttribute());
    }
  } else {
    if (typeof document !== 'undefined' && document.documentElement) {
      if (!document.documentElement.hasAttribute('lang')) {
        document.documentElement.setAttribute('lang', getLangAttribute());
      }
    }
  }
}

function addressAccessibilityIssues(insightReport) {
  if (typeof document !== 'undefined') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', getLangAttribute());
    }
  }

  if (insightReport && AddressabilityIssues && AddressabilityIssues.addressAccessibilityIssues) {
    return AddressabilityIssues.addressAccessibilityIssues(insightReport);
  }

  return [];
}

function handleAccessibilityIssues() {
  return addressAccessibilityIssues(sampleInsightReport);
}

function generateAccessibilityReport() {
  return {
    timestamp: new Date().toISOString(),
    issues: []
  };
}

function calculateAccessibilityScore(fixedIssues) {
  return AddressabilityIssues.calculateAccessibilityScore(fixedIssues);
}

function validateLandmark(element) {
  return AddressabilityIssues.validateLandmark(element);
}

function validateLandmarkStructure(container) {
  if (!container) return true;

  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const landmarks = container.querySelectorAll('[role]');

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!allowedLandmarks.includes(role)) {
      landmark.removeAttribute('role');
    }
  });

  return true;
}

function spawnSomeCommand(command) {
  return AddressabilityIssues.spawnSomeCommand(command);
}

function addAriaLabel(element, label) {
  if (label) {
    element.setAttribute('aria-label', label);
  }
}

function setARIARoleForDependencyGraph() {
  if (typeof document === 'undefined') return;
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'grid');
  }
}

function ensureDependencyGraphAriaRole() {
  if (typeof document === 'undefined') return;
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph && !dependencyGraph.hasAttribute('role')) {
    dependencyGraph.setAttribute('role', 'grid');
  }
}

function renderDependencyGraph(graphData, container) {
  if (typeof document === 'undefined') return null;
  addAriaLabel(container, 'Dependency graph');
  const graph = document.createElement('div');
  graph.className = 'dependency-graph';
  graph.textContent = JSON.stringify(graphData, null, 2);
  container.appendChild(graph);
  return graph;
}

function renderDependencyGraphs() {
  if (typeof document === 'undefined') return;
  const containers = document.querySelectorAll('[data-graph-container]');
  containers.forEach(container => {
    renderDependencyGraph({}, container);
  });
}

function validateTableAccessibility(table) {
  if (!table) return true;

  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.textContent.trim()) {
      th.setAttribute('aria-label', 'Empty header');
    }
  });

  return true;
}

function validateTableStructure(table) {
  return checkTableStructure(table);
}

function validateLandmarkElement(element, landmarkType) {
  if (!element) return false;

  const existingLandmark = element.getAttribute('role');
  if (!existingLandmark) {
    element.setAttribute('role', landmarkType);
  }

  return true;
}

function getSvgAccessibleName(svgElement, name) {
  if (!svgElement) return name || '';

  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  const alt = svgElement.getAttribute('alt');
  if (alt) {
    return alt;
  }

  const dataName = svgElement.getAttribute('data-name');
  if (dataName) {
    return dataName;
  }

  return name || '';
}

function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return;

  const title = svgElement.querySelector('title');
  if (title) {
    title.textContent = name;
  } else {
    const newTitle = document.createElement('title');
    newTitle.textContent = name;
    svgElement.insertBefore(newTitle, svgElement.firstChild);
  }
}

function setSvgAttributes(svg) {
  if (typeof document === 'undefined') return;
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'true');
  }
}

function fixButtonIdentifiers() {
  if (typeof document === 'undefined') return;
  const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  buttons.forEach(button => {
    if (!button.textContent.trim() && !button.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Unlabeled button');
    }
  });
}

function getLandmarkElements() {
  if (typeof document === 'undefined') return [];
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  return Array.from(landmarks);
}

module.exports = {
  app,
  config,
  AddressabilityIssues,
  init,
  countDependencies,
  checkTableStructure,
  handleCredentialResponse,
  getSvgAccessibleName,
  setSvgAttributes,
  renderDependencyGraphs,
  fixFakeLinkIssues,
  fixButtonIdentifiers,
  setupAriaLiveRegions,
  setupFocusManagement,
  enhanceSemanticMarkup,
  getLandmarkElements,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateLandmark,
  validateLandmarkStructure,
  addressAccessibilityIssues,
  addLangAttribute,
  getLangAttribute,
  ensureUniqueLandmarks
};