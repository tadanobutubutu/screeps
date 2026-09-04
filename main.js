import './styles.css';
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import App from './App';
import './styles.css';
import './styles.less';
import { registerSW } from 'effector-sw';

const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const logger = require('./utils/logger');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks
} = require('./utils');
const { calculateSum, getFullLangAttribute } = require('./utils');
const { validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure } = require('./utils/accessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const {
  getSvgAccessibleName,
  setSvgAttributes,
  validateSvgAccessibility
} = require('./utils/svgAccessibilityUtils');
const { isSecureContext } = require('./utils/constants');

registerSW();
import { initializeApp } from './app.js';
import accessiblyHelper from './accessibly-helper';
import { calculateSum } from './utils/index.js';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils.js';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils.js';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils.js';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils.js';
import { validateLinkAccessibility, handleFakeLinks, checkLinkAccessibility } from './utils/linkAccessibilityUtils.js';
import { CONFIG } from './utils/constants.js';

const books = [];
const safetyCategory = "User Safety: safe";

const MERGED_CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search', 'region', 'application'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data',
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  apiUrl: (typeof process !== 'undefined' && process.env && process.env.API_URL) || 'http://localhost:3000',
  timeout: (typeof process !== 'undefined' && process.env && process.env.TIMEOUT) || 5000,
  apiKey: (typeof process !== 'undefined' && process.env && process.env.API_KEY) || 'default-key'
};

const config = CONFIG;

const appData = {
  title: 'Frontend Application',
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: {}
};

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

let userSafety = 'unsafe';
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

let dependencyGraph = {};
let landmarks = [];
let icons = {};

const CONFIG_LOCAL = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: (typeof process !== 'undefined' && process.env && process.env.API_URL) || 'http://localhost:3000',
  timeout: (typeof process !== 'undefined' && process.env && process.env.TIMEOUT) || 5000,
  apiKey: (typeof process !== 'undefined' && process.env && process.env.API_KEY) || 'default-key',
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search', 'region', 'application'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  requiredLandmarks: ['banner', 'navigation', 'main']
};

const app = express();

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
  return landmarks || [];
}

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

function fixAccessibilityIssues() {
  // Code to fix accessibility issues as per the insight report
}

function getUniqueLandmarks(landmarks) {
  // ... Rest of the getUniqueLandmarks function implementation
}

function getSvgAccessibleName(svgElement) {
  // ... Rest of the getSvgAccessibleName function implementation
}

function validateTableAccessibility(tableElement) {
  // ... Rest of the validateTableAccessibility function implementation
}

async function scanAccessibility() {
  // ... Rest of the scanAccessibility function implementation
}

function validateLinkAccessibility() {
  // ... Rest of the validateLinkAccessibility function implementation
}

function handleFakeLinks() {
  // ... Rest of the handleFakeLinks function implementation
}

function validateLandmark() {
  // ... Rest of the validateLandmark function implementation
}

function validateLandmarkStructure() {
  // ... Rest of the validateLandmarkStructure function implementation
}

async function accessiblyHelper(...args) {
  validateLinkAccessibility();
  handleFakeLinks();
  return args;
}

function createAccessibleInput(type, id, labelText, value = '') {
  const container = document.createElement('div');
  container.className = 'form-group';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText;

  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('id', id);
  input.setAttribute('name', id);
  input.setAttribute('aria-required', 'true');
  input.setAttribute('aria-label', labelText);
  input.value = value;

  container.appendChild(label);
  container.appendChild(input);
  return container;
}

function getUserSafetyAdvice(safetyRating) {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories.length > 0 ? safetyCategories[0] : 'Unknown';
}

function generateAccessibilityReport(issuesData) {
  let issues;

  if (!issuesData) {
    issues = [];
  } else {
    issues = Array.isArray(issuesData) ? issuesData : [issuesData];
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };

  return report;
}

function getLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  const lang = getLangAttribute();
  const region = document.documentElement.getAttribute('xml:lang');
  return region ? `${lang}-${region}` : lang;
}

function createInPageButton(targetId, label) {
  const button = document.createElement('button');
  button.textContent = label;
  button.id = targetId;
  button.setAttribute('role', 'button');
  button.ariaLabel = `Go to ${targetId}`;
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
    }
  });
  return button;
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

