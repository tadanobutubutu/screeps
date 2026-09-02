const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

import './styles.css';
import { someFunction } from './otherFile';

// Configuration - merged
const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000
};

// Alternative config style for backwards compatibility
const config = CONFIG;

// App state with accessibility updates
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en' // Added lang property
};

// Helper functions moved to a separate file
const { fixTableStructureIssues, fixTableHeaderCellScope, addMainLandmark, addSvgAccessibleNames, fixFakeLinks, ensureUniqueLandmarks, addLandmarkRoles, generateAccessibilityReport, addressAccessibilityIssues, renderDependencyGraphContent, createInPageButtons, fixUniqueLandmarks } = require('./accessibility-improvements');

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// ... (Existing code, exports, and functions)

// Improve accessibility
async function improveAccessibility() {
  await fixTableStructureIssues();
  fixTableHeaderCellScope();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinks();
  ensureUniqueLandmarks();
  addLandmarkRoles();
  setLanguageAttribute();
  fixTableAccessibility();
  fixLandmarkIssues();
  addSvgAccessibility();
  createAccessibleLinks();
}

function generateAccessibilityReport(options = {}) {
  const report = scanAccessibility();
  writeReport(report);
  return report;
}

function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

function scanAccessibility() {
  const document = window.document;
  const results = axe.scan(document);

  return {
    timestamp: new Date().toISOString(),
    issues: results.violations
  };
}

// Yields the HTML element with the provided ARIA role
function getElementByRole(role) {
  return document.querySelector(`[role="${role}"]`);
}

// Creates a new in-page button with the given ID and label
function createInPageButton(id, label) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = label;
  button.setAttribute('tabindex', '0');

  button.addEventListener('click', (event) => {
    event.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.focus();
    }
  });

  return button;
}

// Validates the provided link accessibility and returns an object with any issues found
function validateLinkAccessibility(link) {
  const linkId = link.getAttribute('id');
  const linkText = link.textContent.trim();

  let valid = true;
  const issues = [];

  if (!linkId || linkId.length === 0) {
    issues.push({
      message: 'Link missing ID.',
      nodes: [link]
    });
    valid = false;
  }

  if (linkText.length === 0) {
    issues.push({
      message: 'Link text is empty.',
      nodes: [link]
    });
    valid = false;
  }

  return { valid, issues };
}

// Validates the provided table accessibility and returns an object with any issues found
function validateTableAccessibility(table) {
  const tableId = table.getAttribute('id');
  const tableHeaders = table.querySelectorAll('th, td');
  const tableBody = table.querySelector('tbody');
  let valid = true;
  const issues = [];

  if (!tableId || tableId.length === 0) {
    issues.push({
      message: 'Table missing ID.',
      nodes: [table]
    });
    valid = false;
  }

  tableHeaders.forEach((header) => {
    if (!header.getAttribute('scope') && !header.getAttribute('id')) {
      issues.push({
        message: 'Header cell missing scope or ID.',
        nodes: [header]
      });
    }
  });

  if (tableBody && tableBody.firstChild && tableBody.firstChild.nodeName !== 'TR') {
    issues.push({
      message: 'First child of table body must be a table row (<tr>).',
      nodes: [tableBody.firstChild]
    });
    valid = false;
  }

  return { valid, issues };
}

// Validates the provided table structure and returns an object with any issues found
function validateTableStructure(table) {
  let valid = true;
  const issues = [];
  const tableRows = table.querySelectorAll('tr');
  const tableHead = table.querySelector('thead');
  const tableBody = table.querySelector('tbody');

  if (!tableHead || !tableBody) {
    issues.push({
      message: 'Table must have a thead and tbody.'
    });
    valid = false;
  }

  if (tableRows.length === 0) {
    issues.push({
      message: 'Table has no rows.'
    });
    valid = false;
  }

  if (tableHead.rows.length === 0 && tableBody.rows.length === 0) {
    issues.push({
      message: 'Table has no rows in both thead and tbody.'
    });
    valid = false;
  }

  return { valid, issues };
}

// ... (Added functions for REACT_017 and new REACT_025)

if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    console.log('First landmark:', sorted[0]);
  }

  improveAccessibility();
  const report = generateAccessibilityReport();
  console.log(report);
}