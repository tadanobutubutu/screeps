const landmarkSelectors = [
  'main',
  '[role="main"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="search"]',
  'nav',
  '[role="region"]',
  'aside'
];

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  externalFixFakeLinks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues,
  scanAccessibility
} = utils;

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: 5000
};

let config = CONFIG;
let isInitialized = false;
let appData_origin = {};
let appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let dependencyGraph = null;

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  const headers = tableElement.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;
  const rows = tableElement.querySelectorAll('tr');
  return rows.length > 0;
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('main, [role="main"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let validLinks = 0;
  links.forEach(link => {
    if (link.textContent.trim() || link.getAttribute('aria-label')) {
      validLinks++;
    }
  });
  return validLinks === links.length;
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

function personName() {
  const names = document.querySelectorAll('[class*="name"]');
  names.forEach(name => {
    if (!name.textContent.trim()) {
      name.setAttribute('aria-hidden', 'true');
    }
  });
}

function handleFakeLinks() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    link.setAttribute('role', 'button');
  });
}

function addressAccessibilityIssues() {
  validateLandmarkStructure();
  validateTableStructure(document.querySelector('table'));
  handleFakeLinks();
}

async function scanAccessibility() {
  const results = await axe.run();
  return results;
}

function renderDependencyGraph(container) {
  if (!container) return;
  if (container.querySelector('[role="tree"]')) {
    container.setAttribute('role', 'tree');
  }
  if (container.querySelector('[aria-label="Dependency graph"]')) {
    const heading = document.createElement('h2');
    heading.textContent = 'Dependency graph';
    container.insertBefore(heading, container.firstChild);
  }
}

async function renderFunction1() {
  const moduleAReturnValue = await accessiblyHelper();

  function renderDependencyGraph(container) {
    if (!container) return;
    if (container.querySelector('[role="tree"]')) {
      container.setAttribute('role', 'tree');
    }
    if (container.querySelector('[aria-label="Dependency graph"]')) {
      const heading = document.createElement('h2');
      heading.textContent = 'Dependency graph';
      container.insertBefore(heading, container.firstChild);
    }
  }

  const appData = {
    title: 'Screeps',
    version: '1.0.0'
  };
}

async function renderFunction2() {
  const moduleBReturnValue = await accessiblyHelper();
}

async function harvest() {
  return [];
}

async function upgrade(harvestedData) {
  return harvestedData;
}

async function harvestAndUpgrade() {
  const harvested = await harvest();
  return await upgrade(harvested);
}

function addLangAttribute() {
  document.documentElement.lang = 'en';
}

const validateLandmarkAttributes = (landmark) => {
  return landmark && landmark.id && landmark.name;
};

const addMainLandmark = () => {
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (main && !main.id) {
    main.id = 'main-content';
  }
};

const generateAccessibilityReport = (issuesData) => {
  return {
    timestamp: new Date().toISOString(),
    issues: issuesData || []
  };
};

const isValidLandmark = landmark => landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;

const loadLandmarks = () => {
  try {
    const filePath = path.join(config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
};

const processLandmarks = (landmarks) => {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
};

const ensureUniqueLandmarks = (landmarks) => {
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
};

const setLanguageAttribute = () => {
  document.documentElement.lang = 'en';
};

const addLandmarkRoles = () => {
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (selector === 'main') {
        el.setAttribute('role', 'main');
      }
    });
  });
};

const landmarkConfig = {
  main: 'main',
  banner: 'banner',
  contentInfo: 'contentinfo',
  search: 'search',
  navigation: 'navigation',
  region: 'region',
  aside: 'aside',
  header: 'header',
  footer: 'footer'
};

exports.landmarkSelectors = landmarkSelectors;
exports.externalFixFakeLinks = externalFixFakeLinks;
exports.externalAddLandmarkRoles = externalAddLandmarkRoles;
exports.addressAccessibilityIssues = addressAccessibilityIssues;
exports.scanAccessibility = scanAccessibility;
exports.validateLandmarkStructure = validateLandmarkStructure;
exports.validateLandmarkAttributes = validateLandmarkAttributes;
exports.addMainLandmark = addMainLandmark;
exports.renderDependencyGraphContent = renderDependencyGraphContent;
exports.createInPageButtons = createInPageButtons;
exports.generateAccessibilityReport = generateAccessibilityReport;
exports.isValidLandmark = isValidLandmark;
exports.loadLandmarks = loadLandmarks;
exports.processLandmarks = processLandmarks;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.setLanguageAttribute = setLanguageAttribute;
exports.addLandmarkRoles = addLandmarkRoles;
exports.landmarkConfig = landmarkConfig;