function createAccessibleLink(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

function addLangAttribute() {
  if (typeof document === 'undefined') return;
  const lang = getFullLangAttribute();
  document.documentElement.setAttribute('lang', lang);
  return lang;
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return;
  const primaryContent = document.querySelector('#content') ||
    document.querySelector('main') ||
    document.querySelector('[role="main"]') ||
    document.querySelector('.main-content');

  if (primaryContent && primaryContent.parentElement.tagName !== 'MAIN') {
    const mainElement = document.createElement('main');
    mainElement.innerHTML = primaryContent.innerHTML;
    primaryContent.parentElement.replaceChild(mainElement, primaryContent);
  }
}

async function initializeApp() {
  console.log('Initializing Screeps bot...');

  if (!appState.initialized) {
    appState.initialized = true;

    addLangAttribute();

    if (process.env.NODE_ENV === 'production') {
      registerSW();
    }

    const localAppData = {
      title: 'Screeps',
      version: config.version
    };

    if (isSecureContext) {
      wrapPrimaryContentInMain();
      fixFakeLinkIssues();
      ensureUniqueLandmarks();

      const landmarksData = loadLandmarks();
      const processed = processLandmarks(landmarksData);

      if (dependencyGraph && typeof dependencyGraph.hasAttribute === 'function') {
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
    }

    redirectToHome();
  }
}

function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

function replaceButtonIds() {
  const buttons = document.querySelectorAll('button[id^="book-title"]');
  buttons.forEach((button, index) => {
    button.id = `book-button-${index}`;
  });
}

function ensureDependencyGraphAria() {
  if (dependencyGraph && typeof dependencyGraph.hasAttribute === 'function') {
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
}

const rotations = [
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(90deg)' },
  { transform: 'rotate(180deg)' },
  { transform: 'rotate(270deg)' }
];

let currentRotation = 0;

function rotateBack() {
  const element = document.getElementById('dependencyGraph');
  if (element) {
    currentRotation = (currentRotation - 1 + rotations.length) % rotations.length;
    element.style.transform = rotations[currentRotation].transform;
  }
}

function createUnrotateButton() {
  const button = document.createElement('button');
  button.textContent = 'Unrotate View';
  button.addEventListener('click', rotateBack);
  return button;
}

function performUpgrade(harvestedData) {
  if (!harvestedData || !harvestedData.length) {
    return {
      success: false,
      message: 'No harvested data available for upgrade'
    };
  }

  const improvements = {
    efficiency: 0,
    capacity: 0,
    upgrades: []
  };

  for (const data of harvestedData) {
    if (data.type === 'energy') {
      improvements.efficiency += (data.amount || 0) * 0.1;
    }
    if (data.type === 'resource') {
      improvements.capacity += (data.amount || 0) * 0.05;
    }
    if (data.metadata && data.metadata.upgradeable) {
      improvements.upgrades.push({
        target: data.id,
        level: (data.metadata.level || 0) + 1
      });
    }
  }

  return {
    success: true,
    improvements: improvements,
    timestamp: Date.now()
  };
}

function applySystemUpgrades(harvestedData) {
  const upgradeResult = performUpgrade(harvestedData);

  if (upgradeResult.success) {
    console.log(`System upgraded: Efficiency +${upgradeResult.improvements.efficiency.toFixed(2)}`);
    console.log(`Capacity increased by ${upgradeResult.improvements.capacity.toFixed(2)}`);
  }

  return upgradeResult;
}

function redirectToHome() {
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      if (typeof window !== 'undefined') {
        location.href = link.getAttribute('href');
      }
    });
  });
}

function handleUserInteraction(event) {
  console.log('User interaction:', event.type);
}

function cleanup() {
  landmarks = [];
  icons = {};
}

function initApp() {
  initializeApp();
  wrapPrimaryContentInMain();
}

function processData(data) {
  return data;
}

function fetchUser(userId) {
  // Fetch user data...
}

function clearCache() {
  // Clear cache...
}

function validateInput(input) {
  // Validate input...
}

function main() {
  initialize();
  console.log('Main function executed');
}

function VisualizeDependencyTree(data) {
  const visualizationData = data || dependencyGraph;
  console.log('Visualizing dependency tree:', visualizationData);
}

function generateKey(book) {
  return book.id || book.title || String(Math.random());
}

function BookItem(book) {
  return {
    key: generateKey(book),
    title: book.title,
    author: book.author,
    metadata: book
  };
}

export function addBook(book) {
  dispatch({ type: 'ADD_BOOK', payload: book });
}

function addLandmarkRolesAndFixIssues() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.hasAttribute('role')) {
      section.setAttribute('role', 'region');
    }
  });
}

function ensureLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', getLangAttribute());
  }
}

function fixLandmarks() {
  const root = document.documentElement;
  root.querySelectorAll('[role="header"], [role="footer"], [role="navigation"], [role="main"], [role="complementary"]').forEach(element => {
    if (!element.id) {
      element.id = element.getAttribute('aria-labelledby') || element.getAttribute('aria-label');
    }
    if (!element.hasAttribute('aria-hidden') && element.tagName === 'A' && element.innerText.trim().length === 0 && !element.hasAttribute('href')) {
      element.setAttribute('aria-hidden', true);
    }
  });
}

export {
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  initialize,
  initializeApp,
  processData,
  fetchUser,
  clearCache,
  validateInput,
  wrapPrimaryContentInMain,
  handleUserInteraction,
  cleanup,
  initApp,
  VisualizeDependencyTree,
  landmarks,
  appData,
  icons,
  countDependencies,
  addBook,
  BookItem,
  fixFakeLinks,
  replaceButtonIds,
  ensureDependencyGraphAria,
  rotateBack,
  createUnrotateButton,
  validateLandmarkData,
  getFullLangAttribute,
  calculateSum,
  createAccessibleLink,
  addLangAttribute,
  performUpgrade,
  applySystemUpgrades,
  isSecureContext,
  generateDependencyReport,
  fixAccessibilityIssues,
  accessiblyHelper,
  createAccessibleInput,
  getUserSafetyAdvice,
  generateAccessibilityReport,
  appState,
  generateDependencyReport as generateDependency,
  main as mainFunction,
  addLandmarkRolesAndFixIssues,
  ensureLangAttribute,
  fixLandmarks,
  UserSafety,
  SafetyCategories,
  books,
  safetyCategory,
  dependencyGraph,
  config
};

export { initializeApp, accessiblyHelper };

module.exports = {
  initApp,
  initializeApp,
  accessiblyHelper,
  addBook,
  BookItem,
  loadLandmarks,
  processLandmarks,
  generateDependencyReport,
  appState,
  CONFIG,
  config,
  books,
  safetyCategory,
  isSecureContext,
  fixAccessibilityIssues,
  createAccessibleInput,
  getUserSafetyAdvice,
  generateAccessibilityReport,
  handleUserInteraction,
  cleanup,
  initApp,
  processData,
  fetchUser,
  clearCache,
  validateInput,
  main,
  VisualizeDependencyTree,
  generateKey,
  countDependencies,
  addLandmarkRolesAndFixIssues,
  ensureLangAttribute,
  fixLandmarks
};