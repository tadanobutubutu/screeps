const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks
} = require('./utils');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function processLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = document.querySelectorAll('[role="region"], [role="navigation"], main, aside');
    const landmarkIds = elements.map(el => el.id || null);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}`;
      }
    });
    return elements;
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }

    const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent;
  }

  return svgElement.getAttribute('aria-label') || '';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td');

  for (const cell of cells) {
    if (!cell.id && headers.length === 0) {
      return false;
    }
  }

  return true;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    for (const cell of cells) {
      if (cell.tagName === 'th') {
        hasHeader = true;
        if (!cell.scope) {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-link], .fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.href) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="region"]');

  for (const landmark of landmarks) {
    if (!landmark.id && landmark.textContent.length > 0 && !landmark.classList.contains('accessible')) {
      return false;
    }
  }

  return true;
}

function initialize() {
  console.log('Initializing application...');

  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;

    const appData = {
      title: 'Screeps',
      version: CONFIG.version
    };

    addLangAttribute();
    wrapPrimaryContentInMain();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinkIssues();
    ensureUniqueLandmarks();

    // Load landmarks for accessibility processing
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    // Ensure the dependencyGraph container has a proper ARIA role
    if (dependencyGraph) {
      if (!dependencyGraph.id) {
        dependencyGraph.id = 'dependencyGraph';
      }
      if (!dependencyGraph.getAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
      if (!dependencyGraph.getAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
      }
    }
  }
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(l => l && l.id);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(`${landmark.id || ''}${landmark.name || ''}`)) {
      return false;
    }
    seen.add(`${landmark.id || ''}${landmark.name || ''}`);
    return true;
  });
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function validateLandmarkData(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function setSvgAttributes(svgElement, label, labelledById) {
  if (!svgElement) return;

  const props = getSvgProps(label, labelledById);

  Object.keys(props).forEach(prop => {
    svgElement.setAttribute(prop, props[prop]);
  });
}

function getSvgProps(label, labelledById) {
  const props = {};
  if (label) {
    props['aria-label'] = label;
  }
  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }
  return props;
}

function createAccessibleLink(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function createInPageButton(buttonText, onClickHandler) {
  return {
    button: {
      onClick: onClickHandler,
      lang: getLangAttribute(),
      text: buttonText
    }
  };
}

function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('#content') ||
                        document.querySelector('article') ||
                        document.querySelector('.main-content') ||
                        document.querySelector('.content');

  if (primaryContent && primaryContent.tagName !== 'MAIN') {
    const mainElement = document.createElement('main');
    mainElement.innerHTML = primaryContent.innerHTML;
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
    return mainElement;
  }
  return null;
}

function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = getLangAttribute();
    }
  }
}

async function renderFunction1() {
  await accessiblyHelper();

  function wrapPrimaryContentInMain() {
    if (typeof document !== 'undefined') {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = '<main id="main-content"></main>';
      return wrapper.firstChild;
    }
    return null;
  }
}

module.exports = {
  appState,
  CONFIG,
  initialize,
  loadLandmarks,
  processLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElement,
  validateLandmarkData,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  scanAccessibility,
  validateLinkAccessibility,
  handleFakeLinks,
  getSvgAccessibleName,
  setSvgAttributes,
  getSvgProps,
  createAccessibleLink,
  getLangAttribute,
  createInPageButton,
  wrapPrimaryContentInMain,
  addLangAttribute
};