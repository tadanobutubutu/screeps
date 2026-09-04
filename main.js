// main.js - Screeps bot main loop

const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');

const { calculateSum } = require('./utils');
const { getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { checkLinkAccessibility: importedCheckLinkAccessibility } = require('./utils/linkAccessibilityUtils');

const fastMap = require('fast-map');

const accessiblyHelper = async (...args) => {
  return args;
}

// Screeps CONFIG
const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data',
  apiUrl: process.env.API_URL || 'http://localhost:3020',
  timeout: 5000
};

// Existing books array for compatibility
const books = ['Book 1', 'Book 2'];

// App state with merged properties
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

const helper = (input) => input ? input.toUpperCase() : '';
const formatDate = (date) => (date instanceof Date ? date.toISOString().split('T')[0] : null);
const validateInput = (input) => {
  if (typeof input !== 'string') return false;
  return input.trim().length > 0;
};

const processData = utils.processors.processData;

// New function to initialize the app
function initializeApp() {
  initialize();
  return appState;
}

// New function to fetch the user
async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// New function needed for user book operations
function addBook(book) {
  const booksList = getBooksList();
  booksList.push(book);
}

function getBooksList() {
  return[];
}

function announceBookAdded(book) {
  console.log('Book added:', book);
}

// Ensure an element has an ID attribute
function ensureElementHasId(element, id) {
  if (!element) return element;
  if (!element.hasAttribute('id')) {
    element.setAttribute('id', id || generateId());
  }
  return element;
}

// Adds an aria-label to an element if it doesn't have one
function addAriaLabel(element, label) {
  if (!element) return element;
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Add proper landmark regions for accessibility
function addProperLandmarkRegions() {
  const regions = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];

  regions.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach(element => {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        const defaultLabels = {
          'banner': 'Site header',
          'navigation': 'Main navigation menu',
          'main': 'Main content area',
          'complementary': 'Complementary content or sidebar',
          'contentinfo': 'Additional or related content',
          'search': 'Search form'
        };
        element.setAttribute('aria-label', defaultLabels[role]);
      }
    });
  });
}

function getAccessibleLinkProps(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

// Load landmarks from file
function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

// Process landmarks array
function processLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }
  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
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
  if (a11y && a11y.getLanguageAttribute) {
    return a11y.getLanguageAttribute();
  }
  return document.documentElement.lang || document.documentElement.getAttribute('lang');
}

function getSvgAccessibleName(svg) {
  return svg && svg.title ? svg.title : 'Accessible SVG';
}

function setSvgAttributes() {
  // SVG attributes setting implementation
}

async function validateTableAccessibility() {
  if (a11y && a11y.run) {
    const issues = await a11y.run(document.body.innerHTML);
    const tableIssues = issues.filter((issue) => issue.rules.id === 'empty-table');
    return tableIssues.map((issue) => ({
      ...issue,
      message: `Table at position ${issue.locators[0].postion} is empty or its structure is incorrect`,
      severity: 'critical'
    }));
  }
  return [];
}

function validateTableStructure() {
  // ... Your implementation for REACT_027 table structure issues
}

function validateLandmark() {
  // ... Your implementation for REACT_017 landmark issues
}

function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  // Check if link has href and is not empty
  if (!link.href || link.href.trim() === '') {
    return false;
  }

  // Check if link has accessible name
  if (!link.textContent || link.textContent.trim() === '') {
    return false;
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href]), a:not([role])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#');
    }
  });
}

function isValidLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function createAccessibleLinks() {
  // Create accessible links implementation
}

function getLangAttributeEl(element) {
  if (!element) return null;
  return element.getAttribute('lang') || element.getAttribute('xml:lang');
}

function addLangAttributeEl(element, lang) {
  if (!element || !lang) return false;
  element.setAttribute('lang', lang);
  return true;
}

function createInPageButtonEl(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

function validateLandmarkElCheck(landmarkEl) {
  if (!landmarkEl || typeof landmarkEl !== 'object') {
    return { valid: false, errors: ['Invalid landmark element'] };
  }
  
  const errors = [];
  if (!landmarkEl.id) errors.push('Landmark must have an id');
  if (!landmarkEl.name) errors.push('Landmark should have a name');
  
  return { valid: errors.length === 0, errors };
}

function ensureUniqueLandmarksFn(landmarks) {
  if (!Array.isArray(landmarks)) return [];
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(landmark.id)) return false;
    seen.add(landmark.id);
    return true;
  });
}

async function processAccessibilityReport(issuesData) {
  return issuesData || [];
}

// Additional landmark validation
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

// New function to initialize the app
function initialize() {
  console.log('Initializing application...');
  return true;
}

// New function to initialize accessibility features
function initializeAccessibilityFeatures() {
  if (a11y && a11y.init) {
    a11y.init();
  }
}

// Helper function for memory check
function someNewFunction() {
  const localConfig = CONFIG || {};
  const maxMemoryUsage = localConfig.maxMemory ? localConfig.maxMemory : 1024 * 1024;

  if (process.memoryUsage().heapUsed / 1024 / 1024 > maxMemoryUsage) {
    console.warn('High memory usage detected');
    return true;
  }
  return false;
}

module.exports.loop = function () {
  // Clean up memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Spawn creeps if needed
  const harvesterCount = _.filter(Game.creeps, c => c.memory.role === 'harvester').length;
  if (harvesterCount < 2 && Game.spawns['Spawn1'].spawning === null) {
    const newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester' }
    });
  }

  // Assign roles to creeps
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester' && creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES);
      if (sources.length > 0) {
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }
    if (creep.memory.role === 'upgrader' && creep.store.getFreeCapacity() > 0) {
      if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};

module.exports = {
  CONFIG,
  appState,
  books,
  accessiblyHelper,
  initializeApp,
  fetchUser,
  addBook,
  announceBookAdded,
  getBooksList,
  calculateSum,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  fastMap,
  helper,
  formatDate,
  validateInput,
  processData,
  loadLandmarks,
  processLandmarks,
  ensureUniqueLandmarks,
  sortLandmarks,
  isValidLandmark,
  createAccessibleLinks,
  getLangAttributeEl,
  addLangAttributeEl,
  createInPageButtonEl,
  validateLandmarkElCheck,
  ensureUniqueLandmarksFn,
  validateLandmarkObject,
  initialize,
  initializeAccessibilityFeatures,
  someNewFunction,
  processAccessibilityReport,
  addProperLandmarkRegions,
  getAccessibleLinkProps,
  appConfig: {
    name: 'MyApp',
    version: '1.0.0',
    debug: false,
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
  },
  ensureElementHasId,
  addAriaLabel
};