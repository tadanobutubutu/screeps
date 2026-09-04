// main.js - Screeps bot main loop with accessibility utilities

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

// Config and state - merged from both branches
const appConfig = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3020',
  timeout: 5000
};

// Screeps CONFIG
const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxResults: 100,
  dataPath: './data',
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

const accessiblyHelper = async (...args) => {
  return args;
};

const helper = (input) => input ? input.toUpperCase() : '';
const formatDate = (date) => (date instanceof Date ? date.toISOString().split('T')[0] : null);
const validateInput = (input) => {
  if (typeof input !== 'string') return false;
  return input.trim().length > 0;
};

const processData = utils.processors.processData;

// Accessibility helper functions from HEAD branch
function ensureElementHasId(element, id) {
  if (!element) return element;
  if (!element.hasAttribute('id')) {
    element.setAttribute('id', id || generateId());
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!element) return element;
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

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

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

// Landmark processing functions from origin/main
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

function processLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
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

function getLandmarkById(landmarks, id) {
  if (!Array.isArray(landmarks)) return null;
  return landmarks.find(landmark => landmark.id === id) || null;
}

function ensureUniqueLandmarksList(landmarks) {
  return ensureUniqueLandmarks(landmarks);
}

function isValidLandmark(landmark) {
  return landmark &&
         landmark.id !== undefined &&
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

// Link accessibility functions
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
  if (typeof a11y !== 'undefined' && a11y.getLanguageAttribute) {
    return a11y.getLanguageAttribute();
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || document.documentElement.getAttribute('lang');
  }
  return appState.lang || 'en';
}

function getSvgAccessibleName(svg) {
  return svg && svg.title ? svg.title : 'Accessible SVG';
}

function setSvgAttributes(svg, attrs) {
  if (!svg || !attrs) return;
  Object.entries(attrs).forEach(([key, value]) => {
    svg.setAttribute(key, value);
  });
}

async function validateTableAccessibility() {
  if (typeof a11y !== 'undefined' && a11y.run) {
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
  // Implementation for table structure validation
  return { valid: true, errors: [] };
}

function handleFakeLinks() {
  if (typeof document === 'undefined') return;
  const fakeLinks = document.querySelectorAll('a:not([href]), a:not([role])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#');
    }
  });
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
  if (typeof document === 'undefined') return null;
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

function getSvgAccessibleNameEl(svg) {
  return getSvgAccessibleName(svg);
}

function ensureUniqueLandmarksFn(landmarks) {
  return ensureUniqueLandmarks(landmarks);
}

async function processAccessibilityReport(issuesData) {
  return issuesData || [];
}

// Memory monitoring from HEAD
function someNewFunction() {
  const maxMemoryUsage = CONFIG.maxMemory ? CONFIG.maxMemory : 1024 * 1024;

  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    if (memUsage > maxMemoryUsage) {
      console.warn('High memory usage detected:', memUsage.toFixed(2), 'MB');
      return true;
    }
  }
  return false;
}

function clearCache() {
  appState.cache.clear();
}

// Initialize function
function initialize() {
  if (appState.initialized) return appState;
  appState.initialized = true;
  return appState;
}

function initializeApp() {
  initialize();
  return appState;
}

async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// Export all functions
module.exports = {
  CONFIG,
  appState,
  appConfig,
  accessiblyHelper,
  processAccessibilityReport,
  loadLandmarks,
  processLandmarks,
  isValidLandmark,
  validateLandmark,
  validateLandmarkObject,
  validateInput,
  processData,
  getLangAttribute,
  getSvgAccessibleName,
  setSvgAttributes,
  validateTableAccessibility,
  validateTableStructure,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  createAccessibleLinks,
  getLangAttributeEl,
  addLangAttributeEl,
  createInPageButtonEl,
  validateLandmarkElCheck,
  getSvgAccessibleNameEl,
  ensureUniqueLandmarksFn,
  ensureUniqueLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarksList,
  initialize,
  initializeApp,
  checkLinkAccessibility,
  fetchUser,
  clearCache,
  someNewFunction,
  helper,
  formatDate,
  validateInput
};

// Screeps main game loop
module.exports.loop = function () {
  // Clean up memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Spawn creeps if needed
  const harvesterCount = _.filter(Game.creeps, c => c.memory.role === 'harvester').length;
  if (harvesterCount < 2 && Game.spawns['Spawn1'] && Game.spawns['Spawn1'].spawning === null) {
    const newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester' }
    });
  }

  // Run creep logic
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      runHarvester(creep);
    }
  }
};

function runHarvester(creep) {
  if (creep.store.getFreeCapacity() > 0) {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length > 0) {
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  } else {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}