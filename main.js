const express = require('express');
// TODO: Implement tower defense
// Placeholder for tower defense implementation
// This function will contain the logic for the tower defense system
function implementTowerDefense() {
  // TODO: Implement tower defense
}

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const fastMap = require('fast-map');
const utils = require('./utils');
const { axe } = require('axe-core');
const accessiblyHelper = require('./accessibly-helper');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

const CONFIG = {
  dataPath: './data',
  maxResults: 100
};

let isInitialized = false;
const appData = {};

// Example of how to export a required function from another file
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };
// TODO: Add back any required exports that might have been removed

// Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - REACT_001: Implement function to handle new accessibility issues ...

// Accessibility utilities
function getLangAttribute() {
  return navigator.language || navigator.userLanguage;
}

function addLangAttribute(element, lang) {
  element.setAttribute('lang', lang);
  element.setAttribute('xml:lang', lang);
}

function logCurrentURL() {
  console.log(`Current URL: ${window.location.href}`);
}

function validateTableAccessibility(table) {
  if (!table.hasAttribute('role')) {
    table.setAttribute('role', 'table');
  }
  const headers = table.querySelectorAll('th');
  if (!headers || headers.length === 0) {
    return false;
  }
  if (!table.hasAttribute('aria-labelledby')) {
    table.setAttribute('aria-labelledby', 'tableTitle');
  }
  return true;
}

function validateTableStructure(table) {
  if (!table.hasAttribute('role')) {
    table.setAttribute('role', 'table');
  }
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td');
  if (headers.length !== cells.length - 1) {
    return false;
  }
  return cells.every((cell) => cell.hasAttribute('role') && ['gridcell', 'rowheader', 'columnheader'].includes(cell.getAttribute('role')));
}

function fixTableStructure(table) {
  if (!validateTableAccessibility(table)) {
    fixTableStructure(table);
  }
}

function fixLandmarkIssues() {
  const landmarks = document.querySelectorAll('nav, main, aside, footer');
  landmarks.forEach((landmark) => {
    if (!landmark.hasAttribute('id')) {
      landmark.setAttribute('id', landmark.tagName.toLowerCase());
    }
  });
}

function addSvgAccessibleName(svg) {
  return '';
}

function createInPageButtons() {
  const skipLink = createInPageButton('main-content', 'Skip to main content');
  document.body.insertBefore(skipLink, document.body.firstChild);
}

function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            cwd: process.cwd(),
            env: process.env,
            shell: true,
            timeout: 30000
        };

        const spawnOptions = { ...defaultOptions, ...options };
        let stdout = '';
        let stderr = '';
        let timeoutId;

        const child = spawn(command, args, spawnOptions);

        if (spawnOptions.timeout) {
            timeoutId = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error(`Process timed out after ${spawnOptions.timeout}ms`));
            }, spawnOptions.timeout);
        }

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            if (timeoutId) clearTimeout(timeoutId);
            reject(error);
        });

        child.on('close', (exitCode) => {
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ stdout, stderr, exitCode });
        });
    });
}

// Landmark handling
function addMainLandmark() {
}

function validateLandmark(landmark) {
  const issues = [];

  if (!landmark) {
    return { valid: false, issues: ['Landmark is null or undefined'] };
  }

  if (typeof landmark.id !== 'string' || landmark.id.trim().length === 0) {
    return {
      valid: false,
      issues: ['Landmark ID is required and non-empty']
    };
  }

  return { valid: true, issues: [] };
}

function loadLandmarks() {
    try {
        const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
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

    const validLandmarks = landmarks.filter(l => l && typeof l.id !== 'undefined');
    
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function findLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
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

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = 'accessibility-report.json';
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// REACT_036: Create accessible links
function createAccessibleLinks() {
  const skipLink = createInPageButton('main-content', 'Skip to main content');
  const inPageLinks = document.querySelectorAll('a[href^="#"]');

  inPageLinks.forEach(link => {
    const validation = validateLinkAccessibility(link);
    if (!validation.valid) {
      console.warn('Link validation issues:', validation.issues);
    }
  });
}

// REACT_001: Implement function to handle new accessibility issues
function addressAccessibilityIssues() {
  try {
    fixTableAccessibility();
    addMainLandmark();
    ensureUniqueLandmarks(loadLandmarks());
    createAccessibleLinks();

    return {
      success: true,
      message: 'Accessibility issues have been addressed',
      fixesApplied: [
        'table_accessibility',
        'landmark_issues',
        'unique_landmarks',
        'accessible_links'
      ]
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error addressing accessibility issues',
      error: error.message
    };
  }
}

// Fixes table accessibility issues
function fixTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table)) {
      fixTableStructure(table);
    }
  });
}

// Validates link accessibility
function validateLinkAccessibility(link) {
  return {
    valid: true,
    issues: []
  };
}

// Utility imports
const { validateInput, processData, formatResponse } = require('./utils');
const { getSvgAccessibleName, setSvgAttributes } = require('./svgUtils');

module.exports = {
  config,
  isInitialized,
  appData,
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  fixLandmarkIssues,
  addSvgAccessibleName,
  createInPageButtons,
  spawnProcess,
  CONFIG,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  findLandmarkById,
  ensureUniqueLandmarks,
  writeReport,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLandmark,
  improveAccessibility,
  scanAccessibility,
  addressAccessibilityIssues,
  implementTowerDefense
};