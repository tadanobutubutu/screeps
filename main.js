const express = require('express');
const fs = require('fs');
const axe = require('axe-core');
const accessiblyHelper = require('./accessibly-helper');
const fastMap = require('fast-map');
const path = require('path');
const { spawn } = require('child_process');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || '',
  timeout: 5000
};

// User Safety: unsafe
// Safety Categories: Other, Unauthorized Advice, Needs Caution
const { validateInput, processData, helper, formatDate } = require('./utils');
const { formatResponse } = require('./utils');
const { getSvgAccessibleName, setSvgAttributes } = require('./svg-utils');

// Export functions to improve accessibility
const { addressAccessibilityIssues, renderDependencyGraphContent } = require('./');

// Import helper functions
const { logCurrentURL, validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkStructure, validateLandmarkAttributes,
  getSvgAccessibleName, setSvgAttributes, isValidLandmark, loadLandmarks, processLandmarks, sortLandmarks, findLandmarkById, ensureUniqueLandmarks, writeReport, createAccessibleLinks } = require('./');

function getLangAttribute() {
    return navigator.language || navigator.userLanguage;
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = 'en';
  }
}

async function scanAccessibility() {
  const pagesDir = CONFIG.dataPath;
  const filePaths = await fs.promises.readdir(pagesDir);
  const issues = [];

  for (const filePath of filePaths) {
    const fullPath = path.join(pagesDir, filePath);
    try {
      const { violations } = await axe.analyze(fullPath);
      if (violations.length > 0) {
        issues.push({
          file: filePath,
          issues: violations,
        });
      }
    } catch (e) {
      console.error(`axe analysis failed for ${fullPath}`, e);
    }
  }

  return issues;
}

function validateTableAccessibility(table) {
  if (!table) return false;

  const issues = [];
  // Validate table attributes
  if (!table.hasAttribute('summary')) {
    issues.push('Missing summary attribute');
  }

  // Validate table header
  const thead = table.querySelector('thead');
  if (!thead || !thead.rows.length) {
    issues.push('Missing table header');
  }

  // Validate table rows and cells
  const tbody = table.querySelector('tbody');
  const trs = tbody.rows;
  if (!trs.length) {
    issues.push('Missing table body or no rows');
  }

  if (issues.length) {
    console.warn(`Table accessibility issues found: ${issues.join(', ')}`);
    return false;
  }
  return true;
}

function validateTableStructure(table) {
  // Implementation to be added
}

function fixTableStructure(table) {
  if (!validateTableStructure(table)) {
    console.warn("Table doesn't meet the required structure, skipping fixes.");
    return;
  }

  // Add missing table attributes
  if (!table.hasAttribute('summary')) {
    table.setAttribute('summary', 'Table with accessibility issues');
  }

  // Add missing table header
  const theadNode = table.querySelector('thead');
  if (!theadNode) {
    const newThead = document.createElement('thead');
    table.insertBefore(newThead, table.children[0]);
  }

  // Add missing table rows
  const tbodyNode = table.querySelector('tbody');
  if (!tbodyNode) {
    const newTbody = document.createElement('tbody');
    table.insertBefore(newTbody, table.children[1]);
  }
}

function fixTableAccessibility(table) {
  if (table) {
    fixTableStructureTable(table);
    fixTableHeaderCellScope(table);
  }
}

function fixTableStructureTable(table) {
  if (!validateTableStructure(table)) {
    return;
  }

  // Add missing summary attribute
  if (!table.hasAttribute('summary')) {
    table.setAttribute('summary', 'Table with accessibility fixes applied');
  }

  // Ensure thead exists
  let thead = table.querySelector('thead');
  if (!thead) {
    const newThead = document.createElement('thead');
    table.insertBefore(newThead, table.children[0]);
  }

  // Ensure tbody exists
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    const newTbody = document.createElement('tbody');
    table.insertBefore(newTbody, thead.nextSibling);
  }
}

function fixTableHeaderCellScope(table) {
  const thead = table.querySelector('thead');
  if (!thead) return;

  const headerCells = thead.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });
}

function addMainLandmark() {
  // Implementation to be added
}

function validateLandmark(landmark) {
  // Replace with the current implementation when merging main branch
  // return isValidLandmark(landmark);

  if (!landmark || typeof landmark.id !== 'string' || landmark.id.trim().length === 0) {
    return { valid: false, issues: ['Landmark ID is required and non-empty'] };
  }

  return { valid: true, issues: [] };
}

function validateLandmarkStructure(landmark) {
  // Replace with the current implementation when merging main branch
  // return landmark && landmark.nodeName;

  return landmark && typeof landmark.id !== 'undefined';
}

function validateLandmarkAttributes(landmark) {
  // Replace with the current implementation when merging main branch

  return landmark && typeof landmark.id !== 'undefined';
}

function isValidLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
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

  const validLandmarks = landmarks.filter(landmark => isValidLandmark(landmark));
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks) {
  return landmarks.sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    return nameA.localeCompare(nameB);
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

function createAccessibleLinks() {
  createInPageButtons();
}

function fixFakeLinks() {
  // Implementation for fixing fake links
}

function addProperLandmarkRegions() {
  // Implementation for adding proper landmark regions
}

function fixLandmarkIssues() {
  // Implementation for fixing landmark issues
}

function addLandmarkRoles() {
  // Implementation for adding landmark roles
}

exports.addressAccessibilityIssues = addressAccessibilityIssues;
exports.renderDependencyGraphContent = renderDependencyGraphContent;